import React from "react";

import Header from "./components/header";
import Categories from "./components/categories";
import Sort from "./components/sort";
import PizzaBlock from "./components/pizza-block";

import "./scss/app.scss";

import pizzas from "./assets/pizza.json";

function App() {
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
