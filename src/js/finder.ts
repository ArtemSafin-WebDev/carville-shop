import Finder from "./classes/Finder";

export default function finder() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-finder")
  );

  elements.forEach((element) => new Finder(element));
}
