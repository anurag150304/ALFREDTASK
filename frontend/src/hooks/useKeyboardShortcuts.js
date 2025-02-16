import { useEffect } from 'react';

const useKeyboardShortcuts = (shortcuts) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Don't trigger shortcuts when typing in input fields
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            // Check for modifier keys
            const hasCtrl = event.ctrlKey || event.metaKey;
            const hasShift = event.shiftKey;
            const hasAlt = event.altKey;

            // Find matching shortcut
            const shortcut = shortcuts.find(s => {
                const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
                const ctrlMatch = s.ctrl === hasCtrl;
                const shiftMatch = s.shift === hasShift;
                const altMatch = s.alt === hasAlt;

                return keyMatch && ctrlMatch && shiftMatch && altMatch;
            });

            if (shortcut) {
                event.preventDefault();
                shortcut.action();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [shortcuts]);

    // Return array of available shortcuts for documentation
    return shortcuts.map(({ key, ctrl, shift, alt, description }) => ({
        key,
        ctrl: ctrl || false,
        shift: shift || false,
        alt: alt || false,
        description
    }));
};

// Common shortcuts
export const commonShortcuts = {
    newCard: {
        key: 'n',
        ctrl: true,
        description: 'Create new flashcard'
    },
    review: {
        key: 'r',
        ctrl: true,
        description: 'Start review'
    },
    toggleDarkMode: {
        key: 'd',
        ctrl: true,
        shift: true,
        description: 'Toggle dark mode'
    },
    showHelp: {
        key: '?',
        description: 'Show keyboard shortcuts'
    },
    nextCard: {
        key: 'ArrowRight',
        description: 'Next card'
    },
    previousCard: {
        key: 'ArrowLeft',
        description: 'Previous card'
    },
    flipCard: {
        key: ' ',
        description: 'Flip card'
    },
    markCorrect: {
        key: 'y',
        description: 'Mark as correct'
    },
    markIncorrect: {
        key: 'n',
        description: 'Mark as incorrect'
    }
};

export default useKeyboardShortcuts; 