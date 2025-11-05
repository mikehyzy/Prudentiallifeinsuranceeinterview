import { Menu, Phone, MessageSquare, User } from 'lucide-react';

export function InterviewHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center">
              <svg className="h-12" viewBox="0 0 420 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="5" y="35" fontFamily="Georgia, serif" fontSize="32" fontWeight="bold" fill="#003087" letterSpacing="-0.5">
                  Prudential
                </text>
                <line x1="220" y1="10" x2="220" y2="50" stroke="#003087" strokeWidth="2" />
                <text x="235" y="35" fontFamily="Arial, sans-serif" fontSize="38" fontWeight="300" fill="#003087" letterSpacing="2">
                  150
                </text>
                <circle cx="390" cy="30" r="22" stroke="#003087" strokeWidth="2" fill="none" />
                <path d="M 390 8 L 390 30 L 405 30" stroke="#003087" strokeWidth="2" fill="none" />
                <path d="M 368 30 C 368 18 378 12 390 12 C 402 12 412 18 412 30 C 412 42 402 48 390 48 C 378 48 368 42 368 30" stroke="#003087" strokeWidth="1.5" fill="none" />
                <text x="375" y="56" fontFamily="Arial, sans-serif" fontSize="7" fill="#003087" letterSpacing="1">
                  YEARS
                </text>
              </svg>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-700 hover:text-[#0046B8] transition-colors">
                Products
              </a>
              <a href="#" className="text-gray-700 hover:text-[#0046B8] transition-colors">
                Resources
              </a>
              <a href="#" className="text-gray-700 hover:text-[#0046B8] transition-colors">
                About Us
              </a>
              <a href="#" className="text-gray-700 hover:text-[#0046B8] transition-colors">
                Support
              </a>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-gray-700 hover:text-[#0046B8] transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm">1-800-778-3827</span>
            </button>
            <button className="p-2 text-gray-700 hover:text-[#0046B8] transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-700 hover:text-[#0046B8] transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="md:hidden p-2 text-gray-700 hover:text-[#0046B8] transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
