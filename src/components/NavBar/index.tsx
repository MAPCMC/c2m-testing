import SignIn from "./SignIn";
import ThemeToggle from "./ThemeToggle";
import { getUser } from "@/lib/getUser";

const NavBar = async ({
  noLogout,
  children,
}: {
  children?: React.ReactNode;
  noLogout?: boolean;
}) => {
  const user = await getUser();

  return (
    <div className="py-2 border-b-2">
      <div className="max-w-5xl mx-auto flex justify-end items-center gap-3 px-4">
        {user && (
          <p className="hidden sm:inline">{user.email}</p>
        )}
        <ThemeToggle user={user} />
        {children}
        <SignIn noLogout={noLogout} />
      </div>
    </div>
  );
};

export default NavBar;
