// ═══ PwC DECK ENGINE v1.0 ═══
// Based on VML DECK ENGINE v11.8 — adapted for PwC brand
// PwC orange, Georgia/Arial fonts, PwC wordmark, light-only slides

var C={black:'1A1A1A',white:'FFFFFF',dkGray:'2D2D2D',mdGray:'595959',gray:'8C8C8C',ltGray:'D9D9D9',cream:'F7EFE9',accent:AH,accentLight:AL,accentDark:AD};
var FONT={head:'Georgia',body:'Arial'};
// PwC logos — pre-rendered from official PwC SVG (image2.svg in template)
// WM_BLACK: black pwc wordmark for light slides
// WM_WHITE: white pwc wordmark for dark slides (rarely used — PwC is light-only)
var VP={w:{vB:'0 0 100 100',p:['M66.7 47.3001C64.2 47.7001 63 49.5001 63 52.7001C63 55.9001 64.7 58.1001 67.2 58.1001C69.7 58.1001 69.5 57.7001 71.8 56.6001V59.2001C69.1 60.5001 67.5 60.8001 65.2 60.8001C62.9 60.8001 61.1 60.2001 59.8 58.8001C58.4 57.4001 57.7 55.5001 57.7 53.5001C57.7 48.9001 61.1 45.8001 66.1 45.8001C71.1 45.8001 71.7 47.3001 71.7 49.5001C71.7 51.7001 70.6 51.9001 69.1 51.9001C67.6 51.9001 67.6 51.7001 66.8 51.2001V47.3001H66.7ZM54.6 53.4001C56.8 50.6001 57.6 49.5001 57.6 48.1001C57.6 46.7001 56.5 45.6001 55.1 45.6001C53.7 45.6001 53.4 46.0001 53 46.5001V52.2001L49.4 57.0001V46.0001H46L40.3 55.5001V46.0001H38.3L33.1 47.3001V48.6001L35.9 48.9001V60.5001H39.6L45.1 51.5001V60.5001H49.1L54.7 53.4001H54.6ZM22.2 49.0001C23 49.0001 23.5 48.8001 23.9 48.8001C26.3 48.8001 27.6 50.4001 27.6 53.4001C27.6 56.4001 26 58.8001 23.1 58.8001C20.2 58.8001 22.7 58.8001 22.3 58.8001V49.1001L22.2 49.0001ZM22.2 60.4001C23.1 60.4001 24.1 60.4001 24.6 60.4001C29.5 60.4001 32.6 57.3001 32.6 52.6001C32.6 47.9001 30.3 45.7001 27.1 45.7001C23.9 45.7001 24.8 46.0001 22.2 47.6001V45.7001H20.7L15 47.4001V48.8001H17.4V65.0001L15.3 65.5001V66.8001H24.6V65.5001L22.2 65.0001V60.3001V60.4001Z','M64.1 41.8H48.6L51.2 37.4H66.7L64.1 41.8ZM84.9 33H69.4L66.8 37.4H82.3L84.9 33Z']}};
var L={wW:rl(VP.w,150,52,'#FFFFFF'),bW:rl(VP.w,150,52,'#1A1A1A'),wI:null,bI:null};
// Full-color PwC logo for cover slides (black text + orange marks)
var COVER_LOGO=(function(){
var vb=VP.w.vB.split(/[\s,]+/).map(Number);
// Render large, then crop to actual content bounds
var tw=600,th=600;
var c=document.createElement('canvas');
c.width=tw;c.height=th;
var ctx=c.getContext('2d');
var s=Math.min(tw/vb[2],th/vb[3]);
ctx.translate((tw-vb[2]*s)/2,(th-vb[3]*s)/2);
ctx.scale(s,s);
ctx.fillStyle='#1A1A1A';
ctx.fill(new Path2D(VP.w.p[0]));
ctx.fillStyle='#FD5108';
ctx.fill(new Path2D(VP.w.p[1]));
// Find actual pixel bounds
var data=ctx.getImageData(0,0,tw,th).data;
var top=th,left=tw,bot=0,right=0;
for(var y=0;y<th;y++)for(var x=0;x<tw;x++){
if(data[(y*tw+x)*4+3]>10){if(x<left)left=x;if(x>right)right=x;if(y<top)top=y;if(y>bot)bot=y;}}
var pad=4;
left=Math.max(0,left-pad);top=Math.max(0,top-pad);
right=Math.min(tw-1,right+pad);bot=Math.min(th-1,bot+pad);
var cw=right-left+1,ch=bot-top+1;
var cr=document.createElement('canvas');
cr.width=cw;cr.height=ch;
cr.getContext('2d').drawImage(c,left,top,cw,ch,0,0,cw,ch);
return cr.toDataURL('image/png');
})();
// ═══ PwC Cover Gradient Background ═══
// Renders once on load, used for title/closing slides
var COVER_BG=(function(){
var w=1920,h=1080;
var c=document.createElement('canvas');
c.width=w;c.height=h;
var ctx=c.getContext('2d');
var grad=ctx.createLinearGradient(0,h,w,0);
grad.addColorStop(0,'#FFFFFF');
grad.addColorStop(0.5,'#FFE3D8');
grad.addColorStop(1,'#FEAF8F');
ctx.fillStyle=grad;
ctx.fillRect(0,0,w,h);
return c.toDataURL('image/jpeg',0.92);
})();
var PARALLELOGRAM='data:image/svg+xml;base64,'+btoa('<svg width="1361" height="289" xmlns="http://www.w3.org/2000/svg"><path d="M4 288 74.75 5 1359 5 1288.25 288Z" fill="#FA510A"/></svg>');
// rl() still needed for icon rendering
function rl(p,w,h,f){try{var c=document.createElement('canvas');c.width=w*2;c.height=h*2;var x=c.getContext('2d');var v=p.vB.split(/[\s,]+/).map(Number);var s=Math.min(w*2/v[2],h*2/v[3]);x.translate((w*2-v[2]*s)/2,(h*2-v[3]*s)/2);x.scale(s,s);x.fillStyle=f;p.p.forEach(function(d){x.fill(new Path2D(d));});return c.toDataURL('image/png');}catch(e){return null;}}
var PPI=80;var FW=1.15;var FH=1.08;
function px(v){return Math.round(v*PPI);}
function rc(k,dk){if(C[k])return C[k];switch(k){case 'title':return dk?C.white:C.black;case 'body':return dk?C.ltGray:C.mdGray;case 'sub':return dk?C.accentLight:C.mdGray;case 'muted':return C.gray;case 'cardBg':return dk?C.dkGray:'FAFAFA';case 'ok':return '28A745';case 'warn':return 'E67E00';case 'bad':return 'C12638';default:return k;}}
function esc(s){if(s==null)return '';var d=document.createElement('div');d.textContent=String(s);return d.innerHTML.replace(/\n/g,'<br>');}
function findImg(container){if(!container)return null;var imgs=container.querySelectorAll('img');for(var k=0;k<imgs.length;k++){if(imgs[k].src&&imgs[k].src!==''&&imgs[k].src!==window.location.href&&imgs[k].src.indexOf('data:image/svg')===-1)return imgs[k];}return null;}
function captureImage(imgElement,tw,th){return new Promise(function(resolve){var getCrop=function(nw,nh){var tr=tw/th,ir=nw/nh,sx=0,sy=0,sw=nw,sh=nh;if(ir>tr){sw=nh*tr;sx=(nw-sw)/2;}else{sh=nw/tr;sy=(nh-sh)/2;}var cw=Math.min(Math.round(tw*96),1200),ch=Math.min(Math.round(th*96),800);return{sx:sx,sy:sy,sw:sw,sh:sh,cw:cw,ch:ch};};try{var crop=getCrop(imgElement.naturalWidth||800,imgElement.naturalHeight||600);var canvas=document.createElement('canvas');canvas.width=crop.cw;canvas.height=crop.ch;canvas.getContext('2d').drawImage(imgElement,crop.sx,crop.sy,crop.sw,crop.sh,0,0,crop.cw,crop.ch);resolve(canvas.toDataURL('image/jpeg',0.85));}catch(e){try{fetch(imgElement.src).then(function(r){return r.blob();}).then(function(blob){var img=new Image();img.addEventListener('load',function(){var crop=getCrop(img.width||800,img.height||600);var c=document.createElement('canvas');c.width=crop.cw;c.height=crop.ch;c.getContext('2d').drawImage(img,crop.sx,crop.sy,crop.sw,crop.sh,0,0,crop.cw,crop.ch);resolve(c.toDataURL('image/jpeg',0.75));});img.src=URL.createObjectURL(blob);}).catch(function(){resolve(null);});}catch(e2){resolve(null);}}});}
var CL_WHITE=null;var CL_BLACK=null;var CLIENT_H_PX=16;var CLIENT_AR=2;
function recolorSVG(svgText,color){var s=svgText;s=s.replace(/fill="(?!none)[^"]*"/g,'fill="'+color+'"');s=s.replace(/fill:\s*(?!none)[^;"']*/g,'fill:'+color);s=s.replace(/<style[^>]*>[\s\S]*?<\/style>/g,function(m){return m.replace(/fill:\s*[^;}"']*/g,'fill:'+color);});if(svgText.indexOf('fill')===-1)s=s.replace('<svg','<svg fill="'+color+'"');return s;}
function renderSVGToImage(svgText,color,maxH,callback){var colored=recolorSVG(svgText,color);var parser=new DOMParser();var doc=parser.parseFromString(colored,'image/svg+xml');var svgEl=doc.querySelector('svg');var vb=svgEl?svgEl.getAttribute('viewBox'):null;var sw_=svgEl?parseFloat(svgEl.getAttribute('width')||0):0;var sh_=svgEl?parseFloat(svgEl.getAttribute('height')||0):0;var ar=2;if(vb){var p=vb.split(/[\s,]+/).map(Number);ar=p[2]/p[3];}else if(sw_&&sh_)ar=sw_/sh_;var rH=maxH*3,rW=Math.round(rH*ar);var finalSVG=colored.replace(/<svg([^>]*)>/,function(m,a){var n=a.replace(/\s*width="[^"]*"/g,'').replace(/\s*height="[^"]*"/g,'');return'<svg'+n+' width="'+rW+'" height="'+rH+'">';});var blob=new Blob([finalSVG],{type:'image/svg+xml;charset=utf-8'});var url=URL.createObjectURL(blob);var img=new Image();img.onload=function(){var canvas=document.createElement('canvas');canvas.width=rW;canvas.height=rH;var ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,rW,rH);URL.revokeObjectURL(url);var data=ctx.getImageData(0,0,rW,rH).data;var t=rH,le=rW,b=0,r=0;for(var y=0;y<rH;y++)for(var x=0;x<rW;x++){if(data[(y*rW+x)*4+3]>10){if(x<le)le=x;if(x>r)r=x;if(y<t)t=y;if(y>b)b=y;}}if(r<=le||b<=t){callback(null,1);return;}var pad=Math.round(Math.min(r-le,b-t)*0.03);le=Math.max(0,le-pad);t=Math.max(0,t-pad);r=Math.min(rW-1,r+pad);b=Math.min(rH-1,b+pad);var cw=r-le+1,ch=b-t+1;var cr=document.createElement('canvas');cr.width=cw;cr.height=ch;cr.getContext('2d').drawImage(canvas,le,t,cw,ch,0,0,cw,ch);callback(cr.toDataURL('image/png'),cw/ch);};img.onerror=function(){URL.revokeObjectURL(url);callback(null,1);};img.src=url;}
function hexToRgb(h){h=h.replace('#','');return{r:parseInt(h.substr(0,2),16),g:parseInt(h.substr(2,2),16),b:parseInt(h.substr(4,2),16)};}
function rgbToHex(r,g,b){return'#'+[r,g,b].map(function(v){var x=Math.round(Math.max(0,Math.min(255,v))).toString(16);return x.length===1?'0'+x:x;}).join('');}
function lightenHex(h,p){var c=hexToRgb(h);return rgbToHex(c.r+(255-c.r)*p,c.g+(255-c.g)*p,c.b+(255-c.b)*p);}

function renderAll(){
var w=document.getElementById('sw'),h='';
var noPwc=(typeof NO_PWC!=='undefined'&&NO_PWC);
D.forEach(function(s,i){
var dk=s.dark;var numColor=dk?'#F5F5F5':'#191919';
h+='<div class="sf '+(dk?'dk':'lt')+'" style="display:'+(i===0?'block':'none')+';">';
h+='<div class="sn" style="position:absolute;right:20px;bottom:30px;font-size:10px;color:#'+C.accent+';font-weight:600;">'+(s.num||'')+'</div>';
  // PwC: no icon element
s.els.forEach(function(el){
if(el.type==='t'){var vs=el.valign==='middle'?'display:flex;align-items:center;':el.valign==='bottom'?'display:flex;align-items:flex-end;':'';var fw=el.bold?'700':(el.font==='H'?'400':'400');h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;'+(el.h?'height:'+px(el.h)+'px;':'')+vs+'font-size:'+el.size+'px;color:#'+rc(el.color,dk)+';font-weight:'+fw+';line-height:1.4;">'+esc(el.text)+'</div>';}
else if(el.type==='s'){var bdr=el.border?'border:'+(el.bw||1)+'px solid #'+rc(el.border,dk)+';':'';h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;background:#'+rc(el.fill,dk)+';'+(el.transparency?'opacity:'+(1-el.transparency/100)+';':'')+bdr+'"></div>';}
else if(el.type==='o'){h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h||el.w)+'px;background:#'+rc(el.fill,dk)+';border-radius:50%;"></div>';}
else if(el.type==='i'){var ic=(typeof ICONS!=='undefined'&&el.icon)?ICONS[el.icon]:null;if(ic){var iData=rl(ic,px(el.w),px(el.h||el.w),'#'+rc(el.color||'accent',dk));if(iData){h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h||el.w)+'px;"><img src="'+iData+'" style="width:100%;height:100%;object-fit:contain;"></div>';}}}
else if(el.type==='d'){h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+(el.h?px(el.h):2)+'px;background:#'+rc(el.color||'accent',dk)+';"></div>';}
else if(el.type==='p'){var bg=rc(el.fill||'accent',dk),tc=rc(el.color||'black',dk);h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;padding:4px 14px;background:#'+bg+';color:#'+tc+';font-size:'+(el.size||10)+'px;font-weight:500;white-space:nowrap;">'+esc(el.text)+'</div>';}
else if(el.type==='b'){h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;background:#'+rc(el.fill||'accent',dk)+';"></div>';}
else if(el.type==='chart'){var chartType=el.chartType||'bar';var series=el.data||[];var labels_=(series[0]&&series[0].labels)||[];var numL=labels_.length;var cc=(el.opts&&el.opts.chartColors)||['accent','ltGray','dkGray','gray','accentDark'];if(el.opts&&el.opts.showTitle&&el.opts.title){h+='<div style="position:absolute;left:'+(px(el.x)+5)+'px;top:'+(px(el.y)+2)+'px;font-size:11px;color:#'+rc('title',dk)+';font-weight:500;">'+esc(el.opts.title)+'</div>';}if(chartType==='bar'){var isStacked=el.opts&&el.opts.barGrouping==='stacked';var isMulti=series.length>1;var isHoriz=el.opts&&el.opts.barDir==='bar';if(isStacked&&isMulti){var totals=[];for(var li=0;li<numL;li++){var tot=0;series.forEach(function(sr){tot+=(sr.values[li]||0);});totals.push(tot);}var maxT=Math.max.apply(null,totals.concat([1]));var barW_=Math.max(Math.round(px(el.w)/numL)-16,30);var avH=px(el.h)*0.7;h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;display:flex;align-items:flex-end;justify-content:space-around;padding:20px 10px 28px;">';for(var li=0;li<numL;li++){var stkH=Math.round((totals[li]/maxT)*avH);h+='<div style="display:flex;flex-direction:column;align-items:center;gap:3px;"><div style="font-size:10px;color:#'+rc('body',dk)+';font-weight:500;">'+totals[li]+'</div><div style="width:'+barW_+'px;height:'+stkH+'px;display:flex;flex-direction:column;">';for(var si=series.length-1;si>=0;si--){var segV=series[si].values[li]||0;var segH=totals[li]>0?Math.round((segV/totals[li])*stkH):0;h+='<div style="height:'+segH+'px;background:#'+rc(cc[si%cc.length]||'accent',dk)+';"></div>';}h+='</div><div style="font-size:8px;color:#'+rc('muted',dk)+';text-align:center;">'+esc(labels_[li]||'')+'</div></div>';}h+='</div>';if(el.opts&&el.opts.showLegend){h+='<div style="position:absolute;left:'+(px(el.x)+10)+'px;top:'+(px(el.y)+px(el.h)-18)+'px;display:flex;gap:12px;">';series.forEach(function(sr,si){var lclr=rc(cc[si%cc.length]||'accent',dk);h+='<div style="display:flex;align-items:center;gap:4px;font-size:8px;color:#'+rc('body',dk)+';"><div style="width:8px;height:8px;background:#'+lclr+';flex-shrink:0;"></div>'+esc(sr.name||'')+'</div>';});h+='</div>';}}else if(isHoriz){var vals_=(series[0]&&series[0].values)||[];var maxV_=Math.max.apply(null,vals_.concat([1]));var bH2=Math.max(Math.round(px(el.h)/Math.max(vals_.length,1))-12,16);var avW2=px(el.w)*0.65;h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;display:flex;flex-direction:column;justify-content:space-around;padding:10px 20px 10px 10px;">';vals_.forEach(function(v,vi){var bw2=Math.max(Math.round((v/maxV_)*avW2),2);h+='<div style="display:flex;align-items:center;gap:8px;"><div style="width:70px;text-align:right;font-size:8px;color:#'+rc('muted',dk)+';flex-shrink:0;">'+esc(labels_[vi]||'')+'</div><div style="height:'+bH2+'px;width:'+bw2+'px;background:#'+rc(cc[vi%cc.length]||'accent',dk)+';"></div><div style="font-size:10px;color:#'+rc('body',dk)+';font-weight:500;">'+v+'</div></div>';});h+='</div>';}else{var vals_=(series[0]&&series[0].values)||[];var maxV_=Math.max.apply(null,vals_.concat([1]));var bW=Math.max(Math.round(px(el.w)/Math.max(vals_.length,1))-16,20);var avH3=px(el.h)*0.7;h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;display:flex;align-items:flex-end;justify-content:space-around;padding:20px 10px 28px;">';vals_.forEach(function(v,vi){var bh=Math.max(Math.round((v/maxV_)*avH3),2);h+='<div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="font-size:10px;color:#'+rc('body',dk)+';font-weight:500;">'+v+'</div><div style="width:'+bW+'px;height:'+bh+'px;background:#'+rc(cc[vi%cc.length]||'accent',dk)+';"></div><div style="font-size:8px;color:#'+rc('muted',dk)+';text-align:center;line-height:1.2;">'+esc(labels_[vi]||'')+'</div></div>';});h+='</div>';}}else if(chartType==='pie'||chartType==='doughnut'){var cd_=(series[0])||{};var pvals=cd_.values||[];var plbls=cd_.labels||[];var total_=0;pvals.forEach(function(v){total_+=v;});total_=total_||1;var grad='',pct_=0;pvals.forEach(function(v,vi){var clr=rc(cc[vi%cc.length]||'accent',dk);var end_=pct_+(v/total_)*100;grad+=(vi>0?',':'')+'#'+clr+' '+pct_.toFixed(1)+'% '+end_.toFixed(1)+'%';pct_=end_;});var sz=Math.min(px(el.w),px(el.h))*0.5;h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;display:flex;align-items:center;gap:20px;padding:10px 20px;"><div style="position:relative;width:'+sz+'px;height:'+sz+'px;border-radius:50%;background:conic-gradient('+grad+');flex-shrink:0;">';if(chartType==='doughnut'){var hole=Math.round(sz*0.55);h+='<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:'+hole+'px;height:'+hole+'px;border-radius:50%;background:#'+(dk?C.black:C.white)+';"></div>';}h+='</div><div style="display:flex;flex-direction:column;gap:6px;">';pvals.forEach(function(v,vi){var clr=rc(cc[vi%cc.length]||'accent',dk);h+='<div style="display:flex;align-items:center;gap:8px;font-size:10px;color:#'+rc('body',dk)+';"><div style="width:10px;height:10px;border-radius:50%;background:#'+clr+';flex-shrink:0;"></div>'+esc(plbls[vi]||'')+' \u2014 '+((v/total_)*100).toFixed(1)+'%</div>';});h+='</div></div>';}else if(chartType==='line'||chartType==='area'){var allVals=[];series.forEach(function(sr){(sr.values||[]).forEach(function(v){allVals.push(v);});});var llbls=(series[0]&&series[0].labels)||[];var numPts=llbls.length;var lmax=Math.max.apply(null,allVals.concat([1]));var lmin=Math.min.apply(null,allVals.concat([0]));if(lmin>0)lmin=0;var lrng=lmax-lmin||1;var pw_=px(el.w),ph_=px(el.h);var pL=50,pR=15,pT=25,pB=series.length>1?50:30;var cW_=pw_-pL-pR,cH_=ph_-pT-pB;var areaOp=(el.opts&&el.opts.chartColorsOpacity)?el.opts.chartColorsOpacity/100:0.15;h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+pw_+'px;height:'+ph_+'px;"><svg viewBox="0 0 '+pw_+' '+ph_+'" style="width:100%;height:100%;">';for(var gi=0;gi<=4;gi++){var gy=Math.round(pT+(gi/4)*cH_);h+='<line x1="'+pL+'" y1="'+gy+'" x2="'+(pw_-pR)+'" y2="'+gy+'" stroke="#'+(dk?'444':'e0e0e0')+'" stroke-width="1" stroke-dasharray="4"/>';}series.forEach(function(sr,si){var svals=sr.values||[];var lclr=rc(cc[si%cc.length]||'accent',dk);var pts=[];svals.forEach(function(v,vi){var ptx=pL+(vi/(Math.max(numPts-1,1)))*cW_;var pty=pT+cH_-((v-lmin)/lrng)*cH_;pts.push({x:Math.round(ptx),y:Math.round(pty),v:v});});var polyStr=pts.map(function(p){return p.x+','+p.y;}).join(' ');if(chartType==='area'&&pts.length>1){h+='<polygon points="'+pts[0].x+','+(pT+cH_)+' '+polyStr+' '+pts[pts.length-1].x+','+(pT+cH_)+'" fill="#'+lclr+'" opacity="'+areaOp+'"/>';}if(pts.length>1){h+='<polyline points="'+polyStr+'" fill="none" stroke="#'+lclr+'" stroke-width="'+(series.length>1?2:3)+'" stroke-linejoin="round"/>';}pts.forEach(function(p){h+='<circle cx="'+p.x+'" cy="'+p.y+'" r="'+(series.length>1?3:4)+'" fill="#'+lclr+'"/>';});if(series.length===1){pts.forEach(function(p){h+='<text x="'+p.x+'" y="'+(p.y-10)+'" text-anchor="middle" font-size="9" fill="#'+rc('body',dk)+'">'+p.v+'</text>';});}});llbls.forEach(function(l,vi){var ptx=pL+(vi/(Math.max(numPts-1,1)))*cW_;h+='<text x="'+Math.round(ptx)+'" y="'+(pT+cH_+15)+'" text-anchor="middle" font-size="8" fill="#'+rc('muted',dk)+'">'+esc(l)+'</text>';});if(series.length>1){var lgY=pT+cH_+30,lgX=pL;series.forEach(function(sr,si){var lclr=rc(cc[si%cc.length]||'accent',dk);h+='<circle cx="'+lgX+'" cy="'+lgY+'" r="4" fill="#'+lclr+'"/>';h+='<text x="'+(lgX+8)+'" y="'+(lgY+4)+'" font-size="8" fill="#'+rc('body',dk)+'">'+esc(sr.name||'')+'</text>';lgX+=Math.max((sr.name||'').length*5+25,60);});}h+='</svg></div>';}else{h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;display:flex;align-items:center;justify-content:center;background:#'+(dk?C.dkGray:'F8F8F6')+';border:1px dashed #'+rc('muted',dk)+';"><div style="font-size:11px;color:#'+rc('muted',dk)+';text-align:center;">'+esc((chartType||'').toUpperCase())+' Chart</div></div>';}}
else if(el.type==='tbl'){if(el._agendaTable){h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;">';(el.rows||[]).forEach(function(row){h+='<div style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid #E8E8E8;">';h+='<div style="width:40px;font-size:28px;font-weight:700;color:#'+C.accent+';font-family:Arial,sans-serif;">'+esc(row[0])+'</div>';h+='<div style="flex:1;font-size:28px;color:#'+rc('title',dk)+';font-family:Arial,sans-serif;padding-left:12px;">'+esc(row[1])+'</div>';h+='</div>';});h+='</div>';}else{h+='<div style="position:absolute;left:'+px(el.x)+'px;top:'+px(el.y)+'px;width:'+px(el.w)+'px;height:'+px(el.h)+'px;overflow:hidden;"><table style="width:100%;border-collapse:collapse;font-size:10px;">';if(el.headers){h+='<tr>';el.headers.forEach(function(hd){h+='<th style="background:#'+C.accent+';color:#fff;padding:6px 10px;text-align:left;font-weight:500;">'+esc(hd)+'</th>';});h+='</tr>';}(el.rows||[]).forEach(function(row,ri){h+='<tr style="background:'+(ri%2===0?(dk?'#2A2A2A':'#f8f8f6'):'transparent')+'">';row.forEach(function(cell){h+='<td style="padding:5px 10px;border-bottom:1px solid '+(dk?'#444':'#eee')+';color:#'+rc('body',dk)+';">'+esc(String(cell))+'</td>';});h+='</tr>';});h+='</table></div>';}}
else if(el.type==='cover-logo'){
h+='<img src="'+COVER_LOGO+'" style="position:absolute;left:'+px(0.40)+'px;top:'+px(0.40)+'px;height:'+px(0.66)+'px;width:auto;">';
}
else if(el.type==='footer'){
var deckTitle=document.getElementById('deckTitle')?document.getElementById('deckTitle').innerText:'';
h+='<div style="position:absolute;left:29px;bottom:14px;font-size:9px;color:#595959;font-family:Arial,sans-serif;">'+esc(deckTitle)+'</div>';
h+='<div style="position:absolute;right:20px;bottom:14px;font-size:9px;color:#1A1A1A;font-family:Arial,sans-serif;font-weight:700;">PwC</div>';
}
else if(el.type==='cover-meta'){
h+='<div style="position:absolute;left:'+px(0.40)+'px;top:'+px(6.65)+'px;width:'+px(5.16)+'px;font-size:14px;font-family:Arial,sans-serif;color:#1A1A1A;line-height:1.5;">';
if(el.presenter) h+='<div>Presentation by <strong>'+esc(el.presenter)+'</strong></div>';
if(el.date) h+='<div>'+esc(el.date)+'</div>';
h+='</div>';
}
else if(el.type==='closing-bg'){
h+='<div style="position:absolute;left:0;top:0;width:100%;height:100%;background:linear-gradient(to top right,#FFFFFF,#FFE3D8,#FEAF8F);"></div>';}
else if(el.type==='cover-bg'){
h+='<div style="position:absolute;left:0;top:0;width:100%;height:100%;background:linear-gradient(to top right,#FFFFFF,#FFE3D8,#FEAF8F);"></div>';
h+='<div style="position:absolute;left:'+px(4.665)+'px;top:'+px(4.625)+'px;width:'+px(4.106)+'px;height:'+px(0.858)+'px;background:#FA510A;transform:skewX(-30deg);"></div>';
h+='<div style="position:absolute;left:'+px(8.774)+'px;top:'+px(3.750)+'px;width:'+px(4.107)+'px;height:'+px(0.857)+'px;background:#FA510A;transform:skewX(-30deg);"></div>';
}});
var isCoverSlide=(s.layout==='title'||s.layout==='closing');
if(!isCoverSlide){
var deckTitle=document.getElementById('deckTitle')?document.getElementById('deckTitle').innerText:'';
h+='<div style="position:absolute;left:29px;bottom:14px;font-size:10.5px;font-family:Arial,sans-serif;"><span style="color:#1A1A1A;font-weight:700;">PwC</span><span style="color:#1A1A1A;margin-left:12px;">'+esc(deckTitle)+'</span></div>';
h+='<div style="position:absolute;right:20px;bottom:14px;font-size:10.5px;color:#1A1A1A;font-family:Arial,sans-serif;">'+(s.num||'')+'</div>';}
h+='</div>';});w.innerHTML=h;}
function refreshSlides(){var frames=document.querySelectorAll('.sf');frames.forEach(function(f,idx){f.style.display=idx===cur?'block':'none';});document.getElementById('nc').textContent=(cur+1)+' / '+D.length;document.getElementById('hc').textContent='SLIDE '+(cur+1)+' OF '+D.length;}
function placeImages(){D.forEach(function(s,i){s.els.forEach(function(el){if(el.type==='img'){var container=document.getElementById(el.ref);if(container){var frames=document.querySelectorAll('.sf');if(frames[i]){container.style.position='absolute';container.style.left=px(el.x)+'px';container.style.top=px(el.y)+'px';container.style.width=px(el.w)+'px';container.style.height=px(el.h)+'px';container.style.display='block';frames[i].appendChild(container);}}}});});}
function aL(sl,dk,pptx){var noPwc=(typeof NO_PWC!=='undefined'&&NO_PWC);var cl=CL_BLACK;if(!cl)return;var CLIENT_H_IN=CLIENT_H_PX/80,CLIENT_W_IN=CLIENT_H_IN*CLIENT_AR;sl.addImage({data:cl,x:.29,y:6.55,w:CLIENT_W_IN,h:CLIENT_H_IN});}
function ms(pptx,s,slideIdx){var dk=s.dark;var isCover=(s.layout==='title');var isClosing=(s.layout==='closing');var sl;
if(isCover||isClosing){
sl=pptx.addSlide({masterName:'PwC_COVER'});
sl.background={data:COVER_BG};
if(isCover){
sl.addImage({data:PARALLELOGRAM,x:4.665,y:4.625,w:4.106,h:0.858});
sl.addImage({data:PARALLELOGRAM,x:8.774,y:3.750,w:4.107,h:0.857});}
}else{
sl=pptx.addSlide({masterName:'PwC_LIGHT'});
sl.slideNumber={x:12.3,y:'93%',fontSize:10.5,fontFace:'Arial',color:'1A1A1A'};
}
aL(sl,dk,pptx);return sl;}async function bs(pptx,s,slideIdx){var sl=ms(pptx,s,slideIdx),dk=s.dark;if(!s.els)return;
for(var j=0;j<s.els.length;j++){var el=s.els[j];
if(el.type==='cover-bg'||el.type==='closing-bg'){continue;}
else if(el.type==='t'){var tw=Math.min(el.w*FW,12.83-el.x);var tOpts={x:el.x,y:el.y,w:tw,h:(el.h||.3)*FH,fontFace:el.font==='H'?FONT.head:FONT.body,fontSize:el.size,color:rc(el.color,dk),valign:el.valign||'top',margin:0,autoFit:true};if(el.bold)tOpts.bold=true;sl.addText(el.text,tOpts);}
else if(el.type==='s'){var opts={x:el.x,y:el.y,w:el.w,h:el.h,fill:{color:rc(el.fill,dk)}};if(el.transparency)opts.fill.transparency=el.transparency;if(el.border){opts.line={color:rc(el.border,dk),width:el.bw||1};}sl.addShape(pptx.shapes.RECTANGLE,opts);}
else if(el.type==='o'){var oOpts={x:el.x,y:el.y,w:el.w,h:el.h||el.w,fill:{color:rc(el.fill,dk)}};if(el.transparency)oOpts.fill.transparency=el.transparency;sl.addShape(pptx.shapes.OVAL,oOpts);}
else if(el.type==='i'){var ic=(typeof ICONS!=='undefined'&&el.icon)?ICONS[el.icon]:null;if(ic){var iData=rl(ic,Math.round(el.w*96),Math.round((el.h||el.w)*96),'#'+rc(el.color||'accent',dk));if(iData){sl.addImage({data:iData,x:el.x,y:el.y,w:el.w,h:el.h||el.w});}}}
else if(el.type==='d'){sl.addShape(pptx.shapes.RECTANGLE,{x:el.x,y:el.y,w:el.w,h:el.h||0.02,fill:{color:rc(el.color||'accent',dk)}});}
else if(el.type==='p'){sl.addText(el.text,{x:el.x,y:el.y,w:(el.w||1.5)*FW,h:(el.h||.3)*FH,fontSize:el.size||10,fontFace:FONT.head,color:rc(el.color||'black',dk),fill:{color:rc(el.fill||'accent',dk)},align:'center',valign:'middle',margin:0,autoFit:true});}
else if(el.type==='b'){sl.addShape(pptx.shapes.RECTANGLE,{x:el.x,y:el.y,w:el.w,h:el.h,fill:{color:rc(el.fill||'accent',dk)}});}
else if(el.type==='chart'){var chartMap={bar:pptx.charts.BAR,line:pptx.charts.LINE,pie:pptx.charts.PIE,doughnut:pptx.charts.DOUGHNUT,area:pptx.charts.AREA};if(pptx.charts.BAR3D)chartMap.bar3d=pptx.charts.BAR3D;if(pptx.charts.SCATTER)chartMap.scatter=pptx.charts.SCATTER;if(pptx.charts.RADAR)chartMap.radar=pptx.charts.RADAR;if(pptx.charts.BUBBLE)chartMap.bubble=pptx.charts.BUBBLE;var ct=chartMap[el.chartType||'bar']||pptx.charts.BAR;var isPie=(el.chartType==='pie'||el.chartType==='doughnut');var cOpts={x:el.x,y:el.y,w:el.w,h:el.h};if(isPie){cOpts.showValue=false;cOpts.showLabel=false;cOpts.showPercent=true;cOpts.dataLabelColor='FFFFFF';cOpts.dataLabelFontSize=12;cOpts.dataLabelFontFace=FONT.body;cOpts.dataLabelPosition='bestFit';cOpts.dataBorder={pt:2,color:dk?C.black:C.white};cOpts.showLegend=true;cOpts.legendPos='b';cOpts.legendFontSize=10;cOpts.legendFontFace=FONT.body;cOpts.legendColor=rc('body',dk);if(el.chartType==='doughnut')cOpts.holeSize=70;}else{cOpts.showValue=true;cOpts.valueFontSize=9;cOpts.valueFontFace=FONT.body;cOpts.dataLabelColor=rc('body',dk);cOpts.dataLabelFontFace=FONT.body;cOpts.dataLabelFontSize=9;cOpts.dataLabelPosition='outEnd';cOpts.catAxisLabelFontSize=9;cOpts.catAxisLabelFontFace=FONT.body;cOpts.catAxisLabelColor=rc('body',dk);cOpts.valAxisLabelFontSize=8;cOpts.valAxisLabelFontFace=FONT.body;cOpts.valAxisLabelColor=C.gray;cOpts.valGridLine={color:'E0E0E0',style:'dash',size:1};cOpts.catGridLine={style:'none'};}if(el.opts){if(el.opts.chartColors){cOpts.chartColors=el.opts.chartColors.map(function(c){return rc(c,dk);});}for(var k in el.opts){if(k!=='chartColors')cOpts[k]=el.opts[k];}}sl.addChart(ct,el.data,cOpts);}
else if(el.type==='tbl'){if(el._agendaTable){var aRows=[];(el.rows||[]).forEach(function(row){aRows.push([{text:row[0],options:{bold:true,color:C.accent,fontFace:'Arial',fontSize:28,margin:[8,4,8,4]}},{text:row[1],options:{color:rc('title',dk),fontFace:'Arial',fontSize:28,margin:[8,12,8,4]}}]);});sl.addTable(aRows,{x:el.x,y:el.y,w:el.w,colW:[0.6,6.6],border:{type:'solid',pt:0,color:'FFFFFF'},autoPage:false});}else{var tRows=[];var hdrFill=rc('accent',dk);var altFill=dk?'2A2A2A':'F8F8F6';var bdrClr=dk?'444444':'E0E0E0';if(el.headers){tRows.push(el.headers.map(function(hd){return{text:hd,options:{bold:true,color:'FFFFFF',fill:{color:hdrFill},fontFace:FONT.head,fontSize:10,margin:[6,10,6,10]}};}));}(el.rows||[]).forEach(function(row,ri){tRows.push(row.map(function(cell){return{text:String(cell),options:{color:rc('body',dk),fontFace:FONT.body,fontSize:10,fill:ri%2===0?{color:altFill}:undefined,margin:[5,10,5,10]}};}));});var tblOpts={x:el.x,y:el.y,w:el.w,border:{type:'solid',pt:0.5,color:bdrClr},autoPage:false};if(el.colW)tblOpts.colW=el.colW;sl.addTable(tRows,tblOpts);}}
else if(el.type==='cover-logo'){
sl.addImage({data:COVER_LOGO,x:0.40,y:0.40,w:1.35,h:0.66});
}
else if(el.type==='cover-meta'){
var lines=[];
if(el.presenter) lines.push([{text:'Presentation by ',options:{bold:false,color:'1A1A1A',fontFace:'Arial',fontSize:14}},{text:el.presenter,options:{bold:true,color:'1A1A1A',fontFace:'Arial',fontSize:14}}]);
if(el.date) lines.push([{text:el.date,options:{bold:false,color:'1A1A1A',fontFace:'Arial',fontSize:14}}]);
lines.forEach(function(line,li){sl.addText(line,{x:0.40,y:6.65+li*0.25,w:5.16,h:0.25});});
}

else if(el.type==='footer'){continue;}
else if(el.type==='img'){var container=document.getElementById(el.ref);var genImg=findImg(container);if(genImg){try{var imgData=await captureImage(genImg,el.w,el.h);if(imgData){sl.addImage({data:imgData,x:el.x,y:el.y,w:el.w,h:el.h});}}catch(e){}}}
}}
async function dlP(){var btn=document.getElementById('dlBtn'),st=document.getElementById('st');btn.disabled=true;btn.textContent='Compiling...';try{if(typeof PptxGenJS==='undefined'){st.textContent='Error: PptxGenJS not loaded.';btn.disabled=false;btn.textContent='\u2B07 DOWNLOAD PPTX';return;}var allFrames=document.querySelectorAll('.sf');allFrames.forEach(function(f){f.style.display='block';});st.textContent='Preparing...';await new Promise(function(r){setTimeout(r,1000);});
var pptx=new PptxGenJS();pptx.layout='LAYOUT_WIDE';pptx.title=document.getElementById('deckTitle').innerText;pptx.subject='PwC v'+(typeof PV!=='undefined'?PV:'');pptx.company='PwC';pptx.theme={headFontFace:'Georgia',bodyFontFace:'Arial'};
if(typeof resolveLayouts==='function')resolveLayouts();
var noPwc=(typeof NO_PWC!=='undefined'&&NO_PWC);
var deckTitle=document.getElementById('deckTitle').innerText||'';
var ltObjs=[
{text:{text:'PwC',options:{x:.29,y:6.95,w:.8,h:.25,fontSize:10.5,fontFace:'Arial',color:'1A1A1A',align:'left',bold:true}}},
{text:{text:deckTitle,options:{x:1.1,y:6.95,w:5,h:.25,fontSize:10.5,fontFace:'Arial',color:'1A1A1A',align:'left'}}}
];
var coverObjs=[];
pptx.defineSlideMaster({title:'PwC_LIGHT',background:{color:'FFFFFF'},objects:ltObjs});
pptx.defineSlideMaster({title:'PwC_COVER',background:{color:'FFFFFF'},objects:coverObjs});for(var i=0;i<D.length;i++){st.textContent='Compiling slide '+(i+1)+' of '+D.length+'...';await new Promise(function(r){requestAnimationFrame(r);});await bs(pptx,D[i],i);}st.textContent='Packaging...';await new Promise(function(r){requestAnimationFrame(r);});var t=document.getElementById('deckTitle').innerText.replace(/[^a-zA-Z0-9]/g,'_');await pptx.writeFile({fileName:'PwC_'+t+'_'+D.length+'slides.pptx'});allFrames.forEach(function(f,idx){f.style.display=idx===cur?'block':'none';});st.textContent='\u2705 Download complete!';}catch(e){st.textContent='Error: '+e.message;var af=document.querySelectorAll('.sf');af.forEach(function(f,idx){f.style.display=idx===cur?'block':'none';});}btn.disabled=false;btn.textContent='\u2B07 DOWNLOAD PPTX';}
var cur=0;
function show(i){var f=document.querySelectorAll('.sf');if(i<0||i>=f.length)return;f[cur].style.display='none';cur=i;f[cur].style.display='block';document.getElementById('nc').textContent=(cur+1)+' / '+D.length;document.getElementById('hc').textContent='SLIDE '+(cur+1)+' OF '+D.length;}
function scl(){var vp=document.getElementById('vp'),wr=document.getElementById('sw');var s=Math.min((vp.clientWidth-32)/1066,(vp.clientHeight-8)/600,1);wr.style.transform='scale('+s+')';wr.style.transformOrigin='top center';}
