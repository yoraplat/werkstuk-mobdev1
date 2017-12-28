'use strict';
'use strict';

import { Person, Student } from './models';
import { GridOverlayElement } from './grid';
import Navigation from './nav';

class App {
  init () {
    this._applicationDbContext = ApplicationDbContext; // Reference to the ApplicationDbContext object
    this._applicationDbContext.init('ahs.nmd.stickynotes'); // Intialize the ApplicationDbContext with the connection string as parameter value
  }

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
      if (navClicks % 2 === 0) {
        nav.style.display = 'block';
        pageContent.style.display = 'none';
      } else {
        nav.style.display = 'none';
        pageContent.style.display = 'block';
      }
    });
    cross.addEventListener('click', ev => {
      navClicks++;
      if (navClicks % 2 === 0) {
        nav.style.display = 'block';
        pageContent.style.display = 'none';
      } else {
        nav.style.display = 'none';
        pageContent.style.display = 'block';
      }
    });
  }

  profileBtn () {
    const profileButton = document.querySelector('.profile-btn');
    let url = window.location.href;
    url = url.replace('http://localhost:8080/', '');
    url = (url === '') ? 'index.html' : url;
    let profilePage = (url === 'index.html') ? 'html/' : '';
    if (window.localStorage.getItem('loggedIn') !== null) {
      profilePage += 'profile.html';
      profileButton.setAttribute('href', profilePage);
    } else {
      profilePage += 'login.html';
      profileButton.setAttribute('href', profilePage);
    }
  }

  register () {
    const errorArray = {
      'onlyLetters': 'Name must contain only letters.',
      'notValidEmail': 'Not a valid email.',
      'emailError': 'You must use an email from the Artevelde University.',
      'onlyNumbers': 'Student Number must only contain numbers.',
      'studentNumberFixedLength': 'Student Number must contain 5 numbers',
      'DayOfBirth': 'Day of birth must be in DD/MM/YYYY format. Example: 10/10/1997',
      'passwordNotLongEnough': 'Password must contain more than 6 characters.',
      'passwordNotTheSame': 'The 2 passwords you filled in, do not match.'
    };
    const registerBtn = document.querySelector('#registerBtn');
    registerBtn.addEventListener('click', registerEvent);
    window.addEventListener('keydown', onEnter);

    function onEnter (e) {
      if (e.keyCode === 13) {
        registerEvent();
      }
    }

    function registerEvent () {
      const surName = document.querySelector('#surname');
      const firstName = document.querySelector('#firstname');
      const email = document.querySelector('#email');
      const studentNumber = document.querySelector('#studentnr');
      const dayOfBirth = document.querySelector('#dayofbirth');
      const password = document.querySelector('#password');
      const passwordRepeat = document.querySelector('#password-repeat');
      let readyForSubmit = true;
      if (!(/^[a-zA-Z]+/.test(surName.value))) {
        document.querySelector('#error__surname').innerHTML = errorArray['onlyLetters'];
        readyForSubmit = false;
      } else {
        document.querySelector('#error__surname').innerHTML = null;
      }
      if (!(/^[a-zA-Z]+$/.test(firstName.value))) {
        document.querySelector('#error__firstname').innerHTML = errorArray['onlyLetters'];
        readyForSubmit = false;
      } else {
        document.querySelector('#error__firstname').innerHTML = null;
      }
      if (!(/^.+@.+$/.test(email.value))) {
        document.querySelector('#error__email').innerHTML = errorArray['notValidEmail'];
        readyForSubmit = false;
      } else if (!(/^.+@student\.arteveldehs\.be$/.test(email.value))) {
        document.querySelector('#error__email').innerHTML = errorArray['emailError'];
        readyForSubmit = false;
      } else {
        document.querySelector('#error__email').innerHTML = null;
      }
      if (!(/^[0-9]+$/.test(studentNumber.value))) {
        document.querySelector('#error__studentnr').innerHTML = errorArray['onlyNumbers'];
        readyForSubmit = false;
      } else if (studentNumber.value.length !== 5) {
        document.querySelector('#error__studentnr').innerHTML = errorArray['studentNumberFixedLength'];
        readyForSubmit = false;
      } else {
        document.querySelector('#error__studentnr').innerHTML = null;
      }
      if (!(/^[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]$/.test(dayOfBirth.value))) {
        document.querySelector('#error__dayofbirth').innerHTML = errorArray['DayOfBirth'];
        readyForSubmit = false;
      } else {
        document.querySelector('#error__dayofbirth').innerHTML = null;
      }
      if (password.value.length < 6) {
        document.querySelector('#error__password').innerHTML = errorArray['passwordNotLongEnough'];
        readyForSubmit = false;
      } else {
        document.querySelector('#error__password').innerHTML = null;
      }
      if (password.value !== passwordRepeat.value) {
        document.querySelector('#error__password-repeat').innerHTML = errorArray['passwordNotTheSame'];
        readyForSubmit = false;
      } else {
        document.querySelector('#error__password-repeat').innerHTML = null;
      }
      if (readyForSubmit === true) {
        registerBtn.href = 'login.html';
        let person = new Student(studentNumber.value, email.value, firstName.value, surName.value, dayOfBirth.value);
      }
    }
  }
}

window.addEventListener('load', (ev) => {
  const app = new App();
  app.nav();
  app.profileBtn();
  if (window.location.href === 'http://localhost:8080/html/register.html' || window.location.href === 'http://localhost:8080/html/register.html#') {
    app.register();
  }
  app.init();
});
