import { Menu, Phone, MessageSquare, User } from 'lucide-react';

export function InterviewHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#0046B8] rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <div>
                <div className="text-[#0046B8]">Prudential</div>
                <div className="text-xs text-gray-500">150 Years Strong</div>
              </div>
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
