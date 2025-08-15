import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./ui/badge";
import { Menu, X } from "lucide-react";
import {
  ConnectButton,
  useCurrentAccount,
  useDisconnectWallet,
} from "@mysten/dapp-kit";

// helper to shorten address
function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  // Persist connection flag
  useEffect(() => {
    if (account) localStorage.setItem("walletConnected", "true");
    else localStorage.removeItem("walletConnected");
  }, [account]);

  // Optional: alert user to reconnect if previously connected
  const [showReconnectPrompt, setShowReconnectPrompt] = useState(false);
  useEffect(() => {
    const wasConnected = localStorage.getItem("walletConnected") === "true";
    if (wasConnected && !account) {
      setShowReconnectPrompt(true); // user needs to click ConnectButton
    } else {
      setShowReconnectPrompt(false);
    }
  }, [account]);

  return (
    <motion.header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white font-bold text-sm">SC</span>
              </motion.div>
              <span className="font-bold text-lg">SubChain</span>
              <Badge
                variant="secondary"
                className="text-xs hidden sm:inline-flex"
              >
                Beta
              </Badge>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Browse Plans", "Dashboard", "Creator", "Profile"].map(
              (name, index) => {
                const href = `/${name.toLowerCase().replace(" ", "")}`;
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={href}
                      className={`text-sm transition-colors hover:text-primary relative group ${
                        location.pathname === href
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {name}
                      <span
                        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                          location.pathname === href ? "w-full" : ""
                        }`}
                      ></span>
                    </Link>
                  </motion.div>
                );
              }
            )}
          </nav>

          {/* Wallet */}
          <div className="flex items-center space-x-4">
            {!account ? (
              <ConnectButton
                connectText={
                  showReconnectPrompt ? "Reconnect Wallet" : "Connect Wallet"
                }
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
              />
            ) : (
              <div className="flex items-center gap-3">
                {/* Green pulsing indicator */}
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">
                  {formatAddress(account.address)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Disconnect
                </button>
              </div>
            )}

            {/* Mobile menu */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
