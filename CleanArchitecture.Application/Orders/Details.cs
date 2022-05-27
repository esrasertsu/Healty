using AutoMapper;
using CleanArchitecture.Application.Errors;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain;
using CleanArchitecture.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Application.Orders
{
    public class Details
    {
        public class Query : IRequest<OrderDto>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, OrderDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;


            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;

            }

            public async Task<OrderDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                if (currentUser == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "NotFound" });
               
                var order = await _context.Orders.SingleOrDefaultAsync(x => x.Id == request.Id);

                if (order == null || order.OrderItems.Count == 0)
                    throw new RestException(HttpStatusCode.NotFound, new { Order = "Not Found" });


                var orderItem = order.OrderItems.FirstOrDefault();
                var trainer = orderItem.Activity.UserActivities.Where(x => x.IsHost == true).FirstOrDefault();


                return new OrderDto()
                {
                    Id = order.Id.ToString(),
                    OrderItemId = orderItem.Id.ToString(),
                    AttendeeName = order.FirstName + " " + order.LastName,
                    BuyerName = order.BuyerName,
                    PaymentInfo = order.CardLastFourDigit,
                    CardType = order.PaymentType,
                    CardFamily = order.CardFamily,
                    Count = orderItem.Quantity,
                    Date = order.OrderDate,
                    CardLastFourDigit = order.CardLastFourDigit,
                    Description = orderItem.Activity.Description,
                    Title = orderItem.Activity.Title,
                    Email = order.Email,
                    PhoneNumber = order.Phone,
                    OrderNo = order.OrderNumber.ToString(),
                    Photo = orderItem.Activity.Photos.Count > 0 ? orderItem.Activity.Photos.FirstOrDefault(x => x.IsMain)?.Url : "",
                    OrderStatus = order.OrderState.ToString(),
                    Price = orderItem.Price,
                    PaidPrice = order.PaidPrice,
                    ProductId = orderItem.Activity.Id.ToString(),
                    TrainerId = trainer.AppUser.UserName,
                    TrainerImage = trainer.AppUser.Photos.Count > 0 ? trainer.AppUser.Photos.FirstOrDefault(x => x.IsMain == true)?.Url : "",
                    ActivityDate = orderItem.Activity.Date,
                    ActivityOnline = orderItem.Activity.Online,
                    ActivityLevel = orderItem.Activity.Levels.Count > 0 ? orderItem.Activity.Levels.Select(x => x.Level.Name).ToList() : new System.Collections.Generic.List<string>(),
                    ActivityCategories = orderItem.Activity.Categories.Count > 0 ? orderItem.Activity.Categories.Select(x => x.Category.Name).ToList() : new System.Collections.Generic.List<string>(),
                    CardAssociation = order.CardAssociation,
                    PaymentTransactionId = orderItem.PaymentTransactionId,
                    AdminPaymentApproved = orderItem.AdminPaymentApproved.ToString(),
                    AdminPaymentApprovedDate = orderItem.AdminPaymentApprovedDate,
                    ActivityStatus = orderItem.Activity.Status.ToString()

                };
            }
        }
    }
}
