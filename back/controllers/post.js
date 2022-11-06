const Post = require('../models/post');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');

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
                    if (listReplies.length > 0) {
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
                                                posts.sort((a,b) => a.post.time - b.post.time);
                                                res.status(200).json(posts);
                                            }
                                        })
                                })
                        }
                    }
                    else {
                        res.status(200).json(posts);
                    }
                })
            })
        .catch(error => res.status(404).json({error}))
}

exports.createPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const authorId = decodedToken.userId;

    let image = ''
    if (req.file) {
        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }

    const post = new Post({
        userId: authorId,
        message: req.body.message,
        time: Date.now(),
        imageUrl: image,
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
    let image = ''
    if (req.file) {
        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }

    const post = new Post({
        userId: authorId,
        message: req.body.message,
        time: Date.now(),
        imageUrl: image,
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
    console.log(req.body);
    if (req.file) {
        Post.findOne({ _id: req.params.id })
            .then(post => {
                // Suppression de l'image d'origine et ajout de la nouvelle image
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    let postObject = [];
                    if (post.replyTo === 'ORIGINAL') {
                        postObject = {
                            userId: post.userId,
                            message: req.body.message,
                            time: post.time,
                            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                            tag: req.body.tag,
                            replies: post.replies,
                            postReplies: post.postReplies,
                            likes: post.likes,
                            usersLiked: post.usersLiked,
                            replyTo: 'ORIGINAL'
                        }
                    }
                    else {
                        postObject = {
                            userId: post.userId,
                            message: req.body.message,
                            time: post.time,
                            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                            likes: post.likes,
                            usersLiked: post.usersLiked,
                            replyTo: req.params.id
                        }
                    }
                    Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Post modifié !' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        Post.findOne({ _id: req.params.id })
            .then(post => {
                let postObject = [];
                if (post.replyTo === 'ORIGINAL') {
                    postObject = {
                        userId: post.userId,
                        message: req.body.message,
                        time: post.time,
                        imageUrl: post.imageUrl,
                        tag: req.body.tag,
                        replies: post.replies,
                        postReplies: post.postReplies,
                        likes: post.likes,
                        usersLiked: post.usersLiked,
                        replyTo: 'ORIGINAL'
                    }
                }
                else {
                    postObject = {
                        userId: post.userId,
                        message: req.body.message,
                        time: post.time,
                        imageUrl: post.imageUrl,
                        likes: post.likes,
                        usersLiked: post.usersLiked,
                        replyTo: req.params.id
                    }
                }
                Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Post modifié !' }))
                    .catch(error => res.status(400).json({ error }));
            })
    }
};

exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id})
        .then(deletedPost => {
            if (deletedPost.replyTo === 'ORIGINAL') {
                let i = 0;
                if (deletedPost.replies > 0) {
                    const listReplies = deletedPost.postReplies;
                    for (reply of listReplies) {
                        const replyId = reply.toHexString();
                        Post.findOne({_id: replyId})
                            .then(replyToDelete => {
                                if (replyToDelete.imageUrl !== '') {
                                    const filename = replyToDelete.imageUrl.split('/images/')[1];
                                    fs.unlink(`images/${filename}`, () => {
                                        Post.deleteOne({_id: replyId})
                                            .then(() => console.log('Post supprimé.'))
                                        })
                                }
                                else {
                                    Post.deleteOne({_id: replyId})
                                        .then(() => console.log('Post supprimé.'))
                                }
                                i++;
                                if (listReplies.length <= i) {
                                    if (deletedPost.imageUrl !== '') {
                                        const filename = deletedPost.imageUrl.split('/images/')[1];
                                        fs.unlink(`images/${filename}`, () => {
                                            Post.deleteOne({_id: req.params.id})
                                                .then(() => res.status(200).json({message : 'Post supprimé !'}))
                                                .catch(error => res.status(401).json({error}));
                                        })
                                    }
                                    else {
                                        Post.deleteOne({_id: req.params.id})
                                            .then(() => res.status(200).json({message : 'Post supprimé !'}))
                                            .catch(error => res.status(401).json({error}));
                                    }
                                }
                            })
                            .catch(error => req.status(500).json({error}));
                    }
                }
                else {
                    if (deletedPost.imageUrl !== '') {
                        const filename = deletedPost.imageUrl.split('/images/')[1];
                        fs.unlink(`images/${filename}`, () => {
                            Post.deleteOne({_id: req.params.id})
                                .then(() => res.status(200).json({message : 'Post supprimé !'}))
                                .catch(error => res.status(401).json({error}));
                        })
                    }
                    else {
                        Post.deleteOne({_id: req.params.id})
                            .then(() => res.status(200).json({message : 'Post supprimé !'}))
                            .catch(error => res.status(401).json({error}));
                    }
                }
            }
            else {
                if (deletedPost.imageUrl !== '') {
                    const filename = deletedPost.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Post.updateOne({ _id: deletedPost.replyTo }, { 
                            $pull: { postReplies: deletedPost._id },
                            $inc: { replies: -1 },
                        })
                            .then(() => {
                                Post.deleteOne({_id: req.params.id})
                                    .then(() => res.status(200).json({message : 'Post supprimé !'}))
                                    .catch(error => res.status(401).json({error}));
                            })
                            .catch(error => res.status(401).json({error}));
                        })
                }
                else {
                    Post.updateOne({ _id: deletedPost.replyTo }, { 
                        $pull: { postReplies: deletedPost._id },
                        $inc: { replies: -1 },
                    })
                        .then(() => {
                            Post.deleteOne({_id: req.params.id})
                                .then(() => res.status(200).json({message : 'Post supprimé !'}))
                                .catch(error => res.status(401).json({error}));
                        })
                        .catch(error => res.status(401).json({error}));
                }
            }
        })
        .catch(error => req.status(500).json({error}));
}

exports.likePost = (req, res, next) => {
    const postId = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const like = req.body.like;
    // Si l'utilisateur a cliqué sur Like, on like le post
    if (like === false) {
      Post.updateOne(
        { _id: postId },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: userId },
        }
      )
        .then(() => res.status(200).json({ message: "Post liké !" }))
        .catch((error) => res.status(500).json({ error }));
    }
    else {
      Post.findOne({ _id: postId })
        .then((post) => {
            // Si l'utilisateur a retiré son like, on décrémente le compte de likes
            if (post.usersLiked.includes(userId)) {
                Post.updateOne(
                { _id: postId },
                { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
                )
                .then(() => {
                    res.status(200).json({ message: "Like retiré !" });
                })
                .catch((error) => res.status(500).json({ error }));
            }
        })
        .catch((error) => res.status(401).json({ error }));
    }
};