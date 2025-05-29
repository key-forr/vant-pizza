import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface PizzaData {
  imageUrl: string;
  title: string;
  price: number;
}

const Pizza: React.FC = () => {
  const [pizza, setPizza] = useState<PizzaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    async function fetchPizza() {
      try {
        setLoading(true);
        const { data } = await axios.get<PizzaData>(
          `${process.env.REACT_APP_SERVER_URL}/items/${id}`
        );
        setPizza(data);
      } catch (error) {
        console.error("Помилка при отриманні піци", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPizza();
    }
  }, [id]);

  return (
    <div className="container">
      {loading ? (
        <div>Завантаження піци...</div>
      ) : pizza ? (
        <>
          <img src={pizza.imageUrl} alt={pizza.title} />
          <h2>{pizza.title}</h2>
          <h4>{pizza.price} грн</h4>
          <Link to="/">
            <button className="button button--outline button--add">
              <span>Назад</span>
            </button>
          </Link>
        </>
      ) : (
        <div>Піцу не знайдено</div>
      )}
    </div>
  );
};

export default Pizza;
