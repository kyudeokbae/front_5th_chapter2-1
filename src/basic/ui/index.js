import { createElement } from '../lib';
import { components } from './components';

const createLayout = () => {
  return createElement('div', {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    children: Object.values(components),
  });
};

const createContent = () => {
  return createElement('div', {
    className: 'bg-gray-100 p-8',
    children: [createLayout()],
  });
};

export const renderPage = () => {
  const root = document.getElementById('app');
  root.appendChild(createContent());
};
