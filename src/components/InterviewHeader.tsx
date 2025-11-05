import { Menu, Phone, MessageSquare, User } from 'lucide-react';

export function InterviewHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center">
              <svg className="h-10" viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="5" y="38" fontFamily="Georgia, serif" fontSize="32" fontWeight="bold" fill="#003087" letterSpacing="-0.5">
                  Prudential
                </text>
                <line x1="220" y1="15" x2="220" y2="45" stroke="#003087" strokeWidth="2" />
                <text x="235" y="38" fontFamily="Arial, sans-serif" fontSize="38" fontWeight="300" fill="#003087" letterSpacing="2">
                  150
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
