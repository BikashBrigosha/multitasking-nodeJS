const express = require('express');
const { getConnection, createConnection } = require('typeorm');
const {uniqueNamesGenerator, Config, names} = require('unique-names-generator')
// const dynamicPool = require('./threadPool.js')
const calcPercentile = require('./multi-threading/calcPercentile')
const multiThreaded = require('./multi-threading/main')

const app = express();
app.use(express.json())
app.use(express.static('public'))


app.get('/', (req, res, next)=>{
    res.redirect('/pages/index.html');
})
// app.get('/students', async (req, res, next)=>{
//     const connection = getConnection();
//     const students = await connection
//         .getRepository('Student')
//         .find();
//     res.json(students);
// })

app.get('/percentile', async (req, res, next)=>{
    const connection = getConnection();
    const students = await connection
        .getRepository('Student')
        .createQueryBuilder('Student')
        .getMany();
    const result = await multiThreaded(calcPercentile, students)
    res.send('percentile calculated');
})

const port = 3000;
app.listen(port, ()=>{
    createConnection();
    console.log(`Listening on port ${port}`);
})