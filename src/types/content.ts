export interface ContactFormData {
  coachName: string;
  schoolName: string;
  email: string;
  phone?: string;
  message: string;
  preferredContact: 'email' | 'phone';
  timeline: string;
  position?: string;
  division?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: Date;
  updatedAt: Date;
  category: 'tournament' | 'achievement' | 'recruiting' | 'training';
  tags: string[];
  featured: boolean;
  image?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    email: string;
  };
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

export interface VideoCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}