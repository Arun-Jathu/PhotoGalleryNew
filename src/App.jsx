import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store.js";
import Gallery from "./components/Gallery.jsx";
import PhotoDetails from "./components/PhotoDetails.jsx";
import "./App.css";

// Main App component: Sets up routing, header, and search functionality
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(
    () => window.innerWidth >= 640
  );
  const [uploadedPhotos, setUploadedPhotos] = useState(() => {
    const savedPhotos = localStorage.getItem("uploadedPhotos");
    return savedPhotos ? JSON.parse(savedPhotos) : [];
  });

  useEffect(() => {
    const handleResize = () => {
      setIsHeaderExpanded(window.innerWidth >= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleHeader = () => {
    setIsHeaderExpanded(!isHeaderExpanded);
  };

  const closeHeader = () => {
    if (!window.innerWidth >= 640) {
      setIsHeaderExpanded(false);
    }
  };

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100 flex flex-col font-sans">
        {/* Header */}
        <header className="bg-gray-900 w-full sticky top-0 z-10 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-medium text-teal-400 flex items-center hover:text-teal-300 transition-colors duration-200">
                <svg
                  className="w-6 h-6 mr-1"
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
                <Link to="/" onClick={closeHeader}>
                  Photo Gallery
                </Link>
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <button
                className="sm:hidden text-teal-400 focus:outline-none"
                onClick={toggleHeader}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
              <div
                className={`${
                  isHeaderExpanded ? "" : "hidden"
                } sm:flex items-center space-x-6`}
              >
                <div className="relative flex items-center border border-gray-600 bg-gray-700 rounded-full px-4 py-2 w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search photos by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-1 px-2 text-gray-100 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full text-sm"
                    onClick={closeHeader}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-10 text-gray-400 hover:text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
                    >
                      <svg
                        className="w-4 h-4"
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
                  <button className="bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 w-8 h-8 flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
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
                <a
                  href="https://github.com/example-user/PhotoGalleryNew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 text-sm transition-colors duration-200"
                  onClick={closeHeader}
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
          {/* Mobile Dropdown Menu */}
          {!window.innerWidth >= 640 && isHeaderExpanded && (
            <div className="sm:hidden absolute top-16 left-0 w-full bg-gray-800 bg-opacity-95 rounded-lg p-4 shadow-lg z-20">
              <div className="flex flex-col items-center space-y-4">
                <button
                  className="absolute top-2 right-2 text-white text-xl focus:outline-none"
                  onClick={toggleHeader}
                >
                  ×
                </button>
                <div className="w-full max-w-md">
                  <div className="relative flex items-center bg-gray-700 rounded-full px-4 py-2">
                    <input
                      type="text"
                      placeholder="Search photos by title"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full py-1 px-2 text-gray-100 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full text-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-12 text-gray-400 hover:text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
                      >
                        <svg
                          className="w-4 h-4"
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
                    <button className="bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 w-8 h-8 flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
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
                <a
                  href="https://github.com/example-user/PhotoGalleryNew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 text-sm transition-colors duration-200 px-4 py-2 rounded-full bg-gray-700 w-full max-w-md text-center"
                >
                  GitHub
                </a>
              </div>
            </div>
          )}
        </header>
        {/* Main Content */}
        <main className="w-full flex-grow">
          {/* App Routes */}
          <Routes>
            <Route
              path="/"
              element={
                <Gallery
                  searchTerm={searchTerm}
                  setUploadedPhotos={setUploadedPhotos}
                />
              }
            />
            <Route
              path="/photo/:id"
              element={<PhotoDetails uploadedPhotos={uploadedPhotos} />}
            />
          </Routes>
        </main>
        {/* Footer */}
        <footer className="bg-gray-900 py-6 w-full border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
            <p>© 2025 Photo Gallery App. All rights reserved.</p>
            <a
              href="https://github.com/example-user/PhotoGalleryNew"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
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
