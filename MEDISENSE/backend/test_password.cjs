// Quick diagnostic: checks whether a candidate password matches a stored
// bcrypt hash. Run from inside your backend folder where bcryptjs is
// already installed.
//
// Usage: node test_password.js

const bcrypt = require('bcryptjs');

const STORED_HASH = '$2a$12$dDci35jiAuw5zmBqTD/z1Oru/bBvyRZQt/Cr99Mnnlk82rEuWvoN6';

const candidates = ['Admin@12345', 'admin@12345', 'Admin@1234', 'Admin@123456', ' Admin@12345', 'Admin@12345 '];

candidates.forEach((pw) => {
  console.log(`"${pw}" matches:`, bcrypt.compareSync(pw, STORED_HASH));
});
