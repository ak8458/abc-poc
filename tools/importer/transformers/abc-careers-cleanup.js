/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Alberta Blue Cross Careers cleanup.
 * Selectors from captured DOM of careers.ab.bluecross.ca/benefits.php
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove mobile nav panel that may interfere with parsing
    WebImporter.DOMUtils.remove(element, ['.abc-mobile-nav']);
  }
  if (hookName === H.after) {
    // Remove non-authorable content: header, footer, iframes, noscript, link
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'iframe',
      'noscript',
      'link',
    ]);
  }
}
