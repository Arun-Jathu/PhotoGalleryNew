import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/photos")
      .then((response) => {
        setPhotos(response.data.slice(0, 30)); // 30 photos for footer visibility
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch photos");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading photos...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <img
            src={photo.thumbnailUrl}
            alt={photo.title}
            className="w-full h-48 object-cover rounded-lg mb-3"
            onError={(e) => (e.target.src = "https://picsum.photos/150")}
          />
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {photo.title}
          </h3>
          <Link
            to={`/photo/${photo.id}`}
            className="mt-3 inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Gallery;
