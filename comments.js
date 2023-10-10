// Create web server

var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Post = require('../models/post');
var User = require('../models/user');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

// Create a new comment

router.post('/new', function(req, res) {
    
        var token = req.body.token || req.headers['token'];
        if (token) {
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Failed to authenticate token' });
                } else {
                    var comment = new Comment({
                        text: req.body.text,
                        post: req.body.post,
                        user: decoded._doc._id
                    });
                    comment.save(function(err, comment) {
                        if (err) {
                            res.json({ success: false, message: 'Failed to save comment' });
                        } else {
                            res.json({ success: true, message: 'Comment saved', comment: comment });
                        }
                    });

                }
            }
        } else {
            res.json({ success: false, message: 'No token provided' });
        }
    }
});

// Get all comments
