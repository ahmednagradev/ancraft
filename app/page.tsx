"use client";

import { motion} from 'framer-motion';
import { Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AncraftLanding() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/signin');
  };

  const handleViewDemo = () => {
    // You can change this to a demo portfolio URL or user's portfolio
    router.push('/ahmed');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/">
            <motion.div 
              className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              ancraft
            </motion.div>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center w-full">
          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 mt-10 leading-tight px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            Build Your
            <br />
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dream Portfolio
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            Create stunning, professional portfolios in minutes. Designed for developers, 
            designers, and creators who want to stand out.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <motion.button
              onClick={handleGetStarted}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full text-base sm:text-lg font-medium flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-indigo-500/50 transition-shadow duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Start Building
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
            
            <motion.button
              onClick={handleViewDemo}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-white/10 rounded-full text-base sm:text-lg font-medium hover:border-white/30 transition-colors duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              View Demo
            </motion.button>
          </motion.div>

          <motion.div
            className="flex gap-4 sm:gap-6 justify-center mt-8 sm:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            {[
              { Icon: Twitter, href: "https://twitter.com" },
              { Icon: Github, href: "https://github.com" },
              { Icon: Linkedin, href: "https://linkedin.com" }
            ].map(({ Icon, href }, index) => (
              <motion.a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200"
                whileHover={{ y: -4, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="relative z-10 border-t border-white/5 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end md:flex-row justify items-center gap-6">
            <div 
              className="text-gray-400 text-sm flex items-center gap-2"
            >
              © 2026 Ancraft
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}