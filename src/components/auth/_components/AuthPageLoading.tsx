import logo from "@/assets/images/LOGO-dark.png";
import { cn } from "@/lib/utils";

function AuthPageLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[999] backdrop-blur-sm",
        className
      )}
    >
      <img src={logo} alt="GGECL" className="w-12 h-12 animate-spin" />
    </div>
  );
}

export default AuthPageLoading;
