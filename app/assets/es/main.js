'use strict';
'use strict';

import { Person, Student } from './models';
import { GridOverlayElement } from './grid';
import Navigation from './nav';

class App {
  init () {}

  nav () {
    let navClicks = 1;
    let navState;
    const hamburger = document.querySelector('.hamburger img');
    const cross = document.querySelector('.cross');
    const pageContent = document.querySelector('#container');
    const nav = document.querySelector('#navigation');
    console.log('test');
    hamburger.addEventListener('click', ev => {
        navClicks++;
        if (navClicks % 2 == 0){
          nav.style.display = 'block';
          pageContent.style.display = 'none';
        } else {
          nav.style.display = 'none';
          pageContent.style.display = 'block';
        }
    });
    cross.addEventListener('click', ev => {
      navClicks++;
      if (navClicks % 2 == 0){
        nav.style.display = 'block';
        pageContent.style.display = 'none';
      } else {
        nav.style.display = 'none';
        pageContent.style.display = 'block';
      }
  });
  }
};

window.addEventListener('load', (ev) => {
  const app = new App();
  app.init();
  app.nav();
});
