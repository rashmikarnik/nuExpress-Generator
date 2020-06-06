const express = require('express');
const bodyParser = require('body-parser');
/*importing partnerschema*/
const Partner = require('../models/partner');

const partnersRouter = express.Router();

/*partner router path */
partnersRouter.use(bodyParser.json());
partnersRouter.route('/')

    .get((req, res, next) => {
        Partner.find()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
    })
    .post((req, res, next) => {
        Partner.create(req.body)
            .then(partner => {
                console.log('Partner Created', partner);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Partners');
    })
    .delete((req, res, next) => {
        Partner.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

/*End Points  for partnerId*/
partnersRouter.route('/:partnersId')

    .get((req, res, next) => {
        Partner.findById(req.params.partnersId)
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
    })

    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /partner/${req.params.partnersId}`);
    })

    .put((req, res, next) => {
        Partner.findByIdAndUpdate(req.params.partnersId, {
            $set: req.body
        }, { new: true })
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
    })

    .delete((req, res, next) => {
        Partner.findOneAndDelete(req.params.partnersId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

module.exports = partnersRouter;