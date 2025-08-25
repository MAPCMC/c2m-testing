import SignIn from "./SignIn";
import ThemeToggle from "./ThemeToggle";
import { getUser } from "@/lib/getUser";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import C2MLogo from "@/components/C2MLogo";

const NavBar = async ({
  noLogout,
  children,
  className,
  withSidebar,
  logo = true,
}: {
  children?: React.ReactNode;
  noLogout?: boolean;
  className?: string;
  withSidebar?: boolean;
  logo?: boolean;
}) => {
  const user = await getUser();

  return (
    <div
      className={cn(
        "py-2 border-b w-full bg-card dark:bg-background",
        className
      )}
    >
      <div
        className={cn(
          "max-w-5xl mx-auto flex justify-between items-center gap-8 px-4 relative",
          {
            "justify-end": !withSidebar,
          }
        )}
      >
        <div>{withSidebar && <SidebarTrigger />}</div>
        {logo && (
          <C2MLogo
            className={
              "w-9 h-9 absolute inset-0 mx-auto sr-none"
            }
          />
        )}
        <div className="flex items-center gap-3">
          {user && (
            <p className="hidden sm:inline">{user.email}</p>
          )}
          <ThemeToggle user={user} />
          {children}
          <SignIn noLogout={noLogout} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
