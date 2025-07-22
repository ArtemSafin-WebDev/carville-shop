import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function promoSlider() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".promo-slider")
  );
  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;
    new Swiper(container, {
      speed: 600,
      modules: [Autoplay],
      autoplay: {
        delay: 3000,
      },
    });
  });
}
