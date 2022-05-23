import pool from './db/index'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createAccessToken, createRefreshToken, accessTokenExpire, refreshTokenExpire} from './auth'

import { CookieOptions, Request, Response } from 'express'
import { UserInfo } from '../types'

const cookieOps: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none"
}

export const login = async (req: Request, res:Response): Promise<Response> => {
  const email: string = req.body.email
  const password: string = req.body.password
  
  if (!email || !password) {
    return res.json({ error: 'email and password required'})
  }

  let user = await pool.query('SELECT * FROM users WHERE LOWER(email)=$1', [email.toLowerCase()])

  if (user.rowCount === 1) {
    // user is already registered. validate password and send token
    user = user.rows[0]
    try {
      const compareRes: boolean = await bcrypt.compare(password, user.password_hash)
      if (compareRes) {
        let payload: UserInfo = {
          userId: user.id,
          email: user.email,
          avatar: user.avatar_color
        }
        res.cookie(
          'rt', 
          createRefreshToken(payload), 
          { 
            expires: new Date(Date.now() + refreshTokenExpire),
            ...cookieOps
          })
        return res.status(200).json({ 
          accessToken: createAccessToken(payload),
          expire: accessTokenExpire
        })
      } else { // password is invalid
        return res.status(401).json({ error: 'Invalid password'})
      }
    } catch (err) {
      console.log(err)
      return res.status(401).json({error: 'Something went wrong while authenticating'})
    }
  } else {   // user doesn't exist 
    return res.status(404).json({error: 'Email has not been registered yet.'})
  }
}

export const signup = async (req: Request, res: Response): Promise<Response> => {
  const email: string = req.body.signupEmail
  const password: string = req.body.signupPassword
  
  if (!email || !password) {
    return res.json({ error: 'email and password required'})
  }

  let user = await pool.query('SELECT * FROM users WHERE LOWER(email)=$1', [email.toLowerCase()])

  if (user.rowCount === 0) {
    try {
      const password_hash = await bcrypt.hash(password, 10)
      const user_color = colorGenerator()
      user = await pool.query('INSERT INTO users (email, password_hash, avatar_color) VALUES ($1, $2, $3) RETURNING *', [email, password_hash, user_color])
      user = user.rows[0]
      let payload: UserInfo = {
        userId: user.id,
        email: user.email,
        avatar: user.avatar_color
      }
      res.cookie('rt', createRefreshToken(payload), { expires: new Date(Date.now() + refreshTokenExpire), ...cookieOps})
      return res.status(200).json({ accessToken: createAccessToken(payload), expire: accessTokenExpire })
    } catch (err) {
      return res.status(400).json({error: err})
    }
  } else {
    return res.status(400).json({error: 'A user has already been registered to that email address.'})
  }
}

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  const token = req.cookies.rt

  const decoded = jwt.verify(token, process.env.REFRESH_SECRET)

  let user: UserInfo = { 
    userId: (<any>decoded).userId, 
    email: (<any>decoded).email, 
    avatar: (<any>decoded).avatar
  }

  res.cookie('rt', createRefreshToken(user), { expires: new Date(Date.now() + refreshTokenExpire), ...cookieOps })
  return res.json({ok: 'true', accessToken: createAccessToken(user), expire: accessTokenExpire })
}

export const logout = async (req: Request, res: Response): Promise<Response> => {
  res.cookie('rt', '', cookieOps)
  return res.sendStatus(204)
}


function colorGenerator(): string {
  const letters = "0123456789ABCDEF";
  let colorString = '#';

  for (let i = 0; i < 6; i++) {
    colorString += letters[(Math.floor(Math.random() * 16))]
  }

  return colorString;
}