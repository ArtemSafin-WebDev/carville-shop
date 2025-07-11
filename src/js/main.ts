import "virtual:svg-icons-register";
import "../scss/style.scss";
import newItems from "./newItems";
import promo from "./promo";
import sales from "./sales";
import header from "./header";

document.addEventListener("DOMContentLoaded", () => {
  header();
  newItems();
  promo();
  sales();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
