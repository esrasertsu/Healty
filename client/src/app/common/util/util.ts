import { IActivity, IAttendee } from "../../models/activity";
import { IMessage } from "../../models/message";
import { IProfile } from "../../models/profile";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
    // const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

    // const year = date.getFullYear();
    // const month = date.getMonth() +1;
    // const day = date.getDate();

    // const dateString = `${year}-${month}-${day}`;

    const dateString = date.toISOString().split('T')[0];
    const timeString = time.toISOString().split('T')[1];

    return new Date(dateString + 'T' + timeString);
}

export const setActivityProps = (activity: IActivity, user:IUser) =>{
    activity.date = new Date(activity.date);
    activity.isGoing = activity.attendees !==null && user !==null ? activity.attendees.some( a => a.userName === user.userName) : false;
    activity.isHost = activity.attendees !==null && user !==null ? activity.attendees.some( a =>
        (a.userName === user.userName && a.isHost === true )
    ) : false;
    return activity;
} 

export const setMessageProps = (message: IMessage, user: IUser) =>{
    message.createdAt = new Date(message.createdAt);
    message.isSender = message.username === user.userName;
    return message;
}

export const setProfileProps = (profile: IProfile, category: string) =>{
    profile.mainCategory = category;
    return profile;
}

export const createAttendee = ( user: IUser): IAttendee => {
    return {
        displayName: user.displayName,
        isHost: false,
        userName: user.userName,
        image: user.image!,
        userRole: user.role
    }
}