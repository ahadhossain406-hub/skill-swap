import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import MatchesPage from './pages/MatchesPage';
import PublicProfilePage from './pages/PublicProfilePage';
import RequestsPage from './pages/RequestsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Logged-in routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/users/:userId" element={<PublicProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}