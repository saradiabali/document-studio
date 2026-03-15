// ═══ VML DECK SHELL v1.0 ═══
// UI chrome for deck preview: CSS, HTML shell, event wiring.
// Load AFTER deck.js engine. Call deckInit(config) after setting D array.
// Modes: default (engine renders from D) or imageMode (slides pre-built in #sw).

(function(){
'use strict';

// ── Inject Google Font ──
var fl=document.createElement('link');
fl.href='https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap';
fl.rel='stylesheet';document.head.appendChild(fl);

// ── Inject Base CSS ──
var baseCss='*{margin:0;padding:0;box-sizing:border-box;}'
+'body{background:#111;font-family:"DM Sans",sans-serif;color:#F5F5F5;height:100vh;display:flex;flex-direction:column;overflow:hidden;}'
+'.bp{background:#0a0a0a;border-bottom:1px solid #2a2a2a;padding:6px 24px;display:flex;align-items:center;gap:14px;font-size:11px;flex-wrap:wrap;flex-shrink:0;}'
+'.bp-label{font-size:9px;font-weight:600;letter-spacing:1.5px;color:#5E889C;text-transform:uppercase;}'
+'.bp-upload{cursor:pointer;padding:3px 10px;border:1px dashed #444;border-radius:3px;color:#888;font-size:10px;font-family:"DM Sans",sans-serif;background:none;}'
+'.bp-upload:hover{border-color:#888;color:#ccc;}'
+'.bp-upload.loaded{border-color:#3fb950;border-style:solid;color:#3fb950;}'
+'.bp-remove{cursor:pointer;padding:3px 8px;border:1px dashed #f85149;border-radius:3px;color:#f85149;font-size:10px;font-family:"DM Sans",sans-serif;background:none;display:none;}'
+'.bp-remove:hover{border-style:solid;}'
+'.bp-sep{width:1px;height:16px;background:#333;}'
+'.bp-color{display:flex;align-items:center;gap:5px;color:#888;font-size:10px;}'
+'.bp-color input[type="color"]{width:22px;height:18px;border:1px solid #444;border-radius:2px;background:#222;cursor:pointer;padding:1px;}'
+'.bp-hex{font-family:monospace;font-size:10px;color:#79c0ff;}'
+'.bp-ssize{display:flex;align-items:center;gap:5px;color:#888;font-size:10px;}'
+'.bp-ssize input[type="range"]{width:60px;accent-color:#5E889C;}'
+'.bp-szv{font-family:monospace;font-size:10px;color:#79c0ff;}'
+'.hdr{display:flex;justify-content:space-between;align-items:center;padding:5px 24px;font-size:12px;flex-shrink:0;}'
+'.hdr .tt{color:#F5F5F5;font-weight:500;}'
+'.hdr .ct{color:#8B8C81;}'
+'#vp{display:flex;justify-content:center;padding:4px 16px;flex:1;overflow:hidden;align-items:flex-start;}'
+'#sw{transform-origin:top center;}'
+'.sf{position:relative;width:1066px;height:600px;overflow:hidden;font-family:"DM Sans",sans-serif;border:1px solid #333;}'
+'.dk{background:#191919;}'
+'.lt{background:#F5F5F5;}'
+'.ab{position:absolute;left:29px;top:44px;width:96%;height:2px;}'
+'.sn{position:absolute;right:15px;top:12px;font-size:10px;font-weight:600;}'
+'.li{position:absolute;left:29px;top:12px;width:17px;height:17px;}'
+'.lw{position:absolute;left:29px;bottom:16px;width:54px;height:17px;}'
+'.ctrl{display:flex;justify-content:space-between;align-items:center;padding:6px 24px;flex-shrink:0;}'
+'.ng{display:flex;align-items:center;gap:10px;}'
+'.nb{background:none;border:1px solid #53544A;color:#C2C4B8;padding:5px 12px;cursor:pointer;font-size:11px;}'
+'.nb:hover{border-color:#8B8C81;}'
+'.db{border:none;padding:6px 18px;font-weight:600;font-size:12px;cursor:pointer;}'
+'.db:disabled{opacity:.5;cursor:not-allowed;}'
+'#st{text-align:right;padding:1px 24px;font-size:10px;color:#8B8C81;min-height:14px;flex-shrink:0;}';

var imgCss='.hero-container{position:absolute;overflow:hidden;}'
+'.hero-container img,.hero-container .generated-image,.hero-container .image-loading-container,.hero-container .image-loading-container img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;position:absolute!important;top:0!important;left:0!important;}'
+'.hero-container .image-loading-container{width:100%!important;height:100%!important;position:absolute!important;top:0!important;left:0!important;}';

function injectCSS(extra){
var s=document.createElement('style');
s.textContent=baseCss+(extra||'');
document.head.appendChild(s);
}

// ── Build Shell HTML ──
// Default mode: creates full shell with empty #sw
function buildShell(ah,title,n){
var h='';
// Brand panel
h+='
';
h+='Slide Branding';
h+='\uD83D\uDCD0 Upload Client/Partner Logo';
h+='';
h+='\u2715';
h+='
Logo Size:
16
';
h+='
';
h+='
Color:
#'+ah+'
';
h+='
';
// Header
h+='
'+title+'SLIDE 1 OF '+n+'
';
// Viewport with empty #sw
h+='
';
// Controls
h+='
\u2190 PREV1 / '+n+'NEXT \u2192
';
h+='\u2B07 DOWNLOAD PPTX
';
// Status
h+='
';
document.body.innerHTML=h;
}

// Image mode: wraps chrome AROUND existing #sw (preserving slide DOM for platform image processing)
function wrapAroundSW(ah,title,n){
var sw=document.getElementById('sw');
if(!sw)return;
var swParent=sw.parentNode;
// Create wrapper elements
var bp=document.createElement('div');
bp.innerHTML='
'
+'Slide Branding'
+'\uD83D\uDCD0 Upload Client/Partner Logo'
+''
+'\u2715'
+'
Logo Size:
16
'
+'
'
+'
Color:
#'+ah+'
'
+'
';

var hdr=document.createElement('div');
hdr.innerHTML='
'+title+'SLIDE 1 OF '+n+'
';

var vp=document.createElement('div');
vp.id='vp';

var ctrl=document.createElement('div');
ctrl.innerHTML='
\u2190 PREV1 / '+n+'NEXT \u2192
'
+'\u2B07 DOWNLOAD PPTX
';

var st=document.createElement('div');
st.id='st';

// Move #sw into viewport
vp.appendChild(sw);

// Clear body, rebuild in order
document.body.innerHTML='';
document.body.appendChild(bp.firstChild);
document.body.appendChild(hdr.firstChild);
document.body.appendChild(vp);
document.body.appendChild(ctrl.firstChild);
document.body.appendChild(st);
}

// ── Shared Event Wiring (nav, keyboard, download, resize) ──
function wireNav(){
document.getElementById('pBtn').addEventListener('click',function(){show(cur-1);});
document.getElementById('nBtn').addEventListener('click',function(){show(cur+1);});
document.getElementById('dlBtn').addEventListener('click',dlP);
window.addEventListener('resize',scl);
document.addEventListener('keydown',function(e){
if(e.key==='ArrowLeft')show(cur-1);
if(e.key==='ArrowRight')show(cur+1);
});
}

// ── Default Mode: Brand Panel Events ──
function wireBrandDefault(){
document.getElementById('uploadBtn').addEventListener('click',function(){
document.getElementById('fileInput').click();
});
document.getElementById('fileInput').addEventListener('change',function(e){
if(!e.target.files[0])return;
var reader=new FileReader();
reader.addEventListener('load',function(ev){
var svgText=ev.target.result;
document.getElementById('uploadBtn').classList.add('loaded');
document.getElementById('uploadBtn').textContent='\u2705 '+e.target.files[0].name;
var rmBtn=document.getElementById('removeBtn');
if(rmBtn)rmBtn.style.display='inline-block';
var done=0;
renderSVGToImage(svgText,'#F5F5F5',60,function(d,ar){
CL_WHITE=d;if(ar)CLIENT_AR=ar;done++;
if(done===2){renderAll();refreshSlides();}
});
renderSVGToImage(svgText,'#191919',60,function(d,ar){
CL_BLACK=d;if(ar)CLIENT_AR=ar;done++;
if(done===2){renderAll();refreshSlides();}
});
});
reader.readAsText(e.target.files[0]);
});

var rmBtn=document.getElementById('removeBtn');
if(rmBtn){rmBtn.addEventListener('click',function(){
CL_WHITE=null;CL_BLACK=null;CLIENT_AR=2;
document.getElementById('uploadBtn').classList.remove('loaded');
document.getElementById('uploadBtn').textContent='\uD83D\uDCD0 Upload Client/Partner Logo';
this.style.display='none';
document.getElementById('fileInput').value='';
renderAll();refreshSlides();
});}

document.getElementById('colorPick').addEventListener('input',function(e){
var hex=e.target.value.replace('#','').toUpperCase();
C.accent=hex;AH=hex;
C.accentLight=lightenHex('#'+hex,0.35).replace('#','').toUpperCase();
AL=C.accentLight;
document.getElementById('hexVal').textContent='#'+hex;
document.getElementById('dlBtn').style.background='#'+hex;
renderAll();refreshSlides();
});

document.getElementById('sizeSlider').addEventListener('input',function(e){
CLIENT_H_PX=parseInt(e.target.value);
document.getElementById('szVal').textContent=CLIENT_H_PX;
renderAll();refreshSlides();
});
}

// ── Image Mode: Brand Panel Events ──
function wireBrandImage(){
var prevAccent=AH;
var prevAccentLight=AL;

// Logo upload — DOM insertion (no re-render)
function updateLogosInDOM(){
document.querySelectorAll('.sf').forEach(function(slide){
var dk=slide.classList.contains('dk');
var footers=slide.querySelectorAll('[style*="bottom:12px"]');
var footer=footers.length?footers[footers.length-1]:null;
if(!footer)return;
var cl=dk?CL_WHITE:CL_BLACK;
if(cl){
var existing=footer.querySelector('.f-cl');
if(existing)existing.remove();
var dot=footer.querySelector('.f-dot');
if(dot)dot.remove();
var dotEl=document.createElement('div');
dotEl.className='f-dot';
dotEl.style.cssText='width:4px;height:4px;background:#8B8C81;flex-shrink:0;';
footer.appendChild(dotEl);
var img=document.createElement('img');
img.className='f-cl';
img.src=cl;
img.style.cssText='height:'+CLIENT_H_PX+'px;object-fit:contain;';
footer.appendChild(img);
}
});
}

document.getElementById('uploadBtn').addEventListener('click',function(){
document.getElementById('fileInput').click();
});
document.getElementById('fileInput').addEventListener('change',function(e){
if(!e.target.files[0])return;
var reader=new FileReader();
reader.addEventListener('load',function(ev){
var svgText=ev.target.result;
document.getElementById('uploadBtn').classList.add('loaded');
document.getElementById('uploadBtn').textContent='\u2705 '+e.target.files[0].name;
var rmBtn=document.getElementById('removeBtn');
if(rmBtn)rmBtn.style.display='inline-block';
var done=0;
renderSVGToImage(svgText,'#F5F5F5',60,function(d,ar){
CL_WHITE=d;if(ar)CLIENT_AR=ar;done++;
if(done===2)updateLogosInDOM();
});
renderSVGToImage(svgText,'#191919',60,function(d,ar){
CL_BLACK=d;if(ar)CLIENT_AR=ar;done++;
if(done===2)updateLogosInDOM();
});
});
reader.readAsText(e.target.files[0]);
});

var rmBtn=document.getElementById('removeBtn');
if(rmBtn){rmBtn.addEventListener('click',function(){
CL_WHITE=null;CL_BLACK=null;CLIENT_AR=2;
document.getElementById('uploadBtn').classList.remove('loaded');
document.getElementById('uploadBtn').textContent='\uD83D\uDCD0 Upload Client/Partner Logo';
this.style.display='none';
document.getElementById('fileInput').value='';
document.querySelectorAll('.f-cl').forEach(function(el){el.remove();});
document.querySelectorAll('.f-dot').forEach(function(el){el.remove();});
});}

// Color picker — DOM regex replacement (no re-render)
document.getElementById('colorPick').addEventListener('input',function(e){
var hex=e.target.value.replace('#','').toUpperCase();
var oldA='#'+prevAccent;
var oldAL='#'+prevAccentLight;
C.accent=hex;AH=hex;
C.accentLight=lightenHex('#'+hex,0.35).replace('#','').toUpperCase();
AL=C.accentLight;
var newA='#'+hex;
var newAL='#'+C.accentLight;
document.getElementById('hexVal').textContent='#'+hex;
document.getElementById('dlBtn').style.background='#'+hex;
document.querySelectorAll('.ab').forEach(function(el){el.style.background='#'+hex;});
document.querySelectorAll('.sf [style]').forEach(function(el){
var s=el.getAttribute('style');
if(s&&(s.toLowerCase().indexOf(oldA.toLowerCase())!==-1||s.toLowerCase().indexOf(oldAL.toLowerCase())!==-1)){
s=s.replace(new RegExp(oldA,'gi'),newA);
s=s.replace(new RegExp(oldAL,'gi'),newAL);
el.setAttribute('style',s);
}
});
prevAccent=hex;
prevAccentLight=C.accentLight;
});

// Size slider — update existing logo elements
document.getElementById('sizeSlider').addEventListener('input',function(e){
CLIENT_H_PX=parseInt(e.target.value);
document.getElementById('szVal').textContent=CLIENT_H_PX;
document.querySelectorAll('.f-cl').forEach(function(img){
img.style.height=CLIENT_H_PX+'px';
});
});
}

// ── Public API ──
window.deckInit=function(cfg){
cfg=cfg||{};
var imageMode=!!cfg.imageMode;
var noVml=!!cfg.noVml;
var title=cfg.title||'Presentation';
var n=cfg.count||D.length;

// No-VML mode override
if(noVml){
window.NO_VML=true;
window.aL=function(sl,dk,pptx){
var cl=dk?CL_WHITE:CL_BLACK;
if(cl){
var CLIENT_H_IN=CLIENT_H_PX/80;
var CLIENT_W_IN=CLIENT_H_IN*CLIENT_AR;
sl.addImage({data:cl,x:.29,y:7.0,w:CLIENT_W_IN,h:CLIENT_H_IN});
}
};
}

if(!imageMode){
// ── DEFAULT MODE ──
// Shell builds full HTML, engine renders slides from D array
injectCSS();
buildShell(AH,title,n);
renderAll();
scl();
wireNav();
wireBrandDefault();
} else {
// ── IMAGE MODE ──
// Slides already exist in #sw (written by LLM). Shell wraps chrome around them.
injectCSS(imgCss);
wrapAroundSW(AH,title,n);
// Set logo srcs from engine's L object
document.querySelectorAll('.li').forEach(function(el){
el.src=el.closest('.sf').classList.contains('dk')?L.wI:L.bI;
});
document.querySelectorAll('.lw').forEach(function(el){
el.src=el.closest('.sf').classList.contains('dk')?L.wW:L.bW;
});
// Auto-create missing .li icons
document.querySelectorAll('.sf').forEach(function(frame){
if(!frame.querySelector('.li')){
var img=document.createElement('img');
img.className='li';
img.src=frame.classList.contains('dk')?L.wI:L.bI;
frame.appendChild(img);
}
});
scl();
wireNav();
wireBrandImage();
}
};

})();
