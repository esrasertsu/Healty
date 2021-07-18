using CleanArchitecture.Application.Documents;
using CleanArchitecture.Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Photos
{
    public class DocumentAccessor : IDocumentAccessor
    {
        private readonly Cloudinary _cloudinary;
        public DocumentAccessor(IOptions<CloudinarySettings> config)
        {
            var acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
                );

            _cloudinary = new Cloudinary(acc);
        }

        public DocumentUploadResult AddDocument(IFormFile file)
        {
            var uploadResult = new RawUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new RawUploadParams()
                    {  
                        File = new FileDescription(file.FileName, stream)
                    };
                   
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            if (uploadResult.Error != null)
                throw new Exception(uploadResult.Error.Message);

            return new DocumentUploadResult
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.AbsoluteUri,
                ResourceType = uploadResult.ResourceType
            };
        }

        public string DeleteDocument(string publicId, string resourceType)
        {
            var deleteParams = new DeletionParams(publicId)
            {
                ResourceType = GetResourceEnum(resourceType),
                PublicId = publicId
            };


            var result = _cloudinary.Destroy(deleteParams);

            return result.Result == "ok" ? result.Result : null;
        }

        private ResourceType GetResourceEnum(string resourceType)
        {
            switch (resourceType)
            {
                case "image":
                    return ResourceType.Image;
                case "raw":
                    return ResourceType.Raw;
                case "video":
                    return ResourceType.Video;
                default:
                    return ResourceType.Image;
            }
        }
    }
}
