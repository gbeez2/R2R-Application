import {
  BookOpenText,
  Zap,
  Shield,
  Brain,
  Database,
  ArrowRight,
  CheckCircle,
  Github,
  BarChart2,
  Settings,
  ChevronDown,
  Upload,
  Sparkles,
  FileText,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { brandingConfig } from '@/config/brandingConfig';

const LandingPage = () => {
  const [typewriterText, setTypewriterText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('generate');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rotatingTextIndex, setRotatingTextIndex] = useState(0);
  const [rotatingText, setRotatingText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [trustedByIndex, setTrustedByIndex] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isSolutionsDropdownOpen, setIsSolutionsDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isSoftwareDropdownOpen, setIsSoftwareDropdownOpen] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState('CST Studio Suite');

  const generateTexts = [
    'Create a CST macro to design a patch antenna with frequency sweep from 2.4 to 2.5 GHz...',
    'Generate a macro to automate parameter optimization for a microstrip filter design...',
    'Write a CST script to create a horn antenna with automated mesh refinement...',
    'Create a macro to simulate a dipole antenna with different ground plane sizes...',
    'Design a CST macro for automated S-parameter extraction and analysis...',
  ];

  const explainTexts = [
    'Explain this CST macro that creates a microstrip patch antenna...',
    'What does this VBA script do for antenna simulation?',
    'Help me understand this CST parameter sweep code...',
    'Explain the mesh settings in this macro...',
    'What is the purpose of this CST S-parameter extraction script?',
  ];

  const exampleTexts = activeTab === 'generate' ? generateTexts : explainTexts;
  const rotatingTexts = ['design', 'model', 'build faster'];

  const trustedByCompanies = [
    { name: 'Trane', logo: '🌡️', description: 'HVAC Systems' },
    { name: 'Google', logo: '🔍', description: 'Search & Cloud' },
    { name: 'Apple', logo: '🍎', description: 'Consumer Electronics' },
    { name: 'Meta', logo: '📱', description: 'Social Technology' },
    { name: 'Tesla', logo: '⚡', description: 'Electric Vehicles' },
    { name: 'Boeing', logo: '✈️', description: 'Aerospace' },
  ];

  useEffect(() => {
    const currentText = exampleTexts[currentTextIndex];

    if (currentIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setTypewriterText(currentText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30);

      return () => clearTimeout(timeout);
    } else {
      // Wait 10 seconds before starting next text
      const timeout = setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % exampleTexts.length);
        setCurrentIndex(0);
        setTypewriterText('');
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentTextIndex, exampleTexts]);

  useEffect(() => {
    const currentRotatingText = rotatingTexts[rotatingTextIndex];

    if (!isDeleting && rotatingText.length < currentRotatingText.length) {
      // Typing
      const timeout = setTimeout(() => {
        setRotatingText(
          currentRotatingText.substring(0, rotatingText.length + 1)
        );
      }, 100);
      return () => clearTimeout(timeout);
    } else if (isDeleting && rotatingText.length > 0) {
      // Deleting
      const timeout = setTimeout(() => {
        setRotatingText(rotatingText.substring(0, rotatingText.length - 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else if (
      !isDeleting &&
      rotatingText.length === currentRotatingText.length
    ) {
      // Finished typing, wait then start deleting
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (isDeleting && rotatingText.length === 0) {
      // Finished deleting, move to next text
      setIsDeleting(false);
      setRotatingTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }
  }, [rotatingText, rotatingTextIndex, isDeleting, rotatingTexts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrustedByIndex((prev) => (prev + 1) % trustedByCompanies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // You can add file processing logic here
      console.log('File uploaded:', file.name);
    }
  };

  // Navigation scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsNavVisible(false);
      } else {
        // Scrolling up
        setIsNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.products-dropdown')) {
        setIsProductsDropdownOpen(false);
      }
      if (!target.closest('.solutions-dropdown')) {
        setIsSolutionsDropdownOpen(false);
      }
      if (!target.closest('.resources-dropdown')) {
        setIsResourcesDropdownOpen(false);
      }
      if (!target.closest('.software-dropdown')) {
        setIsSoftwareDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-pure-white">
      {/* Navigation */}
      <nav
        className={`bg-insulation-black sticky top-4 z-50 mx-4 rounded-2xl transition-transform duration-300 ease-in-out ${isNavVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Yellow horizontal fulcrum line */}
                    <rect
                      x="2"
                      y="14"
                      width="28"
                      height="6"
                      rx="3"
                      fill="#FFD700"
                    />

                    {/* Blue square on the left */}
                    <rect
                      x="4"
                      y="6"
                      width="10"
                      height="10"
                      rx="2"
                      fill="#0066CC"
                    />

                    {/* Green circle on the right */}
                    <circle cx="22" cy="11" r="5" fill="#00CC66" />

                    {/* Red triangle below supporting */}
                    <path d="M16 20 L10 30 L22 30 Z" fill="#FF4444" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-pure-white">
                  MacroPilot
                </span>
              </div>
              <div className="relative products-dropdown">
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() =>
                    setIsProductsDropdownOpen(!isProductsDropdownOpen)
                  }
                >
                  <span className="text-pure-white hover:text-pure-white transition-colors">
                    Products
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-pure-white transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {isProductsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-pure-white border border-circuit-silver/30 rounded-lg shadow-lg z-50 min-w-64">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20">
                        Current Products
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">
                          CST VBA Macro Generator
                        </div>
                        <div className="text-sm text-circuit-silver">
                          Automate CST Studio Suite workflows
                        </div>
                      </button>

                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20 mt-2">
                        Coming Soon
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">HFSS Macro Generator</div>
                        <div className="text-sm text-circuit-silver">
                          ANSYS HFSS automation tools
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">
                          COMSOL Macro Generator
                        </div>
                        <div className="text-sm text-circuit-silver">
                          Multiphysics simulation automation
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">
                          MATLAB Script Generator
                        </div>
                        <div className="text-sm text-circuit-silver">
                          Engineering computation automation
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">
                          Python Engineering Tools
                        </div>
                        <div className="text-sm text-circuit-silver">
                          Custom engineering script generation
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative solutions-dropdown">
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() =>
                    setIsSolutionsDropdownOpen(!isSolutionsDropdownOpen)
                  }
                >
                  <span className="text-pure-white hover:text-pure-white transition-colors">
                    Solutions
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-pure-white transition-transform ${isSolutionsDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {isSolutionsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-pure-white border border-circuit-silver/30 rounded-lg shadow-lg z-50 min-w-72">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20">
                        By Industry
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Telecommunications</div>
                        <div className="text-sm text-circuit-silver">
                          5G/6G antenna design, RF optimization
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Aerospace & Defense</div>
                        <div className="text-sm text-circuit-silver">
                          Radar systems, stealth technology
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Automotive</div>
                        <div className="text-sm text-circuit-silver">
                          ADAS sensors, EV charging systems
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Medical Devices</div>
                        <div className="text-sm text-circuit-silver">
                          MRI coils, implantable devices
                        </div>
                      </button>

                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20 mt-2">
                        By Use Case
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Rapid Prototyping</div>
                        <div className="text-sm text-circuit-silver">
                          Accelerate design iteration cycles
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">
                          Parameter Optimization
                        </div>
                        <div className="text-sm text-circuit-silver">
                          Automated design space exploration
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Design Validation</div>
                        <div className="text-sm text-circuit-silver">
                          Automated testing and verification
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">
                          Legacy System Modernization
                        </div>
                        <div className="text-sm text-circuit-silver">
                          Update and optimize existing designs
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative resources-dropdown">
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() =>
                    setIsResourcesDropdownOpen(!isResourcesDropdownOpen)
                  }
                >
                  <span className="text-pure-white hover:text-pure-white transition-colors">
                    Resources
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-pure-white transition-transform ${isResourcesDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {isResourcesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-pure-white border border-circuit-silver/30 rounded-lg shadow-lg z-50 min-w-64">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20">
                        Documentation
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Getting Started Guide</div>
                        <div className="text-sm text-circuit-silver">
                          Quick setup and first macro
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">API Reference</div>
                        <div className="text-sm text-circuit-silver">
                          Complete function documentation
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Tutorials</div>
                        <div className="text-sm text-circuit-silver">
                          Step-by-step walkthroughs
                        </div>
                      </button>

                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20 mt-2">
                        Learning
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Video Tutorials</div>
                        <div className="text-sm text-circuit-silver">
                          Visual learning resources
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Best Practices</div>
                        <div className="text-sm text-circuit-silver">
                          Engineering workflow tips
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Case Studies</div>
                        <div className="text-sm text-circuit-silver">
                          Real-world implementation examples
                        </div>
                      </button>

                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20 mt-2">
                        Support
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Help Center</div>
                        <div className="text-sm text-circuit-silver">
                          FAQ and troubleshooting
                        </div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Community Forum</div>
                        <div className="text-sm text-circuit-silver">
                          Connect with other engineers
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-pure-white hover:text-pure-white transition-colors cursor-pointer">
                Enterprise
              </span>
              <span className="text-pure-white hover:text-pure-white transition-colors cursor-pointer">
                Docs
              </span>
              <a
                href="/pricing"
                className="text-pure-white hover:text-pure-white transition-colors cursor-pointer"
              >
                Pricing
              </a>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-3">
              <a
                href="/auth/login"
                className="px-4 py-2 text-pure-white hover:text-pure-white transition-colors rounded-md"
              >
                Log In
              </a>
              <button className="px-4 py-2 text-pure-white hover:text-pure-white transition-colors rounded-md">
                Contact
              </button>
              <a
                href="/auth/signup"
                className="px-4 py-2 bg-pure-white text-insulation-black hover:bg-circuit-silver transition-colors rounded-md font-medium"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="bg-circuit-silver/10 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Title */}
          <div className="text-left mb-4">
            <h1
              className="text-6xl lg:text-7xl font-bold text-insulation-black"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Generate CST VBA Macros
            </h1>
          </div>

          {/* Subheader */}
          <div className="text-left mb-6">
            <p className="text-3xl text-circuit-silver max-w-5xl font-light tracking-wide leading-relaxed">
              AI-powered VBA macro generation. Describe your simulation needs
              and get production-ready code instantly.
            </p>
          </div>

          {/* Interactive Section */}
          <div className="bg-pure-white rounded-2xl p-8 shadow-lg border border-circuit-silver/20">
            {/* Mode Selection Dropdown */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-auto inline-flex items-center justify-between px-4 py-3 border border-circuit-silver/30 rounded-lg bg-pure-white text-insulation-black hover:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue"
                >
                  <span className="capitalize">{activeTab}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-pure-white border border-circuit-silver/30 rounded-lg shadow-lg z-10 w-auto">
                    <div className="flex flex-col">
                      <button
                        onClick={() => {
                          setActiveTab('generate');
                          setCurrentTextIndex(0);
                          setCurrentIndex(0);
                          setTypewriterText('');
                          setIsDropdownOpen(false);
                        }}
                        className={`w-auto text-left px-4 py-2 hover:bg-circuit-silver/10 ${activeTab === 'generate' ? 'bg-electric-blue/10 text-electric-blue' : 'text-insulation-black'}`}
                      >
                        Generate
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('explain');
                          setCurrentTextIndex(0);
                          setCurrentIndex(0);
                          setTypewriterText('');
                          setIsDropdownOpen(false);
                        }}
                        className={`w-auto text-left px-4 py-2 hover:bg-circuit-silver/10 ${activeTab === 'explain' ? 'bg-electric-blue/10 text-electric-blue' : 'text-insulation-black'}`}
                      >
                        Explain
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Software Selection Dropdown */}
              <div className="relative software-dropdown">
                <button
                  onClick={() =>
                    setIsSoftwareDropdownOpen(!isSoftwareDropdownOpen)
                  }
                  className="w-auto inline-flex items-center justify-between px-4 py-3 border border-circuit-silver/30 rounded-lg bg-pure-white text-insulation-black hover:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue"
                >
                  <span className="capitalize">{selectedSoftware}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ml-2 ${isSoftwareDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isSoftwareDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-pure-white border border-circuit-silver/30 rounded-lg shadow-lg z-10 w-auto min-w-48">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSelectedSoftware('CST Studio Suite');
                          setIsSoftwareDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-circuit-silver/10 text-sm ${selectedSoftware === 'CST Studio Suite' ? 'bg-electric-blue/10 text-electric-blue' : 'text-insulation-black'}`}
                      >
                        CST Studio Suite
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSoftware('ANSYS HFSS');
                          setIsSoftwareDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-circuit-silver/10 text-sm ${selectedSoftware === 'ANSYS HFSS' ? 'bg-electric-blue/10 text-electric-blue' : 'text-insulation-black'}`}
                      >
                        ANSYS HFSS
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSoftware('COMSOL Multiphysics');
                          setIsSoftwareDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-circuit-silver/10 text-sm ${selectedSoftware === 'COMSOL Multiphysics' ? 'bg-electric-blue/10 text-electric-blue' : 'text-insulation-black'}`}
                      >
                        COMSOL Multiphysics
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSoftware('MATLAB');
                          setIsSoftwareDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-circuit-silver/10 text-sm ${selectedSoftware === 'MATLAB' ? 'bg-electric-blue/10 text-electric-blue' : 'text-insulation-black'}`}
                      >
                        MATLAB
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSoftware('Python');
                          setIsSoftwareDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-circuit-silver/10 text-sm ${selectedSoftware === 'Python' ? 'bg-electric-blue/10 text-electric-blue' : 'text-insulation-black'}`}
                      >
                        Python
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative group">
                <input
                  type="file"
                  accept=".vba,.bas,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button className="text-insulation-black hover:text-electric-blue transition-colors p-2">
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Text Input Field with Arrow */}
            <div className="mb-6 relative">
              <textarea
                placeholder={
                  typewriterText ||
                  'Create a CST macro to automate antenna design and simulation...'
                }
                className="w-full h-32 p-4 pr-16 border border-circuit-silver/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue text-insulation-black flex items-center"
              />
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 3000);
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-pure-white hover:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center border-0 focus:outline-none focus:ring-2 focus:ring-electric-blue"
              >
                {isLoading ? (
                  <div className="w-5 h-5">
                    {/* Spinning Logo Animation */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="animate-spin"
                    >
                      {/* Yellow horizontal fulcrum line */}
                      <rect
                        x="2"
                        y="14"
                        width="28"
                        height="6"
                        rx="3"
                        fill="#FFD700"
                      />
                      {/* Blue square on the left */}
                      <rect
                        x="4"
                        y="6"
                        width="10"
                        height="10"
                        rx="2"
                        fill="#0066CC"
                      />
                      {/* Green circle on the right */}
                      <circle cx="22" cy="11" r="5" fill="#00CC66" />
                      {/* Red triangle below supporting */}
                      <path d="M16 20 L10 30 L22 30 Z" fill="#FF4444" />
                    </svg>
                  </div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>

            {/* Improve Prompt and Explore Templates Buttons */}
            <div className="mt-4 flex justify-start gap-3">
              <Button
                color="transparent"
                shape="outline_wide"
                onClick={() => {
                  /* Handle improve prompt */
                }}
                className="border-circuit-silver/30 text-insulation-black hover:border-electric-blue hover:bg-electric-blue/5 flex items-center px-5 py-3"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Improve Prompt
              </Button>

              <Button
                color="transparent"
                shape="outline_wide"
                onClick={() => {
                  /* Handle explore macro templates */
                }}
                className="border-circuit-silver/30 text-insulation-black hover:border-electric-blue hover:bg-electric-blue/5 flex items-center px-5 py-3"
              >
                <FileText className="w-4 h-4 mr-2" />
                Explore Macro Templates
              </Button>
            </div>
          </div>

          {/* Trusted by Leading Engineers */}
          <div className="mt-16 mb-8">
            <div className="text-center mb-2">
              <h3 className="text-3xl font-semibold text-insulation-black mb-0">
                Trusted by Leading Electrical Engineers
              </h3>
              <p className="text-sm text-insulation-black/70">
                Powering electromagnetic design at top companies worldwide
              </p>
            </div>

            {/* Rotating Logo Carousel */}
            <div className="relative overflow-hidden bg-gradient-to-r from-pure-white to-circuit-silver/5 rounded-xl py-6">
              <div className="flex animate-scroll">
                {/* First set of logos */}
                <div className="flex items-center space-x-20 px-8">
                  <img
                    src="/images/trane.png"
                    alt="Trane"
                    className="h-16 w-auto object-contain"
                  />
                  <img
                    src="/images/google.webp"
                    alt="Google"
                    className="h-16 w-auto object-contain"
                  />
                  <img
                    src="/images/apple.png"
                    alt="Apple"
                    className="h-16 w-auto object-contain"
                  />
                  <img
                    src="/images/meta.png"
                    alt="Meta"
                    className="h-20 w-auto object-contain"
                  />
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="flex items-center space-x-20 px-8">
                  <img
                    src="/images/trane.png"
                    alt="Trane"
                    className="h-16 w-auto object-contain"
                  />
                  <img
                    src="/images/google.webp"
                    alt="Google"
                    className="h-16 w-auto object-contain"
                  />
                  <img
                    src="/images/apple.png"
                    alt="Apple"
                    className="h-16 w-auto object-contain"
                  />
                  <img
                    src="/images/meta.png"
                    alt="Meta"
                    className="h-20 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-insulation-black mb-4">
              Ready to Automate Your CST Workflows?
            </h2>
            <p className="text-xl text-circuit-silver mb-8 max-w-2xl mx-auto">
              Join electrical engineers worldwide who are accelerating their CST
              simulations with AI-powered macro generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                color="primary"
                onClick={() => (window.location.href = '/auth/login')}
                className="px-8 py-4 text-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                color="transparent"
                shape="outline_wide"
                onClick={() =>
                  window.open('https://r2r-docs.sciphi.ai', '_blank')
                }
                className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-pure-white px-8 py-4 text-lg"
              >
                <BookOpenText className="w-5 h-5 mr-2" />
                Read Documentation
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-insulation-black text-pure-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Yellow horizontal fulcrum line */}
                    <rect
                      x="2"
                      y="14"
                      width="28"
                      height="6"
                      rx="3"
                      fill="#FFD700"
                    />

                    {/* Blue square on the left */}
                    <rect
                      x="4"
                      y="6"
                      width="10"
                      height="10"
                      rx="2"
                      fill="#0066CC"
                    />

                    {/* Green circle on the right */}
                    <circle cx="22" cy="11" r="5" fill="#00CC66" />

                    {/* Red triangle below supporting */}
                    <path d="M16 20 L10 30 L22 30 Z" fill="#FF4444" />
                  </svg>
                </div>
                <span className="text-xl font-bold">MacroPilot</span>
              </div>
              <p className="text-circuit-silver">
                AI-powered CST macro generation for electrical engineering
                professionals.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product</h3>
              <ul className="space-y-2 text-circuit-silver">
                <li>
                  <a href="#" className="hover:text-pure-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pure-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pure-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pure-white">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Community</h3>
              <ul className="space-y-2 text-circuit-silver">
                <li>
                  <a
                    href="https://github.com/SciPhi-AI/R2R"
                    target="_blank"
                    className="hover:text-pure-white"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/p6KqD2kjtB"
                    target="_blank"
                    className="hover:text-pure-white"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/ocolegro"
                    target="_blank"
                    className="hover:text-pure-white"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pure-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="space-y-2 text-circuit-silver">
                <li>
                  <a href="#" className="hover:text-pure-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pure-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pure-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-pure-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-circuit-silver/20 mt-8 pt-8 text-center text-circuit-silver">
            <p>
              &copy; 2024 {brandingConfig.companyName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
