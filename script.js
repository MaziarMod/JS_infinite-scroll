const imageContainer = document.querySelector("#image-container");
const loader = document.querySelector("#loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let intialLoad = true;
const INITIAL_COUNT = 5;
const COUNT = 30;

// Unsplash API
function generateApiUrl(count) {
  if (intialLoad) intialLoad = false;
  const apiKey = "Get API_KEY from Unsplash Website"; //'API_KEY';
  return `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
}

// Image loaded function -  check if all the images are loaded
function imageLoaded() {
  console.log("image loaded");
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    imagesLoaded = 0;
    console.log("ready = ", ready);
  }
}
// Helper Function to set attributes on DOM Elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create element for photos and link, and populate DOM
function displayPhotos() {
  totalImages = photosArray.length;
  console.log("total images = ", totalImages);

  photosArray.forEach((photo) => {
    const anchorElement = document.createElement("a");
    setAttributes(anchorElement, {
      href: photo.links.html,
      target: "_blank",
    });

    /* anchorElement.setAttribute('href', photo.links.html);
       anchorElement.setAttribute('target', '_blank'); 
    */

    const imageElement = document.createElement("img");
    setAttributes(imageElement, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    /*  imageElement.setAttribute('src', photo.urls.regular);
        imageElement.setAttribute('alt', photo.alt_description);
        imageElement.setAttribute('title', photo.alt_description); 
    */

    // Loading images
    imageElement.addEventListener("load", imageLoaded);

    // put all the new elements in imageContainer
    anchorElement.appendChild(imageElement);
    imageContainer.appendChild(anchorElement);
  });
}
// Get photos from Unsplash API
async function getPhotos() {
  try {
    const apiUrl = intialLoad
      ? generateApiUrl(INITIAL_COUNT)
      : generateApiUrl(COUNT);

    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    loader.hidden = false;
  } catch (e) {
    console.log("Getting Photos From API Failed", e);
  }
}

// Check if scrolling near bottom of the page, load more photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos();
