import dotenv from 'dotenv';
dotenv.config();

export const corsOptions={
    origin:[
        process.env.CORSORIGIN,
    ],
    optionsSucessStatus: 200
}