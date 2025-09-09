import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { axiosClient } from "../lib/axios-client";
import { useStateContext } from "../contexts/StateProvider";
import { NotFound } from "./NotFound";

export const Category = () => {
  const { id } = useParams();

  const {
    user: { is_admin },
  } = useStateContext();

  const navigate = useNavigate();

  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosClient(`/categories/${id}`)
      .then(({ data }) => {
        setCategory(data.data);
      })
      .catch(({ response }) => {
        setError(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, setCategory]);

  const handleDelete = () => {
    setDisabled(true);
    axiosClient
      .delete(`/categories/${id}`)
      .then(() => {
        navigate("/categories");
      })
      .catch()
      .finally(() => {
        setDisabled(false);
      });
  };

  if (loading) return "Loading...";

  if (error) return <NotFound />;

  if (!category) return "Loading...";

  return (
    <div>
      <div className="flex gap-2 border-b-2 pb-2 border-gray-300 items-center">
        <h1 className="text-2xl font-semibold">{category.name}</h1>
        <div className="flex-1" />
        {!!is_admin && (
          <button
            className="outline-btn"
            onClick={() => navigate(`edit`)}
            disabled={disabled}
          >
            Edit
          </button>
        )}
        <button
          className="solid-btn"
          onClick={handleDelete}
          disabled={disabled}
        >
          Delete
        </button>
      </div>

      {!!category?.products?.length && (
        <table className="w-full mt-8">
          <thead align="left">
            <tr className="text-white *:px-4 *:py-2 bg-gray-700">
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Colors</th>
            </tr>
          </thead>
          <tbody>
            {category?.products?.map(({ id, name, price, colors }) => (
              <tr
                key={id}
                onClick={() => navigate(`/products/${id}`)}
                className="*:px-4 *:py-1 text-gray-700 odd:bg-gray-100 last:border-b last:border-b-gray-200 hover:bg-blue-100 duration-300 text-sm sm:text-base"
              >
                <td>
                  {id.slice(0, 3)}...{id.slice(-3)}
                </td>
                <td>{name}</td>
                <td>${price}</td>
                <td>
                  <div className="flex gap-1 flex-col sm:flex-row items-center">
                    {colors.map(({ name, hex_code }) => (
                      <span
                        key={id + name + hex_code}
                        className="border border-gray-300 p-2 rounded-full"
                        style={{ backgroundColor: hex_code }}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
