import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPhotos } from "../features/photosSlice.js";
import { motion } from "framer-motion";
import imageCompression from "browser-image-compression";

// Gallery component: Displays a paginated grid of photos with upload and lightbox features
function Gallery({ searchTerm: propSearchTerm = "", setUploadedPhotos }) {
  const dispatch = useDispatch();
  const { photos, loading, error } = useSelector((state) => state.photos);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [tempDescription, setTempDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(propSearchTerm); // Local state for search
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
          onClick={() => dispatch(fetchPhotos(localSearchTerm || "random"))}
          className="ml-4 bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-all duration-300"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="mt-4 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div
            className="border-2 border-dashed border-teal-500 rounded-lg p-4 text-center bg-gray-800 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center h-20"
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
            <span className="text-gray-300 text-sm">
              Drag and drop or click to select
            </span>
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
              <p className="mt-2 text-teal-400 text-sm absolute left-4 bottom-2">
                {selectedFile.name}
              </p>
            )}
          </div>
          <button
            onClick={handleUpload}
            className="mt-2 w-full bg-teal-500 text-white py-1.5 rounded-lg hover:bg-teal-600 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed text-sm"
            disabled={!selectedFile}
          >
            Upload
          </button>
        </div>

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
            {currentPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <article className="overflow-hidden rounded-xl shadow-lg bg-gray-900 border border-gray-700/50 transform hover:scale-105 transition-transform duration-300">
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
                    <h3 className="text-base font-medium text-gray-200 line-clamp-2 mb-2">
                      <span title={photo.description ?? "Untitled"}>
                        {photo.description ?? "Untitled"}
                      </span>
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      Photo #{photo.id}
                    </p>
                    {editingPhotoId === photo.id ? (
                      <div className="space-y-4">
                        <textarea
                          value={tempDescription}
                          onChange={(e) => setTempDescription(e.target.value)}
                          placeholder="Enter a description..."
                          className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
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
                            className="bg-gray-600 text-gray-100 px-4 py-2 rounded-full font-medium hover:bg-gray-500 transition-all duration-300"
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
                          <p className="text-gray-300 text-sm line-clamp-2">
                            {localStorage.getItem(
                              `photo-description-${photo.id}`
                            )}
                          </p>
                        ) : (
                          <p className="text-gray-400 text-sm italic">
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
                          className="text-teal-400 hover:text-teal-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded text-sm"
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
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeLightbox}
          >
            <div className="relative max-w-4xl">
              <img
                src={selectedPhoto.urls.regular}
                alt={selectedPhoto.description ?? "Photo"}
                className="max-h-[80vh] max-w-full"
              />
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white text-2xl"
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
