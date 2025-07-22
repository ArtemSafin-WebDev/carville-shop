import "virtual:svg-icons-register";
import "../scss/style.scss";
import newItems from "./newItems";
import promo from "./promo";
import sales from "./sales";
import header from "./header";
import api from "./api";
import promoSlider from "./promoSlider";

document.addEventListener("DOMContentLoaded", () => {
  console.log("hello from main.js");
  header();
  newItems();
  promo();
  sales();
  promoSlider();
  api();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
