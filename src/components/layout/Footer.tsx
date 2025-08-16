'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '../../utils/helpers';
import { SITE_CONFIG, SOCIAL_LINKS } from '../../utils/constants';
import { Mail, ExternalLink, Heart, ArrowUp } from 'lucide-react';
import Button from '../ui/Button';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const quickLinks = [
    { label: 'Player Profile', href: '#profile' },
    { label: 'Video Highlights', href: '#videos' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Academics', href: '#academics' },
    { label: 'Contact', href: '#contact' },
  ];

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
  };

  return (
    <footer className={cn('bg-secondary-900 text-white', className)}>
      {/* Main Footer Content */}
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">LN</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{SITE_CONFIG.name}</h3>
                <p className="text-secondary-400">Class of 2027 Softball Recruit</p>
              </div>
            </div>
            <p className="text-secondary-300 mb-6 max-w-md">
              Dedicated to excellence on and off the field. Actively seeking collegiate 
              opportunities that align with both athletic and academic goals.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href={SOCIAL_LINKS.email.url}
                className="flex items-center space-x-2 text-secondary-300 hover:text-white transition-colors"
                aria-label={SOCIAL_LINKS.email.label}
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">Email</span>
              </a>
              <a
                href={SOCIAL_LINKS.twitter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-secondary-300 hover:text-white transition-colors"
                aria-label={SOCIAL_LINKS.twitter.label}
              >
                <ExternalLink className="w-5 h-5" />
                <span className="text-sm">Twitter/X</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-secondary-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get In Touch</h4>
            <div className="space-y-3">
              <div>
                <p className="text-secondary-400 text-sm mb-1">Email</p>
                <a
                  href={`mailto:${SITE_CONFIG.links.email}`}
                  className="text-secondary-300 hover:text-white transition-colors text-sm"
                >
                  {SITE_CONFIG.links.email}
                </a>
              </div>
              <div>
                <p className="text-secondary-400 text-sm mb-1">Social Media</p>
                <a
                  href={SITE_CONFIG.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-300 hover:text-white transition-colors text-sm"
                >
                  @LanaNolan02
                </a>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Mail className="w-4 h-4" />}
                  onClick={() => window.open(`mailto:${SITE_CONFIG.links.email}`, '_blank')}
                >
                  Contact Coach
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-secondary-400">
              <p>© 2025 Player Profile Hub. All rights reserved</p>
              <span className="hidden md:inline">•</span>
              <p className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>for recruiting success</span>
              </p>
            </div>
            
            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-secondary-400 hover:text-white transition-colors text-sm group"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Section (Optional) */}
      <div className="border-t border-secondary-800 bg-secondary-950">
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="text-center">
              <h5 className="text-sm font-medium text-secondary-300 mb-2">
                Quick Access to Social Media
              </h5>
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(SITE_CONFIG.links.twitter)}`}
                alt="QR Code to Twitter/X Profile"
                width={120}
                height={120}
                unoptimized
                className="w-20 h-20 mx-auto rounded-lg bg-white p-1"
              />
              <p className="text-xs text-secondary-400 mt-2">
                Scan to follow on X (Twitter)
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;