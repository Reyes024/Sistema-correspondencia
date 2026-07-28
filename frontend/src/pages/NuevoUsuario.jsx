import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NuevoUsuario() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rol: 'Operador de Correspondencia',
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrores({});
    setGuardando(true);

    try {
      await api.post('/usuarios', form);
      navigate('/usuarios');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrores(err.response.data.errors);
      } else if (err.response?.status === 403) {
        alert('No autorizado: se requiere rol de Administrador');
      } else {
        alert('Ocurrió un error al registrar el usuario');
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Nuevo Usuario</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.campo}>
            <label style={styles.label}>Nombre completo *</label>
            <input name="name" value={form.name} onChange={handleChange} style={styles.input} />
            {errores.name && <span style={styles.errorTexto}>{errores.name[0]}</span>}
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Correo electrónico *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={styles.input} />
            {errores.email && <span style={styles.errorTexto}>{errores.email[0]}</span>}
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Contraseña temporal *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} style={styles.input} />
            {errores.password && <span style={styles.errorTexto}>{errores.password[0]}</span>}
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Rol *</label>
            <select name="rol" value={form.rol} onChange={handleChange} style={styles.input}>
              <option value="Operador de Correspondencia">Operador de Correspondencia</option>
              <option value="Encargado de Área">Encargado de Área</option>
              <option value="Administrador">Administrador</option>
            </select>
            {errores.rol && <span style={styles.errorTexto}>{errores.rol[0]}</span>}
          </div>

          <div style={styles.botones}>
            <button type="button" onClick={() => navigate('/usuarios')} style={styles.cancelarBtn}>
              Cancelar
            </button>
            <button type="submit" disabled={guardando} style={styles.guardarBtn}>
              {guardando ? 'Guardando...' : 'Registrar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif', padding: '30px', backgroundColor: '#f4f6f8',
    minHeight: '100vh', display: 'flex', justifyContent: 'center', colorScheme: 'light',
  },
  card: {
    backgroundColor: '#fff', padding: '30px', borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', width: '100%', maxWidth: '500px',
  },
  titulo: { marginTop: 0, fontSize: '20px', color: '#1a1a1a' },
  campo: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '13px', marginBottom: '5px', color: '#333' },
  input: {
    width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px',
    fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#1a1a1a',
  },
  errorTexto: { color: '#dc2626', fontSize: '12px' },
  botones: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  cancelarBtn: {
    padding: '10px 18px', backgroundColor: '#fff', border: '1px solid #ccc',
    borderRadius: '4px', cursor: 'pointer', color: '#333',
  },
  guardarBtn: {
    padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none',
    borderRadius: '4px', cursor: 'pointer',
  },
};