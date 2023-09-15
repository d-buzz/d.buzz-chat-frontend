import Upvote from './components/Upvote.vue'
import { createVNode, render } from 'vue'

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
    if(Array.isArray(items)) {
        el.setAttribute("class", "menu");
        for(let item of items) {
            let div = document.createElement("div");
            if(item.length > 2 && item[2]) {
                var icon = document.createElement("span");
                icon.setAttribute("class", "oi "+item[2]);
                div.appendChild(icon);
                
            } 
            var text = document.createElement("span");
            text.innerText = item[0];
            div.appendChild(text);
            div.addEventListener("click", (event)=>{
                el.hidden = true;
                try {
                    event.preventDefault();
                    event.stopPropagation();
                    item[1](event);
                }
                catch(e) { console.log(e); }
            });
            el.appendChild(div);
        }
    }
    else {
        el.setAttribute("class", "menu menu-p0");
        el.appendChild(items);
    }
    var pos = element.getBoundingClientRect();
    el.currentElement = element;
    el.hidden = false;
    if(x === null) x = dropdown?pos.left:(pos.left+20);
    if(y === null) y = dropdown?pos.bottom:0.5*(pos.top+pos.bottom); 
    x = Math.min(x, window.innerWidth-el.offsetWidth-10); 
    y = Math.max(0, Math.min(y, window.innerHeight-el.offsetHeight)); 
    el.setAttribute('style','left:'+x+'px;'+'top:'+y+'px;');
    window.tooltip(null);
  };
  const upvoteData = { upvoteDiv: null, upvoteDivVNode: null};
  window.upvotemenuFn = null;
  window.upvotemenu = function(event, fn) {
    if(fn === null) { 
        var element = event;
        if(element.target !== undefined) element = element.target;
        var el = document.getElementById("menu");  
        if(el == null) return;
        if(!el.hidden && el.currentElement === element) {
            el.hidden = true;   
        }
        window.upvotemenuFn = null;
        return;
    }
    if(upvoteData.upvoteDiv === null) {
        upvoteData.upvoteDiv = document.createElement("div");
        upvoteData.upvoteDivVNode = createVNode(Upvote, {});
        //upvoteDivVNode.appContext = { ...appContext }
        render(upvoteData.upvoteDivVNode, upvoteData.upvoteDiv);
    }
    window.upvotemenuFn = (w)=>{ 
        window.upvotemenu(event, null);     
        fn(w);
    };
    window.menu(event, upvoteData.upvoteDiv, null, true);
  };
  window.onclickoutside.set("main.ts", ()=>{ 
    var el = document.getElementById("menu");  
    if(el == null || el.hidden) return;
    el.hidden = true;
  });
  initSwipe();
}
export function initSwipe() {
  window.onswipe = new stlib.EventQueue();
  const pos = { x: -1, y: -1, s: 0 };
  const app = document.getElementById("app");
  app.addEventListener("pointerdown", (e)=>{ 
      if(e.clientX < 250) {
          pos.x = e.clientX;
          pos.y = e.clientY;
          pos.s = 0;
      }
  });
  app.addEventListener("pointerup", (e)=>{
      if(pos.s !== 0) {
        window.onswipe.post(true);   
      }
      pos.x = -1;
      pos.y = -1;
      pos.s = 0;
  });
  app.addEventListener("pointermove", (e)=>{
    if(e.buttons === 0 || pos.x === -1) return; 
    var x = e.clientX;
    var y = e.clientY;
    var dx = x-pos.x;
    var dy = y-pos.y;
    if(Math.abs(dy) > 50) {
      if(pos.s !== 0) {
        window.onswipe.post(-pos.s);  
        pos.s = 0;
        pos.x = -1;
        window.onswipe.post(true); 
      }      
      return;
    }
    var s = Math.floor(dx/10);
    if(s !== pos.s) { 
      if(Math.abs(pos.s) > 3)
        window.onswipe.post((s-pos.s)*10);   
      pos.s = s;
    }
  }); 
}



