const data = JSON.parse(table_data.replaceAll('&#34;', '"'));
for(const key in data){
    const item_div = document.createElement('div');
    item_div.textContent = key;
    item_div.className = "list-item";
    item_div.onclick = ()=>{
        document.querySelectorAll('.list-item').forEach(div=>{
            div.style.backgroundColor = "#ffffff";
        })
        item_div.style.backgroundColor ="#6e6e6e";
        document.querySelector('.table-content').innerHTML ="";
        if(data[key].length > 0){
            const tr =objToth(data[key][0]);
            document.querySelector('.table-content').innerHTML+=tr;
        }
        for(let i=0;i<data[key].length;i++){
            const row = data[key][i];
            const tr = objTotr(row);
            document.querySelector('.table-content').innerHTML+=tr;
       }
    }
    document.querySelector('.table-list').append(item_div);
}
function objToth(obj){
    let tr = '<tr>';
    for(key in obj){
        tr+='<th>'+ key + '</th>';
    }
    tr+='</tr>';
    return tr;
}
function objTotr (obj){
    let tr = '<tr>';
    for(key in obj){
        tr+='<td>'+obj[key] + '</td>';
    }
    tr+='</tr>';
    return tr;
}