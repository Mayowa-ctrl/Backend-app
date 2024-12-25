const express = require('express');
const { createBlog, getBlogs, deleteBlog } = require('../controller/blog');

const router = express.Router();

router.post('/create', createBlog);
router.get('/', getBlogs);
router.delete('/:id', deleteBlog)


module.exports = router;