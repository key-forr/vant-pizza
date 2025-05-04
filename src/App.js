import React from "react";

import Header from "./components/header";
import Categories from "./components/categories";
import Sort from "./components/sort";
import PizzaBlock from "./components/pizza-block";

import "./scss/app.scss";

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
            <PizzaBlock title="Мексиканська" price={200} />
            <PizzaBlock title="Маргарита" price="155" />
            <PizzaBlock title="Квадро-стаджіоне" price="300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
