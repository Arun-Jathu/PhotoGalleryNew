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
        setPhotos(response.data.slice(0, 32)); // 30 photos for footer visibility
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
    <div className="my-12 mx-auto px-4 md:px-12">
      <div className="flex flex-wrap -mx-1 lg:-mx-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/4"
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
                  <p className="absolute right-2 bottom-2 bg-gray-900/80 text-gray-100 text-xs px-2 py-1 rounded">
                    Photo #{photo.id}
                  </p>
                </Link>
              </div>
              <header className="flex items-center justify-between leading-tight p-2 md:p-4">
                <h1 className="text-lg">
                  <Link
                    to={`/photo/${photo.id}`}
                    className="text-gray-100 hover:underline truncate block"
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
