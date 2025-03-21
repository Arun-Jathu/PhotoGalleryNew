import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function PhotoDetails() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/photos/${id}`)
      .then((response) => {
        setPhoto(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch photo details");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading photo...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  if (!photo)
    return <div className="text-center text-gray-500">Photo not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full h-96 object-cover"
          onError={(e) => (e.target.src = "https://picsum.photos/600")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white truncate">
          {photo.title}
        </h2>
      </div>
      <div className="mt-6 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-6 shadow-lg">
        <p className="text-gray-600">Photo ID: {photo.id}</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
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
      </div>
    </div>
  );
}

export default PhotoDetails;
