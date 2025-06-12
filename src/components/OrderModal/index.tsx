import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import "./OrderModal.scss";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  totalCount: number;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  totalPrice,
  totalCount,
}) => {
  const { user } = useUser();
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Будь ласка, введіть адресу доставки");
      return;
    }

    setIsSubmitting(true);

    try {
      // Тут буде логіка відправки замовлення
      const orderData = {
        userEmail: user?.primaryEmailAddress?.emailAddress,
        address: address.trim(),
        totalPrice,
        totalCount,
        timestamp: new Date().toISOString(),
      };

      console.log("Замовлення:", orderData);

      // Симуляція відправки
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Замовлення успішно оформлено!");
      onClose();
      setAddress("");
    } catch (error) {
      console.error("Помилка при оформленні замовлення:", error);
      alert("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="order-modal-overlay" onClick={handleOverlayClick}>
      <div className="order-modal">
        <div className="order-modal__header">
          <h2>Оформлення замовлення</h2>
          <button
            className="order-modal__close"
            onClick={onClose}
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="#B6B6B6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="order-modal__form">
          <div className="order-modal__field">
            <label htmlFor="email">Електронна пошта</label>
            <input
              type="email"
              id="email"
              value={user?.primaryEmailAddress?.emailAddress || ""}
              disabled
              className="order-modal__input order-modal__input--disabled"
            />
          </div>

          <div className="order-modal__field">
            <label htmlFor="address">Адреса доставки *</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Введіть повну адресу доставки..."
              className="order-modal__textarea"
              rows={3}
              required
            />
          </div>

          <div className="order-modal__summary">
            <div className="order-modal__summary-item">
              <span>Кількість піц:</span>
              <span>
                <strong>{totalCount} шт.</strong>
              </span>
            </div>
            <div className="order-modal__summary-item">
              <span>До сплати:</span>
              <span>
                <strong>{totalPrice} грн</strong>
              </span>
            </div>
          </div>

          <div className="order-modal__buttons">
            <button
              type="button"
              onClick={onClose}
              className="button button--outline"
              disabled={isSubmitting}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="button"
              disabled={isSubmitting || !address.trim()}
            >
              {isSubmitting ? "Оформлення..." : "Підтвердити замовлення"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
