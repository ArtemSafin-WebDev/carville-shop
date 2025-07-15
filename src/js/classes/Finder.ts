import Select from "./Select";
import Validator from "./Validator";
import gsap from "gsap";
import { Flip } from "gsap/all";

gsap.registerPlugin(Flip);

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
  protected vinModeFormValidator: Validator | null = null;
  protected showMyAutoBtn: HTMLButtonElement | null = null;
  protected myAutoShown: boolean = false;
  protected myAutoDropdown: HTMLElement | null = null;

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
    if (this.vinModeForm)
      this.vinModeFormValidator = new Validator(this.vinModeForm);

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

  protected handleVinModeFormSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (this.vinModeFormValidator) {
      const isFormValid = this.vinModeFormValidator.validate();
      if (isFormValid) {
        // Тут должна быть отправка данных формы
      } else {
        console.error("Form is not valid");
      }
    }
  };

  protected init = () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const selectElements = Array.from(
      this.rootElement.querySelectorAll<HTMLElement>(".js-select")
    );
    const selects = selectElements.map((element) => new Select(element));
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

    this.vinModeForm?.addEventListener("submit", this.handleVinModeFormSubmit, {
      signal,
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

    return () => {
      this.setMode("auto");
      this.hideMyAuto();
      this.vinModeFormValidator?.destroy();
      selects.forEach((select) => select.destroy());
      abortController.abort();
    };
  };

  public destroy = () => {
    if (this.destroyFn) this.destroyFn();
  };
}
