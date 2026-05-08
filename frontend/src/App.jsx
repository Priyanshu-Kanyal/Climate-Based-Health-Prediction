import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import Landing from './pages/Landing';
import ReportForm from './pages/ReportForm';
import Alerts from './pages/Alerts';
import Awareness from './pages/Awareness';
import Settings from './pages/Settings';
import ChatBotPage from './pages/ChatBotPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/awareness" element={<Awareness />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chat" element={<ChatBotPage />} />
      </Routes>
    </>
  );
}

export default App
