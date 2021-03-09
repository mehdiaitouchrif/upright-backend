import Post from '../models/Post.js'
import ErrorResponse from '../helpers/errorResponse.js'
import asyncHandler from '../middleweare/asyncHandler.js'

// @desc 	Get Liked Posts
// @route	/api/v1/mixed/:userId/likes
export const getLikedPosts = asyncHandler(async (req, res, next) => {
	const posts = await Post.find().populate({
		path: 'user shares likes',
		select: 'firstName lastName username profilePhoto',
		populate: {
			path: 'user',
			select: 'firstName lastName username profilePhoto',
		},
	})
	let userLikedPosts = []

	posts.forEach((post) => {
		post.likes.map((like) => {
			if (like._id.toString() === req.params.userId) {
				userLikedPosts.push(post)
			}
		})
	})

	res.status(200).json({
		success: true,
		count: userLikedPosts.length,
		data: userLikedPosts,
	})
})

// @desc 	Get Shared Posts
// @route	/api/v1/mixed/:userId/shares
export const getSharedPosts = asyncHandler(async (req, res, next) => {
	const posts = await Post.find().populate({
		path: 'user shares likes',
		select: 'firstName lastName username profilePhoto',
		populate: {
			path: 'user',
			select: 'firstName lastName username profilePhoto',
		},
	})
	let userSharedPosts = []

	posts.forEach((post) => {
		post.shares.map((share) => {
			if (share.user.toString() === req.params.userId) {
				userSharedPosts.push(post)
			}
		})
	})

	res.status(200).json({
		success: true,
		count: userSharedPosts.length,
		data: userSharedPosts,
	})
})
