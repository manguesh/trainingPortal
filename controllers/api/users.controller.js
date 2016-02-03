var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);

router.get('/all', getAllTraining);
router.get('/allapproved', getAllApproved);
/**
 *@api {put} /api/users/:_id/creditPoints Credit Points to user
 *@apiName addCreditPoints
 *@apiGroup Users
 *@apiParam {Number} id Users unique ID
 *@apiSuccess {JSON} User data
 */
router.put('/:_id/creditPoints', addCreditPoints);
/**
 *@api {get} /api/users/getAllUsers get all registered users
 *@apiName getAllUsers
 *@apiGroup Users
 *@apiSuccess {JSON} List of registered Users
 */
router.get('/getAllUsers', getAllUsers);
module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({
                    token: token
                });
            } else {
                // authentication failed
                res.sendStatus(401);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {

    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllTraining(req, res) {
    userService.getAll()
        .then(function (training) {
            if (training) {
                res.send(training);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllApproved(req, res) {
    console.log("in cont");
    userService.getAllApprovedTraining()
        .then(function (training) {
            if (training) {
                res.send(training);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addCreditPoints(req, res) {
    console.log("Requested addCreditPoints ");
    var userToCreditPoint = req.params._id;
    console.log(userToCreditPoint);
    if (userToCreditPoint) {
        console.log("Adding credits to user : " + userToCreditPoint);
        // Need to find the user and credit 8 points
        userService.creditPoints(userToCreditPoint, 8).then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        }).catch(function (err) {
            res.status(400).send(err);
        });
    } else {
        console.log("User ID did not come through!");
        res.send(400);
    }
}

function getAllUsers(req, res) {
    console.log("GetAllUsers requested! ");
    userService.getAllUsers().then(function (users) {
            if (users) {
                res.send(users);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
