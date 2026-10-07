const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
const populateUser = { path: 'user', select: 'username avatar' };

// POST /api/posts  -> create post
router.post('/', auth, async (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Post text is required' });
  const post = await Post.create({ user: req.user, text });
  await post.populate(populateUser);
  res.status(201).json(post);
});

// GET /api/posts/feed  -> posts from me + people I follow
router.get('/feed', auth, async (req, res) => {
  const me = await User.findById(req.user);
  const posts = await Post.find({ user: { $in: [...me.following, me._id] } })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate(populateUser);
  res.json(posts);
});

// GET /api/posts/explore  -> all posts
router.get('/explore', auth, async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).limit(50).populate(populateUser);
  res.json(posts);
});

// GET /api/posts/user/:username  -> posts of one user
router.get('/user/:username', auth, async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate(populateUser);
  res.json(posts);
});

// PUT /api/posts/:id/like  -> like / unlike toggle
router.put('/:id/like', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const liked = post.likes.some((l) => l.toString() === req.user);
  const updated = await Post.findByIdAndUpdate(
    req.params.id,
    liked ? { $pull: { likes: req.user } } : { $addToSet: { likes: req.user } },
    { new: true }
  );
  res.json({ likes: updated.likes });
});

// DELETE /api/posts/:id  -> delete own post
router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.user.toString() !== req.user)
    return res.status(403).json({ message: 'Not allowed' });

  await post.deleteOne();
  await Comment.deleteMany({ post: post._id });
  res.json({ message: 'Post deleted' });
});

// GET /api/posts/:id/comments
router.get('/:id/comments', auth, async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
    .sort({ createdAt: 1 })
    .populate(populateUser);
  res.json(comments);
});

// POST /api/posts/:id/comments
router.post('/:id/comments', auth, async (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Comment text is required' });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = await Comment.create({ post: post._id, user: req.user, text });
  await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: 1 } });
  await comment.populate(populateUser);
  res.status(201).json(comment);
});

// DELETE /api/posts/:postId/comments/:commentId
router.delete('/:postId/comments/:commentId', auth, async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  const post = await Post.findById(req.params.postId);
  const isOwner = comment.user.toString() === req.user;
  const isPostOwner = post && post.user.toString() === req.user;
  if (!isOwner && !isPostOwner) return res.status(403).json({ message: 'Not allowed' });

  await comment.deleteOne();
  await Post.findByIdAndUpdate(req.params.postId, { $inc: { commentsCount: -1 } });
  res.json({ message: 'Comment deleted' });
});

module.exports = router;