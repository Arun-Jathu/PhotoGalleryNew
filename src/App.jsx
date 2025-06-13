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
  const [isNightMode, setIsNightMode] = useState(() => {
    const savedMode = localStorage.getItem("nightMode");
    return savedMode ? JSON.parse(savedMode) : true; // Default to night mode
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

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
    localStorage.setItem("nightMode", !isNightMode);
  };

  return (
    <Provider store={store}>
      <div
        className={`min-h-screen flex flex-col font-sans ${
          isNightMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900"
        }`}
      >
        {/* Header */}
        <header
          className={`w-full sticky top-0 z-10 border-b ${
            isNightMode
              ? "bg-gray-900 border-gray-800"
              : "bg-gray-100 border-gray-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
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
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNightMode}
                    onChange={toggleNightMode}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 ${
                      isNightMode ? "bg-teal-600" : "bg-teal-200"
                    } peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-400 rounded-full peer peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-teal-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                      isNightMode
                        ? "peer-checked:after:translate-x-5"
                        : "after:translate-x-0"
                    }`}
                  ></div>
                  <span className="ml-2 text-teal-400">
                    {isNightMode ? "🌙" : "🌞"}
                  </span>
                </label>
              </div>
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
                <div
                  className={`relative flex items-center ${
                    isNightMode
                      ? "border-teal-600 bg-teal-800"
                      : "border-teal-200 bg-teal-100"
                  } rounded-full px-4 py-2 w-full sm:w-72`}
                >
                  <input
                    type="text"
                    placeholder="Search photos by title"
                    value={searchTerm}
                    onChange={(e) => {
                      console.log("Search term changed to:", e.target.value);
                      setSearchTerm(e.target.value);
                    }}
                    className={`w-full py-1 px-2 ${
                      isNightMode
                        ? "text-gray-100 bg-transparent placeholder-teal-400"
                        : "text-gray-900 bg-transparent placeholder-teal-600"
                    } focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full text-sm`}
                    onClick={closeHeader}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-10 text-teal-400 hover:text-teal-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
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
            <div
              className={`sm:hidden absolute top-16 left-0 w-full ${
                isNightMode
                  ? "bg-gray-900 bg-opacity-95"
                  : "bg-white bg-opacity-95"
              } rounded-lg p-4 shadow-lg z-20`}
            >
              <div className="flex flex-col items-center space-y-4">
                <button
                  className="absolute top-2 right-2 text-white text-xl focus:outline-none"
                  onClick={toggleHeader}
                >
                  ×
                </button>
                <div className="w-full max-w-md">
                  <div
                    className={`relative flex items-center ${
                      isNightMode ? "bg-teal-800" : "bg-teal-100"
                    } rounded-full px-4 py-2`}
                  >
                    <input
                      type="text"
                      placeholder="Search photos by title"
                      value={searchTerm}
                      onChange={(e) => {
                        console.log("Search term changed to:", e.target.value);
                        setSearchTerm(e.target.value);
                      }}
                      className={`w-full py-1 px-2 ${
                        isNightMode
                          ? "text-gray-100 bg-transparent placeholder-teal-400"
                          : "text-gray-900 bg-transparent placeholder-teal-600"
                      } focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full text-sm`}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-12 text-teal-400 hover:text-teal-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
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
                  className={`text-teal-400 hover:text-teal-300 text-sm transition-colors duration-200 px-4 py-2 rounded-full ${
                    isNightMode ? "bg-teal-800" : "bg-teal-100"
                  } w-full max-w-md text-center`}
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
                  isNightMode={isNightMode}
                />
              }
            />
            <Route
              path="/photo/:id"
              element={
                <PhotoDetails
                  uploadedPhotos={uploadedPhotos}
                  isNightMode={isNightMode}
                />
              }
            />
          </Routes>
        </main>
        {/* Footer */}
        <footer
          className={`mt-12 py-6 w-full border-t ${
            isNightMode
              ? "bg-gray-900 border-gray-800 text-gray-400"
              : "bg-gray-100 border-gray-200 text-gray-600"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
