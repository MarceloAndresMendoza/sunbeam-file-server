// simple api key authentication middleware
export const checkApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === process.env.APIKEY) {
        next();
    } else {
        res.status(401).json({
            message: "Unauthorized",
            detail: "Invalid API Key. Please provide a valid API Key to access this endpoint.",
            exampleheader: "x-api-key = 1234567890"
        });
    }
}