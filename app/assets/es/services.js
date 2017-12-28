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
      'persons':
        {
          'students':
            []
        }
    }; // The data as value of the previous key aka connection string
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
      let personToJson = person.personToJson();
      this._dbData.persons.students.push(personToJson); // Add sticky note to the array
      this.save(); // Save this._dbData to the localstorage
      return person; // return the sticky note to the caller
    }
    return null;
  },
  // Find index of sticky note by id
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
