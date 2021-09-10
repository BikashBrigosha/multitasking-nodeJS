const express = require('express');
const { getConnection, createConnection } = require('typeorm');
const {uniqueNamesGenerator, Config, names} = require('unique-names-generator')

const app = express();

app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res, next)=>{
    res.redirect('/pages/index.html');
})

app.get('/generate-random', async (req, res, next)=>{
    const connection = getConnection();
    const studentRepository = connection.getRepository('Student');
    if(await studentRepository.findOne()){
        return res.send('data already exists');
    }
    const config = {
        dictionaries: [names]
    }
    const students = [];
    for(let i=0; i < 25000; i++){
        students.push({
            name: uniqueNamesGenerator(config),
            marks: parseInt(Math.random()*100)
        })
    }
    try{
        await studentRepository.save(students, { chunk: 30 });
    }catch(e){
        return next(e);
    }
    res.send("Student database seeded with random values")
})

app.get('/percentile', async (req, res, next)=>{
    const connection = getConnection();
    const students = await connection
        .getRepository('Student')
        .createQueryBuilder('Student')
        .getMany();
    students.sort((firstEl, secondEl)=>{
        return firstEl.marks - secondEl.marks;
    })
    const totalStudents = students.length;
    students.forEach((student)=>{
        let countLesserMarks=0;
        for(const stu of students){
            if(stu.marks < student.marks)
                countLesserMarks++;
        }
        const percentile = (countLesserMarks/totalStudents) * 100;
        student.percentile = percentile;
    })
    res.send('percentile calculated');
})

const port = 3000;
app.listen(port, ()=>{
    createConnection();
    console.log(`Listening on port ${port}`);
})