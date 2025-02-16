import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
    const [preferences, setPreferences] = useState({
        reducedMotion: false,
        highContrast: false,
        largeText: false,
        screenReader: false
    });

    useEffect(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPreferences(prev => ({
            ...prev,
            reducedMotion: prefersReducedMotion.matches
        }));

        // Listen for changes in system preferences
        const handleMotionChange = (e) => {
            setPreferences(prev => ({
                ...prev,
                reducedMotion: e.matches
            }));
        };

        prefersReducedMotion.addEventListener('change', handleMotionChange);

        return () => {
            prefersReducedMotion.removeEventListener('change', handleMotionChange);
        };
    }, []);

    // Apply accessibility classes to body
    useEffect(() => {
        const classList = document.body.classList;

        if (preferences.reducedMotion) {
            classList.add('reduce-motion');
        } else {
            classList.remove('reduce-motion');
        }

        if (preferences.highContrast) {
            classList.add('high-contrast');
        } else {
            classList.remove('high-contrast');
        }

        if (preferences.largeText) {
            classList.add('large-text');
        } else {
            classList.remove('large-text');
        }

        if (preferences.screenReader) {
            classList.add('screen-reader-optimized');
        } else {
            classList.remove('screen-reader-optimized');
        }
    }, [preferences]);

    const togglePreference = (key) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const value = {
        preferences,
        togglePreference
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
            {/* Skip to main content link */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black"
            >
                Skip to main content
            </a>
            {/* Accessibility controls */}
            <div
                role="region"
                aria-label="Accessibility Controls"
                className="fixed bottom-4 left-4 z-50"
            >
                <button
                    onClick={() => togglePreference('highContrast')}
                    className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-white focus:text-black focus:rounded"
                    aria-pressed={preferences.highContrast}
                >
                    Toggle High Contrast
                </button>
                <button
                    onClick={() => togglePreference('largeText')}
                    className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-white focus:text-black focus:rounded"
                    aria-pressed={preferences.largeText}
                >
                    Toggle Large Text
                </button>
                <button
                    onClick={() => togglePreference('screenReader')}
                    className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-white focus:text-black focus:rounded"
                    aria-pressed={preferences.screenReader}
                >
                    Toggle Screen Reader Optimizations
                </button>
            </div>
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
}; 