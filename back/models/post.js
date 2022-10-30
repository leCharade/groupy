const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, required: true},
    imageUrl: { type: String, required: false },
    tag: { type: String, required: false },
    replies: { type: Number, required: false},
    postReplies: {type: Array, required: false},
    likes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    replyTo: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);
