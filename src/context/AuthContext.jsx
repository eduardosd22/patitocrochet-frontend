import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sincronizar usuario de Firebase con nuestra base de datos MongoDB
  const syncWithBackend = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch(`${API_URL}/api/users/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      // Guardamos el rol real que viene de nuestra BD (puede ser 'admin')
      return { token, role: data.role || 'client' };
    } catch (err) {
      console.warn('Backend no disponible, usando rol por defecto:', err.message);
      const token = await firebaseUser.getIdToken();
      return { token, role: 'client' };
    }
  };

  const loginWithGoogle = () => {
    setAuthError(null);
    signInWithPopup(auth, googleProvider)
      .then(() => { /* onAuthStateChanged maneja el estado */ })
      .catch((error) => {
        if (error.code !== 'auth/popup-closed-by-user') {
          console.error('Error de autenticación:', error.code);
          setAuthError(error.message);
        }
      });
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Al detectar sesión, sincronizamos con MongoDB para obtener el rol real
        const { token, role } = await syncWithBackend(firebaseUser);
        setCurrentUser({ ...firebaseUser, token, role });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, loginWithGoogle, logout, authError };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
