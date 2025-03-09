// Navbar.js

import React, { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-amber-200 p-4">
          <div className="container mx-auto flex justify-between items-center"> 
            <div>
              <a href="/" className="text-xl font-bold text-gray-800">geetar</a> 
            </div>

            <div className="flex space-x-4">
              <a href="/practice" className="text-gray-800 hover:text-amber-600">practice</a>
              <a href="/learn" className="text-gray-800 hover:text-amber-600">learn</a>
              <a href="/contact" className="text-gray-800 hover:text-amber-600">contact</a>
            </div>
          </div>
        </nav>
    );
};

export default Navbar;