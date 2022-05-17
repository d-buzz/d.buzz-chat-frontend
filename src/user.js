// const Gun = require("gun");
// const SEA = require("gun/sea");
// const AXE = require("gun/axe");

// const gun = new Gun({ peers: ["http://localhost:3030/gun"] });
let user;
// const user = gun.user().recall({ sessionStorage: true });
const signup = (username, password, newUser) => {
  if (newUser) {
    changeUser(newUser);
  }
  user.create(username, password, (params) => {
    if (param.err) {
    } else {
      login(username, password);
    }
  });
};
const login = (username, password, newUser) => {
  if (newUser) {
    changeUser(newUser);
  }
  user.auth(username, password, (params) => {
    if (params.err) {
      console.log(param.err);
    }
  });
};

const changeUser = (newUser) => {
  user = newUser;
};
const initialState = { messages: [] };
exports.signup = signup;
exports.changeUser = changeUser;
exports.login = login;
