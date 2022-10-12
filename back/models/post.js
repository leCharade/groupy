const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, required: true},
    // imageUrl: { type: String, required: false },
    tag: { type: String, required: true },
    replies: { type: Number, required: true},
    postReplies: {type: Array, required: true},
    likes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
});

module.exports = mongoose.model('Post', postSchema);
