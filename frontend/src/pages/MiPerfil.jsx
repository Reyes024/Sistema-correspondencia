import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function MiPerfil() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password_actual: '',
    password_nueva: '',
  });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrores({});
    setMensaje('');
    setGuardando(true);

    const payload = { name: form.name, email: form.email };
    if (form.password_nueva) {
      payload.password_actual = form.password_actual;
      payload.password_nueva = form.password_nueva;
    }

    try {
      const response = await api.put('/usuarios', payload);
      setMensaje('Datos actualizados correctamente');
      setForm({ ...form, password_actual: '', password_nueva: '' });
      updateUser(response.data.user);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrores(err.response.data.errors || {});
        if (err.response.data.message) {
          setErrores((prev) => ({ ...prev, password_actual: [err.response.data.message] }));
        }
      } else {
        alert('Ocurrió un error al actualizar los datos');
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.titulo}>Mi Perfil</h2>
          <button onClick={() => navigate('/dashboard')} style={styles.volverBtn}>
            Volver al Dashboard
          </button>
        </div>

        {mensaje && <p style={styles.mensajeExito}>{mensaje}</p>}

        <form onSubmit={handleSubmit}>
          <h4 style={styles.seccion}>Datos personales</h4>
          <div style={styles.campo}>
            <label style={styles.label}>Nombre completo</label>
            <input name="name" value={form.name} onChange={handleChange} style={styles.input} />
            {errores.name && <span style={styles.errorTexto}>{errores.name[0]}</span>}
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Correo electrónico</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} style={styles.input} />
            {errores.email && <span style={styles.errorTexto}>{errores.email[0]}</span>}
          </div>

          <h4 style={styles.seccion}>Cambiar contraseña (opcional)</h4>
          <div style={styles.campo}>
            <label style={styles.label}>Contraseña actual</label>
            <input type="password" name="password_actual" value={form.password_actual} onChange={handleChange} style={styles.input} />
            {errores.password_actual && <span style={styles.errorTexto}>{errores.password_actual[0]}</span>}
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Nueva contraseña</label>
            <input type="password" name="password_nueva" value={form.password_nueva} onChange={handleChange} style={styles.input} />
            {errores.password_nueva && <span style={styles.errorTexto}>{errores.password_nueva[0]}</span>}
          </div>

          <div style={styles.botones}>
            <button type="submit" disabled={guardando} style={styles.guardarBtn}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { margin: 0, fontSize: '20px', color: '#1a1a1a' },
  volverBtn: {
    padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #ccc',
    borderRadius: '4px', cursor: 'pointer', color: '#333', fontSize: '13px',
  },
  mensajeExito: {
    backgroundColor: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '4px',
    fontSize: '13px', marginTop: '15px',
  },
  seccion: { fontSize: '14px', color: '#555', borderBottom: '1px solid #eee', paddingBottom: '5px', marginTop: '20px' },
  campo: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '13px', marginBottom: '5px', color: '#333' },
  input: {
    width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px',
    fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#1a1a1a',
  },
  errorTexto: { color: '#dc2626', fontSize: '12px' },
  botones: { display: 'flex', justifyContent: 'flex-end', marginTop: '20px' },
  guardarBtn: {
    padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none',
    borderRadius: '4px', cursor: 'pointer',
  },
};