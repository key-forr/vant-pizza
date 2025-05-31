import { useEffect, useRef } from "react";

import Categories from "../components/categories";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import Sort, { sortList } from "../components/sort";
import PizzaBlock from "../components/PizzaBlock";
import { Skeleton } from "../components/PizzaBlock/skeleton";
import Pagination from "../components/Pagination";
import {  useSelector } from "react-redux";
import {
  filterSelector,
  selectCategory,
  selectPage,
  setFilters,
} from "../store/slices/filter-slice";
import { FetchPizzaProps, fetchPizzas, pizzaSelector } from "../store/slices/pizza-slice";
import { useCallback } from "react";
import { useAppDispatch } from "../store/store";

const Home = () => {
  const { searchValue, categoryId, sortOrder, sortType, pageNumber } =
    useSelector(filterSelector);

  const { pizzas, status } = useSelector(pizzaSelector);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const category = categoryId ? `category=${categoryId}` : "";
  const orderType = sortOrder ? "asc" : "desc";

  const onChangeCategory = useCallback((index: number) => {
    dispatch(selectCategory(index))
  }, [])

  const getPizzas = useCallback(async () => {
    //#region
    // axios
    //   .get(
    //     `${process.env.REACT_APP_SERVER_URL}/items?page=${pageNumber}&limit=4&${category}&sortBy=${sortType.sortProperty}&order=${orderType}`
    //   )
    //   .then((res) => {
    //     setPizzas(res.data);
    //     setIsLoading(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setIsLoading(false);
    //   });
    //#endregion
        
    dispatch(
      fetchPizzas({
        category,
        orderType,
        pageNumber: String(pageNumber),
        sortType,
      })
    );

    window.scrollTo(0, 0);
  }, [pageNumber, category, sortType.sortProperty, orderType]);

  useEffect(() => {
    if (window.location.search) {
      const params = (qs.parse(window.location.search.substring(1)) as unknown) as FetchPizzaProps;
      const sort = sortList.find((obj) => obj.sortProperty === params.sortType.sortProperty) || sortList[0];

      dispatch(
        setFilters({
        sortType: sort,
        categoryId: Number(params.category) || 0,
        pageNumber: Number(params.pageNumber) || 1,
        sortOrder: params.orderType === "asc",
        searchValue: "", 
      } )
      );
      isSearch.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      getPizzas();
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
          onClickCategory={onChangeCategory}
        />
        <Sort sortType={sortType} sortOrder={sortOrder}/>
      </div>
      <h2 className="content__title">Всі піци</h2>
      {status == "error" ? (
        <div className="content__error-info">
          <h2>Виникла помилка</h2>
          <p>
            На жаль, не вдалось получити піци. Попробуйте повторити спробу
            пізніше!
          </p>
        </div>
      ) : (
        <div className="content__items">
          {status == "loading" ? skeletons : items}
        </div>
      )}

      <Pagination
        currentPage={pageNumber}
        onChangePage={(number) => dispatch(selectPage(number))}
      />
    </div>
  );
};

export default Home;
