import { Route, Routes } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import "./scss/app.scss";
import Cart from "./pages/cart";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import Main from "./layouts/main";
import MissingPage from "./layouts/missing-page";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY as string;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route path="/" element={<Home />} />
          <Route path="/pizza/:id" element={<Home />} />
        </Route>
        <Route path="/" element={<MissingPage />}>
          <Route path="*" element={<NotFound />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </ClerkProvider>
  );
}

export default App;
