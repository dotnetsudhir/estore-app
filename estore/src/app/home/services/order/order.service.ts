import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartStoreItem } from '../cart/cart.storeItem';
import { Order, OrderItem } from '../../types/order.type';
import { DeliveryAddress } from '../../types/cart.type';
import { UserService } from '../users/user-service.service';
import { PastOrder, PastOrderProduct } from '../../types/order.type';

@Injectable()
export class OrderService {

  constructor(private httpClient: HttpClient,
        private userService: UserService,
        private cartStoreItem: CartStoreItem
  ) { }

  saveOrder(deliveryAddres: DeliveryAddress, userEmail: string): Observable<any>
  {
    const url: string = 'http://localhost:5001/orders/add';
    const orderDetails: OrderItem[]=[];
    this.cartStoreItem.cart.products.forEach(
      product => {
        const orderItem: OrderItem = {
          productId : product.product.id,
          price : product.product.price,
          qty: product.quantity,
          amount: product.amount
        }
        orderDetails.push(orderItem);
      }
    );

    const order: Order = {
      userName : deliveryAddres.userName,
      address: deliveryAddres.address,
      city: deliveryAddres.city,
      state: deliveryAddres.state,      
      pin: deliveryAddres.pin,
      total: this.cartStoreItem.cart.totalAmount,
      userEmail: userEmail,
      orderDetails: orderDetails
    };
    return this.httpClient.post(url, order, {
      headers: { authorization: this.userService.token }
    })
  }

  getOrders(email: string): Observable<PastOrder[]>{
    const url: string = `http://localhost:5001/orders/allorders?userEmail=${email}`;
    return this.httpClient.get<PastOrder[]>(url, {headers: {authorization: this.userService.token}});
  }

  getOrderProducts(orderId: number): Observable<PastOrderProduct[]>{
    const url: string=`http://localhost:5001/orders/orderproducts?orderId=${orderId}`;
      return this.httpClient.get<PastOrderProduct[]>(url, {headers: {authorization: this.userService.token}});
  }
}
