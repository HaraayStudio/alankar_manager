import React, { useState, useRef, useEffect } from "react";
import styles from "./SmartDescriptionInput.module.scss";

const SmartDescriptionInput = ({
  value,
  onChange,
  order,
  placeholder = "Enter description or select from suggestions",
  className = ""
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Generate description patterns based on order specifications
  const generateDescriptionPatterns = () => {
    const patterns = [];
    const { orderType, media, lamination, mounting, framing, installation, width, height, qty } = order;

    // Helper function to clean up undefined/empty values
    const cleanValue = (val) => val && val !== "" ? val : null;

    // Get clean values
    const cleanOrderType = cleanValue(orderType);
    const cleanMedia = cleanValue(media);
    const cleanLamination = cleanValue(lamination);
    const cleanMounting = cleanValue(mounting);
    const cleanFraming = cleanValue(framing);
    const cleanInstallation = cleanValue(installation);
    const dimensions = width && height ? `${width}' x ${height}'` : null;
    const quantity = qty > 1 ? `${qty} pieces` : "1 piece";

    // Only generate patterns if we have at least orderType
    if (!cleanOrderType) {
      return ["Please select order type and specifications to see suggestions"];
    }

    // Pattern 1: Basic order type with dimensions
    if (dimensions) {
      patterns.push(`${cleanOrderType} ${dimensions} - ${quantity}`);
    } else {
      patterns.push(`${cleanOrderType} - ${quantity}`);
    }

    // Pattern 2: Order type with media
    if (cleanMedia) {
      if (dimensions) {
        patterns.push(`${cleanOrderType} on ${cleanMedia} ${dimensions} - ${quantity}`);
      } else {
        patterns.push(`${cleanOrderType} on ${cleanMedia} - ${quantity}`);
      }
    }

    // Pattern 3: Full specification (most detailed)
    const specs = [cleanMedia, cleanLamination, cleanMounting, cleanFraming, cleanInstallation].filter(Boolean);
    if (specs.length > 0) {
      const specString = specs.join(", ");
      if (dimensions) {
        patterns.push(`${cleanOrderType} ${dimensions} with ${specString} - ${quantity}`);
      } else {
        patterns.push(`${cleanOrderType} with ${specString} - ${quantity}`);
      }
    }

    // Pattern 4: Professional format
    if (cleanMedia && specs.length > 1) {
      const processSpecs = specs.slice(1).join(", "); // Exclude media from process specs
      if (dimensions) {
        patterns.push(`${quantity} of ${cleanOrderType} ${dimensions} printed on ${cleanMedia}, finished with ${processSpecs}`);
      } else {
        patterns.push(`${quantity} of ${cleanOrderType} printed on ${cleanMedia}, finished with ${processSpecs}`);
      }
    }

    // Pattern 5: Simple with finishing
    const finishingSpecs = [cleanLamination, cleanMounting, cleanFraming].filter(Boolean);
    if (finishingSpecs.length > 0) {
      const finishString = finishingSpecs.join(" + ");
      if (dimensions) {
        patterns.push(`${cleanOrderType} ${dimensions}, ${finishString} - ${quantity}`);
      } else {
        patterns.push(`${cleanOrderType}, ${finishString} - ${quantity}`);
      }
    }

    // Pattern 6: Installation focused
    if (cleanInstallation) {
      if (dimensions) {
        patterns.push(`${cleanOrderType} ${dimensions} including ${cleanInstallation} - ${quantity}`);
      } else {
        patterns.push(`${cleanOrderType} including ${cleanInstallation} - ${quantity}`);
      }
    }

    // Pattern 7: Material focused
    if (cleanMedia) {
      const materialSpecs = [cleanLamination, cleanMounting].filter(Boolean);
      if (materialSpecs.length > 0) {
        const materialString = materialSpecs.join(" and ");
        if (dimensions) {
          patterns.push(`${dimensions} ${cleanOrderType} - ${cleanMedia} with ${materialString} - ${quantity}`);
        } else {
          patterns.push(`${cleanOrderType} - ${cleanMedia} with ${materialString} - ${quantity}`);
        }
      }
    }

    // Remove duplicates and return unique patterns
    const uniquePatterns = [...new Set(patterns)];
    
    // Limit to 8 suggestions to avoid overwhelming the user
    return uniquePatterns.slice(0, 8);
  };

  // Update suggestions when order changes
  useEffect(() => {
    const newSuggestions = generateDescriptionPatterns();
    setSuggestions(newSuggestions);
  }, [order.orderType, order.media, order.lamination, order.mounting, order.framing, order.installation, order.width, order.height, order.qty]);

  // Position dropdown properly in table context
  const positionDropdown = () => {
    if (inputRef.current && dropdownRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;
      
      // Always use fixed positioning in table context to avoid clipping
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${inputRect.bottom + 4}px`;
      dropdown.style.left = `${inputRect.left}px`;
      dropdown.style.width = `${Math.max(inputRect.width, 350)}px`;
      dropdown.style.maxWidth = '450px';
      dropdown.style.zIndex = '10000';
      dropdown.style.visibility = 'visible';
      dropdown.style.opacity = '1';
    }
  };

  // Position dropdown when it opens
  useEffect(() => {
    if (isDropdownOpen) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(positionDropdown, 10);
      
      // Reposition on scroll/resize
      const handleReposition = () => {
        if (isDropdownOpen) {
          positionDropdown();
        }
      };
      
      window.addEventListener('scroll', handleReposition, true);
      window.addEventListener('resize', handleReposition);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('scroll', handleReposition, true);
        window.removeEventListener('resize', handleReposition);
      };
    }
  }, [isDropdownOpen]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Prevent dropdown from closing when clicking inside it
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        return;
      }
      
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      // Use setTimeout to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Prevent event bubbling
    event?.preventDefault?.();
    event?.stopPropagation?.();
    
    onChange(suggestion);
    setIsDropdownOpen(false);
    
    // Focus input after a small delay to ensure dropdown is closed
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleDropdownToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  // Filter suggestions based on current input
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className={`${styles.smartDescriptionContainer} ${className}`}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.descriptionInput}
        />
        <button
          type="button"
          className={styles.dropdownToggle}
          onClick={handleDropdownToggle}
          onMouseDown={(e) => e.preventDefault()}
          title="Show description suggestions"
          aria-expanded={isDropdownOpen}
        >
          <span className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.dropdownArrowUp : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {isDropdownOpen && (
        <div ref={dropdownRef} className={styles.suggestionsDropdown}>
          <div className={styles.suggestionsHeader}>
            <span>💡 Suggested Descriptions</span>
            <button
              type="button"
              className={styles.closeDropdown}
              onClick={() => setIsDropdownOpen(false)}
            >
              ✕
            </button>
          </div>
          
          <div className={styles.suggestionsList}>
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseDown={(e) => e.preventDefault()}
                  role="option"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSuggestionClick(suggestion);
                    }
                  }}
                >
                  <span className={styles.suggestionText}>{suggestion}</span>
                </div>
              ))
            ) : (
              <div className={styles.noSuggestions}>
                {suggestions.length === 0 
                  ? "Select order specifications to see suggestions"
                  : "No suggestions match your input"
                }
              </div>
            )}
          </div>

          {order.orderType && (
            <div className={styles.suggestionsFooter}>
              {/* <small>💡 Tip: Select more specifications for better suggestions</small> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartDescriptionInput;