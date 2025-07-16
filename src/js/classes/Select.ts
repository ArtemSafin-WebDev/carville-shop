export default class Select {
  protected searchInput: HTMLInputElement | null = null;
  protected rootElement: HTMLElement;
  protected dropdownElement: HTMLElement | null = null;
  protected clearBtn: HTMLButtonElement | null = null;
  protected destroyFn: (() => void) | null = null;
  protected options: HTMLElement[] = [];
  protected selectType: "single" | "multiple" = "single";
  protected activeTagsList: HTMLElement | null = null;
  protected activeTags: HTMLElement[] = [];
  protected showMoreTags: HTMLElement | null = null;
  protected mobilePopup: HTMLElement | null = null;
  protected backBtn: HTMLElement | null = null;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.searchInput =
      rootElement.querySelector<HTMLInputElement>(".js-select-search");

    this.dropdownElement = rootElement.querySelector<HTMLElement>(
      ".js-select-dropdown"
    );
    this.options = Array.from(
      rootElement.querySelectorAll<HTMLElement>(".js-select-option")
    );
    this.clearBtn =
      rootElement.querySelector<HTMLButtonElement>(".js-select-clear");
    this.activeTagsList = rootElement.querySelector<HTMLElement>(
      ".js-active-tags-list"
    );
    this.mobilePopup = rootElement.querySelector(".js-mobile-popup");
    this.backBtn = rootElement.querySelector(".js-back-btn");
    this.showMoreTags = this.rootElement.querySelector(".js-show-more-tags");
    if (!this.searchInput || !this.dropdownElement)
      throw new Error("Not all required elements are present");

    if (this.options[0].querySelector("input")?.type === "checkbox") {
      this.selectType = "multiple";
    }
    this.init();
  }

  protected createPopularOptionsTags() {
    const popularOptions = this.options.filter((option) =>
      option.classList.contains("js-select-popular-option")
    );
    const tags = popularOptions.map((option) =>
      this.createTagFromOption(option)
    );
    if (!tags.length) return;
    this.activeTags = tags;
    this.activeTagsList?.append(...tags);
  }

  protected prependSelectedTag = () => {
    const checkedOption = this.getCheckedOption();
    if (!checkedOption) return;
    const isTagAlreadyPresent = this.activeTags.some(
      (tag) =>
        tag.getAttribute("data-value")?.trim().toLowerCase() ===
        checkedOption.value.trim().toLowerCase()
    );
    if (isTagAlreadyPresent) return;
    const newTag = this.createTagFromOption(checkedOption.option);
    this.activeTags.unshift(newTag);
    this.activeTagsList?.prepend(newTag);
  };

  protected updateTags() {
    const checkedOption = this.getCheckedOption();
    this.activeTags.forEach((tag) => tag.classList.remove("active"));
    if (!checkedOption) return;
    const matchingTags = this.activeTags.filter(
      (tag) =>
        tag.getAttribute("data-value")?.trim().toLowerCase() ===
        checkedOption.value.trim().toLowerCase()
    );
    matchingTags.forEach((tag) => tag.classList.add("active"));
  }

  protected createTagFromOption = (option: HTMLElement) => {
    const value = option.querySelector<HTMLInputElement>(
      'input[type="radio"]'
    )!.value;
    const text = option
      .querySelector<HTMLElement>(".js-select-option-text")!
      .textContent!.trim();
    const tag = document.createElement("div");
    tag.className = "finder__select-active-tag";
    tag.textContent = text;
    tag.setAttribute("data-value", value);
    return tag;
  };

  public setValue = (text: string) => {
    if (!this.searchInput) return;
    this.searchInput.value = text;
    this.searchInput.readOnly = true;
    this.rootElement.classList.add("option-selected");
    this.handleSearch("");
    this.prependSelectedTag();
    this.updateTags();
  };

  public clearValue = () => {
    if (!this.searchInput) return;

    this.searchInput.value = "";
    this.searchInput.readOnly = false;
    this.rootElement.classList.remove("option-selected");
    this.options.forEach((option) => {
      const input = option.querySelector<HTMLInputElement>("input");
      if (input) input.checked = false;
    });

    this.handleSearch("");
    this.updateTags();
  };

  public showMobilePopup() {
    this.mobilePopup?.classList.add("active");
    this.searchInput?.focus();
  }

  public hideMobilePopup() {
    this.mobilePopup?.classList.remove("active");
  }

  public showDropdown = () => {
    this.dropdownElement?.classList.add("active");
  };

  public hideDropdown = () => {
    this.dropdownElement?.classList.remove("active");
  };

  private getCheckedOption = () => {
    const checkedOption = this.options.find((option) => {
      const optionInput = option.querySelector<HTMLInputElement>(
        'input[type="radio"]'
      );
      if (optionInput?.checked) return true;
      return false;
    });
    if (!checkedOption) return null;
    const value = checkedOption.querySelector<HTMLInputElement>(
      'input[type="radio"]'
    )!.value;
    const text = checkedOption
      .querySelector<HTMLElement>(".js-select-option-text")!
      .textContent!.trim();

    console.log(
      "Checked option text element",
      checkedOption.querySelector<HTMLElement>(".js-select-option-text")
    );
    return {
      value,
      text,
      option: checkedOption,
    };
  };

  protected handleSearch = (query: string) => {
    const filteredOptions = this.options.filter((option) => {
      if (query === "") return true;
      const optionText = option.querySelector<HTMLElement>(
        ".js-select-option-text"
      )?.textContent;
      if (!optionText) return true;
      if (optionText.toLowerCase().includes(query.trim().toLowerCase()))
        return true;
      return false;
    });
    this.options.forEach((option) => {
      if (filteredOptions.includes(option)) {
        option.classList.remove("hidden");
      } else {
        option.classList.add("hidden");
      }
    });
  };

  protected handleOptionSelection = () => {
    const checked = this.getCheckedOption();
    console.log("Handle option selection", checked);

    if (checked) {
      this.setValue(checked.text);
    } else {
      this.clearValue();
    }
    this.hideDropdown();
  };

  private init = () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    this.searchInput?.addEventListener(
      "focus",
      () => {
        this.showDropdown();
      },
      {
        signal,
      }
    );

    document.addEventListener(
      "click",
      (event) => {
        const target = event.target as HTMLElement;
        if (this.rootElement.contains(target)) return;
        this.hideDropdown();
      },
      {
        signal,
      }
    );

    this.searchInput?.addEventListener(
      "input",
      (event) => {
        const target = event.target as HTMLInputElement;
        this.handleSearch(target.value);
      },
      {
        signal,
      }
    );

    this.options.forEach((option) => {
      const input = option.querySelector<HTMLInputElement>("input");
      input?.addEventListener("change", this.handleOptionSelection, {
        signal,
      });
    });

    this.clearBtn?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        this.clearValue();
      },
      {
        signal,
      }
    );

    this.showMoreTags?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        this.showMobilePopup();
      },
      {
        signal,
      }
    );

    this.backBtn?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        this.hideMobilePopup();
      },
      {
        signal,
      }
    );

    this.createPopularOptionsTags();

    this.rootElement.addEventListener(
      "click",
      (event) => {
        const target = event.target as HTMLElement;
        if (
          target.matches(".finder__select-active-tag") ||
          target.closest(".finder__select-active-tag")
        ) {
          event.preventDefault();

          const activeTag = target.matches(".finder__select-active-tag")
            ? target
            : target.closest(".finder__select-active-tag");
          const value = activeTag?.getAttribute("data-value");
          const matchingOption = this.options.find((option) => {
            const input = option.querySelector<HTMLInputElement>(
              "input[type='radio']"
            );
            if (!input) return false;
            return input.value === value;
          });

          if (matchingOption) {
            const input = matchingOption.querySelector<HTMLInputElement>(
              "input[type='radio']"
            );
            if (input) input.checked = true;
            input?.dispatchEvent(new Event("change"));
          }
        }
      },
      {
        signal,
      }
    );

    const initiallyChecked = this.getCheckedOption();
    if (initiallyChecked) this.setValue(initiallyChecked.text);

    this.rootElement.classList.add("initialized");

    return () => {
      this.clearValue();
      this.hideDropdown();
      this.activeTags.forEach((tag) => tag.remove());
      abortController.abort();
      this.rootElement.classList.remove("initialized");
    };
  };

  public destroy = () => {
    if (this.destroyFn) this.destroyFn();
  };
}
