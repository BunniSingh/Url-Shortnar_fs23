import express, { json } from 'express';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 4000;
const filePath = path.join(import.meta.dirname, 'index.html')
console.log(filePath)

app.use(express.json())
app.use(express.urlencoded())

app.get("/", (req, res)=>{
    res.sendFile(filePath)
})

app.post('/short_url', (req, res) => {
    const uniqueId = nanoid(6);
    const baseUrl = "https://url-shortnar-fs23.onrender.com/";
    const shortUrl = baseUrl + uniqueId;
    const fileData = fs.readFileSync('url-data.json', 'utf-8');
    const dataObj = JSON.parse(fileData);
    dataObj[uniqueId] = req.body.longUrl;
    fs.writeFileSync('url-data.json', JSON.stringify(dataObj));
    res.json({
        status: 'success',
        link: `<a href="${shortUrl}" target="_blank" rel="noopener noreferrer">${shortUrl}</a>`,
        shortUrl,
    })
})

app.get("/:shortUrl", (req, res)=>{
    const uniqueId = req.params.shortUrl;
    const fileData = fs.readFileSync('url-data.json', 'utf-8');
    const dataObj = JSON.parse(fileData);
    const longUrl = dataObj[uniqueId];
    if(longUrl){
        res.redirect(longUrl);
    }else{
        res.status(404).json({
            status: "fail",
            shortUrl: "Not found"
        })
    }
    
    // res.json({
    //     status: 'success',
    //     url: longUrl
    // })
})

app.listen(port, () => console.log("Server Started Successfully on port:", port));