"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaChalkboardTeacher, FaUserGraduate, FaLock, FaChartBar, FaComments, FaRobot } from "react-icons/fa";
import DashboardCard from "./home_components/DashboardCard";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <FaChalkboardTeacher className="w-8 h-8" />,
      title: "Role-Based Dashboards",
      description: "Customized interfaces for faculty, TAs, and students",
      link: "#",
      color: "#8B5CF6"
    },
    {
      icon: <FaUserGraduate className="w-8 h-8" />,
      title: "PDF Annotation Tools",
      description: "Advanced tools for detailed feedback",
      link: "#",
      color: "#7C3AED"
    },
    {
      icon: <FaChartBar className="w-8 h-8" />,
      title: "AI-Powered Analytics",
      description: "Smart plagiarism detection and grading insights",
      link: "#",
      color: "#6D28D9"
    },
    {
      icon: <FaComments className="w-8 h-8" />,
      title: "Real-Time Feedback",
      description: "Instant communication between students and graders",
      link: "#",
      color: "#5B21B6"
    },
    {
      icon: <FaLock className="w-8 h-8" />,
      title: "Secure Interface",
      description: "Enterprise-grade security for your academic data",
      link: "#",
      color: "#4C1D95"
    },
    {
      icon: <FaRobot className="w-8 h-8" />,
      title: "AI Writing Assistant",
      description: "Get intelligent suggestions for feedback and comments",
      link: "#",
      color: "#7C3AED"
    }
  ];

  const faqs = [
    {
      question: "How do I sign up?",
      answer: "Simply click the Sign Up button and choose your role (Faculty/TA/Student). Fill in your details and verify your email to get started."
    },
    {
      question: "What features are available for different roles?",
      answer: "Faculty can create courses and assignments, TAs can grade and provide feedback, and students can submit work and view feedback."
    },
    {
      question: "Is there a mobile app?",
      answer: "Currently, we offer a responsive web application that works great on all devices. A native mobile app is in development."
    },
    {
      question: "How is my data secured?",
      answer: "We use industry-standard encryption and secure servers to protect your data. All information is backed up regularly."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-28 pb-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 animate-fadeIn">
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
                Transform Your <span className="text-purple-600">Grading</span> Experience
              </h1>
              <p className="text-xl text-black mb-8 leading-relaxed">
                Streamline academic assessment with AI-powered tools and real-time collaboration. Make grading efficient, fair, and insightful.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/signup" 
                  className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-300"
                >
                  Get Started
                </Link>
                <Link 
                  href="#features" 
                  className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transform hover:scale-105 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative animate-float">
              <div className="absolute inset-0 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
              <img 
                src="https://img.freepik.com/free-vector/grades-concept-illustration_114360-5958.jpg"
                alt="Platform Preview" 
                width={600}
                height={400}
                className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl font-bold text-black mb-4">Core Features</h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Discover the tools that make GradePro the leading choice for academic assessment
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <DashboardCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 transform skew-y-3">
        <div className="container mx-auto px-6 transform -skew-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-bold text-white mb-2">100k+</div>
              <div className="text-xl text-purple-100">Assignments Graded</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-xl text-purple-100">Universities</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-xl text-purple-100">Satisfaction Rate</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-xl text-purple-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">How It Works</h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Get started with GradePro in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-purple-200"></div>
            <div className="relative text-center">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 relative z-10 transform hover:scale-110 transition-all duration-300">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Create</h3>
              <p className="text-black">Faculty creates courses and assignments with ease</p>
            </div>
            <div className="relative text-center">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 relative z-10 transform hover:scale-110 transition-all duration-300">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Grade</h3>
              <p className="text-black">TAs grade and provide detailed feedback</p>
            </div>
            <div className="relative text-center">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 relative z-10 transform hover:scale-110 transition-all duration-300">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-black">Review</h3>
              <p className="text-black">Students receive feedback and improve</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Find answers to common questions about GradePro
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 transform hover:scale-[1.01] transition-all duration-300">
                <button
                  className="w-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg flex justify-between items-center"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-semibold text-lg text-black">{faq.question}</span>
                  <span className="text-purple-600 text-2xl">{activeFaq === index ? "−" : "+"}</span>
                </button>
                {activeFaq === index && (
                  <div className="p-6 bg-white border-t rounded-b-lg">
                    <p className="text-black leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-purple-600 mb-4">GradePro</h3>
              <p className="text-gray-600 mb-4">
                Transforming academic assessment with AI-powered tools and seamless collaboration.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-purple-600 hover:text-purple-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-purple-600 hover:text-purple-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-purple-600 hover:text-purple-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-purple-600">Home</Link></li>
                <li><Link href="#features" className="text-gray-600 hover:text-purple-600">Features</Link></li>
                <li><Link href="#how-it-works" className="text-gray-600 hover:text-purple-600">How It Works</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-purple-600">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-purple-600">Help Center</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-purple-600">Documentation</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-purple-600">API Reference</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-purple-600">System Status</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-purple-600">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-purple-600">Terms of Service</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-purple-600">Cookie Policy</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-purple-600">GDPR</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-center text-gray-600">
              &copy; {new Date().getFullYear()} GradePro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
