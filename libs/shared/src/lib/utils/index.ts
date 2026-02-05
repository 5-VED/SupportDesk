// Common utility functions and constants
export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US').format(date);
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
