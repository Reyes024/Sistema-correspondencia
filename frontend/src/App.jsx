import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './components/RutaProtegida';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Correspondencias from './pages/Correspondencias';
import NuevaCorrespondencia from './pages/NuevaCorrespondencia';
import DetalleCorrespondencia from './pages/DetalleCorrespondencia';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
          <Route path="/correspondencias" element={<RutaProtegida><Correspondencias /></RutaProtegida>} />
          <Route path="/correspondencias/nueva" element={<RutaProtegida><NuevaCorrespondencia /></RutaProtegida>} />
          <Route path="/correspondencias/:id" element={<RutaProtegida><DetalleCorrespondencia /></RutaProtegida>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;