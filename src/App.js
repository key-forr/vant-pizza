import React from "react";

import Header from "./components/header";
import Categories from "./components/categories";
import Sort from "./components/sort";
import PizzaBlock from "./components/pizza-block";

import "./scss/app.scss";

function App() {
  return (
    <div class="wrapper">
      <Header />
      <div class="content">
        <div class="container">
          <div class="content__top">
            {Categories()}
            {/*<Categories />*/}
            <Sort />
          </div>
          <h2 class="content__title">Всі піци</h2>
          <div class="content__items">
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
