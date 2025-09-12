import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react"; // icons for hamburger menu


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full px-6 py-4 flex items-center justify-between bg-black/70 backdrop-blur-md fixed top-0 z-50">
            <Link to="/" className="text-2xl font-bold text-gradient">
                RE-MATCHER
            </Link>

            <div className="hidden md:flex items-center gap-4">
                <Link to="/upload" className="primary-button w-fit">
                Upload Resume
                </Link>
                <Link to="/auth" className="primary-button w-fit">
                Log Out
                </Link>
            </div>

            <button
                className="md:hidden text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-black/90 flex flex-col items-center gap-4 py-6 md:hidden">
                <Link
                    to="/upload"
                    className="primary-button w-11/12 text-center"
                    onClick={() => setIsOpen(false)}
                >
                    Upload Resume
                </Link>
                <Link
                    to="/auth"
                    className="primary-button w-11/12 text-center"
                    onClick={() => setIsOpen(false)}
                >
                    Log Out
                </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
