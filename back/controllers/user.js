// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Récupération des données dotenv
dotenv.config();

const User = require('../models/user');

// Inscription d'utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                rank: 0
            });
            // Si l'utilisateur a un format d'email valable, le compte est créé
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) {
                const accessToken = jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                    )
                user.save()
                    .then(() => res.status(201).json({      
                            userId: user._id,
                            rank: user.rank,
                            token: accessToken
                    }))
                    .catch(error => res.status(400).json({ error }));
            }
            else {
                res.status(401).json({ message: 'Entrez une adresse email valable (format exemple@groupomania.com).'});
            }
            
        })
        .catch(error => res.status(500).json({ error }));
};

// Connexion de l'utilisateur
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte.'})
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte.'})
                        } else {
                            const accessToken = jwt.sign(
                                { userId: user._id },
                                process.env.JWT_SECRET,
                                { expiresIn: '24h' }
                            );
                            res.status(200).json({
                                userId: user._id,
                                rank: user.rank,
                                token: accessToken
                            });
                        }
                    })
                    .catch(error => res.status(500).json({error}))
            }
        })
        .catch(error => res.status(500).json({error}))
};