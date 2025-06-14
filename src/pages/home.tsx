import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import Categories from "../components/categories";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import Sort, { sortList } from "../components/sort";
import PizzaBlock from "../components/PizzaBlock";
import { Skeleton } from "../components/PizzaBlock/skeleton";
import Pagination from "../components/Pagination";
import PizzaModal from "../components/PizzaModal";
import { useSelector } from "react-redux";
import {
  filterSelector,
  selectCategory,
  selectPage,
  setFilters,
  FilterStateProps,
} from "../store/slices/filter-slice";
import {
  FetchPizzaProps,
  fetchPizzas,
  pizzaSelector,
} from "../store/slices/pizza-slice";
import { useCallback } from "react";
import { useAppDispatch } from "../store/store";
import { useAuthInitialization } from "../hooks/useAuthInitialization";

// Интерфейс для URL параметров
interface URLParams {
  sortType?: string;
  category?: string;
  pageNumber?: string;
  orderType?: string;
}

const Home = () => {
  useAuthInitialization();
  const { searchValue, categoryId, sortOrder, sortType, pageNumber } =
    useSelector(filterSelector);

  const { pizzas, status } = useSelector(pizzaSelector);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Отримуємо ID піци з URL параметрів
  const { id: pizzaId } = useParams<{ id?: string }>();

  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const category = categoryId ? `category=${categoryId}` : "";
  const orderType = sortOrder ? "asc" : "desc";

  const onChangeCategory = useCallback(
    (index: number) => {
      dispatch(selectCategory(index));
    },
    [dispatch]
  );

  const getPizzas = useCallback(async () => {
    dispatch(
      fetchPizzas({
        category,
        orderType,
        pageNumber: String(pageNumber),
        sortType,
      })
    );

    window.scrollTo(0, 0);
  }, [dispatch, pageNumber, category, sortType, orderType]);

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(
        window.location.search.substring(1)
      ) as unknown as URLParams;

      // ВИПРАВЛЕННЯ: Правильне отримання sortType з URL
      let sort = sortList[0]; // Дефолтне значення

      if (params.sortType) {
        // Шукаємо sort об'єкт за sortProperty
        const foundSort = sortList.find(
          (obj) => obj.sortProperty === params.sortType
        );
        if (foundSort) {
          sort = foundSort;
        }
      }

      dispatch(
        setFilters({
          sortType: sort,
          categoryId: Number(params.category) || 0,
          pageNumber: Number(params.pageNumber) || 1,
          sortOrder: params.orderType === "asc",
          searchValue: "",
        })
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
  }, [categoryId, sortType, orderType, pageNumber, getPizzas]);

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
    <>
      <div className="container">
        <div className="content__top">
          <Categories value={categoryId} onClickCategory={onChangeCategory} />
          <Sort sortType={sortType} sortOrder={sortOrder} />
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

      {/* Модальне вікно відображається поверх контенту */}
      {pizzaId && <PizzaModal />}
    </>
  );
};

export default Home;
