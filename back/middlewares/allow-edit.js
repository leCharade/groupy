// Imports
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const dotenv = require('dotenv');
const User = require('../models/user');

// Récupération des données dotenv
dotenv.config();

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    Post.findOne({ _id: req.params.id })
        .then (post => {
            if (post.userId === userId) {
                next();
            }
            else {
                console.log('on est là')
                User.findOne({ _id: userId })
                    .then(user => {
                        console.log(user);
                        if (user.rank === 1) {
                            next();
                        }
                        else {
                            res.status(401).json({ message: "Vous n'avez pas la permission d'effectuer cette action !" })
                        }
                    })
            }
        })
        .catch (error => res.status(500).json({ error }))         
}