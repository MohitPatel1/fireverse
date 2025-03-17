import { FC } from "react";
import { IMAGE_PROXY } from "../../shared/constants";
import { useStore } from "../../store";
import { doc } from "firebase/firestore";
import { db } from "../../shared/firebase";
import { useDocumentQuery } from "../../hooks/useDocumentQuery";

interface UserInfoProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

const UserInfo: FC<UserInfoProps> = ({ isOpened, setIsOpened }) => {
  const currentUser = useStore((state) => state.currentUser);
  const { data: userData } = useDocumentQuery(
    `user-${currentUser?.uid}`,
    doc(db, "users", currentUser?.uid || "")
  );

  return (
    <div
      onClick={() => setIsOpened(false)}
      onKeyDown={(e) => e.key === "Escape" && setIsOpened(false)}
      role="button"
      tabIndex={0}
      className={`fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080] transition-all duration-300 ${
        isOpened ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="button"
        tabIndex={0}
        className="bg-dark mx-2 w-full max-w-[400px] rounded-lg"
      >
        <div className="border-dark-lighten flex items-center justify-between border-b py-3 px-3">
          <div className="flex-1" />
          <div className="flex flex-1 items-center justify-center">
            <h1 className="whitespace-nowrap text-center text-2xl">
              Your Profile
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <button
              onClick={() => setIsOpened(false)}
              type="button"
              className="bg-dark-lighten flex h-8 w-8 items-center justify-center rounded-full"
            >
              <i className="bx bx-x text-2xl" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-4">
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={IMAGE_PROXY(currentUser?.photoURL || "/default-avatar.png")}
              alt=""
            />
            <div>
              <h1 className="text-xl">{userData?.data()?.username}</h1>
              <p>ID: {currentUser?.uid}</p>
              <p>Username: {userData?.data()?.username}</p>
            </div>
          </div>

          <p className="mt-4 text-gray-400">
            This is your username for FireVerse
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
