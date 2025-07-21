import Finder from "./classes/Finder";
import ProductCard from "./classes/ProductCard";
import Select from "./classes/Select";
import Validator from "./classes/Validator";

export default function api() {
  const initializeSelect = (element: HTMLElement) => {
    return new Select(element);
  };

  const initializeValidation = (element: HTMLFormElement) => {
    return new Validator(element);
  };

  const initializeFinder = (element: HTMLElement) => {
    return new Finder(element);
  };

  const initializeProductCard = (element: HTMLElement) => {
    return new ProductCard(element);
  };

  //@ts-ignore
  window.carvilleApi = {
    initializeFinder,
    initializeSelect,
    initializeValidation,
    initializeProductCard,
  };
}
