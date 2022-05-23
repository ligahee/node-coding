import { Router } from 'express'
import { getStories, getStory, getUserStories, addStory, editStory, deleteStory, getUploadUrl, getComments, getComment } from './controller'
import { login, refreshToken, logout, signup, postUsername } from './authController'
import { authenticate, authenticateRefresh } from './auth'

const routes = Router()

// auth routes
routes.post('/login', login)
routes.post('/signup', signup)
routes.post('/postUsername', postUsername)

routes.post('/logout', logout)
routes.post('/refresh_token', authenticateRefresh, refreshToken)

// get stories, by id, and by user id, get comments and comment with that post
routes.get('/stories', getStories)
routes.get('/stories/:id', getStory)
routes.get('/users/:id', getUserStories)
routes.get('/users/:id', getUserStories)
routes.get('/comments', getComments)
routes.get('/comments/:id', getComment)


// add, edit, or delete a story
routes.post('/stories', authenticate, addStory)
routes.put('/stories/:id', authenticate, editStory)
routes.delete('/stories/:id', authenticate, deleteStory)

// s3 upload url
routes.get('/s3upload/:filename', getUploadUrl)

export default routes