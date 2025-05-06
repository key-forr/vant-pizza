import React, { useEffect, useState } from "react";

import Header from "./components/header";
import Categories from "./components/categories";
import Sort from "./components/sort";
import PizzaBlock from "./components/pizza-block";

import "./scss/app.scss";

function App() {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    fetch("https://681a27391ac1155635080379.mockapi.io/items")
      .then((res) => res.json())
      .then((json) => {
        setPizzas(() => json);
      });
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <div className="container">
          <div className="content__top">
            {Categories()}
            {/*<Categories />*/}
            <Sort />
          </div>
          <h2 className="content__title">Всі піци</h2>
          <div className="content__items">
            {pizzas.map((object) => {
              return <PizzaBlock key={object.id} {...object} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
