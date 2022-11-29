import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { Application } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { graphqlSchema } from './common'
import root from './root'

dotenv.config()
const VERBOSE = process.env.VERBOSE === '1'
console.log('VERBOSE', VERBOSE)

const app = express()
app.use(cors())
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: root,
    graphiql: true,
    customFormatErrorFn: (error) => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack ? error.stack.split('\n') : [],
      path: error.path,
    }),
  }) as Application
)
app.get('/', function (req, res) {
  res.send(
    'x2-server-postgres: GraphQL interface on email in PostgreSQL for X2 client'
  )
})

const port = process.env.PORT || 80
app.listen(port, () => console.log(`postgres on port ${port}`))
