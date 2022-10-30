const Post = require('../models/post');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// const fs = require('fs');

// Requête pour obtenir tous les posts
exports.getAllPosts = (req, res, next) => {

    // Pour chaque élément de l'array posts, on cherche à obtenir le post, le nom de l'auteur, et les droits de l'utilisateur qui a fait la requête.
    const posts = [];

    // Tout d'abord, on récupère tous les posts de la base de données.
    Post.find({replyTo: 'ORIGINAL'})
        .then(listPosts => {

            // Ensuite, pour chaque post, on cherche l'auteur correspondant à l'userId.
            let i = 0;
            for (post of listPosts) {
                let postContent = post;  // <-- Utilisation d'une variable pour que le script fonctionne POSEZ PAS DE QUESTIONS MERCI
                User.findOne({_id: post.userId, replyTo: 'ORIGINAL'})
                    .then(user => {
                        const authorName = user.firstName + ' ' + user.lastName; // On définit le nom de l'auteur à partir du firstName et du lastName
                        
                        // Ensuite, il convient de vérifier si l'utilisateur :
                        // 1) S'il est l'auteur ou un administrateur, auquel cas il peut modifier ou supprimer le post ;
                        // 2) N'est pas l'auteur du post, auquel cas il peut liker celui-ci .
                        let editStatus = false;
                        let likeStatus = false;
                        const token = req.headers.authorization.split(' ')[1];
                        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                        const userId = decodedToken.userId;
                        
                        // Si l'utilisateur est l'auteur du post : true
                        Post.findOne({ _id: postContent._id })
                            .then (editPost => {
                                if (editPost.userId === userId) {
                                    editStatus = true;
                                    return editStatus;
                                }
                                else {
                                    // Si l'utilisateur a un rank 1 : true
                                    User.findOne({ _id: userId })
                                        .then (statusUser => {
                                            if (statusUser.rank === 1) {
                                                editStatus = true;
                                                return editStatus;
                                            }
                                        })
                                }
                            })  
                        // Si l'utilisateur n'est pas l'auteur du post : true
                        Post.findOne({ _id: postContent._id })
                            .then (likePost => {
                                if (likePost.userId !== userId) {
                                    likeStatus = true;
                                }
                                return likeStatus;
                            })
                        
                        // On établit les statuts et on push le tout
                        // const status = [editStatus, likeStatus];
                        // posts.push({postContent, authorName, status});

                        posts.push({postContent, authorName});
                        i++;
                        if (listPosts.length <= i) {
                            posts.sort((a,b) => b.postContent.time - a.postContent.time);
                            res.status(200).json(posts);
                        }
                    })
            }
            
        })
        .catch(error => res.status(400).json({error}))
}

exports.getOnePost = (req, res, next) => {
    const posts = [];
    Post.findOne({_id: req.params.id})
        .then(post => {
            User.findOne({_id: post.userId})
                .then(user => {
                    const authorName = user.firstName + ' ' + user.lastName;
                    posts.push({post, authorName});
                    const listReplies = post.postReplies;
                    let i = 0;
                    for (reply of listReplies) {
                        const replyId = reply.toHexString();
                        Post.findOne({_id: replyId})
                            .then(post => {
                                User.findOne({_id: post.userId})
                                    .then(replyUser => {
                                        const authorName = replyUser.firstName + ' ' + replyUser.lastName;
                                        posts.push({post, authorName});
                                        i++;
                                        if (listReplies.length <= i) {
                                            res.status(200).json(posts);
                                        }
                                    })
                            })
                    }
                })
            })
        .catch(error => res.status(404).json({error}))
}

exports.createPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const authorId = decodedToken.userId;

    const post = new Post({
        userId: authorId,
        message: req.body.message,
        time: Date.now(),
        // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        tag: req.body.tag,
        replies: 0,
        postReplies: [],
        likes: 0,
        usersLiked: [],
        replyTo: 'ORIGINAL'
    });

    post.save()
        .then(() => res.status(201).json({ message: 'Post envoyé !' }))
        .catch(error => res.status(400).json({error}))
}

exports.replyPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const authorId = decodedToken.userId;

    const post = new Post({
        userId: authorId,
        message: req.body.message,
        time: Date.now(),
        // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        usersLiked: [],
        replyTo: req.params.id
    });

    post.save()
        .then(() => {
            Post.updateOne({ _id: req.params.id }, { 
                $push: { postReplies: post._id },
                $inc: { replies: +1 },
            })
                .then(() => res.status(200).json({ message: 'Post envoyé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({error}))
}

exports.modifyPost = (req, res, next) => {
    const postObject = { ...req.body };
    delete postObject._id;
    delete postObject._userId;
    delete postObject.replies;
    delete postObject.postReplies;
    delete postObject.likes;
    delete postObject.usersLiked;
    Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Post modifié!' }))
        .catch(error => res.status(400).json({ error }));
}