
let prev, next, image, items, contents;
let rotate = 0;
let active = 0;
let countItem;
let rotateAdd;
let autoNextInterval;

function show() {
  image.style.setProperty("--rotate", rotate + "deg");
  contents.forEach((content, key) => {
    content.classList.toggle("active", key === active);
  });
  items.forEach((item, key) => {
    item.classList.toggle("active", key === active);
  });
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

document.addEventListener("DOMContentLoaded", () => {
  prev = document.getElementById("prev");
  next = document.getElementById("next");
  image = document.querySelector(".images");
  items = document.querySelectorAll(".images .item");
  contents = document.querySelectorAll(".content .item");

  countItem = items.length;
  rotateAdd = 360 / countItem;

  prev.onclick = prevSlider;
  next.onclick = nextSlider;

  autoNextInterval = setInterval(nextSlider, 3000);
  show();
});
