import React from "react";

interface ButtonType {
  children: React.ReactNode;
  type: "submit" | "reset" | "button" | undefined;
}

function Button({ children, type }: ButtonType) {
  return (
    <button type={type} className="bg-[#2b0e5d] py-2 font-medium rounded-sm">
      {children}
    </button>
  );
}

export default Button;
