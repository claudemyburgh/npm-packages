import Alpine from "alpinejs";

type HeadroomOptions = {
    offset: number;
    tolerance: number;
    classes: {
        initial: string;
        pinned: string;
        unpinned: string;
        top: string;
        notTop: string;
        bottom: string;
        notBottom: string;
        frozen: string;
    };
};

function Headroom() {
    document.addEventListener('alpine:init', function() {
        Alpine.directive(
            "headroom",
            (
                el: HTMLElement,
                { modifiers, expression }: { modifiers: string[], expression: string | undefined },
                { evaluate, cleanup }: { evaluate: (exp: string) => any, cleanup: (cb: () => void) => void }
            ) => {
                let lastScrollY = 0;
                let isPinned = true;
                let ticking = false;
                let isAtTop = true;
                let isAtBottom = false;

                const defaultOptions: HeadroomOptions = {
                    offset: 0,
                    tolerance: 0,
                    classes: {
                        initial: "headroom",
                        pinned: "headroom--pinned",
                        unpinned: "headroom--unpinned",
                        top: "headroom--top",
                        notTop: "headroom--not-top",
                        bottom: "headroom--bottom",
                        notBottom: "headroom--not-bottom",
                        frozen: "headroom--frozen",
                    },
                };

                let options: HeadroomOptions = { ...defaultOptions };

                // Helper function to safely add/remove classes that may contain spaces (Tailwind)
                const addClasses = (element: HTMLElement, classString: string) => {
                    const classes = classString.trim().split(/\s+/).filter(cls => cls.length > 0);
                    element.classList.add(...classes);
                };

                const removeClasses = (element: HTMLElement, classString: string) => {
                    const classes = classString.trim().split(/\s+/).filter(cls => cls.length > 0);
                    element.classList.remove(...classes);
                };

                const toggleClasses = (element: HTMLElement, classString: string, force?: boolean) => {
                    const classes = classString.trim().split(/\s+/).filter(cls => cls.length > 0);
                    classes.forEach(cls => element.classList.toggle(cls, force));
                };

                // Parse options with better error handling
                if (expression) {
                    try {
                        const userOptions = evaluate(expression);
                        if (userOptions && typeof userOptions === 'object') {
                            options = {
                                ...defaultOptions,
                                ...userOptions,
                                classes: {
                                    ...defaultOptions.classes,
                                    ...(userOptions.classes || {}),
                                },
                            };
                        }
                    } catch (e) {
                        console.warn("Alpine Headroom Plugin: Invalid options expression", e);
                    }
                }

                // Initialize classes using the helper functions
                addClasses(el, options.classes.initial);
                addClasses(el, options.classes.pinned);
                addClasses(el, options.classes.top);

                const updateClasses = (currentScrollY: number) => {
                    const scrollDelta = currentScrollY - lastScrollY;
                    const isScrollingDown = scrollDelta > 0;
                    const isScrollingUp = scrollDelta < 0;

                    // Cache DOM measurements
                    const documentHeight = Math.max(
                        document.body.scrollHeight,
                        document.body.offsetHeight,
                        document.documentElement.clientHeight,
                        document.documentElement.scrollHeight,
                        document.documentElement.offsetHeight
                    );
                    const viewportHeight = window.innerHeight;

                    // Top / Not Top state
                    const shouldBeAtTop = currentScrollY <= options.offset;
                    if (shouldBeAtTop !== isAtTop) {
                        isAtTop = shouldBeAtTop;
                        if (isAtTop) {
                            removeClasses(el, options.classes.notTop);
                            addClasses(el, options.classes.top);
                        } else {
                            removeClasses(el, options.classes.top);
                            addClasses(el, options.classes.notTop);
                        }
                    }

                    // Bottom / Not Bottom state
                    const shouldBeAtBottom = viewportHeight + currentScrollY >= documentHeight - 1; // -1 for rounding
                    if (shouldBeAtBottom !== isAtBottom) {
                        isAtBottom = shouldBeAtBottom;
                        if (isAtBottom) {
                            removeClasses(el, options.classes.notBottom);
                            addClasses(el, options.classes.bottom);
                        } else {
                            removeClasses(el, options.classes.bottom);
                            addClasses(el, options.classes.notBottom);
                        }
                    }

                    // Pinned / Unpinned logic with tolerance
                    if (Math.abs(scrollDelta) > options.tolerance) {
                        if (isScrollingDown && isPinned && currentScrollY > options.offset) {
                            isPinned = false;
                            removeClasses(el, options.classes.pinned);
                            addClasses(el, options.classes.unpinned);
                        } else if (isScrollingUp && !isPinned) {
                            isPinned = true;
                            removeClasses(el, options.classes.unpinned);
                            addClasses(el, options.classes.pinned);
                        }
                    }

                    lastScrollY = currentScrollY;
                };

                const handleScroll = () => {
                    if (!ticking) {
                        requestAnimationFrame(() => {
                            const currentScrollY = Math.max(0, window.scrollY);
                            updateClasses(currentScrollY);
                            ticking = false;
                        });
                        ticking = true;
                    }
                };

                // Throttled resize handler for responsive behavior
                let resizeTimeout: number;
                const handleResize = () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = window.setTimeout(() => {
                        handleScroll();
                    }, 150);
                };

                // Initial state
                updateClasses(window.scrollY);

                // Event listeners with passive option for better performance
                window.addEventListener("scroll", handleScroll, { passive: true });
                window.addEventListener("resize", handleResize, { passive: true });

                // Support for frozen state via modifier
                if (modifiers.includes('frozen')) {
                    addClasses(el, options.classes.frozen);
                }

                cleanup(() => {
                    window.removeEventListener("scroll", handleScroll);
                    window.removeEventListener("resize", handleResize);
                    clearTimeout(resizeTimeout);

                    // Clean up all classes using the helper function
                    Object.values(options.classes).forEach(classString => {
                        removeClasses(el, classString);
                    });
                });
            }
        );
    });
}

export default Headroom;
