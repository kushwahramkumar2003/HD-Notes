import React from "react";
import logo from "../assets/logo.svg";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center ">
      <img src={logo} alt="HD Logo" className="w-10 h-10" />
      <span className="ml-2 text-xl font-bold text-gray-800">HD</span>
    </div>
  );
};

export default Logo;
