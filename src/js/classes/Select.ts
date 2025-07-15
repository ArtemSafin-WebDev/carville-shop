export default class Select {
  protected searchInput: HTMLInputElement | null = null;
  protected rootElement: HTMLElement;
  protected dropdownElement: HTMLElement | null = null;
  protected clearBtn: HTMLButtonElement | null = null;
  protected destroyFn: (() => void) | null = null;
  protected options: HTMLElement[] = [];
  protected selectType: "single" | "multiple" = "single";

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

    if (!this.searchInput || !this.dropdownElement)
      throw new Error("Not all required elements are present");

    if (this.options[0].querySelector("input")?.type === "checkbox") {
      this.selectType = "multiple";
    }
    this.init();
  }

  public setValue = (text: string) => {
    if (!this.searchInput) return;
    this.searchInput.value = text;
    this.searchInput.readOnly = true;
    this.rootElement.classList.add("option-selected");
    this.handleSearch("");
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
  };

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

    return () => {
      this.clearValue();
      this.hideDropdown();
      abortController.abort();
    };
  };

  public destroy = () => {
    if (this.destroyFn) this.destroyFn();
  };
}
