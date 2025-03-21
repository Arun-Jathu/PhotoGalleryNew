import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { fetchPhotos } from "../features/photosSlice.js";

function PhotoDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { photos, loading, error } = useSelector((state) => state.photos);

  const photo = photos.find((p) => p.id === parseInt(id));

  if (loading)
    return (
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading photo...</p>
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
  if (!photo)
    return <div className="text-center text-gray-400">Photo not found</div>;

  return (
    <div className="my-12 mx-auto px-4 md:px-12">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <motion.div
          className="relative lg:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={photo.url}
            alt={photo.title}
            loading="lazy"
            className="w-full max-h-[70vh] object-contain rounded-lg hover:opacity-90 transition-opacity"
            onError={(e) => (e.target.src = "https://picsum.photos/600")}
          />
          <p className="absolute right-4 bottom-4 bg-gray-900/80 text-gray-100 text-sm px-3 py-1 rounded">
            Photo #{photo.id}
          </p>
        </motion.div>
        <motion.div
          className="mt-8 lg:mt-0 lg:w-1/2 flex flex-col justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-gray-100 mb-4">
            {photo.title}
          </h1>
          <div className="flex space-x-6 mb-6">
            <p className="text-gray-400 text-lg">Photo ID: {photo.id}</p>
            <p className="text-gray-400 text-lg">Album ID: {photo.albumId}</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Back to Gallery
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default PhotoDetails;
