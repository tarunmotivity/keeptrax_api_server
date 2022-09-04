var UserService = require("../services/users.service");
var config = require("../../config/config");
var logger = config.getLogger(__filename);

module.exports.getAllUsers = (req, res) => {
  UserService.getAllUsers(req, (err, resp) => {
    if (err) {
      res.send(err);
    } else {
      res.send(resp);
    }
  });
};

module.exports.updateUser = (req, res) => {
  UserService.updateUser(req, req.body, (err, resp) => {
    if (err) {
      res.send(err);
    } else {
      res.send(resp);
    }
  });
};

module.exports.deleteUser = (req, res) => {
  UserService.deleteUser(req.headers, (err, resp) => {
    if (err) {
      res.send(err);
    } else {
      res.send(resp);
    }
  });
};

exports.addUser = (req, res) => {
  let team_id = req.body.team_id || "";

  var role = req.user.role;
  if (role && role == "MANAGER") {
    team_id = req.user.team_id;
  }

  const userPayload = {
    ...req.body,
    tripId: 1,
    manager_id: req.user._id,
    organization: req.user.organization,
    application: req.user.application,
    team_id: team_id,
    lockUntil: 0,
    oauth_id: null,
  };
  UserService.addUser(userPayload, (err, resp) => {
    if (err) {
      res.send(err);
    } else {
      res.send(resp);
    }
  });
};

exports.updatePassword = (req, res) => {
  UserService.updatePassword(req, (err, resp) => {
    if (err) {
      res.send(err);
    } else {
      res.send(resp);
    }
  });
};

exports.getUserById = (req, res) => {
  UserService.getUserById(req, req.params, (err, resp) => {
    if (err) {
      res.send(err);
    } else {
      res.send(resp);
    }
  });
};

exports.getManagerUser = (req, res) => {
  UserService.getManagerUser(req, (err, resp) => {
    if (err) {
      res.send(err);
    } else {
      res.send(resp);
    }
  });
};
