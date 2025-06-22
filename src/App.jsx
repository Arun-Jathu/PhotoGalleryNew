import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store.js";
import Gallery from "./components/Gallery.jsx";
import PhotoDetails from "./components/PhotoDetails.jsx";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(
    window.innerWidth >= 640
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [uploadedPhotos, setUploadedPhotos] = useState(() => {
    const saved = localStorage.getItem("uploadedPhotos");
    return saved ? JSON.parse(saved) : [];
  });
  const [isNightMode, setIsNightMode] = useState(() => {
    const saved = localStorage.getItem("nightMode");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 640) {
        setIsHeaderExpanded(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleHeader = () => setIsHeaderExpanded((prev) => !prev);

  const closeHeader = () => {
    if (windowWidth < 640) setIsHeaderExpanded(false);
  };

  const toggleNightMode = () => {
    setIsNightMode((prev) => {
      localStorage.setItem("nightMode", JSON.stringify(!prev));
      return !prev;
    });
  };

  const handleSearch = () => {
    console.log("Search clicked, term:", searchTerm);
  };

  return (
    <Provider store={store}>
      <div
        className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ease-in-out ${
          isNightMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900"
        }`}
      >
        <header
          className={`w-full sticky top-0 z-10 border-b transition-colors duration-300 ${
            isNightMode
              ? "bg-gray-900 border-gray-800"
              : "bg-gray-100 border-gray-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {(windowWidth >= 640 || !isHeaderExpanded) && (
              <>
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-medium text-teal-400 flex items-center hover:text-teal-300 transition-colors duration-200">
                    <svg
                      className="w-6 h-6 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                        } rounded-full peer-focus:ring-2 peer-focus:ring-teal-400 peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-teal-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          isNightMode
                            ? "peer-checked:after:translate-x-5"
                            : "after:translate-x-0"
                        }`}
                      />
                      <span className="ml-2 text-teal-400">
                        {isNightMode ? "🌙" : "🌞"}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className="sm:hidden text-teal-400 focus:outline-none"
                    onClick={toggleHeader}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                  </button>
                  <div className="hidden sm:flex items-center space-x-6">
                    <div
                      className={`relative flex items-center ${
                        isNightMode
                          ? "border-teal-600 bg-teal-800"
                          : "border-teal-200 bg-teal-100"
                      } rounded-full px-4 py-2 w-72`}
                    >
                      <input
                        type="text"
                        placeholder="Search photos by title"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full py-1 px-2 ${
                          isNightMode
                            ? "text-gray-100 bg-transparent placeholder-teal-400"
                            : "text-gray-900 bg-transparent placeholder-teal-600"
                        } focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full text-sm`}
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-10 text-teal-400 hover:text-teal-300 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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
                      <button
                        onClick={handleSearch}
                        className="bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 w-8 h-8 flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
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
                      className="text-teal-400 hover:text-teal-300 text-sm"
                      onClick={closeHeader}
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </>
            )}
            {windowWidth < 640 && isHeaderExpanded && (
              <div
                className={`sm:hidden absolute top-0 left-0 w-full ${
                  isNightMode
                    ? "bg-gray-900 bg-opacity-95"
                    : "bg-white bg-opacity-95"
                } rounded-lg p-6 shadow-lg z-20 border-t border-teal-600`}
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className="flex w-full justify-between items-center">
                    <button
                      onClick={toggleHeader}
                      className="text-white text-xl focus:outline-none"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <Link
                      to="/"
                      className="text-teal-400 flex items-center"
                      onClick={closeHeader}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                      </svg>
                    </Link>
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
                          } rounded-full peer-focus:ring-2 peer-focus:ring-teal-400 peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-teal-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            isNightMode
                              ? "peer-checked:after:translate-x-5"
                              : "after:translate-x-0"
                          }`}
                        />
                        <span className="ml-2 text-teal-400">
                          {isNightMode ? "🌙" : "🌞"}
                        </span>
                      </label>
                    </div>
                    <a
                      href="https://github.com/example-user/PhotoGalleryNew"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-teal-300 text-sm"
                      onClick={closeHeader}
                    >
                      GitHub
                    </a>
                  </div>
                  <div
                    className={`relative flex items-center ${
                      isNightMode
                        ? "bg-teal-800 border-teal-600"
                        : "bg-teal-100 border-teal-200"
                    } rounded-full px-4 py-2 w-full border`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      placeholder="Search photos by title"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className={`w-full py-2 px-3 ${
                        isNightMode
                          ? "text-gray-100 bg-transparent placeholder-teal-400"
                          : "text-gray-900 bg-transparent placeholder-teal-600"
                      } focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full text-sm`}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-12 text-teal-400 hover:text-teal-300 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
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
                    <button
                      onClick={handleSearch}
                      className="bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 w-8 h-8 flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
              </div>
            )}
          </div>
        </header>

        <main className="w-full flex-grow">
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

        <footer
          className={`mt-12 py-6 w-full border-t transition-colors duration-300 ${
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
              className="text-teal-400 hover:text-teal-300 transition-colors duration-200"
            >
              GitHub | Portfolio
            </a>
          </div>
        </footer>
      </div>
    </Provider>
  );
}

export default App;
