const Post = require('../models/post');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Requête pour obtenir tous les posts
exports.getAllPosts = (req, res, next) => {

    // Pour chaque élément de l'array posts, on cherche à obtenir le post et le nom de l'auteur.
    const posts = [];

    // Tout d'abord, on récupère tous les posts initiaux de la base de données, c'est-à-dire les posts qui ne sont pas en réponse à d'autres posts.
    Post.find({replyTo: 'ORIGINAL'})
        .then(listPosts => {

            // Ensuite, pour chaque post, on cherche l'auteur correspondant à l'userId.
            let i = 0;
            for (post of listPosts) {
                let postContent = post;
                User.findOne({_id: post.userId, replyTo: 'ORIGINAL'})
                    .then(user => {
                        const authorName = user.firstName + ' ' + user.lastName; // On définit le nom de l'auteur à partir du firstName et du lastName
                        posts.push({postContent, authorName}); // Ajout des éléments du post, et le nom de l'auteur, dans posts
                        i++; 
                        // Une fois à la fin de la boucle, on trie les posts du plus récent au plus ancien, et on retourne le résultat.
                        if (listPosts.length <= i) {
                            posts.sort((a,b) => b.postContent.time - a.postContent.time);
                            res.status(200).json(posts);
                        }
                    })
            }
            
        })
        .catch(error => res.status(400).json({error}))
}


// Requête pour obtenir un seul post
exports.getOnePost = (req, res, next) => {

    // On cherche à obtenir le post recherché, le nom de l'auteur, mais aussi tous les posts en réponse et les noms des auteurs respectifs.
    const posts = [];

    // On commence par chercher le premier post.
    Post.findOne({_id: req.params.id})
        .then(post => {

            // Ensuite, on cherche l'utilisateur qui a créé le post.
            User.findOne({_id: post.userId})
                .then(user => {
                    // On définit le nom complet de l'utilisateur avec le prénom et le nom, et on ajoute les résultats à posts.
                    const authorName = user.firstName + ' ' + user.lastName;
                    posts.push({post, authorName});

                    // On récupère la liste des réponses du post et on cherche les données correspondantes pour chaque post.
                    const listReplies = post.postReplies;
                    let i = 0;
                    if (listReplies.length > 0) {
                        for (reply of listReplies) {
                            const replyId = reply.toHexString(); // Les replies étant des ObjectId, il est important de convertir en string pour comparer les id.
                            Post.findOne({_id: replyId})
                                .then(post => {
                                    // Maintenant la méthode est la même, on cherche l'utilisateur du post, on ajoute les données à posts.
                                    User.findOne({_id: post.userId})
                                        .then(replyUser => {
                                            const authorName = replyUser.firstName + ' ' + replyUser.lastName;
                                            posts.push({post, authorName});
                                            i++;
                                            // Une fois toutes les réponses données, on retourne les résultats, cette fois du plus ancien au plus récent.
                                            if (listReplies.length <= i) {
                                                posts.sort((a,b) => a.post.time - b.post.time);
                                                res.status(200).json(posts);
                                            }
                                        })
                                })
                        }
                    }
                    // Si pas de réponses, on retourne juste les données du post originel.
                    else {
                        res.status(200).json(posts);
                    }
                })
            })
        .catch(error => res.status(404).json({error}))
}

// Création de post
exports.createPost = (req, res, next) => {

    // On récupère l'ID de l'utilisateur avec le token.
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const authorId = decodedToken.userId;

    // Si l'image est renseignée on l'ajoute.
    let image = ''
    if (req.file) {
        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }

    // L'intérêt de définir ainsi le post est de s'assurer que toutes les données sont contrôlées et qu'aucune ne peut être modifiée via des outils tels que Postman.
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

    // On envoie le post.
    post.save()
        .then(() => res.status(201).json({ message: 'Post envoyé !' }))
        .catch(error => res.status(400).json({error}))
}

// Pour répondre à un post
exports.replyPost = (req, res, next) => {

    // On récupère le userId avec le token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const authorId = decodedToken.userId;

    // On met l'image s'il y en a une
    let image = ''
    if (req.file) {
        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }

    // On définit le post mais cette fois le replyTo correspond à l'id du post auquel on répond. Pas de tag ni de réponses pour les posts en réponse.
    const post = new Post({
        userId: authorId,
        message: req.body.message,
        time: Date.now(),
        imageUrl: image,
        likes: 0,
        usersLiked: [],
        replyTo: req.params.id
    });

    // On ajoute le post, et on met à jour le post d'origine avec les données correspondantes.
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

// Modification de post
exports.modifyPost = (req, res, next) => {
    
    // Tout d'abord, le processus si une image est renseignée :
    if (req.file) {
        Post.findOne({ _id: req.params.id })
            .then(post => {
                // Suppression de l'image d'origine et ajout de la nouvelle image
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    let postObject = [];
                    // On renvoie des données différentes selon si le post est le post d'origine, ou une réponse à un post.
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
                    // On met enfin à jour.
                    Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Post modifié !' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));

    // Si aucune image n'est renseignée, le processus reste assez identique.
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

// Suppression de post (accrochez-vous)
exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id})
        .then(deletedPost => {

            // La suppression est gérée différemment en fonction du post à supprimer.
            // En effet, si le post est une réponse à un autre, il faut juste supprimer les données du post ;
            // Mais si le post est celui à l'origine d'une discussion, il faut aussi supprimer toutes ses réponses.

            // Cas no. 1 : On commence par le cas d'un post à l'origine d'une discussion
            if (deletedPost.replyTo === 'ORIGINAL') {
                let i = 0;

                // S'il y a des réponses à ce post, on part sur une boucle pour chercher chacune des réponses pour les supprimer.
                if (deletedPost.replies > 0) {
                    const listReplies = deletedPost.postReplies;
                    for (reply of listReplies) {
                        const replyId = reply.toHexString();
                        Post.findOne({_id: replyId})
                            .then(replyToDelete => {
                                // Si le post a une image attachée, il faut aussi supprimer l'image.
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
                                // Une fois toutes les réponses supprimées, il faut enfin supprimer le post (toujours en fonction de s'il y a une image ou non) 
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
                // S'il n'y a pas de réponses, on supprime juste le post, en fonction de si une image est présente ou non.
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
            // Cas no. 2 : on veut supprimer un post en réponse à une discussion.
            else {
                // Encore une fois on vérifie s'il y a une image pour la supprimer ou non...
                // Cependant, avant de faire la suppression, il faut aussi mettre à jour le post d'origine :
                // En décrémentant le compteur de réponses, et retirant l'id du post dans la liste des réponses.
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

// Gestion du like
exports.likePost = (req, res, next) => {
    // On récupère l'id du post et celui de l'utilisateur
    const postId = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Fonctionnement de la requête : on cherche à vérifier si l'utilisateur a déjà liké ou non le post auparavant.
    // S'il a déjà liké le post, la requête va retirer le like. S'il ne l'a pas liké, la requête ajoute le like.
    let like = false;
    Post.findOne({_id: postId})
        .then(post => {
            // like retournera true si le userId est dans la liste usersLiked (il a déjà liké) ; false dans le cas contraire (il n'a pas liké).
            like = post.usersLiked.includes(userId)

            // Il n'est pas dans la liste des likes, donc on ajoute le like.
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

            // Il est dans la liste des likes, donc on retire le like.
            else if (like === true) {
                Post.updateOne(
                { _id: postId },
                { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
                )
                    .then(() => res.status(200).json({ message: "Like retiré !" }))
                    .catch((error) => res.status(500).json({ error }));
            }
        })        
};