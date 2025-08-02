import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const router = useNavigate();
  const handleLogin = () => {
    router("/login");
  };
  const handleInputfields = () => {
    router("/inputfields");
  };
    const handleDropdown = () => {
    router("/dropdowns");
  };
  return (
    <div>
      <h1 className="text-blue-500">Welcome to React</h1>

      <div className="w-full flex justify-center gap-4 ">
        <button
          onClick={handleLogin}
          className="px-3 py-4 rounded-2xl bg-blue-400 hover:bg-blue-600 transition-all duration-500 ease-in-out"
        >
          Login
        </button>

        <button onClick={handleInputfields}>Visit Input Fields</button>
        <button onClick={handleDropdown}>Visit Dropdowns</button>
      </div>
    </div>
  );
};

export default Home;
