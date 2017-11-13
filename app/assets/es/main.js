'use strict';

import { Post } from './models';

class App {
  constructor () {
    console.log('Constructor of the class');
  }

  init () {
    console.log('Initialization of the class App');
  }
};

window.addEventListener('load', (ev) => {
  const app = new App();
  app.init();
});
