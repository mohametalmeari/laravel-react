import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { axiosClient } from "../lib/axios-client";
import { NotFound } from "./NotFound";

export const Product = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [disabled, setDisabled] = useState(false);
  const [category, setCategory] = useState(null);

  const fetchCategory = (id) => {
    axiosClient.get(`/categories/${id}`).then(({ data: { data } }) => {
      setCategory(data);
    });
  };

  useEffect(() => {
    setLoading(true);
    axiosClient(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data.data);
        fetchCategory(data.data.category_id);
      })
      .catch(({ response }) => {
        setError(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, setProduct]);

  const handleDelete = () => {
    setDisabled(true);
    axiosClient
      .delete(`/products/${id}`)
      .then(() => {
        navigate("/products");
      })
      .catch()
      .finally(() => {
        setDisabled(false);
      });
  };

  if (loading) return "Loading...";

  if (error) return <NotFound />;

  if (!product || !category) return "Loading...";

  return (
    <div>
      <div className="flex gap-2 border-b-2 pb-2 border-gray-300 items-center">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="flex-1" />
        <button
          className="outline-btn"
          onClick={() => navigate(`edit`)}
          disabled={disabled}
        >
          Edit
        </button>
        <button
          className="solid-btn"
          onClick={handleDelete}
          disabled={disabled}
        >
          Delete
        </button>
      </div>

      <ul className="mt-4 text-xl flex flex-col gap-2">
        <li>
          <span className="font-semibold">Description: </span>

          {product.description}
        </li>
        <li>
          <span className="font-semibold">Price: </span>${product.price}
        </li>
        <li className="flex flex-col gap-1">
          <span className="font-semibold">
            Colors: {!product.colors.length && "-"}
          </span>

          <div className="flex gap-1 flex-col w-fit ms-8 text-lg">
            {product.colors.map(({ name, hex_code }) => (
              <p key={name + hex_code} className="flex items-center gap-2">
                <span
                  className="border border-gray-300 p-2 rounded-full inline-block"
                  style={{ backgroundColor: hex_code }}
                />
                <span>{name}</span>
              </p>
            ))}
          </div>
        </li>
        <li>
          <span className="bg-blue-200 p-1 px-2 border border-blue-300 text-blue-700 rounded-md text-xs">
            # {category?.name}
          </span>
        </li>
      </ul>
    </div>
  );
};
