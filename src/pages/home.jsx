import { useContext, useEffect, useRef, useState } from "react";

import Categories from "../components/categories";
import qs from "qs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sort, { sortList } from "../components/sort";
import PizzaBlock from "../components/PizzaBlock";
import { Skeleton } from "../components/PizzaBlock/skeleton";
import Pagination from "../components/Pagination";
import { SearchContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCategory,
  selectPage,
  setFilters,
} from "../store/slices/filter-slice";
import { useCallback } from "react";

const Home = () => {
  const { searchValue } = useContext(SearchContext);
  const { categoryId, sortOrder, sortType, pageNumber } = useSelector(
    (state) => state.filter
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const category = categoryId ? `category=${categoryId}` : "";
  const orderType = sortOrder ? "asc" : "desc";

  const fetchPizzas = useCallback(() => {
    setIsLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}/items?page=${pageNumber}&limit=4&${category}&sortBy=${sortType.sortProperty}&order=${orderType}`
      )
      .then((res) => {
        setPizzas(res.data);
        setIsLoading(false);
      });
  }, [pageNumber, category, sortType.sortProperty, orderType]);

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sort = sortList.find((obj) => obj.sortProperty === params.sortType);
      dispatch(
        setFilters({
          ...params,
          sortType: sort,
        })
      );
      isSearch.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      fetchPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sortType, orderType, pageNumber, fetchPizzas]);

  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortType: sortType.sortProperty,
        categoryId,
        pageNumber,
        orderType,
      });
      console.log(queryString);
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sortType, orderType, pageNumber, navigate]);
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
