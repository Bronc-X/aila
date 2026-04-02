"use client";

import { useState, useRef, useEffect } from "react";

interface StatusOption {
  value: string;
  label: string;
  color: string; // tailwind bg+text class like "bg-green-500/10 text-green-400"
}

interface StatusDropdownProps {
  value: string;
  options: StatusOption[];
  onChange: (value: string) => void;
}

export function StatusDropdown({ value, options, onChange }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`text-[10px] px-2 py-0.5 rounded-full w-fit cursor-pointer transition-all hover:ring-1 hover:ring-[#D97706]/30 ${current.color}`}
      >
        {current.label}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 border border-[#E5E1D8] bg-[#FAF9F6] min-w-[120px] shadow-2xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-[#FAF9F6] transition-colors flex items-center gap-2 ${
                opt.value === value ? "text-[#2D2A26]" : "text-[#9E9B96]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${opt.color.split(" ")[0]}`} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 预定义的常用状态选项
export const TASK_STATUS_OPTIONS: StatusOption[] = [
  { value: "pending", label: "待回访", color: "bg-yellow-500/10 text-yellow-400" },
  { value: "in_progress", label: "跟进中", color: "bg-blue-500/10 text-blue-400" },
  { value: "completed", label: "已完成", color: "bg-green-500/10 text-green-400" },
  { value: "overdue", label: "已逾期", color: "bg-red-500/10 text-red-400" },
];

export const PRIORITY_OPTIONS: StatusOption[] = [
  { value: "high", label: "高", color: "bg-red-500/10 text-red-400" },
  { value: "medium", label: "中", color: "bg-yellow-500/10 text-yellow-400" },
  { value: "low", label: "低", color: "bg-green-500/10 text-green-400" },
];

export const DEAL_STATUS_OPTIONS: StatusOption[] = [
  { value: "signed", label: "已签约", color: "bg-green-500/10 text-green-400" },
  { value: "approval", label: "审批中", color: "bg-yellow-500/10 text-yellow-400" },
  { value: "following", label: "跟进中", color: "bg-blue-500/10 text-blue-400" },
  { value: "lost", label: "已流失", color: "bg-red-500/10 text-red-400" },
];
