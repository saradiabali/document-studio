// VML DECK LAYOUTS v1.0
// High-level layout resolver. Load AFTER testdeck.js, BEFORE deck-shell.js.
// Patches renderAll() to resolve layout slides before rendering.

(function(){
'use strict';

var _origRenderAll=window.renderAll;

// ── Grid definitions ──
var GRIDS={
2:[{x:.5,w:5.9},{x:6.9,w:5.9}],
3:[{x:.5,w:3.8},{x:4.7,w:3.8},{x:8.9,w:3.8}],
4:[{x:.5,w:2.83},{x:3.58,w:2.83},{x:6.66,w:2.83},{x:9.74,w:2.83}]
};

// ── Resolve all layout slides in D array ──
function resolveLayouts(){
for(var i=0;i<D.length;i++){
var s=D[i];
if(s.layout&&!s._resolved){
if(s.layout==='title'){s.dark=1;s.num='';}
if(s.layout==='closing'){s.dark=1;s.num='';}
if(s.dark===undefined)s.dark=0;
if(!s.footer)s.footer='Confidential \u00B7 VML';
s.els=buildLayout(s);
s._resolved=true;
}
}
}

function buildLayout(s){
switch(s.layout){
case 'title':return layoutTitle(s);
case 'closing':return layoutClosing(s);
case 'cards':return layoutCards(s);
case 'stats':return layoutStats(s);
case 'split':return layoutSplit(s);
case 'rows':return layoutRows(s);
case 'detail':return layoutDetail(s);
case 'bullets':return layoutBullets(s);
default:return s.els||[];
}
}

// ── TITLE ──
function layoutTitle(s){
var els=[];
var tH=(s.title&&s.title.length>40)?1.2:0.7;
if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:2.2,w:11,h:.25,font:'H',size:12,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:2.55,w:11,h:tH,font:'H',size:44,color:'title'});
var sY=2.55+tH+0.3;
if(s.subtitle){els.push({type:'t',text:s.subtitle,x:.5,y:sY,w:10,h:.5,font:'B',size:22,color:'sub'});sY+=0.6;}
if(s.description)els.push({type:'t',text:s.description,x:.5,y:sY,w:10,h:.5,font:'B',size:12,color:'body'});
return els;
}

// ── CLOSING ──
function layoutClosing(s){
var els=[];
var tH=(s.title&&s.title.length>40)?1.2:0.7;
els.push({type:'t',text:s.title||'Thank You',x:.5,y:2.6,w:11,h:tH,font:'H',size:44,color:'title'});
var sY=2.6+tH-0.55;
if(s.subtitle){els.push({type:'t',text:s.subtitle,x:.5,y:sY,w:10,h:.5,font:'B',size:22,color:'sub'});sY+=0.5;}
if(s.attribution)els.push({type:'t',text:s.attribution,x:.5,y:sY,w:10,h:.3,font:'B',size:11,color:'body'});
return els;
}

// ── CARDS ──
function layoutCards(s){
var els=[];
var items=s.items||[];
var cols=s.columns||Math.min(items.length,4);
var grid=GRIDS[cols]||GRIDS[3];

if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});

var rows=Math.ceil(items.length/cols);
var gap=0.2;
var totalH=6.2-2.2;
var cardH=rows===1?Math.min(totalH,4.0):(totalH-(rows-1)*gap)/rows;

items.forEach(function(item,i){
var col=i%cols;
var row=Math.floor(i/cols);
var cx=grid[col].x;
var cw=grid[col].w;
var cy=2.2+row*(cardH+gap);
var ix=cx+0.2;
var tw=cw*0.8;
var dw=cw-0.4;

els.push({type:'s',x:cx,y:cy,w:cw,h:cardH,fill:'cardBg',border:'ltGray',bw:1});
var ny=cy+0.2;
if(item.icon){els.push({type:'i',icon:item.icon,x:ix,y:ny,w:.5,h:.5});ny+=0.7;}
els.push({type:'t',text:item.title||'',x:ix,y:ny,w:tw,h:.4,font:'H',size:15,color:'title'});
ny+=0.4;
if(item.sub){els.push({type:'t',text:item.sub,x:ix,y:ny,w:tw,h:.3,font:'H',size:13,color:'accent'});ny+=0.35;}
els.push({type:'d',x:ix,y:ny+0.05,w:dw,color:'ltGray'});
ny+=0.25;
var bodyH=cardH-(ny-cy)-0.2;
els.push({type:'t',text:item.text||'',x:ix,y:ny,w:tw,h:bodyH,font:'B',size:11,color:'body'});
if(item.pill){els.push({type:'p',text:item.pill,x:ix,y:cy+cardH-0.5,w:1.6,h:.3,fill:item.pillColor||'accent',color:item.pillText||'191919',size:9});}
});

if(s.footnote)els.push({type:'t',text:s.footnote,x:.5,y:6.2,w:11,h:.3,font:'B',size:11,color:'muted'});
return els;
}

// ── STATS ──
function layoutStats(s){
var els=[];
var items=s.items||[];
var cols=s.columns||2;
var rows=s.rows||Math.ceil(items.length/cols);
var grid=GRIDS[cols]||GRIDS[2];

if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});

var gap=0.2;
var totalH=6.2-2.2;
var cardH=(totalH-(rows-1)*gap)/rows;

items.forEach(function(item,i){
var col=i%cols;
var row=Math.floor(i/cols);
var cx=grid[col].x;
var cw=grid[col].w;
var cy=2.2+row*(cardH+gap);
var ix=cx+0.2;
var tw=cw*0.8;

els.push({type:'s',x:cx,y:cy,w:cw,h:cardH,fill:'cardBg',border:'ltGray',bw:1});
els.push({type:'t',text:item.value||'',x:ix,y:cy+0.2,w:1.5,h:.6,font:'H',size:36,color:'accent'});
els.push({type:'t',text:(item.label||'').toUpperCase(),x:ix+1.6,y:cy+0.2,w:tw-1.6,h:.3,font:'H',size:13,color:'title'});
els.push({type:'t',text:item.text||'',x:ix+1.6,y:cy+0.6,w:tw-1.6,h:cardH-1.0,font:'B',size:11,color:'body'});
});

return els;
}

// ── SPLIT ──
function layoutSplit(s){
var els=[];
var items=s.items||[];

if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});

var positions=[{x:.5,w:5.9},{x:6.9,w:5.9}];
for(var i=0;i<Math.min(items.length,2);i++){
var item=items[i];
var cx=positions[i].x;
var cw=positions[i].w;
var tw=cw*0.8;
var iy=2.0;

if(item.title){els.push({type:'t',text:item.title,x:cx,y:iy,w:tw,h:.3,font:'H',size:15,color:'accent'});iy+=0.4;}
els.push({type:'d',x:cx,y:iy,w:cw-0.4,color:'accent'});
iy+=0.2;
if(item.text)els.push({type:'t',text:item.text,x:cx,y:iy,w:tw,h:3.5,font:'B',size:11,color:'body'});
}

if(s.footnote)els.push({type:'t',text:s.footnote,x:.5,y:6.2,w:11,h:.5,font:'B',size:11,color:'muted'});
return els;
}

// ── ROWS ──
function layoutRows(s){
var els=[];
var items=s.items||[];
var numbered=s.numbered!==false;

if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});

var startY=2.0;
var totalH=6.1-startY;
var gap=0.1;
var rowH=(totalH-(items.length-1)*gap)/items.length;

items.forEach(function(item,i){
var ry=startY+i*(rowH+gap);
var num=('0'+(i+1)).slice(-2);

els.push({type:'s',x:.5,y:ry,w:12.3,h:rowH,fill:'cardBg',border:'ltGray',bw:1});
if(numbered){
els.push({type:'t',text:num,x:.7,y:ry+0.15,w:1.0,h:.4,font:'H',size:28,color:'accent'});
els.push({type:'t',text:item.title||'',x:1.8,y:ry+0.15,w:3.5,h:.3,font:'H',size:13,color:'title'});
els.push({type:'t',text:item.text||'',x:1.8,y:ry+0.5,w:9.8,h:rowH-0.65,font:'B',size:11,color:'body'});
}else{
els.push({type:'t',text:item.title||'',x:.7,y:ry+0.15,w:4.0,h:.3,font:'H',size:13,color:'title'});
els.push({type:'t',text:item.text||'',x:.7,y:ry+0.5,w:11.3,h:rowH-0.65,font:'B',size:11,color:'body'});
}
});

if(s.footnote)els.push({type:'t',text:s.footnote,x:.5,y:6.2,w:11,h:.3,font:'B',size:11,color:'muted'});
return els;
}

// ── DETAIL ──
function layoutDetail(s){
var els=[];
var items=s.items||[];

if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});

var cardX=2.5,cardW=8.3;
var itemH=0.7,pad=0.25;
var cardH=items.length*itemH+pad*2;
var cardY=2.3;

els.push({type:'s',x:cardX,y:cardY,w:cardW,h:cardH,fill:'cardBg',border:'ltGray',bw:1});

items.forEach(function(item,i){
var iy=cardY+pad+i*itemH;
var ix=cardX+0.4;
if(item.icon)els.push({type:'t',text:item.icon,x:ix,y:iy,w:.5,h:.4,font:'H',size:20,color:'accent'});
els.push({type:'t',text:item.label||'',x:ix+0.6,y:iy,w:1.5,h:.3,font:'H',size:13,color:'title'});
els.push({type:'t',text:item.value||'',x:ix+2.3,y:iy,w:4.5,h:.3,font:'B',size:12,color:'body'});
if(i<items.length-1)els.push({type:'d',x:ix,y:iy+0.55,w:cardW-0.8,color:'ltGray'});
});

if(s.footnote)els.push({type:'t',text:s.footnote,x:.5,y:cardY+cardH+0.5,w:11,h:.5,font:'B',size:11,color:'muted'});
return els;
}

// ── BULLETS ──
function layoutBullets(s){
var els=[];
var items=s.items||[];

if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});

var bulletText=items.map(function(item){return '\u00B7  '+item;}).join('\n');
els.push({type:'t',text:bulletText,x:.5,y:2.2,w:9.8,h:4.0,font:'B',size:12,color:'body'});

return els;
}

// ── Patch renderAll ──
window.renderAll=function(){
resolveLayouts();
_origRenderAll();
};

})();
