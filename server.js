import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { corsOptions } from './config/cors.js';
import imageRouter from './routes/image.router.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
// import userRouter from './routes/main.routes.js';
dotenv.config();

const PORT = process.env.PORT;
const app = express();

// export the main app's directory path
const currentFilePath = fileURLToPath(import.meta.url);
export const currentDirPath = dirname(currentFilePath);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
// app.use(cors(corsOptions));
app.use(cors());
app.use(`/api/v${process.env.APIVERSION}/`, imageRouter)

// db()

app.listen(PORT, () => {
    console.log('====================================');
    console.log('  SUNBEAM FILE STORE API SERVER')
    console.log('    DOBLEFOCO LIMITADA - 2023');
    console.log('------------------------------------');
    console.log(' File server started on port ', PORT);
    console.log('====================================');
})