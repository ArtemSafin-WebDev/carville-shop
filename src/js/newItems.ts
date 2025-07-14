import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { Flip } from "gsap/all";
import { gsap } from "gsap";

gsap.registerPlugin(Flip);

export default function newItems() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".new-items")
  );
  elements.forEach((element) => {
    const tabBtns = Array.from(
      element.querySelectorAll<HTMLButtonElement>(".js-tabs-btn")
    );
    const tabItems = Array.from(
      element.querySelectorAll<HTMLElement>(".js-tabs-item")
    );

    const navToggle = element.querySelector<HTMLElement>(
      ".new-items__nav-toggle"
    );
    const dropdown = element.querySelector<HTMLElement>(
      ".new-items__nav-dropdown"
    );
    const dropdownClose = element.querySelector<HTMLElement>(
      ".new-items__nav-dropdown-close"
    );
    const selectedTabText = element.querySelector<HTMLElement>(
      ".new-items__nav-toggle-text"
    );

    let instance: Swiper | null = null;

    const initSlider = () => {
      if (instance) {
        instance.destroy(true, true);
        instance = null;
      }
      const container = tabItems
        .find((item) => item.classList.contains("active"))
        ?.querySelector<HTMLElement>(".swiper");
      if (!container) return;
      instance = new Swiper(container, {
        slidesPerView: "auto",
        spaceBetween: 0,
        watchSlidesProgress: true,
        modules: [Navigation],
        speed: 600,
        navigation: {
          nextEl: element.querySelector<HTMLElement>(
            ".new-items__arrow--right"
          ),
          prevEl: element.querySelector<HTMLElement>(".new-items__arrow--left"),
        },
      });
    };

    const setActiveTab = (index: number) => {
      let state: Flip.FlipState | null = null;
      state = Flip.getState(".new-items__nav-link");
      tabBtns.forEach((btn) => btn.classList.remove("active"));
      tabItems.forEach((item) => item.classList.remove("active"));
      tabBtns[index].classList.add("active");
      tabItems[index].classList.add("active");
      const selectedTitle = tabBtns[index]?.querySelector<HTMLElement>(
        ".new-items__nav-link-title"
      )?.textContent;
      if (selectedTitle && selectedTabText) {
        selectedTabText.textContent = selectedTitle;
      }
      initSlider();
      if (state) {
        Flip.from(state, {
          duration: 0.2,
          absoluteOnLeave: true,
          onLeave: (elements) => {
            gsap.to(elements, {
              duration: 0.2,
              autoAlpha: 0,
            });
          },
          onEnter: (elements) => {
            gsap.to(elements, {
              duration: 0.2,
              autoAlpha: 1,
            });
          },
        });
      }
    };

    tabBtns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        if (
          btn.classList.contains("active") &&
          !window.matchMedia("(max-width: 576px)").matches
        )
          return;
        event.preventDefault();
        setActiveTab(btnIndex);
        if (window.matchMedia("(max-width: 576px)").matches) {
          dropdown?.classList.remove("active");
          navToggle?.classList.remove("active");
        }
      });
    });

    setActiveTab(0);

    navToggle?.addEventListener("click", (event) => {
      event.preventDefault();
      if (dropdown?.classList.contains("active")) {
        dropdown?.classList.remove("active");
        navToggle?.classList.remove("active");
      } else {
        dropdown?.classList.add("active");
        navToggle?.classList.add("active");
      }
    });

    dropdownClose?.addEventListener("click", (event) => {
      event.preventDefault();
      dropdown?.classList.remove("active");
      navToggle?.classList.remove("active");
    });

    dropdown?.addEventListener("click", (event) => {
      if (event.target === dropdown) {
        dropdown?.classList.remove("active");
        navToggle?.classList.remove("active");
      }
    });
  });
}
