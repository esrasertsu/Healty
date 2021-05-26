export interface IMessageForm{
    message: string;
    receiver: string;
}

export interface IChatRoom{
    id : string,
    userName: string,
    userImage: string,
    lastMessageDate: Date,
    lastMessage: string,
    messages: IMessage[],
    unReadMessageCount: number
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