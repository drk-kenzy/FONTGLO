import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Bibliothèque Glose",
  description: "Explorez votre collection de livres avec élégance",
  keywords: ["livres", "bibliothèque", "lecture", "Glose"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 bg-cream-50/80 backdrop-blur-md border-b border-sepia-200/50">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <a href="/" className="group flex items-center gap-3">
                  <div className="w-10 h-10 bg-sepia-800 rounded-sm flex items-center justify-center group-hover:bg-sepia-700 transition-colors duration-300">
                    <svg
                      className="w-6 h-6 text-cream-50"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <h1 className="font-display text-2xl font-bold text-sepia-800 group-hover:text-sepia-900 transition-colors duration-300">
                    Bibliothèque
                  </h1>
                </a>

                <nav className="hidden md:flex items-center gap-6">
                  <a
                    href="/"
                    className="font-body text-sepia-600 hover:text-sepia-800 transition-colors duration-300"
                  >
                    Étagères
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <ToastProvider>{children}</ToastProvider>
          </main>

          <footer className="border-t border-sepia-200/50 bg-cream-100/50 py-8 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p className="font-body text-sm text-sepia-600">
                Développer par OWEN • {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
