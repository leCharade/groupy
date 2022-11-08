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

    // Pour qu'un utilisateur puisse modifier un post, il doit soit en être l'auteur, soit avoir un privilège administrateur.
    Post.findOne({ _id: req.params.id })
        .then (post => {
            // Si l'utilisateur est l'auteur du post, il est autorisé.
            if (post.userId === userId) {
                next();
            }
            else {
                // On cherche les données de l'utilisateur, et s'il a le rang 1, il est autorisé.
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