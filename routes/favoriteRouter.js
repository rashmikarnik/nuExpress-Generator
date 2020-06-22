const express = require('express');
const bodyParser = require('body-parser');

const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

/* End points for favorites */
favoriteRouter.route('/')

    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find()
            .populate('user')
            .populate('campsites')
            .then(favorites => {
                res.sendStatus = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    for (let i = 0; i < req.body.length; i++) {
                        if (favorite.campsites.indexOf(req.body[i]._id) === -1) {
                            favorite.campsites.push(req.body[i]._id);
                        }
                    }
                    favorite.save()
                        .then((favorite) => {
                            console.log('Favorite Created', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                }
                else {
                    Favorite.create({ user: req.user._id, campsites: req.body })
                        .then((favorite) => {
                            console.log('Favorite Created', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                }
            })
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

//favoriteRouter.route('/:campsiteId')

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    if (favorite.campsites.indexOf(req.params.campsiteId) === -1) {
                        favorite.campsites.push(req.params.campsiteId)
                        favorite.save()
                            .then((favorite) => {
                                console.log('Favorite Created ', favorite);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, (err) => next(err))
                    }
                    if (favorite.campsites.includes(req.params.campsiteId)) {
                        res.end(`Campsite already marked Favorite`);
                    }
                }
                else {
                    Favorite.create({ "user": req.user._id, "campsites": [req.params.campsiteId] })
                        .then((favorite) => {
                            console.log('Favorite Created ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err))
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorite.findOne({ user: req.user._id })
            .then(response => {
                if (response) {
                    const deleteIndex = response.campsites.indexOf(req.params.campsiteId);
                    console.log('rashmi' + deleteIndex);
                    response.campsites.splice(deleteIndex, 1);
                    response.save()
                        .then(response => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(response);
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    });

module.exports = favoriteRouter;