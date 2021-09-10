const table = document.querySelector('tbody');
const tRows = table.children;

for(const child of tRows){
    const responseStatusEl = child.children[1];
    const timeTakenEl = child.children[2];
    const now = Date.now();
    fetch('/percentile', {cache: 'no-cache'})
    .then((res)=>{
        if(!res.ok){
            responseStatusEl.textContent = 'response not OK';
        }
        else{
            responseStatusEl.textContent = 'Received.';
        }
        timeTakenEl.textContent = Date.now() - now;
        console.log('result: ', res.data)
    })
    .catch((e)=>{
        console.log(e);
    })

}