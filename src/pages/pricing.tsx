import React, { useState, useEffect } from 'react';
import { Check, Copy, ChevronDown } from 'lucide-react';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isSolutionsDropdownOpen, setIsSolutionsDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('FBOT4U');
    setCopied(true);
    setShowCopyMessage(true);
    setTimeout(() => {
      setCopied(false);
      setShowCopyMessage(false);
    }, 3000);
  };

  const handleCheckout = async (planName, price) => {
    console.log('Starting checkout for:', planName, price, isYearly);

    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName,
          price,
          isYearly
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        window.location.href = data.url;
      } else {
        const errorText = await response.text();
        console.error('Checkout failed:', response.status, errorText);
        alert('Checkout failed: ' + errorText);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error initiating checkout: ' + error.message);
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
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [lastScrollY]);

  const plans = [
    {
      name: 'Unlimited',
      price: isYearly ? '$12' : '$15',
      period: 'USD/month',
      description: 'Best for everyday analysis, reports, and smaller data tasks.',
      features: [
        'Unlimited chat messages',
        'Unlimited access to Formula Generator (web & add-ons)',
        'Unlimited file uploads',
        '50MB file upload limit',
        'Access to all tools (add-ons, data sources, enrichments)',
        'Increased speed & power (4CPU, 2RAM)',
        '5 uploaded files / chat',
        'Unlimited PDF to Excel conversions',
        '15 enrichments',
        '1 scheduled report'
      ],
      buttonText: 'Buy Monthly →',
      popular: false
    },
    {
      name: 'Unlimited Plus',
      price: isYearly ? '$20' : '$25',
      period: 'USD/month',
      description: 'Great for machine learning, large files & qualitative analysis',
      features: [
        'Everything in Unlimited',
        '5,000 enrichments / month',
        '100MB file upload limit',
        'Higher speed & performance for complex work (6CPU, 3RAM)',
        '20 uploaded files / chat',
        'Use on multiple devices at once',
        '10 scheduled reports'
      ],
      buttonText: 'Buy Monthly →',
      popular: true
    },
    {
      name: 'Unlimited Ultra',
      price: isYearly ? '$28' : '$35',
      period: 'USD/month',
      description: 'Great for big data, machine learning, and qualitative analysis',
      features: [
        'Everything in Unlimited Plus',
        '20,000 enrichments / month',
        '500MB file upload limit',
        'Highest speed & performance to handle big data analysis (8CPU, 4RAM)',
        '20 scheduled reports'
      ],
      buttonText: 'Buy Monthly →',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-pure-white">
      {/* Navigation */}
      <nav className={`bg-insulation-black sticky top-4 z-50 mx-4 rounded-2xl transition-transform duration-300 ease-in-out ${isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Yellow horizontal fulcrum line */}
                    <rect x="2" y="14" width="28" height="6" rx="3" fill="#FFD700" />

                    {/* Blue square on the left */}
                    <rect x="4" y="6" width="10" height="10" rx="2" fill="#0066CC" />

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
                  onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                >
                  <span className="text-pure-white hover:text-pure-white transition-colors">Products</span>
                  <ChevronDown className={`w-4 h-4 text-pure-white transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isProductsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-pure-white border border-circuit-silver/30 rounded-lg shadow-lg z-50 min-w-64">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20">
                        Current Products
                      </div>
                      <a href="/landing" className="block w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">CST VBA Macro Generator</div>
                        <div className="text-sm text-circuit-silver">Automate CST Studio Suite workflows</div>
                      </a>

                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20 mt-2">
                        Coming Soon
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">HFSS Macro Generator</div>
                        <div className="text-sm text-circuit-silver">ANSYS HFSS automation tools</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">COMSOL Macro Generator</div>
                        <div className="text-sm text-circuit-silver">Multiphysics simulation automation</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">MATLAB Script Generator</div>
                        <div className="text-sm text-circuit-silver">Engineering computation automation</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Python Engineering Tools</div>
                        <div className="text-sm text-circuit-silver">Custom engineering script generation</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative solutions-dropdown">
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() => setIsSolutionsDropdownOpen(!isSolutionsDropdownOpen)}
                >
                  <span className="text-pure-white hover:text-pure-white transition-colors">Solutions</span>
                  <ChevronDown className={`w-4 h-4 text-pure-white transition-transform ${isSolutionsDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isSolutionsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-pure-white border border-circuit-silver/30 rounded-lg shadow-lg z-50 min-w-72">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20">
                        By Industry
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Telecommunications</div>
                        <div className="text-sm text-circuit-silver">5G/6G antenna design, RF optimization</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Aerospace & Defense</div>
                        <div className="text-sm text-circuit-silver">Radar systems, stealth technology</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Automotive</div>
                        <div className="text-sm text-circuit-silver">ADAS sensors, EV charging systems</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Medical Devices</div>
                        <div className="text-sm text-circuit-silver">MRI coils, implantable devices</div>
                      </button>

                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20 mt-2">
                        By Use Case
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Rapid Prototyping</div>
                        <div className="text-sm text-circuit-silver">Accelerate design iteration cycles</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Parameter Optimization</div>
                        <div className="text-sm text-circuit-silver">Automated design space exploration</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Design Validation</div>
                        <div className="text-sm text-circuit-silver">Automated testing and verification</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Legacy System Modernization</div>
                        <div className="text-sm text-circuit-silver">Update and optimize existing designs</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative resources-dropdown">
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() => setIsResourcesDropdownOpen(!isResourcesDropdownOpen)}
                >
                  <span className="text-pure-white hover:text-pure-white transition-colors">Resources</span>
                  <ChevronDown className={`w-4 h-4 text-pure-white transition-transform ${isResourcesDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isResourcesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-pure-white border border-circuit-silver/30 rounded-lg shadow-lg z-50 min-w-64">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20">
                        Documentation
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Getting Started Guide</div>
                        <div className="text-sm text-circuit-silver">Quick setup and first macro</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">API Reference</div>
                        <div className="text-sm text-circuit-silver">Complete function documentation</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Tutorials</div>
                        <div className="text-sm text-circuit-silver">Step-by-step walkthroughs</div>
                      </button>

                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20 mt-2">
                        Learning
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Video Tutorials</div>
                        <div className="text-sm text-circuit-silver">Visual learning resources</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Best Practices</div>
                        <div className="text-sm text-circuit-silver">Engineering workflow tips</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Case Studies</div>
                        <div className="text-sm text-circuit-silver">Real-world implementation examples</div>
                      </button>

                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20 mt-2">
                        Support
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Help Center</div>
                        <div className="text-sm text-circuit-silver">FAQ and troubleshooting</div>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">Community Forum</div>
                        <div className="text-sm text-circuit-silver">Connect with other engineers</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-pure-white hover:text-pure-white transition-colors cursor-pointer">Enterprise</span>
              <span className="text-pure-white hover:text-pure-white transition-colors cursor-pointer">Docs</span>
              <a href="/pricing" className="text-pure-white hover:text-pure-white transition-colors cursor-pointer">Pricing</a>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-3">
              <a href="/auth/login" className="px-4 py-2 text-pure-white hover:text-pure-white transition-colors rounded-md">
                Log In
              </a>
              <button className="px-4 py-2 text-pure-white hover:text-pure-white transition-colors rounded-md">
                Contact
              </button>
              <a href="/auth/signup" className="px-4 py-2 bg-pure-white text-insulation-black hover:bg-circuit-silver transition-colors rounded-md font-medium">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-insulation-black mb-6">
            Choose the plan that's right for you
          </h1>

          {/* Discount Banner */}
          <div className="bg-blue-600 rounded-lg p-4 mb-6 max-w-2xl mx-auto relative">
            <div className="flex items-center justify-between">
              <div className="text-pure-white font-medium">
                Save 25% off your first month
              </div>
              <div className="flex items-center space-x-2 text-pure-white">
                <span className="text-sm">Use code at checkout:</span>
                <div className="relative">
                  <button
                    onClick={handleCopyCode}
                    className="bg-blue-400 text-blue-900 px-3 py-1 rounded text-sm font-medium flex items-center space-x-1 hover:bg-blue-300 transition-colors"
                  >
                    <span>FBOT4U</span>
                    {copied ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>

                  {/* Copy Confirmation Message */}
                  {showCopyMessage && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-blue-400 text-blue-900 rounded text-sm font-medium flex items-center justify-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gray-200 rounded-lg p-1 flex">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!isYearly
                  ? 'bg-blue-600 text-pure-white'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isYearly
                  ? 'bg-blue-600 text-pure-white'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Yearly <span className="text-blue-500">Save 30%</span>
              </button>
            </div>
          </div>

          {/* Contact Link */}
          <p className="text-sm text-gray-600">
            <a href="#" className="underline hover:text-gray-800">
              Contact us here for discounted team plans or custom plans
            </a>
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 relative border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6">
                  <span className="bg-green-500 text-pure-white px-3 py-1 rounded-full text-xs font-medium">
                    Most popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-insulation-black mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-insulation-black">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                <button
                  onClick={() => handleCheckout(plan.name, plan.price)}
                  className="w-full bg-blue-600 text-pure-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>{plan.buttonText}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <p className="text-sm text-gray-600 mt-3 font-medium">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
