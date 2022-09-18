/*
 * ===========================================================
 * MediaGallery Class For Carusel product images
 * ===========================================================
 */

class MediaGallery extends HTMLElement {
    constructor() {
        super();
        // stacked grid
        const mediaListStacked = this.querySelector('[data-media-list="product-stacked"]');
        if (mediaListStacked) {
            this.mediaItems = mediaListStacked.querySelectorAll('[data-media-item]');
            const mediaThumbStacked = this.querySelector('[data-thumbnail-list="product-stacked"]');
            this.mediaThumbItems = mediaThumbStacked.querySelectorAll('[data-thumbnail-item]');
            this.setListeners();

            const mediaHrefs = mediaThumbStacked.querySelectorAll('[data-media-href]');
            mediaHrefs.forEach((element) => {
                element.addEventListener('click', this.onSubmitHandler.bind(this));
            });
        }

        // carousel class tracking
        this.mediaWrapper = this.querySelector('[data-media-wrapper]');
        this.isCarousel = true;
        if (this.mediaWrapper && !this.mediaWrapper.classList.contains('ws--carousel-media')) {
            this.isCarousel = false;
        }

        // carousel grid
        const mediaListCarousel = this.querySelector('[data-media-list="product-carousel"]');
        if (mediaListCarousel) {
            this.mediaItems = mediaListCarousel.querySelectorAll('[data-media-item]');
            const mediaThumbCarousel = this.querySelector('[data-thumbnail-list="product-carousel"]');
            this.mediaThumbItems = mediaThumbCarousel.querySelectorAll('[data-thumbnail-item]');
            this.mediaThumbItems.forEach((element) => {
                element.addEventListener('click', this.onClickHandler.bind(this));
            });
        }

        // Slider Dots
        this.mediaDotWrapper = this.querySelector('[data-media-dots]');
        this.mediaDotWrapper.addEventListener('click', this.onClickDotsHandler.bind(this));

        // Add Remove Class Via Window Resize
        this.reportWindowSizeLoad(window.innerWidth);
        window.addEventListener('resize', this.reportWindowSize.bind(this));
    }

    /*
     * set event listener for stacked grid
     */
    setListeners() {
        const onScrollWindow = (event) => {
            this.scrollMediaHandler(event);
        }
        window.addEventListener('scroll', onScrollWindow);
    }

    reportWindowSizeLoad(width) {
        let container = this.closest('.container');
        if (width < 1141) {
            if (container) {
                container.classList.add('ws--container-mobile');
            }
            if (this.isCarousel === false) {
                this.mediaWrapper.classList.add('ws--carousel-media')
            }
        } else {
            if (container && container.classList.contains('ws--container-mobile')) {
                container.classList.remove('ws--container-mobile');
            }

            if (this.isCarousel === false) {
                if (this.mediaWrapper.classList.contains('ws--carousel-media')) {
                    this.mediaWrapper.classList.remove('ws--carousel-media');
                }
            }
        }
    }


    /*
     * reportWindowSizer for product page
     */
    reportWindowSize(event) {
        let width = event.target.innerWidth;
        this.reportWindowSizeLoad(width);
    }

    /*
     * On click event handler method
     * @Param Object event
     */
    onClickHandler(event) {
        event.preventDefault();
        const target = event.target;

        const removeActiveThumb = () => {
            this.mediaThumbItems.forEach((li) => {
                li.classList.remove("active");
            });
        };

        const removeActiveMedia = () => {
            this.mediaItems.forEach((item) => {
                item.classList.remove("active");
            });
        };

        const carouselHandler = (element) => {
            if (!element.classList.contains('active')) {
                // set active slider
                let media = null;
                this.mediaItems.forEach((item) => {
                    if (`#${item.getAttribute('id')}` === element.getAttribute('href')) {
                        media = item;
                    }
                });
                // set active class
                if (media) {
                    // remove prev thumb
                    removeActiveThumb();
                    // set new thumb
                    element.parentElement.classList.add('active');
                    // remove prev media
                    removeActiveMedia();
                    // set new media
                    media.classList.add('active');
                }
            }
        };

        if (target.hasAttribute('data-media-href')) {
            carouselHandler(target);
        } else {
            carouselHandler(target.parentElement);
        }
    }

    /*
     * On click dots event handler method
     * @Param Object event
     */
    onClickDotsHandler(event) {
        event.preventDefault();
        const target = event.target;
        let mediaDots = this.mediaDotWrapper.querySelectorAll('[data-media-dot]');

        // Remove active media
        const removeActiveMedia = () => {
            this.mediaItems.forEach((element) => {
                if (element.classList.contains('active')) {
                    element.classList.remove('active');
                }
            });
        }
        // click handle for dot button
        if (target.hasAttribute('data-media-dot'))  {
            removeActiveMedia();
            mediaDots.forEach((element) => {
                if (element.classList.contains('is-selected')) {
                    element.classList.remove('is-selected')
                }

                if (target.dataset.mediaDot === element.dataset.mediaDot) {
                    element.classList.add('is-selected');
                }
            });
            const targetElement = this.querySelector(`#${target.dataset.mediaDot}`);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        }
        // click handle for next and prev button
        if (target.hasAttribute('data-media-dot-next') || target.hasAttribute('data-media-dot-prev')) {
            let nextCurrent = '';
            if (target.hasAttribute('data-media-dot-next')) {
                mediaDots.forEach((element, index) => {
                    if (nextCurrent === '') {
                        if (element.classList.contains('is-selected')) {
                            if (index !== mediaDots.length - 1) {
                                element.classList.remove('is-selected');
                                nextCurrent = element.nextElementSibling.dataset.mediaDot;
                                element.nextElementSibling.classList.add('is-selected');
                            }
                        }
                    }
                });
            } else {
                mediaDots.forEach((element, index) => {
                    if (nextCurrent === '') {
                        if (element.classList.contains('is-selected')) {
                            if (index !== 0) {
                                element.classList.remove('is-selected');
                                nextCurrent = element.previousElementSibling.dataset.mediaDot;
                                element.previousElementSibling.classList.add('is-selected');
                            }
                        }
                    }
                });
            }

            if (nextCurrent !== '') {
                removeActiveMedia();

                const targetElement = this.querySelector(`#${nextCurrent}`);
                if (targetElement) {
                    targetElement.classList.add('active');
                }
            }
        }
    }
    /*
     * On submit event handler method
     * @Param Object event
     */
    onSubmitHandler(event) {
        event.preventDefault();
        const target = event.target;

        const scrollToImage = (hash) => {
            let destination = document.querySelector(hash);
            // Scroll to the destination using scrollIntoView method
            destination.scrollIntoView({
                behavior: 'smooth'
            });
        }

        if (target.hasAttribute('data-media-href')) {
            scrollToImage(target.getAttribute('href'));
        } else {
            const parent = target.parentElement;
            scrollToImage(parent.getAttribute('href'));
        }
    }

    /*
     * On scroll event handler method
     * @Param Object event
     */
    scrollMediaHandler(event) {
        var current = "";
        this.mediaItems.forEach((mediaItem) => {
            const mediaItemOffSetTop = mediaItem.offsetTop;
            if (pageYOffset >= mediaItemOffSetTop - 60) {
                current = mediaItem.getAttribute("id");
            }
        });

        const removeActive = () => {
            this.mediaThumbItems.forEach((li) => {
                li.classList.remove("active");
            });
        };

        this.mediaThumbItems.forEach((li) => {
            let thumbnailItem = li.dataset.thumbnailItem;
            if (thumbnailItem === current) {
                removeActive();
                li.classList.add("active");
            }
        });
    }
}
customElements.define('media-gallery', MediaGallery);