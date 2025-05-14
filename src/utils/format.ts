/**
 * Shortens a string (like an ID) by showing only the first and last few characters
 * @param str The string to shorten
 * @param startChars Number of characters to show at the start
 * @param endChars Number of characters to show at the end
 * @returns Shortened string with dots in the middle
 */
export const shortenString = (str: string, startChars = 4, endChars = 4): string => {
    if (!str) return '';
    if (str.length <= startChars + endChars) return str;

    return `${str.slice(0, startChars)}...${str.slice(str.length - endChars)}`;
};

/**
 * Copies text to clipboard
 * @param text The text to copy
 * @returns Promise that resolves when copy is successful
 */
export const copyToClipboard = async (text: string): Promise<void> => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
    }
}; 