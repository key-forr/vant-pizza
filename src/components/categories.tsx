const categories = [
  "Все",
  "М'ясні",
  "Вегетеріанські",
  "Гриль",
  "Гострі",
  "Закриті",
];

interface Props {
  value: number;
  onClickCategory: (index: number) => void;
}

const Categories: React.FC<Props> = ({ value, onClickCategory }) => {
  return (
    <div className="categories">
      <ul>
        {categories.map((categoryName, index) => {
          return (
            <li
              key={index}
              onClick={() => onClickCategory(index)}
              className={value === index ? "active" : ""}
            >
              {categoryName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Categories;
