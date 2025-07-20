export default class Select {
  protected searchInput: HTMLInputElement | null = null;
  protected rootElement: HTMLElement;
  protected dropdownElement: HTMLElement | null = null;
  protected clearBtn: HTMLButtonElement | null = null;
  protected destroyFn: (() => void) | null = null;
  protected options: HTMLElement[] = [];
  protected selectType: "single" | "multiple" = "single";
  protected popularTagsList: HTMLElement | null = null;
  protected popularTags: HTMLElement[] = [];
  protected showMoreTags: HTMLElement | null = null;
  protected mobilePopup: HTMLElement | null = null;
  protected backBtn: HTMLElement | null = null;
  protected selectedCount: HTMLElement | null = null;
  protected selectedItemsWrapper: HTMLElement | null = null;
  protected multiselectReset: HTMLElement | null = null;
  protected multiselectShowAll: HTMLElement | null = null;
  protected selectAllBtn: HTMLButtonElement | null = null;
  protected moreTagsCount: HTMLElement | null = null;
  protected saveBtn: HTMLButtonElement | null = null;

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
    this.popularTagsList = rootElement.querySelector<HTMLElement>(
      ".js-active-tags-list"
    );
    this.selectedCount = rootElement.querySelector(".js-select-count");
    this.mobilePopup = rootElement.querySelector(".js-mobile-popup");
    this.backBtn = rootElement.querySelector(".js-back-btn");
    this.showMoreTags = this.rootElement.querySelector(".js-show-more-tags");
    this.selectedItemsWrapper = this.rootElement.querySelector(
      ".js-multiselect-selected-items"
    );
    this.multiselectReset = this.rootElement.querySelector(
      ".js-multiselect-reset"
    );
    this.multiselectShowAll = this.rootElement.querySelector(
      ".js-multiselect-show-all"
    );
    this.saveBtn = this.rootElement.querySelector(".js-select-save-btn");
    this.moreTagsCount = this.rootElement.querySelector(".js-other-tags-count");
    this.selectAllBtn = this.rootElement.querySelector(".js-select-all-btn");
    if (!this.searchInput || !this.dropdownElement)
      throw new Error("Not all required elements are present");

    if (this.options[0].querySelector("input")?.type === "checkbox") {
      this.selectType = "multiple";
      this.rootElement.classList.add("multiselect");
    }
    this.destroyFn = this.init();
  }

  public selectAll = () => {
    if (!this.searchInput) return;

    this.options.forEach((option) => {
      const input = option.querySelector<HTMLInputElement>("input");
      if (!input) return;
      input.checked = true;
    });
    this.setValues();
  };

  public deselectAll = () => {
    this.clearValues();
  };

  protected hasAllSelected = () => {
    return this.getCheckedOptions().length === this.options.length;
  };

  get value() {
    if (this.selectType === "single") return this.getCheckedOption()?.value;
    return this.getCheckedOptions().map((item) => item.value);
  }

  protected createPopularTags() {
    if (this.popularTagsList) {
      this.popularTagsList.innerHTML = "";
    } else {
      return;
    }
    const popularOptions = this.options.filter((option) =>
      option.classList.contains("js-select-popular-option")
    );
    const checkedOptions = (
      this.selectType === "single"
        ? [this.getCheckedOption()?.option]
        : this.getCheckedOptions().map((item) => item.option)
    ).filter((item) => !!item);
    const optionsForTagCreation = Array.from(
      new Set([...checkedOptions, ...popularOptions])
    );
    const tags = optionsForTagCreation.map((option) => {
      const isActive = checkedOptions.includes(option);
      return this.createPopularTagFromOption(option, isActive);
    });
    if (!tags.length) return;
    this.popularTags = tags;
    this.popularTagsList?.append(...tags);

    const otherTagsCount = this.options.length - optionsForTagCreation.length;
    if (this.moreTagsCount) {
      if (otherTagsCount > 0) {
        this.moreTagsCount.textContent = `Еще ${otherTagsCount.toLocaleString(
          "ru-RU"
        )}`;
        this.moreTagsCount.parentElement!.style.display = "";
      } else {
        this.moreTagsCount.parentElement!.style.display = "none";
      }
    }
  }

  protected createPopularTagFromOption = (
    option: HTMLElement,
    isActive: boolean = false
  ) => {
    const value = option.querySelector<HTMLInputElement>("input")!.value;
    const text = option
      .querySelector<HTMLElement>(".js-select-option-text")!
      .textContent!.trim();
    const tag = document.createElement("div");
    tag.className = "finder__select-active-tag";
    if (isActive) {
      tag.classList.add("active");
    }
    tag.textContent = text;
    tag.setAttribute("data-value", value);
    return tag;
  };

  protected addSelectedItemsTags = () => {
    if (!this.selectedItemsWrapper) return;
    this.selectedItemsWrapper.innerHTML = "";
    const options = this.getCheckedOptions();

    const tags = options.map((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "finder__select-multiselect-selected-item js-selected-item";
      btn.innerHTML = `
        ${option.text}
        <svg width="14" height="14" aria-hidden="true">
          <use xlink:href="#clear"></use>
        </svg>
      `;
      btn.setAttribute("data-value", option.value);
      return btn;
    });
    this.selectedItemsWrapper?.append(...tags);
  };

  protected toggleAllSelectedItemsShown = () => {
    this.selectedItemsWrapper?.classList.toggle("all-selected-shown");
  };

  public setValues = () => {
    if (!this.searchInput) return;
    let options = this.getCheckedOptions();
    if (!options.length) return;
    if (this.hasAllSelected()) {
      this.searchInput.value = "Все группы товаров";
    } else {
      const searchInputString = options.map((option) => option.text).join(", ");
      this.searchInput.value = searchInputString;
    }

    this.searchInput.readOnly = true;
    this.rootElement.classList.add("option-selected");
    if (this.selectedCount)
      this.selectedCount.textContent = options.length.toString();
    this.handleSearch("");
    this.addSelectedItemsTags();
    this.createPopularTags();
    if (this.hasAllSelected()) {
      this.selectAllBtn?.classList.add("active");
    } else {
      this.selectAllBtn?.classList.remove("active");
    }
    this.rootElement.dispatchEvent(
      new CustomEvent("select:set", {
        bubbles: true,
      })
    );
  };

  public setValue = () => {
    if (!this.searchInput) return;
    const option = this.getCheckedOption();
    if (!option) return;
    this.searchInput.value = option.text;
    this.searchInput.readOnly = true;
    this.rootElement.classList.add("option-selected");
    this.handleSearch("");
    this.createPopularTags();

    this.rootElement.dispatchEvent(
      new CustomEvent("select:set", {
        bubbles: true,
      })
    );
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

    this.hideDropdown();
    this.handleSearch("");
    this.createPopularTags();

    this.rootElement.dispatchEvent(
      new CustomEvent("select:clear", {
        bubbles: true,
      })
    );
  };

  public clearValues = () => {
    if (!this.searchInput) return;

    this.searchInput.value = "";
    this.searchInput.readOnly = false;
    this.rootElement.classList.remove("option-selected");
    this.options.forEach((option) => {
      const input = option.querySelector<HTMLInputElement>("input");
      if (input) input.checked = false;
    });
    this.selectAllBtn?.classList.remove("active");
    this.hideDropdown();
    this.handleSearch("");
    this.addSelectedItemsTags();
    this.createPopularTags();

    this.rootElement.dispatchEvent(
      new CustomEvent("select:clear", {
        bubbles: true,
      })
    );
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
      const optionInput = option.querySelector<HTMLInputElement>("input");
      if (optionInput?.checked) return true;
      return false;
    });
    if (!checkedOption) return null;
    const value = checkedOption.querySelector<HTMLInputElement>("input")!.value;
    const text = checkedOption
      .querySelector<HTMLElement>(".js-select-option-text")!
      .textContent!.trim();

    return {
      value,
      text,
      option: checkedOption,
    };
  };

  private getCheckedOptions = () => {
    const checkedOptions = this.options.filter((option) => {
      const optionInput = option.querySelector<HTMLInputElement>("input");
      if (optionInput?.checked) return true;
      return false;
    });
    if (!checkedOptions.length) return [];
    return checkedOptions.map((option) => {
      const value = option.querySelector<HTMLInputElement>("input")!.value;
      const text = option
        .querySelector<HTMLElement>(".js-select-option-text")!
        .textContent!.trim();
      return {
        value,
        text,
        option,
      };
    });
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
    if (this.selectType === "single") {
      const checked = this.getCheckedOption();
      if (checked) {
        this.setValue();
        // this.hideMobilePopup();
      } else {
        this.clearValue();
      }
    } else {
      const checked = this.getCheckedOptions();
      if (checked.length) {
        this.setValues();
      } else {
        this.clearValues();
      }
    }

    if (this.selectType === "single") {
      this.hideDropdown();
    }
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
        if (
          target.matches(".js-selected-item") ||
          target.closest(".js-selected-item")
        )
          return;

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
        if (this.selectType === "single") {
          this.clearValue();
        } else {
          this.clearValues();
          this.hideDropdown();
        }
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

    this.createPopularTags();

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
            const input = option.querySelector<HTMLInputElement>("input");
            if (!input) return false;
            return input.value === value;
          });

          if (matchingOption) {
            const input =
              matchingOption.querySelector<HTMLInputElement>("input");
            if (input) input.checked = !input.checked;
            input?.dispatchEvent(new Event("change"));
          }
        }
      },
      {
        signal,
      }
    );

    this.rootElement.addEventListener(
      "click",
      (event) => {
        const target = event.target as HTMLElement;
        if (
          target.matches(".js-selected-item") ||
          target.closest(".js-selected-item")
        ) {
          event.preventDefault();
          const button = target.matches(".js-selected-item")
            ? target
            : target.closest(".js-selected-item");
          if (!button) return;
          const value = button.getAttribute("data-value");

          const matchingOption = this.options.find((option) => {
            const input = option.querySelector<HTMLInputElement>("input");
            if (!input) return false;
            return input.value === value;
          });

          if (matchingOption) {
            const input =
              matchingOption.querySelector<HTMLInputElement>("input");
            if (input) input.checked = false;
            input?.dispatchEvent(new Event("change"));
          }
        }
      },
      {
        signal,
      }
    );

    this.multiselectReset?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        this.deselectAll();
      },
      {
        signal,
      }
    );

    this.multiselectShowAll?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        this.toggleAllSelectedItemsShown();
      },
      {
        signal,
      }
    );

    this.selectAllBtn?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        if (this.hasAllSelected()) {
          this.deselectAll();
        } else {
          this.selectAll();
        }
      },
      {
        signal,
      }
    );

    this.saveBtn?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        this.hideMobilePopup();
      },
      {
        signal,
      }
    );

    if (this.selectType === "single") {
      this.setValue();
    } else {
      this.setValues();
    }

    this.rootElement.classList.add("initialized");

    this.rootElement.dispatchEvent(
      new CustomEvent("select:init", {
        bubbles: true,
        detail: {
          instance: this,
        },
      })
    );

    return () => {
      if (this.selectType === "single") {
        this.clearValue();
      } else {
        this.clearValues();
      }

      this.hideDropdown();
      this.searchInput?.blur();
      this.popularTags.forEach((tag) => tag.remove());
      abortController.abort();
      this.rootElement.classList.remove("multiselect");
      this.selectedItemsWrapper?.classList.remove("all-selected-shown");
      this.rootElement.classList.remove("initialized");
    };
  };

  public destroy = () => {
    if (this.destroyFn) this.destroyFn();
    this.rootElement.dispatchEvent(
      new CustomEvent("select:destroy", {
        bubbles: true,
      })
    );
  };
}
