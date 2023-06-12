import axios, { AxiosResponse } from 'axios';
import { IActivitiesEnvelope, IActivity, IActivityFormValues, IActivityOnlineJoinInfo, IActivityReview, ILevel, IPaymentCardInfo, IPaymentUserInfoDetails, IPersonalActivitiesEnvelope, IRefundPayment, PaymentThreeDResult } from '../models/activity';
import { toast } from 'react-toastify';
import { IAccountInfo, IAccountInfoValues, ISubMerchantInfo, ITrainerCreationFormValues, ITrainerFormValues, IUser, IUserFormValues, IyziSubMerchantResponse } from '../models/user';
import { IAccessibility, IDocument, IPhoto, IProfile, IProfileBlogsEnvelope, IProfileComment, IProfileCommentEnvelope, IProfileEnvelope, IProfileFormValues, IRefencePic } from '../models/profile';
import { IBlogsEnvelope, IBlog, IPostFormValues, IBlogUpdateFormValues } from '../models/blog';
import { IAllCategoryList, ICategory, ISubCategory } from '../models/category';
import { IChatRoom, IMessage, IMessageEnvelope, IMessageForm } from '../models/message';
import { ICity } from '../models/location';
import { IOrderListEnvelope } from '../models/order';
import { history } from '../..';
import { store } from '../stores/rootStore';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;


axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('jwt');
    if(token) config.headers.Authorization = `Bearer ${token}`;
    config.withCredentials = true;
    return config;
}, error =>{
    return Promise.reject(error);
})

axios.interceptors.response.use(undefined, error => {

    if(error.message === 'Network Error' && !error.response)
    {
        toast.error('Network error - Sunucu bağlantı hatası!');//make sure API is running!
    }
    const {status, data, config, headers} = error.response;
    if(status === 401 && headers['www-authenticate'].startsWith('Bearer error="invalid_token"'))
    {
       
       toast.info("Oturumunuzun süresi dolmuştur.")
       store.userStore.logout();
       window.localStorage.removeItem('jwt');
       history.push('/login');
    }   
    if(status === 404)
    {
        history.push('/notFound');
    }   
    if(status === 403)
    {
        history.push('/forbidden');
    }  
    if(status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id'))
    {
        history.push('/notFound');
    }
    if( status === 500 )
    {
        toast.error('Hata oluştu!');//Server error - check the terminal for more info!
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
    postForm: async (url: string, file: Blob, name:string) =>{
        let formData = new FormData();
        formData.append('File',file);
        formData.append('TrainerUserName',name);
        return axios.post(url, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(responseBody)
    },
    postMainPhoto: async (url: string, id: string, name:string) =>{
        let formData = new FormData();
        formData.append('Id',id);
        formData.append('TrainerUserName',name);
        return axios.post(url, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(responseBody)
    },
    deleteProfPhoto: async (url: string, id: string, name:string) =>{
        let formData = new FormData();
        formData.append('Id',id);
        formData.append('TrainerUserName',name);
        return axios.put(url, formData, {
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
        profile.trainerUserName && profile.trainerUserName !== "" && formData.append('TrainerUserName', profile.trainerUserName);
        // profile.documents!.length>0 && profile.documents!.map((acc:File)=>(
        //     formData.append('certificates', acc)
        // ));
        profile.subCategoryIds!.length>0 && profile.subCategoryIds!.map((subCategoryId:string)=>(
            formData.append('SubCategoryIds', subCategoryId)
        ));
        // profile.categoryIds!.length>0 && profile.categoryIds!.map((category:string)=>(
        //     formData.append('CategoryIds', category)
        // ));
        profile.accessibilityIds!.length>0 && profile.accessibilityIds!.map((acc:string)=>(
            formData.append('Accessibilities', acc)
        ));
        return axios.put(url, formData, {
            headers: {'Content-type': 'application/json'}
        }).then(responseBody)
    },
    editActivity: async (url:string,title: string, description:string, categoryIds: string[]| null,subCategoryIds: string[]| null, levelIds: string[]| null,
        date:Date,enddate:Date, cityId:string,venue:string,online:boolean, attendancyLimit:number,price:number,
        photo:Blob,photos:any[],deletedPhotos:string[],address:string,duration:number, mainPhotoId:string ) =>{
        let formData = new FormData();
        formData.append('photo',photo);
        formData.append('Title', title);
        formData.append('Date', date.toISOString());
        formData.append('EndDate', enddate.toISOString());
        formData.append('description', description);
        formData.append('cityId', cityId);
        formData.append('venue', venue);
        formData.append('address', address);
        formData.append('online', String(online));
        formData.append('duration', duration ? duration.toString() : "0");
        formData.append('attendancyLimit', attendancyLimit ? attendancyLimit.toString(): "0");
        formData.append('price', price ? price.toString(): "0");
        formData.append('mainPhotoId', mainPhotoId);

        photos && photos.map((photo:any)=>(
            formData.append('photos',photo)
            ));

         deletedPhotos && deletedPhotos.map((photo:any)=>(
            formData.append('deletedPhotos',photo)
            ));
    
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
        date:Date, enddate:Date,cityId:string,venue:string,online:boolean, attendancyLimit:number,price:number,photo:Blob, 
        photos:Blob[], address:string,duration:number, trainerUserName:string ) =>{

        let formData = new FormData();
        formData.append('photo',photo);
        formData.append('Title', title);
        formData.append('Date', date.toISOString());
        formData.append('EndDate', enddate.toISOString());
        formData.append('description', description);
        formData.append('cityId', cityId);
        formData.append('venue', venue ? venue :"");
        formData.append('address', address ? address :"");
        formData.append('online', String(online));
        formData.append('duration', duration ? duration.toString() : "0");
        formData.append('attendancyLimit', attendancyLimit ? attendancyLimit.toString(): "0");
        formData.append('price', price ? price.toString(): "0");
        formData.append('trainerUserName', trainerUserName);

        photos && photos.map((photo:Blob)=>(
            formData.append('photos',photo)
            ));

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
    postReferencePic: async (url: string, photos: any[],deletedPhotos:any[], name:string) =>{
        let formData = new FormData();
        photos && photos.map((photo:Blob)=>(
            formData.append('photos',photo)
            ));

         deletedPhotos && deletedPhotos.map((photo:string)=>(
            formData.append('deletedPhotos',photo)
            ));

            formData.append('TrainerUserName',name)

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
    updateAccount: async (url: string, acc:IAccountInfoValues) =>{
        let formData = new FormData();
        formData.append('displayName',acc.displayName!);
        formData.append('userName',acc.userName!);
        formData.append('phoneNumber',acc.phoneNumber!);
        formData.append('name',acc.name!);
        formData.append('surname',acc.surname!);
        formData.append('address',acc.address!);
        formData.append('password',acc.password!);
        formData.append('email',acc.email!);
        formData.append('cityId',acc.cityId!);

        return axios.put(url, formData, {
            headers: {'Content-type': 'application/json'}
        }).then(responseBody)
    },
    refreshPassword: async (url: string, password:string) =>{
        let formData = new FormData();
        formData.append('password',password);
        return axios.put(url, formData, {
            headers: {'Content-type': 'application/json'}
        }).then(responseBody)
    },
    updateContactInfo: async (url: string, acc:IAccountInfoValues) =>{
        let formData = new FormData();
        formData.append('phoneNumber',acc.phoneNumber!);
        formData.append('name',acc.name!);
        formData.append('surname',acc.surname!);
        formData.append('address',acc.address!);
        formData.append('cityId',acc.cityId!);

        return axios.put(url, formData, {
            headers: {'Content-type': 'application/json'}
        }).then(responseBody)
    },
    registerTrainer: async (url: string, trainer: ITrainerFormValues) =>{
        let formData = new FormData();
         formData.append('displayname', trainer.displayName!);
         formData.append('username', trainer.userName!);
         formData.append('email', trainer.email);
         formData.append('experienceYear', trainer.experienceYear.toString());
         formData.append('title', trainer.title);
         formData.append('sendToRegister', trainer.sendToRegister.toString());
         formData.append('suggestedSubCategory', trainer.suggestedSubCategory);


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
         trainer.newDocuments!.length>0 && trainer.newDocuments!.map((acc:any)=>(
             formData.append('NewCertificates', acc)
         ));
         trainer.deletedDocuments!.length>0 && trainer.deletedDocuments!.map((acc:string)=>(
            formData.append('DeletedCerts', acc)
        ));

         return axios.post(url, formData, {
            headers: {'Content-type': 'application/json'}
         }).then(responseBody)
    },

    registerWaitingTrainer: async (url: string, trainer: ITrainerCreationFormValues) =>{
        let formData = new FormData();
         formData.append('displayname', trainer.displayname!);
         formData.append('username', trainer.username!);
         formData.append('email', trainer.email);
         formData.append('password', trainer.password);
         formData.append('phone', trainer.phone);
         formData.append('hasSignedContract', String(trainer.hasSignedContract) );

      //   formData.append('photo',trainer.photo!);
         trainer.categoryIds!.length>0 && trainer.categoryIds!.map((category:string)=>(
             formData.append('CategoryIds', category)
         ));
       
         return axios.post(url, formData, {
            headers: {'Content-type': 'application/json'}
         }).then(responseBody)
    },
    refundPayment:async (url: string,paymentTransactionId:string, activityId: string, orderId: string) =>{
        let formData = new FormData();
        formData.append('paymentTransactionId', paymentTransactionId);
        formData.append('activityId', activityId);
        formData.append('orderId', orderId);

        return axios.post(url, formData, {
            headers: {'Content-type': 'application/json'}
         }).then(responseBody)
    }
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
    activity.categoryIds!,activity.subCategoryIds!,activity.levelIds, activity.date!,activity.endDate!,
    activity.cityId!,activity.venue!, activity.online!, activity.attendancyLimit!,activity.price!,activity.photo!,activity.newphotos!,
    activity.deletedPhotos, activity.address!,activity.duration!, activity.mainPhotoId),
    create: (activity: IActivityFormValues) => requests.createActivity(`/activities/`,activity.title!,
     activity.description!,activity.categoryIds!,activity.subCategoryIds!,activity.levelIds, activity.date!,activity.endDate!,
    activity.cityId!,activity.venue!, activity.online!, activity.attendancyLimit!,activity.price!,activity.photo!,activity.newphotos!,
    activity.address!, activity.duration!, activity.trainerUserName),
    editOnlineJoinInfo: ( id:string, name : string) => requests.put(`/activities/${id}/joindetails`, name),
    save: (id:string) => requests.post(`/activities/${id}/save`, {}),
    unsave:  (id:string) => requests.del(`/activities/${id}/unsave`),
    getSavedActivities: () : Promise<IActivity[]>=>  requests.get(`/activities/saved`),
    sendReview: (comment:IActivityReview) => requests.post(`/activities/${comment.activityId}/review`, comment),
    listPersonalActs: (params: URLSearchParams): Promise<IPersonalActivitiesEnvelope> => 
            axios.get(`/activities/personalActivities`, {params:params}).then(responseBody),
    updateActivityStatus: (id: string, status:string) => requests.put(`/activities/${id}/status?id=${id}&status=${status}`,{}),

}

const User ={
    getAccountInfo: () : Promise<IAccountInfoValues> => requests.get('/user/account'),
    editAccountInfo: (accInfo: IAccountInfoValues) => requests.updateAccount('/user/account',accInfo),
    refreshPassword: (password: string) => requests.refreshPassword('/user/password',password),
    updateContactInfo: (accInfo: IAccountInfoValues) => requests.updateContactInfo('/user/contactInfo',accInfo),
    loadNewTrainer: (username:string) : Promise<ITrainerFormValues> => requests.get(`/user/newTrainerInfo?username=${username}`),
    sendSms: ( phoneNumber : string) : Promise<Boolean> => requests.post(`/user/sendSms?phoneNumber=${phoneNumber}`, {}),
    sendSmsVerification: (phone: string, code : string) : Promise<Boolean> => requests.post(`/user/sendSmsVerification?phoneNumber=${phone}&code=${code}`, {}),
    update: (status:boolean) => requests.put(`/user?status=${status}`,{}),
    userNameAndPhoneCheck: ( username : string, email:string, phone:string, token:string) : Promise<Boolean> => requests.post(`/user/userNameAndPhoneCheck?username=${username}&email=${email}&phone=${phone}&token=${token}`, {}),
    registerTrainer: ( trainer : ITrainerFormValues) => requests.registerTrainer('/user/registertrainer', trainer),
    fbLogin: (accessToken: string) => requests.post(`/user/facebook`, {accessToken}),
    googleLogin: (accessToken: string) => requests.post(`/user/google`, {accessToken}),
    verifyEmail: (token: string, email:string): Promise<void> => requests.post(`/user/verifyEmail`,{token,email}),
    resendVerifyEmailConfirm:(email:string): Promise<void> => requests.post(`/user/resendEmailVerification?email=${email}`,{}),
    resetPasswordRequest:(email:string, token:string): Promise<boolean> => requests.post(`/user/resetPswRequest?email=${email}&reCaptcha=${token}`,{}),
    resetPassword:(token:string, email:string,password:string): Promise<any> => requests.get(`/user/resetPassword?token=${token}&email=${email}&password=${password}`),
    getSubMerchantInfo: (username:string) : Promise<ISubMerchantInfo> => requests.get(`/user/submerchantInfo?username=${username}`),
    createSubMerchant: ( subMerchant : ISubMerchantInfo) : Promise<IyziSubMerchantResponse> => requests.post('/user/createSubMerchant', subMerchant),
    editSubMerchant: ( subMerchant : ISubMerchantInfo) : Promise<IyziSubMerchantResponse> => requests.put('/user/editSubMerchant', subMerchant),
    checkCallbackandStartPayment: (id:string, count:string, status:string, paymentId:string, conversationData:string, conversationId:string, mdStatus:string): Promise<Boolean> => 
        requests.post(`/payment/callback`,{id, count, status, paymentId, conversationData, conversationId, mdStatus}),

}

const Account ={
    login: ( user : IUserFormValues) : Promise<IUser> => requests.post('/account/login', user),
    refreshToken: () : Promise<IUser> => requests.post(`/account/refreshToken`,{}),
    current: () : Promise<IUser> => requests.get('/account'),
    register: ( user : IUserFormValues) : Promise<IUser> => requests.post('/account/register', user),
    registerWaitingTrainer: ( trainer : ITrainerCreationFormValues) : Promise<IUser>=> requests.registerWaitingTrainer('/account/registerWaitingTrainer', trainer),
}

const Profiles = {
    get: (userName: string) => requests.get(`/profiles/${userName}/details`),
    list: (params: URLSearchParams): Promise<IProfileEnvelope> => axios.get(`/profiles`, {params:params}).then(responseBody),
    popularlist: (params: URLSearchParams): Promise<IProfile[]> => axios.get(`/profiles/popularList`, {params:params}).then(responseBody),
    uploadPhoto: ( photo: Blob,name:string): Promise<IPhoto> => requests.postForm(`/photos`, photo, name),
    setMainPhoto: (id:string, trainerUserName:string) => requests.postMainPhoto(`/photos/${id}/setMain`,id,trainerUserName),
    deletePhoto: (id:string,trainerUserName:string) => requests.deleteProfPhoto(`/photos/${id}`,id, trainerUserName),
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
    getReferencePics : (username:string): Promise<IPhoto[]>  => requests.get(`/profiles/${username}/referencepics`),
    updateReferencePics: ( photos: Blob[], deletedPhotos: Blob[],name:string): Promise<IPhoto[]> => requests.postReferencePic(`/profiles/referencepic`, photos, deletedPhotos, name),
    deleteReferencePic: ( id1:string): Promise<IPhoto> => requests.del(`/profiles/referencepic/${id1}`),
    deleteDocument: ( id:string) => requests.del(`/profiles/documents/${id}`),
    uploadCoverPic: ( photo: Blob, name:string): Promise<IPhoto> => requests.postForm(`/profiles/coverpic`, photo, name),
    uploadProfileVideo: ( url: string,name:string)  => requests.put(`/profiles/videoUrl?url=${url}&trainerUserName=${name}`, {}),
    deleteComment: (id:string) => requests.del(`/profiles/comments/${id}`),
    reportComment: (id:string,body:string) => requests.post(`/profiles/comments/${id}/report?body=${body}`,{})
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
    getUserPaymentDetailedInfo: (details:IPaymentUserInfoDetails): Promise<boolean> => requests.post(`/payment/${details.activityId}/updateUserBeforePayment`,details),
    processPayment: (details:IPaymentCardInfo): Promise<PaymentThreeDResult> => requests.post(`/payment/${details.activityId}/paymentstart`,details),
    refundPayment: (paymentTransactionId:string, activityId: string, orderId: string):Promise<IRefundPayment> => requests.refundPayment(`/payment/refundPayment`, paymentTransactionId, activityId, orderId),
} 

const Order = {
    list: (limit?:number, offset?:number): Promise<IOrderListEnvelope> => 
    requests.get(`/orders?limit=${limit}&offset=${offset}`),
    details: (id: string) => requests.get(`/orders/${id}`),
    deleteOrder:(orderId: string) => requests.del(`/orders/${orderId}`),

} 

const Contract = {
    get: (code: string) => requests.get(`/contracts/content/${code}`),
} 

const Agora = {
    generateToken: (params: URLSearchParams): Promise<string> => 
            axios.get(`/agora`, {params:params}).then(responseBody),
    
}
export default {
    Activities,
    User,
    Account,
    Profiles,
    Blogs,
    Categories,
    Messages,
    Cities,
    Documents,
    Zoom,
    Payment,
    Order,
    Agora,
    Contract
}