﻿using CleanArchitecture.Application.Photos;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Application.Interfaces
{
    public interface IPhotoAccessor
    {
        PhotoUploadResult AddPhoto(IFormFile file);
        PhotoUploadResult AddBlogPhoto(IFormFile file);
        PhotoUploadResult AddUserCoverPhoto(IFormFile file);
        PhotoUploadResult AddActivityImage(IFormFile file);
        PhotoUploadResult AddReferencePic(IFormFile file);
        string DeletePhoto(string publicId);

    }
}
