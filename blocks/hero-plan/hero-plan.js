export default function decorate(block) {
  const picture = block.querySelector(':scope > div:first-child picture');
  if (picture) {
    // Content-driven image: use picture from first row as background
    const imageDiv = document.createElement('div');
    imageDiv.className = 'hero-plan-bg';
    imageDiv.append(picture);
    block.prepend(imageDiv);
    // Remove the now-empty first content row
    const emptyRow = imageDiv.nextElementSibling;
    if (emptyRow && !emptyRow.textContent.trim()) emptyRow.remove();
  } else {
    // No picture in content: create background image div
    const imageDiv = document.createElement('div');
    imageDiv.className = 'hero-plan-bg';
    const img = document.createElement('img');
    img.src = 'https://www.ab.bluecross.ca/images/hero-banners/blue-choice_xl.webp';
    img.alt = 'Couple laughing outdoors';
    img.loading = 'eager';
    imageDiv.append(img);
    block.prepend(imageDiv);
  }
}
