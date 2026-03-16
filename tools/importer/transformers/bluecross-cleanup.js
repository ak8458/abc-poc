/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Alberta Blue Cross cleanup.
 * Selectors from captured DOM of https://www.ab.bluecross.ca/plans/personal/individual/blue-choice-plan.php
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove modals that may interfere with block parsing
    // Found: <div class="modal fade" id="surveyModal"> (line 59)
    // Found: <div class="modal fade" id="exampleModal"> (line 3016) - contact benefits consultant modal
    WebImporter.DOMUtils.remove(element, [
      '.modal',
      '#surveyModal',
      '#exampleModal',
      '#formSubmitted',
    ]);

    // Remove informational banner (travel advisory / COVID notice)
    // Found: <div class="white-box card-white informational-banner"> (line 965)
    WebImporter.DOMUtils.remove(element, ['.informational-banner']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    // Found: <header> (line 2), contains navigation, logo, search
    // Found: <footer> (line 3141), contains links, newsletter, land acknowledgement
    // Found: <div class="breadcrumbs"> (line 1318)
    // Found: <div class="ds-styles"> (line 3140) - wraps footer
    // Found: <div class="stoplight-white"> (line 2921) - feedback widget
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '.ds-styles',
      '.breadcrumbs',
      '.stoplight-white',
      '.stoplight',
      '#thankYouBox',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove tracking pixel images (Twitter, analytics, etc.)
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('t.co/') || src.includes('analytics.twitter.com')
        || src.includes('rlcdn.com') || src.includes('adsct')
        || src.includes('pixel') || src.includes('beacon')) {
        img.remove();
      }
    });

    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
    });
  }
}
