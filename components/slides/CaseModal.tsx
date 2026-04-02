"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function CaseModal({
  isOpen,
  onClose,
  content
}: {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12 bg-[#FAF9F6]/90 backdrop-blur-2xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full h-full md:h-auto max-w-5xl md:max-h-[85vh] overflow-y-auto md:rounded-3xl bg-white"
            style={{
              padding: "60px 80px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-[var(--text-muted)] hover:text-[#2D2A26] transition-colors bg-[var(--bg-elevated)] p-3 rounded-full"
            >
              <X size={24} />
            </button>
            {content}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
