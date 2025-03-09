// Navbar.js

import React, { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-green-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Brand Name */}
                <a href="/" className="text-white text-lg font-semibold">GeeksforGeeks
                </a>

                {/* Hamburger Menu for mobile */}
                <button onClick={() => setIsOpen(!isOpen)}
                    className="text-white focus:outline-none md:hidden">
                    {/* Hamburger Icon and Close Icon */}
                    {isOpen ? (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                        
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    )}
                </button>

                {/* Navigation Links */}
                <div
                    className={`w-full md:flex md:items-center md:w-auto 
                    md:space-x-4 absolute md:relative top-16 left-0 md:top-0 
                    md:left-0 p-4 md:p-0 bg-green-600 md:bg-transparent 
                    transition-all duration-500 ease-in-out transform ${isOpen ? 
                    'translate-x-0' : 'translate-x-full'
                        } md:translate-x-0`}>
                    <a  href="#home"
                        className="block py-2 px-4 text-white hover:text-gray-200
                                   md:inline-block">Home
                    </a>
                    <a  href="#about"
                        className="block py-2 px-4 text-white hover:text-gray-200
                                   md:inline-block">About
                    </a>
                    <a  href="#contact"
                        className="block py-2 px-4 text-white hover:text-gray-200 
                                   md:inline-block">Contact
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;