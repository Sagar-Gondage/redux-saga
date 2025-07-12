import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * A custom hook for implementing infinite scroll functionality
 * 
 * @param {Object} options - Configuration options
 * @param {Function} options.onLoadMore - Function to call when more content should be loaded
 * @param {boolean} options.isLoading - Whether content is currently loading
 * @param {boolean} options.hasMore - Whether there is more content to load
 * @param {number} options.threshold - Distance from bottom (in px) to trigger loading more (default: 150)
 * @param {number} options.throttleMs - Throttle delay in ms (default: 100)
 * @param {boolean} options.debug - Enable debug logging and info (default: false)
 * @param {boolean} options.disableInitialCheck - Disable auto-loading when content doesn't fill container (default: false)
 * @param {boolean} options.useWindowScroll - Use window scroll instead of element scroll (default: false)
 * @returns {Object} - Object containing ref to attach to scrollable element and debug info
 */
const useInfiniteScroll = ({
  onLoadMore,
  isLoading,
  hasMore,
  threshold = 150,
  throttleMs = 100,
  debug = false,
  disableInitialCheck = false,
  useWindowScroll = false
}) => {
  const scrollRef = useRef(null);
  const [scrollInfo, setScrollInfo] = useState({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    distanceToBottom: 0
  });

  // Function to handle scroll events with improved detection
  const handleScroll = useCallback(() => {
    if (useWindowScroll) {
      // Window scroll calculations
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      
      if (debug) {
        console.log("[useInfiniteScroll] Window scroll detected:", { 
          scrollTop, 
          scrollHeight, 
          clientHeight,
          distanceToBottom,
          threshold
        });
      }
      
      // Update scroll info state for debugging
      setScrollInfo({
        scrollTop,
        scrollHeight,
        clientHeight,
        distanceToBottom
      });
      
      // Call onLoadMore when user is near bottom and not currently loading
      if (distanceToBottom < threshold && !isLoading && hasMore) {
        if (debug) console.log("[useInfiniteScroll] Near bottom, loading more content");
        onLoadMore();
      }
    } else {
      // Element scroll calculations (original behavior)
      const scrollElement = scrollRef.current;
      if (!scrollElement) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      
      if (debug) {
        console.log("[useInfiniteScroll] Scroll detected:", { 
          scrollTop, 
          scrollHeight, 
          clientHeight,
          distanceToBottom,
          threshold
        });
      }
      
      // Update scroll info state for debugging
      setScrollInfo({
        scrollTop,
        scrollHeight,
        clientHeight,
        distanceToBottom
      });
      
      // Call onLoadMore when user is near bottom and not currently loading
      if (distanceToBottom < threshold && !isLoading && hasMore) {
        if (debug) console.log("[useInfiniteScroll] Near bottom, loading more content");
        onLoadMore();
      }
    }
  }, [onLoadMore, isLoading, hasMore, threshold, debug, useWindowScroll]);

  // Set up scroll event listener with throttling
  useEffect(() => {
    const scrollElement = useWindowScroll ? window : scrollRef.current;
    if (!scrollElement) return;
    
    if (debug) console.log("[useInfiniteScroll] Setting up scroll listeners on:", useWindowScroll ? "window" : scrollElement);
    
    // Use throttled scroll handler for better performance
    let scrollTimeout;
    const throttledScrollHandler = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null;
        }, throttleMs);
      }
    };
    
    // Initial check of scroll position
    handleScroll();
    
    // Add event listeners
    scrollElement.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Also listen for window resize as it can change the container size
    window.addEventListener('resize', throttledScrollHandler, { passive: true });
    
    // Clean up event listeners
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollElement.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', throttledScrollHandler);
    };
  }, [handleScroll, throttleMs, debug, useWindowScroll]);
  
  // Check if initial content doesn't fill the container
  useEffect(() => {
    // Skip this check if disableInitialCheck is true
    if (disableInitialCheck) {
      if (debug) console.log("[useInfiniteScroll] Initial content check disabled");
      return;
    }
    
    const checkIfContentFillsContainer = setTimeout(() => {
      if (useWindowScroll) {
        // Window scroll check
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        
        if (debug) {
          console.log("[useInfiniteScroll] Checking if content fills window:", {
            scrollHeight,
            clientHeight,
            fills: scrollHeight <= clientHeight
          });
        }
        
        // If content doesn't fill the container, load more
        if (scrollHeight <= clientHeight && !isLoading && hasMore) {
          if (debug) console.log("[useInfiniteScroll] Content doesn't fill window, loading more");
          onLoadMore();
        }
      } else {
        // Element scroll check (original behavior)
        const scrollElement = scrollRef.current;
        if (!scrollElement || isLoading || !hasMore) return;
        
        const { scrollHeight, clientHeight } = scrollElement;
        
        if (debug) {
          console.log("[useInfiniteScroll] Checking if content fills container:", {
            scrollHeight,
            clientHeight,
            fills: scrollHeight <= clientHeight
          });
        }
        
        // If content doesn't fill the container, load more
        if (scrollHeight <= clientHeight) {
          if (debug) console.log("[useInfiniteScroll] Content doesn't fill container, loading more");
          onLoadMore();
        }
      }
    }, 10);
    
    return () => clearTimeout(checkIfContentFillsContainer);
  }, [onLoadMore, isLoading, hasMore, debug, disableInitialCheck, useWindowScroll]);

  return { 
    scrollRef,
    scrollInfo
  };
};

export default useInfiniteScroll;