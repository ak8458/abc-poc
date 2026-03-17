/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Alberta Blue Cross cleanup.
 * Selectors from captured DOM of menopause-guide.php.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove info banner and cookie/tracking elements (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '.info-banner-covid',
    ]);
  }
  if (hookName === H.after) {
    // Remove non-authorable content (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.retiree-faq-breadcrumbs',
      '.stoplight-white',
      '#back2Top',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
