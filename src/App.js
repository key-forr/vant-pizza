import { Route, Routes } from "react-router-dom";

import Header from "./components/header";

import "./scss/app.scss";
import Cart from "./pages/cart";
import Home from "./pages/home";
import NotFound from "./pages/not-found";

function App() {
  // const pathname = window.location.pathname;

  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <div className="container">
          {/*pathname === "/" && <Home /> -- простіше кажучи менш гібкий спосіб тому що не працює з динамічними роутами. Перевірка строга*/}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
