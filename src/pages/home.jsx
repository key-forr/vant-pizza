import React, { useEffect, useState } from "react";

import Categories from "../components/categories";
import Sort from "../components/sort";
import PizzaBlock from "../components/PizzaBlock";
import { Skeleton } from "../components/PizzaBlock/skeleton";

const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://681a27391ac1155635080379.mockapi.io/items")
      .then((res) => res.json())
      .then((json) => {
        setPizzas(() => json);
        setIsLoading(false);
      });
  }, []);
  return (
    <>
      <div className="content__top">
        {Categories()}
        {/*<Categories />*/}
        <Sort />
      </div>
      <h2 className="content__title">Всі піци</h2>
      <div className="content__items">
        {isLoading
          ? [...new Array(8)].map((_, index) => <Skeleton key={index} />)
          : pizzas.map((object) => <PizzaBlock key={object.id} {...object} />)}
      </div>
    </>
  );
};

export default Home;
