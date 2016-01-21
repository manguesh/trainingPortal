var config = require('config.json');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.connectionString);
var trainingDb = db.get('trainings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

var service = {};

//service.authenticate = authenticate;
service.getById = getById;
service.getAll = getAll;
service.create = create;
service.updateTraining = update;
service.delete = _delete;
service.getAllApproved = getAllApproved;

module.exports = service;

function getAll() {
    
    var deferred = Q.defer();
    trainingDb.find({}, {},function (err, training) {

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

function getAllApproved() {
    
    var deferred = Q.defer();
    trainingDb.find({"approvedStatus":true}, {},function (err, training) {

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



function getById(_id) {
    var deferred = Q.defer();

    trainingDb.findById(_id, function (err, training) {
        if (err) deferred.reject(err);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(training, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(trainingParam) {
    var deferred = Q.defer();

    // // validation
    // trainingDb.findOne(
    //    // { username: userParam.username },
    //     function (err, training) {
    //         if (err) deferred.reject(err);

    //         if (training) {
    //             // username already exists
    //             deferred.reject('Username "' + userParam.username + '" is already taken');
    //         } else {
                createTraining(trainingParam);
        //     }
        // });
         return deferred.promise;
    

    function createTraining(trainingParam) {
        // set user object to userParam without the cleartext password
var training = trainingParam;// _.omit(userParam, 'password');

        // add hashed password to user object
       // user.hash = bcrypt.hashSync(userParam.password, 10);

        trainingDb.insert(
            training,
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, trainingParam) {
    var deferred = Q.defer();

    // validation
    trainingDb.findById(_id, function (err, training) {
        if (err) deferred.reject(err);

        if (training.trainingName !== trainingParam.trainingName) {
            // username has changed so check if the new username is already taken
            trainingDb.findOne(
                { name: trainingParam.trainingName },
                function (err, training) {
                    if (err) deferred.reject(err);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.trainingName + '" is already taken')
                    } else {
                        updatetraining();
                    }
                });
        } else {
            updatetraining();
        }
    });

    function updatetraining() {
        // fields to update
        var set = {
            trainingName: trainingParam.trainingName,
            description: trainingParam.description,
            date:trainingParam.date,
            timing:training.timing,
            nominee:training.nominee,
            addedBy:user_id
        };

       
        trainingDb.findAndModify(
            { _id: _id },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    trainingDb.remove(
        { _id: _id },
        function (err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });

    return deferred.promise;
}