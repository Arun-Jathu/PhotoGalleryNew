import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { fetchPhotos } from "../features/photosSlice.js";

// PhotoDetails component: Displays detailed info for a single photo
function PhotoDetails({ uploadedPhotos, isNightMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { photos, loading, error } = useSelector((state) => state.photos);

  // Combine photos and uploadedPhotos for lookup
  const allPhotos = [...photos, ...uploadedPhotos];

  // State for description editing
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempDescription, setTempDescription] = useState("");

  // Fetch photos and load description from localStorage on mount
  useEffect(() => {
    // Fetch photos if not already loaded
    if (photos.length === 0) {
      dispatch(fetchPhotos("random")); // Use a default query to ensure data
    }

    // Find the photo and set its description
    const photo = allPhotos.find((p) => p.id === id || p.id === parseInt(id));
    if (photo) {
      const savedDescription = localStorage.getItem(`photo-description-${id}`);
      setDescription(
        savedDescription || photo.description || "No description available"
      );
    }
  }, [dispatch, allPhotos, id]);

  // Find the current photo and related photos
  const photo = allPhotos.find((p) => p.id === id || p.id === parseInt(id));
  const currentIndex = allPhotos.findIndex(
    (p) => p.id === id || p.id === parseInt(id)
  );
  const prevPhotoId = currentIndex > 0 ? allPhotos[currentIndex - 1].id : null;
  const nextPhotoId =
    currentIndex < allPhotos.length - 1 ? allPhotos[currentIndex + 1].id : null;
  const relatedPhotos = allPhotos
    .filter(
      (p) =>
        p.albumId === (photo?.albumId || 0) && p.id !== (id || parseInt(id))
    )
    .slice(0, 3); // Get up to 3 related photos from the same album

  useEffect(() => {
    if (nextPhotoId) {
      const nextPhoto = allPhotos.find((p) => p.id === nextPhotoId);
      if (nextPhoto) {
        const img = new Image();
        img.src = nextPhoto.urls?.regular;
      }
    }
  }, [nextPhotoId, allPhotos]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && nextPhotoId)
        navigate(`/photo/${nextPhotoId}`);
      if (e.key === "ArrowLeft" && prevPhotoId)
        navigate(`/photo/${prevPhotoId}`);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPhotoId, prevPhotoId, navigate]);

  // Navigate to the next photo when clicking the image
  const handleImageClick = () => {
    if (nextPhotoId) {
      navigate(`/photo/${nextPhotoId}`);
    }
  };

  // Download the photo as a file
  const handleDownload = async (url, title) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the photo. Please try again.");
    }
  };

  // Description editing handlers
  const handleEditDescription = () => {
    setTempDescription(description);
    setIsEditing(true);
  };

  const handleSaveDescription = () => {
    setDescription(tempDescription);
    localStorage.setItem(`photo-description-${id}`, tempDescription);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempDescription(description);
    setIsEditing(false);
  };

  // Show loading spinner while fetching photos
  if (loading)
    return (
      <div
        className={`text-center py-12 ${
          isNightMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg">Loading photo...</p>
      </div>
    );

  // Show error message if fetch fails
  if (error)
    return (
      <div
        className={`text-center p-6 rounded-lg ${
          isNightMode ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-700"
        }`}
      >
        {error}
        <button
          onClick={() => dispatch(fetchPhotos("random"))}
          className="ml-4 bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-all duration-300"
        >
          Retry
        </button>
      </div>
    );

  // Show message if photo is not found
  if (!photo)
    return (
      <div
        className={`text-center text-lg py-12 ${
          isNightMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Photo not found.{" "}
        <Link
          to="/"
          className={`hover:underline ${
            isNightMode
              ? "text-teal-400 hover:text-teal-300"
              : "text-teal-600 hover:text-teal-500"
          }`}
        >
          Back to Gallery
        </Link>
      </div>
    );

  return (
    <div
      className={`min-h-screen ${
        isNightMode
          ? "bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900"
      }`}
    >
      {/* Hero Section with Photo */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src={photo.urls.regular || "https://picsum.photos/600"}
          alt={photo.description || photo.title || "Photo"}
          loading="lazy"
          className="w-full h-full object-contain"
          onError={(e) => (e.target.src = "https://picsum.photos/600")}
          onClick={handleImageClick}
        />
        {/* Overlay for Title and Metadata */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-12 ${
            isNightMode
              ? "bg-gradient-to-t from-gray-900/80 to-transparent"
              : ""
          }`}
        >
          <h1
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
              isNightMode ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            {photo.title || photo.description || "Untitled"}
          </h1>
          <div
            className={`flex space-x-4 text-base sm:text-lg ${
              isNightMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <p>Photo ID: {photo.id}</p>
            <p>Album ID: {photo.albumId}</p>
          </div>
        </div>
        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 flex items-center px-4">
          {prevPhotoId && (
            <Link
              to={`/photo/${prevPhotoId}`}
              className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 transition-all duration-300 transform hover:scale-110 focus:ring-2 focus:ring-teal-400 focus:outline-none"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          )}
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center px-4">
          {nextPhotoId && (
            <Link
              to={`/photo/${nextPhotoId}`}
              className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 transition-all duration-300 transform hover:scale-110 focus:ring-2 focus:ring-teal-400 focus:outline-none"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Related Photos Section */}
        {relatedPhotos.length > 0 && (
          <div className="mt-12">
            <h2
              className={`text-2xl font-semibold ${
                isNightMode ? "text-gray-100" : "text-gray-800"
              } mb-6`}
            >
              More from Album {photo.albumId}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPhotos.map((relatedPhoto) => (
                <motion.div
                  key={relatedPhoto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <article
                    className={`overflow-hidden rounded-2xl shadow-xl border transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${
                      isNightMode
                        ? "bg-gray-800 border-gray-700/50"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Link to={`/photo/${relatedPhoto.id}`}>
                      <img
                        src={
                          relatedPhoto.urls.small || "https://picsum.photos/150"
                        }
                        alt={
                          relatedPhoto.description ||
                          relatedPhoto.title ||
                          "Related Photo"
                        }
                        loading="lazy"
                        className="w-full h-48 object-cover"
                        onError={(e) =>
                          (e.target.src = "https://picsum.photos/150")
                        }
                      />
                      <div className="p-5">
                        <h3
                          className={`text-lg font-semibold line-clamp-2 mb-2 ${
                            isNightMode ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {relatedPhoto.title ||
                            relatedPhoto.description ||
                            "Untitled"}
                        </h3>
                        <p
                          className={`text-sm ${
                            isNightMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Photo #{relatedPhoto.id}
                        </p>
                      </div>
                    </Link>
                  </article>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Main Details and Actions */}
        <div className="flex flex-col lg:flex-row lg:space-x-8 mt-12">
          {/* Main Details */}
          <div className="lg:w-2/3">
            <div
              className={`bg-${
                isNightMode ? "gray-900/50" : "white"
              } backdrop-blur-md rounded-xl p-6 shadow-lg border ${
                isNightMode ? "border-gray-700/50" : "border-gray-200"
              } relative`}
            >
              <button
                onClick={handleEditDescription}
                className={`absolute top-4 right-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded ${
                  isNightMode
                    ? "text-teal-400 hover:text-teal-300"
                    : "text-teal-600 hover:text-teal-500"
                }`}
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
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
              </button>
              <h2
                className={`text-2xl font-semibold ${
                  isNightMode ? "text-gray-100" : "text-gray-900"
                } mb-4`}
              >
                About This Photo
              </h2>
              <div className="space-y-4">
                <div
                  className={`flex items-center ${
                    isNightMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l9-6 9 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    />
                  </svg>
                  <p>
                    Photo #{photo.id} from Album #{photo.albumId}
                  </p>
                </div>
                <div
                  className={`flex items-center ${
                    isNightMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>Date Taken: Unknown</p>
                </div>
                <div
                  className={`flex items-start ${
                    isNightMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <div className="flex-1">
                    {isEditing ? (
                      // Description editing form
                      <div className="space-y-4">
                        <textarea
                          value={tempDescription}
                          onChange={(e) => setTempDescription(e.target.value)}
                          placeholder="Enter a description for this photo..."
                          className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 ${
                            isNightMode
                              ? "bg-gray-700 text-gray-100 border-gray-600"
                              : "bg-white text-gray-900 border-gray-300"
                          }`}
                          rows="4"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSaveDescription}
                            className="bg-teal-500 text-white px-4 py-2 rounded-full font-medium hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-teal-400 focus:outline-none ${
                              isNightMode
                                ? "bg-gray-600 text-gray-100 hover:bg-gray-500"
                                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : description ? (
                      <div>
                        <p
                          className={`mb-2 ${
                            isNightMode ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          {description}
                        </p>
                      </div>
                    ) : (
                      <p>
                        No description available.{" "}
                        <button
                          onClick={handleEditDescription}
                          className={`transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded ${
                            isNightMode
                              ? "text-teal-400 hover:text-teal-300"
                              : "text-teal-600 hover:text-teal-500"
                          }`}
                        >
                          Add one?
                        </button>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar with Actions */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div
              className={`bg-${
                isNightMode ? "gray-900/50" : "white"
              } backdrop-blur-md rounded-xl p-6 shadow-lg border ${
                isNightMode ? "border-gray-700/50" : "border-gray-200"
              }`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isNightMode ? "text-gray-100" : "text-gray-900"
                } mb-4`}
              >
                Actions
              </h2>
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center bg-teal-500 text-white px-6 py-3 rounded-full font-medium hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-teal-400 focus:outline-none"
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
                <button
                  onClick={() =>
                    handleDownload(photo.urls.regular, photo.title || photo.id)
                  }
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-teal-400 focus:outline-none ${
                    isNightMode
                      ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoDetails;
