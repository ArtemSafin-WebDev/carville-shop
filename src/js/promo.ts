import { Swiper } from "swiper";
import { Navigation, Pagination, EffectCreative } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";

export default function promo() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".promo"));

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;
    const instance = new Swiper(container, {
      speed: 600,
      effect: "creative",
      longSwipesRatio: 0.2,
      //   loop: true,
      centeredSlides: true,

      creativeEffect: {
        limitProgress: 2,
        next: {
          translate: [150, 0, 0],
          scale: 0.8,
          shadow: false,
        },
        prev: {
          translate: [-150, 0, 0],
          scale: 0.8,
          shadow: false,
        },
      },
      slideToClickedSlide: true,
      modules: [Navigation, Pagination, EffectCreative],
      navigation: {
        nextEl: element.querySelector<HTMLElement>(".promo__arrow--next"),
        prevEl: element.querySelector<HTMLElement>(".promo__arrow--prev"),
      },
      pagination: {
        el: element.querySelector<HTMLElement>(".promo__slider-pagination"),
        clickable: true,
        type: "bullets",
        renderBullet: function (_index, className) {
          return `<span class="${className}">
            <span></span>
            <span></span>
            <span></span>
          </span>`;
        },
      },
    });

    if (instance.slides.length >= 5) {
      instance.slideTo(2, 0, false);
    }
  });
}
