import { useContext, useEffect, useState } from "react";

import Categories from "../components/categories";
import axios from "axios";
import Sort from "../components/sort";
import PizzaBlock from "../components/PizzaBlock";
import { Skeleton } from "../components/PizzaBlock/skeleton";
import Pagination from "../components/Pagination";
import { SearchContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { selectCategory, selectPage } from "../store/slices/filter-slice";

const Home = () => {
  const { searchValue } = useContext(SearchContext);
  const { categoryId, sortType, sortOrder, pageNumber } = useSelector(
    (state) => state.filter
  );
  const dispatch = useDispatch();

  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const category = categoryId ? `category=${categoryId}` : "";
  const orderType = sortOrder ? "asc" : "desc";

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `https://681a27391ac1155635080379.mockapi.io/items?page=${pageNumber}&limit=4&${category}&sortBy=${sortType.sortProperty}&order=${orderType}`
      )
      .then((res) => {
        setPizzas(res.data);
        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [categoryId, sortType, orderType, pageNumber]);

  const items = pizzas
    .filter((pizza) =>
      pizza.title.toLowerCase().includes(searchValue.toLowerCase())
    )
    .map((object) => <PizzaBlock key={object.id} {...object} />);

  const skeletons = [...new Array(8)].map((_, index) => (
    <Skeleton key={index} />
  ));

  return (
    <div className="container">
      <div className="content__top">
        {/* {Categories({
          value: categoryId,
          onClickCategory: (index) => onClickCategory(index),
        })} */}
        <Categories
          value={categoryId}
          onClickCategory={(index) => dispatch(selectCategory(index))}
        />
        <Sort />
      </div>
      <h2 className="content__title">Всі піци</h2>
      <div className="content__items">{isLoading ? skeletons : items}</div>
      <Pagination
        currentPage={pageNumber}
        onChangePage={(number) => dispatch(selectPage(number))}
      />
    </div>
  );
};

export default Home;
