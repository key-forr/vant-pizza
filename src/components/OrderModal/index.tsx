import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useUserSync } from "../../hooks/useUserSync";
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
  const { dbUser } = useUserSync();

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pointsToUse, setPointsToUse] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Автозаповнення полів при відкритті модального вікна
  useEffect(() => {
    if (isOpen) {
      // Заповнюємо email з Clerk або з профілю
      setEmail(user?.primaryEmailAddress?.emailAddress || "");

      // Заповнюємо адресу та телефон з профілю в базі даних, якщо вони є
      setAddress(dbUser?.address || "");
      setPhone(dbUser?.phone || "");
    }
  }, [isOpen, user, dbUser]);

  // Очищення полів при закритті модального вікна
  const resetForm = () => {
    setEmail("");
    setAddress("");
    setPhone("");
    setPointsToUse(0);
  };

  // Обчислення фінальної суми з урахуванням знижки
  const discount = pointsToUse; // 1 бал = 1 грн знижки
  const finalPrice = Math.max(0, totalPrice - discount);
  const maxPointsToUse = Math.min(dbUser?.points || 0, totalPrice);

  const handlePointsChange = (value: number) => {
    const points = Math.max(0, Math.min(value, maxPointsToUse));
    setPointsToUse(points);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Будь ласка, введіть електронну пошту");
      return;
    }

    if (!address.trim()) {
      alert("Будь ласка, введіть адресу доставки");
      return;
    }

    if (!phone.trim()) {
      alert("Будь ласка, введіть номер телефону");
      return;
    }

    setIsSubmitting(true);

    try {
      // Тут буде логіка відправки замовлення
      const orderData = {
        userEmail: email.trim(),
        address: address.trim(),
        phone: phone.trim(),
        totalPrice,
        pointsUsed: pointsToUse,
        discount,
        finalPrice,
        totalCount,
        timestamp: new Date().toISOString(),
      };

      console.log("Замовлення:", orderData);

      // Симуляція відправки
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Замовлення успішно оформлено!");
      onClose();
      resetForm();
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
      resetForm();
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="order-modal-overlay" onClick={handleOverlayClick}>
      <div className="order-modal">
        <div className="order-modal__header">
          <h2>Оформлення замовлення</h2>
          <button
            className="order-modal__close"
            onClick={handleClose}
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
            <label htmlFor="email">Електронна пошта *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введіть електронну пошту..."
              className="order-modal__input"
              required
            />
          </div>

          <div className="order-modal__field">
            <label htmlFor="phone">Номер телефону *</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+380XXXXXXXXX"
              className="order-modal__input"
              required
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

          {/* Поле для використання балів */}
          {dbUser && dbUser.points > 0 && (
            <div className="order-modal__field">
              <label htmlFor="points">
                Використати бали (доступно: {dbUser.points} балів)
              </label>
              <div className="order-modal__points-container">
                <input
                  type="number"
                  id="points"
                  value={pointsToUse}
                  onChange={(e) =>
                    handlePointsChange(parseInt(e.target.value) || 0)
                  }
                  min="0"
                  max={maxPointsToUse}
                  placeholder="0"
                  className="order-modal__input"
                />
                <div className="order-modal__points-actions">
                  <button
                    type="button"
                    onClick={() => setPointsToUse(0)}
                    className="order-modal__points-btn"
                    disabled={pointsToUse === 0}
                  >
                    Очистити
                  </button>
                  <button
                    type="button"
                    onClick={() => setPointsToUse(maxPointsToUse)}
                    className="order-modal__points-btn"
                    disabled={pointsToUse === maxPointsToUse}
                  >
                    Максимум
                  </button>
                </div>
              </div>
              <div className="order-modal__points-info">
                1 бал = 1 грн знижки
              </div>
            </div>
          )}

          <div className="order-modal__summary">
            <div className="order-modal__summary-item">
              <span>Кількість піц:</span>
              <span>
                <strong>{totalCount} шт.</strong>
              </span>
            </div>
            <div className="order-modal__summary-item">
              <span>Вартість замовлення:</span>
              <span>
                <strong>{totalPrice} грн</strong>
              </span>
            </div>
            {pointsToUse > 0 && (
              <div className="order-modal__summary-item order-modal__summary-item--discount">
                <span>Знижка ({pointsToUse} балів):</span>
                <span>
                  <strong>-{discount} грн</strong>
                </span>
              </div>
            )}
            <div className="order-modal__summary-item order-modal__summary-item--total">
              <span>До сплати:</span>
              <span>
                <strong>{finalPrice} грн</strong>
              </span>
            </div>
          </div>

          <div className="order-modal__buttons">
            <button
              type="button"
              onClick={handleClose}
              className="button button--outline"
              disabled={isSubmitting}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="button"
              disabled={
                isSubmitting ||
                !email.trim() ||
                !address.trim() ||
                !phone.trim()
              }
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
