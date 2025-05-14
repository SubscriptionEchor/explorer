import React from 'react';
import { Box, ArrowUpRight, ChevronLeft, ChevronRight, BarChart as ChartIcon, ExternalLink, Wallet, Users, X, Info, Search, Copy, Check } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedCounter } from './AnimatedCounter';
import { Navbar } from './Navbar';
import { TransactionDetails } from './TransactionDetails';
import { shortenString, copyToClipboard } from '../utils/format';

// Import TransactionDetailsData interface so we can properly type our state
interface TransactionDetailsData {
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

export function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [timeRange, setTimeRange] = React.useState('24h');
  const [searchError, setSearchError] = React.useState('');
  const [jumpToPage, setJumpToPage] = React.useState('');
  const [jumpError, setJumpError] = React.useState('');
  const [isOffcanvasOpen, setIsOffcanvasOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<TransactionDetailsData | null>(null);
  const [copiedTxId, setCopiedTxId] = React.useState<string | null>(null);
  const [copiedSenderId, setCopiedSenderId] = React.useState<string | null>(null);
  const [copiedReceiverId, setCopiedReceiverId] = React.useState<string | null>(null);
  const transactionsPerPage = 10;
  const totalTransactions = 100;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

  const handleViewDetails = (transaction: {
    txId: string;
    senderId: string;
    receiverId: string;
    timestamp: Date;
    amount: string;
  }) => {
    // Format the transaction to match the TransactionDetails component's expected format
    setSelectedTransaction({
      parentTokenId: "0xd22b9feaa8a378bd0dac899d439a323f278b47a31e46c00250e2f1378eb48379", // Mock parent token ID
      amount: transaction.amount,
      tokenLevel: "Level 1", // Mock token level
      tokenNumber: "#" + Math.random().toString().slice(2, 12), // Mock token number
      transactionId: transaction.txId,
      senderId: transaction.senderId, // Store the full ID
      receiverId: transaction.receiverId, // Store the full ID
      timestamp: transaction.timestamp.toLocaleString(),
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

  const transactions = React.useMemo(() => {
    return Array.from({ length: totalTransactions }, (_, index) => ({
      id: index + 1,
      txId: `0x${Math.random().toString(16).slice(2, 10)}`,
      senderId: `0x${Math.random().toString(16).slice(2, 10)}`,
      receiverId: `0x${Math.random().toString(16).slice(2, 10)}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      amount: (Math.random() * 100).toFixed(2),
      type: index % 2 === 0 ? 'sent' : 'received',
    }));
  }, []);

  const generateChartData = React.useMemo(() => {
    const now = new Date();
    const data = [];

    switch (timeRange) {
      case '24h':
        for (let i = 24; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000);
          data.push({
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: Math.floor(Math.random() * 1000) + 500
          });
        }
        break;
      case '30d':
        for (let i = 30; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          data.push({
            time: time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
            value: Math.floor(Math.random() * 1000) + 500
          });
        }
        break;
      case '12m':
        for (let i = 12; i >= 0; i--) {
          const time = new Date(now.getFullYear(), now.getMonth() - i, 1);
          data.push({
            time: time.toLocaleDateString([], { month: 'short' }),
            value: Math.floor(Math.random() * 1000) + 500
          });
        }
        break;
    }

    return data;
  }, [timeRange]);

  const currentTransactions = transactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  // Copy functions for different fields
  const handleCopyTxId = (txId: string) => {
    copyToClipboard(txId)
      .then(() => {
        setCopiedTxId(txId);
        setTimeout(() => setCopiedTxId(null), 2000); // Reset after 2 seconds
      });
  };

  const handleCopySenderId = (senderId: string) => {
    copyToClipboard(senderId)
      .then(() => {
        setCopiedSenderId(senderId);
        setTimeout(() => setCopiedSenderId(null), 2000); // Reset after 2 seconds
      });
  };

  const handleCopyReceiverId = (receiverId: string) => {
    copyToClipboard(receiverId)
      .then(() => {
        setCopiedReceiverId(receiverId);
        setTimeout(() => setCopiedReceiverId(null), 2000); // Reset after 2 seconds
      });
  };

  React.useEffect(() => {
    if (isOffcanvasOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOffcanvasOpen]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} showSearch={false} />

      <main className="container mx-auto px-6 pt-28 pb-12 space-y-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Welcome to Rubix Explorer</h1>
            <p className="text-[var(--color-text-tertiary)]">Search and manage your blockchain assets</p>
          </div>
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
                  // Route based on query length
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
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Network Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[var(--color-bg-tertiary)] p-6 rounded-lg shadow-sm relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[var(--color-text-tertiary)] mb-2">RBT Price</p>
                  <p className="text-2xl font-semibold text-[var(--color-text-primary)]">$<AnimatedCounter value={254.51} formatFn={(v) => v.toFixed(2)} /></p>
                </div>
                <div className="bg-[var(--color-bg-success)] p-2 rounded-lg">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[var(--color-bg-tertiary)] p-6 rounded-lg shadow-sm relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[var(--color-text-tertiary)] mb-2">Transactions</p>
                  <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
                    <AnimatedCounter value={5830343} />
                  </p>
                </div>
                <div className="bg-[var(--color-bg-success)] p-2 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[var(--color-bg-tertiary)] p-6 rounded-lg shadow-sm relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[var(--color-text-tertiary)] mb-2">Total Peers</p>
                  <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
                    <AnimatedCounter value={605196} />
                  </p>
                </div>
                <div className="bg-[var(--color-bg-success)] p-2 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[var(--color-bg-tertiary)] p-6 rounded-lg shadow-sm relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[var(--color-text-tertiary)] mb-2">Total Supply</p>
                  <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
                    <AnimatedCounter value={10247786} />
                  </p>
                </div>
                <div className="bg-[var(--color-bg-success)] p-2 rounded-lg">
                  <Box className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Transaction Analytics</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2 bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ChartIcon className="w-5 h-5 text-[var(--color-bg-success)]" />
                  <h2 className="text-lg font-semibold">Transaction History</h2>
                  <div className="relative group">
                    <Info className="w-4 h-4 text-[var(--color-text-tertiary)] cursor-help" />
                    <div className="absolute left-0 top-6 hidden group-hover:block bg-white p-3 rounded-lg shadow-lg border w-64 z-10 text-sm text-[var(--color-text-tertiary)]">
                      View transaction volume trends over different time periods
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {['24h', '30d', '12m'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-2 rounded-lg text-sm ${timeRange === range
                        ? 'bg-[var(--color-bg-success)] text-white'
                        : 'text-[var(--color-text-tertiary)] border hover:bg-[var(--color-bg-secondary)]'
                        }`}
                    >
                      {range === '24h' ? '24 Hours' : range === '30d' ? '30 Days' : '12 Months'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-text-light)"
                      opacity={0.2}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      stroke="var(--color-text-tertiary)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      padding={{ left: 20, right: 20 }}
                    />
                    <YAxis
                      stroke="var(--color-text-tertiary)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: '8px',
                        padding: '12px'
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                      labelStyle={{
                        color: 'var(--color-text-tertiary)',
                        marginBottom: '8px'
                      }}
                    />
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-bg-success)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--color-bg-success)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-bg-success)"
                      strokeWidth={3}
                      fill="url(#colorValue)"
                      dot={{ r: 2, fill: 'var(--color-bg-success)' }}
                      activeDot={{ r: 6, fill: 'var(--color-bg-success)' }}
                      animationDuration={500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-[var(--color-text-tertiary)] flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--color-bg-success)]"></span>
                Transaction Volume
              </div>
            </div>
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-4">Latest Transactions</h2>
              <div className="bg-white rounded-lg border overflow-hidden overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-bg-secondary)]">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">S.No</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Transaction ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Sender ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Receiver ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Timestamp</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-tertiary)]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[var(--color-bg-secondary)]">
                        <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">{tx.id}</td>
                        <td className="px-4 py-3 text-sm text-[var(--color-bg-success)]">
                          <span title={tx.txId}>{shortenString(tx.txId)}</span>
                          <button
                            onClick={() => handleCopyTxId(tx.txId)}
                            className="p-1 ml-1 hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors"
                            title="Copy Transaction ID"
                          >
                            {copiedTxId === tx.txId ? (
                              <Check className="w-4 h-4 text-[var(--color-bg-success)]" />
                            ) : (
                              <Copy className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                          <span title={tx.senderId}>{shortenString(tx.senderId)}</span>
                          <button
                            onClick={() => handleCopySenderId(tx.senderId)}
                            className="p-1 ml-1 hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors"
                            title="Copy Sender ID"
                          >
                            {copiedSenderId === tx.senderId ? (
                              <Check className="w-4 h-4 text-[var(--color-bg-success)]" />
                            ) : (
                              <Copy className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                          <span title={tx.receiverId}>{shortenString(tx.receiverId)}</span>
                          <button
                            onClick={() => handleCopyReceiverId(tx.receiverId)}
                            className="p-1 ml-1 hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors"
                            title="Copy Receiver ID"
                          >
                            {copiedReceiverId === tx.receiverId ? (
                              <Check className="w-4 h-4 text-[var(--color-bg-success)]" />
                            ) : (
                              <Copy className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                          {tx.timestamp.toISOString().slice(0, 10)} / {tx.timestamp.toISOString().slice(11, 16)}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                          {tx.amount}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">RBT</td>
                        <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                          <button
                            onClick={() => handleViewDetails(tx)}
                            className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors"
                          >
                            <ExternalLink className="w-5 h-5 text-[var(--color-bg-success)]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                          className={`w-10 h-10 flex items-center justify-center rounded border ${pageNum === currentPage
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
                              className={`w-20 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-bg-success)] text-center ${jumpError ? 'border-red-500' : ''
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
            </div>
          </div>
        </section>
      </main>

      {/* Replace the inline transaction details with the TransactionDetails component */}
      <TransactionDetails
        isOpen={isOffcanvasOpen}
        onClose={() => setIsOffcanvasOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}