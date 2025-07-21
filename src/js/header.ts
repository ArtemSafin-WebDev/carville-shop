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

  const searchDropdown = document.querySelector<HTMLElement>(
    ".page-header__search-dropdown"
  );

  let mm = gsap.matchMedia();
  if (searchDropdown) {
    const parent = searchDropdown.parentElement;

    mm.add("(max-width: 576px)", () => {
      document.body.appendChild(searchDropdown);

      return () => {
        parent?.appendChild(searchDropdown);
      };
    });
  }

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
