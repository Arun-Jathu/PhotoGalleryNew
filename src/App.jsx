import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-600">Photo Gallery</h1>
      <Routes>
        <Route path="/" element={<div>Gallery Page (to be built)</div>} />
        <Route
          path="/photo/:id"
          element={<div>Photo Details Page (to be built)</div>}
        />
      </Routes>
    </div>
  );
}

export default App;
