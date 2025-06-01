import { Route, Routes } from "react-router-dom";

import "./scss/app.scss";
import Cart from "./pages/cart";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import Pizza from "./pages/pizza";
import Main from "./layouts/main";

// export const SearchContext = createContext();

function App() {
  // const pathname = window.location.pathname;
  //const [searchValue, setSearchValue] = useState("");

  return (
    //#region
    // <div className="wrapper">
    //   {/* <SearchContext.Provider value={{ searchValue, setSearchValue }}> */}
    //   <Header />
    //   <div className="content">
    //     {/*pathname === "/" && <Home /> -- простіше кажучи менш гібкий спосіб тому що не працює з динамічними роутами. Перевірка строга*/}
    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/cart" element={<Cart />} />
    //       <Route path="/pizza/:id" element={<Pizza />} />
    //       <Route path="*" element={<NotFound />} />
    //     </Routes>
    //   </div>
    //   {/* </SearchContext.Provider> */}
    // </div>
    //#endregion

    // App.tsx або де у вас налаштовані Routes
    <Routes>
      <Route path="/" element={<Main />}>
        <Route path="/" element={<Home />} />
        <Route path="/pizza/:id" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
