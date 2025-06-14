import { Route, Routes } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import "./scss/app.scss";
import Cart from "./pages/cart";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import Main from "./layouts/main";
import MissingPage from "./layouts/missing-page";
import UserProfile from "./components/UserProfile";
import { useUserSync } from "./hooks/useUserSync";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY as string;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Компонент для ініціалізації синхронізації користувачів
function AppContent() {
  // Цей хук автоматично синхронізує користувачів з базою даних
  useUserSync();

  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route path="/" element={<Home />} />
        <Route path="/pizza/:id" element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>
      <Route path="/" element={<MissingPage />}>
        <Route path="*" element={<NotFound />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppContent />
    </ClerkProvider>
  );
}

export default App;
