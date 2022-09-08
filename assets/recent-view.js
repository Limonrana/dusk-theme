/*
 * ===========================================================
 * RecentViewProducts Class For Carusel product grid
 * ===========================================================
 */

class RecentViewProducts extends HTMLElement {
    constructor() {
        super();
        this.sectionId = this.dataset.sectionId;
        this.sectionSettings = this.dataset.sectionSettings;
        this.productIds = localStorage.getItem('recentViewProducts');

        if (!this.productIds) {
            localStorage.setItem('recentViewProducts', JSON.stringify([7742469538008,7742475501784,7742475763928,7742469472472,7742469603544]));
        }
        window.addEventListener('DOMContentLoaded', this.onSubmitHandler.bind(this));
    }

    /*
     * set event listener for DOM Loaded
     */
    static setListeners() {
        const onRecentProductRender = (event) => {
            //
        }
        window.addEventListener('DOMContentLoaded', onRecentProductRender);
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
     * Create product ids query string methods
     */
    productIdsQueryString() {
        let query = '';
        let productIds = this.productIds ? JSON.parse(this.productIds) : null;
        if (productIds) {
            if (this.sectionSettings.productId !== null) {
                productIds = productIds.filter((item) => item !== this.sectionSettings.productId);
            }
            productIds.forEach((element, index) => {
                if (productIds.length === (index + 1)) {
                    query += ` id: ${element}`;
                } else {
                    if (index === 0) {
                        query += `id: ${element} OR`;
                    } else {
                        query += ` id: ${element} OR`;
                    }
                }
            });
        }
        return query;
    }

    /*
     * On submit event handler method
     * @Param Object event
     */
    onSubmitHandler(event) {
        event.preventDefault();
        const target = event.target;
        const searchParams = this.productIdsQueryString();
        let url = '';
        if (searchParams !== '') {
            url = `/search?section_id=${this.sectionId}&type=product&q=${searchParams}`;
            // url = `${window.location.pathname}/search?section_id=${this.sectionId}&type=product&q=${searchParams}`;
        }
        RecentViewProducts.renderSectionFromFetch(url);
        console.log(url);
    }

    /*
     * Render section content HTML from server
     * @Param String url
     */
    static renderSectionFromFetch(url) {
        fetch(url)
          .then(response => response.text())
          .then((responseText) => {
            const html = responseText;
            // RecentViewProducts.render(html);
            console.log(html);
          });
    }

    /*
     * Render html content
     * @Param String html
     */
    static render(html) {
        //
    }
}
customElements.define('recent-view-products', RecentViewProducts);
RecentViewProducts.setListeners();