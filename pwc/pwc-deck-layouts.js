// PwC DECK LAYOUTS v1.0
// Based on VML DECK LAYOUTS v2.3 — adapted for PwC brand
// PwC is a LIGHT-ONLY brand. No dark content slides.
// Cover/closing use cream background (F7EFE9).
// Fonts: H=Georgia (serif), B=Arial
// Accent: PwC Orange (#E05C14 default, user can override)
(function(){
'use strict';
var _origRenderAll=window.renderAll;
var GRIDS={2:[{x:.5,w:5.9},{x:6.9,w:5.9}],3:[{x:.5,w:3.8},{x:4.7,w:3.8},{x:8.9,w:3.8}],4:[{x:.5,w:2.83},{x:3.58,w:2.83},{x:6.66,w:2.83},{x:9.74,w:2.83}]};

function resolveLayouts(){
  for(var i=0;i<D.length;i++){
    var s=D[i];
    if(s.layout&&!s._resolved){
      // PwC: cover and closing use cream bg (no dark mode)
      if(s.layout==='title'){s.dark=0;s.num='';}
      if(s.layout==='closing'){s.dark=0;s.num='';}
      if(s.layout==='divider'){s.dark=0;s.num='';}
      if(s.layout==='agenda'){s.dark=0;s.num='';}
      if(s.dark===undefined)s.dark=0;
      s.els=buildLayout(s);
      s._resolved=true;
    }
  }
}

function buildLayout(s){
  switch(s.layout){
    case 'title':   return layoutTitle(s);
    case 'closing': return layoutClosing(s);
    case 'divider': return layoutDivider(s);
    case 'agenda':  return layoutAgenda(s);
    case 'cards':   return layoutCards(s);
    case 'stats':   return layoutStats(s);
    case 'split':   return layoutSplit(s);
    case 'rows':    return layoutRows(s);
    case 'detail':  return layoutDetail(s);
    case 'bullets': return layoutBullets(s);
    default:        return s.els||[];
  }
}

// ═══ PwC TITLE — cream background, big serif title, orange accent ═══
// Matches template "Title Slide" — cream/blush gradient feel
function layoutTitle(s){
var els=[];
els.push({type:'cover-bg'});
// Full-color PwC logo — top-left (x:0.40, y:0.40, w:1.35, h:0.66)
els.push({type:'cover-logo'});

var y=1.8;
  if(s.tag){
    els.push({type:'t',text:s.tag.toUpperCase(),x:.6,y:y,w:10,h:.3,font:'B',size:10,color:'accent'});
    y+=0.45;
  }
  var tH=(s.title&&s.title.length>40)?1.4:0.85;
  els.push({type:'t',text:s.title||'',x:.6,y:y,w:9,h:tH,font:'H',size:44,color:'title'});
  y+=tH+0.25;

  if(s.subtitle){
    var subH=(s.subtitle.length>60)?0.7:0.4;
    els.push({type:'t',text:s.subtitle,x:.6,y:y,w:9,h:subH,font:'B',size:18,color:'sub'});
    y+=subH+0.15;
  }
  if(s.description){
    els.push({type:'t',text:s.description,x:.6,y:y,w:9,h:.4,font:'B',size:12,color:'body'});
  }
  // Date + presenter bottom-left
  if(s.date)      els.push({type:'t',text:'Presentation by '+(s.presenter||''),x:.6,y:5.6,w:7,h:.3,font:'B',size:11,color:'body'});
  if(s.date)      els.push({type:'t',text:s.date,x:.6,y:5.9,w:7,h:.3,font:'B',size:11,color:'body'});
  return els;
}

// ═══ PwC CLOSING — cream background, thank you, contact info ═══
function layoutClosing(s){
  var els=[];
  els.push({type:'cover-bg'});
  els.push({type:'cover-logo'}); 

  var tH=(s.title&&s.title.length>40)?1.4:0.85;
  var y=2.4;
  els.push({type:'t',text:s.title||'Thank you.',x:.6,y:y,w:9,h:tH,font:'H',size:44,color:'title'});
  y+=tH+0.3;
  if(s.subtitle){
    var subH=(s.subtitle.length>60)?0.7:0.4;
    els.push({type:'t',text:s.subtitle,x:.6,y:y,w:9,h:subH,font:'B',size:16,color:'sub'});
    y+=subH+0.15;
  }
  if(s.attribution){
    els.push({type:'t',text:s.attribution,x:.6,y:y,w:9,h:.4,font:'B',size:12,color:'body'});
  }
  return els;
}

// ═══ PwC DIVIDER — matches template exactly
// Two variants: cream bg (default) or white bg via style:'white'
// Big orange number top-right (350pt), title bottom-left (48pt Georgia serif)
// Measured from official PwC divider template
function layoutDivider(s){
  var els=[];
  var cream = !s.style || s.style !== 'white';
  // Background — cream or white
  if(cream) els.push({type:'s',x:0,y:0,w:13.33,h:7.5,fill:'FFE8D4'});
  // Big orange section number — top-right, 350pt
  // Position: x=8.961 y=0.626 w=3.786 h=4.712 (from template)
  var num = String(s.number || s.num || '1');
  els.push({type:'t',text:num,x:8.961,y:0.626,w:3.786,h:4.712,font:'H',size:350,color:'accent',valign:'top'});
  // Title — bottom-left, large serif, 48pt
  // Position: x=0.406 y=3.784 w=6.174 h=2.836 (from template)
  var title = s.title || '';
  els.push({type:'t',text:title,x:0.406,y:3.784,w:6.174,h:2.836,font:'H',size:48,color:'title',valign:'bottom'});
  s.num = '';
  return els;
}

// ═══ PwC AGENDA — matches template exactly
// Large "Agenda" title bottom-left (48pt Georgia)
// Numbered list right side: orange number (28pt bold) + item text (28pt)
// Two variants: white bg (default) or cream bg via style:'cream'
// Measured from official PwC agenda template
// items: array of strings (up to 8)
function layoutAgenda(s){
var els=[];
var cream = s.style === 'cream';
if(cream) els.push({type:'s',x:0,y:0,w:13.33,h:7.5,fill:'FFE8D4'});

// "Agenda" title — bottom-left, large serif
els.push({type:'t',text:s.title||'Agenda',x:0.429,y:2.952,w:4.574,h:2.726,font:'H',size:48,color:'title',valign:'bottom'});

// Agenda table — right side
var items = s.items || [];
var tblX = 5.674, tblY = 0.845, tblW = 7.257;
var rowH = Math.min(3.640 / Math.max(items.length, 1), 0.65);
var rows = items.map(function(item, i) {
  return [String(i + 1), item];
});

els.push({
  type: 'tbl',
  x: tblX,
  y: tblY,
  w: tblW,
  h: rows.length * rowH,
  rows: rows,
  _agendaTable: true
});

s.num = '';
return els;
}

// ═══ PwC CARDS — clean white cards, serif titles, orange accent ═══
function layoutCards(s){
  var els=[];var items=s.items||[];
  var cols=s.columns||Math.min(items.length,4);
  var grid=GRIDS[cols]||GRIDS[3];

  if(s.tag) els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.5,w:11,h:.25,font:'B',size:10,color:'accent'});
  els.push({type:'t',text:s.title||'',x:.5,y:.75,w:11,h:.55,font:'H',size:34,color:'title'});
  if(s.subtitle) els.push({type:'t',text:s.subtitle,x:.5,y:1.5,w:10,h:.3,font:'B',size:12,color:'body'});

  var nRows=Math.ceil(items.length/cols);var gap=0.2;
  var hasNote=!!s.footnote;var totalH=hasNote?3.5:3.8;
  var rawH=(totalH-(nRows-1)*gap)/nRows;
  var cardH=nRows===1?Math.min(rawH,3.0):rawH;
  var compact=cardH<2.5;

  items.forEach(function(item,i){
    var col=i%cols;var row=Math.floor(i/cols);
    var cx=grid[col].x;var cw=grid[col].w;
    var cy=2.1+row*(cardH+gap);
    var ix=cx+0.2;var tw=cw*0.82;var dw=cw-0.4;
    // Card with left orange accent bar
    els.push({type:'s',x:cx,y:cy,w:cw,h:cardH,fill:'cardBg',border:'ltGray',bw:1});
    var ny=cy+0.2;
    if(compact){
      if(item.icon){
        els.push({type:'i',icon:item.icon,x:ix,y:ny+0.02,w:.35,h:.35,color:'accent'});
        els.push({type:'t',text:item.title||'',x:ix+0.45,y:ny,w:tw-0.45,h:.35,font:'H',size:13,color:'title'});
      } else {
        els.push({type:'t',text:item.title||'',x:ix,y:ny,w:tw,h:.35,font:'H',size:13,color:'title'});
      }
      ny+=0.4;
      if(item.sub){els.push({type:'t',text:item.sub,x:ix,y:ny,w:tw,h:.25,font:'B',size:11,color:'accent'});ny+=0.28;}
      els.push({type:'d',x:ix,y:ny,w:dw,color:'ltGray'});ny+=0.15;
    } else {
      if(item.icon){els.push({type:'i',icon:item.icon,x:ix,y:ny+0.05,w:.5,h:.5,color:'accent'});ny+=0.75;}
      els.push({type:'t',text:item.title||'',x:ix,y:ny,w:tw,h:.5,font:'H',size:15,color:'title'});ny+=0.6;
      if(item.sub){els.push({type:'t',text:item.sub,x:ix,y:ny,w:tw,h:.3,font:'B',size:12,color:'accent'});ny+=0.35;}
      els.push({type:'d',x:ix,y:ny,w:dw,color:'ltGray'});ny+=0.25;
    }
    var pillSpace=item.pill?0.55:0.15;
    var bodyH=cardH-(ny-cy)-pillSpace;
    bodyH=Math.max(bodyH,0.3);
    if(item.text) els.push({type:'t',text:item.text,x:ix,y:ny,w:tw,h:bodyH,font:'B',size:bodyH<0.5?9:12,color:'body'});
    if(item.pill) els.push({type:'p',text:item.pill,x:ix,y:cy+cardH-0.45,w:1.6,h:.3,fill:item.pillColor||'accent',color:item.pillText||'FFFFFF',size:9});
  });

  if(hasNote) els.push({type:'t',text:s.footnote,x:.5,y:2.1+nRows*(cardH+gap),w:11,h:.3,font:'B',size:10,color:'muted'});
  return els;
}

// ═══ PwC STATS ═══
function layoutStats(s){
  var els=[];var items=s.items||[];
  var cols=s.columns||2;var nRows=s.rows||Math.ceil(items.length/cols);
  var grid=GRIDS[cols]||GRIDS[2];

  if(s.tag) els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.5,w:11,h:.25,font:'B',size:10,color:'accent'});
  els.push({type:'t',text:s.title||'',x:.5,y:.75,w:11,h:.55,font:'H',size:34,color:'title'});
  if(s.subtitle) els.push({type:'t',text:s.subtitle,x:.5,y:1.5,w:10,h:.3,font:'B',size:12,color:'body'});

  var gap=0.2;var totalH=6.2-2.1;
  var rawH=(totalH-(nRows-1)*gap)/nRows;
  var cardH=nRows===1?Math.min(rawH,2.8):Math.min(rawH,1.6);
  var usedH=nRows*cardH+(nRows-1)*gap;
  var startY=2.1+(totalH-usedH)/2;

  items.forEach(function(item,i){
    var col=i%cols;var row=Math.floor(i/cols);
    var cx=grid[col].x;var cw=grid[col].w;
    var cy=startY+row*(cardH+gap);
    var ix=cx+0.2;var tw=cw*0.82;var dw=cw-0.4;
    els.push({type:'s',x:cx,y:cy,w:cw,h:cardH,fill:'cardBg',border:'ltGray',bw:1});

    var valLen=(item.value||'').length;var valW=Math.max(1.5,valLen*0.38);var labelW=tw-valW-0.1;
    if(labelW>=1.8){
      var labelX=ix+valW+0.1;
      els.push({type:'t',text:item.value||'',x:ix,y:cy+0.15,w:valW,h:cardH*0.7,font:'H',size:36,color:'accent',valign:'middle'});
      els.push({type:'t',text:(item.label||'').toUpperCase(),x:labelX,y:cy+0.2,w:labelW,h:.3,font:'B',size:11,color:'title'});
      els.push({type:'t',text:item.text||'',x:labelX,y:cy+0.6,w:labelW,h:cardH-0.9,font:'B',size:11,color:'body'});
    } else {
      els.push({type:'t',text:item.value||'',x:ix,y:cy+0.1,w:tw,h:.55,font:'H',size:36,color:'accent'});
      els.push({type:'t',text:(item.label||'').toUpperCase(),x:ix,y:cy+0.7,w:tw,h:.3,font:'B',size:11,color:'title'});
      els.push({type:'d',x:ix,y:cy+1.05,w:dw,color:'ltGray'});
      els.push({type:'t',text:item.text||'',x:ix,y:cy+1.15,w:tw,h:cardH-1.4,font:'B',size:11,color:'body'});
    }
  });

  if(s.footnote) els.push({type:'t',text:s.footnote,x:.5,y:startY+nRows*(cardH+gap),w:11,h:.3,font:'B',size:10,color:'muted'});
  return els;
}

// ═══ PwC SPLIT ═══
function layoutSplit(s){
  var els=[];var items=s.items||[];
  if(s.tag) els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.5,w:11,h:.25,font:'B',size:10,color:'accent'});
  els.push({type:'t',text:s.title||'',x:.5,y:.75,w:11,h:.55,font:'H',size:34,color:'title'});
  if(s.subtitle) els.push({type:'t',text:s.subtitle,x:.5,y:1.5,w:10,h:.3,font:'B',size:12,color:'body'});

  var positions=[{x:.5,w:5.9},{x:6.9,w:5.9}];
  for(var i=0;i<Math.min(items.length,2);i++){
    var item=items[i];var cx=positions[i].x;var cw=positions[i].w;var tw=cw*0.82;var iy=2.1;
    if(item.title){els.push({type:'t',text:item.title,x:cx,y:iy,w:tw,h:.35,font:'H',size:15,color:'accent'});iy+=0.45;}
    els.push({type:'d',x:cx,y:iy,w:cw-0.4,color:'accent'});iy+=0.2;
    if(item.text) els.push({type:'t',text:item.text,x:cx,y:iy,w:tw,h:3.6,font:'B',size:12,color:'body'});
  }
  if(s.footnote) els.push({type:'t',text:s.footnote,x:.5,y:6.2,w:11,h:.3,font:'B',size:10,color:'muted'});
  return els;
}

// ═══ PwC ROWS ═══
function layoutRows(s){
  var els=[];var items=s.items||[];var numbered=s.numbered!==false;
  if(s.tag) els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.5,w:11,h:.25,font:'B',size:10,color:'accent'});
  els.push({type:'t',text:s.title||'',x:.5,y:.75,w:11,h:.55,font:'H',size:34,color:'title'});
  if(s.subtitle) els.push({type:'t',text:s.subtitle,x:.5,y:1.5,w:10,h:.3,font:'B',size:12,color:'body'});

  var startY=2.1;var totalH=6.1-startY;var gap=0.1;
  var rowH=(totalH-(items.length-1)*gap)/items.length;

  items.forEach(function(item,i){
    var ry=startY+i*(rowH+gap);var num=('0'+(i+1)).slice(-2);
    els.push({type:'s',x:.5,y:ry,w:12.3,h:rowH,fill:'cardBg',border:'ltGray',bw:1});
    if(numbered){
      els.push({type:'t',text:num,x:.7,y:ry,w:0.8,h:rowH,font:'H',size:rowH<0.7?18:24,color:'accent',valign:'middle'});
      els.push({type:'t',text:item.title||'',x:1.6,y:ry,w:rowH<0.7?2.5:3.5,h:rowH,font:'H',size:rowH<0.7?12:13,color:'title',valign:'middle'});
      els.push({type:'t',text:item.text||'',x:rowH<0.7?4.2:5.6,y:ry,w:rowH<0.7?7.2:6.0,h:rowH,font:'B',size:11,color:'body',valign:'middle'});
    } else {
      els.push({type:'t',text:item.title||'',x:.7,y:ry,w:3.0,h:rowH,font:'H',size:rowH<0.7?12:13,color:'title',valign:'middle'});
      els.push({type:'t',text:item.text||'',x:3.8,y:ry,w:7.6,h:rowH,font:'B',size:11,color:'body',valign:'middle'});
    }
  });
  if(s.footnote) els.push({type:'t',text:s.footnote,x:.5,y:6.2,w:11,h:.3,font:'B',size:10,color:'muted'});
  return els;
}

// ═══ PwC DETAIL ═══
function layoutDetail(s){
  var els=[];var items=s.items||[];
  if(s.tag) els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.5,w:11,h:.25,font:'B',size:10,color:'accent'});
  els.push({type:'t',text:s.title||'',x:.5,y:.75,w:11,h:.55,font:'H',size:34,color:'title'});
  if(s.subtitle) els.push({type:'t',text:s.subtitle,x:.5,y:1.5,w:10,h:.3,font:'B',size:12,color:'body'});

  var cardX=2.5,cardW=8.3;var itemH=0.7,pad=0.25;
  var cardH=items.length*itemH+pad*2;var cardY=2.3;
  els.push({type:'s',x:cardX,y:cardY,w:cardW,h:cardH,fill:'cardBg',border:'ltGray',bw:1});

  items.forEach(function(item,i){
    var iy=cardY+pad+i*itemH;var ix=cardX+0.35;
    if(item.icon) els.push({type:'i',icon:item.icon,x:ix,y:iy,w:.4,h:.4,color:'accent'});
    els.push({type:'t',text:item.label||'',x:ix+0.55,y:iy,w:1.5,h:.3,font:'H',size:13,color:'title'});
    els.push({type:'t',text:item.value||'',x:ix+2.2,y:iy,w:4.5,h:.3,font:'B',size:12,color:'body'});
    if(i<items.length-1) els.push({type:'d',x:ix,y:iy+0.55,w:cardW-0.8,color:'ltGray'});
  });
  if(s.footnote) els.push({type:'t',text:s.footnote,x:.5,y:cardY+cardH+0.4,w:11,h:.3,font:'B',size:10,color:'muted'});
  return els;
}

// ═══ PwC BULLETS ═══
function layoutBullets(s){
  var els=[];var items=s.items||[];
  if(s.tag) els.push({type:'t',text:s.tag.toUpperCase(),x:.5,y:.5,w:11,h:.25,font:'B',size:10,color:'accent'});
  els.push({type:'t',text:s.title||'',x:.5,y:.75,w:11,h:.55,font:'H',size:34,color:'title'});
  if(s.subtitle) els.push({type:'t',text:s.subtitle,x:.5,y:1.5,w:10,h:.3,font:'B',size:12,color:'body'});
  var bulletText=items.map(function(item){return '\u2014  '+item;}).join('\n');
  els.push({type:'t',text:bulletText,x:.5,y:2.1,w:9.8,h:4.2,font:'B',size:12,color:'body'});
  return els;
}

window.resolveLayouts=resolveLayouts;
window.renderAll=function(){resolveLayouts();_origRenderAll();};
})();
