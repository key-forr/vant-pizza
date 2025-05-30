import { memo, useEffect, useRef, useState } from "react";
import {
  filterSelector,
  selectSortType,
  sortProperty,
  SortType,
  switchOrder,
} from "../store/slices/filter-slice";
import { useDispatch, useSelector } from "react-redux";

export const sortList: SortType[] = [
  { name: "популярності", sortProperty: sortProperty.RATING },
  { name: "ціні", sortProperty: sortProperty.PRICE },
  { name: "алфавіту", sortProperty: sortProperty.TITLE },
];

interface SortProps {
  sortType: SortType;
  sortOrder: boolean
}

const Sort: React.FC<SortProps> = memo(({ sortType, sortOrder }) => {
  const [isShow, setIsShow] = useState(false);
  const dispatch = useDispatch();
  const sortRef = useRef<HTMLDivElement>(null);

  const onClickListItem = (object: SortType) => {
    dispatch(selectSortType(object));
    setIsShow(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsShow(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={sortRef} className="sort">
      <div className="sort__label">
        <svg
          onClick={() => dispatch(switchOrder())}
          className={sortOrder ? "arrow" : "arrow up"}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
            fill="#2C2C2C"
          />
        </svg>
        <b>Сортування по:</b>
        <span onClick={() => setIsShow(!isShow)}>{sortType.name}</span>
      </div>
      {isShow && (
        <div className="sort__popup">
          <ul>
            {sortList.map((object, index) => (
              <li
                key={index}
                onClick={() => {
                  onClickListItem(object);
                }}
                className={
                  sortType.sortProperty === object.sortProperty ? "active" : ""
                }
              >
                {object.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
})

export default Sort