  /*
  * Global Common JS
  *
  */
  class QuantityInput extends HTMLElement {
      constructor() {
        super();
        this.input = this.querySelector('input');
        this.changeEvent = new Event('change', { bubbles: true })
    
        this.querySelectorAll('button').forEach(
          (button) => button.addEventListener('click', this.onButtonClick.bind(this))
        );
      }
    
      onButtonClick(event) {
        event.preventDefault();
        const previousValue = this.input.value;
    
        event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
        if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
      }
  }
  
  customElements.define('quantity-input', QuantityInput);

  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
      )
    );
  }

  const trapFocusHandlers = {};

  function trapFocus(container, elementToFocus = container) {
    var elements = getFocusableElements(container);
    var first = elements[0];
    var last = elements[elements.length - 1];

    removeTrapFocus();

    trapFocusHandlers.focusin = (event) => {
      if (
        event.target !== container &&
        event.target !== last &&
        event.target !== first
      )
        return;

      document.addEventListener('keydown', trapFocusHandlers.keydown);
    };

    trapFocusHandlers.focusout = function() {
      document.removeEventListener('keydown', trapFocusHandlers.keydown);
    };

    trapFocusHandlers.keydown = function(event) {
      if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
      // On the last focusable element and tab forward, focus the first element.
      if (event.target === last && !event.shiftKey) {
        event.preventDefault();
        first.focus();
      }

      //  On the first focusable element and tab backward, focus the last element.
      if (
        (event.target === container || event.target === first) &&
        event.shiftKey
      ) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('focusout', trapFocusHandlers.focusout);
    document.addEventListener('focusin', trapFocusHandlers.focusin);

    elementToFocus.focus();
  }

  function removeTrapFocus(elementToFocus = null) {
    document.removeEventListener('focusin', trapFocusHandlers.focusin);
    document.removeEventListener('focusout', trapFocusHandlers.focusout);
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  
    if (elementToFocus) elementToFocus.focus();
  }
  
  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
  
  function fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
    };
  }
  
  /*
   * Shopify Common JS
   *
   */
  if ((typeof window.Shopify) == 'undefined') {
      window.Shopify = {};
    }
    
    Shopify.bind = function(fn, scope) {
      return function() {
        return fn.apply(scope, arguments);
      }
    };
    
    Shopify.setSelectorByValue = function(selector, value) {
      for (var i = 0, count = selector.options.length; i < count; i++) {
        var option = selector.options[i];
        if (value == option.value || value == option.innerHTML) {
          selector.selectedIndex = i;
          return i;
        }
      }
    };
    
    Shopify.addListener = function(target, eventName, callback) {
      target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on'+eventName, callback);
    };
    
    Shopify.postLink = function(path, options) {
      options = options || {};
      var method = options['method'] || 'post';
      var params = options['parameters'] || {};
    
      var form = document.createElement("form");
      form.setAttribute("method", method);
      form.setAttribute("action", path);
    
      for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
      }
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    };
    
    Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
      this.countryEl         = document.getElementById(country_domid);
      this.provinceEl        = document.getElementById(province_domid);
      this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);
    
      Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));
    
      this.initCountry();
      this.initProvince();
    };
    
    Shopify.CountryProvinceSelector.prototype = {
      initCountry: function() {
        var value = this.countryEl.getAttribute('data-default');
        Shopify.setSelectorByValue(this.countryEl, value);
        this.countryHandler();
      },
    
      initProvince: function() {
        var value = this.provinceEl.getAttribute('data-default');
        if (value && this.provinceEl.options.length > 0) {
          Shopify.setSelectorByValue(this.provinceEl, value);
        }
      },
    
      countryHandler: function(e) {
        var opt       = this.countryEl.options[this.countryEl.selectedIndex];
        var raw       = opt.getAttribute('data-provinces');
        var provinces = JSON.parse(raw);
    
        this.clearOptions(this.provinceEl);
        if (provinces && provinces.length == 0) {
          this.provinceContainer.style.display = 'none';
        } else {
          for (var i = 0; i < provinces.length; i++) {
            var opt = document.createElement('option');
            opt.value = provinces[i][0];
            opt.innerHTML = provinces[i][1];
            this.provinceEl.appendChild(opt);
          }
    
          this.provinceContainer.style.display = "";
        }
      },
    
      clearOptions: function(selector) {
        while (selector.firstChild) {
          selector.removeChild(selector.firstChild);
        }
      },
    
      setOptions: function(selector, values) {
        for (var i = 0, count = values.length; i < values.length; i++) {
          var opt = document.createElement('option');
          opt.value = values[i];
          opt.innerHTML = values[i];
          selector.appendChild(opt);
        }
      }
    };


   /*
    * Variant Selects And Radio Button JS
    */
    class VariantSelects extends HTMLElement {
      constructor() {
        super();
        this.addEventListener('change', this.onVariantChange);
      }
    
      onVariantChange() {
        this.updateOptions();
        this.updateMasterId();
        this.toggleAddButton(true, '', false);
        // this.updatePickupAvailability();
        // this.removeErrorMessage();
    
        if (!this.currentVariant) {
          this.toggleAddButton(true, '', true);
          this.setUnavailable();
        } else {
          // this.updateMedia();
          this.updateURL();
          this.updateVariantInput();
          this.renderProductInfo();
          // this.updateShareUrl();
        }
      }
    
      updateOptions() {
        this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
      }
    
      updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
          return !variant.options.map((option, index) => {
            return this.options[index] === option;
          }).includes(false);
        });
      }
    
      updateMedia() {
        if (!this.currentVariant) return;
        if (!this.currentVariant.featured_media) return;
    
        const mediaGallery = document.getElementById(`MediaGallery-${this.dataset.section}`);
        mediaGallery.setActiveMedia(`${this.dataset.section}-${this.currentVariant.featured_media.id}`, true);
    
        const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
        if (!modalContent) return;
        const newMediaModal = modalContent.querySelector( `[data-media-id="${this.currentVariant.featured_media.id}"]`);
        modalContent.prepend(newMediaModal);
      }
    
      updateURL() {
        if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
        window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
      }
    
      updateShareUrl() {
        const shareButton = document.getElementById(`Share-${this.dataset.section}`);
        if (!shareButton || !shareButton.updateUrl) return;
        shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
      }
    
      updateVariantInput() {
        const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`);
        productForms.forEach((productForm) => {
          const input = productForm.querySelector('input[name="id"]');
          input.value = this.currentVariant.id;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
    
      updatePickupAvailability() {
        const pickUpAvailability = document.querySelector('pickup-availability');
        if (!pickUpAvailability) return;
    
        if (this.currentVariant && this.currentVariant.available) {
          pickUpAvailability.fetchAvailability(this.currentVariant.id);
        } else {
          pickUpAvailability.removeAttribute('available');
          pickUpAvailability.innerHTML = '';
        }
      }
    
      removeErrorMessage() {
        const section = this.closest('section');
        if (!section) return;
    
        const productForm = section.querySelector('product-form');
        if (productForm) productForm.handleErrorMessage();
      }
    
      renderProductInfo() {
        fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
          .then((response) => response.text())
          .then((responseText) => {
            const html = new DOMParser().parseFromString(responseText, 'text/html')
            const destination = document.getElementById(`price-${this.dataset.section}`);
            const source = html.getElementById(`price-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);
            if (source && destination) destination.innerHTML = source.innerHTML;
    
            const price = document.getElementById(`price-${this.dataset.section}`);
            if (price) price.classList.remove('visibility-hidden');
            this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
          });
      }
    
      toggleAddButton(disable = true, text, modifyClass = true) {
        const productForm = document.getElementById(`product-form-${this.dataset.section}`);
        if (!productForm) return;
        const addButton = productForm.querySelector('[name="add"]');
        const addButtonText = productForm.querySelector('[name="add"] > span');
        if (!addButton) return;
    
        if (disable) {
          addButton.setAttribute('disabled', 'disabled');
          if (text) addButtonText.textContent = text;
        } else {
          addButton.removeAttribute('disabled');
          addButtonText.textContent = window.variantStrings.addToCart;
        }
    
        if (!modifyClass) return;
      }
    
      setUnavailable() {
        const button = document.getElementById(`product-form-${this.dataset.section}`);
        const addButton = button.querySelector('[name="add"]');
        const addButtonText = button.querySelector('[name="add"] > span');
        const price = document.getElementById(`price-${this.dataset.section}`);
        if (!addButton) return;
        addButtonText.textContent = window.variantStrings.unavailable;
        if (price) price.classList.add('visibility-hidden');
      }
    
      getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
        return this.variantData;
      }
    }
    
    customElements.define('variant-selects', VariantSelects);
    
    class VariantRadios extends VariantSelects {
      constructor() {
        super();
      }
    
      updateOptions() {
        const fieldsets = Array.from(this.querySelectorAll('fieldset'));
        this.options = fieldsets.map((fieldset) => {
          return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
        });
      }
    }
    
    customElements.define('variant-radios', VariantRadios);


    class MenuDrawer extends HTMLElement {
      constructor() {
        super();

        this.closeMenuDrawerBtn = this.querySelector('[data-action="close-drawer"]');
        this.toggleMainCollapsibles = this.querySelectorAll('[data-action="toggle-main-collapsible"]');
        this.toggleSubCollapsibles = this.querySelectorAll('[data-action="toggle-sub-collapsible"]');

        let self = this;
        this.toggleMainCollapsibles.forEach((el) => {
          el.addEventListener('click', function () {
            self.closeMainMenu(el);
            if (el.getAttribute('aria-expanded') === 'false') {
              el.setAttribute('aria-expanded', 'true');
            } else {
              el.setAttribute('aria-expanded', 'false');
            }
          });
        });

        this.toggleSubCollapsibles.forEach((el) => {
          el.addEventListener('click', function () {
            self.closeSubMenu(el);
            if (el.getAttribute('aria-expanded') === 'false') {
              el.setAttribute('aria-expanded', 'true');
            } else {
              el.setAttribute('aria-expanded', 'false');
            }
          });
        });

        this.closeMenuDrawerBtn.addEventListener('click', this.closeMenuDrawer.bind(this));
      }
    
      closeMenuDrawer(event) {
        if (event === undefined) return;
        const overLay = document.querySelector('.ws--page-overlay');
        if (this.getAttribute('aria-hidden') === 'false') {
          this.setAttribute('aria-hidden', 'true');
          overLay.classList.toggle('is-ws-visible');
          document.body.style.overflow = "auto";
        }
      }

      closeMainMenu(currentEl) {
        this.toggleMainCollapsibles.forEach((el) => {
          if (currentEl == el) return;
          if (el.getAttribute('aria-expanded') === 'true') {
            el.setAttribute('aria-expanded', 'false');
          }
        });
      }

      closeSubMenu(currentEl) {
        this.toggleSubCollapsibles.forEach((el) => {
          if (currentEl == el) return;
          if (el.getAttribute('aria-expanded') === 'true') {
            el.setAttribute('aria-expanded', 'false');
          }
        });
      }
    }
    
    customElements.define('menu-drawer', MenuDrawer);
    
    class HeaderDrawer extends HTMLElement {
      constructor() {
        super();
        this.headerDrawerButton = this;
        this.menuDrawer = document.querySelector('menu-drawer');
        this.drawerOpenBtn = this.querySelector('[data-action="open"]');
        this.drawerOpenBtn.addEventListener('click', this.openMenuDrawer.bind(this));
      }

      /*
      * set event listener for DOM Loaded
      */
      static setListeners() {
        const onOutSideClick = (event) => {
            const overLay = document.querySelector('.ws--page-overlay');
            const getSections = HeaderDrawer.getSections();
            const drawerOpenBtn = getSections.drawerOpenBtn;
            const menuDrawer = getSections.menuDrawer;
            if (drawerOpenBtn === event.target && menuDrawer.getAttribute('aria-hidden') === 'false') return;
            if (!menuDrawer.contains(event.target)) {
                if (overLay.classList.contains('is-ws-visible')) {
                  menuDrawer.setAttribute('aria-hidden', 'true');
                  overLay.classList.toggle('is-ws-visible');
                  document.body.style.overflow = "auto";
                }
            }
        }
        window.addEventListener('click', onOutSideClick);
      }

      static getSections () {
        return {
          menuDrawer: document.querySelector('menu-drawer'),
          drawerOpenBtn: document.querySelector('header-drawer').querySelector('[data-action="open"]')
        }
      }
    
      openMenuDrawer() {
        const overLay = document.querySelector('.ws--page-overlay');
        if (this.menuDrawer.getAttribute('aria-hidden') === 'true') {
          document.body.style.overflow = "hidden";
          overLay.classList.toggle('is-ws-visible');
          this.menuDrawer.setAttribute('aria-hidden', 'false');
        }
      }
    }
    
    customElements.define('header-drawer', HeaderDrawer);
    HeaderDrawer.setListeners();
  