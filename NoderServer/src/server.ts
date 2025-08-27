import express from 'express'
import cors from 'cors'
import path from 'path'
import router from './routes'

const app = express()


app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true })); // To handle URL-encoded data

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {

    res.json({"message": "Hi, From Node.js!"})
})



app.use("/api", router)


export default app;