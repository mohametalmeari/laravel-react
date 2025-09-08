export const displayErrors = ({ setErrors, err }) => {
  const response = err?.response;
  const data = response?.data;

  if (data?.errors) {
    setErrors(Object.values(data.errors).flat());
  } else if (data?.message) {
    setErrors([data.message]);
  } else {
    setErrors(["An unknown error occurred. Please try again."]);
  }
};
