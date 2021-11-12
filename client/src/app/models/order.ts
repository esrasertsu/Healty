
export interface IOrderListEnvelope {
    orderList :IOrder[];
    orderCount: number;
}


export interface IOrder {
    id: string;
    date: Date;
    title: string;
    photo: string;
    orderStatus: string;
    orderNo: string;
    description: string;
    price?:number;
    paidPrice:string;
    productId : string;
    paymentInfo : string;
    email: string;
    phoneNumber: string;
    trainerId: string;
    trainerImage: string;
    attendeeName: string;
    count: number;
    paymentType: string;
    cardLastFourDigit:string;
    activityDate:Date;
    activityOnline:boolean;
    activityLevel:string[];
    cardFamily:string;
    activityCategories:string[];
    paymentTransactionId:string;
    cardAssociation:string;
}