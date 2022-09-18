class CartDrawer extends HTMLElement {
    constructor() {
      super();
      this.cartLink = document.querySelector('#cart-icon-bubble');
      this.cartLink2 = document.querySelector('#cart-icon-bubble-2');
      this.setHeaderCartIconAccessibility();
    }
  
    setHeaderCartIconAccessibility() {
        if (this.cartLink) {
            this.cartLink.setAttribute('data-bs-toggle', 'offcanvas');
            this.cartLink.setAttribute('data-bs-target', '#cartDrawerRight');
            this.cartLink.setAttribute('aria-controls', 'offcanvasRight');
            this.cartLink.addEventListener('click', (event) => {
                event.preventDefault();
                // this.open(cartLink);
            });
        }
        if (this.cartLink2) {
            this.cartLink2.setAttribute('data-bs-toggle', 'offcanvas');
            this.cartLink2.setAttribute('data-bs-target', '#cartDrawerRight');
            this.cartLink2.setAttribute('aria-controls', 'offcanvasRight');
            this.cartLink2.addEventListener('click', (event) => {
                event.preventDefault();
                // this.open(cartLink);
            });
        }
        //   cartLink.addEventListener('keydown', (event) => {
        //     if (event.code.toUpperCase() === 'SPACE') {
        //       event.preventDefault();
        //       this.open(cartLink);
        //     }
        //   });
    }
  
    open() {
        if (this.cartLink) {
            this.cartLink.click();
        } else {
            this.cartLink2.click();
        }
    }
  
    setSummaryAccessibility(cartDrawerNote) {
      cartDrawerNote.setAttribute('role', 'button');
      cartDrawerNote.setAttribute('aria-expanded', 'false');
  
      if(cartDrawerNote.nextElementSibling.getAttribute('id')) {
        cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
      }
  
      cartDrawerNote.addEventListener('click', (event) => {
        event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
      });
  
      cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
    }
  
    renderContents(parsedState) {
      this.querySelector('.drawer__inner').classList.contains('is-empty') && this.querySelector('.drawer__inner').classList.remove('is-empty');
      this.productId = parsedState.id;
      this.getSectionsToRender().forEach((section => {
        const sectionElement = section.selector ? document.querySelector(section.selector) : document.getElementById(section.id);
        if (parsedState.sections[section.id] !== null) {
          sectionElement.innerHTML =
            this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
        }
      }));

      if (this.cartLink2) {
        const cartDot = this.cartLink2.querySelector('.ws--header-cart-dot');
        if (!cartDot) {
          // Create an "span" node
          const node = document.createElement("span");
          node.classList.add('ws--header-cart-dot');
          this.cartLink2.appendChild(node);
        }
      }
  
      setTimeout(() => {
        this.open();
      });
    }
  
    getSectionInnerHTML(html, selector = '.shopify-section') {
      return new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(selector).innerHTML;
    }
  
    getSectionsToRender() {
      return [
        {
          id: 'cart-drawer',
          selector: '#CartDrawer'
        },
        {
          id: 'cart-icon-bubble'
        }
      ];
    }
  
    getSectionDOM(html, selector = '.shopify-section') {
      return new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(selector);
    }
  
    setActiveElement(element) {
      this.activeElement = element;
    }
  }
  
  customElements.define('cart-drawer', CartDrawer);
  
  class CartDrawerItems extends CartItems {
    getSectionsToRender() {
      return [
        {
          id: 'CartDrawer',
          section: 'cart-drawer',
          selector: '.drawer__inner'
        },
        {
          id: 'cart-icon-bubble',
          section: 'cart-icon-bubble',
          selector: '.shopify-section'
        }
      ];
    }
  }
  
  customElements.define('cart-drawer-items', CartDrawerItems);

/*=========================================
 * Cart Drawer Note Container Element Class
 =========================================*/
 if (!customElements.get('cart-drawer-note-container')) {
    customElements.define('cart-drawer-note-container', class CartDrawerNoteContainer extends HTMLElement {
      constructor() {
        super();
        this.noteButton = document.querySelector('[cart-drawer-note-container]');
        const saveNoteButton = this.querySelector('[cart-note-save]');
        this.noteButton.addEventListener('click', this.openContainer.bind(this));
        saveNoteButton.addEventListener('click', this.saveClose.bind(this));
        document.addEventListener("click", this.closeOutSide.bind(this));
      }

      openContainer() {
        if (this.getAttribute('aria-hidden') === 'true') {
            this.setAttribute('aria-hidden', 'false');
        }
      }

      saveClose() {
        if (this.getAttribute('aria-hidden') === 'false') {
            this.setAttribute('aria-hidden', 'true');
            this.noteButton.innerText = window.languages.cartEditNote;
            this.querySelector('span').innerText = window.languages.cartEditNote;
        }
      }

      closeOutSide (event) {
            let targetEl = event.target;
            let cartNote = this.querySelector('cart-note').querySelector('textarea');
            if (this.noteButton !== targetEl && targetEl !== this && targetEl !== cartNote) {
                // This is a click outside.
                if (this.getAttribute('aria-hidden') === 'false') {
                    this.setAttribute('aria-hidden', 'true');
                }
            }
      }
    });
  };
  