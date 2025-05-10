import { Route, Routes } from "react-router-dom";

import Header from "./components/header";

import "./scss/app.scss";
import Cart from "./pages/cart";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import { useState } from "react";

function App() {
  // const pathname = window.location.pathname;
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="wrapper">
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="content">
        {/*pathname === "/" && <Home /> -- простіше кажучи менш гібкий спосіб тому що не працює з динамічними роутами. Перевірка строга*/}
        <Routes>
          <Route path="/" element={<Home searchValue={searchValue} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
