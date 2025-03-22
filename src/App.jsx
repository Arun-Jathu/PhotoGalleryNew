import { useState, useEffect } from "react"; // Added useEffect
import { Routes, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store.js";
import Gallery from "./components/Gallery.jsx";
import PhotoDetails from "./components/PhotoDetails.jsx";
import "./App.css";

function App() {
  // Initialize isHeaderExpanded based on screen size
  const [searchTerm, setSearchTerm] = useState("");
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(() => {
    // Check if window is defined (for server-side rendering compatibility)
    if (typeof window !== "undefined") {
      // Tailwind's sm breakpoint is 640px
      return window.innerWidth >= 640;
    }
    // Default to true for desktop if window is not defined (e.g., during SSR)
    return true;
  });

  // Update isHeaderExpanded when the window is resized (optional, for responsiveness)
  useEffect(() => {
    const handleResize = () => {
      setIsHeaderExpanded(window.innerWidth >= 640);
    };

    window.addEventListener("resize", handleResize);
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleHeader = () => {
    setIsHeaderExpanded(!isHeaderExpanded);
  };

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 shadow-lg w-full sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            {/* Logo and Toggle Symbol (mobile layout) */}
            <div className="flex items-center justify-between sm:justify-start sm:flex-1">
              {/* Logo (always visible) */}
              <h1 className="text-2xl font-bold flex items-center">
                <svg
                  className="w-8 h-8 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                </svg>
                <Link to="/">Photo Gallery</Link>
              </h1>
              {/* Toggle Symbol (visible on mobile only) */}
              <button
                onClick={toggleHeader}
                className="sm:hidden bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full p-3 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isHeaderExpanded ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
            {/* Search Bar and GitHub Link (collapsible on mobile, always visible on desktop) */}
            <div
              className={`sm:flex sm:items-center sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0 ${
                isHeaderExpanded ? "block" : "hidden"
              } sm:block`} // Hide on mobile when collapsed, always show on sm+
            >
              {/* Search Bar */}
              <div className="relative flex items-center border border-gray-600 bg-gray-800 shadow-lg rounded-full px-2 w-full sm:w-64 md:w-72 lg:w-80">
                <input
                  type="text"
                  placeholder="Search photos by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 px-6 text-gray-100 bg-transparent leading-tight focus:outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-12 text-gray-400 hover:text-gray-100"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                <div className="p-2">
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full p-2 hover:from-blue-600 hover:to-indigo-600 focus:outline-none w-12 h-12 flex items-center justify-center transition-all duration-300">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Navigation Links */}
              <nav className="flex items-center mt-2 sm:mt-0">
                <a
                  href="https://github.com/example-user/PhotoGalleryNew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-100"
                >
                  GitHub
                </a>
              </nav>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="w-full flex-grow">
          <Routes>
            <Route path="/" element={<Gallery searchTerm={searchTerm} />} />
            <Route path="/photo/:id" element={<PhotoDetails />} />
          </Routes>
        </main>
        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 py-4 w-full border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-300">
            <p>© 2025 Photo Gallery App. All rights reserved.</p>
            <a
              href="https://github.com/example-user/PhotoGalleryNew"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-gray-100"
            >
              GitHub Portfolio
            </a>
          </div>
        </footer>
      </div>
    </Provider>
  );
}

export default App;
