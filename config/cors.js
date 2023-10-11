import dotenv from 'dotenv';
dotenv.config();
const ORIGIN = process.env.CORSORIGIN;
console.log('cORS', ORIGIN);

export const corsOptions={
    origin:[
        ORIGIN,
    ],
    optionsSucessStatus: 200
}