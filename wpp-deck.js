// ═══ WPP DECK ENGINE v1.0 ═══
// Based on VML DECK ENGINE v11.8 — modified for WPP brand
// WPP colors, fonts, footer, logo, masters

var C={black:'000050',white:'FFFFFF',dkGray:'0A1E78',mdGray:'323CAA',gray:'6464D2',ltGray:'D2BEFF',accent:AH,accentLight:AL,accentDark:AD};
var FONT={head:'WPP',body:'WPP'};

// WPP logo via canvas text (replace with SVG path data when available)
function wppLogo(w,h,fill){var c=document.createElement('canvas');c.width=w*2;c.height=h*2;var x=c.getContext('2d');x.fillStyle=fill;x.font='300 '+Math.round(h*1.2)+'px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('wpp',w,h);return c.toDataURL('image/png');}
var L={wW:wppLogo(150,52,'#FFFFFF'),bW:wppLogo(150,52,'#000050'),wI:null,bI:null};

var PPI=80;var FW=1.0;var FH=1.08;
function px(v){return Math.round(v*PPI);}
function rc(k,dk){if(C[k])return C[k];switch(k){case 'title':return dk?C.white:C.black;case 'body':return dk?C.ltGray:C.black;case 'sub':return dk?C.accentLight:C.mdGray;case 'muted':return C.gray;case 'cardBg':return dk?C.dkGray:'FFFFFF';case 'ok':return '28A745';case 'warn':return 'E67E00';case 'bad':return 'C12638';default:return k;}}
function esc(s){if(s==null)return '';var d=document.createElement('div');d.textContent=String(s);return d.innerHTML.replace(/\n/g,'<br>');}
function findImg(container){if(!container)return null;var imgs=container.querySelectorAll('img');for(var k=0;k<imgs.length;k++){if(imgs[k].src&&imgs[k].src!==''&&imgs[k].src!==window.location.href&&imgs[k].src.indexOf('data:image/svg')===-1)return imgs[k];}return null;}
function captureImage(imgElement,tw,th){return new Promise(function(resolve){var getCrop=function(nw,nh){var tr=tw/th,ir=nw/nh,sx=0,sy=0,sw=nw,sh=nh;if(ir>tr){sw=nh*tr;sx=(nw-sw)/2;}else{sh=nw/tr;sy=(nh-sh)/2;}var cw=Math.min(Math.round(tw*96),1200),ch=Math.min(Math.round(th*96),800);return{sx:sx,sy:sy,sw:sw,sh:sh,cw:cw,ch:ch};};try{var crop=getCrop(imgElement.naturalWidth||800,imgElement.naturalHeight||600);var canvas=document.createElement('canvas');canvas.width=crop.cw;canvas.height=crop.ch;canvas.getContext('2d').drawImage(imgElement,crop.sx,crop.sy,crop.sw,crop.sh,0,0,crop.cw,crop.ch);resolve(canvas.toDataURL('image/jpeg',0.85));}catch(e){try{fetch(imgElement.src).then(function(r){return r.blob();}).then(function(blob){var img=new Image();img.addEventListener('load',function(){var crop=getCrop(img.width||800,img.height||600);var c=document.createElement('canvas');c.width=crop.cw;c.height=crop.ch;c.getContext('2d').drawImage(img,crop.sx,crop.sy,crop.sw,crop.sh,0,0,crop.cw,crop.ch);resolve(c.toDataURL('image/jpeg',0.75));});img.src=URL.createObjectURL(blob);}).catch(function(){resolve(null);});}catch(e2){resolve(null);}}});}
var CL_WHITE=null;var CL_BLACK=null;var CLIENT_H_PX=16;var CLIENT_AR=2;
function recolorSVG(svgText,color){var s=svgText;s=s.replace(/fill="(?!none)[^"]*"/g,'fill="'+color+'"');s=s.replace(/fill:\s*(?!none)[^;"']*/g,'fill:'+color);s=s.replace(/<style[^>]*>[\s\S]*?<\/style>/g,function(m){return m.replace(/fill:\s*[^;}"']*/g,'fill:'+color);});if(svgText.indexOf('fill')===-1)s=s.replace('<svg','<svg fill="'+color+'"');return s;}
function renderSVGToImage(svgText,color,maxH,callback){var colored=recolorSVG(svgText,color);var parser=new DOMParser();var doc=parser.parseFromString(colored,'image/svg+xml');var svgEl=doc.querySelector('svg');var vb=svgEl?svgEl.getAttribute('viewBox'):null;var sw_=svgEl?parseFloat(svgEl.getAttribute('width')||0):0;var sh_=svgEl?parseFloat(svgEl.getAttribute('height')||0):0;var ar=2;if(vb){var p=vb.split(/[\s,]+/).map(Number);ar=p[2]/p[3];}else if(sw_&&sh_)ar=sw_/sh_;var rH=maxH*3,rW=Math.round(rH*ar);var finalSVG=colored.replace(/<svg([^>]*)>/,function(m,a){var n=a.replace(/\s*width="[^"]*"/g,'').replace(/\s*height="[^"]*"/g,'');return'<svg'+n+' width="'+rW+'" height="'+rH+'">';});var blob=new Blob([finalSVG],{type:'image/svg+xml;charset=utf-8'});var url=URL.createObjectURL(blob);var img=new Image();img.onload=function(){var canvas=document.createElement('canvas');canvas.width=rW;canvas.height=rH;var ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,rW,rH);URL.revokeObjectURL(url);var data=ctx.getImageData(0,0,rW,rH).data;var t=rH,le=rW,b=0,r=0;for(var y=0;y<rH;y++)for(var x=0;x<rW;x++){if(data[(y*rW+x)*4+3]>10){if(x<le)le=x;if(x>r)r=x;if(y<t)t=y;if(y>b)b=y;}}if(r<=le||b<=t){callback(null,1);return;}var pad=Math.round(Math.min(r-le,b-t)*0.03);le=Math.max(0,le-pad);t=Math.max(0,t-pad);r=Math.min(rW-1,r+pad);b=Math.min(rH-1,b+pad);var cw=r-le+1,ch=b-t+1;var cr=document.createElement('canvas');cr.width=cw;cr.height=ch;cr.getContext('2d').drawImage(canvas,le,t,cw,ch,0,0,cw,ch);callback(cr.toDataURL('image/png'),cw/ch);};img.onerror=function(){URL.revokeObjectURL(url);callback(null,1);};img.src=url;}
function hexToRgb(h){h=h.replace('#','');return{r:parseInt(h.substr(0,2),16),g:parseInt(h.substr(2,2),16),b:parseInt(h.substr(4,2),16)};}
function rgbToHex(r,g,b){return'#'+[r,g,b].map(function(v){var x=Math.round(Math.max(0,Math.min(255,v))).toString(16);return x.length===1?'0'+x:x;}).join('');}
function lightenHex(h,p){var c=hexToRgb(h);return rgbToHex(c.r+(255-c.r)*p,c.g+(255-c.g)*p,c.b+(255-c.b)*p);}

// ═══ WPP renderSlideHTML ═══
// Differences from VML: no accent bar, no top-left icon, WPP footer structure
function renderSlideHTML(s){
var dk=s.dark;var numColor=dk?'#FFFFFF':'#000050';
var noWpp=(typeof NO_WPP!=='undefined'&&NO_WPP);
var h='';
// WPP: no accent bar
h+='<div class="sn" style="color:'+numColor+';font-weight:600;">'+(s.num||'')+'</div>';
// WPP: no top-left icon (L.wI is null)
s.els.forEach(function(el){
if(el.type==='t'){var vs=el.valign==='middle'?'display:flex;align-items:center;':el.valign==='bottom'?'display:flex;align-items:flex-end;':'';h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;'+(el.h?'height:'+px(el.h)+'px;':'')+vs+'font-size:'+el.size+'px;color:#'+rc(el.color,dk)+';font-weight:'+(el.font==='H'?'300':'400')+';line-height:1.4;">'+esc(el.text)+'</div>';}
else if(el.type==='s'){var bdr=el.border?'border:'+(el.bw||1)+'px solid #'+rc(el.border,dk)+';':'';h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;background:#'+rc(el.fill,dk)+';'+(el.transparency?'opacity:'+(1-el.transparency/100)+';':'')+bdr+'"></div>';}
else if(el.type==='o'){h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h||el.w)+'px;background:#'+rc(el.fill,dk)+';border-radius:50%;"></div>';}
else if(el.type==='i'){h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h||el.w)+'px;font-size:'+px(el.w*.7)+'px;display:flex;align-items:center;justify-content:center;line-height:1;">'+el.icon+'</div>';}
else if(el.type==='d'){h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+(el.h?px(el.h):2)+'px;background:#'+rc(el.color||'accent',dk)+';"></div>';}
else if(el.type==='p'){var bg=rc(el.fill||'accent',dk),tc=rc(el.color||'black',dk);h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;padding:4px 14px;background:#'+bg+';color:#'+tc+';font-size:'+(el.size||10)+'px;font-weight:500;white-space:nowrap;">'+esc(el.text)+'</div>';}
else if(el.type==='b'){h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;background:#'+rc(el.fill||'accent',dk)+';"></div>';}
else if(el.type==='chart'){
var chartType=el.chartType||'bar';var series=el.data||[];var labels_=(series[0]&&series[0].labels)||[];var numL=labels_.length;var cc=(el.opts&&el.opts.chartColors)||['accent','ltGray','dkGray','gray','accentDark'];
if(el.opts&&el.opts.showTitle&&el.opts.title){h+='<div style="position:absolute;left:'+(px(el.x)+5)+'px;top:'+(px(el.y)+2)+'px;font-size:11px;color:#'+rc('title',dk)+';font-weight:500;">'+esc(el.opts.title)+'</div>';}
if(chartType==='bar'){var isStacked=el.opts&&el.opts.barGrouping==='stacked';var isMulti=series.length>1;var isHoriz=el.opts&&el.opts.barDir==='bar';
if(isStacked&&isMulti){var totals=[];for(var li=0;li<numL;li++){var tot=0;series.forEach(function(sr){tot+=(sr.values[li]||0);});totals.push(tot);}var maxT=Math.max.apply(null,totals.concat([1]));var barW_=Math.max(Math.round(px(el.w)/numL)-16,30);var avH=px(el.h)*0.7;h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;display:flex;align-items:flex-end;justify-content:space-around;padding:20px 10px 28px;">';for(var li=0;li<numL;li++){var stkH=Math.round((totals[li]/maxT)*avH);h+='<div style="display:flex;flex-direction:column;align-items:center;gap:3px;"><div style="font-size:10px;color:#'+rc('body',dk)+';font-weight:500;">'+totals[li]+'</div><div style="width:'+barW_+'px;height:'+stkH+'px;display:flex;flex-direction:column;">';for(var si=series.length-1;si>=0;si--){var segV=series[si].values[li]||0;var segH=totals[li]>0?Math.round((segV/totals[li])*stkH):0;h+='<div style="height:'+segH+'px;background:#'+rc(cc[si%cc.length]||'accent',dk)+';"></div>';}h+='</div><div style="font-size:8px;color:#'+rc('muted',dk)+';text-align:center;">'+esc(labels_[li]||'')+'</div></div>';}h+='</div>';
if(el.opts&&el.opts.showLegend){h+='<div style="position:absolute;left:'+(px(el.x)+10)+'px;top:'+(px(el.y)+px(el.h)-18)+'px;display:flex;gap:12px;">';series.forEach(function(sr,si){var lclr=rc(cc[si%cc.length]||'accent',dk);h+='<div style="display:flex;align-items:center;gap:4px;font-size:8px;color:#'+rc('body',dk)+';"><div style="width:8px;height:8px;background:#'+lclr+';flex-shrink:0;"></div>'+esc(sr.name||'')+'</div>';});h+='</div>';}
}else if(isHoriz){var vals_=(series[0]&&series[0].values)||[];var maxV_=Math.max.apply(null,vals_.concat([1]));var bH2=Math.max(Math.round(px(el.h)/Math.max(vals_.length,1))-12,16);var avW2=px(el.w)*0.65;h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;display:flex;flex-direction:column;justify-content:space-around;padding:10px 20px 10px 10px;">';vals_.forEach(function(v,vi){var bw2=Math.max(Math.round((v/maxV_)*avW2),2);h+='<div style="display:flex;align-items:center;gap:8px;"><div style="width:70px;text-align:right;font-size:8px;color:#'+rc('muted',dk)+';flex-shrink:0;">'+esc(labels_[vi]||'')+'</div><div style="height:'+bH2+'px;width:'+bw2+'px;background:#'+rc(cc[vi%cc.length]||'accent',dk)+';"></div><div style="font-size:10px;color:#'+rc('body',dk)+';font-weight:500;">'+v+'</div></div>';});h+='</div>';
}else{var vals_=(series[0]&&series[0].values)||[];var maxV_=Math.max.apply(null,vals_.concat([1]));var bW=Math.max(Math.round(px(el.w)/Math.max(vals_.length,1))-16,20);var avH3=px(el.h)*0.7;h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;display:flex;align-items:flex-end;justify-content:space-around;padding:20px 10px 28px;">';vals_.forEach(function(v,vi){var bh=Math.max(Math.round((v/maxV_)*avH3),2);h+='<div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="font-size:10px;color:#'+rc('body',dk)+';font-weight:500;">'+v+'</div><div style="width:'+bW+'px;height:'+bh+'px;background:#'+rc(cc[vi%cc.length]||'accent',dk)+';"></div><div style="font-size:8px;color:#'+rc('muted',dk)+';text-align:center;line-height:1.2;">'+esc(labels_[vi]||'')+'</div></div>';});h+='</div>';}}
else if(chartType==='pie'||chartType==='doughnut'){var cd_=(series[0])||{};var pvals=cd_.values||[];var plbls=cd_.labels||[];var total_=0;pvals.forEach(function(v){total_+=v;});total_=total_||1;var grad='',pct_=0;pvals.forEach(function(v,vi){var clr=rc(cc[vi%cc.length]||'accent',dk);var end_=pct_+(v/total_)*100;grad+=(vi>0?',':'')+'#'+clr+' '+pct_.toFixed(1)+'% '+end_.toFixed(1)+'%';pct_=end_;});var sz=Math.min(px(el.w),px(el.h))*0.5;h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;display:flex;align-items:center;gap:20px;padding:10px 20px;"><div style="position:relative;width:'+sz+'px;height:'+sz+'px;border-radius:50%;background:conic-gradient('+grad+');flex-shrink:0;">';if(chartType==='doughnut'){var hole=Math.round(sz*0.55);h+='<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:'+hole+'px;height:'+hole+'px;border-radius:50%;background:#'+(dk?C.black:C.white)+';"></div>';}h+='</div><div style="display:flex;flex-direction:column;gap:6px;">';pvals.forEach(function(v,vi){var clr=rc(cc[vi%cc.length]||'accent',dk);h+='<div style="display:flex;align-items:center;gap:8px;font-size:10px;color:#'+rc('body',dk)+';"><div style="width:10px;height:10px;border-radius:50%;background:#'+clr+';flex-shrink:0;"></div>'+esc(plbls[vi]||'')+' \u2014 '+((v/total_)*100).toFixed(1)+'%</div>';});h+='</div></div>';}
else if(chartType==='line'||chartType==='area'){var allVals=[];series.forEach(function(sr){(sr.values||[]).forEach(function(v){allVals.push(v);});});var llbls=(series[0]&&series[0].labels)||[];var numPts=llbls.length;var lmax=Math.max.apply(null,allVals.concat([1]));var lmin=Math.min.apply(null,allVals.concat([0]));if(lmin>0)lmin=0;var lrng=lmax-lmin||1;var pw_=px(el.w),ph_=px(el.h);var pL=50,pR=15,pT=25,pB=series.length>1?50:30;var cW_=pw_-pL-pR,cH_=ph_-pT-pB;var areaOp=(el.opts&&el.opts.chartColorsOpacity)?el.opts.chartColorsOpacity/100:0.15;h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+pw_+'px;height:'+ph_+'px;"><svg viewBox="0 0 '+pw_+' '+ph_+'" style="width:100%;height:100%;">';for(var gi=0;gi<=4;gi++){var gy=Math.round(pT+(gi/4)*cH_);h+='<line x1="'+pL+'" y1="'+gy+'" x2="'+(pw_-pR)+'" y2="'+gy+'" stroke="#'+(dk?'1a1a5e':'e0e0e0')+'" stroke-width="1" stroke-dasharray="4"/>';}series.forEach(function(sr,si){var svals=sr.values||[];var lclr=rc(cc[si%cc.length]||'accent',dk);var pts=[];svals.forEach(function(v,vi){var ptx=pL+(vi/(Math.max(numPts-1,1)))*cW_;var pty=pT+cH_-((v-lmin)/lrng)*cH_;pts.push({x:Math.round(ptx),y:Math.round(pty),v:v});});var polyStr=pts.map(function(p){return p.x+','+p.y;}).join(' ');if(chartType==='area'&&pts.length>1){h+='<polygon points="'+pts[0].x+','+(pT+cH_)+' '+polyStr+' '+pts[pts.length-1].x+','+(pT+cH_)+'" fill="#'+lclr+'" opacity="'+areaOp+'"/>';}if(pts.length>1){h+='<polyline points="'+polyStr+'" fill="none" stroke="#'+lclr+'" stroke-width="'+(series.length>1?2:3)+'" stroke-linejoin="round"/>';}pts.forEach(function(p){h+='<circle cx="'+p.x+'" cy="'+p.y+'" r="'+(series.length>1?3:4)+'" fill="#'+lclr+'"/>';});if(series.length===1){pts.forEach(function(p){h+='<text x="'+p.x+'" y="'+(p.y-10)+'" text-anchor="middle" font-size="9" fill="#'+rc('body',dk)+'">'+p.v+'</text>';});}});llbls.forEach(function(l,vi){var ptx=pL+(vi/(Math.max(numPts-1,1)))*cW_;h+='<text x="'+Math.round(ptx)+'" y="'+(pT+cH_+15)+'" text-anchor="middle" font-size="8" fill="#'+rc('muted',dk)+'">'+esc(l)+'</text>';});if(series.length>1){var lgY=pT+cH_+30,lgX=pL;series.forEach(function(sr,si){var lclr=rc(cc[si%cc.length]||'accent',dk);h+='<circle cx="'+lgX+'" cy="'+lgY+'" r="4" fill="#'+lclr+'"/>';h+='<text x="'+(lgX+8)+'" y="'+(lgY+4)+'" font-size="8" fill="#'+rc('body',dk)+'">'+esc(sr.name||'')+'</text>';lgX+=Math.max((sr.name||'').length*5+25,60);});}h+='</svg></div>';}
else{h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;display:flex;align-items:center;justify-content:center;background:#'+(dk?C.dkGray:'F8F8F6')+';border:1px dashed #'+rc('muted',dk)+';"><div style="font-size:11px;color:#'+rc('muted',dk)+';text-align:center;">'+esc((chartType||'').toUpperCase())+' Chart</div></div>';}}
else if(el.type==='tbl'){h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;overflow:hidden;"><table style="width:100%;border-collapse:collapse;font-size:10px;">';if(el.headers){h+='<tr>';el.headers.forEach(function(hd){h+='<th style="background:#'+C.accent+';color:#fff;padding:6px 10px;text-align:left;font-weight:500;">'+esc(hd)+'</th>';});h+='</tr>';}(el.rows||[]).forEach(function(row,ri){h+='<tr style="background:'+(ri%2===0?(dk?'#0A1E78':'#f8f8f6'):'transparent')+'">';row.forEach(function(cell){h+='<td style="padding:5px 10px;border-bottom:1px solid '+(dk?'#323CAA':'#eee')+';color:#'+rc('body',dk)+';">'+esc(String(cell))+'</td>';});h+='</tr>';});h+='</table></div>';}
});
// ═══ WPP FOOTER ═══
// Left: "PRIVATE & CONFIDENTIAL"
h+='<div style="position:absolute;left:29px;bottom:16px;font-size:7px;color:#'+(dk?'D2BEFF':'6464D2')+';">PRIVATE & CONFIDENTIAL</div>';
// Right: WPP logo + client logo
h+='<div style="position:absolute;right:50px;bottom:12px;display:flex;align-items:center;gap:8px;">';
var cl=dk?CL_WHITE:CL_BLACK;
if(cl){h+='<img src="'+cl+'" style="height:'+CLIENT_H_PX+'px;object-fit:contain;">';h+='<div style="width:4px;height:4px;background:#6464D2;flex-shrink:0;"></div>';}
if(!noWpp){h+='<img src="'+(dk?L.wW:L.bW)+'" style="height:17px;">';}
h+='</div>';
return h;}

function renderAll(){
var w=document.getElementById('sw'),h='';
D.forEach(function(s,i){var dk=s.dark;
h+='<div class="sf '+(dk?'dk':'lt')+'" style="display:'+(i===0?'block':'none')+';">';
h+=renderSlideHTML(s);h+='</div>';});w.innerHTML=h;}

window.renderHybridSlides=function(){if(typeof resolveLayouts==='function')resolveLayouts();var frames=document.querySelectorAll('#sw .sf');if(frames.length!==D.length)return;D.forEach(function(s,i){var heroes=[];frames[i].querySelectorAll('.hero-container').forEach(function(hc){heroes.push(hc);});var dk=s.dark;frames[i].className='sf '+(dk?'dk':'lt');frames[i].style.display=i===0?'block':'none';frames[i].innerHTML=renderSlideHTML(s);heroes.forEach(function(hc){if(s.els){s.els.forEach(function(e){if(e.type==='img'&&e.ref===hc.id){hc.style.position='absolute';hc.style.left=px(e.x)+'px';hc.style.top=px(e.y)+'px';hc.style.width=px(e.w)+'px';hc.style.height=px(e.h)+'px';hc.style.overflow='hidden';}});}frames[i].appendChild(hc);});});};

function refreshSlides(){var frames=document.querySelectorAll('.sf');frames.forEach(function(f,idx){f.style.display=idx===cur?'block':'none';});document.getElementById('nc').textContent=(cur+1)+' / '+D.length;document.getElementById('hc').textContent='SLIDE '+(cur+1)+' OF '+D.length;}
function placeImages(){D.forEach(function(s,i){s.els.forEach(function(el){if(el.type==='img'){var container=document.getElementById(el.ref);if(container){var frames=document.querySelectorAll('.sf');if(frames[i]){container.style.position='absolute';container.style.left=px(el.x)+'px';container.style.top=px(el.y)+'px';container.style.width=px(el.w)+'px';container.style.height=px(el.h)+'px';container.style.display='block';frames[i].appendChild(container);}}}});});}

// ═══ WPP PPTX: client logo helper ═══
function aL(sl,dk,pptx){var noWpp=(typeof NO_WPP!=='undefined'&&NO_WPP);var cl=dk?CL_WHITE:CL_BLACK;if(!cl)return;var CLIENT_H_IN=CLIENT_H_PX/80,CLIENT_W_IN=CLIENT_H_IN*CLIENT_AR;if(!noWpp){var clX=12.0-CLIENT_W_IN-0.5,clY=7.0+(0.21-CLIENT_H_IN)/2;sl.addImage({data:cl,x:clX,y:clY,w:CLIENT_W_IN,h:CLIENT_H_IN});}else{sl.addImage({data:cl,x:.29,y:7.0+(0.21-CLIENT_H_IN)/2,w:CLIENT_W_IN,h:CLIENT_H_IN});}}

// ═══ WPP PPTX: make slide with WPP masters ═══
function ms(pptx,s){var dk=s.dark;var sl=pptx.addSlide({masterName:dk?'WPP_DARK':'WPP_LIGHT'});aL(sl,dk,pptx);if(s.num)sl.addText(s.num,{x:12.3,y:.31,w:.75,h:.2,fontSize:10,fontFace:FONT.head,color:dk?C.white:C.black,align:'right',bold:true,autoFit:true});return sl;}

// ═══ WPP PPTX: build slide ═══
async function bs(pptx,s,slideIdx){var sl=ms(pptx,s),dk=s.dark;if(!s.els)return;
var shapes=[];s.els.forEach(function(e){if(e.type==='s')shapes.push({x:e.x,y:e.y,w:e.w,h:e.h});});
for(var j=0;j<s.els.length;j++){var el=s.els[j];
if(el.type==='t'){var parent=null;shapes.forEach(function(sh){if(el.x>=sh.x&&el.y>=sh.y&&el.x<sh.x+sh.w&&el.y<sh.y+sh.h){if(!parent||(sh.w*sh.h<parent.w*parent.h))parent=sh;}});var isLabel=false;s.els.forEach(function(oe){if((oe.type==='o'||oe.type==='s')&&oe.x===el.x&&oe.y===el.y&&Math.abs(oe.w-el.w)<0.05&&Math.abs((oe.h||oe.w)-(el.h||el.w))<0.05)isLabel=true;});var tw,th;if(isLabel){tw=el.w;th=el.h||0.3;}else{tw=el.w*FW;if(parent){var maxTw=parent.x+parent.w-el.x;if(tw>maxTw)tw=maxTw;}tw=Math.min(tw,12.83-el.x);th=(el.h||.3)*FH;}var fs=el.size;if(parent&&el.font==='B'&&fs<=11&&el.h&&el.h>=1.5)fs=13;sl.addText(el.text,{x:el.x,y:el.y,w:tw,h:th,fontFace:el.font==='H'?FONT.head:FONT.body,fontSize:fs,color:rc(el.color,dk),valign:el.valign||'top',align:isLabel?'center':undefined,margin:0,autoFit:!isLabel});}
else if(el.type==='s'){var opts={x:el.x,y:el.y,w:el.w,h:el.h,fill:{color:rc(el.fill,dk)}};if(el.transparency)opts.fill.transparency=el.transparency;if(el.border){opts.line={color:rc(el.border,dk),width:el.bw||1};opts.shadow={type:'outer',blur:4,offset:1,angle:135,color:'000000',opacity:0.08};}sl.addShape(pptx.shapes.RECTANGLE,opts);}
else if(el.type==='o'){var oOpts={x:el.x,y:el.y,w:el.w,h:el.h||el.w,fill:{color:rc(el.fill,dk)}};if(el.transparency)oOpts.fill.transparency=el.transparency;sl.addShape(pptx.shapes.OVAL,oOpts);}
else if(el.type==='i'){sl.addText(el.icon,{x:el.x,y:el.y,w:el.w,h:el.h||el.w,fontSize:el.size||Math.round(el.w*40),align:'center',valign:'middle',margin:0});}
else if(el.type==='d'){sl.addShape(pptx.shapes.RECTANGLE,{x:el.x,y:el.y,w:el.w,h:el.h||0.02,fill:{color:rc(el.color||'accent',dk)}});}
else if(el.type==='p'){sl.addText(el.text,{x:el.x,y:el.y,w:(el.w||1.5)*FW,h:(el.h||.3)*FH,fontSize:el.size||10,fontFace:FONT.head,color:rc(el.color||'black',dk),fill:{color:rc(el.fill||'accent',dk)},align:'center',valign:'middle',margin:0,autoFit:true});}
else if(el.type==='b'){sl.addShape(pptx.shapes.RECTANGLE,{x:el.x,y:el.y,w:el.w,h:el.h,fill:{color:rc(el.fill||'accent',dk)}});}
else if(el.type==='chart'){var chartMap={bar:pptx.charts.BAR,line:pptx.charts.LINE,pie:pptx.charts.PIE,doughnut:pptx.charts.DOUGHNUT,area:pptx.charts.AREA};var ct=chartMap[el.chartType||'bar']||pptx.charts.BAR;var isPie=(el.chartType==='pie'||el.chartType==='doughnut');var cOpts={x:el.x,y:el.y,w:el.w,h:el.h};if(isPie){cOpts.showValue=false;cOpts.showLabel=false;cOpts.showPercent=true;cOpts.dataLabelColor='FFFFFF';cOpts.dataLabelFontSize=12;cOpts.dataLabelFontFace=FONT.body;cOpts.dataLabelPosition='bestFit';cOpts.dataBorder={pt:2,color:dk?C.black:C.white};cOpts.showLegend=true;cOpts.legendPos='b';cOpts.legendFontSize=10;cOpts.legendFontFace=FONT.body;cOpts.legendColor=rc('body',dk);if(el.chartType==='doughnut')cOpts.holeSize=70;}else{cOpts.showValue=true;cOpts.valueFontSize=9;cOpts.valueFontFace=FONT.body;cOpts.dataLabelColor=rc('body',dk);cOpts.dataLabelFontFace=FONT.body;cOpts.dataLabelFontSize=9;cOpts.dataLabelPosition='outEnd';cOpts.catAxisLabelFontSize=9;cOpts.catAxisLabelFontFace=FONT.body;cOpts.catAxisLabelColor=rc('body',dk);cOpts.valAxisLabelFontSize=8;cOpts.valAxisLabelFontFace=FONT.body;cOpts.valAxisLabelColor=C.gray;cOpts.valGridLine={color:'D2BEFF',style:'dash',size:1};cOpts.catGridLine={style:'none'};}if(el.opts){if(el.opts.chartColors){cOpts.chartColors=el.opts.chartColors.map(function(c){return rc(c,dk);});}for(var k in el.opts){if(k!=='chartColors')cOpts[k]=el.opts[k];}}sl.addChart(ct,el.data,cOpts);}
else if(el.type==='tbl'){var tRows=[];var hdrFill=rc('accent',dk);var altFill=dk?'0A1E78':'F8F8F6';var bdrClr=dk?'323CAA':'D2BEFF';if(el.headers){tRows.push(el.headers.map(function(hd){return{text:hd,options:{bold:true,color:'FFFFFF',fill:{color:hdrFill},fontFace:FONT.head,fontSize:10,margin:[6,10,6,10]}};}));}(el.rows||[]).forEach(function(row,ri){tRows.push(row.map(function(cell){return{text:String(cell),options:{color:rc('body',dk),fontFace:FONT.body,fontSize:10,fill:ri%2===0?{color:altFill}:undefined,margin:[5,10,5,10]}};}));});var tblOpts={x:el.x,y:el.y,w:el.w,border:{type:'solid',pt:0.5,color:bdrClr},autoPage:false};if(el.colW)tblOpts.colW=el.colW;sl.addTable(tRows,tblOpts);}
else if(el.type==='img'){var container=document.getElementById(el.ref);var genImg=findImg(container);if(genImg){try{var imgData=await captureImage(genImg,el.w,el.h);if(imgData){sl.addImage({data:imgData,x:el.x,y:el.y,w:el.w,h:el.h});}}catch(e){}}}
}}

// ═══ WPP PPTX: download ═══
async function dlP(){var btn=document.getElementById('dlBtn'),st=document.getElementById('st');
btn.disabled=true;btn.textContent='Compiling...';
try{if(typeof PptxGenJS==='undefined'){st.textContent='Error: PptxGenJS not loaded.';btn.disabled=false;btn.textContent='\u2B07 DOWNLOAD PPTX';return;}
var allFrames=document.querySelectorAll('.sf');allFrames.forEach(function(f){f.style.display='block';});
st.textContent='Preparing...';await new Promise(function(r){setTimeout(r,1000);});
var pptx=new PptxGenJS();pptx.layout='LAYOUT_WIDE';
pptx.title=document.getElementById('deckTitle').innerText;
pptx.subject='WPP v'+(typeof PV!=='undefined'?PV:'');
pptx.company='WPP';
pptx.theme={headFontFace:'WPP',bodyFontFace:'WPP'};
if(typeof resolveLayouts==='function')resolveLayouts();
var noWpp=(typeof NO_WPP!=='undefined'&&NO_WPP);
// WPP masters: no accent bar, footer left, logo right
var dkObjs=[
{text:{text:'PRIVATE & CONFIDENTIAL',options:{x:.29,y:7.0,w:5,h:.25,fontSize:7,fontFace:FONT.body,color:'D2BEFF',align:'left'}}}
];
var ltObjs=[
{text:{text:'PRIVATE & CONFIDENTIAL',options:{x:.29,y:7.0,w:5,h:.25,fontSize:7,fontFace:FONT.body,color:'6464D2',align:'left'}}}
];
if(!noWpp){
if(L.wW)dkObjs.push({image:{data:L.wW,x:12.0,y:7.0,w:.68,h:.21,sizing:{type:'contain',w:.68,h:.21}}});
if(L.bW)ltObjs.push({image:{data:L.bW,x:12.0,y:7.0,w:.68,h:.21,sizing:{type:'contain',w:.68,h:.21}}});
}
pptx.defineSlideMaster({title:'WPP_DARK',background:{color:'000050'},objects:dkObjs});
pptx.defineSlideMaster({title:'WPP_LIGHT',background:{color:'FFFFFF'},objects:ltObjs});
for(var i=0;i<D.length;i++){st.textContent='Compiling slide '+(i+1)+' of '+D.length+'...';
await new Promise(function(r){requestAnimationFrame(r);});await bs(pptx,D[i],i);}
st.textContent='Packaging...';await new Promise(function(r){requestAnimationFrame(r);});
var t=document.getElementById('deckTitle').innerText.replace(/[^a-zA-Z0-9]/g,'_');
await pptx.writeFile({fileName:'WPP_'+t+'_'+D.length+'slides.pptx'});
allFrames.forEach(function(f,idx){f.style.display=idx===cur?'block':'none';});
st.textContent='\u2705 Download complete!';
}catch(e){st.textContent='Error: '+e.message;document.querySelectorAll('.sf').forEach(function(f,idx){f.style.display=idx===cur?'block':'none';});}
btn.disabled=false;btn.textContent='\u2B07 DOWNLOAD PPTX';}

var cur=0;
function show(i){var f=document.querySelectorAll('.sf');if(i<0||i>=f.length)return;f[cur].style.display='none';cur=i;f[cur].style.display='block';document.getElementById('nc').textContent=(cur+1)+' / '+D.length;document.getElementById('hc').textContent='SLIDE '+(cur+1)+' OF '+D.length;}
function scl(){var vp=document.getElementById('vp'),wr=document.getElementById('sw');var s=Math.min((vp.clientWidth-32)/1066,(vp.clientHeight-8)/600,1);wr.style.transform='scale('+s+')';wr.style.transformOrigin='top center';}