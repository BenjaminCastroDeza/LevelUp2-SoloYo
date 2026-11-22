// src/services/userService.js
import { api } from './api';

const DEFAULT_USERS = [
  {
    id: 1,
    nombre: 'Administrador LevelUp',
    correo: 'admin@levelup.cl',
    telefono: '912345678',
    region: 'Región Metropolitana',
    comuna: 'Santiago',
    rol: 'ROLE_ADMIN'
  },
  {
    id: 2,
    nombre: 'Cliente LevelUp',
    correo: 'cliente@levelup.cl',
    telefono: '912345678',
    region: 'Región Metropolitana',
    comuna: 'Santiago',
    rol: 'ROLE_CLIENTE'
  }
];

const getLocalUsers = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('users'));
    if (Array.isArray(stored) && stored.length > 0) {
      return stored;
    }
  } catch {}
  return [...DEFAULT_USERS];
};

const saveLocalUsers = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch {}
};

export const userService = {
  /**
   * Obtiene todos los usuarios desde el microservicio MS-Login (8081).
   * Si no hay conexión, recurre al almacenamiento local sincronizado.
   */
  async getAll() {
    try {
      const data = await api.getUsuarios();
      if (Array.isArray(data)) {
        saveLocalUsers(data);
        return data;
      }
    } catch (err) {
      // Modo offline / fallback
      return getLocalUsers();
    }
    return getLocalUsers();
  },

  /**
   * Obtiene un usuario por ID
   */
  async getById(id) {
    try {
      return await api.getUsuarioById(id);
    } catch {
      const users = getLocalUsers();
      const found = users.find((u) => String(u.id) === String(id));
      if (!found) throw new Error('Usuario no encontrado');
      return found;
    }
  },

  /**
   * Crea un nuevo usuario en la base de datos MySQL (MS-Login)
   */
  async create(usuarioData) {
    let created;
    try {
      created = await api.crearUsuario(usuarioData);
    } catch (err) {
      // Si la API falla o no está conectada, simular localmente
      const localUsers = getLocalUsers();
      if (localUsers.some((u) => u.correo.toLowerCase() === usuarioData.correo.toLowerCase())) {
        throw new Error('Ya existe un usuario con este correo electrónico');
      }
      created = {
        id: Date.now(),
        ...usuarioData,
        rol: usuarioData.rol || 'ROLE_CLIENTE'
      };
    }

    const currentUsers = getLocalUsers();
    const updated = [...currentUsers.filter((u) => String(u.id) !== String(created.id)), created];
    saveLocalUsers(updated);
    return created;
  },

  /**
   * Actualiza los datos de un usuario en el backend
   */
  async update(id, usuarioData) {
    let updated;
    try {
      updated = await api.actualizarUsuario(id, usuarioData);
    } catch {
      const users = getLocalUsers();
      const index = users.findIndex((u) => String(u.id) === String(id));
      if (index === -1) throw new Error('Usuario no encontrado');
      updated = { ...users[index], ...usuarioData };
    }

    const currentUsers = getLocalUsers();
    const list = currentUsers.map((u) => (String(u.id) === String(id) ? { ...u, ...updated } : u));
    saveLocalUsers(list);
    return updated;
  },

  /**
   * Cambia el rol del usuario (ROLE_ADMIN o ROLE_CLIENTE)
   */
  async changeRole(id, nuevoRol) {
    try {
      await api.cambiarRolUsuario(id, nuevoRol);
    } catch {}

    const users = getLocalUsers();
    const updated = users.map((u) => (String(u.id) === String(id) ? { ...u, rol: nuevoRol } : u));
    saveLocalUsers(updated);
    return true;
  },

  /**
   * Elimina un usuario por su ID
   */
  async delete(id) {
    try {
      await api.eliminarUsuario(id);
    } catch {}

    const users = getLocalUsers();
    const filtered = users.filter((u) => String(u.id) !== String(id));
    saveLocalUsers(filtered);
    return true;
  }
};
