function startTransition(fn: () => any) {
  //@ts-ignore
  if (document.startViewTransition) {
    return document.startViewTransition(fn);
  } else {
    fn();
  }
}

export { startTransition };
