using CleanArchitecture.Application.Documents;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Interfaces
{
    public interface IDocumentAccessor
    {
        DocumentUploadResult AddDocument(IFormFile file);

    }
}
