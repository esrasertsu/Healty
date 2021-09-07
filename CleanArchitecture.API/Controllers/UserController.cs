using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Application.User;
using CleanArchitecture.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.API.Controllers
{
    public class UserController : BaseController
    {
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(Register.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet]
        public async Task<ActionResult<User>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }

        [HttpPut]
        public async Task<ActionResult<Unit>> Update(bool status)
        {
            UpdateStatus.Command command = new UpdateStatus.Command{ Status = status };
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpPost("registertrainer")]
        public async Task<ActionResult<Unit>> RegisterTrainer([FromForm] RegisterTrainer.Command command)
        {
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpPost("isUserNameAvailable")]
        public async Task<ActionResult<bool>> IsUserNameAvailable(string username, string email)
        {
            return await Mediator.Send(new IsUserNameAvailable.Query { UserName = username, Email = email });
        }
    }
}
