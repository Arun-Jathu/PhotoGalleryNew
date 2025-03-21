import { Routes, Route, Link } from "react-router-dom";
import Gallery from "./components/Gallery";
import PhotoDetails from "./components/PhotoDetails";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 sticky top-0 z-10 shadow-lg">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight hover:text-gray-300 transition-colors"
          >
            Photo Gallery
          </Link>
          <div className="space-x-4">
            <Link
              to="/"
              className="text-sm font-medium hover:text-gray-300 transition-colors"
            >
              Home
            </Link>
            <a
              href="https://github.com/your-username/PhotoGalleryNew"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-gray-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </nav>
      </header>
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/photo/:id" element={<PhotoDetails />} />
        </Routes>
      </main>
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="mb-2">© 2025 Photo Gallery App. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://github.com/your-username/PhotoGalleryNew"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://your-portfolio-link"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Portfolio
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
