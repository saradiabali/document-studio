// VML DECK LAYOUTS v2.2
// v1.7: relative pos. v1.8: valign rows. v1.9: expose resolveLayouts. v2.0: stats cardH fix. v2.1: row num width, cards bodyH guard. v2.2: row text overflow fix
(function(){
'use strict';
var _origRenderAll=window.renderAll;
var GRIDS={2:[{x:.5,w:5.9},{x:6.9,w:5.9}],3:[{x:.5,w:3.8},{x:4.7,w:3.8},{x:8.9,w:3.8}],4:[{x:.5,w:2.83},{x:3.58,w:2.83},{x:6.66,w:2.83},{x:9.74,w:2.83}]};
function resolveLayouts(){for(var i=0;i<D.length;i++){var s=D[i];if(s.layout&&!s._resolved){if(s.layout==='title'){s.dark=1;s.num='';}if(s.layout==='closing'){s.dark=1;s.num='';}if(s.dark===undefined)s.dark=0;s.els=buildLayout(s);s._resolved=true;}}}
function buildLayout(s){switch(s.layout){case 'title':return layoutTitle(s);case 'closing':return layoutClosing(s);case 'cards':return layoutCards(s);case 'stats':return layoutStats(s);case 'split':return layoutSplit(s);case 'rows':return layoutRows(s);case 'detail':return layoutDetail(s);case 'bullets':return layoutBullets(s);default:return s.els||[];}}
function layoutTitle(s){var els=[];var tH=(s.title&&s.title.length>40)?1.2:0.7;var y=2.2;
if(s.tag){els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:y,w:11,h:.25,font:'H',size:12,color:'accent'});y+=0.4;}
els.push({type:'t',text:s.title||'',x:.5,y:y,w:11,h:tH,font:'H',size:44,color:'title'});y+=tH+0.15;
if(s.subtitle){var subH=(s.subtitle.length>60)?0.8:0.4;els.push({type:'t',text:s.subtitle,x:.5,y:y,w:10,h:subH,font:'B',size:22,color:'sub'});y+=subH+0.1;}
if(s.description){els.push({type:'t',text:s.description,x:.5,y:y,w:10,h:.5,font:'B',size:12,color:'body'});}return els;}
function layoutClosing(s){var els=[];var tH=(s.title&&s.title.length>40)?1.2:0.7;var y=2.6;
els.push({type:'t',text:s.title||'Thank You',x:.5,y:y,w:11,h:tH,font:'H',size:44,color:'title'});y+=tH+0.15;
if(s.subtitle){var subH=(s.subtitle.length>60)?0.8:0.4;els.push({type:'t',text:s.subtitle,x:.5,y:y,w:10,h:subH,font:'B',size:22,color:'sub'});y+=subH+0.1;}
if(s.attribution){els.push({type:'t',text:s.attribution,x:.5,y:y,w:10,h:.3,font:'B',size:11,color:'body'});}return els;}
function layoutCards(s){var els=[];var items=s.items||[];var cols=s.columns||Math.min(items.length,4);var grid=GRIDS[cols]||GRIDS[3];
if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});
var nRows=Math.ceil(items.length/cols);var gap=0.2;var hasFootnote=!!s.footnote;var totalH=hasFootnote?3.6:4.0;var rawH=(totalH-(nRows-1)*gap)/nRows;var cardH=nRows===1?Math.min(rawH,3.0):rawH;var compact=cardH<2.5;
items.forEach(function(item,i){var col=i%cols;var row=Math.floor(i/cols);var cx=grid[col].x;var cw=grid[col].w;var cy=2.2+row*(cardH+gap);var ix=cx+0.2;var tw=cw*0.8;var dw=cw-0.4;
els.push({type:'s',x:cx,y:cy,w:cw,h:cardH,fill:'cardBg',border:'ltGray',bw:1});var ny=cy+0.15;
if(compact){if(item.icon){els.push({type:'i',icon:item.icon,x:ix,y:ny+0.02,w:.35,h:.35});els.push({type:'t',text:item.title||'',x:ix+0.45,y:ny,w:tw-0.45,h:.35,font:'H',size:13,color:'title'});}else{els.push({type:'t',text:item.title||'',x:ix,y:ny,w:tw,h:.35,font:'H',size:13,color:'title'});}ny+=0.4;if(item.sub){els.push({type:'t',text:item.sub,x:ix,y:ny,w:tw,h:.25,font:'H',size:11,color:'accent'});ny+=0.28;}els.push({type:'d',x:ix,y:ny,w:dw,color:'ltGray'});ny+=0.15;
}else{if(item.icon){els.push({type:'i',icon:item.icon,x:ix,y:ny+0.05,w:.5,h:.5});ny+=0.75;}els.push({type:'t',text:item.title||'',x:ix,y:ny,w:tw,h:.55,font:'H',size:15,color:'title'});ny+=0.6;if(item.sub){els.push({type:'t',text:item.sub,x:ix,y:ny,w:tw,h:.3,font:'H',size:13,color:'accent'});ny+=0.35;}els.push({type:'d',x:ix,y:ny,w:dw,color:'ltGray'});ny+=0.25;}
var pillSpace=item.pill?0.55:0.15;var bodyH=cardH-(ny-cy)-pillSpace;
bodyH=Math.max(bodyH,0.3);
if(item.text)els.push({type:'t',text:item.text,x:ix,y:ny,w:tw,h:bodyH,font:'B',size:bodyH<0.5?9:bodyH>=1.5?13:11,color:'body'});
if(item.pill){els.push({type:'p',text:item.pill,x:ix,y:cy+cardH-0.45,w:1.6,h:.3,fill:item.pillColor||'accent',color:item.pillText||'191919',size:9});}});
if(hasFootnote){var fnY=2.2+nRows*(cardH+gap);els.push({type:'t',text:s.footnote,x:.5,y:fnY,w:11,h:.3,font:'B',size:11,color:'muted'});}return els;}
function layoutStats(s){var els=[];var items=s.items||[];var cols=s.columns||2;var nRows=s.rows||Math.ceil(items.length/cols);var grid=GRIDS[cols]||GRIDS[2];
if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});
var gap=0.2;var totalH=6.2-2.2;var rawH=(totalH-(nRows-1)*gap)/nRows;
var cardH=nRows===1?Math.min(rawH,2.8):Math.min(rawH,1.6);
var usedH=nRows*cardH+(nRows-1)*gap;var startY=2.2+(totalH-usedH)/2;
items.forEach(function(item,i){var col=i%cols;var row=Math.floor(i/cols);var cx=grid[col].x;var cw=grid[col].w;var cy=startY+row*(cardH+gap);var ix=cx+0.2;var tw=cw*0.8;var dw=cw-0.4;var bg=cardH>=1.8;var vs=bg?44:36;var ls=bg?15:13;var bs=bg?13:11;
els.push({type:'s',x:cx,y:cy,w:cw,h:cardH,fill:'cardBg',border:'ltGray',bw:1});
var valLen=(item.value||'').length;var valW=Math.max(1.5,valLen*0.35);var labelW=tw-valW-0.1;
if(labelW>=1.8){var labelX=ix+valW+0.1;var svh=bg?0.8:0.6;els.push({type:'t',text:item.value||'',x:ix,y:cy+0.2,w:valW,h:svh,font:'H',size:vs,color:'accent'});els.push({type:'t',text:(item.label||'').toUpperCase(),x:labelX,y:cy+0.2,w:labelW,h:bg?0.35:0.3,font:'H',size:ls,color:'title'});els.push({type:'t',text:item.text||'',x:labelX,y:cy+0.6,w:labelW,h:cardH-0.9,font:'B',size:bs,color:'body'});
}else{var vh=bg?0.7:0.5;var lOff=0.15+vh+0.05;var lh=bg?0.35:0.3;var dOff=lOff+lh+0.05;var bOff=dOff+0.15;els.push({type:'t',text:item.value||'',x:ix,y:cy+0.15,w:tw,h:vh,font:'H',size:vs,color:'accent'});els.push({type:'t',text:(item.label||'').toUpperCase(),x:ix,y:cy+lOff,w:tw,h:lh,font:'H',size:ls,color:'title'});els.push({type:'d',x:ix,y:cy+dOff,w:dw,color:'ltGray'});els.push({type:'t',text:item.text||'',x:ix,y:cy+bOff,w:tw,h:cardH-bOff,font:'B',size:bs,color:'body'});}});if(s.footnote){var fnY=startY+nRows*(cardH+gap);els.push({type:'t',text:s.footnote,x:.5,y:fnY,w:11,h:.3,font:'B',size:11,color:'muted'});}
return els;}
function layoutSplit(s){var els=[];var items=s.items||[];
if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});
var positions=[{x:.5,w:5.9},{x:6.9,w:5.9}];
for(var i=0;i<Math.min(items.length,2);i++){var item=items[i];var cx=positions[i].x;var cw=positions[i].w;var tw=cw*0.8;var iy=2.0;
if(item.title){els.push({type:'t',text:item.title,x:cx,y:iy,w:tw,h:.3,font:'H',size:15,color:'accent'});iy+=0.4;}els.push({type:'d',x:cx,y:iy,w:cw-0.4,color:'accent'});iy+=0.2;
if(item.text)els.push({type:'t',text:item.text,x:cx,y:iy,w:tw,h:3.5,font:'B',size:11,color:'body'});}
if(s.footnote)els.push({type:'t',text:s.footnote,x:.5,y:6.2,w:11,h:.5,font:'B',size:11,color:'muted'});return els;}
function layoutRows(s){var els=[];var items=s.items||[];var numbered=s.numbered!==false;
if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});
var startY=2.0;var totalH=6.1-startY;var gap=0.1;var rowH=(totalH-(items.length-1)*gap)/items.length;
items.forEach(function(item,i){var ry=startY+i*(rowH+gap);var num=('0'+(i+1)).slice(-2);
els.push({type:'s',x:.5,y:ry,w:12.3,h:rowH,fill:'cardBg',border:'ltGray',bw:1});
if(numbered){els.push({type:'t',text:num,x:.7,y:ry,w:0.8,h:rowH,font:'H',size:rowH<0.7?18:24,color:'accent',valign:'middle'});els.push({type:'t',text:item.title||'',x:1.6,y:ry,w:rowH<0.7?2.5:3.5,h:rowH,font:'H',size:rowH<0.7?12:13,color:'title',valign:'middle'});els.push({type:'t',text:item.text||'',x:rowH<0.7?4.2:5.6,y:ry,w:rowH<0.7?7.2:6.0,h:rowH,font:'B',size:11,color:'body',valign:'middle'});
}else{els.push({type:'t',text:item.title||'',x:.7,y:ry,w:3.0,h:rowH,font:'H',size:rowH<0.7?12:13,color:'title',valign:'middle'});els.push({type:'t',text:item.text||'',x:3.8,y:ry,w:7.6,h:rowH,font:'B',size:11,color:'body',valign:'middle'});}});
if(s.footnote)els.push({type:'t',text:s.footnote,x:.5,y:6.2,w:11,h:.3,font:'B',size:11,color:'muted'});return els;}
function layoutDetail(s){var els=[];var items=s.items||[];
if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});
var cardX=2.5,cardW=8.3;var itemH=0.7,pad=0.25;var cardH=items.length*itemH+pad*2;var cardY=2.3;
els.push({type:'s',x:cardX,y:cardY,w:cardW,h:cardH,fill:'cardBg',border:'ltGray',bw:1});
items.forEach(function(item,i){var iy=cardY+pad+i*itemH;var ix=cardX+0.4;
if(item.icon)els.push({type:'t',text:item.icon,x:ix,y:iy,w:.5,h:.4,font:'H',size:20,color:'accent'});
els.push({type:'t',text:item.label||'',x:ix+0.6,y:iy,w:1.5,h:.3,font:'H',size:13,color:'title'});
els.push({type:'t',text:item.value||'',x:ix+2.3,y:iy,w:4.5,h:.3,font:'B',size:12,color:'body'});
if(i<items.length-1)els.push({type:'d',x:ix,y:iy+0.55,w:cardW-0.8,color:'ltGray'});});
if(s.footnote)els.push({type:'t',text:s.footnote,x:.5,y:cardY+cardH+0.5,w:11,h:.5,font:'B',size:11,color:'muted'});return els;}
function layoutBullets(s){var els=[];var items=s.items||[];
if(s.tag)els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.75,w:11,h:.25,font:'H',size:11,color:'accent'});
els.push({type:'t',text:s.title||'',x:.5,y:1.05,w:11,h:.5,font:'H',size:36,color:'title'});
if(s.subtitle)els.push({type:'t',text:s.subtitle,x:.5,y:1.65,w:10,h:.3,font:'B',size:12,color:'body'});
var bulletText=items.map(function(item){return '\u00B7  '+item;}).join('\n');
els.push({type:'t',text:bulletText,x:.5,y:2.2,w:9.8,h:4.0,font:'B',size:12,color:'body'});return els;}
window.resolveLayouts=resolveLayouts;
window.renderAll=function(){resolveLayouts();_origRenderAll();};
})();
