using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.Categories;
using CleanArchitecture.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.API.Controllers
{
    [AllowAnonymous]
    public class CategoryController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<CategoryDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("allcategories")]
        public async Task<ActionResult<List<CategoryListDto>>> ListAllCategories()
        {
            return await Mediator.Send(new ListAllCategories.Query());
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("{categoryId}/sub")]
        public async Task<ActionResult<List<SubCategoryDto>>> GetSubCategories(Guid categoryId)
        {
            return await Mediator.Send(new ListSubCategories.Query { CategoryId = categoryId });
        }

        [HttpPost("sub")]  
        public async Task<ActionResult<Unit>> CreateSubCategory(CreateSubCategory.Command command)
        {
            return await Mediator.Send(command);
        }
    }
}
