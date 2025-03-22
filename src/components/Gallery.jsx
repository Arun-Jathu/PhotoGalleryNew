import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPhotos } from "../features/photosSlice.js";
import { motion } from "framer-motion";

function Gallery({ searchTerm = "" }) {
  const dispatch = useDispatch();
  const { photos, loading, error } = useSelector((state) => state.photos);
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 8;

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  const filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = filteredPhotos.slice(
    indexOfFirstPhoto,
    indexOfLastPhoto
  );

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleLastPage = () => setCurrentPage(totalPages);

  if (loading)
    return (
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading photos...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
        <button
          onClick={() => dispatch(fetchPhotos())}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="my-12 sm:mt-12 mt-16 w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {currentPhotos.length === 0 ? (
          <div className="text-center text-gray-400">No photos found</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap -mx-3 lg:-mx-6"
          >
            {currentPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="my-1 px-3 w-full md:w-1/2 lg:my-4 lg:px-6 lg:w-1/4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <article className="overflow-hidden rounded-lg shadow-lg bg-gray-800 min-h-[400px] flex flex-col">
                  <div className="relative">
                    <Link to={`/photo/${photo.id}`}>
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        loading="lazy"
                        className="block h-40 w-full object-cover hover:opacity-90 transition-opacity"
                        onError={(e) =>
                          (e.target.src = "https://picsum.photos/150")
                        }
                      />
                      <p className="absolute right-2 bottom-2 bg-gray-900/90 text-gray-100 text-sm px-2 py-1 rounded">
                        Photo #{photo.id}
                      </p>
                    </Link>
                  </div>
                  <header className="flex items-center justify-between leading-tight p-2 md:p-4 flex-grow">
                    <h1 className="text-xl">
                      <Link
                        to={`/photo/${photo.id}`}
                        className="text-gray-300 hover:underline block line-clamp-2"
                        title={photo.title}
                      >
                        {photo.title}
                      </Link>
                    </h1>
                  </header>
                  <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                    <Link
                      to={`/photo/${photo.id}`}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
                    >
                      View Details
                    </Link>
                  </footer>
                </article>
              </motion.div>
            ))}
          </motion.div>
        )}
        {filteredPhotos.length > 0 && (
          <div className="mt-8 flex justify-center items-center space-x-1 sm:space-x-2">
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full font-medium text-white text-sm sm:text-base min-w-[60px] sm:min-w-[80px] ${
                currentPage === 1
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105"
              } transition-all duration-300`}
            >
              First
            </button>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-1 sm:p-2 rounded-full font-medium text-white ${
                currentPage === 1
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105"
              } transition-all duration-300`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-gray-300 px-2 sm:px-3 py-1 bg-blue-500 rounded-full text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-1 sm:p-2 rounded-full font-medium text-white ${
                currentPage === totalPages
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105"
              } transition-all duration-300`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full font-medium text-white text-sm sm:text-base min-w-[60px] sm:min-w-[80px] ${
                currentPage === totalPages
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105"
              } transition-all duration-300`}
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;
