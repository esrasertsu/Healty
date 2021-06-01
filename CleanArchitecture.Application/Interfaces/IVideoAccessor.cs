using Microsoft.AspNetCore.Http;
using CleanArchitecture.Application.Videos;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Interfaces
{
    public interface IVideoAccessor
    {
        VideoUploadResult AddVideo(IFormFile file);
       // VideoUploadResult AddActivityVideo(IFormFile file);
        string DeleteVideo(string publicId);
    }
}
