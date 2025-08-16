'use client';

import React from 'react';
import { cn } from '@/utils/helpers';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className,
  showHeader = true,
  showFooter = true 
}) => {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      {showHeader && <Header />}
      
      <main className={cn('flex-1', showHeader && 'pt-20')}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;