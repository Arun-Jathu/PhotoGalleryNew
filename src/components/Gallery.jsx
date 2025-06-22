import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPhotos } from "../features/photosSlice.js";
import { motion } from "framer-motion";
import imageCompression from "browser-image-compression";

// Gallery component: Displays a paginated grid of photos with upload and lightbox features
function Gallery({
  searchTerm: propSearchTerm = "",
  setUploadedPhotos,
  isNightMode,
}) {
  const dispatch = useDispatch();
  const { photos, loading, error } = useSelector((state) => state.photos);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [tempDescription, setTempDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(propSearchTerm); // Initialize with prop
  const photosPerPage = 8;

  // Initialize uploadedPhotos from localStorage and sync with prop
  const [uploadedPhotos, setLocalUploadedPhotos] = useState(() => {
    const savedPhotos = localStorage.getItem("uploadedPhotos");
    return savedPhotos ? JSON.parse(savedPhotos) : [];
  });

  // Sync local state with prop on mount and updates
  useEffect(() => {
    setUploadedPhotos(uploadedPhotos);
  }, [uploadedPhotos, setUploadedPhotos]);

  // Sync localSearchTerm with propSearchTerm
  useEffect(() => {
    console.log("Syncing localSearchTerm with propSearchTerm:", propSearchTerm);
    if (localSearchTerm !== propSearchTerm) {
      setLocalSearchTerm(propSearchTerm);
    }
  }, [propSearchTerm, localSearchTerm]);

  // Calculate derived values
  const filteredPhotos = [...photos, ...uploadedPhotos].filter(
    (photo) =>
      !localSearchTerm ||
      (photo?.description ?? "")
        .toLowerCase()
        .includes(localSearchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = filteredPhotos.slice(
    indexOfFirstPhoto,
    indexOfLastPhoto
  );

  useEffect(() => {
    console.log("useEffect triggered with localSearchTerm:", localSearchTerm);
    if (localSearchTerm.trim()) {
      dispatch(fetchPhotos(localSearchTerm));
    } else {
      dispatch(fetchPhotos("random"));
    }
  }, [dispatch, localSearchTerm]);

  useEffect(() => {
    console.log("Uploaded photos updated:", uploadedPhotos);
    console.log("Filtered Photos:", filteredPhotos);
    console.log("Current Photos:", currentPhotos);
    console.log(
      "Index of First Photo:",
      indexOfFirstPhoto,
      "Index of Last Photo:",
      indexOfLastPhoto
    );
    // Reset to first page if the total number of pages changes due to new uploads
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
    // Save uploadedPhotos to localStorage
    try {
      localStorage.setItem("uploadedPhotos", JSON.stringify(uploadedPhotos));
      setUploadedPhotos(uploadedPhotos); // Sync with parent state
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [
    uploadedPhotos,
    currentPhotos,
    totalPages,
    currentPage,
    setUploadedPhotos,
  ]);

  const handleUpload = async () => {
    if (selectedFile) {
      const options = {
        maxSizeMB: 1, // Compress to under 1MB
        maxWidthOrHeight: 800, // Resize to max 800px dimension
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(selectedFile, options);
        const url = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(compressedFile);
        });
        setLocalUploadedPhotos((prev) => {
          const newPhotos = [
            ...prev,
            {
              id: Date.now().toString(),
              description: compressedFile.name,
              urls: { small: url, regular: url },
              albumId: 1,
            },
          ];
          console.log(
            "New uploaded photos with compressed data URL:",
            newPhotos
          );
          return newPhotos;
        });
        setSelectedFile(null);
        document.getElementById("photoUpload").value = "";
        setCurrentPage(1); // Reset to first page
      } catch (error) {
        console.error("Image compression failed:", error);
      }
    } else {
      console.log("No file selected for upload");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleLastPage = () => setCurrentPage(totalPages);

  const handleEditDescription = (photoId, currentDescription) => {
    setEditingPhotoId(photoId);
    setTempDescription(currentDescription || "");
  };

  const handleSaveDescription = (photoId) => {
    localStorage.setItem(`photo-description-${photoId}`, tempDescription);
    setEditingPhotoId(null);
  };

  const handleCancelEdit = () => {
    setEditingPhotoId(null);
    setTempDescription("");
  };

  const openLightbox = (photo) => setSelectedPhoto(photo);
  const closeLightbox = () => setSelectedPhoto(null);

  // Function to trim title to a fixed length
  const trimTitle = (title, maxLength = 20) => {
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + "...";
    }
    return title;
  };

  if (loading)
    return (
      <div
        className={`text-center py-12 ${
          isNightMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg">Loading photos...</p>
      </div>
    );

  if (error)
    return (
      <div
        className={`text-center p-6 rounded-lg ${
          isNightMode ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-700"
        }`}
      >
        {error}
        <button
          onClick={() => dispatch(fetchPhotos(localSearchTerm || "random"))}
          className="ml-4 bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-all duration-300"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div
      className={`mt-4 w-full ${
        isNightMode
          ? "bg-gray-900"
          : "bg-gradient-to-b from-gray-50 to-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div
            className={`border-2 border-dashed border-teal-500 rounded-lg p-4 text-center flex items-center justify-center h-20 ${
              isNightMode
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "bg-white hover:bg-gray-100 text-gray-600"
            } transition-all duration-300`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) {
                console.log("File dropped:", file);
                setSelectedFile(file);
              }
            }}
            onClick={() => document.getElementById("photoUpload").click()}
          >
            <svg
              className="h-6 w-6 text-teal-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-sm">Drag and drop or click to select</span>
            <input
              type="file"
              id="photoUpload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                console.log("File selected:", file);
                if (file) {
                  setSelectedFile(file);
                }
              }}
            />
            {selectedFile && (
              <p
                className={`mt-2 text-sm absolute left-4 bottom-2 ${
                  isNightMode ? "text-teal-400" : "text-teal-600"
                }`}
              >
                {selectedFile.name}
              </p>
            )}
          </div>
          <button
            onClick={handleUpload}
            className={`mt-2 w-full py-1.5 rounded-lg hover:bg-teal-600 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed text-sm ${
              isNightMode ? "bg-teal-500 text-white" : "bg-teal-500 text-white"
            }`}
            disabled={!selectedFile}
          >
            Upload
          </button>
        </div>

        {currentPhotos.length === 0 ? (
          <div
            className={`text-center text-lg py-12 ${
              isNightMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No photos found
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {currentPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <article
                  className={`overflow-hidden rounded-xl shadow-lg border transform hover:scale-105 transition-transform duration-300 ${
                    isNightMode
                      ? "bg-gray-800 border-gray-700/50"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    onClick={() => openLightbox(photo)}
                    className="cursor-pointer"
                  >
                    <img
                      src={
                        photo.urls?.small || "https://via.placeholder.com/150"
                      }
                      alt={photo.description ?? "Photo"}
                      loading="lazy"
                      className="block h-48 w-full object-cover hover:opacity-90 transition-opacity duration-300"
                      onError={(e) => {
                        console.log(
                          "Image load failed for:",
                          photo.urls?.small
                        );
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3
                      className={`text-base font-medium line-clamp-1 mb-2 ${
                        isNightMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      <span title={photo.description ?? "Untitled"}>
                        {trimTitle(photo.description ?? "Untitled")}
                      </span>
                    </h3>
                    <p
                      className={`text-sm mb-2 ${
                        isNightMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Photo #{photo.id}
                    </p>
                    {editingPhotoId === photo.id ? (
                      <div className="space-y-4">
                        <textarea
                          value={tempDescription}
                          onChange={(e) => setTempDescription(e.target.value)}
                          placeholder="Enter a description..."
                          className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 ${
                            isNightMode
                              ? "bg-gray-700 text-gray-100 border-gray-600"
                              : "bg-white text-gray-900 border-gray-300"
                          }`}
                          rows="3"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleSaveDescription(photo.id)}
                            className="bg-teal-500 text-white px-4 py-2 rounded-full font-medium hover:bg-teal-600 transition-all duration-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                              isNightMode
                                ? "bg-gray-600 text-gray-100 hover:bg-gray-500"
                                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {localStorage.getItem(
                          `photo-description-${photo.id}`
                        ) ? (
                          <p
                            className={`text-sm line-clamp-2 ${
                              isNightMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {localStorage.getItem(
                              `photo-description-${photo.id}`
                            )}
                          </p>
                        ) : (
                          <p
                            className={`text-sm italic ${
                              isNightMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            No description available.
                          </p>
                        )}
                        <button
                          onClick={() =>
                            handleEditDescription(
                              photo.id,
                              localStorage.getItem(
                                `photo-description-${photo.id}`
                              )
                            )
                          }
                          className={`transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded text-sm ${
                            isNightMode
                              ? "text-teal-400 hover:text-teal-300"
                              : "text-teal-600 hover:text-teal-500"
                          }`}
                        >
                          {localStorage.getItem(`photo-description-${photo.id}`)
                            ? "Edit Description"
                            : "Add Description"}
                        </button>
                      </div>
                    )}
                    <div className="mt-4">
                      <Link
                        to={`/photo/${photo.id}`}
                        className="inline-block bg-teal-500 text-white px-6 py-2 rounded-full font-medium hover:bg-teal-600 transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              </motion.div>
            ))}
          </motion.div>
        )}
        {filteredPhotos.length > 0 && (
          <div
            className={`mt-12 flex justify-center items-center space-x-3 ${
              isNightMode ? "text-gray-200" : "text-gray-600"
            }`}
          >
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full font-medium text-sm sm:text-base min-w-[80px] ${
                currentPage === 1
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : `${
                      isNightMode
                        ? "bg-teal-500 hover:bg-teal-600"
                        : "bg-teal-500 hover:bg-teal-600"
                    } transform hover:scale-105`
              } transition-all duration-300 focus:ring-2 focus:ring-teal-400 focus:outline-none`}
            >
              First
            </button>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-full font-medium ${
                currentPage === 1
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : `${
                      isNightMode
                        ? "bg-teal-500 hover:bg-teal-600"
                        : "bg-teal-500 hover:bg-teal-600"
                    } transform hover:scale-105`
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
            <span
              className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium ${
                isNightMode
                  ? "bg-teal-600 text-gray-100"
                  : "bg-teal-500 text-white"
              }`}
            >
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full font-medium ${
                currentPage === totalPages
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : `${
                      isNightMode
                        ? "bg-teal-500 hover:bg-teal-600"
                        : "bg-teal-500 hover:bg-teal-600"
                    } transform hover:scale-105`
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
              className={`px-4 py-2 rounded-full font-medium text-sm sm:text-base min-w-[80px] ${
                currentPage === totalPages
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : `${
                      isNightMode
                        ? "bg-teal-500 hover:bg-teal-600"
                        : "bg-teal-500 hover:bg-teal-600"
                    } transform hover:scale-105`
              } transition-all duration-300 focus:ring-2 focus:ring-teal-400 focus:outline-none`}
            >
              Last
            </button>
          </div>
        )}
        {selectedPhoto && (
          <div
            className={`fixed inset-0 ${
              isNightMode
                ? "bg-black bg-opacity-75"
                : "bg-gray-200 bg-opacity-75"
            } flex items-center justify-center z-50`}
            onClick={closeLightbox}
          >
            <div
              className={`relative max-w-4xl ${
                isNightMode ? "bg-gray-800" : "bg-white"
              } p-4 rounded-lg shadow-lg`}
            >
              <img
                src={selectedPhoto.urls.regular}
                alt={selectedPhoto.description ?? "Photo"}
                className="max-h-[80vh] max-w-full"
              />
              <button
                onClick={closeLightbox}
                className={`absolute top-4 right-4 text-2xl ${
                  isNightMode ? "text-white" : "text-gray-900"
                }`}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;
