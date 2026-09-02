/**
 * Smooth Scroll Navigation System
 * Features:
 * - Smooth scrolling to sections
 * - Active link highlighting based on scroll position
 * - Mobile menu toggle
 * - Keyboard navigation support
 * - Accessibility features (ARIA labels, focus management)
 */

class SmoothScrollNavigation {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.menuToggle = document.getElementById('menuToggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.sections = document.querySelectorAll('section[id]');
    
    this.isMobileMenuOpen = false;
    this.isScrolling = false;
    
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateActiveLink();
  }

  /**
   * Attach all event listeners
   */
  attachEventListeners() {
    // Mobile menu toggle
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Smooth scroll on nav link click
    this.navLinks.forEach((link) => {
      link.addEventListener('click', (e) => this.handleNavLinkClick(e, link));
    });

    // Close mobile menu on link click
    this.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (this.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => this.handleScroll());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

    // Close mobile menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        this.isMobileMenuOpen &&
        !this.navbar.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * Handle navigation link clicks with smooth scrolling
   */
  handleNavLinkClick(e, link) {
    const href = link.getAttribute('href');
    
    // Check if it's an anchor link to a section on this page
    if (href.startsWith('#') && !href.includes('/')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        this.smoothScrollToElement(targetSection, link);
      }
    }
  }

  /**
   * Smooth scroll to a specific element
   * Uses native smooth scroll with fallback
   */
  smoothScrollToElement(element, navLink = null) {
    this.isScrolling = true;

    // Check if browser supports smooth scroll behavior
    const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;

    if (supportsSmoothScroll) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Reset scrolling flag after animation completes
      setTimeout(() => {
        this.isScrolling = false;
        this.updateActiveLink(navLink);
      }, 1000);
    } else {
      // Fallback for older browsers: manual smooth scroll
      this.polyfillSmoothScroll(element, () => {
        this.isScrolling = false;
        this.updateActiveLink(navLink);
      });
    }
  }

  /**
   * Polyfill for smooth scroll in older browsers
   */
  polyfillSmoothScroll(element, callback) {
    const targetPosition = element.offsetTop - 80; // Account for navbar height
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000; // milliseconds
    let start = null;

    const ease = (t) => {
      // easeInOutCubic easing function
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease_progress = ease(progress);

      window.scrollTo(0, startPosition + distance * ease_progress);

      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        callback();
      }
    };

    requestAnimationFrame(animation);
  }

  /**
   * Handle scroll events to update active nav link
   */
  handleScroll() {
    if (this.isScrolling) return; // Don't update while programmatically scrolling

    // Add scrolled class to navbar for shadow effect
    if (window.scrollY > 10) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }

    this.updateActiveLink();
  }

  /**
   * Update active navigation link based on scroll position
   */
  updateActiveLink(manualNavLink = null) {
    if (manualNavLink) {
      this.setActiveLink(manualNavLink);
      return;
    }

    // Find current section based on scroll position
    let currentSection = null;
    const scrollPosition = window.scrollY + 100; // Offset for navbar

    this.sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) {
        currentSection = section;
      }
    });

    if (currentSection) {
      const sectionId = currentSection.getAttribute('id');
      const activeLink = document.querySelector(
        `.nav-link[href="#${sectionId}"]`
      );

      if (activeLink) {
        this.setActiveLink(activeLink);
      }
    }
  }

  /**
   * Set a nav link as active
   */
  setActiveLink(link) {
    // Remove active class from all links
    this.navLinks.forEach((l) => l.classList.remove('active'));
    
    // Add active class to the selected link
    link.classList.add('active');
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    this.isMobileMenuOpen = true;
    this.navMenu.classList.add('active');
    this.menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  /**
   * Keyboard navigation support
   * Arrow keys to navigate between sections
   * Enter to scroll to selected section
   */
  handleKeyboardNavigation(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      this.navigateToNextSection();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      this.navigateToPreviousSection();
    } else if (e.key === 'Enter' && document.activeElement.classList.contains('nav-link')) {
      // Allow Enter key to activate focused nav link
      document.activeElement.click();
    }
  }

  /**
   * Navigate to next section with arrow keys
   */
  navigateToNextSection() {
    let currentIndex = -1;
    const activeLink = document.querySelector('.nav-link.active');

    if (activeLink) {
      this.navLinks.forEach((link, index) => {
        if (link === activeLink) {
          currentIndex = index;
        }
      });
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < this.navLinks.length) {
      const nextLink = this.navLinks[nextIndex];
      nextLink.focus();
      this.handleNavLinkClick(new Event('click'), nextLink);
    }
  }

  /**
   * Navigate to previous section with arrow keys
   */
  navigateToPreviousSection() {
    let currentIndex = this.navLinks.length;
    const activeLink = document.querySelector('.nav-link.active');

    if (activeLink) {
      this.navLinks.forEach((link, index) => {
        if (link === activeLink) {
          currentIndex = index;
        }
      });
    }

    const previousIndex = currentIndex - 1;
    if (previousIndex >= 0) {
      const previousLink = this.navLinks[previousIndex];
      previousLink.focus();
      this.handleNavLinkClick(new Event('click'), previousLink);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SmoothScrollNavigation();
  });
} else {
  new SmoothScrollNavigation();
}
