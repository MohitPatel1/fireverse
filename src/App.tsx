import { FC, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { auth, db } from "./shared/firebase";
import { doc, setDoc } from "firebase/firestore";

import BarWave from "react-cssfx-loading/src/BarWave";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./pages/SignIn";
import { onAuthStateChanged } from "firebase/auth";
import { useStore } from "./store";

const App: FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber || user.providerData?.[0]?.phoneNumber,
          });
        } catch (error) {
          console.error("Error writing user document:", error);
        }
      } else {
        setCurrentUser(null);
      }
    });
  }, [setCurrentUser]);

  if (typeof currentUser === "undefined")
    return (
      <div className="flex min-h-screen items-center justify-center">
        <BarWave />
      </div>
    );

  return (
    <Routes>
      <Route
        index
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="sign-in" element={<SignIn />} />
      <Route
        path=":id"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
