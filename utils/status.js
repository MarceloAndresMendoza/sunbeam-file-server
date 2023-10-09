import dotenv from 'dotenv';
dotenv.config();

export const getServerStatus =(req, res) => {
    res.status(200).json({
        status: "200",
        message: "Server is running",
        serverdata: {
            name: process.env.APPNAME,
            author: process.env.APPAUTHOR,
            version: process.env.APPVERSION,
            description: process.env.APPDESCRIPTION,
            date: process.env.APPDATE,
            copyrigth: process.env.APPCOPYRIGHT,
            github: process.env.APPGITHUB,
            apiversion: process.env.APIVERSION,
        },
        apirequests: {
            status: {
                get: `/api/v${process.env.APIVERSION}/`,
                description: "Returns the status of the server."
            },
            uploadimage: {
                post: `/api/v${process.env.APIVERSION}/upload`,
                description: "Uploads an image to the server.",
                use: {
                    headers: {
                        "x-api-key": "<Your_api_key>",
                        "Content-Type": "multipart/form-data"
                    },
                    body: {
                        file: "imagefile"
                    }
                },
                returns: {
                    message: "File uploaded successfully!",
                    filename: "<filename>"
                }
            },
            downloadImage: {
                get: `/api/v${process.env.APIVERSION}/download?filename=<filename>`,
                description: "Downloads an image from the server.",
                use: {
                    headers: {
                        "x-api-key" : "<Your_api_key>",
                    },
                }
            }
        }
    });
}