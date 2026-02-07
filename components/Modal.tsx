"use client";

import { motion } from "framer-motion";

interface ModalProps {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

export default function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg w-full bg-white rounded-sm shadow-lg p-6"
      >
        {title && (
          <h3 className="font-semibold text-sepia-800 mb-3">{title}</h3>
        )}
        <div>{children}</div>
        <button onClick={onClose} className="mt-4 text-sm text-sepia-600">
          Fermer
        </button>
      </motion.div>
    </div>
  );
}
