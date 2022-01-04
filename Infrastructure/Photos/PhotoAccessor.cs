using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;


namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
                );

            _cloudinary = new Cloudinary(acc);
        }

        public PhotoUploadResult AddPhoto(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if(file.Length > 0)
            {
                using( var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);

            return new PhotoUploadResult
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.AbsoluteUri
            };
        }

        public PhotoUploadResult AddUserCoverPhoto(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Transformation = new Transformation().Height(300).Width(1350).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);

            return new PhotoUploadResult
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.AbsoluteUri
            };
        }

        public PhotoUploadResult AddBlogPhoto(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Transformation = new Transformation().Height(500).Width(1485).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);

            return new PhotoUploadResult
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.AbsoluteUri
            };
        }

        public PhotoUploadResult AddActivityImage(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Transformation = new Transformation()
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);

            return new PhotoUploadResult
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.AbsoluteUri
            };
        }

        public ReferencePicUploadResult AddReferencePic(IFormFile original, IFormFile thumbnail, bool isFirst)
        {
            var originalUploadResult = new ImageUploadResult();
            var thumbnailUploadResult = new ImageUploadResult();

            if (original.Length > 0 && thumbnail.Length >0)
            {
                using (var stream = original.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(original.FileName, stream),
                        Transformation = new Transformation()
                    };
                    originalUploadResult = _cloudinary.Upload(uploadParams);
                }

                int height = isFirst ? 240 : 114;
                int width = isFirst ? 240 : 171;

                using (var stream2 = thumbnail.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(thumbnail.FileName, stream2),
                        Transformation = new Transformation().Height(height).Width(width).Crop("fill")
                    };
                    thumbnailUploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            if (thumbnailUploadResult.Error != null || originalUploadResult.Error != null)
                throw new Exception(originalUploadResult.Error.Message);

            return new ReferencePicUploadResult
            {
                OriginalPublicId = originalUploadResult.PublicId,
                OriginalUrl = originalUploadResult.SecureUrl.AbsoluteUri,
                ThumbnailPublicId = thumbnailUploadResult.PublicId,
                ThumbnailUrl = thumbnailUploadResult.SecureUrl.AbsoluteUri,
                Width = originalUploadResult.Width,
                Height = originalUploadResult.Height
            };
        }

        public string DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);

            var result = _cloudinary.Destroy(deleteParams);

            return result.Result == "ok" ? result.Result : null;
        }

        public string DeleteReferencePic(string publicId, string publicId2)
        {
            var deleteParams = new DeletionParams(publicId);
            var deleteParams2 = new DeletionParams(publicId2);

            var result1 = _cloudinary.Destroy(deleteParams);
            var result2 = _cloudinary.Destroy(deleteParams2);

            return result1.Result == "ok" && result2.Result == "ok" ? result1.Result : null;
        }
    }
}
