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

  const finderOverlay = document.querySelector(".page-header-finder-overlay");

  finderOverlay?.addEventListener("click", (event) => {
    if (event.target === finderOverlay) {
      headerFinderBtn?.classList.remove("active");
    }
  });

  const searchCloseBtn = document.querySelector<HTMLElement>(
    ".page-header__search-mobile-close-btn"
  );

  searchCloseBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.remove("search-active");
  });

  let mm = gsap.matchMedia();

  const bottom = document.querySelector<HTMLElement>(".page-header__bottom");
  if (!bottom) return;

  mm.add("(min-width: 577px)", () => {
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
  });
}
