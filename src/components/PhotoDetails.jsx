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
        <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading photo...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    );
  if (!photo)
    return <div className="text-center text-gray-400">Photo not found</div>;

  return (
    <div className="my-12 mx-auto px-4 md:px-12">
      <article className="overflow-hidden rounded-lg shadow-lg bg-gray-800 max-w-4xl mx-auto">
        <div className="relative">
          <img
            src={photo.url}
            alt={photo.title}
            className="block h-auto w-full hover:opacity-90 transition-opacity"
            onError={(e) => (e.target.src = "https://picsum.photos/600")}
          />
          <p className="absolute right-2 bottom-2 bg-gray-900/80 text-gray-100 text-xs px-2 py-1 rounded">
            Photo #{photo.id}
          </p>
        </div>
        <header className="flex items-center justify-between leading-tight p-2 md:p-4">
          <h1 className="text-lg">
            <span className="text-gray-100 truncate block">{photo.title}</span>
          </h1>
        </header>
        <footer className="flex items-center justify-between leading-none p-2 md:p-4">
          <p className="text-gray-400 text-sm">Photo ID: {photo.id}</p>
          <Link
            to="/"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
        </footer>
      </article>
    </div>
  );
}

export default PhotoDetails;
