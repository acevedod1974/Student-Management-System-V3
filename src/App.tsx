import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./pages/Dashboard";
import { CoursePage } from "./pages/CoursePage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
