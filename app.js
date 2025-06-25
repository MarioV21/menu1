// Declare variables globally so they are accessible to all functions,
// but they will be initialized inside DOMContentLoaded.
let prev;
let next;
let image;
let items;    // NodeList of .images .item elements
let contents; // NodeList of .content .item elements

let rotate = 0;
let active = 0; // The index of the currently active slide
let countItem;
let rotateAdd;
let autoNextInterval; // To hold the setInterval ID for auto-sliding

// --- Function Definitions ---
// These functions are defined globally so they can be accessed by event listeners
function nextSlider(){
    // Increment active index, loop back to 0 if at the end of items
    active = active + 1;
    if (active >= countItem) {
        active = 0;
    }
    rotate = rotate + rotateAdd; // Update the rotation value for the main image container
    show(); // Call show to update the display
}

function prevSlider(){
    // Decrement active index, loop back to the last item if at the beginning
    active = active - 1;
    if (active < 0) {
        active = countItem - 1;
    }
    rotate = rotate - rotateAdd; // Update the rotation value for the main image container
    show(); // Call show to update the display
}

function show(){
    // Apply the calculated rotation to the main .images container via CSS custom property
    image.style.setProperty("--rotate", rotate + 'deg');

    // Update 'active' class for content items (right side product description)
    contents.forEach((content, key) => {
        if(key === active){ // Use strict equality for comparison
            content.classList.add('active');
        }else{
            content.classList.remove('active');
        }
    });

    // Update 'active' class for image items (left side photo with buttons)
    // This is crucial for controlling the visibility of buttons below the active photo
    items.forEach((item, key) => {
        if(key === active){ // Use strict equality for comparison
            item.classList.add('active');
        }else{
            item.classList.remove('active');
        }
    });
}

// --- DOMContentLoaded Listener ---
// All code that interacts with HTML elements should be inside this listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM-dependent variables only after the HTML document is fully loaded
    prev = document.getElementById('prev');
    next = document.getElementById('next');
    image = document.querySelector('.images');
    items = document.querySelectorAll('.images .item'); // Select all image items
    contents = document.querySelectorAll('.content .item'); // Select all content items

    // Basic check to ensure all necessary DOM elements were found
    if (!prev || !next || !image || items.length === 0 || contents.length === 0) {
        console.error("Critical DOM elements not found. Please check your HTML structure and JavaScript selectors.");
        return; // Stop script execution if elements are missing
    }

    countItem = items.length;      // Get the total number of image items
    rotateAdd = 360 / countItem;   // Calculate rotation degree for each item

    // Assign event listeners to the previous and next buttons
    prev.onclick = prevSlider;
    next.onclick = nextSlider;

    // Start the auto-sliding interval (change 3000ms for speed if desired)
    autoNextInterval = setInterval(nextSlider, 3000);

    // --- Device detection logic for the AR button ---
    const arButtons = document.querySelectorAll('.ar-button'); // Select all 'View in AR' buttons

    // This regular expression checks for common strings found in mobile and tablet user agents.
    // It helps determine if the device is likely capable of AR.
    const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobileOrTablet) {
        // If the device is detected as desktop (not mobile/tablet), hide all AR buttons
        arButtons.forEach(button => {
            button.style.display = 'none'; // Set display to 'none' to hide completely
        });
    }

    // --- Adjust AR button hrefs for direct AR launch on mobile ---

    arButtons.forEach(button => {
        const usdzUrl = button.getAttribute('href');      // e.g. "ar_models/Sushi.usdz"
        const glbUrl = button.getAttribute('data-gltf');  // e.g. "ar_models/Sushi.glb"

        // Convert relative URLs to absolute URLs to avoid issues
        const fullUsdzUrl = new URL(usdzUrl, window.location.href).href;
        const fullGlbUrl = new URL(glbUrl, window.location.href).href;

        function isiOS() {
            return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        }

        function isAndroid() {
            return /Android/.test(navigator.userAgent);
        }

        if (isiOS()) {
            // iOS: use direct .usdz link with rel="ar" to open AR Quick Look
            button.setAttribute('href', fullUsdzUrl);
            button.setAttribute('rel', 'ar');
            button.setAttribute('target', '_blank');
        } else if (isAndroid()) {
            // Android: use intent URL for Google Scene Viewer AR
            const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(fullGlbUrl)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(fullGlbUrl)};end;`;
            button.setAttribute('href', intentUrl);
            button.removeAttribute('rel');
            button.setAttribute('target', '_blank');
        } else {
            // Fallback for desktop or unsupported devices — just open glb file
            button.setAttribute('href', fullGlbUrl);
            button.removeAttribute('rel');
            button.setAttribute('target', '_blank');
        }
    });

    // --- Initial Setup ---
    // Call the show() function once to set up the first slide
    // This ensures the initial image and its associated buttons/content are displayed correctly
    show();
});
