var area_count, area_date, area_title, area_descr, area_video, slider;

window.onload=function()
{
document.body.style.height="100%";
slider=document.createElement("input");     slider.id="slider";slider.type="range";slider.min="0";slider.max=images.length-1;slider.value="1";
img_info=document.createElement("div");     img_info.id="img-info";
area_count=document.createElement("div");   area_count.id="count";
area_date=document.createElement("div");    area_date.id="date";
area_title=document.createElement("div");   area_title.id="title";
area_descr=document.createElement("div");   area_descr.id="descr";
left_area=document.createElement("div");    left_area.id="left-area";

document.body.appendChild(img_info);
img_info.appendChild(area_count);
img_info.appendChild(area_date);
img_info.appendChild(area_title);
img_info.appendChild(area_descr);
document.body.appendChild(left_area);
document.body.appendChild(slider);

bgimg(0);
slider.oninput=function(event){index=parseInt(this.value)+1;area_count.innerHTML=index+" / "+img_num;event.stopImmediatePropagation();}
};


const IMG_URL_IDX=1;
const IMG_DATA_IDX=0;
const IMG_TITLE_IDX=2;
const IMG_DESCR_IDX=3;
var index=0;
var img_num=images.length;
var img = new Image();
var preview=new Image();


var body = document.body,
    html = document.documentElement;

var doc_height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
var doc_width = Math.max( body.scrollWidth, body.offsetWidth, 
                       html.clientWidth, html.scrollWidth, html.offsetWidth );


function change_index(n)
{
index=index+n;
if(index<0)index=0;
if(index==img_num)index=img_num-1;
return index;
}


var old_idx=-1;
function bgimg(idx)
{
if(old_idx==idx)return;
old_idx=idx;
area_count.innerHTML=index+1+" / "+img_num;
area_date.innerHTML=images[idx][IMG_DATA_IDX];
area_title.innerHTML=images[idx][IMG_TITLE_IDX];
area_descr.innerHTML=images[idx][IMG_DESCR_IDX];

img.onload = function() {
  var kw=doc_width/this.width;
  var kh=doc_height/this.height;
  if(kw>kh)sizestr="auto "+doc_height+"px";
  else sizestr=doc_width+"px auto";
//  if(kw>kh)sizestr=kh/doc_width+"px "+doc_height+"px";
//  else sizestr=doc_width+"px "+kw/doc_height+"px";
document.body.style.background = "black url('"+this.src+"') fixed no-repeat center content-box";
document.body.style.backgroundSize = sizestr;
//preview.src=images[idx+1][IMG_URL_IDX];
}
document.body.style.background = "black url('/progress.gif') fixed no-repeat center content-box";
img.src = images[idx][IMG_URL_IDX];

}


var xstart;

function handler_ts(event)
{
xstart=event.touches[0].clientX;
}

var dx=0;
function handler_tm(event)
{
var xend=event.touches[0].clientX;
dx=xstart-xend;
document.body.style.backgroundPosition=-2*dx+"px 50%";
}

function handler_te(event)
{
if((dx<50)&&(dx>-50))
  {
  dx=0;
  preventDefault();
  return;
  }
var newindex=change_index(Math.sign(dx));
slider.value=newindex;
bgimg(newindex);
dx=0;
}

function handler_click(event)
{
var newindex=change_index(doc_width/2>event.clientX?-1:1);
slider.value=newindex;
bgimg(newindex);
}

window.addEventListener("touchstart",handler_ts,{capture:true});
window.addEventListener("touchmove",handler_tm,{capture:true});
window.addEventListener("touchend",handler_te,{capture:true});
window.addEventListener("click",handler_click,{capture:true});

