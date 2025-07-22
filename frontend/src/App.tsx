import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GenderSelectPage from './pages/GenderSelectPage'
import CameraPage from './pages/CameraPage'
import AnalysisPage from './pages/AnalysisPage'
import ResultPage from './pages/ResultPage'
import RecommendationPage from './pages/RecommendationPage'

function App() {
  return (
    <Router>
      <div className="mobile-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gender-select" element={<GenderSelectPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/recommendations" element={<RecommendationPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 