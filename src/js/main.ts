import "virtual:svg-icons-register";
import "../scss/style.scss";
import newItems from "./newItems";
import promo from "./promo";
import sales from "./sales";
import header from "./header";
import productCard from "./productCard";
import finder from "./finder";

document.addEventListener("DOMContentLoaded", () => {
  header();
  newItems();
  promo();
  sales();
  productCard();
  finder();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
