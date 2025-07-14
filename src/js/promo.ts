import { Swiper } from "swiper";
import { Navigation, Pagination, EffectCreative } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";

export default function promo() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".promo"));

  elements.forEach((element) => {
    const tabBtns = Array.from(
      element.querySelectorAll<HTMLButtonElement>(".promo__nav-btn")
    );
    const tabItems = Array.from(
      element.querySelectorAll<HTMLElement>(".promo__tabs-item")
    );

    const navToggle = element.querySelector<HTMLElement>(".promo__nav-toggle");
    const dropdown = element.querySelector<HTMLElement>(".promo__nav-dropdown");
    const dropdownClose = element.querySelector<HTMLElement>(
      ".promo__nav-dropdown-close"
    );
    const selectedTabText = element.querySelector<HTMLElement>(
      ".promo__nav-toggle-text"
    );

    let instance: Swiper | null = null;

    const initSlider = (element: HTMLElement) => {
      const container = element.querySelector<HTMLElement>(".swiper");
      if (!container) return;

      instance = new Swiper(container, {
        speed: 600,
        effect: "creative",
        longSwipesRatio: 0.2,
        //   loop: true,
        centeredSlides: true,

        creativeEffect: {
          progressMultiplier: 1,
          limitProgress: 2,
          next: {
            translate: ["40%", 0, 0],
            scale: 0.8,
            shadow: false,
            origin: "left center",
          },
          prev: {
            translate: ["-40%", 0, 0],
            scale: 0.8,
            shadow: false,
            origin: "right center",
          },
        },
        breakpoints: {
          577: {
            creativeEffect: {
              next: {
                translate: ["70%", 0, 0],
                scale: 0.8,
                shadow: false,
                origin: "left center",
              },
              prev: {
                translate: ["-70%", 0, 0],
                scale: 0.8,
                shadow: false,
                origin: "right center",
              },
            },
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
    };

    const setActiveTab = (index: number) => {
      tabBtns.forEach((btn) => btn.classList.remove("active"));
      tabItems.forEach((item) => item.classList.remove("active"));
      tabBtns[index].classList.add("active");
      tabItems[index].classList.add("active");
      const selectedTitle = tabBtns[index]?.querySelector<HTMLElement>(
        ".promo__nav-btn-title"
      )?.textContent;
      if (selectedTitle && selectedTabText) {
        selectedTabText.textContent = selectedTitle;
      }
    };

    tabItems.forEach((item) => {
      initSlider(item);
    });

    tabBtns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        if (btn.classList.contains("active")) return;
        event.preventDefault();
        setActiveTab(btnIndex);
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
