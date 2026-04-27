import { Component, OnInit, OnDestroy } from '@angular/core';
import { PastOrder, PastOrderProduct } from '../../types/order.type';
import { OrderService } from '../../services/order/order.service';
import { UserService } from '../../services/users/user-service.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-past-orders',
  templateUrl: './past-orders.component.html',
  styleUrls: ['./past-orders.component.scss']
})
export class PastOrdersComponent implements OnInit, OnDestroy {
  
  pastOrderProducts: PastOrderProduct[] = [];
  pastOrder: PastOrder;
  pastOrders: PastOrder[]=[];
  subscriptions: Subscription = new Subscription();

  constructor(private userService: UserService, 
      private orderService: OrderService)
      {
    
    }

  ngOnInit(){
    this.subscriptions.add(
      this.orderService.getOrders(this.userService.loggedInUser.email).subscribe(
        pastOrders => { this.pastOrders = pastOrders}
      )
    )
  }

  selectOrder(event: any){
    if(Number.parseInt(event.target.value) > 0){
      this.pastOrder = this.pastOrders.filter(
        order => order.orderId === Number.parseInt(event.target.value))[0];  
      this.getOrderProducts(this.pastOrder.orderId);
    }
    else{
        this.pastOrder = <any>undefined;
        this.pastOrderProducts = [];
      }
  }

  getOrderProducts(orderId: number) {
      this.subscriptions.add(
        this.orderService.getOrderProducts(orderId).subscribe(
          (pastOrderProducts) => { this.pastOrderProducts = pastOrderProducts}
        )
      );
    // this.orderService.getOrderProducts(orderId).subscribe(
    //   (orderProducts) => {this.pastOrderProducts = orderProducts}
    // )
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
