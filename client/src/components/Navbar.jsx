import { NavLink } from "react-router";
import { SignOutButton } from "./SignOutButton";
import { User } from "./User";

export const Navbar = ({ className }) => {
  return (
    <nav className={className}>
      <NavLink to={"/categories"}>Categories</NavLink>
      <NavLink to={"/products"}>Products</NavLink>
      <div className="flex-1" />
      <User />
      <SignOutButton />
    </nav>
  );
};
