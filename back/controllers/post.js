const Post = require('../models/post');
const User = require('../models/user');
// const fs = require('fs');

exports.getAllPosts = (req, res, next) => {
    Post.find()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({error}))
}

exports.getOnePost = (req, res, next) => {
    Post.findOne({_id: req.params.id})
        .then(post => {
            User.findOne({_id: post.userId})
                .then(user => {
                    const authorName = user.firstName + ' ' + user.lastName;
                    res.status(200).json({post, authorName})
                })
            })
        .catch(error => res.status(404).json({error}))
}

exports.createPost = (req, res, next) => {
    let message = req.body;
    let message2 = req.params;
    console.log(message);
    console.log(message2);
    /*
    const post = new Post({
        userId: '63206fc2597118fb47266e2c',
        message: message,
        time: Date(),
        imageUrl: '',
        tag: 'Work',
        replies: 0,
        postReplies: [],
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    console.log(post)
    post.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({error}))
        */
}