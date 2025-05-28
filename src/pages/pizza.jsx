import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Pizza = () => {
  const [pizza, setPizza] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/items/${id}`
        );
        setPizza(data);
      } catch (error) {
        console.log("Помилка при получені піци", error);
      }
    }

    fetchPizza();
  }, []);

  return (
    <div className="container">
      <img src={pizza.imageUrl} />
      <h2>{pizza.title}</h2>
      <h4>{pizza.price} грн</h4>
      <Link to="/">
        <button className="button button--outline button--add">
          <span>Назад</span>
        </button>
      </Link>
    </div>
  );
};
export default Pizza;
