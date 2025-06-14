import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  CartItemType,
  cartItemByIdSelector,
} from "../../store/slices/cart-slice";
import { Link } from "react-router-dom";

const typeName = ["тонке", "традиційне"];

interface PizzaProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  sizes: number[];
  types: number[];
}

const PizzaBlock: React.FC<PizzaProps> = ({
  id,
  title,
  price,
  imageUrl,
  sizes,
  types,
}) => {
  const dispatch = useDispatch();
  const [activeSize, setActiveSize] = useState(0);
  const [activeType, setActiveType] = useState(0);
  const [isAdding, setIsAdding] = useState(false); // 👈 стейт

  const cartItem = useSelector(cartItemByIdSelector(id));
  const addedCount = cartItem ? cartItem.count : 0;

  const onClickAdd = () => {
    setIsAdding(true); // 👉 блокування кнопки
    const item: CartItemType = {
      id,
      title,
      price: getAdjustedPrice(),
      imageUrl,
      type: typeName[activeType],
      size: sizes[activeSize],
      count: 0,
    };

    setTimeout(() => {
      dispatch(addItem(item));
      setIsAdding(false); // 👉 розблокування після затримки
    }, 1000);
  };
  const getAdjustedPrice = () => {
    const baseSize = sizes[0]; // найменший розмір
    const selectedSize = sizes[activeSize];
    return Math.round(price * (selectedSize / baseSize));
  };
  return (
    <div className="pizza-block-wrapper">
      <div className="pizza-block">
        <Link to={`/pizza/${id}`}>
          <img className="pizza-block__image" src={imageUrl} alt="Pizza" />
        </Link>
        <h4 className="pizza-block__title">{title}</h4>
        <div className="pizza-block__selector">
          <ul>
            {types.map((type, index) => (
              <li
                key={type}
                onClick={() => setActiveType(index)}
                className={activeType === index ? "active" : ""}
              >
                {typeName[type]}
              </li>
            ))}
          </ul>
          <ul>
            {sizes.map((size, index) => (
              <li
                key={size}
                onClick={() => setActiveSize(index)}
                className={activeSize === index ? "active" : ""}
              >
                {size} см.
              </li>
            ))}
          </ul>
        </div>
        <div className="pizza-block__bottom">
          <div className="pizza-block__price">від {getAdjustedPrice()} ₴</div>
          <button
            onClick={onClickAdd}
            className="button button--outline button--add"
            disabled={isAdding} // 👈 блокування
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                fill="white"
              />
            </svg>
            <span>{isAdding ? "Додається..." : "Добавити"}</span>
            {addedCount > 0 && <i>{addedCount}</i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaBlock;
