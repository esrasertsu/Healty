using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Contracts
{
    public class ContractDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Code { get; set; }
        public string CreatedDate { get; set; }
        public string Content { get; set; }
        public string Date { get; set; }
        public bool Status { get; set; }
    }
}
