import React, { useState, useRef, useEffect, ReactNode } from 'react';
// Removed: import 'bootstrap/dist/css/bootstrap.min.css'; // This import causes the resolution error in this environment

// Define the props for the Tooltip component
interface TooltipProps {
  children: React.ReactElement; // The element that acts as the trigger (now children)
  tooltipContent: ReactNode; // The content of the tooltip (new prop)
  triggerEvent?: 'hover' | 'click'; // How the tooltip is activated (default: 'hover')
  position?: 'top' | 'bottom' | 'left' | 'right'; // Where the tooltip appears relative to the trigger (default: 'top')
  duration?: number; // How long the tooltip stays visible in milliseconds (optional, default: no auto-hide)
  showArrow?: boolean; // Whether to display an arrow pointing to the trigger (default: false)
}

const Tooltip: React.FC<TooltipProps> = ({
  children, // Now the trigger
  tooltipContent, // New prop for tooltip content
  triggerEvent = 'hover',
  position = 'top',
  duration,
  showArrow = false,
}) => {
  const [isVisible, setIsVisible] = useState(false); // State to control tooltip visibility
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({}); // State for tooltip positioning
  const triggerRef = useRef<HTMLElement>(null); // Ref for the trigger element
  const tooltipRef = useRef<HTMLDivElement>(null); // Ref for the tooltip element
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null); // Ref for the auto-hide timer

  // Function to show the tooltip
  const showTooltip = () => {
    setIsVisible(true);
    // Clear any existing hide timer when showing the tooltip
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
  };

  // Function to hide the tooltip
  const hideTooltip = () => {
    // If a duration is set, start a timer to hide the tooltip
    if (duration) {
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, duration);
    } else {
      // If no duration, hide immediately
      setIsVisible(false);
    }
  };

  // Event handlers based on triggerEvent prop
  const handleMouseEnter = () => {
    if (triggerEvent === 'hover') {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (triggerEvent === 'hover') {
      hideTooltip();
    }
  };

  const handleClick = () => {
    if (triggerEvent === 'click') {
      setIsVisible((prev) => !prev); // Toggle visibility on click
      // If clicking to hide, clear any active timer
      if (isVisible && hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      } else if (!isVisible && duration) {
        // If clicking to show and duration is set, start a hide timer
        hideTimerRef.current = setTimeout(() => {
          setIsVisible(false);
        }, duration);
      }
    }
  };

  // Effect to calculate tooltip position when visibility or refs change
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      // Calculate position based on the 'position' prop
      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - (showArrow ? 8 : 4); // Add space for arrow
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = triggerRect.bottom + (showArrow ? 8 : 4); // Add space for arrow
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.left - tooltipRect.width - (showArrow ? 8 : 4); // Add space for arrow
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2); // Corrected for right position
          left = triggerRect.right + (showArrow ? 8 : 4); // Add space for arrow
          break;
        default:
          break;
      }

      // Ensure tooltip stays within viewport (basic adjustment)
      top = Math.max(0, top);
      left = Math.max(0, left);

      setTooltipStyle({
        position: 'fixed', // Bootstrap's 'fixed' class doesn't allow custom top/left easily
        top: `${top}px`, // Removed window.scrollY
        left: `${left}px`, // Removed window.scrollX
        zIndex: 1080, // Bootstrap's tooltip z-index is 1080
        opacity: isVisible ? 1 : 0, // Control opacity for fade effect
        transition: 'opacity 0.3s ease-in-out', // Manual transition for opacity
        pointerEvents: isVisible ? 'auto' : 'none', // Control pointer events
      });
    }

    // Clean up the timer when the component unmounts or visibility changes
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [isVisible, position, showArrow]); // Recalculate if these props change

  // Clone the children element to attach refs and event handlers
  const triggerWithProps = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    // Ensure the trigger is focusable for accessibility if it's not naturally interactive
    tabIndex: 0,
    // IMPORTANT: Pass the original children of the trigger element
    children: children.props.children,
  });

  // Custom CSS for the arrow as Bootstrap doesn't have direct utility for triangles
  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    width: 0,
        height: 0,
    borderStyle: 'solid',
    borderWidth: '8px',
    borderColor: 'transparent',
  };

  let arrowPositionStyle: React.CSSProperties = {};

  switch (position) {
    case 'top':
      arrowPositionStyle = {
        bottom: '-7px',
        left: '50%',
        transform: 'translateX(-50%)',
        borderTopColor: '#4a4a4a', // Dark gray for arrow
      };
      break;
    case 'bottom':
      arrowPositionStyle = {
        top: '-7px',
        left: '50%',
        transform: 'translateX(-50%)',
        borderBottomColor: '#4a4a4a', // Dark gray for arrow
      };
      break;
    case 'left':
      arrowPositionStyle = {
        right: '-7px',
        top: '50%',
        transform: 'translateY(-50%)',
        borderLeftColor: '#4a4a4a', // Dark gray for arrow
      };
      break;
    case 'right':
      arrowPositionStyle = {
        left: '-7px',
        top: '50%',
        transform: 'translateY(-50%)',
        borderRightColor: '#4a4a4a', // Dark gray for arrow
      };
      break;
    default:
      break;
  }

  return (
    <>
      {triggerWithProps}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            p-2 rounded shadow bg-dark text-white small
          `}
          style={tooltipStyle}
          // Keep tooltip visible if mouse is over it, and duration is set
          onMouseEnter={() => {
            if (duration && hideTimerRef.current) {
              clearTimeout(hideTimerRef.current);
            }
          }}
          onMouseLeave={() => {
            if (duration) {
              hideTooltip();
            }
          }}
        >
          {tooltipContent} {/* Render the new tooltipContent prop */}
          {showArrow && (
            <div style={{ ...arrowStyle, ...arrowPositionStyle }}></div>
          )}
        </div>
      )}
    </>
  );
};

export default Tooltip;