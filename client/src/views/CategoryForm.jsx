import { useEffect, useRef, useState } from "react";
import { axiosClient } from "../lib/axios-client";
import serialize from "form-serialize";
import { Navigate, useNavigate, useParams } from "react-router";
import { displayErrors } from "../lib/helpers";
import { useStateContext } from "../contexts/StateProvider";

export const CategoryForm = () => {
  const { id } = useParams();

  const { user } = useStateContext();

  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState();
  const [category, setCategory] = useState({});

  const navigate = useNavigate();

  const nameRef = useRef();

  useEffect(() => {
    if (id) {
      setDisabled(true);
      axiosClient
        .get(`/categories/${id}`)
        .then(({ data: { data } }) => {
          setCategory(data);
        })
        .catch((err) => {
          displayErrors({ setErrors, err });
        })
        .finally(() => {
          setDisabled(false);
        });
    }
  }, [id]);

  if (!user.email) {
    return;
  }

  if (id && user.email && !user.is_admin) {
    return <Navigate to={"/categories"} />;
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    const data = serialize(ev.target, { hash: true });
    setDisabled(true);
    setErrors(null);
    if (id) {
      axiosClient
        .put(`/categories/${id}`, data)
        .then(({ data: { data } }) => {
          navigate(`/categories/${data.id}`);
        })
        .catch((err) => {
          displayErrors({ setErrors, err });
        })
        .finally(() => {
          setDisabled(false);
        });
    } else {
      axiosClient
        .post("/categories", data)
        .then(({ data: { data } }) => {
          navigate(`/categories/${data.id}`);
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
    nameRef.current.value = category.name;
  };

  return (
    <div>
      <div className="flex gap-2 border-b-2 pb-2 border-gray-300 items-center">
        <h1 className="text-2xl font-semibold">
          {id ? "Edit Category" : "New Category"}
        </h1>
        <div className="flex-1" />
        <button
          className="solid-btn"
          onClick={() => {
            navigate("/categories");
          }}
          disabled={disabled}
        >
          Cancel
        </button>
      </div>
      <form className="edit-new-form mt-8 flex gap-4" onSubmit={onSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Category Name"
          defaultValue={category.name}
          ref={nameRef}
        />
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
