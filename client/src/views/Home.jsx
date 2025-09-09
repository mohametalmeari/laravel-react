import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { axiosClient } from "../lib/axios-client";

export const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    axiosClient("/categories")
      .then(({ data }) => {
        setCategories(data.data);
      })
      .catch()
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between border-b-2 pb-2 border-gray-300 items-center">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button className="outline-btn" onClick={() => navigate("new")}>
          New Category
        </button>
      </div>

      {loading && "Loading..."}

      {!!categories?.length && (
        <table className="w-full mt-8">
          <thead
            align="left"
            className="text-white **:px-4 **:py-2 bg-gray-700"
          >
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 **:px-4 **:py-1 *:odd:bg-gray-100 *:last:border-b *:last:border-b-gray-200 *:hover:bg-blue-100 *:duration-300">
            {categories.map(({ id, name, products }) => (
              <tr key={id} onClick={() => navigate(`/categories/${id}`)}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{products?.length || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
