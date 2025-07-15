export default class Select {
  protected searchTerm: string = "";
  protected searchInput: HTMLInputElement | null = null;
  protected mainInput: HTMLInputElement | null = null;
  private rootElement: HTMLElement;
  private dropdownElement: HTMLElement | null = null;
  private destroyFn: (() => void) | null = null;
  private options: HTMLElement[] = [];
  private selectType: "single" | "multiple" = "single";
  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.searchInput =
      rootElement.querySelector<HTMLInputElement>(".js-select-search");
    this.mainInput =
      rootElement.querySelector<HTMLInputElement>(".js-select-input");
    this.dropdownElement = rootElement.querySelector<HTMLElement>(
      ".js-select-dropdown"
    );
    this.options = Array.from(
      rootElement.querySelectorAll<HTMLElement>(".js-select-option")
    );

    if (this.options[0].querySelector("input")?.type === "checkbox") {
      this.selectType = "multiple";
    }
    this.init();
  }

  public setValue(value: string) {
    if (!this.mainInput) return;
    this.mainInput.value = value;
    this.mainInput.readOnly = true;
  }

  public clearValue() {
    if (!this.mainInput) return;
    this.mainInput.value = "";
    this.mainInput.readOnly = false;
  }

  public getSelectedValue() {
    if (!this.mainInput) return "";
    return this.mainInput.value.trim();
  }

  public showDropdown() {
    this.dropdownElement?.classList.add("active");
  }

  protected handleSearch(query: string) {
    this.options.filter((option) => {
      if (query === "") return true;
      const optionText = option.querySelector<HTMLElement>(
        ".js-select-option-text"
      )?.textContent;
      if (!optionText) return true;
      if (optionText.toLowerCase().includes(query.trim().toLowerCase()))
        return true;
      return false;
    });
  }

  private init() {
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

    this.searchInput?.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      this.handleSearch(target.value);
    });

    return () => {
      abortController.abort();
    };
  }

  public destroy() {
    if (this.destroyFn) this.destroyFn();
  }
}
