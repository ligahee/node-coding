import pool from './db/index'
import jwt from 'jsonwebtoken'
import { Request, response, Response} from 'express'
import { generateUploadUrl } from './s3'

const DEFAULT_LIMIT: number = 4
//limited post images to 5
const IMAGE_LIMIT: number = 5

export const getStories = async (req: Request, res: Response):Promise<Response> => {
  let page: number = Number(req.query.page) || 1
  let limit: number = Number(req.query.limit) || DEFAULT_LIMIT
  let offset: number = (page - 1) * limit
  let total = await pool.query('SELECT count(*) FROM stories')
  let result = await pool.query('SELECT photos.photo_url, stories.*, users.email, users.avatar_color FROM stories JOIN photos ON stories.id = photos.story_id JOIN users ON stories.user_id = users.id ORDER BY date_added DESC LIMIT $1 OFFSET $2', [limit, offset])

  let pages = Math.ceil(Number(total.rows[0].count) / limit)

  return res.status(200).json({
    total: {stories: total.rows[0].count, pages}, 
    page,
    rows: result.rows 
  });
}

export const getStory = async (req: Request, res: Response): Promise<Response> => {
  const result = await pool.query('SELECT photos.photo_url, stories.* FROM stories JOIN photos ON stories.id = photos.story_id WHERE stories.id=$1', [req.params.id])
  if (result.rowCount === 0) return response.sendStatus(404)

  return res.status(200).json(result.rows[0])
}

export const getUserStories = async (req: Request, res: Response): Promise<Response> => {
  const page: number = Number(req.query.page) || 1
  const limit: number = Number(req.query.limit) || DEFAULT_LIMIT
  const offset: number = (page - 1) * limit

  const user = await pool.query('SELECT id FROM users WHERE id=$1', [req.params.id]);
  if (user.rowCount === 0) return response.sendStatus(404)

  let total = await pool.query('SELECT count(*) FROM stories WHERE user_id=$1', [req.params.id])
  let result = await pool.query('SELECT stories.*, users.email, users.avatar_color FROM stories JOIN users ON stories.user_id = users.id WHERE users.id=$1 ORDER BY date_added DESC LIMIT $2 OFFSET $3', [req.params.id, limit, offset])

  const pages: number = Math.ceil(Number(total.rows[0].count) / limit)

  return res.status(200).json({
    total: {stories: total.rows[0].count, pages},
    page,
    rows: result.rows
  })
}


export const addStory = async (req: Request, res: Response): Promise<Response> => {
  const token: string = req.headers.authorization
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const userId: number = (<any>decoded).userId
  const title: string = req.body.title
  const content: string = req.body.content

  if (!title || !content) {
    return res.json({ error: 'title and content required' })
  }
  const addedStory = await pool.query('INSERT INTO stories (title, content, user_id) VALUES ($1, $2, $3) RETURNING *', [title, content, userId])
  
  return res.status(200).json(addedStory.rows[0])
}

export const addPhoto = async (req: Request, res: Response): Promise<Response> => {
  const token: string = req.headers.authorization
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const userId: number = (<any>decoded).userId
  const result = await pool.query('SELECT * FROM stories WHERE id=$1', [req.params.id])
  if (result.rowCount === 0) return response.sendStatus(404)
  const limit = await pool.query('SELECT * FROM photos WHERE story_id=$1', [req.params.id])
  if (limit.rowCount >= IMAGE_LIMIT) return response.sendStatus(404)

  const storyId : number = Number(req.params.id)
  const photo_url: string = req.body.photo_url
  const addedPhoto = await pool.query('INSERT INTO photos (photo_url, story_id, user_id) VALUES ($1,$2,$3) RETURNING *', [photo_url, storyId, userId])
  return res.status(200).json(addedPhoto)
}



export const editStory = async (req: Request, res: Response): Promise<Response> => {
  const token: string = req.headers.authorization
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const userId: number = (<any>decoded).userId
  const title: string = req.body.title
  const content: string = req.body.content
  const storyId: number = Number(req.params.id)

  if (!title || !content) {
    return res.json({ error: 'title and content required' })
  }
   
  const editedStory = await pool.query('UPDATE stories SET title=$1, content=$2 WHERE id=$3 AND user_id=$4 RETURNING *', [title, content, storyId, userId])
  
  return res.status(200).json(editedStory.rows[0])
}

export const editPhoto = async (req: Request, res: Response): Promise<Response> => {
  const token: string = req.headers.authorization
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const userId: number = (<any>decoded).userId
  const photo_url: string = req.body.photo_url
  const photoId: number = Number(req.params.id)
   
  const editPhoto= await pool.query('UPDATE photos SET photo_url=$1 WHERE id=$2 AND user_id=$3 RETURNING *', [photo_url, photoId, userId])

  return res.status(200).json(editPhoto.rows[0])
}


export const deleteStory = async (req: Request, res: Response): Promise<Response> => {
  const token = req.headers.authorization
  const decode = jwt.verify(token, process.env.JWT_SECRET)
  const userId = (<any>decode).userId
  const storyId = req.params.id

  const deletedStory =  await pool.query('DELETE FROM stories WHERE id=$1 AND user_id=$2 RETURNING *', [storyId, userId])

  return res.status(200).json(deletedStory.rows[0])
}

export const getUploadUrl = async (req: Request, res: Response): Promise<Response> => {
  const fileName: string = req.params.filename

  const url:string = await generateUploadUrl(fileName)
  return res.status(200).json(url)
}
