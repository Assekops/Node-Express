const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('favorites.user')
            .populate('favorites.campsites')
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (!favorite) {
                    Favorite.create({ user: req.user._id, campsites: [req.body.campsiteId] })
                        .then(favorites => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorites);
                        })
                        .catch(err => next(err));
                } else {
                    if (favorite.campsites.includes(campsiteId)) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    } else {
                        favorite.campsites.push(campsiteId);
                        favorite.save()
                            .then(favorites => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorites);
                            })
                            .catch(err => next(err));
                    }
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(favorite => {
                res.statusCode = 200;
                if ({ user: req.user._id }) {
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                } else {
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have any favorites to delete.');
                }
            })
            .catch(err => next(err));
    });

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    if (favorite.campsites.includes(req.body.campsiteId)) {
                        res.statusCode = 200;
                        res.json(favorite);
                        console.log('This campsite is already in your favorites');
                    } else {
                        favorite.campsites.push(req.body.campsiteId);
                        favorite.save()
                            .then(() => {
                                res.statusCode = 200;
                            })
                            .catch((err) => next(err));
                    }
                } else {
                    Favorite.create({ user: req.user._id, campsites: [req.body.campsiteId] })
                        .then(() => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    const campsiteId = req.params.campsiteId;
                    const index = favorite.campsites.indexOf(campsiteId);
                    if (index !== -1) {
                        favorite.campsites.splice(index, 1);
                        return favorite.save();
                    }
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
    });
module.exports = favoriteRouter;