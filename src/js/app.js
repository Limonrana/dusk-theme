// Header Scroll transparent Handler
const headerContainer = document.querySelector('[data-section-type="header"]');
if (headerContainer) {
    window.addEventListener('scroll', function(event) {
        if (pageYOffset > 20) {
            onHeaderHandler(true);
        } else if (pageYOffset < 15) {
            onHeaderHandler(false);
        }
    });

    // Header Hover Handler
    headerContainer.addEventListener('mouseenter', function (event) {
        if (window.pageYOffset < 20) {
            onHeaderHandler(true);
        }
    });
    headerContainer.addEventListener('mouseleave', function (event) {
        if (window.pageYOffset < 20) {
            onHeaderHandler(false);
        }
    });

    // Common Methods
    function onHeaderHandler (isTransparentAdd = false) {
        const header = headerContainer.querySelector('header');
        if (isTransparentAdd) {
            if (header.classList.contains('ws--header-transparent')) {
                header.classList.remove('ws--header-transparent');
                header.setAttribute('header-transparent-remove', 'true');
            }
        } else {
            if (header.hasAttribute('header-transparent-remove')) {
                header.classList.add('ws--header-transparent');
                header.setAttribute('header-transparent-remove', 'false');
            }
        }
    }
}

// Localization Selector handle Event Listener
document.querySelectorAll('[aria-controls="dropdown-popover"]').forEach(function(el, target) {
    el.setAttribute("aria-controls", el.getAttribute("aria-controls") + "-" + target);
    el.nextElementSibling.setAttribute("id", el.getAttribute("aria-controls"));
    el.addEventListener('click', function(e) {
        let popover = el.nextElementSibling;
        if (popover.getAttribute('aria-hidden') === 'true') {
            popover.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        } else {
            popover.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    });

    // Outside click listener
    document.addEventListener('click', function(e) {
        if (e.target !== el) {
            let popover = el.nextElementSibling;
            if (popover.getAttribute('aria-hidden') === 'false' && !popover.contains(e.target)) {
                popover.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            }
        }
    });
});

// Search box handle Event Listener
document.querySelector('[data-action="ws-toggle-search"]').addEventListener('click', function(e) {
    e.preventDefault();
    let search = document.getElementById(e.target.getAttribute("data-action"));
    let overLay = document.querySelector('.ws--page-overlay');
    if (search.getAttribute('aria-hidden') === 'true') {
        search.setAttribute('aria-hidden', 'false');
        // Focus on the search input
        search.querySelector("input[type='search']").focus();
    } else {
        search.setAttribute('aria-hidden', 'true');
    }

    // Toggle the overlay
    overLay.classList.toggle('is-ws-visible');

    // add click listener for disable search
    document.querySelector('[data-action="ws-close-search"]').addEventListener('click', function(e) {
        e.preventDefault();
        search.setAttribute('aria-hidden', 'true');
        // Toggle the overlay
        overLay.classList.toggle('is-ws-visible');
    });
});

// Main Dropdown Menu And Mega Menu handle Event Listener
document.querySelectorAll('[aria-hasdropdown="true"]').forEach(function(el) {
    // Dropdown Menu handle mouse hover Event Listener
    el.addEventListener('mouseenter', function(e) {
        // Set the dropdown menu to visible
        el.classList.add('is-ws-visible');
        let dropdown = el.children[1];
        dropdown.setAttribute('aria-hidden', 'false');
    });


    // Dropdown Menu handle mouse leave Event Listener
    el.addEventListener('mouseleave', function(e) {
        closeDropdown();
    });
});

// Close Dropdown Menu
function closeDropdown() {
    document.querySelectorAll('[aria-hasdropdown="true"]').forEach(function(el) {
        if (el.classList.contains('is-ws-visible')) {
            el.classList.remove('is-ws-visible');
            el.children[1].setAttribute('aria-hidden', 'true');
        }
    });
}

// Sidebar Menu handle Event Listener
// document.querySelectorAll('[data-action="open-drawer"]').forEach(function(el) {
//     // Get the drawer element
//     let drawer = document.querySelector('[data-section-type="' + el.dataset.drawerId + '"]');
//     let overLay = document.querySelector('.ws--page-overlay');
//     // Sidebar Menu handle click Event Listener
//     el.addEventListener('click', function(e) {
//         // Toggle the drawer attribute
//         drawer.setAttribute('aria-hidden', 'false');
//         // Toggle the overlay
//         overLay.classList.toggle('is-ws-visible');
        
//         // Close the drawer
//         drawer.querySelector('[data-action="close-drawer"]').addEventListener('click', function(e) {
//             drawer.setAttribute('aria-hidden', 'true');
//             // Toggle the overlay
//             overLay.classList.toggle('is-ws-visible');
//         });
//     });

//     // outside click listener
//     document.addEventListener('click', function(e) {
//         if (e.target !== el) {
//             if (drawer.getAttribute('aria-hidden') === 'false' && !drawer.contains(e.target)) {
//                 // Toggle the drawer attribute
//                 drawer.setAttribute('aria-hidden', 'true');
//                 // Toggle the overlay
//                 overLay.classList.toggle('is-ws-visible');
//             }
//         }
//     });
// });

// Lazy Load Images using Intersection Observer
(function () {
	var observer = new IntersectionObserver(onIntersect);
    var observerBg = new IntersectionObserver(onIntersectBg);

    // Get all the images
	document.querySelectorAll("[data-lazy]").forEach((img) => {
		observer.observe(img);
	});

    // Get all bg images
    document.querySelectorAll("[data-lazy-bg]").forEach((img) => {
		observerBg.observe(img);
	});

    // Intersection Observer Callback function For BG Images
    function onIntersectBg(entries) {
        entries.forEach((entry) => {
			if (entry.target.getAttribute("data-processed") || !entry.isIntersecting) {
                return true;
            }
            entry.target.classList.add('ws--image-lazy-loading');
            if (entry.target.getAttribute("data-src")) {
                entry.target.style.backgroundImage = "url(" + entry.target.getAttribute("data-src") + ")";
            }
			entry.target.setAttribute("data-processed", true);
            entry.target.classList.remove("ws--image-lazy-load");
            entry.target.classList.remove("ws--image-lazy-loading");
            entry.target.classList.add("ws--image-lazy-loaded");
		});
    }

    // Intersection Observer Callback function For Images
	function onIntersect(entries) {
		entries.forEach((entry) => {
			if (entry.target.getAttribute("data-processed") || !entry.isIntersecting) {
                return true;
            }
            entry.target.classList.add('ws--image-lazy-loading');
            entry.target.setAttribute("src", entry.target.getAttribute("data-src"));
			entry.target.setAttribute("data-processed", true);
            entry.target.classList.remove("ws--image-lazy-load");
            entry.target.classList.remove("ws--image-lazy-loading");
            entry.target.classList.add("ws--image-lazy-loaded");
		});
	}
})();


// // Recall the flickity slider when the window is resized
// window.addEventListener('resize', function(e) {
//     document.querySelectorAll('[data-flickity]').forEach(function(el) {
//         // el.flickity('resize');
//     });
// });

// Recall the flickity slider when the display mode is changed for an element
document.querySelectorAll('.ws--nav-tab-link').forEach(function(el) {
    el.addEventListener('click', function(e) {
        // Get the paranet element
        let parent = e.target.parentElement;
        let tab = parent.getAttribute('data-bs-target');
        let tabContent = document.querySelector(tab);
        // Get the flickity slider
        let slider = tabContent.querySelector('[data-flickity]');
        setHeightFlikityItems();
        // Resize the slider
        Flickity.data(slider).reloadCells();
        // tabContent.flickity('resize');
        // document.querySelectorAll('[data-flickity]').forEach(function(element) {
        //     Flickity.data(element).resize();
        //     console.log(element);
        // });
    });
});

// var tabEl = document.querySelector('button[data-bs-toggle="tab"]');
// tabEl.addEventListener('hide.bs.tab', function (event) {
//     let newActive = event.relatedTarget;
//     console.log(newActive);
//     let newTab = newActive.getAttribute('data-bs-target');
//     let newTabContent = document.querySelector(newTab);
//     let slider = newTabContent.querySelector('[data-flickity]');
//     Flickity.data(slider).resize();
// })



// bind event listener for the product carousel
document.addEventListener('DOMContentLoaded', setHeightFlikityItems);


// Set the height of the product carousel
function setHeightFlikityItems() {
    let flickity = document.querySelectorAll('[data-flickity]');
    flickity.forEach(function(el) {
        let getSilders = el.children;
        // Find the slider element max height and set it to the slider
        for (let i = 0; i < getSilders.length; i++) {
            getSilders[i].style.height = getSilders[i].offsetHeight + 'px';
        }
    });
}

// Shop The Look Main Carousel Handler
document.addEventListener('DOMContentLoaded', function() {
    let shopTheLook = document.querySelector('[data-flickity="shop-the-look"]');
    if (shopTheLook) {
        let flkty = new Flickity(shopTheLook, {
            cellAlign: 'left',
            contain: true,
            wrapAround: true,
            prevNextButtons: true,
            pageDots: false,
            draggable: false,
            selectedAttraction: 0.025,
            friction: 0.6,
            imagesLoaded: true,
            lazyLoad: true,
            lazyLoad: 1
        });
    }

    // SHop The Look Carousel Custom
    document.querySelectorAll('[data-slide]').forEach(function(el) {
        el.addEventListener('click', function(e) {
            let slide = el.getAttribute('data-slide');
            let targetId = el.getAttribute('data-slider-target');
            let sliders = document.querySelector(targetId);
            let childrens = sliders.children[0].children;
            let activeChild = null;
            for (let i = 0; i < childrens.length; i++) {
                if (childrens[i].classList.contains('active')) {
                    activeChild = childrens[i];
                }
            }
            let activeIndex = Array.prototype.indexOf.call(childrens, activeChild);
            // remove active class from the current active child
            activeChild?.classList.remove('active');
            // check slide is next or previous
            if (slide == 'next') {
                // add active class to the next child
                if (activeIndex < childrens.length - 1) {
                    childrens[activeIndex + 1].classList.add('active');
                } else {
                    childrens[0].classList.add('active');
                }
            } else {
                // add active class to the previous child
                if (activeIndex > 0) {
                    childrens[activeIndex - 1].classList.add('active');
                } else {
                    childrens[childrens.length - 1].classList.add('active');
                }
            }
        });
    });
}());

// Change URL and class of the shop-lookslider-dot
function changeUrlNDotClass(e) {
    let index = e.target.getAttribute('data-product-item-dot');
    let productItem = document.querySelector('[data-product-item="' + index + '"]');
    let productItemUrl = productItem.getAttribute('data-product-item-url');
    // get the parent element
    parent = e.target.parentElement.previousElementSibling;
    // set the url of the parent element
    parent.setAttribute('href', productItemUrl);
    // change the class of the shop-lookslider-dot
    removeDotActiveClass(index);
}

// Shop The Look Carousel Product Item Sliders dot class change
function removeDotActiveClass(indexDot) {
    // change the shop-lookslider-dot
    document.querySelectorAll('[data-product-dot-index]').forEach(function(el) {
        if (el.classList.contains('is-active')) {
            el.classList.remove('is-active');
        } else {
            let index = el.getAttribute('data-product-dot-index') - 1;
            let sliderIndex = el.getAttribute('data-silder-index');
            if (indexDot == `${sliderIndex}-${index}`) {
                el.classList.add('is-active');
            }
        }
    });
}

// Shop The Look Carousel Product Item Sliders Url Change
document.querySelectorAll('[data-product-item-dot]').forEach(function(el) {
    el.addEventListener('click', changeUrlNDotClass);
});

document.querySelectorAll('[data-product-dot-index]').forEach(function(el) {
    el.addEventListener('click', function(e) {
        let index = e.target.getAttribute('data-product-dot-index') - 1;
        let sliderIndex = e.target.getAttribute('data-silder-index');
        let productIndicarorDot = document.querySelector('[data-product-item-dot="'+ sliderIndex + '-' + index +'"]');
        productIndicarorDot.click();
    });
});



// ========================================================
// ======================  LOGIN PAGE ====================
// ========================================================
document.addEventListener('DOMContentLoaded', function() {
    let loginForm = document.querySelectorAll('[data-section-id="login"]');
    if (loginForm) {
        loginForm.forEach(function(el) {
            let login = el.querySelector('#customer_login');
            let recover = el.querySelector('#recover_customer_password');
            // get data action from toogle
            let dataAction = el.querySelectorAll('[data-action="toggle-recover-form"]');
            // toogle the recover form and login form
            dataAction.forEach(function(el) {
                el.addEventListener('click', function(e) {
                    // set the default css
                    login.style.transform = 'matrix(1, 0, 0, 1, 0, 20)';
                    recover.style.transform = 'matrix(1, 0, 0, 1, 0, 20)';
                    // check if the login form style is block or none
                    if (login.style.display == 'block') {
                        // set the login form style
                        login.style.display = 'none';
                        login.style.opacity = '0';
                        login.style.visibility = 'hidden';
                        // set the recover form style
                        recover.style.display = 'block';
                        recover.style.opacity = '1';
                        recover.style.visibility = 'visible';
                    } else {
                        // set the login form style
                        login.style.display = 'block';
                        login.style.opacity = '1';
                        login.style.visibility = 'visible';
                        // set the recover form style
                        recover.style.display = 'none';
                        recover.style.opacity = '0';
                        recover.style.visibility = 'hidden';
                    }
                });
            });
        });
    }
});