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
        "py-2 border-b w-full bg-background @container",
        className
      )}
    >
      <div
        className={cn(
          "max-w-5xl mx-auto flex justify-between items-center gap-8 px-4 relative"
        )}
      >
        <div>
          {withSidebar && <SidebarTrigger />}
          {logo && (
            <C2MLogo
              className={cn("w-9 h-9 sr-none shrink-0")}
            />
          )}
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <p className="hidden @2xl:inline text-sm">
              {user.email}
            </p>
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
