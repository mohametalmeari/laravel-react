import { SignOutButton } from "../components/SignOutButton";
import { User } from "../components/User";

export const Home = () => {
  return (
    <div className="flex gap-4 justify-center p-4">
      <User />
      <SignOutButton />
    </div>
  );
};
