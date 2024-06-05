function scores(opt='get',score){
    const data = new URLSearchParams()
        data.append("opt", opt)
        data.append("score",score)

    const myRequest = new Request("backend/scores.php",{
        method : "POST",
        body : data
    });

    const myPromisse = new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                resolve(response.text());                    
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        })
    })

    return myPromisse
}

function showScore(json){
    document.querySelector('.board').innerHTML = '<h1 class="center">TOP 5</h1>'
    const table = document.createElement('table')
    for(let i=0; i<json.length; i++){
        const title = document.createElement('tr')
        title.innerHTML = `<th colspan="3">${json[i].nivel}</th>`
        table.appendChild(title)
        for(let j=0; j<json[i].ranking.length; j++){
            const row = document.createElement('tr')
            const nome = document.createElement('td')
            nome.innerHTML = json[i].ranking[j].name
            row.appendChild(nome)
            
            const tent = document.createElement('td')
            tent.innerHTML = json[i].ranking[j].try
            row.appendChild(tent)    

            const scr = document.createElement('td')
            scr.innerHTML = Math.floor(Number(json[i].ranking[j].time)/60).toString().padStart(2,0)+':'+(Number(json[i].ranking[j].time)%60).toString().padStart(2,0)
            row.appendChild(scr)

            table.appendChild(row)
        }
    }
    document.querySelector('.board').appendChild(table)
    hiscore = json
}

function getScore(){
    scores().then((resp)=>{
        const json = JSON.parse(resp)
        showScore(json)
    })
}

function sort(obj){
  
    obj.sort((a, b) => {
        const tryA = a.try
        const tryB = b.try
        if (tryA < tryB) {
            return -1;
        }else if (tryA > tryB) {
            return 1;
        }else{
            const timeA = a.time
            const timeB = b.time
            if (timeA < timeB) {
                return -1;
            }else if (timeA > timeB) {
                return 1;
            }
            return 0;
        }
  
      })

    obj.splice(5,1)
    return obj
}


function setScore(jogadas,tempo,dificuldade){
    const score = scores()
    const out = []
    score.then((resp)=>{
        const json = JSON.parse(resp)      
        for(let i=0; i<json.length; i++){             
            if(json[i].nivel == dificuldade){               
                const worst_try = json[i].ranking[json[i].ranking.length-1].try
                const worst_time = json[i].ranking[json[i].ranking.length-1].time
                if(worst_try > jogadas || worst_try == jogadas && worst_time > tempo){
                    const reg = new Object
                    reg.name = prompt('Parabéns, vc esta no TOP 5!. Digite seu nome:')
                    reg.time = tempo
                    reg.try = jogadas
                    json[i].ranking.push(reg)
                    sort(json[i].ranking)
                }
            }         
            out.push(json[i])
        }
              
        scores('set',JSON.stringify(out)).then((resp)=>{
            const json = JSON.parse(resp)
            showScore(json)
        })
    })
}