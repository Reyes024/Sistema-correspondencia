import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Usuarios() {
  const [lista, setLista] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [ultimaPagina, setUltimaPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [rol, setRol] = useState('');
  const [estado, setEstado] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setPagina(1);
  }, [rol, estado]);

  useEffect(() => {
    cargarDatos();
  }, [rol, estado, pagina]);

  async function cargarDatos() {
    setCargando(true);
    try {
      const params = { page: pagina };
      if (rol) params.rol = rol;
      if (estado) params.estado = estado;

      const [resLista, resReporte] = await Promise.all([
        api.get('/usuarios', { params }),
        api.get('/usuarios/reporte'),
      ]);
      setLista(resLista.data.data);
      setUltimaPagina(resLista.data.last_page);
      setTotal(resLista.data.total);
      setReporte(resReporte.data);
    } catch (err) {
      setError('No se pudo cargar la lista de usuarios');
    } finally {
      setCargando(false);
    }
  }

  async function handleBaja(id) {
    if (!confirm('¿Confirmas dar de baja a este usuario?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      cargarDatos();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al dar de baja al usuario');
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>Gestión de Usuarios</h1>
        <div style={styles.headerBtns}>
          <button onClick={() => navigate('/dashboard')} style={styles.secundarioBtn}>
            Dashboard
          </button>
          <Link to="/usuarios/nuevo" style={styles.primarioBtn}>
            + Nuevo Usuario
          </Link>
        </div>
      </header>

      {reporte && (
        <div style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Activos</p>
            <p style={styles.cardValue}>{reporte.usuarios_activos}</p>
          </div>
          <div style={{ ...styles.card, borderTop: '4px solid #ef4444' }}>
            <p style={styles.cardLabel}>Inactivos</p>
            <p style={styles.cardValue}>{reporte.usuarios_inactivos}</p>
          </div>
          {reporte.usuarios_por_rol.map((r) => (
            <div key={r.rol} style={{ ...styles.card, borderTop: '4px solid #2563eb' }}>
              <p style={styles.cardLabel}>{r.rol}</p>
              <p style={styles.cardValue}>{r.total}</p>
            </div>
          ))}
        </div>
      )}

      <div style={styles.filtros}>
        <select value={rol} onChange={(e) => setRol(e.target.value)} style={styles.select}>
          <option value="">Todos los roles</option>
          <option value="Operador de Correspondencia">Operador de Correspondencia</option>
          <option value="Encargado de Área">Encargado de Área</option>
          <option value="Administrador">Administrador</option>
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} style={styles.select}>
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
      </div>

      {cargando && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!cargando && !error && (
        <>
          <table style={styles.tabla}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Correo</th>
                <th style={styles.th}>Rol</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
              {lista.map((u) => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.rol}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: u.estado === 'ACTIVO' ? '#d1fae5' : '#fee2e2',
                      color: u.estado === 'ACTIVO' ? '#065f46' : '#991b1b',
                    }}>
                      {u.estado}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {u.estado === 'ACTIVO' && (
                      <button onClick={() => handleBaja(u.id)} style={styles.accionBtnRojo}>
                        Dar de baja
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.paginacion}>
            <span style={styles.paginacionTexto}>
              Página {pagina} de {ultimaPagina} · {total} registros
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPagina((p) => p - 1)}
                disabled={pagina <= 1}
                style={{ ...styles.paginacionBtn, opacity: pagina <= 1 ? 0.5 : 1 }}
              >
                Anterior
              </button>
              <button
                onClick={() => setPagina((p) => p + 1)}
                disabled={pagina >= ultimaPagina}
                style={{ ...styles.paginacionBtn, opacity: pagina >= ultimaPagina ? 0.5 : 1 }}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif', padding: '30px', backgroundColor: '#f4f6f8',
    minHeight: '100vh', colorScheme: 'light',
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
  cards: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '15px', marginBottom: '20px',
  },
  card: {
    backgroundColor: '#fff', padding: '16px', borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #10b981',
  },
  cardLabel: { margin: 0, fontSize: '12px', color: '#666' },
  cardValue: { margin: '6px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' },
  filtros: { display: 'flex', gap: '10px', marginBottom: '20px' },
  select: {
    padding: '10px', border: '1px solid #ccc', borderRadius: '4px',
    backgroundColor: '#fff', color: '#1a1a1a',
  },
  tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' },
  th: { textAlign: 'left', padding: '12px', backgroundColor: '#f0f0f0', fontSize: '13px', color: '#555' },
  td: { padding: '12px', borderTop: '1px solid #eee', fontSize: '14px', color: '#1a1a1a' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  accionBtnRojo: {
    padding: '6px 12px', backgroundColor: '#dc2626', color: '#fff', border: 'none',
    borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
  },
  paginacion: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px',
  },
  paginacionTexto: { fontSize: '13px', color: '#666' },
  paginacionBtn: {
    padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #ccc',
    borderRadius: '4px', cursor: 'pointer', fontSize: '13px', color: '#1a1a1a',
  },
};