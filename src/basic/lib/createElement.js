export const createElement = (tagName, options = {}) => {
  const element = document.createElement(tagName);

  if (options.id) element.id = options.id;
  if (options.className) element.className = options.className;
  if (options.textContent) element.textContent = options.textContent;
  if (options.innerHTML) element.innerHTML = options.innerHTML;

  if (options.children) {
    options.children.forEach((child) => element.appendChild(child));
  }

  if (options.events) {
    Object.entries(options.events).forEach(([event, handler]) => {
      element.addEventListener(event, handler);
    });
  }

  return element;
};
