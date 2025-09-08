import serialize from "form-serialize";
import { Link } from "react-router";

export const AuthForm = ({ isSignup = false, onSubmit, disabled, errors }) => {
  const _onSubmit = (ev) => {
    ev.preventDefault();
    const data = serialize(ev.target, { hash: true });
    onSubmit(data);
  };

  return (
    <form className="auth-form" onSubmit={_onSubmit}>
      {isSignup && <input name="name" type="text" placeholder="Name" />}
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      {isSignup && (
        <input
          name="password_confirmation"
          type="password"
          placeholder="Confirm Password"
        />
      )}
      <button disabled={disabled}>{isSignup ? "Sign Up" : "Sign In"}</button>
      {isSignup ? (
        <span className="link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </span>
      ) : (
        <span className="link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </span>
      )}

      <div className="flex flex-col">
        {errors &&
          errors.length &&
          errors.map((err) => <span className="error">{err}</span>)}
      </div>
    </form>
  );
};
