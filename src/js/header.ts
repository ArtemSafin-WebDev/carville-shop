import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function header() {
  const header = document.querySelector<HTMLElement>(".page-header");
  if (!header) return;

  const headerFinderBtn = header.querySelector<HTMLButtonElement>(
    ".js-header-finder-btn"
  );
  headerFinderBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    headerFinderBtn?.classList.toggle("active");
  });

  const bottom = document.querySelector<HTMLElement>(".page-header__bottom");
  if (!bottom) return;

  ScrollTrigger.create({
    pin: bottom,
    trigger: bottom,
    start: "top top",
    end: 99999999,
    pinSpacing: false,
    onEnter: () => {
      header.classList.add("header-fixed");
    },
    onLeave: () => {
      header.classList.remove("header-fixed");
    },
    onEnterBack: () => {
      header.classList.add("header-fixed");
    },
    onLeaveBack: () => {
      header.classList.remove("header-fixed");
    },
  });
}
