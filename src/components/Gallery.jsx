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

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

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
      </div>
    );

  return (
    <div className="my-12 w-full">
      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {currentPhotos.length === 0 ? (
          <div className="text-center text-gray-400">No photos found</div>
        ) : (
          <div className="flex flex-wrap -mx-2 lg:-mx-4">
            {currentPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="my-1 px-2 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <article className="overflow-hidden rounded-lg shadow-lg bg-gray-800">
                  <div className="relative">
                    <Link to={`/photo/${photo.id}`}>
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        className="block h-auto w-full hover:opacity-90 transition-opacity"
                        onError={(e) =>
                          (e.target.src = "https://picsum.photos/150")
                        }
                      />
                      <p className="absolute right-2 bottom-2 bg-gray-900/80 text-gray-100 text-sm px-2 py-1 rounded">
                        Photo #{photo.id}
                      </p>
                    </Link>
                  </div>
                  <header className="flex items-center justify-between leading-tight p-2 md:p-4">
                    <h1 className="text-lg">
                      <Link
                        to={`/photo/${photo.id}`}
                        className="text-gray-100 hover:underline block sm:truncate"
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
          </div>
        )}
        {/* Pagination Controls */}
        {filteredPhotos.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center space-x-2 sm:space-x-4 items-center">
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full font-medium text-white min-w-[80px] sm:min-w-[100px] ${
                currentPage === 1
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105"
              } transition-all duration-300`}
            >
              First
            </button>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full font-medium text-white min-w-[80px] sm:min-w-[100px] ${
                currentPage === 1
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105"
              } transition-all duration-300`}
            >
              Previous
            </button>
            <span className="text-gray-400 px-2 sm:px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full font-medium text-white min-w-[80px] sm:min-w-[100px] ${
                currentPage === totalPages
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105"
              } transition-all duration-300`}
            >
              Next
            </button>
            <button
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full font-medium text-white min-w-[80px] sm:min-w-[100px] ${
                currentPage === totalPages
                  ? "bg-gray-600 cursor-not-allowed"
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
