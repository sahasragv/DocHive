import { Navigate, Route, Routes } from 'react-router-dom';
import ChatPage from '../pages/Chat/ChatPage';
import ArchitecturePage from '../pages/Architecture/ArchitecturePage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import DocumentsPage from '../pages/Documents/DocumentsPage';
import LoginPage from '../pages/Login/LoginPage';
import UploadPage from '../pages/Upload/UploadPage';
import RetrievalPage from '../pages/Retrieval/RetrievalPage';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
          <Route
      path="/"
      element={
        localStorage.getItem('token')
          ? <Navigate to="/dashboard" replace />
          : <Navigate to="/login" replace />
      }
    />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/retrieval" element={<RetrievalPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
