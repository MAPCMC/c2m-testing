import SignIn from "./SignIn";
import ThemeToggle from "./ThemeToggle";
import { getUser } from "@/lib/getUser";

const NavBar = async ({
  noLogout,
}: {
  noLogout?: boolean;
}) => {
  const user = await getUser();
  return (
    <div className="py-2 px-8 sm:px-20 border-b-2 flex justify-end items-center gap-3 w-full">
      {user && <p>{user.email}</p>}
      <ThemeToggle
        profileTheme={user ? user.theme : undefined}
      />
      <SignIn noLogout={noLogout} />
    </div>
  );
};

export default NavBar;