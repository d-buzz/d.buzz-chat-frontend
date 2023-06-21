export function initTooltipMenu() {
  window.onclickoutside = new stlib.EventQueue();
  window.ondropfile = new stlib.EventQueue();
  const app = document.getElementById("app");
  const body = document.getElementById("body");
  body.addEventListener('dragenter', (e)=>{
    e.stopPropagation();
    e.preventDefault();
  }, false);
  body.addEventListener('dragover', (e)=>{
    e.stopPropagation();
    e.preventDefault();
  }, false);
  body.addEventListener('dragleave', (e)=>{
    e.stopPropagation();
    e.preventDefault();
  }, false);
  body.addEventListener('drop', (e)=>{
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files;
    for(var file of files)
        window.ondropfile.post(file);
    return false;
  }, false);
  app.addEventListener("click", ()=>{ window.onclickoutside.post(); }); 
  window.tooltip = function(element, text, ms=5000) {
    var el = document.getElementById("tooltip");  
    if(el == null) return;
    el.currentElement = element;
    if(element == null) { 
        el.hidden = true;
        return;
    }
    el.innerText = text; 
    el.hidden = false;
    var pos = element.getBoundingClientRect();

    var x = Math.min(0.5*(pos.left+pos.right), window.innerWidth-el.offsetWidth-10); 
    var y = Math.max(0, Math.min(pos.bottom, window.innerHeight-el.offsetHeight)); 

    el.setAttribute('style','left:'+x+'px;'+'top:'+y+'px;');

    var listener = null;
    listener = ()=>{ 
        element.removeEventListener("mouseleave", listener);
        el.hidden = true;
    };
    element.addEventListener("mouseleave", listener);
    setTimeout(()=>{
        if(el.currentElement == element) {
            listener();
        }
        else element.removeEventListener("mouseleave", listener);
    }, ms);
  };
  window.menu = function(element0, items, name=null, dropdown=false) {
    var x = null, y = null;
    var element = element0;
    if(element.target !== undefined && element.clientX !== undefined) {
        x = element.clientX;
        y = element.clientY;
        element = element.target;
    }        
    var el = document.getElementById("menu");  
    if(el == null) return;
    if(!el.hidden && el.currentElement === element) {
        el.hidden = true;
        return;
    }
    el.innerHTML = ""; 
    if(name) {
        var div = document.createElement("div");
        div.setAttribute("class", "font-bold border-b-1");
        div.innerText = name;
        el.appendChild(div);
    }
    for(let item of items) {
        var div = document.createElement("div");
        if(item.length > 2 && item[2]) {
            var icon = document.createElement("span");
            icon.setAttribute("class", "oi "+item[2]);
            div.appendChild(icon);
            
        } 
        var text = document.createElement("span");
        text.innerText = item[0];
        div.appendChild(text);
        div.addEventListener("click", ()=>{
            try {
                item[1]();
            }
            catch(e) { console.log(e); }
            el.hidden = true;
        });
        el.appendChild(div);
    }
    var pos = element.getBoundingClientRect();
    el.currentElement = element;
    el.hidden = false;
    if(x === null) x = dropdown?pos.left:(pos.left+20);
    if(y === null) y = dropdown?pos.bottom:0.5*(pos.top+pos.bottom); 
    x = Math.min(x, window.innerWidth-el.offsetWidth-10); 
    y = Math.max(0, Math.min(y, window.innerHeight-el.offsetHeight)); 
    el.setAttribute('style','left:'+x+'px;'+'top:'+y+'px;');
  };
  window.onclickoutside.set("main.ts", ()=>{ 
    var el = document.getElementById("menu");  
    if(el == null || el.hidden) return;
    el.hidden = true;
  });
}