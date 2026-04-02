"use client";

import { Download, Check } from "lucide-react";
import { useState } from "react";

interface ExportButtonProps {
  content: string;
  filename?: string;
  label?: string;
}

export function ExportButton({
  content,
  filename = "export.txt",
  label = "导出",
}: ExportButtonProps) {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!content}
      className="bg-[#FAF9F6] text-[#6B6660] border border-[#E5E1D8] font-bold uppercase tracking-wide hover:border-[#D97706] hover:text-[#2D2A26] transition-colors !py-1.5 !px-3 text-xs flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {exported ? (
        <>
          <Check size={12} /> 已导出
        </>
      ) : (
        <>
          <Download size={12} /> {label}
        </>
      )}
    </button>
  );
}
