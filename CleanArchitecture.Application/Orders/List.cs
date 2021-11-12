using AutoMapper;
using CleanArchitecture.Application.Activities;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;


namespace CleanArchitecture.Application.Orders
{
    public class List
    {
        public class OrdersEnvelope
        {
            public List<OrderDto> OrderList { get; set; }
            public int OrderCount { get; set; }

        }
        public class Query : IRequest<OrdersEnvelope>
        {

            public Query(int? limit, int? offset)
            {
                Limit = limit;
                Offset = offset;
               
            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
          
        }

        public class Handler : IRequestHandler<Query, OrdersEnvelope>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly IActivityReader _activityReader;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor, IActivityReader activityReader)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
                _activityReader = activityReader;
            }
            public async Task<OrdersEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (currentUser == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });

                var queryable = _context.Orders
                    .Where(x => x.UserId == currentUser.Id && x.OrderState != EnumOrderState.Deleted)
                    .OrderByDescending(x => x.OrderDate)
                    .AsQueryable();

                var orders = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 10).ToListAsync();


                var orderList = new List<OrderDto>();
                foreach (var item in orders)
                {
                    var activity = item.OrderItems.FirstOrDefault();
                    var trainer = activity.Activity.UserActivities.Where(x => x.IsHost == true).FirstOrDefault();
                    orderList.Add(new OrderDto()
                    {
                        Id = item.Id.ToString(),
                        AttendeeName = item.FirstName + " " + item.LastName,
                        Count = activity.Quantity,
                        Date = item.OrderDate,
                        Title = activity.Activity.Title,
                        OrderNo = item.OrderNumber.ToString(),
                        Photo = activity.Activity.Photos.Count > 0 ? activity.Activity.Photos.FirstOrDefault(x => x.IsMain).Url : "",
                        OrderStatus = item.OrderState.ToString(),
                        Price = activity.Price,
                        PaidPrice = item.PaidPrice,
                        ProductId = activity.Activity.Id.ToString(),
                        TrainerId = trainer.AppUser.UserName,
                        TrainerImage = trainer.AppUser.Photos.Count > 0 ? trainer.AppUser.Photos.FirstOrDefault(x => x.IsMain == true).Url : ""

                    }) ;
                }


                return new OrdersEnvelope
                {
                    OrderList = orderList,
                    OrderCount = queryable.Count()
                };

            }
        }

    }
}
