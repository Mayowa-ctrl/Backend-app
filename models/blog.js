const mongoose = require('mongoose')

const BlogSchema = mongoose.Schema({
    title: {
        type: String,
        require: [true, 'Please add a title']
    },
    description: {
      type: String,
      require: [true, 'Please add a description message']
    },
    author: {
      type: String,
      require: [true, "Please input the author name"]
    },
    age:{
      type: Number,
    },
    state:{
      type: String,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"]
    },
    image: {
        type: String,
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model("Blog", BlogSchema);