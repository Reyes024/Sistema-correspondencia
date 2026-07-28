import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDashboard();
  }, []);

  async function cargarDashboard() {
    try {
      const response = await api.get('/dashboard');
      setDatos(response.data);
    } catch (err) {
      setError('No se pudo cargar la información del dashboard');
    } finally {
      setCargando(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  if (cargando) return <p style={{ padding: '40px' }}>Cargando dashboard...</p>;
  if (error) return <p style={{ padding: '40px', color: 'red' }}>{error}</p>;

  const maxCantidad = Math.max(...datos.grafico_por_estado.map((g) => g.cantidad), 1);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.titulo}>Dashboard</h1>
          <p style={styles.subtitulo}>Bienvenido, {user?.name} ({user?.rol})</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Cerrar Sesión</button>
      </header>

      <div style={styles.cards}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Correspondencia</p>
          <p style={styles.cardValue}>{datos.total_correspondencia}</p>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #f59e0b' }}>
          <p style={styles.cardLabel}>Registrado</p>
          <p style={styles.cardValue}>{datos.documentos_registrado}</p>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #10b981' }}>
          <p style={styles.cardLabel}>Distribuido</p>
          <p style={styles.cardValue}>{datos.documentos_distribuido}</p>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #ef4444' }}>
          <p style={styles.cardLabel}>Urgentes</p>
          <p style={styles.cardValue}>{datos.documentos_urgentes}</p>
        </div>
      </div>

      <div style={styles.graficoContainer}>
        <h3 style={{ marginTop: 0 }}>Distribución por estado</h3>
        {datos.grafico_por_estado.map((item) => (
          <div key={item.estado} style={styles.barraFila}>
            <span style={styles.barraLabel}>{item.estado}</span>
            <div style={styles.barraFondo}>
              <div
                style={{
                  ...styles.barraRelleno,
                  width: `${(item.cantidad / maxCantidad) * 100}%`,
                  backgroundColor: item.estado === 'DISTRIBUIDO' ? '#10b981' : '#f59e0b',
                }}
              />
            </div>
            <span style={styles.barraCantidad}>{item.cantidad}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '30px',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  titulo: { margin: 0, fontSize: '24px', color: '#1a1a1a' },
  subtitulo: { margin: '5px 0 0 0', color: '#666', fontSize: '14px' },
  logoutBtn: {
    padding: '10px 18px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    borderTop: '4px solid #2563eb',
  },
  cardLabel: { margin: 0, fontSize: '13px', color: '#666' },
  cardValue: { margin: '8px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a' },
  graficoContainer: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    maxWidth: '600px',
  },
  barraFila: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  barraLabel: { width: '110px', fontSize: '13px', color: '#333' },
  barraFondo: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: '4px',
    overflow: 'hidden',
    height: '20px',
    marginRight: '10px',
  },
  barraRelleno: { height: '100%', borderRadius: '4px' },
  barraCantidad: { width: '30px', textAlign: 'right', fontSize: '13px', fontWeight: 'bold' },
};