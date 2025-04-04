"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, ChevronDown, LogOut, LayoutDashboard, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "./SearchBar";

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
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-800">
            Inndumentaria
          </Link>

          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-xl mx-4">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Enlaces de navegación */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => onSectionChange("dama")}
              className={`text-sm font-medium ${
                activeSection === "dama"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Dama
            </button>
            <button
              onClick={() => onSectionChange("hombre")}
              className={`text-sm font-medium ${
                activeSection === "hombre"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Hombre
            </button>
            <button
              onClick={() => onSectionChange("ninos")}
              className={`text-sm font-medium ${
                activeSection === "ninos"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Niños
            </button>
            <button
              onClick={() => onSectionChange("accesorios")}
              className={`text-sm font-medium ${
                activeSection === "accesorios"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Accesorios
            </button>
          </div>

          {/* Carrito y Login */}
          <div className="flex items-center space-x-4">
            {userId ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">
                        {userEmail?.[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          router.push('/admin');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Panel de Admin
                      </button>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <LogIn className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={onCartClick}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Botón de menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
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
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  onSectionChange("dama");
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === "dama"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Accesorios
              </button>
              {userId ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        router.push("/admin");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Panel de Admin
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 