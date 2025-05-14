import React from 'react';
import { X, ChevronUp, ChevronDown, Copy, Check } from 'lucide-react';
import { shortenString, copyToClipboard } from '../utils/format';

interface QuorumMember {
    id: string;
}

interface TransactionDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: TransactionDetailsData | null;
}

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

export function TransactionDetails({ isOpen, onClose, transaction }: TransactionDetailsProps) {
    const [isTokenInfoExpanded, setIsTokenInfoExpanded] = React.useState(false);
    const [isQuorumListExpanded, setIsQuorumListExpanded] = React.useState(false);
    const [copiedId, setCopiedId] = React.useState<string | null>(null);
    const offcanvasRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (offcanvasRef.current && !offcanvasRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Handle copying ID to clipboard
    const handleCopyId = (id: string) => {
        copyToClipboard(id)
            .then(() => {
                setCopiedId(id);
                setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
            });
    };

    // Mock quorum list data
    const quorumList: QuorumMember[] = Array.from({ length: 7 }, () => ({
        id: Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    }));

    if (!isOpen || !transaction) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
            <div ref={offcanvasRef} className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-default)]">
                    <h3 className="text-lg font-semibold">Transaction Details</h3>
                    <button
                        onClick={onClose}
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
                                    <div className="relative">
                                        <p className="font-medium pr-6" title={transaction.parentTokenId}>
                                            {shortenString(transaction.parentTokenId)}
                                        </p>
                                        <button
                                            onClick={() => handleCopyId(transaction.parentTokenId)}
                                            className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded-full transition-colors absolute right-0 top-1/2 transform -translate-y-1/2"
                                            title="Copy Parent Token ID"
                                        >
                                            {copiedId === transaction.parentTokenId ? (
                                                <Check className="w-4 h-4 text-[var(--color-bg-success)]" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-text-tertiary)]">Amount</p>
                                    <p className="font-medium">{transaction.amount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-text-tertiary)]">Token Level</p>
                                    <p className="font-medium">{transaction.tokenLevel}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--color-text-tertiary)]">Token Number</p>
                                    <p className="font-medium">{transaction.tokenNumber}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4 bg-white rounded-lg border border-[var(--color-border-default)] p-4">
                        <h4 className="font-medium text-lg">Transaction History</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-[var(--color-text-tertiary)]">Transaction ID</p>
                                <div className="relative">
                                    <p className="font-medium pr-6" title={transaction.transactionId}>
                                        {shortenString(transaction.transactionId)}
                                    </p>
                                    <button
                                        onClick={() => handleCopyId(transaction.transactionId)}
                                        className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded-full transition-colors absolute right-0 top-1/2 transform -translate-y-1/2"
                                        title="Copy Transaction ID"
                                    >
                                        {copiedId === transaction.transactionId ? (
                                            <Check className="w-4 h-4 text-[var(--color-bg-success)]" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-tertiary)]">Sender ID</p>
                                <div className="relative">
                                    <p className="font-medium pr-6" title={transaction.senderId}>
                                        {shortenString(transaction.senderId)}
                                    </p>
                                    <button
                                        onClick={() => handleCopyId(transaction.senderId)}
                                        className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded-full transition-colors absolute right-0 top-1/2 transform -translate-y-1/2"
                                        title="Copy Sender ID"
                                    >
                                        {copiedId === transaction.senderId ? (
                                            <Check className="w-4 h-4 text-[var(--color-bg-success)]" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-tertiary)]">Receiver ID</p>
                                <div className="relative">
                                    <p className="font-medium pr-6" title={transaction.receiverId}>
                                        {shortenString(transaction.receiverId)}
                                    </p>
                                    <button
                                        onClick={() => handleCopyId(transaction.receiverId)}
                                        className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded-full transition-colors absolute right-0 top-1/2 transform -translate-y-1/2"
                                        title="Copy Receiver ID"
                                    >
                                        {copiedId === transaction.receiverId ? (
                                            <Check className="w-4 h-4 text-[var(--color-bg-success)]" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-tertiary)]">Timestamp</p>
                                <p className="font-medium">
                                    {(() => {
                                        try {
                                            const date = new Date(transaction.timestamp);
                                            return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${date.toLocaleDateString()}`;
                                        } catch (e) {
                                            return transaction.timestamp;
                                        }
                                    })()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-tertiary)]">Amount</p>
                                <p className="font-medium">{transaction.amount_rbt} RBT</p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-tertiary)]">Type</p>
                                <p className="font-medium">{transaction.type}</p>
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
                                                <div key={index} className="relative py-1">
                                                    <p className="font-mono text-sm text-[var(--color-text-primary)] pr-6" title={member.id}>
                                                        {shortenString(member.id)}
                                                    </p>
                                                    <button
                                                        onClick={() => handleCopyId(member.id)}
                                                        className="p-1 hover:bg-[var(--color-bg-tertiary)] rounded-full transition-colors absolute right-0 top-1/2 transform -translate-y-1/2"
                                                        title="Copy ID"
                                                    >
                                                        {copiedId === member.id ? (
                                                            <Check className="w-4 h-4 text-[var(--color-bg-success)]" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                                                        )}
                                                    </button>
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
    );
} 