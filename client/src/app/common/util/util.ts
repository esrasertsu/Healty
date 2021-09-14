import { IActivity, IAttendee } from "../../models/activity";
import { IMessage } from "../../models/message";
import { IProfile } from "../../models/profile";
import { IUser } from "../../models/user";
import Payment from "payment";

function clearNumber(value = "") {
  return value.replace(/\D+/g, "");
}

export function formatCreditCardNumber(value:any) {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;

  switch (issuer) {
    case "amex":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 15)}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
      break;
  }

  return nextValue.trim();
}

export function formatCVC(value:any, prevValue:any, allValues:any = {}) {
  const clearValue = clearNumber(value);
  let maxLength = 4;

  if (allValues.number) {
    const issuer = Payment.fns.cardType(allValues.number);
    maxLength = issuer === "amex" ? 4 : 3;
  }

  return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value:any) {
  const clearValue = clearNumber(value);

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
}

export function formatFormData(data:any) {
  return Object.keys(data).map(d => `${d}: ${data[d]}`);
}


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