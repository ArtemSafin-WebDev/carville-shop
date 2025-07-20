import "virtual:svg-icons-register";
import "../scss/style.scss";
import newItems from "./newItems";
import promo from "./promo";
import sales from "./sales";
import header from "./header";
import productCard from "./productCard";
import api from "./api";

document.addEventListener("DOMContentLoaded", () => {
  console.log("hello from main.js");
  header();
  newItems();
  promo();
  sales();
  productCard();
  api();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
