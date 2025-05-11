import { Route, Routes } from "react-router-dom";

import Header from "./components/header";

import "./scss/app.scss";
import Cart from "./pages/cart";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import { createContext, useState } from "react";

export const SearchContext = createContext();

function App() {
  // const pathname = window.location.pathname;
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="wrapper">
      <SearchContext.Provider value={{ searchValue, setSearchValue }}>
        <Header />
        <div className="content">
          {/*pathname === "/" && <Home /> -- простіше кажучи менш гібкий спосіб тому що не працює з динамічними роутами. Перевірка строга*/}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </SearchContext.Provider>
    </div>
  );
}

export default App;
