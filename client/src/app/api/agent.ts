import axios, { AxiosResponse } from 'axios';
import { IActivitiesEnvelope, IActivity, IActivityFormValues, IActivityOnlineJoinInfo, ILevel, IPaymentCardInfo, IPaymentUserInfoDetails } from '../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';
import { ITrainerCreationFormValues, ITrainerFormValues, IUser, IUserFormValues } from '../models/user';
import { IAccessibility, IDocument, IPhoto, IProfile, IProfileBlogsEnvelope, IProfileComment, IProfileCommentEnvelope, IProfileEnvelope, IProfileFormValues, IRefencePic } from '../models/profile';
import { IBlogsEnvelope, IBlog, IPostFormValues, IBlogUpdateFormValues } from '../models/blog';
import { IAllCategoryList, ICategory, ISubCategory } from '../models/category';
import { IChatRoom, IMessage, IMessageEnvelope, IMessageForm } from '../models/message';
import { ICity } from '../models/location';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;


axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('jwt');
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error =>{
    return Promise.reject(error);
})

axios.interceptors.response.use(undefined, error => {
    if(error.message === 'Network Error' && !error.response)
    {
        toast.error('Network error - make sure API is running!');
    }
    const {status, data, config, headers} = error.response;
    if(status === 401 && headers['www-authenticate'] === 'Bearer error="invalid_token", error_description="The token is expired"')
    {
       window.localStorage.removeItem('jwt');
       history.push('/');
       toast.info("Oturumunuzun süresi dolmuştur.")
    }   
    if(status === 404)
    {
        history.push('/notFound');
    }   
    if(status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id'))
    {
        history.push('/notFound');
    }
    if( status === 500 )
    {
        toast.error('Server error - check the terminal for more info!');
    }
    throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

// const sleep = (ms: number) => (response: AxiosResponse) =>
//         new Promise<AxiosResponse>(resolve => setTimeout(()=> resolve(response), ms));


const requests = {
    get: ( url: string ) => axios.get(url).then(responseBody),
    post:( url:string, body:{} ) => axios.post(url, body).then(responseBody),
    put: (url: string, body:{}) => axios.put(url, body).then(responseBody),
    del:(url:string) => axios.delete(url).then(responseBody),
    postForm: async (url: string, file: Blob) =>{
        let formData = new FormData();
        formData.append('File',file);
        return axios.post(url, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(responseBody)
    },
    postBlogForm: async (url: string, file: Blob, title:string, description: string, categoryId: string,subCategoryIds: string[]| null) =>{
        let formData = new FormData();
        formData.append('File',file);
        formData.append('Title', title);
        formData.append('description', description);
        formData.append('categoryId', categoryId);
        
        subCategoryIds && subCategoryIds.map((subCategoryId:string)=>(
            formData.append('SubCategoryIds', subCategoryId)
        ));
        return axios.post(url, formData, {
            headers: {'Content-type': 'application/json'}
        }).then(responseBody)
    },
    editProfile: async (url: string, profile: Partial<IProfileFormValues>) =>{
        let formData = new FormData();
        profile.displayName && formData.append('DisplayName', profile.displayName);
        profile.title && formData.append('Title', profile.title);
        profile.experience && profile.experience!=="" && formData.append('Experience', profile.experience);
        profile.bio && profile.bio !== undefined && formData.append('Bio', profile.bio);
        formData.append('ExperienceYear', profile.experienceYear ? profile.experienceYear.toString(): "0");
        profile.dependency && profile.dependency !== "" && formData.append('Dependency', profile.dependency);
        profile.cityId && profile.cityId !== "" && formData.append('CityId', profile.cityId);

        profile.documents!.length>0 && profile.documents!.map((acc:File)=>(
            formData.append('certificates', acc)
        ));
        profile.subCategoryIds!.length>0 && profile.subCategoryIds!.map((subCategoryId:string)=>(
            formData.append('SubCategoryIds', subCategoryId)
        ));
        profile.categoryIds!.length>0 && profile.categoryIds!.map((category:string)=>(
            formData.append('CategoryIds', category)
        ));
        profile.accessibilityIds!.length>0 && profile.accessibilityIds!.map((acc:string)=>(
            formData.append('Accessibilities', acc)
        ));
        return axios.put(url, formData, {
            headers: {'Content-type': 'application/json'}
        }).then(responseBody)
    },
    editActivity: async (url:string,title: string, description:string, categoryIds: string[]| null,subCategoryIds: string[]| null, levelIds: string[]| null,
        date:Date, cityId:string,venue:string,online:boolean, attendanceCount: number, attendancyLimit:number,price:number,photo:Blob,address:string ) =>{
        let formData = new FormData();
        formData.append('photo',photo);
        formData.append('Title', title);
        formData.append('Date', date.toISOString());
        formData.append('description', description);
        formData.append('cityId', cityId);
        formData.append('venue', venue);
        formData.append('address', address);
        formData.append('online', String(online));
        formData.append('attendanceCount', attendanceCount ? attendanceCount.toString(): "0");
        formData.append('attendancyLimit', attendancyLimit ? attendancyLimit.toString(): "0");
        formData.append('price', price ? price.toString(): "0");


        categoryIds && categoryIds.map((categoryId:string)=>(
            formData.append('categoryIds', categoryId)
        ));
        subCategoryIds && subCategoryIds.map((subCategoryId:string)=>(
            formData.append('SubCategoryIds', subCategoryId)
        ));
        levelIds && levelIds.map((levelId:string)=>(
            formData.append('LevelIds', levelId)
        ));
        return axios.put(url, formData, {
            headers: {'Content-type': 'application/json'}
        }).then(responseBody)
    },
    createActivity: async (url:string,title: string, description:string, categoryIds: string[]| null,subCategoryIds: string[]| null, levelIds: string[]| null,
        date:Date, cityId:string,venue:string,online:boolean, attendanceCount: number, attendancyLimit:number,price:number,photo:Blob, address:string ) =>{
        let formData = new FormData();
        formData.append('photo',photo);
        formData.append('Title', title);
        formData.append('Date', date.toISOString());
        formData.append('description', description);
        formData.append('cityId', cityId);
        formData.append('venue', venue);
        formData.append('address', address);
        formData.append('online', String(online));
        formData.append('attendanceCount', attendanceCount ? attendanceCount.toString(): "0");
        formData.append('attendancyLimit', attendancyLimit ? attendancyLimit.toString(): "0");
        formData.append('price', price ? price.toString(): "0");


        categoryIds && categoryIds.map((categoryId:string)=>(
            formData.append('categoryIds', categoryId)
        ));
        subCategoryIds && subCategoryIds.map((subCategoryId:string)=>(
            formData.append('SubCategoryIds', subCategoryId)
        ));
        levelIds && levelIds.map((levelId:string)=>(
            formData.append('LevelIds', levelId)
        ));
        return axios.post(url, formData, {
            headers: {'Content-type': 'application/json'}
        }).then(responseBody)
    },

    updateBlogDesc: async (url: string, blog: Partial<IBlogUpdateFormValues>) =>{
        let formData = new FormData();
        blog.title && blog.title !== "" && formData.append('Title', blog.title);
        blog.description && blog.description !== "" && formData.append('Description', blog.description);
        blog.categoryId && blog.categoryId !== "" && formData.append('CategoryId', blog.categoryId);

        blog.subCategoryIds!.length>0 && blog.subCategoryIds!.map((subCategoryId:string)=>(
            formData.append('SubCategoryIds', subCategoryId)
        ));
       
        return axios.put(url, formData, {
            headers: {'Content-type': 'application/json'}
        }).then(responseBody)
    },
    updateBlogPhoto: async (url: string, photo:Blob) =>{
        let formData = new FormData();
        formData.append('photo',photo);

        return axios.put(url, formData, {
            headers: {'Content-type': 'application/json'}
        }).then(responseBody)
    },
    postReferencePic: async (url: string, original: Blob, thumbnail: Blob, title: string) =>{
        let formData = new FormData();
        formData.append('Original',original);
        formData.append('Thumbnail',thumbnail);
        formData.append('Title',title);

        return axios.post(url, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(responseBody)
    },
    uploadFile: async (url: string, file: any, onUploadProgress: any, username:string) =>{
        let formData = new FormData();
        formData.append('file',file);
        formData.append('onUploadProgress',onUploadProgress);
        formData.append('username',username);

        return axios.post(url, formData, {
            headers: {'Content-type': 'multipart/form-data'},
            onUploadProgress
        }).then(responseBody)
    },
    registerTrainer: async (url: string, trainer: ITrainerFormValues) =>{
        let formData = new FormData();
         formData.append('displayname', trainer.displayname!);
         formData.append('username', trainer.username!);
         formData.append('email', trainer.email);
         formData.append('password', trainer.password);
         formData.append('experienceYear', trainer.experienceYear.toString());
         formData.append('title', trainer.title);

      //   formData.append('photo',trainer.photo!);
         formData.append('description',trainer.description!);

         trainer.dependency && trainer.dependency !== "" && formData.append('Dependency', trainer.dependency);
         trainer.cityId && trainer.cityId !== "" && formData.append('CityId', trainer.cityId);
 
         trainer.subCategoryIds!.length>0 && trainer.subCategoryIds!.map((subCategoryId:string)=>(
             formData.append('SubCategoryIds', subCategoryId)
         ));
         trainer.categoryIds!.length>0 && trainer.categoryIds!.map((category:string)=>(
             formData.append('CategoryIds', category)
         ));
         trainer.accessibilityIds!.length>0 && trainer.accessibilityIds!.map((acc:string)=>(
            formData.append('AccessibilityIds', acc)
        ));
         trainer.certificates!.length>0 && trainer.certificates!.map((acc:File)=>(
             formData.append('certificates', acc)
         ));
         return axios.post(url, formData, {
            headers: {'Content-type': 'application/json'}
         }).then(responseBody)
    },
}

const Activities = {
    list: (params: URLSearchParams): Promise<IActivitiesEnvelope> => 
            axios.get(`/activities`, {params:params}).then(responseBody),//formdata ya çevrilcek
    details: (id:string) => requests.get(`/activities/${id}`),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post(`/activities/${id}/attend`,{}),
    unattend: (id: string) => requests.del(`/activities/${id}/attend`),
    listLevels: (): Promise<ILevel[]> => requests.get('/activities/levels'),
    update: (activity: IActivityFormValues): Promise<IActivity> => requests.editActivity(`/activities/${activity.id}`,activity.title!, activity.description!,
    activity.categoryIds!,activity.subCategoryIds!,activity.levelIds, activity.date!,
    activity.cityId!,activity.venue!, activity.online!,activity.attendanceCount!, activity.attendancyLimit!,activity.price!,activity.photo!, activity.address!),
    create: (activity: IActivityFormValues): Promise<IActivity> => requests.createActivity(`/activities/`,activity.title!, activity.description!,
    activity.categoryIds!,activity.subCategoryIds!,activity.levelIds, activity.date!,
    activity.cityId!,activity.venue!, activity.online!,activity.attendanceCount!, activity.attendancyLimit!,activity.price!,activity.photo!,activity.address!),
    editOnlineJoinInfo: ( form : IActivityOnlineJoinInfo) => requests.put(`/activities/${form.id}/joindetails`, form),


}

const User ={
    current: () : Promise<IUser> => requests.get('/user'),
    login: ( user : IUserFormValues) : Promise<IUser> => requests.post('/user/login', user),
    register: ( user : IUserFormValues) : Promise<IUser> => requests.post('/user/register', user),
    update: (status:boolean) => requests.put(`/user?status=${status}`,{}),
    isUserNameAvailable: ( username : string, email:string) : Promise<Boolean> => requests.post(`/user/isUserNameAvailable?username=${username}&email=${email}`, {}),
    registerTrainer: ( trainer : ITrainerFormValues) => requests.registerTrainer('/user/registertrainer', trainer),
    fbLogin: (accessToken: string) => requests.post(`/user/facebook`, {accessToken})
}

const Profiles = {
    get: (userName: string) => requests.get(`/profiles/${userName}/details`),
    list: (params: URLSearchParams): Promise<IProfileEnvelope> => axios.get(`/profiles`, {params:params}).then(responseBody),
    popularlist: (params: URLSearchParams): Promise<IProfile[]> => axios.get(`/profiles/popularList`, {params:params}).then(responseBody),
    uploadPhoto: ( photo: Blob): Promise<IPhoto> => requests.postForm(`/photos`, photo),
    setMainPhoto: (id:string) => requests.post(`/photos/${id}/setMain`,{}),
    deletePhoto: (id:string) => requests.del(`/photos/${id}`),
    follow: (username:string) => requests.post(`/profiles/${username}/follow`, {}),
    unfollow:  (username:string) => requests.del(`/profiles/${username}/follow`),
    listFollowings: (username: string, predicate: string) => requests.get(`/profiles/${username}/follow?predicate=${predicate}`),
    listActivities: (username:string, predicate: string) => requests.get(`/profiles/${username}/activities?predicate=${predicate}`),
    createComment: (comment:IProfileComment) => requests.post(`/profiles`, comment),
    listComments: (username: string, limit?:number, page?:number): Promise<IProfileCommentEnvelope> => 
                requests.get(`/profiles/${username}/comments?username=${username}&limit=${limit}&offset=${page ? page*limit! :0}`),
    listBlogs: (username: string, limit?:number, page?:number): Promise<IProfileBlogsEnvelope> => 
                requests.get(`/profiles/${username}/blogs?username=${username}&limit=${limit}&offset=${page ? page*limit! :0}`),

    sendMessage:(message:IMessageForm):Promise<IMessage> => requests.post(`/profiles/message`, message),
    updateProfile: (profile: Partial<IProfile>):Promise<IProfile> => requests.editProfile(`/profiles`,profile),
    getAccessibilities : (): Promise<IAccessibility[]>  => requests.get(`/profiles/accessibilities`),
    getReferencePics : (username:string): Promise<IRefencePic[]>  => requests.get(`/profiles/${username}/referencepics`),
    addReferencePics: ( original: Blob, thumbnail: Blob, title:string): Promise<IRefencePic> => requests.postReferencePic(`/profiles/referencepic`, original,thumbnail, title),
    deleteReferencePic: ( id1:string): Promise<IRefencePic> => requests.del(`/profiles/referencepic/${id1}`),
    deleteDocument: ( id:string) => requests.del(`/profiles/documents/${id}`),
    uploadCoverPic: ( photo: Blob): Promise<IPhoto> => requests.postForm(`/profiles/coverpic`, photo),
    uploadProfileVideo: ( url: string)  => requests.put(`/profiles/videoUrl?url=${url}`, {})
}

const Blogs = {
    list: (params: URLSearchParams): Promise<IBlogsEnvelope> => 
            axios.get(`/blog`, {params:params}).then(responseBody),
    details: (id:string) => requests.get(`/blog/${id}`),
    update: (post: Partial<IBlogUpdateFormValues>):Promise<IBlog> => requests.updateBlogDesc(`/blog/${post.id}`, post),
    delete: (id: string) => requests.del(`/blog/${id}`),
    create: (post: IPostFormValues): Promise<IBlog> => requests.postBlogForm(`/blog`,post.file!, post.title!,post.description!,post.categoryId!,post.subCategoryIds || null),
    updateImage: (id:string, photo:Blob): Promise<string> => requests.updateBlogPhoto(`/blog/${id}/photo`, photo)
}

const Categories = {
    list: (): Promise<ICategory[]> => requests.get('/category'),
    listSubCats: (categoryId: string): Promise<ISubCategory[]> => requests.get(`/category/${categoryId}/sub`, ),
    listAll: (): Promise<IAllCategoryList[]> => requests.get('/category/allcategories'),

}

const Messages = {
    list: (): Promise<IChatRoom[]> => requests.get('/message'),
    listMessages: (chatRoomId: string,limit?:number, page?:number): Promise<IMessageEnvelope> => 
                requests.get(`/message/chat?chatRoomId=${chatRoomId}&limit=${limit}&offset=${page ? page*limit! :0}`),
    seenMessage: (message: IMessage) => requests.put(`/message/${message.id}`, message),

}

const Cities = {
    list: (): Promise<ICity[]> => requests.get('/city'),

}

const Documents = {
    list: (username:string): Promise<File[]> => requests.get(`/document/${username}`),
    upload: (file:any, onUploadProgress:any, username:string):Promise<any> => requests.uploadFile(`/document/${username}`, file, onUploadProgress, username)

}

const Zoom = {
    generateToken: (params: URLSearchParams): Promise<string> => 
            axios.get(`/zoom`, {params:params}).then(responseBody),
    
}

const Payment = {
    getActivityPaymentPage: (count:number,id: string): Promise<IPaymentUserInfoDetails> => requests.get(`/payment/activity/${id}/${count}?activityId=${id}&count=${count}`),
    getIyzicoPaymentPage: (details:IPaymentUserInfoDetails): Promise<boolean> => requests.post(`/payment/${details.activityId}/paymentpage`,details),
    processPayment: (details:IPaymentCardInfo): Promise<boolean> => requests.post(`/payment/${details.activityId}/paymentstart`,details),

} 
export default {
    Activities,
    User,
    Profiles,
    Blogs,
    Categories,
    Messages,
    Cities,
    Documents,
    Zoom,
    Payment
}