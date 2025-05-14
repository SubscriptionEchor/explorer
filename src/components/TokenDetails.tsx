import React from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Send, Wallet, Users, Split, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, ExternalLink } from 'lucide-react';
import { Navbar } from './Navbar';

interface QuorumMember {
  id: string;
}

interface TransactionDetails {
  parentTokenId: string;
  amount: string;
  tokenLevel: string;
  tokenNumber: string;
  transactionId: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  amount_rbt: string;
  type: string;
}

export function TokenDetails() {
  const { tokenId } = useParams();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isViewingParts, setIsViewingParts] = React.useState(false);
  const [jumpToPage, setJumpToPage] = React.useState('');
  const [jumpError, setJumpError] = React.useState('');
  const transactionsPerPage = 10;
  const totalTransactions = 30; // Mock total count
  const [isOffcanvasOpen, setIsOffcanvasOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<TransactionDetails | null>(null);
  const [isTokenInfoExpanded, setIsTokenInfoExpanded] = React.useState(false);
  const [isQuorumListExpanded, setIsQuorumListExpanded] = React.useState(false);
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
  const offcanvasRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (offcanvasRef.current && !offcanvasRef.current.contains(event.target as Node)) {
        setIsOffcanvasOpen(false);
      }
    };

    if (isOffcanvasOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOffcanvasOpen]);
  
  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction({
      parentTokenId: "0x7d8f74j44nj0m...",
      amount: "150.00",
      tokenLevel: "Level 2",
      tokenNumber: "#123456789012344",
      transactionId: transaction.txId || "0x1234...",
      senderId: transaction.senderId,
      receiverId: transaction.receiverId,
      timestamp: transaction.timestamp,
      amount_rbt: transaction.amount,
      type: "RBT"
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

  // Generate mock transaction history data
  const transactionHistory = React.useMemo(() => {
    return Array.from({ length: transactionsPerPage }, (_, index) => ({
      txId: `0x${Math.random().toString(16).slice(2, 10)}`,
      senderId: `0x${Math.random().toString(16).slice(2, 10)}`,
      receiverId: `0x${Math.random().toString(16).slice(2, 10)}`,
      timestamp: new Date(Date.now() - index * 86400000).toLocaleString(),
      amount: (Math.random() * 100).toFixed(2),
      type: 'RBT',
      subnetId: `SN-${Math.random().toString(16).slice(2, 6)}`
    }));
  }, [currentPage]);

  // Mock data - replace with actual API call
  const tokenInfo = {
    blockId: "0x7d8f...",
    amount: "150.00",
    isSplit: true,
    timestamp: new Date().toLocaleString(),
    tokenLevel: "Level 2",
    tokenNumber: "#12345",
    parentId: "0x4f7e..."
  };

  const quorumList: QuorumMember[] = Array.from({ length: 7 }, () => ({
    id: Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  }));

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} showSearch={true} />
      <main className="container mx-auto px-6 pt-28 pb-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            {isViewingParts ? 'Part Token Details' : 'Token Details'}
          </h1>
          <div>
            <div className="flex gap-4">
              <span className="px-4 py-2 bg-[var(--color-bg-secondary)] rounded-lg text-[var(--color-text-tertiary)]">
                Parent ID: {tokenInfo.parentId}
              </span>
              {isViewingParts && (
                <span className="px-4 py-2 bg-[var(--color-bg-secondary)] rounded-lg text-[var(--color-text-tertiary)]">
                  Part Token ID: {tokenId}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[var(--color-border-default)] p-8 mt-6">
          <h2 className="text-lg font-semibold mb-6 text-[var(--color-text-primary)]">
            {isViewingParts ? 'Part Token Information' : 'Token Information'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[var(--color-bg-success)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-tertiary)]">Block ID</p>
                  <p className="text-[var(--color-text-primary)]">{tokenInfo.blockId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[var(--color-bg-success)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-tertiary)]">Token Level</p>
                  <p className="text-[var(--color-text-primary)]">{tokenInfo.tokenLevel}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-[var(--color-bg-success)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-tertiary)]">Amount</p>
                  <p className="text-[var(--color-text-primary)]">{tokenInfo.amount} RBT</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
                  <Send className="w-5 h-5 text-[var(--color-bg-success)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-tertiary)]">Token Number</p>
                  <p className="text-[var(--color-text-primary)]">{tokenInfo.tokenNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {tokenInfo.isSplit && !isViewingParts && (
          <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-default)] p-6 mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Split className="w-5 h-5 text-[var(--color-bg-success)]" />
                <p className="text-[var(--color-text-primary)]">This token is split into parts</p>
              </div>
              <button 
                className="px-4 py-2 bg-[var(--color-bg-success)] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-bg-success-dark)] transition-colors"
                onClick={() => {
                  setIsViewingParts(true);
                }}
              >
                View Parts
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-[var(--color-border-default)] overflow-hidden mt-8">
          <div className="p-8 border-b border-[var(--color-border-default)]">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {isViewingParts ? 'Part Transaction History' : 'Transaction History'}
            </h2>
          </div>
          <div className="overflow-x-auto min-w-full">
            <table className="w-full">
              <thead className="bg-[var(--color-bg-secondary)]">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">S.No</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)] whitespace-nowrap">Transaction ID</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)] whitespace-nowrap">Sender ID</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)] whitespace-nowrap">Receiver ID</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)] whitespace-nowrap">Timestamp</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)] whitespace-nowrap">Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)] whitespace-nowrap">Type</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)] whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-default)]">
                {transactionHistory.map((transaction, index) => (
                  <tr key={index} className="hover:bg-[var(--color-bg-secondary)]">
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-primary)]">{(currentPage - 1) * transactionsPerPage + index + 1}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-primary)] whitespace-nowrap">{transaction.txId}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-primary)] whitespace-nowrap">{transaction.senderId}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-primary)] whitespace-nowrap">{transaction.receiverId}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-tertiary)] whitespace-nowrap">{transaction.timestamp}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-primary)] whitespace-nowrap">{transaction.amount}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-[var(--color-text-primary)] whitespace-nowrap">RBT</td>
                    <td className="px-4 sm:px-6 py-4 text-sm whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(transaction)}
                        className="text-[var(--color-bg-success)] hover:text-[var(--color-bg-success-dark)] font-medium"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Offcanvas */}
            {isOffcanvasOpen && selectedTransaction && (
              <>
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
                  <div ref={offcanvasRef} className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-default)]">
                      <h3 className="text-lg font-semibold">Transaction Details</h3>
                      <button
                        onClick={() => setIsOffcanvasOpen(false)}
                        className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      <div className="border border-[var(--color-border-default)] rounded-lg shadow-sm">
                        <button
                          onClick={() => setIsTokenInfoExpanded(!isTokenInfoExpanded)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                        >
                          <span className="font-medium">Token Information</span>
                          {isTokenInfoExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        {isTokenInfoExpanded && (
                          <div className="p-4 border-t border-[var(--color-border-default)] space-y-4 bg-[var(--color-bg-secondary)]">
                            <div>
                              <p className="text-sm text-[var(--color-text-tertiary)]">Parent Token ID</p>
                              <p className="font-medium">{selectedTransaction.parentTokenId}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[var(--color-text-tertiary)]">Amount</p>
                              <p className="font-medium">{selectedTransaction.amount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[var(--color-text-tertiary)]">Token Level</p>
                              <p className="font-medium">{selectedTransaction.tokenLevel}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[var(--color-text-tertiary)]">Token Number</p>
                              <p className="font-medium">{selectedTransaction.tokenNumber}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4 bg-white rounded-lg border border-[var(--color-border-default)] p-4">
                        <h4 className="font-medium text-lg">Transaction History</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-[var(--color-text-tertiary)]">Transaction ID</p>
                            <p className="font-medium">{selectedTransaction.transactionId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[var(--color-text-tertiary)]">Sender ID</p>
                            <p className="font-medium">{selectedTransaction.senderId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[var(--color-text-tertiary)]">Receiver ID</p>
                            <p className="font-medium">{selectedTransaction.receiverId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[var(--color-text-tertiary)]">Timestamp</p>
                            <p className="font-medium">{selectedTransaction.timestamp}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[var(--color-text-tertiary)]">Amount</p>
                            <p className="font-medium">{selectedTransaction.amount_rbt} RBT</p>
                          </div>
                          <div>
                            <p className="text-sm text-[var(--color-text-tertiary)]">Type</p>
                            <p className="font-medium">{selectedTransaction.type}</p>
                          </div>
                          <div className="border border-[var(--color-border-default)] rounded-lg shadow-sm">
                            <button
                              onClick={() => setIsQuorumListExpanded(!isQuorumListExpanded)}
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
                            >
                              <span className="font-medium">Quorum List</span>
                              {isQuorumListExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                            {isQuorumListExpanded && (
                              <div className="p-4 border-t border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
                                <div className="space-y-2">
                                  {quorumList.map((member, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <p className="font-mono text-sm text-[var(--color-text-primary)]">{member.id}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="px-4 py-3 border-t border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[var(--color-text-tertiary)]">
              Showing {(currentPage - 1) * transactionsPerPage + 1} to {Math.min(currentPage * transactionsPerPage, totalTransactions)} of {totalTransactions} transactions
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