import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { brandingConfig } from '@/config/brandingConfig';
import { useUserContext } from '@/context/UserContext';
import debounce from '@/lib/debounce';
import { supabase } from '@/lib/supabase';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverHealth, setServerHealth] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, loginWithToken, authState } = useUserContext();
  const router = useRouter();

  const [rawDeploymentUrl, setRawDeploymentUrl] = useState('');
  const [sanitizedDeploymentUrl, setSanitizedDeploymentUrl] = useState('');

  // Navigation state
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isSolutionsDropdownOpen, setIsSolutionsDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);

  // Retrieve deployment URL from runtime config or use default
  const getDeploymentUrl = () => {
    if (
      typeof window !== 'undefined' &&
      window.__RUNTIME_CONFIG__?.NEXT_PUBLIC_R2R_DEPLOYMENT_URL &&
      !window.__RUNTIME_CONFIG__.NEXT_PUBLIC_R2R_DEPLOYMENT_URL.includes(
        '__NEXT_PUBLIC_R2R_DEPLOYMENT_URL__'
      )
    ) {
      return window.__RUNTIME_CONFIG__.NEXT_PUBLIC_R2R_DEPLOYMENT_URL;
    }
    return '';
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = getDeploymentUrl();
      setRawDeploymentUrl(url);
      setSanitizedDeploymentUrl(url);

      if (window.__RUNTIME_CONFIG__) {
        if (
          window.__RUNTIME_CONFIG__.NEXT_PUBLIC_R2R_DEFAULT_EMAIL &&
          !window.__RUNTIME_CONFIG__.NEXT_PUBLIC_R2R_DEFAULT_EMAIL.includes(
            '__NEXT_PUBLIC_R2R_DEFAULT_EMAIL__'
          )
        ) {
          setEmail(window.__RUNTIME_CONFIG__.NEXT_PUBLIC_R2R_DEFAULT_EMAIL);
        }

        if (
          window.__RUNTIME_CONFIG__.NEXT_PUBLIC_R2R_DEFAULT_PASSWORD &&
          !window.__RUNTIME_CONFIG__.NEXT_PUBLIC_R2R_DEFAULT_PASSWORD.includes(
            '__NEXT_PUBLIC_R2R_DEFAULT_PASSWORD__'
          )
        ) {
          setPassword(
            window.__RUNTIME_CONFIG__.NEXT_PUBLIC_R2R_DEFAULT_PASSWORD
          );
        }
      }
    }
  }, []);

  // Health check function - only called after failed login attempts
  const checkDeploymentHealth = useCallback(async () => {
    try {
      const response = await fetch(`${sanitizedDeploymentUrl}/v3/health`);
      const data = await response.json();
      const isHealthy = data.results?.message?.trim().toLowerCase() === 'ok';
      setServerHealth(isHealthy);
      return isHealthy;
    } catch (error) {
      console.error('Health check failed:', error);
      setServerHealth(false);
      return false;
    }
  }, [sanitizedDeploymentUrl]);

  // Handle login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await login(email, password, sanitizedDeploymentUrl);
      setLoginSuccess(true);
    } catch (error) {
      console.error('Login failed:', error);

      // Only check server health after a failed login attempt
      const isServerHealthy = await checkDeploymentHealth();

      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Provide appropriate error message based on server health
      const serverStatusMessage = isServerHealthy
        ? 'The server appears to be running correctly. Please check your credentials and try again.'
        : 'Unable to communicate with the server. Please verify the server is running at the specified URL.';

      alert(`Login failed. ${serverStatusMessage}\n\nError: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful login redirect
  useEffect(() => {
    if (loginSuccess && authState.isAuthenticated) {
      router.push('/');
    }
  }, [loginSuccess, authState.isAuthenticated, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // OAuth sign-in handler
  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    if (!supabase) {
      setError(
        'Supabase client is not configured. OAuth sign-in is unavailable.'
      );
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
      });
      if (error) {
        throw error;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        await loginWithToken(session.access_token, sanitizedDeploymentUrl);
        setLoginSuccess(true);
      } else {
        throw new Error('No access token found after OAuth sign-in');
      }
    } catch (error) {
      console.error('OAuth sign in failed:', error);
      setError('OAuth sign in failed. Please try again.');
    }
  };

  // URL sanitization function
  const sanitizeUrl = (url: string): string => {
    if (
      typeof window !== 'undefined' &&
      window.__RUNTIME_CONFIG__?.NEXT_PUBLIC_R2R_DEPLOYMENT_URL
    ) {
      const configUrl =
        window.__RUNTIME_CONFIG__.NEXT_PUBLIC_R2R_DEPLOYMENT_URL;
      if (!url || url === 'http://' || url === 'https://') {
        return configUrl;
      }
    }

    if (!url || url === 'http://' || url === 'https://') {
      return '';
    }

    let sanitized = url.trim();
    sanitized = sanitized.replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(sanitized)) {
      sanitized = 'http://' + sanitized;
    }
    sanitized = sanitized.replace(/(https?:\/\/)|(\/)+/g, '$1$2');
    return sanitized;
  };

  // Debounced URL sanitization
  const debouncedSanitizeUrl = useCallback(
    debounce((url: string) => {
      setSanitizedDeploymentUrl(sanitizeUrl(url));
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSanitizeUrl(rawDeploymentUrl);
  }, [rawDeploymentUrl, debouncedSanitizeUrl]);

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

      <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-16">
        <div className="bg-zinc-100 dark:bg-zinc-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md flex flex-col">
          <div className="flex-grow">
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                htmlFor="sanitizedDeploymentUrl"
              >
                {brandingConfig.deploymentName} Deployment URL
              </label>
              {serverHealth === false && (
                <span className="text-red-400 text-sm font-bold mb-2 block">
                  Unable to communicate to the specified deployment. Check its
                  status or try again.
                </span>
              )}
              <Input
                id="deploymentUrl"
                name="deploymentUrl"
                type="text"
                placeholder="Deployment URL"
                value={rawDeploymentUrl}
                onChange={(e) => setRawDeploymentUrl(e.target.value)}
                autoComplete="url"
              />
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <span
                    onClick={() => router.push('/auth/signup')}
                    className="text-sm font-semibold text-accent-base cursor-pointer hover:underline"
                  >
                    Sign up with Email
                  </span>
                </div>
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
                <label
                  className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
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
            </form>

            <div className="mb-4">
              <Button
                onClick={handleSubmit}
                color="primary"
                className="w-full my-2"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in with Email'}
              </Button>

              <Button
                onClick={() => handleOAuthSignIn('google')}
                color="primary"
                className="w-full my-2 relative"
                disabled={true}
                tooltip="OAuth sign-in requires using the Supabase auth provider."
              >
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <Image
                    src="/images/google-logo.svg"
                    alt="Google logo"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="flex-grow text-center">
                  Sign in with Google
                </span>
              </Button>

              <Button
                onClick={() => handleOAuthSignIn('github')}
                color="primary"
                className="w-full my-2 relative"
                disabled={true}
                tooltip="OAuth sign-in requires using the Supabase auth provider."
              >
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <Image
                    src="/images/github-mark.svg"
                    alt="Github logo"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="flex-grow text-center">
                  Sign in with GitHub
                </span>
              </Button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
