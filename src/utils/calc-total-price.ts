import { CartItemType } from "../store/slices/cart-slice";

export const calcTotalPrice =(items: CartItemType[]) => {
     return items.reduce((sum, obj) =>  obj.price * obj.count + sum, 0);
}