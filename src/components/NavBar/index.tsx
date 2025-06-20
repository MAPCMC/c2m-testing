import SignIn from "./SignIn";
import ThemeToggle from "./ThemeToggle";
import { getUser } from "@/lib/getUser";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

const NavBar = async ({
  noLogout,
  children,
  className,
  withSidebar,
}: {
  children?: React.ReactNode;
  noLogout?: boolean;
  className?: string;
  withSidebar?: boolean;
}) => {
  const user = await getUser();

  return (
    <div className={cn("py-2 border-b w-full", className)}>
      <div
        className={cn(
          "max-w-5xl mx-auto flex justify-between items-center gap-8 px-4",
          {
            "justify-end": !withSidebar,
          }
        )}
      >
        {withSidebar && <SidebarTrigger />}
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
