import { Routes, Route, Link } from "react-router-dom";
import Gallery from "./components/Gallery";
import PhotoDetails from "./components/PhotoDetails";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <nav className="max-w-6xl mx-auto">
          <Link to="/" className="text-2xl font-bold">
            Photo Gallery
          </Link>
        </nav>
      </header>
      <main className="p-4 max-w-6xl mx-auto flex-grow">
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/photo/:id" element={<PhotoDetails />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 Photo Gallery App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
