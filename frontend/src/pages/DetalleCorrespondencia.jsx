import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function DetalleCorrespondencia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDetalle();
  }, [id]);

  async function cargarDetalle() {
    try {
      const response = await api.get(`/correspondencias/${id}`);
      setDatos(response.data);
    } catch (err) {
      setError('No se pudo cargar el detalle de la correspondencia');
    } finally {
      setCargando(false);
    }
  }

  if (cargando) return <p style={{ padding: '40px' }}>Cargando detalle...</p>;
  if (error) return <p style={{ padding: '40px', color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.titulo}>Folio: {datos.folio}</h2>
            <span style={{
              ...styles.badge,
              backgroundColor: datos.estado === 'DISTRIBUIDO' ? '#d1fae5' : '#fef3c7',
              color: datos.estado === 'DISTRIBUIDO' ? '#065f46' : '#92400e',
            }}>
              {datos.estado}
            </span>
          </div>
          <button onClick={() => navigate('/correspondencias')} style={styles.volverBtn}>
            Volver al listado
          </button>
        </div>

        <div style={styles.seccion}>
          <h4 style={styles.subtitulo}>Datos del Remitente</h4>
          <p style={styles.campo}><strong>Nombre:</strong> {datos.remitente_nombre}</p>
          <p style={styles.campo}><strong>Institución:</strong> {datos.remitente_institucion || 'N/A'}</p>
        </div>

        <div style={styles.seccion}>
          <h4 style={styles.subtitulo}>Datos del Destinatario</h4>
          <p style={styles.campo}><strong>Nombre:</strong> {datos.destinatario_nombre}</p>
          <p style={styles.campo}><strong>Área:</strong> {datos.area?.nombre || 'N/A'}</p>
        </div>

        <div style={styles.seccion}>
          <h4 style={styles.subtitulo}>Datos del Documento</h4>
          <p style={styles.campo}><strong>Asunto:</strong> {datos.asunto}</p>
          <p style={styles.campo}><strong>Número de fojas:</strong> {datos.numero_fojas || 'N/A'}</p>
          <p style={styles.campo}><strong>Tipo:</strong> {datos.tipo}</p>
          <p style={styles.campo}><strong>Fecha de recepción:</strong> {new Date(datos.fecha_recepcion).toLocaleDateString()}</p>
        </div>

        {datos.fecha_distribucion && (
          <div style={styles.seccion}>
            <h4 style={styles.subtitulo}>Historial</h4>
            <p style={styles.campo}>
              <strong>Distribuido el:</strong> {new Date(datos.fecha_distribucion).toLocaleString()}
            </p>
          </div>
        )}
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
    display: 'flex',
    justifyContent: 'center',
    colorScheme: 'light',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '600px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  titulo: { margin: '0 0 8px 0', fontSize: '20px', color: '#1a1a1a' },
  volverBtn: {
    padding: '8px 14px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#333',
    fontSize: '13px',
  },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  seccion: {
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid #eee',
  },
  subtitulo: { margin: '0 0 10px 0', fontSize: '14px', color: '#555' },
  campo: { margin: '6px 0', fontSize: '14px', color: '#1a1a1a' },
};