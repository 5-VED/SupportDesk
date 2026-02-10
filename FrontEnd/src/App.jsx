import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Pages
import { Dashboard } from './pages/Dashboard';
import { TicketsList } from './pages/TicketsList';
import { TicketDetail } from './pages/TicketDetail';
import { Contacts } from './pages/Contacts';
import { Agents } from './pages/Agents';
import { Groups } from './pages/Groups';
import { Organizations } from './pages/Organizations';
import { Reports } from './pages/Reports';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';

function App() {
  return (
    <ThemeProvider>
      <Toaster position="bottom-center" />
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* App Routes */}
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketsList />} />
            <Route path="/tickets/:ticketId" element={<TicketDetail />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
