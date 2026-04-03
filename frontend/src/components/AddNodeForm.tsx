import React, { useState } from "react";
import { Plus } from "lucide-react";

interface AddNodeFormProps {
  onSubmit: (name: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  buttonText?: string;
}

const AddNodeForm: React.FC<AddNodeFormProps> = ({
  onSubmit,
  onCancel,
  placeholder = "Enter node name",
  buttonText = "Add",
}) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(name.trim());
      setName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1 relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                     text-gray-800 placeholder-gray-400 transition-all"
          autoFocus
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !name.trim()}
        className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
          ${isSubmitting || !name.trim()
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
          }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Plus size={18} />
            {buttonText}
          </>
        )}
      </button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default AddNodeForm;