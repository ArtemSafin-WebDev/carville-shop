document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello from backend.js");

  const search = document.querySelector(".page-header__search");
  if (search) {
    const form = search.querySelector(".page-header__search-form");
    const submitBtn = search.querySelector(".page-header__search-submit");
    const input = search.querySelector(".page-header__search-input");
    const overlay = search.querySelector(".page-header__search-overlay");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    input.addEventListener("focus", () => {
      document.body.classList.add("search-active");
    });

    submitBtn.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("search-active");
    });

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        document.body.classList.remove("search-active");
      }
    });
  }

  const elements = Array.from(document.querySelectorAll(".js-finder"));

  const finders = elements.map((element) =>
    window.carvilleApi.initializeFinder(element)
  );

  const openFinderBtns = Array.from(
    document.querySelectorAll(".js-open-finder-btn")
  );
  openFinderBtns.forEach((btn) =>
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      console.log(finders[0]);
      finders.at(-1)?.showMobileFinderPopup();
    })
  );

  const findByAuto = Array.from(document.querySelectorAll(".js-find-by-auto"));
  findByAuto.forEach((element) => {
    const submitBtn = element.querySelector(".finder__submit-btn");
    const brandSelectElement = element.querySelector(".js-brand-select");
    const groupSelectElement = element.querySelector(".js-group-select");
    const modelSelectElement = element.querySelector(".js-model-select");
    const yearSelectElement = element.querySelector(".js-years-select");

    const modificationSelectElement = element.querySelector(
      ".js-modification-select"
    );
    const engineSelectElement = element.querySelector(".js-engine-select");
    const brandSelectInstance =
      window.carvilleApi.initializeSelect(brandSelectElement);
    const groupSelectInstance =
      window.carvilleApi.initializeSelect(groupSelectElement);
    let modelSelectInstance = null;
    let yearSelectInstance = null;
    let engineSelectInstance = null;
    let modificationSelectInstance = null;

    element.addEventListener("click", (event) => {
      if (
        event.target.matches(".js-select-choose-model") ||
        event.target.closest(".js-select-choose-model")
      ) {
        event.preventDefault();
        if (brandSelectInstance) brandSelectInstance.hideMobilePopup();
        if (modelSelectInstance) modelSelectInstance.showMobilePopup();
      }
      if (
        event.target.matches(".js-select-choose-year") ||
        event.target.closest(".js-select-choose-year")
      ) {
        event.preventDefault();
        if (modelSelectInstance) modelSelectInstance.hideMobilePopup();
        if (yearSelectInstance) yearSelectInstance.showMobilePopup();
      }
      if (
        event.target.matches(".js-select-choose-engine") ||
        event.target.closest(".js-select-choose-engine")
      ) {
        event.preventDefault();
        if (yearSelectInstance) yearSelectInstance.hideMobilePopup();
        if (engineSelectInstance) engineSelectInstance.showMobilePopup();
      }
      if (
        event.target.matches(".js-select-choose-modification") ||
        event.target.closest(".js-select-choose-modification")
      ) {
        event.preventDefault();
        if (engineSelectInstance) engineSelectInstance.hideMobilePopup();
        if (modificationSelectInstance)
          modificationSelectInstance.showMobilePopup();
      }
      if (
        event.target.matches(".js-select-choose-group") ||
        event.target.closest(".js-select-choose-group")
      ) {
        event.preventDefault();
        if (modificationSelectInstance)
          modificationSelectInstance.hideMobilePopup();
        if (groupSelectInstance) groupSelectInstance.showMobilePopup();
      }
    });

    const destroy = (options) => {
      if (options.model) {
        modelSelectInstance?.destroy();
        modelSelectInstance = null;
      }
      if (options.years) {
        yearSelectInstance?.destroy();
        yearSelectInstance = null;
      }
      if (options.engine) {
        engineSelectInstance?.destroy();
        engineSelectInstance = null;
      }

      if (options.modification) {
        modificationSelectInstance?.destroy();
        modificationSelectInstance = null;
      }
    };

    const validate = () => {
      const selectsToValidate = [
        brandSelectInstance,
        modelSelectInstance,
        groupSelectInstance,
        yearSelectInstance,
        modificationSelectInstance,
      ];
      const isValid = selectsToValidate.every((select) => {
        if (!select) return false;
        const value = select.value;
        if (!value) return false;
        if (Array.isArray(value) && !value.length) return false;
        return true;
      });
      if (isValid) {
        submitBtn.disabled = false;
        console.log("Valid", selectsToValidate);
      } else {
        submitBtn.disabled = true;
        console.log(
          "Not Valid",
          selectsToValidate.map((item) => item?.value)
        );
      }
    };

    brandSelectElement.addEventListener("select:set", () => {
      destroy({
        model: true,
        years: true,
        engine: true,
        modification: true,
      });

      const brandValue = brandSelectInstance.value;
      // Направляется аякс запрос со значением бренда для получения моделей, меняется разметка селекта моделей
      modelSelectInstance =
        window.carvilleApi.initializeSelect(modelSelectElement);

      console.log("brand values", brandValue);

      validate();
    });

    brandSelectElement.addEventListener("select:clear", () => {
      destroy({
        model: true,
        years: true,
        engine: true,
        modification: true,
      });

      validate();
    });
    modelSelectElement.addEventListener("select:set", () => {
      destroy({
        years: true,
        engine: true,
        modification: true,
      });

      const modelValue = modelSelectInstance.value;
      // Направляется аякс запрос со значением модели для получения годов, меняется разметка селекта годов
      yearSelectInstance =
        window.carvilleApi.initializeSelect(yearSelectElement);

      console.log("model values", modelValue);
    });

    modelSelectElement.addEventListener("select:clear", () => {
      destroy({
        years: true,
        engine: true,
        modification: true,
      });
      validate();
    });
    yearSelectElement.addEventListener("select:set", () => {
      destroy({
        engine: true,
        modification: true,
      });

      const yearsValue = yearSelectInstance.value;

      engineSelectInstance =
        window.carvilleApi.initializeSelect(engineSelectElement);

      console.log("years values", yearsValue);
      validate();
    });

    yearSelectElement.addEventListener("select:clear", () => {
      destroy({
        engine: true,
        modification: true,
      });
      validate();
    });
    engineSelectElement.addEventListener("select:set", () => {
      destroy({
        modification: true,
      });
      const engineValue = yearSelectInstance.value;

      modificationSelectInstance = window.carvilleApi.initializeSelect(
        modificationSelectElement
      );

      console.log("engine value", engineValue);
      validate();
    });

    engineSelectElement.addEventListener("select:clear", () => {
      destroy({
        modification: true,
      });
      validate();
    });
    modificationSelectElement.addEventListener("select:set", () => {
      const modificationValue = modificationSelectInstance.value;

      console.log("modification value", modificationValue);

      validate();
    });

    modificationSelectElement.addEventListener("select:clear", () => {
      validate();
    });

    groupSelectElement.addEventListener("select:set", () => {
      const groupValue = groupSelectInstance.value;

      console.log("group value", groupValue);

      validate();
    });

    groupSelectElement.addEventListener("select:clear", () => {
      validate();
    });
  });

  const findByVin = Array.from(document.querySelectorAll(".js-find-by-vin"));

  findByVin.forEach((element) => {
    const brandSelectElement = element.querySelector(".js-brand-select");
    const modelSelectElement = element.querySelector(".js-model-select");
    const form = element.querySelector(".js-vin-mode-form");
    const brandSelectInstance =
      window.carvilleApi.initializeSelect(brandSelectElement);
    let validator = window.carvilleApi.initializeValidation(form);
    let modelSelectInstance = null;

    element.addEventListener("click", (event) => {
      if (
        event.target.matches(".js-select-choose-model") ||
        event.target.closest(".js-select-choose-model")
      ) {
        event.preventDefault();
        if (brandSelectInstance) brandSelectInstance.hideMobilePopup();
        if (modelSelectInstance) modelSelectInstance.showMobilePopup();
      }
    });

    const handleSubmit = (event) => {
      if (validator) {
        event.preventDefault();
        const isValid = validator.validate();
        if (isValid) {
          const data = new FormData(form);
          // Отправить данные

          console.log("Отправка данных");
        }
      }
    };

    brandSelectElement.addEventListener("select:set", () => {
      if (modelSelectInstance) {
        modelSelectInstance.destroy();
        modelSelectInstance = null;
      }
      const brandValue = brandSelectInstance.value;
      // Направляется аякс запрос со значением бренда для получения моделей, меняется разметка селекта моделей
      modelSelectInstance =
        window.carvilleApi.initializeSelect(modelSelectElement);

      console.log("brand values", brandValue);
    });

    brandSelectElement.addEventListener("select:clear", () => {
      if (modelSelectInstance) {
        modelSelectInstance.destroy();
        modelSelectInstance = null;
      }
    });

    form.addEventListener("submit", handleSubmit);
  });

  const subscribeForm = document.querySelector(".js-subscribe-form");

  if (subscribeForm) {
    const validator = window.carvilleApi.initializeValidation(subscribeForm);
    const input = subscribeForm.querySelector("input[name='email']");
    subscribeForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (subscribeForm.classList.contains("success")) return;
      const isValid = validator.validate();
      if (isValid) {
        console.log("Отправка формы подписки");
        try {
          const response = await fetch(subscribeForm.action, {
            method: "POST",
            body: new FormData(subscribeForm),
          });
          if (response.ok) {
            subscribeForm.classList.add("success");
            validator.reset();
            input.readonly = true;
          } else {
            throw new Error("Failed to subscribe");
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
});
