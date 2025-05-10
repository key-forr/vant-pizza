import { useEffect, useState } from "react";

import Categories from "../components/categories";
import Sort from "../components/sort";
import PizzaBlock from "../components/PizzaBlock";
import { Skeleton } from "../components/PizzaBlock/skeleton";

const Home = () => {
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(0);
  const [sortType, setSortType] = useState({
    name: "популярності",
    sortProperty: "rating",
  });
  const [sortOrder, setSortOrder] = useState(true);

  const category = categoryId ? `category=${categoryId}` : "";
  const orderType = sortOrder ? "asc" : "desc";

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://681a27391ac1155635080379.mockapi.io/items?${category}&sortBy=${sortType.sortProperty}&order=${orderType}
      `
    )
      .then((res) => res.json())
      .then((json) => {
        setPizzas(() => json);
        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [categoryId, sortType, orderType]);

  return (
    <div className="container">
      <div className="content__top">
        {/* {Categories({
          value: categoryId,
          onClickCategory: (index) => onClickCategory(index),
        })} */}
        <Categories
          value={categoryId}
          onClickCategory={(index) => setCategoryId(index)}
        />
        <Sort
          value={sortType}
          onClickSort={(object) => setSortType(object)}
          sortOrder={sortOrder}
          onClickOrder={() => setSortOrder(!sortOrder)}
        />
      </div>
      <h2 className="content__title">Всі піци</h2>
      <div className="content__items">
        {isLoading
          ? [...new Array(8)].map((_, index) => <Skeleton key={index} />)
          : pizzas.map((object) => <PizzaBlock key={object.id} {...object} />)}
      </div>
    </div>
  );
};

export default Home;
