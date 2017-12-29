'use strict';
'use strict';

import { Person, Student } from './models';
import { GridOverlayElement } from './grid';
import Navigation from './nav';

class App {
  init () {
    this._applicationDbContext = ApplicationDbContext; // Reference to the ApplicationDbContext object
    this._applicationDbContext.init('json'); // Intialize the ApplicationDbContext with the connection string as parameter value
  }

  loadJson () {
    
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

  login () {
    let loginButton = document.querySelector('.loginBtn');
    loginButton.addEventListener('click', loginEvent);

    function loginEvent () {
      
    let emailInput = document.querySelector('#loginEmail').value;
    let loginPassword = document.querySelector('#loginPassword').value;
      this._applicationDbContext = ApplicationDbContext; // Reference to the ApplicationDbContext object
        this._applicationDbContext.init('json'); // Intialize the ApplicationDbContext with the connection string as parameter value
        for (let i = 0; i<= 3; i++){
          if (this._applicationDbContext._dbData.persons.students[i].email == emailInput && this._applicationDbContext._dbData.persons.students[i].password == loginPassword){
            console.log("Logged in succesfull");
            window.localStorage.setItem('loggedIn', true);
            window.location.href = window.location.href.replace("login.html", "profile.html");
            App.profileBtn();
            break;
          }
          else {
            console.log("Wrong email or password");
          }
          
        }
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
        person.password = password.value;
        this._applicationDbContext = ApplicationDbContext; // Reference to the ApplicationDbContext object
        this._applicationDbContext.init('json'); // Intialize the ApplicationDbContext with the connection string as parameter value
        this._applicationDbContext.addUser(person);
        this._applicationDbContext._dbData = window.localStorage.getItem('json');
        console.log(this._applicationDbContext._dbData);
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
  app.login();
});

/*
  ApplicationDbContext
  --------------------
  1) Database transactions: CRUD operations
  2) Cache for loaded content / data
  */
var ApplicationDbContext = {
  'init': function (connectionStr) {
    this._connectionStr = connectionStr; // Connection String to the key in the localstorage
    this._dbData = {
      "persons": {
        "students": [
          {
            "firstname": "Koen",
            "surname": "Janssens",
            "dayofbirth": "22/03/1997",
            "studentnumber": "54523",
            "traject": "Crossmedia-ontwerp",
            "email": "yoraplat@arteveldehs.be",
            "projects": [
              1,
              3
            ],
            "password": "secret",
            "profilePicture": "",
            "startStudies": "20/08/2016"
          },
          {
            "firstname": "Bert",
            "surname": "Braak",
            "dayofbirth": "27/05/1960",
            "studentnumber": "12356",
            "traject": "Multimedia-productie",
            "email": "ysdlat@arteveldehs.be",
            "projects": [
              2.4
            ],
            "password": "geheimpje",
            "profilePicture": "",
            "startStudies": "20/08/2015"
          }
        ],
        "administrator": [
          {
            "firstname": "admin",
            "email": "admin@arteveldehs.be",
            "password": "little-secret"
          }
        ]
      },
      "projects": [
        {
          "project": 1,
          "title": "Kinderboerderij",
          "description": "Als eindwerk voor de tweede jaar ontwikkelden de studenten Graphic Design een huisstijl voor een lokale kinderboerderij. Jules Van Rijsselberge ontwierp een sterk, uitgepuurd logo. Een functioneel uithangbord voor de organisatie. Hij combineert in zijn ontwerp een strakke vormgeving met een spontane, kindvriendelijke illustratiestijl gebaseerd op    een digitale wasco-techniek.",
          "imgSrc": [
            "http://www.gdm.gent/trots/assets/projects/kinderboerderij/1.logo.jpg",
            "http://www.gdm.gent/trots/assets/projects/kinderboerderij/3.illustraties.jpg",
            "http://www.gdm.gent/trots/assets/projects/kinderboerderij/5.schetsposter.jpg"
          ],
          "course": "Graphic Design"
        },
        {
          "project": 2,
          "title": "Didactische plaat",
          "description": "Ontwerp van een didactische plaat met als onderwerp 'classic cars'.",
          "imgSrc": [
            "http://www.gdm.gent/trots/assets/projects/bmw/1.visual.png",
            "http://www.gdm.gent/trots/assets/projects/bmw/2.poster.png"
          ],
          "course": "Graphic Design"
        },
        {
          "project": 3,
          "title": "Melk Campagne",
          "description": "Opdracht: bedenkt een nieuwe merknaam en ontwerp de verpakkingen voor 3 soorten melk. Vol, halfvol en melk met een speciaal smaakje. Er werd een huisstijl uitgewerkt die tevens de basis vormde voor een bijhorende reclamecampagne.",
          "imgSrc": [
            "http://www.gdm.gent/trots/assets/projects/milk/3_halfvolverpakking.png",
            "http://www.gdm.gent/trots/assets/projects/milk/5_appmockup.png"
          ],
          "course": "Photo Design"
        },
        {
          "project": 4,
          "title": "Dagboeknotities",
          "description": "In deze opdracht staat de verwondering centraal. In de briefing staat: 'laat je verwonderen door de kleine dingen en gebeurtenissen rond je. Kijk door een lens zoals een kind en ontdek de wereld om je heen'",
          "imgSrc": [
            "http://www.gdm.gent/trots/assets/projects/dagboeknotities/4.png",
            "http://www.gdm.gent/trots/assets/projects/dagboeknotities/5.png"
          ],
          "course": "Photo Design"
        }
      ],
      "pages": [
          {
              "pageName": "Home",
              "title": "Showcase"
          }
            
        ],
        "blogposts": [
          {
            "title": "First Post",
            "author": "GDM",
            "postDate": "10/11/2017",
            "postContent": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod beatae similique sed quisquam error neque fugit sapiente aliquid doloremque illo ipsum atque nulla laborum, cupiditate doloribus. Modi odit, laboriosam nam consequuntur ea aut eveniet iste placeat saepe. Laudantium commodi provident incidunt molestias possimus in atque et vel ad neque fugiat assumenda quia alias nisi voluptate rem non doloremque velit quidem voluptas nam obcaecati dignissimos, maiores veritatis. Error vero velit consequatur eius similique reprehenderit voluptatibus voluptatem beatae, a nostrum aperiam architecto!"
          }
        ]
    }
    // The data as value of the previous key aka connection string
    // Get the sored data with the key. If the data is not present in the localstorage --> store the previous data from the variable _dbData into the localstorage via the connection string or namespace
    if (window.localStorage.getItem(this._connectionStr) != null) {
      this._dbData = JSON.parse(window.localStorage.getItem(this._connectionStr));
    } else {
      window.localStorage.setItem(this._connectionStr, JSON.stringify(this._dbData));
    }
  },
  // Get all users
  'getUser': function () {
    const data = this._dbData.persons.students;
    if (data === null || (data !== null && data.length === 0)) {
      return null;
    }
    return data;
  },
  // Add a new user
  'addUser': function (person) {
    if (person !== undefined && person !== null) {
      let personToJson = {
        'firstname': person.firstName,
        'surname': person.surName,
        'dayofbirth': person.dayOfBirth,
        'studentnumber': person.studentNr,
        'email': person.emailSchool,
        'projects': person.projects,
        'password': person.password
      };
      this._dbData.persons.students.push(personToJson); // Add User note to the array
      this.save(); // Save this._dbData to the localstorage
      return person; // return the User to the caller
    }
    return null;
  },
  // Find User By Email
  'findUserByEmail': function (email) {
    const data = this.getUser();
    if (data == null) {
      return -1;
    }

    // Ugly
    let match = false;
    let i = 0;
    let user;
    while (!match && i < data.length) {
      user = data[i];
      if (user.persons.students.email === email) {
        match = true;
      } else {
        i++;
      }
    }
    if (match) {
      return email;
    }
    return -1;
  },
  'save': function () {
    window.localStorage.setItem(this._connectionStr, JSON.stringify(this._dbData)); // Write the _dbData into the localstorage via the key
    return true; // Always true in modern webbrowsers
  }
};
