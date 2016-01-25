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
router.get('/:_id', getCurrentTraining);

module.exports = router;


function registerTraining(req, res) {
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$" + JSON.stringify(req.body));
    trainingService.create(req.body)
        .then(function () {
            console.log("+++++++++++++++++ node mailer start ++++++++++++++")
            var nodemailer = require('nodemailer');
            // create reusable transporter object using the default SMTP transport
            //var transporter = nodemailer.createTransport('smtps://smitaborse518@gmail.com:sminishlokh@smtp.gmail.com');
            var smtpTransport = nodemailer.createTransport("SMTP", {
                service: "Gmail",
                auth: {
                    XOAuth2: {
                        user: "smitaborse518@gmail.com", // Your gmail address.
                        // Not @developer.gserviceaccount.com
                        clientId: "110591764818-mp60ovi2b6bm5haiajbrdicn7k5gmasl.apps.googleusercontent.com",
                        clientSecret: "DS1TXaw_vugKs6iKQw1s0uVy",
                        refreshToken: "1/ou-hU2fd9S1zMw6BbAU7t8ltxA54zfSB2vvJZDLI5Hw"
                    }
                }
            });
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: 'LnD <mangesh.b1710@yahoo.in>', // sender address
                to: 'mangueshb@smartek21.com, manguesh.borker@gmail.com,smitab@smartek21.com', // list of receivers
                subject: 'New training added', // Subject line
                text: 'New training added', // plaintext body
                html: 'New training added' // html body
            };

            smtpTransport.sendMail(mailOptions, function(error, response) {
                console.log("+++++++++++++++++ inside sendmail ++++++++++++++")
                if (error) {
                    console.log("+++++++++++++++++ inside error ++++++++++++++")
                    return console.log(error);
                } else {
                    console.log('Message sent: ' + response);
                }
                smtpTransport.close();
            });

            // send mail with defined transport object
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

function getCurrentTraining(req, res) {
    console.log("+++++++++++++++++++++++   i am here ++++++++++++++++++");
    trainingService.getById(req.params._id)
        .then(function (training) {
            if (training) {
                console.log("in success2");
                res.send(training);
            } else {
                console.log("in failure mure");
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

    var trainingId = req.params._id;
    trainingService.updateTraining(trainingId, req.body)
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