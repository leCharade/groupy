const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Number, required: true},
    imageUrl: { type: String, required: true },
    tag: { type: Number, required: true },
    replies: { type: Number, required: true},
    postReplies: {type: Array, required: true},
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true }
});

module.exports = mongoose.model('Post', postSchema);
