import tippy from "tippy.js";
import { Instance } from "tippy.js";

export default function productCard() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".product-card")
  );

  const initProductCard = (card: HTMLElement) => {
    let tippyInstances: Instance[] = [];

    let mql = window.matchMedia("(max-width: 576px)");

    const initPopover = (btn: HTMLButtonElement, popover: HTMLDivElement) => {
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

      tippyInstances.push(tippyInstance);

      return tippyInstance;
    };

    const addToFavoriteBtn = card.querySelector<HTMLButtonElement>(
      ".product-card__add-to-favorite-btn"
    );
    const addToFavoriteBtnPopover = card.querySelector<HTMLDivElement>(
      ".product-card__add-to-favorite .product-card__popover:not(.product-card__popover--added)"
    );
    const addToFavoriteBtnPopoverAdded = card.querySelector<HTMLDivElement>(
      ".product-card__add-to-favorite .product-card__popover.product-card__popover--added"
    );

    console.log(
      addToFavoriteBtn,
      addToFavoriteBtnPopover,
      addToFavoriteBtnPopoverAdded
    );
    if (
      addToFavoriteBtn &&
      addToFavoriteBtnPopover &&
      addToFavoriteBtnPopoverAdded
    ) {
      let addToFavTippyInstance: Instance | null = null;

      const initAddToFavTooltips = () => {
        if (addToFavTippyInstance) {
          addToFavTippyInstance.destroy();
          // remove instance from tippyInstances array
          tippyInstances = tippyInstances.filter(
            (instance) => instance !== addToFavTippyInstance
          );
          addToFavTippyInstance = null;
        }
        const isAddedToFav = addToFavoriteBtn.classList.contains("active");
        if (isAddedToFav) {
          addToFavTippyInstance = initPopover(
            addToFavoriteBtn,
            addToFavoriteBtnPopoverAdded
          );
        } else {
          addToFavTippyInstance = initPopover(
            addToFavoriteBtn,
            addToFavoriteBtnPopover
          );
        }
      };
      initAddToFavTooltips();

      addToFavoriteBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        // Асинхронный код для добавления в избранное (заглушка)

        await new Promise((resolve) => setTimeout(resolve, 100));

        addToFavoriteBtn.classList.toggle("active");
        initAddToFavTooltips();
      });
    }

    const addToComparisonBtn = card.querySelector<HTMLButtonElement>(
      ".product-card__add-to-comparison-btn"
    );
    const addToComparisonBtnPopover = card.querySelector<HTMLDivElement>(
      ".product-card__add-to-comparison .product-card__popover"
    );
    const addToComparisonBtnPopoverAdded = card.querySelector<HTMLDivElement>(
      ".product-card__add-to-comparison .product-card__popover.product-card__popover--added"
    );

    const addToComparisonJustAddedPopover = card.querySelector<HTMLDivElement>(
      ".product-card__add-to-comparison .product-card__just-added-popover"
    );

    if (
      addToComparisonBtn &&
      addToComparisonBtnPopover &&
      addToComparisonBtnPopoverAdded
    ) {
      let addToComparisonTippyInstance: Instance | null = null;

      const initAddToComparisonTooltips = () => {
        if (addToComparisonTippyInstance) {
          addToComparisonTippyInstance.destroy();
          // remove instance from tippyInstances array
          tippyInstances = tippyInstances.filter(
            (instance) => instance !== addToComparisonTippyInstance
          );
          addToComparisonTippyInstance = null;
        }
        const isAddedToComparison =
          addToComparisonBtn.classList.contains("active");
        if (isAddedToComparison) {
          addToComparisonTippyInstance = initPopover(
            addToComparisonBtn,
            addToComparisonBtnPopoverAdded
          );
        } else {
          addToComparisonTippyInstance = initPopover(
            addToComparisonBtn,
            addToComparisonBtnPopover
          );
        }
      };

      initAddToComparisonTooltips();

      addToComparisonBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        // Асинхронный код для добавления в сравнение (заглушка)

        await new Promise((resolve) => setTimeout(resolve, 100));

        if (addToComparisonBtn.classList.contains("active")) {
          addToComparisonJustAddedPopover?.classList.remove("active");
          addToComparisonBtn.classList.remove("active");
          initAddToComparisonTooltips();
        } else {
          addToComparisonJustAddedPopover?.classList.add("active");
          addToComparisonBtn.classList.add("active");
          addToComparisonTippyInstance?.destroy();
        }
      });
    }
    const productCardCompatibilityBtn = card.querySelector<HTMLButtonElement>(
      ".product-card__compatibility-btn"
    );
    const productCardCompatibilityDropdown = card.querySelector<HTMLDivElement>(
      ".product-card__compatibility .product-card__popover"
    );

    if (productCardCompatibilityBtn && productCardCompatibilityDropdown) {
      initPopover(
        productCardCompatibilityBtn,
        productCardCompatibilityDropdown
      );
    }
    const toggleTippyInstances = (event: MediaQueryListEvent) => {
      if (event.matches) {
        tippyInstances.forEach((instance) => instance.disable());
      } else {
        tippyInstances.forEach((instance) => instance.enable());
      }
    };

    const handleInitialState = (mql: MediaQueryList) => {
      if (mql.matches) {
        tippyInstances.forEach((instance) => instance.disable());
      } else {
        tippyInstances.forEach((instance) => instance.enable());
      }
    };

    handleInitialState(mql);

    mql.addEventListener("change", toggleTippyInstances);

    return () => {
      tippyInstances.forEach((instance) => instance.destroy());
      mql.removeEventListener("change", toggleTippyInstances);
    };
  };

  elements.forEach((element) => {
    initProductCard(element);
  });
}
