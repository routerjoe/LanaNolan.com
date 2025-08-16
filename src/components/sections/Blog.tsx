'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Calendar, ArrowRight, ExternalLink, Trophy, BookOpen, Target, TrendingUp } from 'lucide-react';

interface BlogProps {
  className?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: Date;
  category: 'tournament' | 'achievement' | 'recruiting' | 'training';
  tags: string[];
  featured: boolean;
  image?: string;
}

const Blog: React.FC<BlogProps> = ({ className }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Sample blog posts - would come from props or data fetching
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'Strong Start to Spring Season',
      slug: 'strong-start-spring-season',
      excerpt: 'Reflecting on the first few games of the spring season and looking ahead to upcoming tournaments.',
      content: 'The spring season has gotten off to a great start with solid performances both at the plate and in the field...',
      publishedAt: new Date('2025-03-01'),
      category: 'tournament',
      tags: ['spring season', 'performance', 'recruiting'],
      featured: true,
      image: '/images/blog/spring-season.jpg',
    },
    {
      id: '2',
      title: 'Academic Excellence Recognition',
      slug: 'academic-excellence-recognition',
      excerpt: 'Honored to receive academic recognition while maintaining focus on athletic development.',
      content: 'Balancing academics and athletics continues to be a priority...',
      publishedAt: new Date('2025-02-15'),
      category: 'achievement',
      tags: ['academics', 'recognition', 'balance'],
      featured: false,
      image: '/images/blog/academic-award.jpg',
    },
    {
      id: '3',
      title: 'Winter Training Update',
      slug: 'winter-training-update',
      excerpt: 'Focused on strength and skill development during the off-season training period.',
      content: 'The winter training period has been productive with focused work on strength development...',
      publishedAt: new Date('2025-01-20'),
      category: 'training',
      tags: ['training', 'development', 'preparation'],
      featured: false,
      image: '/images/blog/winter-training.jpg',
    },
    {
      id: '4',
      title: 'Recruiting Process Insights',
      slug: 'recruiting-process-insights',
      excerpt: 'Sharing thoughts on the college recruiting journey and connecting with coaching staffs.',
      content: 'The recruiting process has been an incredible learning experience...',
      publishedAt: new Date('2025-01-05'),
      category: 'recruiting',
      tags: ['recruiting', 'college', 'journey'],
      featured: true,
      image: '/images/blog/recruiting-journey.jpg',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Posts', icon: BookOpen, color: 'bg-secondary-500' },
    { id: 'tournament', name: 'Tournaments', icon: Trophy, color: 'bg-primary-500' },
    { id: 'achievement', name: 'Achievements', icon: Target, color: 'bg-success-500' },
    { id: 'recruiting', name: 'Recruiting', icon: TrendingUp, color: 'bg-accent-500' },
    { id: 'training', name: 'Training', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const featuredPost = posts.find(post => post.featured);
  const recentPosts = filteredPosts.slice(0, 6);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || BookOpen;
  };

  const getCategoryColor = (category: string): string => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'bg-secondary-500';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="blog" className={cn('section-padding bg-secondary-50', className)}>
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="heading-lg mb-4">Latest Updates</h2>
            <p className="body-lg text-secondary-600 max-w-2xl mx-auto">
              Stay up to date with tournament results, achievements, training progress, 
              and insights from the recruiting journey.
            </p>
          </motion.div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div variants={itemVariants} className="mb-12">
              <Card variant="elevated" className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Featured Image */}
                  <div className="relative aspect-video lg:aspect-square bg-gradient-to-br from-primary-600 to-secondary-800">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-60" />
                        <p className="text-lg font-medium">Featured Story</p>
                      </div>
                    </div>
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-white text-sm font-medium capitalize',
                        getCategoryColor(featuredPost.category)
                      )}>
                        {featuredPost.category}
                      </span>
                      <div className="flex items-center text-sm text-secondary-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(featuredPost.publishedAt)}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-secondary-600 mb-6">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary-100 text-secondary-600 rounded text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button
                      variant="primary"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      onClick={() => {
                        // In a real app, this would navigate to the full post
                        alert('Full blog post functionality coming soon!');
                      }}
                    >
                      Read Full Story
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'primary' : 'outline'}
                  size="sm"
                  leftIcon={<category.icon className="w-4 h-4" />}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Recent Posts Grid */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold text-secondary-900 mb-6">Recent Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => {
                const CategoryIcon = getCategoryIcon(post.category);
                
                return (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card variant="elevated" className="h-full cursor-pointer group" hover>
                      {/* Post Image */}
                      <div className="relative aspect-video bg-gradient-to-br from-primary-500 to-secondary-600">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CategoryIcon className="w-12 h-12 text-white opacity-60" />
                        </div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={cn(
                            'px-2 py-1 rounded text-white text-xs font-medium capitalize',
                            getCategoryColor(post.category)
                          )}>
                            {post.category}
                          </span>
                        </div>
                        
                        {/* Date */}
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        
                        <p className="text-sm text-secondary-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-secondary-100 text-secondary-600 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="px-2 py-1 bg-secondary-100 text-secondary-600 rounded text-xs">
                              +{post.tags.length - 2} more
                            </span>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          rightIcon={<ArrowRight className="w-3 h-3" />}
                          onClick={() => {
                            // In a real app, this would navigate to the full post
                            alert('Full blog post functionality coming soon!');
                          }}
                          className="w-full justify-between"
                        >
                          Read More
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div variants={itemVariants} className="mt-12">
            <Card variant="outlined" className="p-8 text-center">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Stay Updated
              </h3>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">
                Get notified about tournament results, achievements, and recruiting updates. 
                Follow on social media for the latest news.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                  onClick={() => window.open('https://x.com/LanaNolan02', '_blank')}
                >
                  Follow on X (Twitter)
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<Calendar className="w-4 h-4" />}
                  onClick={() => window.open('mailto:lananolan08@gmail.com?subject=Update Notifications', '_blank')}
                >
                  Email Updates
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;