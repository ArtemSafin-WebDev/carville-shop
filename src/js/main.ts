import "virtual:svg-icons-register";
import "../scss/style.scss";
import newItems from "./newItems";
import promo from "./promo";
import tabs from "./tabs";

document.addEventListener("DOMContentLoaded", () => {
  newItems();
  promo();
  // tabs();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
