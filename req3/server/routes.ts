import { Router } from 'express'
import { getStories, getStory, getUserStories, addStory, editStory, deleteStory, getUploadUrl, getComments, addPhoto, editPhoto, getComment, addComment } from './controller'
import { login, refreshToken, logout, signup, addUsername } from './authController'
import { authenticate, authenticateRefresh } from './auth'

const routes = Router()

// auth routes
routes.post('/login', login)
routes.post('/signup', signup)
routes.post('/users', addUsername)

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
routes.put('/comments', authenticate, addComment)
routes.post('/photos', authenticate, addPhoto)
routes.put('/photos/:id', authenticate, editPhoto)

// s3 upload url
routes.get('/s3upload/:filename', getUploadUrl)

export default routes