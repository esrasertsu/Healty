using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
                .NotEmpty()
                .MinimumLength(6).WithMessage("Şifre en az 6 karakter uzunluğunda olmalı.")
                .Matches("[a-z]").WithMessage("Şifre en az 1 küçük harf içermeli.")
                .Matches("[0-9]").WithMessage("Şifre en az 1 rakam içermeli.");
          
            return options;
        }
    }
}
