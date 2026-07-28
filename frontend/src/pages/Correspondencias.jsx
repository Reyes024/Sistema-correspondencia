import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Correspondencias() {
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [buscar, setBuscar] = useState('');
  const [estado, setEstado] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarLista();
  }, [buscar, estado]);

  async function cargarLista() {
    try {
      const params = {};
      if (buscar) params.buscar = buscar;
      if (estado) params.estado = estado;

      const response = await api.get('/correspondencias', { params });
      setLista(response.data);
    } catch (err) {
      setError('No se pudo cargar la lista de correspondencia');
    } finally {
      setCargando(false);
    }
  }

  async function handleDistribuir(id) {
    if (!confirm('¿Confirmas distribuir esta correspondencia?')) return;
    try {
      await api.post(`/correspondencias/${id}/distribuir`);
      cargarLista();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al distribuir');
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>Correspondencia</h1>
        <div style={styles.headerBtns}>
          <button onClick={() => navigate('/dashboard')} style={styles.secundarioBtn}>
            Dashboard
          </button>
          <Link to="/correspondencias/nueva" style={styles.primarioBtn}>
            + Nueva Correspondencia
          </Link>
        </div>
      </header>

      <div style={styles.filtros}>
        <input
          type="text"
          placeholder="Buscar por folio o remitente..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          style={styles.inputBusqueda}
        />
        <select value={estado} onChange={(e) => setEstado(e.target.value)} style={styles.select}>
          <option value="">Todos los estados</option>
          <option value="REGISTRADO">Registrado</option>
          <option value="DISTRIBUIDO">Distribuido</option>
        </select>
      </div>

      {cargando && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!cargando && !error && (
        <table style={styles.tabla}>
          <thead>
            <tr>
              <th style={styles.th}>Folio</th>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Remitente</th>
              <th style={styles.th}>Asunto</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No hay correspondencia registrada
                </td>
              </tr>
            )}
            {lista.map((item) => (
              <tr key={item.id}>
                <td style={styles.td}>{item.folio}</td>
                <td style={styles.td}>{new Date(item.fecha_recepcion).toLocaleDateString()}</td>
                <td style={styles.td}>{item.remitente_nombre}</td>
                <td style={styles.td}>{item.asunto}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: item.estado === 'DISTRIBUIDO' ? '#d1fae5' : '#fef3c7',
                    color: item.estado === 'DISTRIBUIDO' ? '#065f46' : '#92400e',
                  }}>
                    {item.estado}
                  </span>
                </td>
                <td style={styles.td}>
                  <button onClick={() => navigate(`/correspondencias/${item.id}`)} style={styles.accionBtn}>
                    Ver
                  </button>
                  {item.estado === 'REGISTRADO' && (
                    <button onClick={() => handleDistribuir(item.id)} style={styles.accionBtnVerde}>
                      Distribuir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '30px',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    colorScheme: 'light',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  titulo: { margin: 0, fontSize: '24px', color: '#1a1a1a' },
  headerBtns: { display: 'flex', gap: '10px' },
  primarioBtn: {
    padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none',
    borderRadius: '4px', cursor: 'pointer', textDecoration: 'none', fontSize: '14px',
  },
  secundarioBtn: {
    padding: '10px 16px', backgroundColor: '#fff', color: '#333', border: '1px solid #ccc',
    borderRadius: '4px', cursor: 'pointer', fontSize: '14px',
  },
  filtros: { display: 'flex', gap: '10px', marginBottom: '20px' },
  inputBusqueda: {
    flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px',
    backgroundColor: '#fff', color: '#1a1a1a',
  },
  select: {
    padding: '10px', border: '1px solid #ccc', borderRadius: '4px',
    backgroundColor: '#fff', color: '#1a1a1a',
  },
  tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' },
  th: { textAlign: 'left', padding: '12px', backgroundColor: '#f0f0f0', fontSize: '13px', color: '#555' },
  td: { padding: '12px', borderTop: '1px solid #eee', fontSize: '14px', color: '#1a1a1a' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  accionBtn: {
    padding: '6px 12px', marginRight: '6px', backgroundColor: '#e5e7eb', border: 'none',
    borderRadius: '4px', cursor: 'pointer', fontSize: '13px', color: '#1a1a1a',
  },
  accionBtnVerde: {
    padding: '6px 12px', backgroundColor: '#10b981', color: '#fff', border: 'none',
    borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
  },
};