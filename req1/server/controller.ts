import pool from './db/index'
import jwt from 'jsonwebtoken'
import { Request, response, Response} from 'express'
import { generateUploadUrl } from './s3'

const DEFAULT_LIMIT: number = 6

export const getStories = async (req: Request, res: Response):Promise<Response> => {
  let page: number = Number(req.query.page) || 1
  let limit: number = Number(req.query.limit) || DEFAULT_LIMIT
  let offset: number = (page - 1) * limit
  let total = await pool.query('SELECT count(*) FROM stories')
  let result = await pool.query('SELECT stories.*, users.email FROM stories JOIN users ON stories.user_id = users.id ORDER BY date_added DESC LIMIT $1 OFFSET $2', [limit, offset])

  let pages = Math.ceil(Number(total.rows[0].count) / limit)

  return res.status(200).json({
    total: {stories: total.rows[0].count, pages}, 
    page,
    rows: result.rows 
  });
}

export const getStory = async (req: Request, res: Response): Promise<Response> => {
  const result = await pool.query('SELECT * FROM stories WHERE id=$1', [req.params.id])
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
  let result = await pool.query('SELECT stories.*, users.email FROM stories JOIN users ON stories.user_id = users.id WHERE users.id=$1 ORDER BY date_added DESC LIMIT $2 OFFSET $3', [req.params.id, limit, offset])

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
  const photo_url: string = req.body.photo_url

  if (!title || !content) {
    return res.json({ error: 'title and content required' })
  }

  const addedStory = await pool.query('INSERT INTO stories (title, content, photo_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *', [title, content, photo_url, userId])

  return res.status(200).json(addedStory.rows[0])
}

export const deleteStory = async (req: Request, res: Response): Promise<Response> => {
  const token = req.headers.authorization
  const decode = jwt.verify(token, process.env.JWT_SECRET)
  const userId = (<any>decode).userId
  const storyId = req.params.id

  const deletedStory =  await pool.query('DELETE FROM stories WHERE id=$1 AND user_id=$2 RETURNING *', [storyId, userId])

  return res.status(200).json(deletedStory.rows[0])
}
