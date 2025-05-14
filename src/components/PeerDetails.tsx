import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wallet, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, ExternalLink } from 'lucide-react';
import { Navbar } from './Navbar';

interface TokenInfo {
  tokenId: string;
  tokenValue: string;
  tokenLevel: string;
  type: string;
}

interface TokenDetailsOffcanvas {
  tokenId: string;
  tokenValue: string;
  tokenLevel: string;
  type: string;
  timestamp: string;
}

export function PeerDetails() {
  const navigate = useNavigate();
  const { peerId } = useParams();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [jumpToPage, setJumpToPage] = React.useState('');
  const [jumpError, setJumpError] = React.useState('');
  const [isOffcanvasOpen, setIsOffcanvasOpen] = React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState<TokenDetailsOffcanvas | null>(null);
  const [isTokenInfoExpanded, setIsTokenInfoExpanded] = React.useState(false);
  const tokensPerPage = 10;
  const totalTokens = 50;
  const totalPages = Math.ceil(totalTokens / tokensPerPage);

  const handleViewDetails = (token: TokenInfo) => {
    setSelectedToken({
      tokenId: token.tokenId,
      tokenValue: token.tokenValue,
      tokenLevel: token.tokenLevel,
      timestamp: new Date().toLocaleString()
    });
    setIsOffcanvasOpen(true);
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage);
    
    if (isNaN(pageNum)) {
      setJumpError('Please enter a valid number');
    } else if (pageNum < 1 || pageNum > totalPages) {
      setJumpError(`Enter a number between 1 and ${totalPages}`);
    } else {
      setCurrentPage(pageNum);
      setJumpToPage('');
      setJumpError('');
    }
  };

  const handleJumpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpToPage(e.target.value);
    setJumpError('');
  };

  const tokens = React.useMemo(() => {
    return Array.from({ length: totalTokens }, (_, index) => ({
      tokenId: `TKN-${Math.random().toString(16).slice(2, 10)}`,
      tokenValue: `${(Math.random() * 1000).toFixed(2)}`,
      tokenLevel: `Level ${Math.floor(Math.random() * 5) + 1}`
    }));
  }, []);

  const currentTokens = tokens.slice(
    (currentPage - 1) * tokensPerPage,
    currentPage * tokensPerPage
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} showSearch={true} />

      <main className="container mx-auto px-6 pt-28 pb-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Peer Details
          </h1>
          <div>
            <span className="px-4 py-2 bg-[var(--color-bg-secondary)] rounded-lg text-[var(--color-text-tertiary)]">
              Peer ID: {peerId}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[var(--color-border-default)] p-8 mt-6">
          <h2 className="text-lg font-semibold mb-6 text-[var(--color-text-primary)]">
            Peer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-[var(--color-bg-success)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-tertiary)]">Balance Amount</p>
                  <p className="text-[var(--color-text-primary)]">1,234.56 RBT</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[var(--color-border-default)] overflow-hidden mt-8">
          <div className="p-8 border-b border-[var(--color-border-default)]">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Tokens</h2>
          </div>
          <div className="overflow-x-auto min-w-full">
            <table className="w-full">
              <thead className="bg-[var(--color-bg-secondary)]">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">S.No</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Token ID</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Token Value</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Token Level</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Type</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-default)]">
                {currentTokens.map((token, index) => (
                  <tr key={index} className="hover:bg-[var(--color-bg-secondary)]">
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-primary)]">{(currentPage - 1) * tokensPerPage + index + 1}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-primary)]">{token.tokenId}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-primary)]">{token.tokenValue}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-primary)]">{token.tokenLevel}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-primary)]">RBT</td>
                    <td className="px-4 sm:px-6 py-4 text-sm">
                      <button
                        onClick={() => navigate(`/token/${token.tokenId}`)}
                        className="text-[var(--color-bg-success)] hover:text-[var(--color-bg-success-dark)] font-medium"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {isOffcanvasOpen && selectedToken && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl">
                  <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-semibold">Token Details</h3>
                    <button
                      onClick={() => setIsOffcanvasOpen(false)}
                      className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="border rounded-lg">
                      <button
                        onClick={() => setIsTokenInfoExpanded(!isTokenInfoExpanded)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <span className="font-medium">Token Information</span>
                        {isTokenInfoExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      {isTokenInfoExpanded && (
                        <div className="p-4 border-t space-y-4">
                          <div>
                            <p className="text-sm text-[var(--color-text-tertiary)]">Token ID</p>
                            <p className="font-medium">{selectedToken.tokenId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[var(--color-text-tertiary)]">Token Value</p>
                            <p className="font-medium">{selectedToken.tokenValue}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[var(--color-text-tertiary)]">Token Level</p>
                            <p className="font-medium">{selectedToken.tokenLevel}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[var(--color-text-tertiary)]">Type</p>
                            <p className="font-medium">{selectedToken.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[var(--color-text-tertiary)]">Timestamp</p>
                            <p className="font-medium">{selectedToken.timestamp}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="px-4 py-3 border-t border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[var(--color-text-tertiary)]">
              Showing {(currentPage - 1) * tokensPerPage + 1} to {Math.min(currentPage * tokensPerPage, totalTokens)} of {totalTokens} tokens
            </div>
            <div className="flex flex-wrap gap-4 w-full sm:w-auto justify-center sm:justify-end items-center">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] justify-center hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="hidden sm:flex gap-2">
                {getPageNumbers().map((pageNum, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof pageNum === 'number' && setCurrentPage(pageNum)}
                    disabled={pageNum === '...' || pageNum === currentPage}
                    className={`w-10 h-10 flex items-center justify-center rounded border ${
                      pageNum === currentPage
                        ? 'bg-[var(--color-bg-success)] text-white border-[var(--color-bg-success)]'
                        : pageNum === '...'
                        ? 'cursor-default'
                        : 'hover:bg-[var(--color-bg-secondary)] transition-colors'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 border-l border-r px-4 relative">
                <form onSubmit={handleJumpToPage} className="flex items-center gap-3">
                  <label className="text-sm text-[var(--color-text-tertiary)]">Go to page</label>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={jumpToPage}
                        onChange={handleJumpInputChange}
                        placeholder={currentPage.toString()}
                        min="1"
                        max={totalPages}
                        className={`w-20 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-bg-success)] text-center ${
                          jumpError ? 'border-red-500' : ''
                        }`}
                        aria-label={`Go to page (1-${totalPages})`}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[var(--color-bg-success)] text-white rounded text-sm hover:bg-[var(--color-bg-success-dark)] transition-colors min-w-[60px] disabled:opacity-50"
                        disabled={!jumpToPage}
                      >
                        Go
                      </button>
                    </div>
                    {jumpError && (
                      <span className="text-red-500 text-xs mt-1 absolute -bottom-6 whitespace-nowrap">
                        {jumpError}
                      </span>
                    )}
                  </div>
                </form>
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] justify-center hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}