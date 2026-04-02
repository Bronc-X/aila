"use client";

import { useState, useRef, useEffect } from "react";

interface EditableCellProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  type?: "text" | "textarea";
  placeholder?: string;
}

export function EditableCell({
  value,
  onSave,
  className = "",
  type = "text",
  placeholder = "点击编辑...",
}: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    if (draft !== value) {
      onSave(draft);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type === "text") {
      handleSave();
    }
    if (e.key === "Escape") {
      setDraft(value);
      setEditing(false);
    }
  };

  if (editing) {
    const sharedClass =
      "w-full bg-[#FAF9F6] border border-[#D97706]/20 text-[#2D2A26] text-sm px-2 py-1 outline-none focus:border-[#D97706] transition-colors";

    return type === "textarea" ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={`${sharedClass} min-h-[60px] resize-y ${className}`}
        placeholder={placeholder}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${sharedClass} ${className}`}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={`cursor-pointer hover:bg-black/5 px-1 py-0.5 -mx-1 transition-colors rounded ${className}`}
      title="点击编辑"
    >
      {value || <span className="text-[#9E9B96] italic">{placeholder}</span>}
    </span>
  );
}
