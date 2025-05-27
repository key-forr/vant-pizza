import { Link } from "react-router-dom";

import cartEmptyImage from "../assets/img/empty-cart.png";
const CartEmpty = () => {
  return (
    <>
      <div class="cart cart--empty">
        <h2>
          Кошик пустий <icon>😕</icon>
        </h2>
        <p>
          Найімовірніше, ви не замовляли ще піцу.
          <br />
          Щоб замовити піцу, перейди на головну сторінку.
        </p>
        <img src={cartEmptyImage} alt="Empty cart" />
        <Link to="/" class="button button--black">
          <span>Вернутись назад</span>
        </Link>
      </div>
    </>
  );
};

export default CartEmpty;
