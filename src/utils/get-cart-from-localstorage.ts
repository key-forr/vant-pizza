import { calcTotalPrice } from "./calc-total-price"

export const getCartFromLocalStorage = () => {
    const data = localStorage.getItem('vant-pizza-cart')
    const items = data ? JSON.parse(data) : []
    const totalPrice = calcTotalPrice(items)

    return { items, totalPrice }
}