import SignIn from "@/components/SignIn";
import ThemeToggle from "@/components/ThemeToggle";

const NavBar = () => {
  return (
    <div className="py-2 px-8 sm:px-20 border-b-2 flex justify-end items-center gap-3 w-full">
      <ThemeToggle />
      <SignIn />
    </div>
  );
};

export default NavBar;
