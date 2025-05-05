import React, { useState } from "react";

export default function Categories() {
  const [activeIndex, setActiveIndex] = useState(0);

  const categories = [
    "Все",
    "М'ясні",
    "Вегетеріанські",
    "Гриль",
    "Гострі",
    "Закриті",
  ];

  const onClickCategory = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="categories">
      <ul>
        {categories.map((value, index) => {
          return (
            <li
              key={index}
              onClick={() => onClickCategory(index)}
              className={activeIndex === index ? "active" : ""}
            >
              {value}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
