export interface IMessageForm{
    message: string;
    receiver: string;
}

export interface IChatRoom{
    id : string,
    userName: string,
    displayName: string,
    userImage: string,
    lastMessageDate: Date,
    lastMessage: string,
    messages: IMessage[],
    unReadMessageCount: number,
    userStatus: boolean
}

export interface IMessage{
    id: string,
    body :string,
    chatRoomId :string,
    username:string,
    createdAt: Date,
    displayName :string,
    image :string,
    isSender:boolean,
    seen: boolean

}

export interface IMessageEnvelope{
    messages: IMessage[];
    messageCount: number;
}