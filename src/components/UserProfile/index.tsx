import React, { useState } from "react";
import { useUserSync } from "../../hooks/useUserSync";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Trophy,
  Edit,
  AlertCircle,
  Loader2,
} from "lucide-react";
import "./UserProfile.scss";

const UserProfile: React.FC = () => {
  const { clerkUser, dbUser, loading, error, updateUserProfile } =
    useUserSync();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
  });

  React.useEffect(() => {
    if (dbUser) {
      setFormData({
        address: dbUser.address || "",
        phone: dbUser.phone || "",
      });
    }
  }, [dbUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateUserProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <Loader2 className="loading-spinner" size={50} />
        <div className="loading-text">Завантаження профілю...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <AlertCircle className="error-icon" size={48} />
        <div className="error-text">Помилка: {error}</div>
      </div>
    );
  }

  if (!clerkUser || !dbUser) {
    return (
      <div className="error">
        <User className="error-icon" size={48} />
        <div className="error-text">Користувач не знайдений</div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="container">
        <h2>Профіль користувача</h2>

        <div className="profile-info">
          <div className="profile-section">
            <h3>Основна інформація</h3>

            <div className="user-info-item">
              <span className="info-label">
                <User size={16} />
                Ім'я
              </span>
              <span className="info-value">
                {clerkUser.firstName || "Не вказано"}
              </span>
            </div>

            <div className="user-info-item">
              <span className="info-label">
                <User size={16} />
                Username
              </span>
              <span className="info-value">
                {clerkUser.username || "Не вказано"}
              </span>
            </div>

            <div className="user-info-item">
              <span className="info-label">
                <Mail size={16} />
                Email
              </span>
              <span className="info-value">
                {clerkUser.primaryEmailAddress?.emailAddress || "Не вказано"}
              </span>
            </div>

            {/* Спеціальне відображення балів */}
            <div className="points-display">
              <Trophy className="points-icon" size={24} />
              <div className="points-value">{dbUser.points}</div>
              <div className="points-label">Бали</div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Контактна інформація</h3>
            {!isEditing ? (
              <div>
                <div className="user-info-item">
                  <span className="info-label">
                    <MapPin size={16} />
                    Адреса
                  </span>
                  <span
                    className={`info-value ${!dbUser.address ? "empty" : ""}`}
                  >
                    {dbUser.address || "Не вказано"}
                  </span>
                </div>

                <div className="user-info-item">
                  <span className="info-label">
                    <Phone size={16} />
                    Телефон
                  </span>
                  <span
                    className={`info-value ${!dbUser.phone ? "empty" : ""}`}
                  >
                    {dbUser.phone || "Не вказано"}
                  </span>
                </div>

                <button
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} />
                  Редагувати
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="address">Адреса</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Введіть вашу адресу"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Телефон</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+380..."
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="button">
                    Зберегти
                  </button>
                  <button
                    type="button"
                    className="button button--outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Скасувати
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
