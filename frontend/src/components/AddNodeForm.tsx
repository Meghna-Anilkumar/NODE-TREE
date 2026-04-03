import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";

interface AddNodeFormProps {
  onSubmit: (name: string) => Promise<void> | void;
  onCancel?: () => void;
  placeholder?: string;
  buttonText?: string;
  error?: string | null;
  onClearError?: () => void;
}

const AddNodeForm: React.FC<AddNodeFormProps> = ({
  onSubmit,
  onCancel,
  placeholder = "Enter node name",
  buttonText = "Add",
  error,
  onClearError,
}) => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!error) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onClearError?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [error, onClearError]);

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
    <div ref={formRef} className="flex flex-col gap-1.5">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting}
          className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-white border rounded-xl
                     focus:outline-none focus:ring-2 transition-all
                     text-sm sm:text-base text-gray-800 placeholder-gray-400
                     ${error
                       ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                       : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                     }`}
          autoFocus
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className={`flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium
              flex items-center justify-center gap-1.5 transition-all text-sm sm:text-base
              ${
                isSubmitting || !name.trim()
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
              }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding…</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>{buttonText}</span>
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-4 py-2 sm:px-5 sm:py-3 border border-gray-300
                         text-gray-600 rounded-xl hover:bg-gray-100 transition font-medium
                         text-sm sm:text-base"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <p className="text-xs sm:text-sm text-red-500 px-1">{error}</p>
      )}
    </div>
  );
};

export default AddNodeForm;