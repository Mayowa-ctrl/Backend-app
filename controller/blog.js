const Blog = require('../models/blog');


exports.createBlog = async (req, res) => {

    // Requesting the data needed from the user in the request body
    const { title, description, author, age, state, gender } = req.body


    // set condition to check if all data was passed in
    if(!title || !description || !author){
        return res.status(404)
                  .json({success: false, message: "Please input all required field"})
    }

    // create a blog
    const blog = await Blog.create({
        title,
        description,
        author,
        age,
        state,
        gender
    });

    // send a response back to the user
    res.status(200).json({success: true, message: "Blog Created successfully", data: blog})
}

exports.getBlogs = async (req, res) => {
    const blogs = await Blog.find();

    res.status(200).json({success: true, message: "Blog retrieved successfully", blogs})
}



exports.deleteBlog = async (req, res) => {

    // find the blog and delte by Id
    const blog = await Blog.findByIdAndDelete(req.params.id);

    // send response back to the user
    res.status(200).json({success: true, message: "Blog deleted"});

}

//Update blog 
// nodemailer -- read up on it

// module.exports = {createBlog}