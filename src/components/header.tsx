import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import logo from "../assets/img/pizza-logo.svg";
import Search from "./Search";
import { useSelector } from "react-redux";
import { cartSelector } from "../store/slices/cart-slice";
import { useEffect, useRef, useState } from "react";
import { useUserSync } from "../hooks/useUserSync";

function Header() {
  const { totalPrice, items } = useSelector(cartSelector);
  const { clerkUser, dbUser, loading } = useUserSync();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isClerkMenuOpen, setIsClerkMenuOpen] = useState(false);

  const isMounted = useRef(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalCount = items.reduce(
    (sum: number, item: any) => sum + item.count,
    0
  );

  useEffect(() => {
    if (isMounted.current) {
      const json = JSON.stringify(items);
      localStorage.setItem("vant-pizza-cart", json);
    }

    isMounted.current = true;
  }, [items]);

  // Закриття меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Перевіряємо чи клік був поза нашим меню
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        // Додаткова перевірка для Clerk елементів
        const isClerkElement =
          target.closest("[data-clerk-element]") ||
          target.closest(".cl-rootBox") ||
          target.closest(".cl-card") ||
          target.closest(".cl-modalContent") ||
          target.closest(".cl-userButtonPopoverCard") ||
          target.closest('[data-testid="user-button-popover"]');

        if (isClerkElement) {
          // Якщо клік на Clerk елементі, відзначаємо що Clerk меню відкрите
          setIsClerkMenuOpen(true);
          // Скасовуємо попередній таймер
          if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
          }
        } else {
          // Якщо клік поза всіма меню, закриваємо наше меню
          setShowUserMenu(false);
          setIsClerkMenuOpen(false);
        }
      }
    };

    // Відстежуємо зміни в DOM для визначення коли Clerk меню закривається
    const observer = new MutationObserver(() => {
      const clerkPopover = document.querySelector(
        '[data-testid="user-button-popover"], .cl-userButtonPopoverCard'
      );
      if (isClerkMenuOpen && !clerkPopover) {
        // Clerk меню закрилося, ставимо таймер для закриття нашого меню
        closeTimeoutRef.current = setTimeout(() => {
          setIsClerkMenuOpen(false);
        }, 100);
      }
    });

    // Додаємо слухач події тільки коли меню відкрите
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // Очищаємо слухач при размонтуванні або закритті меню
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      observer.disconnect();
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [showUserMenu, isClerkMenuOpen]);

  // Функція для обробки кліку на аватар
  const handleAvatarClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  return (
    <div className="header">
      <div className="container">
        <Link to="/">
          <div className="header__logo">
            <img width="38" src={logo} alt="Pizza logo" />
            <div>
              <h1>Vant Pizza</h1>
              <p>найсмачніша піца в світі</p>
            </div>
          </div>
        </Link>

        <div className="header__right">
          <Search />

          <div className="header__auth">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="button button--outline button--auth">
                  Увійти
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="header__user-section">
                {/* Інформація про користувача */}
                <div className="header__user-info">
                  <span className="header__welcome">
                    {clerkUser?.firstName || clerkUser?.username}
                  </span>
                  {dbUser && (
                    <span className="header__points">
                      {dbUser.points} балів
                    </span>
                  )}
                </div>

                {/* Меню користувача */}
                <div className="header__user-menu" ref={userMenuRef}>
                  <button
                    className="header__user-avatar"
                    onClick={handleAvatarClick}
                  >
                    {clerkUser?.imageUrl ? (
                      <img
                        src={clerkUser.imageUrl}
                        alt="Avatar"
                        className="avatar-img"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {(clerkUser?.firstName ||
                          clerkUser?.username ||
                          "U")[0].toUpperCase()}
                      </div>
                    )}
                  </button>

                  {showUserMenu && (
                    <div className="header__dropdown">
                      <Link
                        to="/profile"
                        className="dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Мій профіль
                      </Link>

                      <div className="dropdown-divider"></div>

                      {/* Clerk UserButton для виходу */}
                      <UserButton
                        appearance={{
                          elements: {
                            rootBox: "dropdown-clerk-btn",
                            avatarBox: "hidden",
                          },
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </SignedIn>
          </div>

          <div className="header__cart">
            <Link to="/cart" className="button button--cart">
              <span>{totalPrice} грн</span>
              <div className="button__delimiter"></div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.33333 16.3333C7.06971 16.3333 7.66667 15.7364 7.66667 15C7.66667 14.2636 7.06971 13.6667 6.33333 13.6667C5.59695 13.6667 5 14.2636 5 15C5 15.7364 5.59695 16.3333 6.33333 16.3333Z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.3333 16.3333C15.0697 16.3333 15.6667 15.7364 15.6667 15C15.6667 14.2636 15.0697 13.6667 14.3333 13.6667C13.597 13.6667 13 14.2636 13 15C13 15.7364 13.597 16.3333 14.3333 16.3333Z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.78002 4.99999H16.3334L15.2134 10.5933C15.1524 10.9003 14.9854 11.176 14.7417 11.3722C14.4979 11.5684 14.1929 11.6727 13.88 11.6667H6.83335C6.50781 11.6694 6.1925 11.553 5.94689 11.3393C5.70128 11.1256 5.54233 10.8295 5.50002 10.5067L4.48669 2.82666C4.44466 2.50615 4.28764 2.21182 4.04482 1.99844C3.80201 1.78505 3.48994 1.66715 3.16669 1.66666H1.66669"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{totalCount}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
