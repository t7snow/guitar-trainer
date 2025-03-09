import React from "react";

const Header = ({ title, description }) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800"> { title } </h1>
      <p className="text-gray-600 mt-2">
        {description}
      </p>
    </header>
  );
};

export default Header;