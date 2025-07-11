import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";

export default function newItems() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".new-items")
  );
  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;

    new Swiper(container, {
      slidesPerView: 5,
      spaceBetween: 0,
      modules: [Navigation],
      speed: 600,
      navigation: {
        nextEl: element.querySelector<HTMLElement>(".new-items__arrow--right"),
        prevEl: element.querySelector<HTMLElement>(".new-items__arrow--left"),
      },
    });
  });
}
