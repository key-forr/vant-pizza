// components/PizzaModal/index.tsx
import React, { useState, useEffect } from "react";
import { useParams, redirect, useNavigate } from "react-router-dom";
import styles from "./PizzaModal.module.scss";
import { Pizza } from "../../@types/pizza";
import axios from "axios";
import {
  addItem,
  CartItemType,
  cartSelector,
} from "../../store/slices/cart-slice";
import { useDispatch, useSelector } from "react-redux";

const typeName = ["тонке", "традиційне"];

const PizzaModal: React.FC = () => {
  const [pizza, setPizza] = useState<Pizza | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [activeSize, setActiveSize] = useState(0);
  const [activeType, setActiveType] = useState(0);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchPizza() {
      try {
        setLoading(true);
        const { data } = await axios.get<Pizza>(
          `${process.env.REACT_APP_SERVER_URL}/items/${id}`
        );
        setPizza(data);
      } catch (error) {
        console.error("Помилка при отриманні піци", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPizza();
    }
  }, [id]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !addingToCart) {
      navigate("/");
    }
  };

  const handleClose = () => {
    if (!addingToCart) {
      navigate("/");
    }
  };

  if (!pizza) {
    return;
  }

  const onClickAdd = async () => {
    if (addingToCart) return;

    setAddingToCart(true);
    const item: CartItemType = {
      id: pizza.id,
      title: pizza.title,
      price: pizza.price,
      imageUrl: pizza.imageUrl,
      type: typeName[activeType],
      size: pizza.sizes[activeSize],
      count: 0,
    };
    console.log(item);

    dispatch(addItem(item));

    // Імітуємо затримку для показу стану завантаження
    setTimeout(() => {
      setAddingToCart(false);
      // Закриваємо модальне вікно через 500мс після завершення завантаження
      setTimeout(() => {
        navigate("/");
      }, 500);
    }, 1500); // Показуємо завантаження протягом 1.5 секунд
  };

  if (!pizza) {
    return (
      <div className={styles.modal}>
        <div className={styles.backdrop} onClick={handleBackdropClick}>
          <div className={styles.content}>
            <div className={styles.loading}>Завантаження...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modal}>
      <div className={styles.backdrop} onClick={handleBackdropClick}>
        <div className={styles.content}>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={addingToCart}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className={styles.pizzaDetails}>
            <div className={styles.imageSection}>
              <img
                src={pizza.imageUrl}
                alt={pizza.title}
                className={styles.pizzaImage}
              />
            </div>

            <div className={styles.infoSection}>
              <h2 className={styles.title}>{pizza.title}</h2>

              <div className={styles.rating}>
                <span>Рейтинг: {pizza.rating}/10</span>
              </div>

              <div className={styles.selector}>
                <div className={styles.selectorGroup}>
                  <h4>Тип тіста:</h4>
                  <ul className={styles.options}>
                    {pizza.types.map((type, index) => (
                      <li
                        key={type}
                        onClick={() => !addingToCart && setActiveType(index)}
                        className={`${
                          activeType === index ? styles.active : ""
                        } ${addingToCart ? styles.disabled : ""}`}
                      >
                        {typeName[type]}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.selectorGroup}>
                  <h4>Розмір:</h4>
                  <ul className={styles.options}>
                    {pizza.sizes.map((size, index) => (
                      <li
                        key={size}
                        onClick={() => !addingToCart && setActiveSize(index)}
                        className={`${
                          activeSize === index ? styles.active : ""
                        } ${addingToCart ? styles.disabled : ""}`}
                      >
                        {size} см.
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.price}>від {pizza.price} ₴ </div>
                <button
                  className={`${styles.addButton} ${
                    addingToCart ? styles.loading : ""
                  }`}
                  onClick={onClickAdd}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <>
                      <div className={styles.spinner}></div>
                      <span>Додаю...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                          fill="white"
                        />
                      </svg>
                      <span>Добавити в кошик</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaModal;
