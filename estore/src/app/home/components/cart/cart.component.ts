import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartStoreItem } from '../../services/cart/cart.storeItem';
import { faL, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CartItem } from '../../types/cart.type';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/users/user-service.service';
import { loggedInUser } from '../../types/user.type';
import { Subscription } from 'rxjs';
import { DeliveryAddress } from '../../types/cart.type';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy{
  faTrash = faTrash;
  orderForm: FormGroup;
  user: loggedInUser;
  subscriptions: Subscription = new Subscription();
  alertType: number = 0;
  alertMessage: string = '';
  disableCheckout: boolean = false;

  constructor(public cartStore: CartStoreItem, 
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private orderService: OrderService) 
    {
      this.user = {
        firstName : '', lastName: '', address: '', state: '', city: '', pin: '', email: ''
      }

      this.subscriptions.add(
        userService.loggedInUser$.subscribe(
          (loggedInUser) => {
            if(loggedInUser.firstName){
              this.user = loggedInUser;
            }
          }
        )
      );
  }

  ngOnInit(){
    this.orderForm = this.fb.group(
      {
        name: [`${this.user.firstName} ${this.user.lastName}`, Validators.required],
        address: [this.user.address, Validators.required],
        city: [this.user.city, Validators.required],
        state: [this.user.state, Validators.required],
        pin: [this.user.pin, Validators.required]
      }
    );
  }

  navigateToHome(): void {
    this.router.navigate(['home/products']);
  }

  updateQuantity($event: any, cartItem: CartItem): void {
    if ($event.target.innerText === '+') {
      this.cartStore.addProduct(cartItem.product);
    } else if ($event.target.innerText === '-') {
      this.cartStore.decreaseProductQuantity(cartItem);
    }
  }

  removeItem(cartItem: CartItem): void {
    this.cartStore.removeProduct(cartItem);
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  onSubmit(): void{
    if(this.userService.isUserAuthenticated){
      const deliveryAddress: DeliveryAddress = {
        userName: this.orderForm.get('name')?.value,
        address: this.orderForm.get('address')?.value,
        city: this.orderForm.get('city')?.value,
        state: this.orderForm.get('state')?.value,
        pin: this.orderForm.get('pin')?.value
      };
      this.subscriptions.add(
        this.orderService.saveOrder(deliveryAddress, this.user.email).subscribe(
          {
            next: (result) => {
              this.cartStore.clearCart();
              this.alertType = 0;
              this.alertMessage = 'Order registered successfully';
              this.disableCheckout = true;
            },
            error: (error) => {
              this.alertType = 2;
              if(error.error.message === 'Authentication failed'){
                this.alertMessage = 'Please log in to register your order';
              }
              else{
                this.alertMessage = error.error.message;
              }
            }
          }
        )
      )
    }
  }
}
