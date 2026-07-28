import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NuevaCorrespondencia() {
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({
    remitente_nombre: '',
    remitente_institucion: '',
    area_id: '',
    destinatario_nombre: '',
    asunto: '',
    numero_fojas: '',
    tipo: 'ORDINARIO',
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/areas').then((res) => setAreas(res.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrores({});
    setGuardando(true);

    try {
      await api.post('/correspondencias', form);
      navigate('/correspondencias');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrores(err.response.data.errors);
      } else {
        alert('Ocurrió un error al registrar la correspondencia');
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Registrar Correspondencia de Entrada</h2>

        <form onSubmit={handleSubmit}>
          <h4 style={styles.seccion}>Datos del Remitente</h4>
          <div style={styles.fila}>
            <div style={styles.campo}>
              <label style={styles.label}>Nombre *</label>
              <input name="remitente_nombre" value={form.remitente_nombre} onChange={handleChange} style={styles.input} />
              {errores.remitente_nombre && <span style={styles.errorTexto}>{errores.remitente_nombre[0]}</span>}
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Institución</label>
              <input name="remitente_institucion" value={form.remitente_institucion} onChange={handleChange} style={styles.input} />
            </div>
          </div>

          <h4 style={styles.seccion}>Datos del Destinatario</h4>
          <div style={styles.fila}>
            <div style={styles.campo}>
              <label style={styles.label}>Área destino *</label>
              <select name="area_id" value={form.area_id} onChange={handleChange} style={styles.input}>
                <option value="">Selecciona un área</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
              {errores.area_id && <span style={styles.errorTexto}>{errores.area_id[0]}</span>}
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Nombre del destinatario *</label>
              <input name="destinatario_nombre" value={form.destinatario_nombre} onChange={handleChange} style={styles.input} />
              {errores.destinatario_nombre && <span style={styles.errorTexto}>{errores.destinatario_nombre[0]}</span>}
            </div>
          </div>

          <h4 style={styles.seccion}>Datos del Documento</h4>
          <div style={styles.campo}>
            <label style={styles.label}>Asunto *</label>
            <input name="asunto" value={form.asunto} onChange={handleChange} style={styles.input} />
            {errores.asunto && <span style={styles.errorTexto}>{errores.asunto[0]}</span>}
          </div>

          <div style={styles.fila}>
            <div style={styles.campo}>
              <label style={styles.label}>Número de fojas</label>
              <input type="number" name="numero_fojas" value={form.numero_fojas} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.campo}>
              <label style={styles.label}>Tipo *</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} style={styles.input}>
                <option value="ORDINARIO">Ordinario</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>
          </div>

          <div style={styles.botones}>
            <button type="button" onClick={() => navigate('/correspondencias')} style={styles.cancelarBtn}>
              Cancelar
            </button>
            <button type="submit" disabled={guardando} style={styles.guardarBtn}>
              {guardando ? 'Guardando...' : 'Registrar Correspondencia'}
            </button>
          </div>
        </form>
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
  titulo: { marginTop: 0, fontSize: '20px', color: '#1a1a1a' },
  seccion: { fontSize: '14px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '5px', marginTop: '20px' },
  fila: { display: 'flex', gap: '15px' },
  campo: { flex: 1, marginBottom: '12px' },
  label: { display: 'block', fontSize: '13px', marginBottom: '5px', color: '#333' },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  errorTexto: { color: '#dc2626', fontSize: '12px' },
  botones: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  cancelarBtn: {
    padding: '10px 18px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#333',
  },
  guardarBtn: {
    padding: '10px 18px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};