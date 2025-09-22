import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useUserContext } from '@/context/UserContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Navigation state
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isSolutionsDropdownOpen, setIsSolutionsDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);

  const { login, register } = useUserContext();
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/');
  };

  useEffect(() => {
    const url = process.env.R2R_DEPLOYMENT_URL || 'http://localhost:7272';
    setDeploymentUrl(url);
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPasswordsMatch()) {
      setPasswordsMatch(false);
      return;
    }
    try {
      await register(email, password, deploymentUrl);
      await login(email, password, deploymentUrl);
      router.push('/');
    } catch (error) {
      console.error('Registration or login failed:', error);
      alert(
        'Registration or login failed. Ensure that your server is running at the specified URL or check your credentials and try again.'
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const checkPasswordsMatch = () => {
    return password === confirmedPassword;
  };

  const handlePasswordBlur = () => {
    setPasswordsMatch(checkPasswordsMatch());
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-700">
      {/* Navigation */}
      <nav
        className={`bg-insulation-black sticky top-4 z-50 mx-4 rounded-2xl transition-transform duration-300 ease-in-out ${
          isNavVisible ? 'translate-y-0' : '-translate-y-full'
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
                    <rect
                      x="2"
                      y="14"
                      width="28"
                      height="6"
                      rx="3"
                      fill="#FFD700"
                    />
                    <rect
                      x="4"
                      y="6"
                      width="10"
                      height="10"
                      rx="2"
                      fill="#0066CC"
                    />
                    <circle cx="22" cy="11" r="5" fill="#00CC66" />
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
                      <a
                        href="/landing"
                        className="block w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors"
                      >
                        <div className="font-medium">
                          CST VBA Macro Generator
                        </div>
                        <div className="text-sm text-circuit-silver">
                          Automate CST Studio Suite workflows
                        </div>
                      </a>
                      <div className="px-4 py-2 text-sm font-medium text-insulation-black border-b border-circuit-silver/20 mt-2">
                        Coming Soon
                      </div>
                      <button className="w-full text-left px-4 py-3 hover:bg-circuit-silver/10 text-insulation-black transition-colors">
                        <div className="font-medium">HFSS Macro Generator</div>
                        <div className="text-sm text-circuit-silver">
                          ANSYS HFSS automation tools
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

      <div className="flex flex-col justify-center items-center min-h-screen bg-zinc-50 dark:bg-zinc-700">
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-100 dark:bg-zinc-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <label
                className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2 flex-grow"
                htmlFor="password"
              >
                Password
              </label>
              {!passwordsMatch && (
                <span className="text-red-400 text-sm font-bold mb-2">
                  Passwords do not match
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                className={`pr-10 ${passwordsMatch ? '' : 'border-red-400'}`}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                className={`pr-10 ${passwordsMatch ? '' : 'border-red-400'}`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button color="primary" className="w-full">
              Sign up with Email
            </Button>
          </div>
        </form>

        <div className="text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">
          <p>
            Already have an account?{' '}
            <span
              onClick={handleLoginClick}
              className="text-accent-base cursor-pointer hover:underline"
            >
              Log in
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
