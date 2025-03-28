import logo from "@/assets/images/LOGO-dark.png";
import { cn } from "@/lib/utils";

function AuthPageLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black bg-opacity-30 w-full h-full flex items-center justify-center z-[999] backdrop-blur-sm",
        className
      )}
    >
      <div className="flex w-full h-full">
        {/* Left side (empty space for centering) */}
        <div className="hidden md:flex md:w-1/2"></div>

        {/* Right side (image container) */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-center">
          <img
            src={logo}
            alt="GGECL"
            className="h-full w-full object-cover md:object-contain animate-spin"
          />
        </div>
      </div>
    </div>
  );
}

export default AuthPageLoading;