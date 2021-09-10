const { DynamicPool } = require('node-worker-threads-pool');
const os = require('os');
const cpuCount = os.cpus().length;
const dynamicPool = new DynamicPool(cpuCount);
console.log('hi');

const multiThreaded = (func, params)=>{
    const buf = Buffer.from(JSON.stringify(params));
    const buffer = new SharedArrayBuffer(10*1024*1024); // Made a buffer of constant size (10MB) to share between threads
    const sharedArr = new Uint8Array(buffer);
    for(let i=0; i<buf.length; i++){
        sharedArr[i] = buf[i];
    }
    return dynamicPool
        .createExecutor(func)
        // .setTimeout(1000) // set timeout for task.
        // .setTransferList([buf.buffer]) // set transferList. (TransferList is not required when using sharedBuffer)
        .exec({buf: sharedArr, byteLength: buf.length}) // execute!
        .then((byteLength) => {
            const buf = Buffer.from(sharedArr)
            const result = JSON.parse(buf.toString('utf8', 0, byteLength))
            return result;
        });
}

module.exports = multiThreaded;