export function formatRelativeTime(date) {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffTime = reviewDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        const days = Math.abs(diffDays);
        return `Overdue by ${days} ${days === 1 ? 'day' : 'days'}`;
    }

    if (diffDays === 0) {
        return 'Due today';
    }

    if (diffDays === 1) {
        return 'Due tomorrow';
    }

    if (diffDays < 7) {
        return `Due in ${diffDays} days`;
    }

    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `Due in ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    }

    const months = Math.floor(diffDays / 30);
    return `Due in ${months} ${months === 1 ? 'month' : 'months'}`;
} 