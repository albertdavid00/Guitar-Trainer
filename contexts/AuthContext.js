import React, { useContext, useEffect, useState } from "react";
import { auth, database } from "../firebase";
import { ref, set } from "firebase/database";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubcribe;
  }, []);

  function register(email, username, password) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) => {
        const user = {
          uid: credentials.user.uid,
          email: email,
          username: username,
          highscore: 0
        };
        set(ref(database, "users/" + user.uid), {
          email: email,
          username: username,
          highscore: 0
        });
        return credentials.user.updateProfile({
          displayName: username,
        });
      });
  }
  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }
  function logout() {
    return auth.signOut();
  }
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }
  const value = {
    currentUser,
    register,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
