import Finder from "./classes/Finder";

export default function finder() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-finder")
  );

  const finders = elements.map((element) => new Finder(element));

  const openFinderBtns = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".js-open-finder-btn")
  );
  openFinderBtns.forEach((btn) =>
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      finders[0]?.showMobileFinderPopup();
    })
  );
}
