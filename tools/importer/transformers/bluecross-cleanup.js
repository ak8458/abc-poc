/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Alberta Blue Cross cleanup.
 * Selectors from captured DOM of https://www.ab.bluecross.ca/plans/personal/individual/blue-assured-plan.php
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove info banners and modals that may interfere with block parsing
    // Found in captured HTML: <div class="info-banner-covid bkg-abc-lt-blue">
    // Found in captured HTML: <div class="modal fade" id="exampleModal">
    // Found in captured HTML: <div class="stoplight-white"> (feedback widget)
    WebImporter.DOMUtils.remove(element, [
      '.info-banner-covid',
      '.modal',
      '.stoplight-white',
      '.g-recaptcha',
      'noscript',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content: header, footer, nav, breadcrumbs, search
    // Found in captured HTML: <header>, <footer>, .breadcrumbs, .new-menu, .ds-styles
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.ds-styles',
      '.breadcrumbs',
      '.new-menu',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-dismiss');
    });
  }
}
