import React from "react";
import { FiTrash2 } from "react-icons/fi";

interface Note {
  id: string;
  text: string;
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onDelete,
  disabled = false,
}) => (
  <div className="bg-gray-50 rounded-xl p-4 mb-3 flex items-center justify-between border border-gray-100">
    <span className="text-gray-800 flex-1 break-words pr-3">{note.text}</span>
    <button
      onClick={() => onDelete(note.id)}
      className="ml-3 p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Delete note"
      disabled={disabled}
    >
      <FiTrash2 size={18} />
    </button>
  </div>
);

export default NoteCard;
