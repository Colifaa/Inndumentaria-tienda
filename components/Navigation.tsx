"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface NavigationProps {
  onSectionChange: (section: string) => void;
  activeSection: string;
  onSearch: (query: string) => void;
  onCartClick: () => void;
  cartItemCount: number;
}

export function Navigation({
  onSectionChange,
  activeSection,
  onSearch,
  onCartClick,
  cartItemCount
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkUser();
  }, []);

  // En la función checkUser, añade logs para depuración
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      setUserEmail(user.email || null);
      const avatarUrl = user.user_metadata?.avatar_url;
      setUserAvatar(typeof avatarUrl === 'string' ? avatarUrl : null);
      
      // Enfoque alternativo: usar la función RPC en lugar de consultar directamente
      const { data, error } = await supabase.rpc('is_admin', { 
        email_param: user.email 
      });
      
      if (error) {
        console.error("Error al verificar admin:", error);
      } else {
        setIsAdmin(!!data);
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setUserEmail(null);
    setUserAvatar(null);
    setIsAdmin(false);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blanco shadow-md z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-negro whitespace-nowrap">
            Inndumentaria
          </Link>

          {/* Enlaces de navegación */}
          <div className="hidden md:flex space-x-4 lg:space-x-8">
            <button
              onClick={() => onSectionChange("dama")}
              className={`text-sm font-medium px-2 py-1 rounded transition-colors duration-200
                ${activeSection === "dama"
                  ? "text-rosa-oscuro bg-rosa-claro"
                  : "text-negro hover:text-rosa-oscuro"}
              `}
            >
              Dama
            </button>
            <button
              onClick={() => onSectionChange("hombre")}
              className={`text-sm font-medium px-2 py-1 rounded transition-colors duration-200
                ${activeSection === "hombre"
                  ? "text-rosa-oscuro bg-rosa-claro"
                  : "text-negro hover:text-rosa-oscuro"}
              `}
            >
              Hombre
            </button>
            <button
              onClick={() => onSectionChange("ninos")}
              className={`text-sm font-medium px-2 py-1 rounded transition-colors duration-200
                ${activeSection === "ninos"
                  ? "text-rosa-oscuro bg-rosa-claro"
                  : "text-negro hover:text-rosa-oscuro"}
              `}
            >
              Niños
            </button>
            <button
              onClick={() => onSectionChange("accesorios")}
              className={`text-sm font-medium px-2 py-1 rounded transition-colors duration-200
                ${activeSection === "accesorios"
                  ? "text-rosa-oscuro bg-rosa-claro"
                  : "text-negro hover:text-rosa-oscuro"}
              `}
            >
              Accesorios
            </button>
          </div>

          {/* Carrito y Login */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!userId ? (
              <Button
                variant="outline"
                className="ml-2 sm:ml-4 border-rosa-oscuro text-rosa-oscuro hover:bg-rosa-oscuro hover:text-blanco px-2 sm:px-4 py-1 sm:py-2 text-sm"
                onClick={() => router.push('/login')}
              >
                Iniciar Sesión
              </Button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt="User avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gris-suave flex items-center justify-center">
                      <span className="text-negro text-sm">
                        {userEmail?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4 text-negro" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-blanco rounded-md shadow-lg py-1 z-50">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          router.push('/admin');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-negro hover:bg-rosa-claro flex items-center"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Panel de Admin
                      </button>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-negro hover:bg-rosa-claro flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={onCartClick}
              className="p-2 hover:bg-rosa-claro rounded-full relative"
            >
              <ShoppingCart className="h-6 w-6 text-negro" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rosa-oscuro text-blanco text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Botón de menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 ml-2"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden w-full bg-blanco shadow-lg rounded-b-lg mt-2"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
                <button
                  onClick={() => {
                    onSectionChange("dama");
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeSection === "dama"
                      ? "bg-rosa-claro text-rosa-oscuro"
                      : "text-negro hover:bg-rosa-claro hover:text-rosa-oscuro"
                  }`}
                >
                  Dama
                </button>
                <button
                  onClick={() => {
                    onSectionChange("hombre");
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeSection === "hombre"
                      ? "bg-rosa-claro text-rosa-oscuro"
                      : "text-negro hover:bg-rosa-claro hover:text-rosa-oscuro"
                  }`}
                >
                  Hombre
                </button>
                <button
                  onClick={() => {
                    onSectionChange("ninos");
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeSection === "ninos"
                      ? "bg-rosa-claro text-rosa-oscuro"
                      : "text-negro hover:bg-rosa-claro hover:text-rosa-oscuro"
                  }`}
                >
                  Niños
                </button>
                <button
                  onClick={() => {
                    onSectionChange("accesorios");
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeSection === "accesorios"
                      ? "bg-rosa-claro text-rosa-oscuro"
                      : "text-negro hover:bg-rosa-claro hover:text-rosa-oscuro"
                  }`}
                >
                  Accesorios
                </button>
           
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
} 