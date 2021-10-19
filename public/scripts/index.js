const data = JSON.parse(table_data.replaceAll('&#34;', '"'));


for(const key in data){
    const item_div = document.createElement('div');
    item_div.textContent = key;
    item_div.className = "list-item";
    item_div.value = key;
    item_div.onclick = ()=>{ 
        document.querySelector('#add-btn').setAttribute('data-tb_name',key);
        document.querySelectorAll('.list-item').forEach(div=>{
            div.style.backgroundColor = "inherit";
        })
        item_div.style.backgroundColor ="#6e6e6e";
        document.querySelector('.table-content').innerHTML ="";
        document.querySelector('.form').innerHTML = '';
        document.querySelector('.content h2').textContent = key;
        document.querySelector('.loader').style.display = 'block';      
        const form = makeInput(data[key])
        document.querySelector('.form').innerHTML+=form;
        fetch(`./dashboard/${key}`)
        .then(res => res.json())
        .then(data_list => {
            document.querySelector('.loader').style.display = 'none';
            if(data_list.length > 0){
                const tr_head = tableHeader(data_list[0]);
                document.querySelector('.table-content').innerHTML+=tr_head;
                for(let i=0;i<data_list.length;i++){
                    let tr_class = '';
                    if(i%2===0){
                        tr_class = ' class="even-row"';
                    }
                    else{
                        tr_class = ' class="odd-row"';
                    }
                    const row = data_list[i];
                    let tr = objTotr(row,key);
                    tr.className = tr_class;
                    document.querySelector('.table-content').append(tr);
                }
            }
            else{
                document.querySelector('.content h2').textContent = " No record";
            }
        });
        
    }
    document.querySelector('.table-list').append(item_div);
}

document.querySelector('#add-btn').addEventListener('click', ()=>{
    const body_inp = {};
    document.querySelectorAll('.add-form input').forEach(input=>{
        if(input.value === '') return;
        body_inp[`${input.name}`] = input.value;
        input.value = '';
    });
    const tb_name = document.querySelector('#add-btn').dataset.tb_name;
    fetch(`./dashboard/${tb_name}`, {
        'method':'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body:JSON.stringify(body_inp)
    })
    .then(res=>res.json())
    .then(mess =>{
        if(mess){
            console.log(mess);
            document.querySelectorAll('.list-item').forEach(div=>{if(div.value===tb_name){div.click()}});
        }
    })
});

function makeInput(arr){
    let form = '<form class="add-form" autocomplete="off">';
    for(key in arr){
        form+=`<input type="text" name="${arr[key]}" placeholder="${arr[key]}">`; 
    }
    form+='</form>'
    return form
}
function tableHeader(obj){
    
    let tr = '<tr>';
    for(key in obj){
        tr+='<th>'+ key + '</th>';
    }
    tr+='</tr>';
    
    return tr;
}
function objTotr (obj, tb_name){
    const tr = document.createElement('tr');
    let id ='';
    for(key in obj){
        if(key === '_id'){
            id = obj[key];
        }
        tr.innerHTML+='<td>'+obj[key] + '</td>';
    }
    const tr_btn = document.createElement('td');
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.addEventListener('click', ()=>{
        fetch(`./dashboard/${tb_name}/${id}`, {
            method:'DELETE',
        })
        .then(res => res.json())
        .then(mess=>{
            console.log(mess);
            document.querySelectorAll('.list-item').forEach(div=>{if(div.value===tb_name){div.click()}});
        })
    })
    tr_btn.append(btn);
    tr.append(tr_btn);
    return tr;
}