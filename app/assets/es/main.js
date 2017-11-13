'use strict';

import { Post, Person, Student } from './models';

class App {
  constructor () {
    console.log('Constructor of the class');
  }

  init () {
    console.log('Initialization of the class App');

    const p = new Person('Philippe', 'De Pauw - Waterschoot');
    console.log(p);

  }
};

window.addEventListener('load', (ev) => {
  const app = new App();
  app.init();
});
