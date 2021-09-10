const calcPercentile = function({buf, byteLength}){
    const buffer = Buffer.from(buf)
    const students = JSON.parse(buffer.toString('utf8', 0, byteLength))
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
    const jsonStudents = JSON.stringify(students);
    buffer.write(jsonStudents)
    for(let i=0; i<buf.length; i++){
        buf[i] = buffer[i];
    }
    return Buffer.byteLength(jsonStudents, 'utf8')
}

module.exports = calcPercentile;