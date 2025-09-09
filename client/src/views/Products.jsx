import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { axiosClient } from "../lib/axios-client";

export const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    axiosClient("/products")
      .then(({ data }) => {
        setProducts(data.data);
      })
      .catch()
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex justify-between border-b-2 pb-2 border-gray-300 items-center">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button className="outline-btn" onClick={() => navigate("new")}>
          New Product
        </button>
      </div>

      {loading && "Loading..."}

      {!!products?.length && (
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
            {products.map(({ id, name, price, colors }) => (
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
