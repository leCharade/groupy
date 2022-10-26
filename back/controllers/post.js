const Post = require('../models/post');
const User = require('../models/user');
// const fs = require('fs');

// exports.getAllPosts = (req, res, next) => {
//     Post.find()
//         .then(posts => res.status(200).json(posts))
//         .catch(error => res.status(400).json({error}))
// }

// exports.getAllPosts = (req, res, next) => {
//     Post.find()
//         .then(posts => {
//             let listPosts = [];
//             for (singlePost of posts) {
//                 User.findOne({_id: singlePost.userId})
//                 .then(user => {
//                     const authorName = {author : user.firstName + ' ' + user.lastName};
//                     const postData = [singlePost, authorName];
//                     listPosts.push(postData);
//                 })
//             }
            
//             res.status(200).json(listPosts)
//         })
//         .catch(error => res.status(400).json({error}))
// }

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

    const post = new Post({
        userId: '633dbbee4ede08636c068bb4',
        message: req.body.message,
        time: Date(),
        // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        tag: 'Work',
        replies: 0,
        postReplies: [],
        likes: 0,
        usersLiked: [],
    });

    post.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({error}))
}