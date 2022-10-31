// Imports
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const dotenv = require('dotenv');

// Récupération des données dotenv
dotenv.config();

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    Post.findOne({ _id: req.params.id })
        .then (post => {
            if (post.userId == userId) {
                res.status(401).json({ message: "Vous n'avez pas la permission d'effectuer cette action !" })
            }
            else {
                next();
            }
        })
        .catch (error => res.status(500).json({ error }))         
}