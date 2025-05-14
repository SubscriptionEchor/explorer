import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { RubixLogo } from '../assets/logo';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearch?: boolean;
}

export function Navbar({ searchQuery, setSearchQuery, showSearch = true, onSearch }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-[var(--color-border-default)] z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div 
              onClick={() => navigate('/')}
              className="text-2xl font-semibold text-[var(--color-text-dark)] cursor-pointer flex items-center"
            >
              <RubixLogo />
            </div>
          </div>
          {showSearch && <div className="flex items-center gap-4">
            <div className="flex gap-2 w-[600px]">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Peer ID or Token ID"
                  className="w-full pl-10 pr-10 py-3 border rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-bg-success)] focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                  >
                    ×
                  </button>
                )}
              </div>
              <button 
                className="px-4 py-2 bg-[var(--color-bg-success)] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-bg-success-dark)] transition-colors"
                onClick={() => {
                  if (searchQuery) {
                    if (searchQuery.length <= 10) {
                      navigate(`/peer/${searchQuery}`);
                    } else {
                      navigate(`/token/${searchQuery}`);
                    }
                  }
                }}
              >
                Search
              </button>
            </div>
          </div>}
        </div>
      </div>
    </header>
  );
}