import { FC, useState } from "react";
import { IMAGE_PROXY, THEMES } from "../../shared/constants";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import Spin from "react-cssfx-loading/src/Spin";
import { db } from "../../shared/firebase";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";

interface CreateConversationProps {
  setIsOpened: (value: boolean) => void;
}

const CreateConversation: FC<CreateConversationProps> = ({ setIsOpened }) => {
  const { data, error, loading } = useCollectionQuery(
    "all-users",
    collection(db, "users")
  );
  console.log("data", data);

  const [isCreating, setIsCreating] = useState(false);

  const currentUser = useStore((state) => state.currentUser);

  const [selected, setSelected] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleToggle = (id: string) => {
    console.log("id", id);
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleCreateConversation = async () => {
    setIsCreating(true);
  
    if (!currentUser?.uid) {
      console.error("User is not authenticated.");
      setIsCreating(false);
      return;
    }
  
    const sorted = [...selected, currentUser.uid]
      .filter((uid) => uid !== undefined)
      .sort();
  
    console.log("sorted", sorted);
  
    try {
      const q = query(collection(db, "conversations"), where("users", "==", sorted));
      const querySnapshot = await getDocs(q);
  
      console.log("querySnapshot", querySnapshot);
      console.log("currentUser", THEMES);
  
      if (querySnapshot.empty) {
        try {
          const created = await addDoc(collection(db, "conversations"), {
            users: sorted,
            group:
              sorted.length > 2
                ? {
                    admins: [currentUser.uid],
                    groupName: null,
                    groupImage: null,
                  }
                : {},
            updatedAt: serverTimestamp(),
            seen: {},
            theme: "default",
          });

          alert("Conversation created successfully");
  
          setIsCreating(false);
          setIsOpened(false);
          navigate(`/${created.id}`);
        } catch (error) {
          console.error("Error creating conversation:", error);
          setIsCreating(false);
        }
      } else {
        console.log("querySnapshot.docs[0].id", querySnapshot.docs[0].id);
        setIsOpened(false);
        navigate(`/${querySnapshot.docs[0].id}`);
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setIsCreating(false);
    }
  };

  return (
    <div
      onClick={() => setIsOpened(false)}
      className="fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-dark mx-3 w-full max-w-[500px] overflow-hidden rounded-lg"
      >
        <div className="border-dark-lighten flex items-center justify-between border-b py-3 px-3">
          <div className="flex-1"></div>
          <div className="flex flex-1 items-center justify-center">
            <h1 className="whitespace-nowrap text-center text-2xl">
              New conversation
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <button
              onClick={() => setIsOpened(false)}
              className="bg-dark-lighten flex h-8 w-8 items-center justify-center rounded-full"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Spin color="#0D90F3" />
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center">
            <p className="text-center">Something went wrong</p>
          </div>
        ) : (
          <>
            {isCreating && (
              <div className="absolute top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080]">
                <Spin color="#0D90F3" />
              </div>
            )}
            <div className="flex h-96 flex-col items-stretch gap-2 overflow-y-auto py-2">
              {data?.docs.map((doc) => console.log("data", doc.data()))}
              {data?.docs
                .filter((doc) => doc.data().uid !== currentUser?.uid)
                .map((doc) => (
                  <div
                    key={doc.data().uid}
                    onClick={() => handleToggle(doc.data().uid)}
                    className="hover:bg-dark-lighten flex cursor-pointer items-center gap-2 px-5 py-2 transition"
                  >
                    <input
                      className="flex-shrink-0 cursor-pointer"
                      type="checkbox"
                      checked={selected.includes(doc.data().uid)}
                      readOnly
                    />
                    <img
                      className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                      src={IMAGE_PROXY(doc.data().photoURL)}
                      alt=""
                    />
                    <p>{doc.data().displayName}</p>
                  </div>
                ))}
            </div>
            <div className="border-dark-lighten flex justify-end border-t p-3">
              <button
                disabled={selected.length === 0}
                onClick={handleCreateConversation}
                className="bg-dark-lighten rounded-lg py-2 px-3 transition duration-300 hover:brightness-125 disabled:!brightness-[80%]"
              >
                Start conversation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateConversation;
