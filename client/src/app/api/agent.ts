import axios, { AxiosResponse } from 'axios';
import { IActivitiesEnvelope, IActivity } from '../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { IPhoto, IProfile } from '../models/profile';
import { IPost } from '../models/post';

axios.defaults.baseURL = 'http://localhost:5000/api';

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
    const {status, data, config} = error.response;

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

const sleep = (ms: number) => (response: AxiosResponse) =>
        new Promise<AxiosResponse>(resolve => setTimeout(()=> resolve(response), ms));


const requests = {
    get: ( url: string ) => axios.get(url).then(sleep(1000)).then(responseBody),
    post:( url:string, body:{} ) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body:{}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    del:(url:string) => axios.delete(url).then(sleep(1000)).then(responseBody),
    postForm: async (url: string, file: Blob) =>{
        debugger;
        let formData = new FormData();
        //const blob = await fetch(file.toString()).then((res) => res.blob());

        formData.append('File',file);
        return axios.post(url, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(responseBody)
    }
}

const Activities = {
    list: (params: URLSearchParams): Promise<IActivitiesEnvelope> => 
            axios.get(`/activities`, {params:params}).then(sleep(1000)).then(responseBody),
    details: (id:string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post(`/activities/${id}/attend`,{}),
    unattend: (id: string) => requests.del(`/activities/${id}/attend`)
}

const User ={
    current: () : Promise<IUser> => requests.get('/user'),
    login: ( user : IUserFormValues) : Promise<IUser> => requests.post('/user/login', user),
    register: ( user : IUserFormValues) : Promise<IUser> => requests.post('/user/register', user)
}

const Profiles = {
    get: (userName: string): Promise<IProfile> => requests.get(`/profiles/${userName}/details`),
    list: (role: string): Promise<IProfile[]> => requests.get(`/profiles/role=${role}`),
    uploadPhoto: ( photo: Blob): Promise<IPhoto> => requests.postForm(`/photos`, photo),
    setMainPhoto: (id:string) => requests.post(`/photos/${id}/setMain`,{}),
    deletePhoto: (id:string) => requests.del(`/photos/${id}`),
    follow: (username:string) => requests.post(`/profiles/${username}/follow`, {}),
    unfollow:  (username:string) => requests.del(`/profiles/${username}/follow`),
    listFollowings: (username: string, predicate: string) => requests.get(`/profiles/${username}/follow?predicate=${predicate}`),
    listActivities: (username:string, predicate: string) => requests.get(`/profiles/${username}/activities?predicate=${predicate}`)
}


const Posts = {
    list: (): Promise<IPost[]> => requests.get('/post'),
    details: (id:string) => requests.get(`/post/${id}`),
    create: (post: IPost) => requests.post('/post', post),
    update: (post: IPost) => requests.put(`/post/${post.id}`, post),
    delete: (id: string) => requests.del(`/post/${id}`),
}
export default {
    Activities,
    User,
    Profiles,
    Posts
}