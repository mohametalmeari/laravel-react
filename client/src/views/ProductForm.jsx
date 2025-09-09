import { useEffect, useRef, useState } from "react";
import { axiosClient } from "../lib/axios-client";
import serialize from "form-serialize";
import { useNavigate, useParams } from "react-router";
import { displayErrors } from "../lib/helpers";

export const ProductForm = () => {
  const { id } = useParams();

  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState();
  const [product, setProduct] = useState({});
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const nameRef = useRef();
  const descRef = useRef();
  const priceRef = useRef();

  useEffect(() => {
    axiosClient
      .get("/categories")
      .then(({ data: { data } }) => {
        setCategories(data);
      })
      .catch()
      .finally();

    if (id) {
      setDisabled(true);
      axiosClient
        .get(`/products/${id}`)
        .then(({ data: { data } }) => {
          setProduct(data);
          setColors(data.colors);
        })
        .catch((err) => {
          displayErrors({ setErrors, err });
        })
        .finally(() => {
          setDisabled(false);
        });
    }
  }, [id]);

  if (id && !product) {
    return;
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    const data = serialize(ev.target, { hash: true });

    data.colors = data?.colors?.reduce((acc, { name, hex_code }) => {
      acc[name] = hex_code;
      return acc;
    }, {});

    setDisabled(true);
    setErrors(null);
    if (id) {
      axiosClient
        .put(`/products/${id}`, data)
        .then(({ data: { data } }) => {
          navigate(`/products/${data.id}`);
        })
        .catch((err) => {
          displayErrors({ setErrors, err });
        })
        .finally(() => {
          setDisabled(false);
        });
    } else {
      axiosClient
        .post("/products", data)
        .then(({ data: { data } }) => {
          navigate(`/products/${data.id}`);
        })
        .catch((err) => {
          displayErrors({ setErrors, err });
        })
        .finally(() => {
          setDisabled(false);
        });
    }
  };

  const handleReset = (ev) => {
    ev.preventDefault();
    nameRef.current.value = product.name;
    descRef.current.value = product.description;
    priceRef.current.value = product.price;
    setColors(product.colors);
  };

  const removeColor = (ev, index) => {
    ev.preventDefault();
    const _colors = colors.filter((_, i) => i !== index);

    setColors(_colors);
  };

  const updateColor = ({ ev, index, key }) => {
    const value = ev.target.value;

    setColors((prev) => {
      const _colors = [...prev];
      _colors[index] = { ..._colors[index], [key]: value };
      return _colors;
    });
  };

  return (
    <div>
      <div className="flex gap-2 border-b-2 pb-2 border-gray-300 items-center">
        <h1 className="text-2xl font-semibold">
          {id ? "Edit Product" : "New Product"}
        </h1>
        <div className="flex-1" />
        <button
          className="solid-btn"
          onClick={() => {
            navigate("/products");
          }}
          disabled={disabled}
        >
          Cancel
        </button>
      </div>
      <form
        className="edit-new-form mt-8 flex flex-col gap-4"
        onSubmit={onSubmit}
      >
        <select
          name="category_id"
          defaultValue={product?.category_id || 0}
          className="px-10"
        >
          <option value={0} disabled>
            Select Category
          </option>
          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
              selected={product.category_id === category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <input
          name="name"
          type="text"
          placeholder="Product Name"
          defaultValue={product.name}
          ref={nameRef}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          min={0}
          step={0.01}
          defaultValue={product.price}
          ref={priceRef}
        />
        <textarea
          name="description"
          type="text"
          placeholder="Description"
          defaultValue={product.description}
          ref={descRef}
        />
        <button
          className="outline-btn"
          disabled={disabled}
          onClick={(ev) => {
            ev.preventDefault();
            setColors((prev) => prev.concat({}));
          }}
        >
          + Add Color
        </button>
        <div className="flex flex-col gap-2">
          {colors?.map((_, index) => (
            <div className="flex gap-2" key={index}>
              <button
                className="outline-btn peer order-12"
                disabled={disabled}
                onClick={(ev) => removeColor(ev, index)}
              >
                Remove
              </button>
              <input
                name={`colors[${index}][name]`}
                value={colors[index]?.name || ""}
                placeholder="Color Name"
                onChange={(ev) => updateColor({ ev, index, key: "name" })}
                className="peer-hover:bg-red-50"
              />
              <input
                name={`colors[${index}][hex_code]`}
                value={colors[index]?.hex_code || ""}
                placeholder="Color Code"
                className="peer-hover:bg-red-50"
                onChange={(ev) => updateColor({ ev, index, key: "hex_code" })}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {id && (
            <button
              className="outline-btn"
              disabled={disabled}
              onClick={handleReset}
            >
              Reset
            </button>
          )}
          <button className="solid-btn" disabled={disabled}>
            Save
          </button>
        </div>
      </form>
      <div className="flex flex-col mt-2">
        {errors &&
          errors.length &&
          errors.map((err) => (
            <span className="text-sm text-red-600">{err}</span>
          ))}
      </div>
    </div>
  );
};
