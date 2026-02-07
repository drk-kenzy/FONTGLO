"use client";

import { motion } from "framer-motion";
import ShelvesManager from "@/components/ShelvesManager";

export default function MyShelvesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="font-display text-4xl font-bold text-sepia-900 mb-2">
          Mes étagères
        </h1>
        <p className="text-sepia-600">
          Créez et gérez vos étagères personnalisées, ajoutez et retirez des
          livres facilement
        </p>
      </motion.div>

      <ShelvesManager />
    </div>
  );
}
