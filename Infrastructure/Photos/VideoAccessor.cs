using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Videos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;

namespace Infrastructure.Photos
{
        public class VideoAccessor : IVideoAccessor
        {
            private readonly Cloudinary _cloudinary;
            public VideoAccessor(IOptions<CloudinarySettings> config)
            {
                var acc = new Account(
                    config.Value.CloudName,
                    config.Value.ApiKey,
                    config.Value.ApiSecret
                    );

                _cloudinary = new Cloudinary(acc);
            }

            public CleanArchitecture.Application.Videos.VideoUploadResult AddVideo(IFormFile file)
            {
                var uploadResult = new CloudinaryDotNet.Actions.VideoUploadResult();

                if (file.Length > 0)
                {
                    using (var stream = file.OpenReadStream())
                    {
                        var uploadParams = new VideoUploadParams
                        {
                            File = new FileDescription(file.FileName, stream),
                            Overwrite = true
                        };
                        uploadResult = _cloudinary.Upload(uploadParams);
                    }
                }

                if (uploadResult.Error != null)
                    throw new Exception(uploadResult.Error.Message);

                return new CleanArchitecture.Application.Videos.VideoUploadResult
                {
                    PublicId = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.AbsoluteUri,
                     
                };
            }

            //public VideoUploadResult AddBlogPhoto(IFormFile file)
            //{
            //    var uploadResult = new ImageUploadResult();

            //    if (file.Length > 0)
            //    {
            //        using (var stream = file.OpenReadStream())
            //        {
            //            var uploadParams = new ImageUploadParams
            //            {
            //                File = new FileDescription(file.FileName, stream),
            //                Transformation = new Transformation().Height(647).Width(1485).Crop("fill").Gravity("face")
            //            };
            //            uploadResult = _cloudinary.Upload(uploadParams);
            //        }
            //    }

            //    if (uploadResult.Error != null)
            //        throw new Exception(uploadResult.Error.Message);

            //    return new PhotoUploadResult
            //    {
            //        PublicId = uploadResult.PublicId,
            //        Url = uploadResult.SecureUrl.AbsoluteUri
            //    };
            //}

            //public PhotoUploadResult AddActivityImage(IFormFile file)
            //{
            //    var uploadResult = new ImageUploadResult();

            //    if (file.Length > 0)
            //    {
            //        using (var stream = file.OpenReadStream())
            //        {
            //            var uploadParams = new ImageUploadParams
            //            {
            //                File = new FileDescription(file.FileName, stream),
            //                Transformation = new Transformation().Height(330).Width(770).Crop("fill").Gravity("face")
            //            };
            //            uploadResult = _cloudinary.Upload(uploadParams);
            //        }
            //    }

            //    if (uploadResult.Error != null)
            //        throw new Exception(uploadResult.Error.Message);

            //    return new PhotoUploadResult
            //    {
            //        PublicId = uploadResult.PublicId,
            //        Url = uploadResult.SecureUrl.AbsoluteUri
            //    };
            //}

            public string DeleteVideo(string publicId)
            {
                var deleteParams = new DeletionParams(publicId);

                var result = _cloudinary.Destroy(deleteParams);

                return result.Result == "ok" ? result.Result : null;
            }
        }
    
}
