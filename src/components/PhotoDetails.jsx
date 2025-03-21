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
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!photo)
    return <div className="text-center text-gray-500">Photo not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <img
        src={photo.url}
        alt={photo.title}
        className="w-full h-96 object-cover rounded"
      />
      <h2 className="mt-4 text-2xl font-semibold">{photo.title}</h2>
      <p className="mt-2 text-gray-600">Photo ID: {photo.id}</p>
      <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
        Back to Gallery
      </Link>
    </div>
  );
}

export default PhotoDetails;
