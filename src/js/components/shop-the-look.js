class ShopTheLook extends HTMLElement {
    constructor() {
        super();
        this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    }
}