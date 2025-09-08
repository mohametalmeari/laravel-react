import { useState } from "react";
import { AuthForm } from "../components/AuthForm";
import { useStateContext } from "../contexts/StateProvider";
import { axiosClient } from "../lib/axios-client";
import { displayErrors } from "../lib/helpers";

export const Signup = () => {
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState(null);

  const { setToken } = useStateContext();

  const onSubmit = (data) => {
    setDisabled(true);
    setErrors(null);
    axiosClient
      .post("/register", data)
      .then(({ data }) => {
        setToken(data.token);
      })
      .catch((err) => {
        displayErrors({ setErrors, err });
      })
      .finally(() => {
        setDisabled(false);
      });
  };
  return (
    <div className="h-screen flex justify-center items-center p-4">
      <AuthForm
        isSignup
        onSubmit={onSubmit}
        disabled={disabled}
        errors={errors}
      />
    </div>
  );
};
