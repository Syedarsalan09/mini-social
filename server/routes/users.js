const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/users/suggestions  -> people you don't follow yet
router.get('/suggestions', auth, async (req, res) => {
  const me = await User.findById(req.user);
  const users = await User.find({ _id: { $nin: [...me.following, me._id] } })
    .select('username avatar bio')
    .limit(5);
  res.json(users);
});

// PUT /api/users/me  -> update own profile
router.put('/me', auth, async (req, res) => {
  const { bio, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user,
    { bio: (bio || '').slice(0, 160), avatar: avatar || '' },
    { new: true }
  ).select('-password');
  res.json(user);
});

// PUT /api/users/:id/follow  -> follow / unfollow toggle
router.put('/:id/follow', auth, async (req, res) => {
  const targetId = req.params.id;
  if (targetId === req.user)
    return res.status(400).json({ message: "You can't follow yourself" });

  const target = await User.findById(targetId);
  if (!target) return res.status(404).json({ message: 'User not found' });

  const isFollowing = target.followers.some((f) => f.toString() === req.user);

  if (isFollowing) {
    await User.findByIdAndUpdate(targetId, { $pull: { followers: req.user } });
    await User.findByIdAndUpdate(req.user, { $pull: { following: targetId } });
  } else {
    await User.findByIdAndUpdate(targetId, { $addToSet: { followers: req.user } });
    await User.findByIdAndUpdate(req.user, { $addToSet: { following: targetId } });
  }
  res.json({ following: !isFollowing });
});

// GET /api/users/:username  -> public profile
router.get('/:username', auth, async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() }).select(
    '-password -email'
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  const postsCount = await Post.countDocuments({ user: user._id });
  res.json({ ...user.toObject(), postsCount });
});

module.exports = router;