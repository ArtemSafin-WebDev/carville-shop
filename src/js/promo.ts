import { Swiper } from "swiper";
import { Navigation, Pagination, EffectCreative } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";

export default function promo() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".promo"));

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;
    new Swiper(container, {
      speed: 600,
      effect: "creative",
      modules: [Navigation, Pagination, EffectCreative],
      navigation: {
        nextEl: element.querySelector<HTMLElement>(".promo__arrow--next"),
        prevEl: element.querySelector<HTMLElement>(".promo__arrow--prev"),
      },
      pagination: {
        el: element.querySelector<HTMLElement>(".promo__slider-pagination"),
        clickable: true,
        type: "bullets",
      },
    });
  });
}
