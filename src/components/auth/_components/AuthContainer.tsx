import signupImg from "@/assets/images/signup-img.png";
import loginImg from "@/assets/images/logoforsignup.png";
import AuthPageLoading from "./AuthPageLoading";
import { useLocation } from "react-router";

function AuthContainer({
  children,
  isPending,
}: {
  children: React.ReactNode;
  isPending: boolean;
}) {
  const { pathname } = useLocation();
  const authImg = pathname.startsWith("/login") ? loginImg : signupImg;
  return (
    <>
      {isPending && <AuthPageLoading />}
      <section className="relative min-h-max py-10 md:py-0 grid lg:grid-cols-2 overflow-hidden dark:bg-gray-900">
        {/* Background Blur Effects */}
        <div className="absolute top-10 left-20 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Auth Form Section */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-8 z-10">
          <div className="w-full max-w-md space-y-5">{children}</div>
        </div>

        {/* Image Section (Hidden on Small Screens) */}
        <div className="hidden lg:flex items-center justify-center p-4 w-full">
          <img
            src={authImg}
            alt="Authentication"
            className="max-w-md w-full h-auto object-contain"
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
}

export default AuthContainer;
