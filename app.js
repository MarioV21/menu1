document.addEventListener('DOMContentLoaded', () => {
  let prev = document.getElementById('prev');
  let next = document.getElementById('next');
  let image = document.querySelector('.images');
  let items = document.querySelectorAll('.images .item');
  let contents = document.querySelectorAll('.content .item');
  let rotate = 0;
  let active = 0;
  let countItem = items.length;
  let rotateAdd = 360 / countItem;

  function show() {
    image.style.setProperty("--rotate", rotate + 'deg');
    contents.forEach((c, i) => c.classList.toggle('active', i === active));
    items.forEach((it, i) => it.classList.toggle('active', i === active));
  }

  function nextSlider() {
    active = (active + 1) % countItem;
    rotate += rotateAdd;
    show();
  }

  function prevSlider() {
    active = (active - 1 + countItem) % countItem;
    rotate -= rotateAdd;
    show();
  }

  prev.onclick = prevSlider;
  next.onclick = nextSlider;
  setInterval(nextSlider, 3000);
  show();

  // AR Button Setup
  const arButtons = document.querySelectorAll('.ar-button');
  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  arButtons.forEach(button => {
    const usdz = button.getAttribute('href');
    const glb = button.getAttribute('data-gltf');

    const fullUSDZ = new URL(usdz, window.location.href).href;
    const fullGLB = new URL(glb, window.location.href).href;

    if (isiOS) {
      button.setAttribute('href', fullUSDZ);
      button.setAttribute('rel', 'ar');
      button.setAttribute('target', '_blank');
    } else if (isAndroid) {
      const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(fullGLB)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(fullGLB)};end;`;
      button.setAttribute('href', sceneViewerUrl);
      button.setAttribute('target', '_blank');
      button.removeAttribute('rel');
    } else {
      // Desktop or unsupported — hide or disable
      button.style.display = 'none';
    }
  });
});
