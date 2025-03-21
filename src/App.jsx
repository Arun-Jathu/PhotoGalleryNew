import { Routes, Route } from "react-router-dom";
import Gallery from "./components/Gallery";
import PhotoDetails from "./components/PhotoDetails";

function App() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Photo Gallery</h1>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/photo/:id" element={<PhotoDetails />} />
      </Routes>
    </div>
  );
}

export default App;
