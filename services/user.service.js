var config = require('config.json');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.connectionString);
var usersDb = db.get('users');
var trainingDb = db.get('trainings');
var _ = require('lodash');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

service.getAll = getAll;
service.getAllApprovedTraining = getAllApprovedTraining;
service.creditPoints = creditPoints;
module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    usersDb.findOne({
        username: username
    }, function (err, user) {
        if (err) deferred.reject(err);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({
                sub: user._id
            }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    usersDb.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    usersDb.findOne({
            username: userParam.username
        },
        function (err, user) {
            if (err) deferred.reject(err);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        usersDb.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    usersDb.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            usersDb.findOne({
                    username: userParam.username
                },
                function (err, user) {
                    if (err) deferred.reject(err);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        usersDb.findAndModify({
                _id: _id
            }, {
                $set: set
            },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    usersDb.remove({
            _id: _id
        },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}


function getAll() {

    var deferred = Q.defer();
    trainingDb.find({}, {}, function (err, training) {

        if (err) deferred.reject(err);

        if (training) {


            deferred.resolve(training);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAllApprovedTraining() {
    console.log("in");
    var deferred = Q.defer();
    trainingDb.find({
        "approvedStatus": true
    }, {}, function (err, training) {

        if (err) deferred.reject(err);

        if (training) {


            deferred.resolve(training);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

/*
 * Adds credit points to the user document
 */
function creditPoints(_id, points) {
    console.log("Crediting " + points + " to user " + _id);
    var deferred = Q.defer();
    usersDb.findById(_id, function (err, user) {
        if (err) deferred.reject(err);
        if (user) {
            (!user.creditPoints) ? (user.creditPoints = points) : (user.creditPoints += points);
            usersDb.findAndModify({
                    _id: user._id
                }, {
                    $set: user
                },
                function (err, doc) {
                    if (err) deferred.reject(err);

                    deferred.resolve(doc);

                });
            console.log(user);
        }
    });
    return deferred.promise;
}
