import Swiper from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

export default function sales() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".sales"));

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;
    new Swiper(container, {
      speed: 600,
      slidesPerView: "auto",
      longSwipesRatio: 0.2,
      modules: [Navigation],
      navigation: {
        prevEl: element.querySelector<HTMLElement>(".sales__arrow--prev"),
        nextEl: element.querySelector<HTMLElement>(".sales__arrow--next"),
      },
    });
  });
}
