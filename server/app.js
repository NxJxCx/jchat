/* eslint-disable no-console */
import path from 'path'
import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'morgan'
import mongoose from 'mongoose'
import * as routes from './routes'

const app = express()
// database setup
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jchat'
const mongooseConfigs = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(mongoUri, mongooseConfigs).then((conn) => {
  console.log("Connected to MongoDB database", conn)
}).catch(err => {
  console.log(err)
  console.log("Failed to connect to MongoDB database")
  process.exit(1)
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(helmet())
app.use(cors())
app.use(compression())

app.use(express.static(path.join(__dirname, "..", "frontend", "build")))

app.use('/api/users', routes.users)

app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"))
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status).json({error: err})
})
module.exports = app;
