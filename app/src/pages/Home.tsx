import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import api from "../api/api";
import { userState } from "../state/userAtom";
import useAuthGuard from "../components/useAuthGuard";
import Logo from "../components/Logo";

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  className = "",
  onKeyPress,
  disabled = false,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
  disabled?: boolean;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
    className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className}`}
    disabled={disabled}
  />
);

const Button = ({
  onClick,
  children,
  className = "",
  disabled = false,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors ${className}`}
  >
    {children}
  </button>
);

const NoteCard = ({
  note,
  onDelete,
}: {
  note: { id: string; text: string };
  onDelete: (id: string) => void;
}) => (
  <div className="bg-gray-50 rounded-xl p-4 mb-3 flex items-center justify-between border border-gray-100">
    <span className="text-gray-800 flex-1 break-words pr-3">{note.text}</span>
    <button
      onClick={() => onDelete(note.id)}
      className="ml-3 p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
      aria-label="Delete note"
    >
      <FiTrash2 size={18} />
    </button>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="mt-3 text-red-500 text-sm font-medium">{message}</div>
);

interface Note {
  id: string;
  text: string;
}

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  return (
    name.slice(0, 1) +
    "xxxxx" +
    "@" +
    domain.replace(/(.*)\./, (m) => "x".repeat(m.length - 1) + ".")
  );
};

const Home: React.FC = () => {
  useAuthGuard();
  const [user, setUser] = useRecoilState(userState);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const initializeComponent = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      
      if (!user) {
        setIsInitialLoading(true);
        return;
      }

    
      try {
        setIsInitialLoading(true);
        await fetchNotes();
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeComponent();
  }, [user, navigate]); 

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err: any) {
      setError("Failed to fetch notes");
      console.error("Fetch notes error:", err);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.trim()) {
      setError("Note text required");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/notes", { text: newNote.trim() });
      setNotes([...notes, res.data]);
      setNewNote("");
    } catch (err: any) {
      setError("Failed to create note");
      console.error("Create note error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      setIsLoading(true);
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err: any) {
      setError("Failed to delete note");
      console.error("Delete note error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/signin");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateNote();
    }
  };

  
  if (isInitialLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-100 ">
        <div className="flex items-center justify-center min-h-screen">
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className="w-full  bg-white   overflow-hidden min-h-screen  flex flex-col">
        <div className="p-6 md:p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex justify-center items-center">
              <Logo />
              <span className="ml-2 text-lg font-medium text-gray-800">
                Dashboard
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-blue-500 text-sm font-medium hover:underline transition-colors"
              disabled={isLoading}
            >
              Sign Out
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-5 border border-gray-100">
            <div className="text-lg font-bold text-gray-900 mb-1">
              Welcome, {user.name} !
            </div>
            <div className="text-gray-500 text-sm">
              Email: {maskEmail(user.email)}
            </div>
          </div>

          <div className="mb-5">
            <InputField
              type="text"
              placeholder="Write a new note..."
              value={newNote}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewNote(e.target.value)
              }
              onKeyPress={handleKeyPress}
              className="mb-3"
              disabled={isLoading}
            />
            <Button
              onClick={handleCreateNote}
              disabled={isLoading || !newNote.trim()}
              className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isLoading ? "Creating..." : "Create Note"}
            </Button>
            {error && <ErrorMessage message={error} />}
          </div>

          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Notes
            </h2>
            {notes.length === 0 ? (
              <p className="text-gray-400 text-sm">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
