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
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-400 text-lg">Loading photos...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center p-6 bg-red-100 text-red-700 rounded-lg">
        {error}
        <button
          onClick={() => dispatch(fetchPhotos())}
          className="ml-4 bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-all duration-300"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="my-16 sm:mt-16 mt-20 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentPhotos.length === 0 ? (
          <div className="text-center text-gray-400 text-lg py-12">
            No photos found
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {currentPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative"
              >
                <article className="overflow-hidden rounded-xl shadow-lg bg-gray-900 min-h-[400px] flex flex-col transform hover:scale-105 transition-transform duration-300">
                  <div className="relative">
                    <Link to={`/photo/${photo.id}`}>
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        loading="lazy"
                        className="block h-48 w-full object-cover hover:opacity-90 transition-opacity duration-300"
                        onError={(e) =>
                          (e.target.src = "https://picsum.photos/150")
                        }
                      />
                      <p className="absolute right-3 bottom-3 bg-gray-900/80 text-gray-100 text-sm px-3 py-1 rounded-full font-medium">
                        Photo #{photo.id}
                      </p>
                    </Link>
                  </div>
                  <header className="flex items-center justify-between leading-tight p-4 flex-grow">
                    <h1 className="text-lg font-medium text-gray-200 line-clamp-2">
                      <Link
                        to={`/photo/${photo.id}`}
                        className="hover:text-teal-400 transition-colors duration-200"
                        title={photo.title}
                      >
                        {photo.title}
                      </Link>
                    </h1>
                  </header>
                  <footer className="p-4">
                    <Link
                      to={`/photo/${photo.id}`}
                      className="bg-teal-500 text-white px-6 py-2 rounded-full font-medium hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-teal-400 focus:outline-none"
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
          <div className="mt-12 flex justify-center items-center space-x-3">
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full font-medium text-white text-sm sm:text-base min-w-[80px] ${
                currentPage === 1
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-teal-500 hover:bg-teal-600 transform hover:scale-105"
              } transition-all duration-300 focus:ring-2 focus:ring-teal-400 focus:outline-none`}
            >
              First
            </button>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-full font-medium text-white ${
                currentPage === 1
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-teal-500 hover:bg-teal-600 transform hover:scale-105"
              } transition-all duration-300 focus:ring-2 focus:ring-teal-400 focus:outline-none`}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-gray-200 px-4 py-2 bg-teal-600 rounded-full text-sm sm:text-base font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full font-medium text-white ${
                currentPage === totalPages
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-teal-500 hover:bg-teal-600 transform hover:scale-105"
              } transition-all duration-300 focus:ring-2 focus:ring-teal-400 focus:outline-none`}
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full font-medium text-white text-sm sm:text-base min-w-[80px] ${
                currentPage === totalPages
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-teal-500 hover:bg-teal-600 transform hover:scale-105"
              } transition-all duration-300 focus:ring-2 focus:ring-teal-400 focus:outline-none`}
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
