type Mode = "auto" | "vin";

export default class Finder {
  protected mode: Mode = "auto";
  protected destroyFn: (() => void) | null = null;
  protected modeBtns: HTMLButtonElement[] = [];
  protected autoModeLayer: HTMLElement | null = null;
  protected vinModeLayer: HTMLElement | null = null;
  protected autoModeForm: HTMLFormElement | null = null;
  protected vinModeForm: HTMLFormElement | null = null;
  protected autoModeSubmitBtn: HTMLButtonElement | null = null;

  protected showMyAutoBtn: HTMLButtonElement | null = null;
  protected myAutoShown: boolean = false;
  protected myAutoDropdown: HTMLElement | null = null;
  protected savedAutoBackBtn: HTMLElement | null = null;
  protected finderCloseBtn: HTMLElement | null = null;

  constructor(protected rootElement: HTMLElement) {
    this.modeBtns = Array.from(
      this.rootElement.querySelectorAll<HTMLButtonElement>(
        ".js-finder-mode-btn"
      )
    );
    this.autoModeLayer = rootElement.querySelector<HTMLElement>(
      ".js-auto-mode-layer"
    );
    this.vinModeLayer =
      rootElement.querySelector<HTMLElement>(".js-vin-mode-layer");
    this.autoModeForm = this.rootElement.querySelector(".js-auto-mode-form");
    this.vinModeForm = this.rootElement.querySelector(".js-vin-mode-form");
    this.autoModeSubmitBtn = this.rootElement.querySelector(
      ".js-auto-mode-submit-btn"
    );
    this.myAutoDropdown = this.rootElement.querySelector(
      ".js-saved-auto-dropdown"
    );
    this.showMyAutoBtn = this.rootElement.querySelector(".js-show-my-auto-btn");
    this.savedAutoBackBtn = this.rootElement.querySelector(
      ".js-saved-auto-back-btn"
    );
    this.finderCloseBtn = this.rootElement.querySelector(
      ".js-finder-close-btn"
    );

    this.destroyFn = this.init();
  }

  public showMobileFinderPopup = () => {
    this.rootElement.classList.add("active");
  };

  public closeMobileFinderPopup = () => {
    this.rootElement.classList.remove("active");
  };

  protected setMode = (mode: Mode) => {
    if (mode === "auto") {
      this.modeBtns[0]?.classList.add("active");
      this.modeBtns[1]?.classList.remove("active");
      this.autoModeLayer?.classList.add("active");
      this.vinModeLayer?.classList.remove("active");
      this.mode === "vin";
    } else {
      this.modeBtns[0]?.classList.remove("active");
      this.modeBtns[1]?.classList.add("active");
      this.autoModeLayer?.classList.remove("active");
      this.vinModeLayer?.classList.add("active");
      this.mode === "auto";
      this.hideMyAuto();
    }
  };

  public showMyAuto = () => {
    this.setMode("auto");
    this.showMyAutoBtn?.classList.add("active");
    this.myAutoShown = true;
    this.myAutoDropdown?.classList.add("active");
  };

  public hideMyAuto = () => {
    this.showMyAutoBtn?.classList.remove("active");
    this.myAutoShown = false;
    this.myAutoDropdown?.classList.remove("active");
  };

  protected init = () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    this.modeBtns.forEach((btn, btnIndex) => {
      btn.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          if (btnIndex === 0) {
            this.setMode("auto");
          } else {
            this.setMode("vin");
          }
        },
        {
          signal,
        }
      );
    });

    this.showMyAutoBtn?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        if (this.myAutoShown) {
          this.hideMyAuto();
        } else {
          this.showMyAuto();
        }
      },
      {
        signal,
      }
    );

    this.savedAutoBackBtn?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        this.hideMyAuto();
      },
      {
        signal,
      }
    );

    this.finderCloseBtn?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        this.closeMobileFinderPopup();
      },
      {
        signal,
      }
    );

    return () => {
      this.setMode("auto");
      this.hideMyAuto();

      abortController.abort();
    };
  };

  public destroy = () => {
    if (this.destroyFn) this.destroyFn();
  };
}
