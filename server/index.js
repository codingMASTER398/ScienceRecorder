const express = require(`express`)
const app = express()
const fs = require(`fs`)

let db = require(`./db.json`)

app.post(`/record/:machine`, require(`body-parser`).json(), (req,res)=>{
    console.log(req.body)

    if(db[req.params.machine]){
        db[req.params.machine].push(req.body)
        fs.writeFileSync(`./db.json`, JSON.stringify(db))
        fs.writeFileSync(`./dbb.json`, JSON.stringify(db))
        console.log(`Saved with backup`)

        res.send(`Complete`)
    }else{
        res.status(403).send(`Forbidden`)
    }
})

app.listen(3003)