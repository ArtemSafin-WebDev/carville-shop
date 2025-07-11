import "virtual:svg-icons-register";
import "../scss/style.scss";
import newItems from "./newItems";
import promo from "./promo";

document.addEventListener("DOMContentLoaded", () => {
  newItems();
  promo();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
