'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/helpers';
import { NAVIGATION_ITEMS, SITE_CONFIG } from '@/utils/constants';
import Button from '@/components/ui/Button';
import { Menu, X, Mail, ExternalLink } from 'lucide-react';

interface PlayerData {
  personalInfo?: {
    name?: string;
    firstName?: string;
    lastName?: string;
  };
  athletics?: {
    highSchool?: {
      coachEmail?: string;
    };
    travelTeam?: {
      coachEmail?: string;
    };
  };
}

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  // Load player data for coach email
  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        const response = await fetch('/api/player');
        if (response.ok) {
          const data = await response.json();
          setPlayerData(data);
        }
      } catch (error) {
        console.error('Error loading player data:', error);
      }
    };

    loadPlayerData();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle active section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAVIGATION_ITEMS.map(item => item.href.replace('#', ''));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth scroll to section
  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const elementId = href.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        const headerHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  // Get coach email (travel team coach first, then high school coach, then player email as fallback)
  const getCoachEmail = () => {
    return playerData?.athletics?.travelTeam?.coachEmail ||
           playerData?.athletics?.highSchool?.coachEmail ||
           SITE_CONFIG.links.email;
  };

  // Compute display name from player data with sensible fallbacks
  const displayName =
    (playerData?.personalInfo?.name && playerData.personalInfo.name.trim()) ||
    [playerData?.personalInfo?.firstName, playerData?.personalInfo?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim() ||
    SITE_CONFIG.name;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-secondary-200' 
          : 'bg-transparent',
        className
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
              <span className="text-white font-bold text-lg">LN</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-secondary-900">
                {displayName}
              </h1>
              <p className="text-xs text-secondary-600">Class of 2027</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600 relative py-2',
                  activeSection === item.href.replace('#', '')
                    ? 'text-primary-600'
                    : 'text-secondary-700'
                )}
              >
                {item.label}
                {activeSection === item.href.replace('#', '') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Mail className="w-4 h-4" />}
              onClick={() => window.open(`mailto:${getCoachEmail()}`, '_blank')}
            >
              Contact
            </Button>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ExternalLink className="w-4 h-4" />}
              onClick={() => handleNavClick('#videos')}
            >
              Watch Highlights
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-secondary-700" />
            ) : (
              <Menu className="w-6 h-6 text-secondary-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-secondary-200 shadow-lg">
            <nav className="container mx-auto py-4">
              <div className="flex flex-col space-y-4">
                {NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={cn(
                      'text-base font-medium transition-colors hover:text-primary-600 py-2 px-4 rounded-lg',
                      activeSection === item.href.replace('#', '')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-secondary-700 hover:bg-secondary-50'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile CTA Buttons */}
                <div className="flex flex-col space-y-2 pt-4 border-t border-secondary-200">
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={<Mail className="w-4 h-4" />}
                    onClick={() => {
                      window.open(`mailto:${getCoachEmail()}`, '_blank');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Contact Coach
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<ExternalLink className="w-4 h-4" />}
                    onClick={() => handleNavClick('#videos')}
                    className="w-full"
                  >
                    Watch Highlights
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;