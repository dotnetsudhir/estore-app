export interface OrderItem{
    productId: number;
    qty: number;
    price: number;
    amount: number;
}

export interface Order{
    userName: string;
    address: string;
    state: string;
    city: string;
    pin: string;
    total: number;
    userEmail: string;
    orderDetails: OrderItem[];
}