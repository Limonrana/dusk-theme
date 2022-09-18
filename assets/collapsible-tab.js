/*
 * ===========================================================
 * collapsible tab for product page
 * ===========================================================
 */
document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
    summary.setAttribute('role', 'button');
    summary.setAttribute('aria-expanded', summary.parentNode.hasAttribute('open'));
  
    if(summary.nextElementSibling.getAttribute('id')) {
      summary.setAttribute('aria-controls', summary.nextElementSibling.id);
    }
  
    summary.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    // if (summary.closest('header-drawer')) return;
    // summary.parentElement.addEventListener('keyup', onKeyUpEscape);
});