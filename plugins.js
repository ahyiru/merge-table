const thead=[{name:'id',value:'id'},{name:'name',value:'用户名'},{name:'sex',value:'性别'},{name:'age',value:'年龄'},{name:'city',value:'籍贯'},{name:'job',value:'职业'},{name:'point',value:'特长'},{name:'like',value:'爱好'}];
const tbody=[];
for(let i=0;i<10;i++){
  tbody[i]={};
  thead.map((v,k)=>{
    tbody[i][v.name]={};
    tbody[i][v.name]['text']=v.value+'-'+i;
  });
}
console.log(tbody);
const table=`<table id="table">
  <thead></thead>
  <tbody></tbody>
</table>`;
const test=document.getElementById('test');
test.innerHTML=table;
const tableDom=document.getElementById('table');

const renderThead=()=>{
  let th='';
  thead.map((v,k)=>{
    th+=`<th>${v.value}</th>`;
  });
  tableDom.children[0].innerHTML=`<tr>${th}</tr>`;
};
renderThead();

const renderTbody=()=>{
  let tr='';
  tbody.map((v,k)=>{
    let td='';
    Object.keys(v).map((sv,sk)=>{
      td+=`<td data-key="${k}-${sk}">${v[sv].text}</td>`;
    });
    tr+=`<tr>${td}</tr>`;
  });
  tableDom.children[1].innerHTML=tr;
};
renderTbody();

const getKey=(obj,val)=>{
  let key=null;
  obj.map((v,k)=>{
    for(let i in v){
      if(v[i].text==val){
        return key=i;
      }
    }
  });
  return key;
};

const getAttr=()=>{
  let tr=tableDom.children[1].children;
  tr=Array.prototype.slice.call(tr);
  let attr=[];
  tr.map((v,k)=>{
    let td=Array.prototype.slice.call(v.children);
    attr[k]={};
    td.map((sv,sk)=>{
      const key=getKey(tbody,sv.innerHTML);
      attr[k][key]={};
      attr[k][key]['colspan']=sv.getAttribute('colspan');
      attr[k][key]['rowspan']=sv.getAttribute('rowspan');
    });
  });
  return attr;
};

const mergeTable=(start,end)=>{
  console.log(start,end);
  const attr=getAttr();
  let s_x=start.split('-')[0];
  let s_y=start.split('-')[1];
  let e_x=end.split('-')[0];
  let e_y=end.split('-')[1];
  let newTable=[];
  let p='';
  tbody.map((v,k)=>{
    let span='';
    Object.keys(v).map((sv,sk)=>{
      v[sv].colspan=attr[k][sv].colspan;
      v[sv].rowspan=attr[k][sv].rowspan;
      if(k>=s_x&&k<=e_x){
        if(sk>=s_y&&sk<=e_y){
          span+=`<span>${v[sv].text}</span>`;
          delete v[sv];
        }
      }
    });
    if(k>=s_x&&k<=e_x){
      p+=`<p>${span}</p>`;
    }
  });
  tbody[s_x][thead[s_y]['name']]={
    text:p,
    colspan:e_y-s_y+1,
    rowspan:e_x-s_x+1,
  };
  return tbody;
};

// console.log(mergeTable('0-0','1-1'));

const hasItem=(arr,item)=>{
  let hasItem=-1;
  for(let i=0,items;items=arr[i++];){
    if(items==item){
      return hasItem=i;
    }
  }
  return hasItem;
};
const filterHead=(head,item)=>{
  // const tmp=JSON.parse(JSON.stringify(head));
  let newHead=[];
  const items=Object.keys(item);
  head.map((v,k)=>{
    const hasKey=hasItem(items,v.name);
    if(hasKey>-1){
      newHead.push(v);
    }
  });
  return newHead;
};

const renderTable=(start,end)=>{
  const newTbody=mergeTable(start,end);
  console.log(newTbody);
  let s_x=start.split('-')[0];
  let s_y=start.split('-')[1];
  let e_x=end.split('-')[0];
  let e_y=end.split('-')[1];
  let tr='';
  newTbody.map((v,k)=>{
    let td='';
    const newThead=filterHead(thead,v);
    newThead.map((sv,sk)=>{
      // if(v[sv.name]){
        if(k==s_y&&sk==s_x){
          td+=`<td data-key="${k}-${sk}" colspan="${v[sv.name].colspan}" rowspan="${v[sv.name].rowspan}">${v[sv.name].text}</td>`;
        }else{
          td+=`<td data-key="${k}-${sk}" colspan="${v[sv.name].colspan}" rowspan="${v[sv.name].rowspan}">${v[sv.name].text}</td>`;
        }
      // }
    });
    tr+=`<tr>${td}</tr>`;
  });
  tableDom.children[1].innerHTML=tr;
};

const getSelect=(start,end)=>{
  let s_x=start.split('-')[0];
  let s_y=start.split('-')[1];
  let e_x=end.split('-')[0];
  let e_y=end.split('-')[1];
  let tr=tableDom.children[1].children;
  tr=Array.prototype.slice.call(tr);
  tr.map((v,k)=>{
    let td=Array.prototype.slice.call(v.children);
    td.map((sv,sk)=>{
      let key=sv.getAttribute('data-key');
      if(key.split('-')[0]>=s_x&&key.split('-')[0]<=e_x&&key.split('-')[1]>=s_y&&key.split('-')[1]<=e_y){
        sv.style.backgroundColor='#ccc';
      }else{
        sv.style.backgroundColor='';
      }
    });
  });
  // console.log(tr);
};

// mouse events
let startKey='0-0';
const mousedown=(event)=>{
  let e=event||window.event;
  let ele=e.target||e.srcElement;
  let td=ele.tagName==='TD'?ele:ele.parentNode.tagName==='TD'?ele.parentNode:ele.parentNode.parentNode.tagName==='TD'?ele.parentNode.parentNode:null;
  if(td){
    // console.log(ele.getAttribute('data-key'));
    startKey=td.getAttribute('data-key');
  }
  tableDom.addEventListener('mousemove',mousemove,false);
  document.addEventListener('mouseup',mouseup,false);
};
const mousemove=(event)=>{
  let e=event||window.event;
  let ele=e.target||e.srcElement;
  let td=ele.tagName==='TD'?ele:ele.parentNode.tagName==='TD'?ele.parentNode:ele.parentNode.parentNode.tagName==='TD'?ele.parentNode.parentNode:null;
  if(td){
    let endKey=td.getAttribute('data-key');
    getSelect(startKey,endKey);
  }
};
const mouseup=(event)=>{
  let e=event||window.event;
  let ele=e.target||e.srcElement;
  let td=ele.tagName==='TD'?ele:ele.parentNode.tagName==='TD'?ele.parentNode:ele.parentNode.parentNode.tagName==='TD'?ele.parentNode.parentNode:null;
  if(td){
    // console.log(ele.getAttribute('data-key'));
    let endKey=td.getAttribute('data-key');
    renderTable(startKey,endKey);
  }
  tableDom.removeEventListener('mousemove',mousemove,false);
};

tableDom.addEventListener('mousedown',mousedown,false);




