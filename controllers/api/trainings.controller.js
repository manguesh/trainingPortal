var config = require('config.json');
var express = require('express');
var router = express.Router();
var trainingService = require('services/training.service');

// routes
//router.post('/authenticate', authenticateUser);
router.post('/add', registerTraining);
router.get('/all', getAllTraining);
router.put('/:_id', updateTraining);
router.delete('/:_id', deleteTraining);
router.get('/approved',getAllApproved);

module.exports = router;


function registerTraining(req, res) {
    
    trainingService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllTraining(req, res) {
    trainingService.getAll()
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
    trainingService.getAllApproved()
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

function updateTraining(req, res) {
    var trainingId = req.training.sub;
    if (req.params._id !== trainingId) {
        // can only update own account
        return res.status(401).send('You can only update your own trainings');
    }

    trainingService.update(trainingId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteTraining(req, res) {
    var trainingId = req.training.sub;
    if (req.params._id !== trainingId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own Trainings');
    }

    trainingService.delete(trainingId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}