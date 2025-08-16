'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { cn } from '../../utils/helpers';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Mail, MessageSquare, Download, ExternalLink, Send, Clock } from 'lucide-react';
import { generateRecruitingPacketPDF, getSampleRecruitingData } from '../../utils/pdfGenerator';

interface ContactProps {
  className?: string;
}

interface ContactFormData {
  coachName: string;
  schoolName: string;
  email: string;
  phone?: string;
  position?: string;
  division?: string;
  message: string;
  preferredContact: 'email' | 'phone';
  timeline: string;
}

const Contact: React.FC<ContactProps> = ({ className }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate form submission - replace with actual email service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would send this to your email service
      console.log('Form submitted:', data);
      
      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateRecruitingPacket = async () => {
    try {
      const recruitingData = getSampleRecruitingData();
      await generateRecruitingPacketPDF(recruitingData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating recruiting packet. Please contact directly for complete player information.');
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'lananolan08@gmail.com',
      description: 'Primary contact method',
      action: () => window.open('mailto:lananolan08@gmail.com', '_blank'),
    },
    {
      icon: ExternalLink,
      title: 'Twitter/X',
      value: '@LanaNolan02',
      description: 'Follow for updates',
      action: () => window.open('https://x.com/LanaNolan02', '_blank'),
    },
  ];

  const quickActions = [
    {
      icon: Download,
      title: 'Download Recruiting Packet',
      description: 'Complete player profile, stats, and references',
      action: generateRecruitingPacket,
      variant: 'primary' as const,
    },
    {
      icon: MessageSquare,
      title: 'Schedule a Call',
      description: 'Set up a phone or video conversation',
      action: () => window.open('mailto:lananolan08@gmail.com?subject=Schedule Call Request', '_blank'),
      variant: 'outline' as const,
    },
    {
      icon: ExternalLink,
      title: 'View Video Library',
      description: 'Access complete highlight collection',
      action: () => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' }),
      variant: 'outline' as const,
    },
  ];

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
    <section id="contact" className={cn('section-padding', className)}>
      <div className="container mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="heading-lg mb-4">Get In Touch</h2>
            <p className="body-lg text-secondary-600 max-w-2xl mx-auto">
              Ready to connect? Reach out to discuss recruiting opportunities, schedule visits, 
              or request additional information about Lana’s athletic and academic profile.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <Card variant="elevated">
                <CardHeader
                  title="Coach Inquiry Form"
                  subtitle="Send a message directly to discuss recruiting opportunities"
                />
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Coach Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="coachName" className="block text-sm font-medium text-secondary-700 mb-2">
                          Coach Name *
                        </label>
                        <input
                          {...register('coachName', { required: 'Coach name is required' })}
                          type="text"
                          id="coachName"
                          className={cn(
                            'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                            errors.coachName ? 'border-red-500' : 'border-secondary-300'
                          )}
                          placeholder="Your name"
                        />
                        {errors.coachName && (
                          <p className="mt-1 text-sm text-red-600">{errors.coachName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="schoolName" className="block text-sm font-medium text-secondary-700 mb-2">
                          School/Organization *
                        </label>
                        <input
                          {...register('schoolName', { required: 'School name is required' })}
                          type="text"
                          id="schoolName"
                          className={cn(
                            'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                            errors.schoolName ? 'border-red-500' : 'border-secondary-300'
                          )}
                          placeholder="University/College name"
                        />
                        {errors.schoolName && (
                          <p className="mt-1 text-sm text-red-600">{errors.schoolName.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Please enter a valid email address'
                            }
                          })}
                          type="email"
                          id="email"
                          className={cn(
                            'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                            errors.email ? 'border-red-500' : 'border-secondary-300'
                          )}
                          placeholder="coach@university.edu"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          {...register('phone')}
                          type="tel"
                          id="phone"
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="position" className="block text-sm font-medium text-secondary-700 mb-2">
                          Position of Interest
                        </label>
                        <select
                          {...register('position')}
                          id="position"
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select position</option>
                          <option value="catcher">Catcher</option>
                          <option value="infield">Infield</option>
                          <option value="outfield">Outfield</option>
                          <option value="pitcher">Pitcher</option>
                          <option value="utility">Utility Player</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="division" className="block text-sm font-medium text-secondary-700 mb-2">
                          Division Level
                        </label>
                        <select
                          {...register('division')}
                          id="division"
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select division</option>
                          <option value="d1">Division I</option>
                          <option value="d2">Division II</option>
                          <option value="d3">Division III</option>
                          <option value="naia">NAIA</option>
                          <option value="juco">Junior College</option>
                        </select>
                      </div>
                    </div>

                    {/* Contact Preferences */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Preferred Contact Method *
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              {...register('preferredContact', { required: 'Please select a contact method' })}
                              type="radio"
                              value="email"
                              className="mr-2"
                            />
                            Email
                          </label>
                          <label className="flex items-center">
                            <input
                              {...register('preferredContact', { required: 'Please select a contact method' })}
                              type="radio"
                              value="phone"
                              className="mr-2"
                            />
                            Phone
                          </label>
                        </div>
                        {errors.preferredContact && (
                          <p className="mt-1 text-sm text-red-600">{errors.preferredContact.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="timeline" className="block text-sm font-medium text-secondary-700 mb-2">
                          Response Timeline
                        </label>
                        <select
                          {...register('timeline')}
                          id="timeline"
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="immediate">Immediate</option>
                          <option value="week">Within 1 week</option>
                          <option value="month">Within 1 month</option>
                          <option value="season">This season</option>
                          <option value="no-rush">No rush</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        {...register('message', { required: 'Message is required' })}
                        id="message"
                        rows={4}
                        className={cn(
                          'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                          errors.message ? 'border-red-500' : 'border-secondary-300'
                        )}
                        placeholder="Tell us about your program and recruiting needs..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      leftIcon={<Send className="w-4 h-4" />}
                      isLoading={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Sending Message...' : 'Send Message'}
                    </Button>

                    {/* Status Messages */}
                    {submitStatus === 'success' && (
                      <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                        <p className="text-success-700">
                          Thank you for your message! We’ll get back to you within 24 hours.
                        </p>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">
                          There was an error sending your message. Please try again or contact us directly.
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information & Quick Actions */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Contact Methods */}
              <Card variant="elevated">
                <CardHeader
                  title="Direct Contact"
                  subtitle="Get in touch immediately"
                />
                <CardContent>
                  <div className="space-y-4">
                    {contactMethods.map((method, index) => (
                      <button
                        key={index}
                        onClick={method.action}
                        className="w-full p-4 text-left border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                            <method.icon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-secondary-900">{method.title}</h4>
                            <p className="text-sm text-primary-600 font-medium">{method.value}</p>
                            <p className="text-xs text-secondary-500">{method.description}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-secondary-400 group-hover:text-primary-600 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card variant="elevated">
                <CardHeader
                  title="Quick Actions"
                  subtitle="Common requests and resources"
                />
                <CardContent>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant}
                        size="md"
                        leftIcon={<action.icon className="w-4 h-4" />}
                        onClick={action.action}
                        className="w-full justify-start"
                      >
                        <div className="text-left">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-xs opacity-75">{action.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Response Time Notice */}
              <Card variant="outlined" className="p-6">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-secondary-900 mb-2">Quick Response Guarantee</h4>
                  <p className="text-sm text-secondary-600">
                    All coach inquiries receive a response within 24 hours. 
                    For urgent matters, please call or text directly.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;