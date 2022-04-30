import React, { useContext, useEffect, useState } from "react";
import { auth, database } from "../firebase";
import { orderByKey, ref, set, get } from "firebase/database";


const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [userInDb, setUserInDb] = useState(false);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubcribe;
  }, []);

  useEffect(() => {

    if(userInDb){
        if(currentUser){
          get(ref(database, "users/" + currentUser.uid)).then(snapshot => {
            if(snapshot.exists()){
              const userVal = {...snapshot.val(), uid: currentUser.uid};
              setUserData(userVal);
            }
          }).catch(e => console.log("Get error: ", e)); 
        }
    }
  }, [userInDb, currentUser]);

  function register(email, username, password) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) => {
        set(ref(database, "users/" + credentials.user.uid), {
          email: email,
          username: username,
          easyHighscore: 0,
          mediumHighscore: 0,
          hardHighscore: 0
        }).then(() => setUserInDb(true));
        return credentials.user.updateProfile({
          displayName: username,
        });
      });
  }
  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password).then(() => setUserInDb(true));
  }
  function logout() {
    return auth.signOut().then(() => setUserInDb(false));
  }
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }
  const value = {
    currentUser,
    userData,
    setUserData,
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
