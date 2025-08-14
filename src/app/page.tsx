"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, useAnimation } from "framer-motion";
import { useInView as useInViewHook } from "react-intersection-observer";
import { 
  FaChalkboardTeacher, 
  FaUserGraduate, 
  FaLock, 
  FaChartBar, 
  FaComments, 
  FaRobot,
  FaGraduationCap,
  FaBookOpen,
  FaUsers,
  FaClock,
  FaStar,
  FaArrowRight,
  FaPlay,
  FaCheck
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt, HiGlobe, HiShieldCheck, HiChip } from "react-icons/hi";

// Modern Feature Card Component
const ModernFeatureCard = ({ icon, title, description, color, index }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  index: number;
}) => {
  const [ref, inView] = useInViewHook({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative overflow-hidden h-full"
    >
      <div className="relative p-8 bg-white rounded-2xl h-full flex flex-col
                      shadow-lg hover:shadow-2xl border border-gray-100 
                      hover:border-purple-200 hover:shadow-purple-500/10
                      transition-all duration-500 transform hover:-translate-y-2">
        {/* Gradient Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-blue-50 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
        
        {/* Icon */}
        <motion.div 
          className="relative z-10 mb-6 flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
          >
            {icon}
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Hover Arrow */}
        <motion.div
          className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaArrowRight className="text-purple-500" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Floating Animation Component
const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Counter Animation Component
const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInViewHook({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);

  const features = [
    {
      icon: <FaChalkboardTeacher className="w-8 h-8" />,
      title: "AI-Powered Grading",
      description: "Advanced machine learning algorithms provide intelligent grading suggestions and automated feedback generation.",
      color: "#8B5CF6"
    },
    {
      icon: <FaUserGraduate className="w-8 h-8" />,
      title: "Smart Analytics",
      description: "Comprehensive dashboard with real-time insights, performance tracking, and predictive analytics.",
      color: "#7C3AED"
    },
    {
      icon: <HiShieldCheck className="w-8 h-8" />,
      title: "Plagiarism Detection",
      description: "State-of-the-art plagiarism detection with similarity analysis and source identification.",
      color: "#6D28D9"
    },
    {
      icon: <FaComments className="w-8 h-8" />,
      title: "Collaborative Workflow",
      description: "Seamless collaboration between faculty, TAs, and students with real-time communication tools.",
      color: "#5B21B6"
    },
    {
      icon: <HiLightningBolt className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Optimized performance with instant loading, real-time updates, and responsive design.",
      color: "#4C1D95"
    },
    {
      icon: <HiGlobe className="w-8 h-8" />,
      title: "Global Accessibility",
      description: "Multi-language support, accessibility features, and cross-platform compatibility.",
      color: "#7C3AED"
    }
  ];

  const faqs = [
    {
      question: "How does AI-powered grading work?",
      answer: "Our AI system analyzes submissions using natural language processing and machine learning to provide consistent, fair grading suggestions while maintaining human oversight for final decisions."
    },
    {
      question: "Is the platform secure for academic data?",
      answer: "Yes, we use enterprise-grade encryption, comply with educational data privacy regulations, and maintain SOC 2 certification for maximum data security."
    },
    {
      question: "Can I integrate with existing LMS platforms?",
      answer: "Absolutely! GradePro seamlessly integrates with popular LMS platforms like Canvas, Blackboard, and Moodle through our API."
    },
    {
      question: "How much time can I save with automated grading?",
      answer: "Educators typically save 75-80% of their grading time. What used to take 10 hours can now be completed in 2-3 hours with our AI-assisted grading system."
    },
    {
      question: "Can the AI handle different types of assignments?",
      answer: "Yes! Our platform supports essays, research papers, coding assignments, math problems, multiple choice questions, and even creative writing with specialized rubrics for each type."
    },
    {
      question: "How accurate is the AI grading compared to human grading?",
      answer: "Our AI achieves 94% consistency with human graders and continuously improves through machine learning. All AI suggestions can be reviewed and adjusted by educators."
    },
    {
      question: "What support is available for institutions?",
      answer: "We provide 24/7 technical support, dedicated account managers, training sessions, and comprehensive documentation for all institutional clients."
    },
    {
      question: "Can students access their detailed feedback and rubrics?",
      answer: "Absolutely! Students receive comprehensive feedback, rubric breakdowns, improvement suggestions, and can track their progress over time through our student portal."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden relative">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <FloatingElement delay={0}>
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        </FloatingElement>
        <FloatingElement delay={2}>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        </FloatingElement>
        <FloatingElement delay={4}>
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-cyan-300 to-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        </FloatingElement>
      </div>

      {/* Modern Grid-Style Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 pb-8 px-4 sm:px-6 z-10 overflow-hidden">
        {/* Animated Dot Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          {/* Animated Dot Grid */}
          <div className="absolute inset-0 opacity-70">
            <div className="h-full w-full bg-dot-pattern animate-dot-float"></div>
          </div>
          
          {/* Floating Orbs - Adjusted for mobile */}
          <motion.div 
            className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-r from-purple-400/8 to-pink-400/8 rounded-full blur-3xl"
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute bottom-10 sm:bottom-20 right-5 sm:right-20 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-r from-blue-400/8 to-cyan-400/8 rounded-full blur-3xl"
            animate={{ 
              y: [0, 15, 0],
              x: [0, -15, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-full text-indigo-700 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-lg border border-indigo-200"
            >
              <HiSparkles className="mr-1 sm:mr-2 text-indigo-500 w-4 h-4" />
              <span className="hidden sm:inline">Next-Generation Grading Platform</span>
              <span className="sm:hidden">AI Grading Platform</span>
            </motion.div>
            
            {/* Main Heading - Responsive text sizing */}
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.15]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="block mb-2">Revolutionize</span>
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                Academic Grading
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl text-gray-700 font-medium mt-4 sm:mt-6">
                with AI Intelligence
              </span>
            </motion.h1>
            
            {/* Description - Mobile optimized */}
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Transform your educational workflow with AI-powered grading, intelligent feedback, 
              and seamless collaboration. Experience the future of education today.
            </motion.p>
            
            {/* Buttons - Improved mobile layout */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                className="relative group w-full sm:w-auto"
              >
                <Link 
                  href="/signup" 
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-2xl 
                           shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <motion.div
                      className="ml-3"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight />
                    </motion.div>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link 
                  href="#features"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 sm:px-10 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-2xl 
                           hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 group"
                >
                  Learn More
                  <motion.div
                    className="ml-3 text-indigo-500"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaArrowRight />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section id="features" className="py-12 sm:py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div 
            className="text-center mb-12 sm:mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-purple-700 text-xs sm:text-sm font-semibold mb-4 sm:mb-6"
            >
              <HiLightningBolt className="mr-1 sm:mr-2 w-4 h-4" />
              Cutting-Edge Features
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 px-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                GradePro
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Experience the future of academic grading with our revolutionary platform 
              that combines artificial intelligence, collaborative workflows, and 
              advanced analytics.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <ModernFeatureCard 
                key={index} 
                {...feature} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Statistics Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800"></div>
        <FloatingElement delay={1}>
          <div className="absolute top-10 left-10 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        </FloatingElement>
        <FloatingElement delay={3}>
          <div className="absolute bottom-10 right-10 w-56 h-56 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        </FloatingElement>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
              Trusted by Educators Worldwide
            </h2>
            <p className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto px-4">
              Join thousands of educational institutions who have transformed their grading process
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4">
            {[
              { 
                number: 250, 
                label: "Assignments Graded", 
                suffix: "K+", 
                icon: FaBookOpen,
                gradient: "from-blue-400 to-cyan-400"
              },
              { 
                number: 500, 
                label: "Universities", 
                suffix: "+", 
                icon: FaGraduationCap,
                gradient: "from-purple-400 to-pink-400"
              },
              { 
                number: 98, 
                label: "Satisfaction Rate", 
                suffix: "%", 
                icon: FaStar,
                gradient: "from-green-400 to-emerald-400"
              },
              { 
                number: 50, 
                label: "Countries", 
                suffix: "+", 
                icon: HiGlobe,
                gradient: "from-orange-400 to-red-400"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/10 h-full">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${stat.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-2">
                    <AnimatedCounter end={stat.number} />
                    {stat.suffix}
                  </div>
                  
                  <div className="text-sm sm:text-base lg:text-lg text-indigo-200 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Vertical Animated Slider */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of grading with our intelligent three-step process
            </p>
          </motion.div>
          
          <div className="max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Smart Assignment Creation",
                description: "Faculty creates assignments with customizable rubrics and AI-powered templates. Students submit their work through our intuitive interface with real-time collaboration features.",
                icon: <FaChalkboardTeacher className="w-10 h-10" />,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "02", 
                title: "AI-Powered Analysis",
                description: "Our advanced machine learning algorithms analyze submissions, detect plagiarism, provide intelligent grading suggestions, and generate detailed feedback reports.",
                icon: <FaRobot className="w-10 h-10" />,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "03",
                title: "Collaborative Review",
                description: "Teaching assistants and faculty review AI suggestions, add personalized feedback, collaborate on difficult cases, and deliver comprehensive evaluations to students.",
                icon: <FaUsers className="w-10 h-10" />,
                color: "from-green-500 to-emerald-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative mb-12 sm:mb-16 lg:mb-20 last:mb-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3, duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className={`flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Step Number and Icon */}
                  <div className="flex-shrink-0 relative">
                    <motion.div 
                      className={`w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br ${step.color} rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden`}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Animated background pattern */}
                      <motion.div 
                        className="absolute inset-0 opacity-20"
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        style={{
                          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                          backgroundSize: "20px 20px"
                        }}
                      />
                      
                      <div className="relative z-10 text-center">
                        <div className="text-white mb-2 sm:mb-3 flex justify-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10">
                            {step.icon}
                          </div>
                        </div>
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{step.step}</span>
                      </div>
                    </motion.div>
                    
                    {/* Connecting Line - Hidden on mobile, shown on larger screens */}
                    {index < 2 && (
                      <motion.div 
                        className="hidden lg:block absolute left-1/2 top-full w-0.5 h-12 lg:h-20 bg-gradient-to-b from-gray-300 to-transparent transform -translate-x-1/2"
                        initial={{ height: 0 }}
                        whileInView={{ height: "3rem" }}
                        transition={{ delay: (index + 1) * 0.3, duration: 0.8 }}
                        viewport={{ once: true }}
                      />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 w-full lg:w-auto">
                    <motion.div 
                      className="bg-white rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
                      whileHover={{ y: -5 }}
                    >
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">{step.title}</h3>
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Background Decorative Elements - Reduced on mobile */}
          <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 sm:opacity-30"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 sm:opacity-30"></div>
        </div>
      </section>

      {/* Compact FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get quick answers to common questions about our AI grading platform
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.button
                  className="w-full p-6 bg-white rounded-xl shadow-md border border-gray-100 
                           hover:shadow-lg hover:border-purple-200 transition-all duration-200 
                           flex justify-between items-center text-left group"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </motion.div>
                </motion.button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: activeFaq === index ? 'auto' : 0,
                    opacity: activeFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-l-4 border-purple-500">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800"></div>
        <FloatingElement delay={0}>
          <div className="absolute top-10 sm:top-20 left-5 sm:left-20 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        </FloatingElement>
        <FloatingElement delay={2}>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-20 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        </FloatingElement>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 sm:mb-8 leading-tight px-4">
              Ready to Transform Your{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Grading Experience?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-purple-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Join thousands of educators worldwide who have revolutionized their grading process with GradePro. 
              Start your free trial today and experience the future of academic assessment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link 
                  href="/signup" 
                  className="group w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-white to-gray-100 text-purple-900 text-lg font-bold rounded-2xl 
                           hover:shadow-2xl hover:shadow-white/30 transition-all duration-300"
                >
                  Get Started
                  <HiSparkles className="ml-2 sm:ml-3 group-hover:rotate-12 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link 
                  href="#features" 
                  className="group w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 border-2 border-white/30 text-white text-lg font-semibold rounded-2xl 
                           hover:border-white hover:bg-white/10 transition-all duration-300"
                >
                  Learn More
                  <FaArrowRight className="ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <FaGraduationCap className="text-white text-lg sm:text-xl" />
                </div>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  GradePro
                </span>
              </div>
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Revolutionizing academic assessment with cutting-edge AI technology and collaborative workflows.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-white text-lg sm:text-xl mb-4 sm:mb-6">Product</h4>
              <ul className="space-y-3 sm:space-y-4">
                {['Features', 'Pricing', 'Integrations', 'API', 'Security'].map((item) => (
                  <li key={item}>
                    <Link 
                      href="#" 
                      className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center group text-sm sm:text-base"
                    >
                      {item}
                      <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-xs" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-white text-xl mb-6">Support</h4>
              <ul className="space-y-4">
                {['Help Center', 'Documentation', 'Contact', 'Status', 'Community'].map((item) => (
                  <li key={item}>
                    <Link 
                      href="#" 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group text-sm sm:text-base"
                    >
                      {item}
                      <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-xs" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="sm:col-span-2 lg:col-span-1"
            >
              <h4 className="font-bold text-white text-lg sm:text-xl mb-4 sm:mb-6">Stay Updated</h4>
              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                Get the latest updates and insights delivered to your inbox.
              </p>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-t-xl sm:rounded-l-xl sm:rounded-t-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
                  />
                  <motion.button 
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-b-xl sm:rounded-r-xl sm:rounded-b-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaArrowRight />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} GradePro. All rights reserved.
              </p>
              <div className="flex space-x-8">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <Link 
                    key={item}
                    href="#" 
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
