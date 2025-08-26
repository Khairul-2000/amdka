import express from 'express'
import cors from 'cors'
import router from './routes'

const app = express()


app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true })); // To handle URL-encoded data

app.get('/', (req, res) => {

    res.json({"message": "Hi, From Node.js!"})
})



app.use("/api", router)


export default app;