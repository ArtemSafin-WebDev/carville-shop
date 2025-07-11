export default function tabs() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-tabs")
  );
  elements.forEach((element) => {
    const tabBtns = Array.from(
      element.querySelectorAll<HTMLButtonElement>(".js-tabs-btn")
    );
    const tabItems = Array.from(
      element.querySelectorAll<HTMLElement>(".js-tabs-item")
    );
    const setActiveTab = (index: number) => {
      tabBtns.forEach((btn) => btn.classList.remove("active"));
      tabItems.forEach((item) => item.classList.remove("active"));
      tabBtns[index].classList.add("active");
      tabItems[index].classList.add("active");
    };

    tabBtns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        setActiveTab(btnIndex);
      });
    });

    setActiveTab(0);
  });
}
