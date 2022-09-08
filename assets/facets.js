/*
 * ===============================================
 * FacetSortForm Class For Sort Products
 * ===============================================
 */
class FacetSortForm extends HTMLElement {
    constructor() {
      super();
      this.debouncedOnSubmit = debounce((event) => {
        this.onSubmitHandler(event);
      }, 500);
  
      const facetForm = this.querySelector('form ul');
      facetForm.addEventListener('click', this.debouncedOnSubmit.bind(this));
    }
  
    /*
     * set event listener for url changes
     */
    static setListeners() {
      const onHistoryChange = (event) => {
        const searchParams = event.state ? event.state.searchParams : FacetSortForm.searchParamsInitial;
        if (searchParams === FacetSortForm.searchParamsPrev) return;
        FacetSortForm.renderPage(searchParams, null, false);
      }
      window.addEventListener('popstate', onHistoryChange);
    }

    /*
     * Create an new form with search parameters
     * @Param form
     */
    createSearchParams(form) {
        const formData = new FormData(form);
        return new URLSearchParams(formData).toString();
    }

    /*
     * Form submit methods
     * @Param String searchParams
     * @Param Object event
     */
    onSubmitForm(searchParams, event) {
        FacetSortForm.renderPage(searchParams, event);
    }

    /*
     * On submit event handler method
     * @Param Object event
     */
    onSubmitHandler(event) {
        event.preventDefault();
        const selectedData = event.target;
        const sortFilterForms = document.querySelectorAll('facet-sort-form form');
        document.getElementById('ProductGridContainer').classList.add('ws--section-loading');
        const forms = [];
        sortFilterForms.forEach((form) => {
            form.querySelector('#SortBy').value = selectedData.dataset.value;
            forms.push(this.createSearchParams(form));
        });
        this.onSubmitForm(forms.join('&'), event);
    }

    /*
     * Update URL methods
     * @Param String searchParams
     */
    static updateURLHash(searchParams) {
        history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
      }

    /*
     * Get the main shopify section templete methods
     */
    static getSections() {
        return [
          {
            section: document.getElementById('product-grid').dataset.id,
          }
        ]
    }

    /*
     * Render section content HTML from server
     * @Param String url
     * @Param Object event
     */
    static renderSectionFromFetch(url, event) {
        fetch(url)
          .then(response => response.text())
          .then((responseText) => {
            const html = responseText;
            FacetSortForm.filterData = [...FacetSortForm.filterData, { html, url }];
            FacetSortForm.renderFilters(html, event);
            FacetSortForm.renderProductGridContainer(html);
          });
    }
    
    /*
     * Render section content HTML from cache
     * @Param String filterDataUrl
     * @Param Object event
     */
    static renderSectionFromCache(filterDataUrl, event) {
        const html = FacetSortForm.filterData.find(filterDataUrl).html;
        FacetSortForm.renderFilters(html, event);
        FacetSortForm.renderProductGridContainer(html);
    }
    
    /*
     * Render filter content HTML
     * @Param String html
     */
    static renderFilters(html, event) {
        // const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
        // const facetSortElement = parsedHTML.querySelector('#FacetSortForm');
        const selectedLiButton = event.target;
        const allUl = document.querySelectorAll('#FacetSortForm li button');
        allUl.forEach((element) => {
            if (element.classList.contains('active')) {
                element.classList.remove('active');
            }
        });
        selectedLiButton.classList.add('active');
    }

    /*
     * Render product grid container content HTML
     * @Param String html
     */
    static renderProductGridContainer(html) {
        document.getElementById('ProductGridContainer').innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductGridContainer').innerHTML;
    }

    /*
     * Render page content methods
     * @Param String searchParams
     * @Param Object event
     * @Param Boolean updateURLHash
     */
    static renderPage(searchParams, event, updateURLHash = true) {
        FacetSortForm.searchParamsPrev = searchParams;
        const sections = FacetSortForm.getSections();
        sections.forEach((section) => {
          const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
          const filterDataUrl = element => element.url === url;
    
          FacetSortForm.filterData.some(filterDataUrl) ?
          FacetSortForm.renderSectionFromCache(filterDataUrl, event) :
          FacetSortForm.renderSectionFromFetch(url, event);
        });
    
        if (updateURLHash) FacetSortForm.updateURLHash(searchParams);
        document.getElementById('ProductGridContainer').classList.remove('ws--section-loading');
    }

}
FacetSortForm.filterData = [];
FacetSortForm.searchParamsInitial = window.location.search.slice(1);
FacetSortForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-sort-form', FacetSortForm);
FacetSortForm.setListeners();


/*
 * ===========================================================
 * FacetLayoutChange Class For Change the Products Grid Layout
 * ===========================================================
 */

class FacetLayoutChange extends HTMLElement {
    constructor() {
      super();
      this.debouncedOnSubmit = debounce((event) => {
        this.onSubmitHandler(event);
      }, 100);
  
      this.facetButtons = this.querySelectorAll('button');
      this.facetButtons.forEach((element) => {
        element.addEventListener('click', this.debouncedOnSubmit.bind(this))
      });
    }

    /*
     * set event listener for DOM Loaded
     */
    static setListeners() {
        const onGridChange = (event) => {
            const getGridType = localStorage.getItem('grid-type-value');
            if (!getGridType) return;
            if (FacetLayoutChange.facetButtons !== undefined) {
                FacetLayoutChange.facetButtons.forEach((element) => {
                    if (element.classList.contains('is-active')) {
                        element.classList.remove('is-active');
                    }
                    if (element.dataset.count === getGridType) {
                        element.classList.add('is-active');
                    }
                });
                let col = FacetLayoutChange.getGridValue(parseInt(getGridType));
                FacetLayoutChange.render(col);
            }
        }
        window.addEventListener('DOMContentLoaded', onGridChange);
    }

    /*
     * Get the grid values for product grid
     * @Param Number gridType
     */
    static getGridValue(gridType) {
        let col = { md: 4, lg: 3 };
        if (gridType === 2) {
            col.md = 6;
            col.lg = 6;
        } else if (gridType === 3) {
            col.md = 6;
            col.lg = 4;
        }
        return col;
    }

    /*
     * On submit event handler method
     * @Param Object event
     */
    onSubmitHandler(event) {
        event.preventDefault();
        const gridType = event.target.dataset.count;
        let col = FacetLayoutChange.getGridValue(parseInt(gridType));
        FacetLayoutChange.render(col);
        this.facetButtons.forEach((element) => {
            if (element.classList.contains('is-active')) {
                element.classList.remove('is-active');
            }
        });
        event.target.classList.add('is-active');
        localStorage.setItem('grid-type-value', gridType);
    }

    /*
     * Render class content methods
     * @Param Object col
     */
    static render(col) {
        const container = document.getElementById('ProductGridContainer').querySelector('#product-grid');
        const gridList3 = container.querySelectorAll('.col-lg-3');
        const gridList4 = container.querySelectorAll('.col-lg-4');
        const gridList6 = container.querySelectorAll('.col-lg-6');
        if (gridList3.length > 0) {
            FacetLayoutChange.renderCol(gridList3, col);
        } else if (gridList4.length > 0) {
            FacetLayoutChange.renderCol(gridList4, col);
        } else {
            FacetLayoutChange.renderCol(gridList6, col);
        }
    }

    /*
     * Render col class content methods
     * @Param Object col
     * @Param Array gridList
     */
    static renderCol(gridList, { lg, md }) {
        gridList.forEach((element) => {
            if (element.classList.contains('col-lg-3')) {
                element.classList.remove('col-lg-3');
                element.classList.remove('col-md-4');
            } else if (element.classList.contains('col-lg-4')) {
                element.classList.remove('col-lg-4');
                element.classList.remove('col-md-6');
            } else if (element.classList.contains('col-lg-6')) {
                element.classList.remove('col-lg-6');
                element.classList.remove('col-md-6');
            }
            element.classList.add(`col-lg-${lg}`);
            element.classList.add(`col-md-${md}`);
        });
    }
}
customElements.define('facet-layout-change', FacetLayoutChange);
FacetLayoutChange.setListeners();
  