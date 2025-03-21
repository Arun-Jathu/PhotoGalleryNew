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
        setPhotos(response.data.slice(0, 10)); // Limit to 10 photos for now
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch photos");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="border rounded-lg p-4 shadow-md">
          <img
            src={photo.thumbnailUrl}
            alt={photo.title}
            className="w-full h-40 object-cover rounded"
            onError={(e) => (e.target.src = "https://picsum.photos/150")}
          />
          <h3 className="mt-2 text-lg font-semibold">{photo.title}</h3>
          <Link
            to={`/photo/${photo.id}`}
            className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Gallery;
