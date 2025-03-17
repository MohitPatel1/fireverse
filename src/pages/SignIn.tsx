import { signInAnonymously } from "firebase/auth";
import { type FC, useState } from "react";
import { Navigate } from "react-router-dom";
import Alert from "../components/Alert";
import { auth, db } from "../shared/firebase";
import { useQueryParams } from "../hooks/useQueryParams";
import { useStore } from "../store";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";

const SignIn: FC = () => {
  const { redirect } = useQueryParams();
  const currentUser = useStore((state) => state.currentUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [username, setUsername] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate username
      if (username.length < 3) {
        throw new Error("Username must be at least 3 characters long");
      }
      if (username.length > 20) {
        throw new Error("Username must be at most 20 characters long");
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error("Username can only contain letters, numbers, and underscores");
      }

      const normalizedUsername = username.toLowerCase();

      // Check if username exists
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", normalizedUsername));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error("Username is already taken. Please choose another one.");
      }

      // Sign in anonymously
      const { user } = await signInAnonymously(auth);

      // Create new user profile
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: normalizedUsername,
        displayName: username,
        photoURL: null,
        phoneNumber: null,
        createdAt: new Date().toISOString()
      });

    } catch (err: unknown) {
      setIsAlertOpened(true);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) return <Navigate to={redirect || "/"} />;

  return (
    <>
      <div className="mx-[5vw] my-5 flex justify-center lg:my-10">
        <div className="w-full max-w-[1100px]">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <img className="h-8 w-8" src="/icon.svg" alt="" />
              <span className="text-2xl">FireVerse</span>
            </div>            
          </div>

          <div className="flex flex-col-reverse gap-10 md:mt-5 md:flex-row md:gap-5 lg:mt-10">
            <div className="flex-1">
              <img className="h-auto w-full" src="/illustration.svg" alt="" />
            </div>

            <div className="mt-12 flex flex-1 flex-col items-center gap-4 md:items-start lg:mt-24">
              <h1 className="text-center text-3xl md:text-left md:text-4xl">
                Choose your username
              </h1>
              <p className="text-center text-xl md:text-left md:text-2xl">
                Enter a unique username to start chatting with your friends.
              </p>

              <form onSubmit={handleSignIn} className="flex w-full max-w-[400px] flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-md bg-dark-lighten px-4 py-3 text-white outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex min-w-[250px] cursor-pointer items-center justify-center gap-3 rounded-md bg-primary p-3 text-white transition duration-300 hover:brightness-90 disabled:!cursor-default disabled:!brightness-75"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        text={error}
        isError
      />
    </>
  );
};

export default SignIn;
