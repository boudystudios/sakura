import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import MenuPage from './components/MenuPage';
import About from './components/About';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import ReservationPage from './components/ReservationPage';
import Profile from './components/Profile';
import LoginModal from './components/LoginModal';
import KitchenDashboard from './components/KitchenDashboard';
import StaffDashboard from './components/StaffDashboard';

import { Page, User } from './types';
import { useAppStore } from './state/store';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const { 
    user, 
    login, 
    logout, 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    initialLoginView, 
    setInitialLoginView 
  } = useAppStore();
  
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Audio Player Logic ---
  const toggleAudio = () => {
      if (audioRef.current) {
          if (isAudioPlaying) {
              audioRef.current.pause();
          } else {
              audioRef.current.play().catch(e => console.error("Audio play failed:", e));
          }
          setIsAudioPlaying(!isAudioPlaying);
      }
  };

  const handleNavigate = (newPage: Page) => {
    // Role-based navigation guards
    if (newPage === 'admin' && user?.role !== 'admin') {
      toast.error("Accesso non autorizzato.");
      setInitialLoginView('login');
      setIsLoginModalOpen(true);
      return;
    }
    if (newPage === 'staffDashboard' && user?.role !== 'staff' && user?.role !== 'admin') {
       toast.error("Accesso riservato allo staff.");
       setInitialLoginView('login');
       setIsLoginModalOpen(true);
       return;
    }
     if (newPage === 'kitchenDashboard' && user?.role !== 'kitchen' && user?.role !== 'admin') {
       toast.error("Accesso riservato alla cucina.");
       setInitialLoginView('login');
       setIsLoginModalOpen(true);
       return;
    }
     if (newPage === 'profile' && !user) {
      setInitialLoginView('login');
      setIsLoginModalOpen(true);
      return;
    }
    
    // FIX: Removed the logic block that was incorrectly redirecting logged-in users 
    // to their dashboards when they tried to navigate to 'home'.
    // Now, clicking 'Home' will always navigate to the homepage.
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  const handleLoginClick = (view: 'login' | 'register' = 'login') => {
      setInitialLoginView(view);
      setIsLoginModalOpen(true);
  };
  
  // Effect to redirect user to their dashboard after login
  useEffect(() => {
    if (user) {
        if(user.role === 'admin') setPage('admin');
        else if (user.role === 'staff') setPage('staffDashboard');
        else if (user.role === 'kitchen') setPage('kitchenDashboard');
        else setPage('home');
    } else {
        setPage('home');
    }
  }, [user]);


  const renderPage = () => {
    switch (page) {
      case 'home': return <Home onNavigate={handleNavigate} />;
      case 'menu': return <MenuPage onLoginClick={handleLoginClick} />;
      case 'about': return <About />;
      case 'contact': return <Contact />;
      case 'reservations': return <ReservationPage />;
      case 'profile': return user ? <Profile /> : <Home onNavigate={handleNavigate} />;
      case 'admin': return user?.role === 'admin' ? <AdminPanel /> : <Home onNavigate={handleNavigate} />;
      case 'staffDashboard': return user?.role === 'staff' || user?.role === 'admin' ? <StaffDashboard /> : <Home onNavigate={handleNavigate} />;
      case 'kitchenDashboard': return user?.role === 'kitchen' || user?.role === 'admin' ? <KitchenDashboard /> : <Home onNavigate={handleNavigate} />;
      default: return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
        <div className="bg-[#0b0b0b] text-white min-h-screen flex flex-col font-inter">
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: '',
              style: {
                background: '#1a1a1a',
                color: '#f5f5f5',
                border: '1px solid #333',
              },
            }}
          />
          <Header 
              currentPage={page} 
              onNavigate={handleNavigate} 
              onLoginClick={handleLoginClick}
              isAudioPlaying={isAudioPlaying}
              toggleAudio={toggleAudio}
          />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              {React.cloneElement(renderPage(), { key: page })}
            </AnimatePresence>
          </main>
          <Footer />
          {isLoginModalOpen && (
              <LoginModal 
                  onClose={() => setIsLoginModalOpen(false)}
                  onSuccess={() => {
                      setIsLoginModalOpen(false);
                      // Navigation will be handled by the useEffect hook watching the `user` state
                  }}
                  initialView={initialLoginView}
              />
          )}
          <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/05/23/audio_9c73b6851f.mp3" loop />
        </div>
  );
};

export default App;