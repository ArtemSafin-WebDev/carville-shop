import tippy from "tippy.js";
import { Instance } from "tippy.js";

export default class ProductCard {
  private card: HTMLElement;
  private tippyInstances: Instance[] = [];
  private mql: MediaQueryList;

  constructor(card: HTMLElement) {
    this.card = card;
    this.mql = window.matchMedia("(max-width: 576px)");
    this.init();
  }

  private initPopover(btn: HTMLButtonElement, popover: HTMLDivElement) {
    const dropdownContent = popover.cloneNode(true) as HTMLElement;
    const tippyInstance = tippy(btn, {
      content: dropdownContent,
      trigger: "mouseenter",
      interactive: true,
      placement: "bottom",
      arrow: false,
      offset: [0, 0],
      appendTo: () => document.body,
      theme: "custom-product-card",
      animation: false,
      onShow(instance) {
        const content = instance.popper.querySelector(
          ".product-card__popover"
        ) as HTMLElement;
        if (content) {
          content.style.display = "block";
        }
      },
      onHide(instance) {
        const content = instance.popper.querySelector(
          ".product-card__popover"
        ) as HTMLElement;
        if (content) {
          content.style.display = "none";
        }
      },
    });
    this.tippyInstances.push(tippyInstance);
    return tippyInstance;
  }

  private init() {
    this.initFavorite();
    this.initComparison();
    this.initCompatibility();
    this.handleInitialState(this.mql);
    this.mql.addEventListener("change", this.toggleTippyInstances);
  }

  private initFavorite() {
    const btn = this.card.querySelector<HTMLButtonElement>(
      ".product-card__add-to-favorite-btn"
    );
    const popover = this.card.querySelector<HTMLDivElement>(
      ".product-card__add-to-favorite .product-card__popover"
    );

    if (btn && popover) {
      this.tippyInstances.push(this.initPopover(btn, popover));
    }
  }

  private initComparison() {
    const btn = this.card.querySelector<HTMLButtonElement>(
      ".product-card__add-to-comparison-btn"
    );
    const popover = this.card.querySelector<HTMLDivElement>(
      ".product-card__add-to-comparison .product-card__popover"
    );

    if (btn && popover) {
      this.tippyInstances.push(this.initPopover(btn, popover));
    }
  }

  private initCompatibility() {
    const btn = this.card.querySelector<HTMLButtonElement>(
      ".product-card__compatibility-btn"
    );
    const popover = this.card.querySelector<HTMLDivElement>(
      ".product-card__compatibility .product-card__popover"
    );
    if (btn && popover) {
      this.tippyInstances.push(this.initPopover(btn, popover));
    }
  }

  private toggleTippyInstances = (event: MediaQueryListEvent) => {
    if (event.matches) {
      this.tippyInstances.forEach((instance) => instance.disable());
    } else {
      this.tippyInstances.forEach((instance) => instance.enable());
    }
  };

  private handleInitialState(mql: MediaQueryList) {
    if (mql.matches) {
      this.tippyInstances.forEach((instance) => instance.disable());
    } else {
      this.tippyInstances.forEach((instance) => instance.enable());
    }
  }

  public destroy() {
    this.tippyInstances.forEach((instance) => instance.destroy());
    this.mql.removeEventListener("change", this.toggleTippyInstances);
  }
}
