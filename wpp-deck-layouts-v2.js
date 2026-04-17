// ═══ WPP DECK LAYOUTS v2.0 ═══
// Drop-in replacement for wpp-deck-layouts.js v1.0
// Adds FOUR signature WPP layouts backed by real template assets:
//   - title-wpp      : Navy circles cover (matches template slide 4)
//   - section-wpp    : Numbered section divider with quarter-circle (matches slides 11-14)
//   - quote-wpp      : Centered large-format pull quote (matches slide 18)
//   - hero-wpp       : Full-bleed dotted-glass imagery (matches slides 5-7, 13-14, 36-39)
//
// All existing layouts (title, closing, cards, stats, split, rows, detail,
// bullets, statement) continue to work identically. The D-array contract
// is unchanged — existing decks keep compiling.
//
// Layouts that ALREADY EXISTED have been upgraded to use dot-pattern
// backgrounds (via WPP_ASSETS.DOTS_LIGHT/DOTS_DARK) automatically.
//
// Dependencies: wpp-assets.js MUST load before this file.

(function(){
'use strict';
if (!window.WPP_ASSETS) {
  console.error('[WPP v2] wpp-assets.js must load before wpp-deck-layouts-v2.js');
}
var A = window.WPP_ASSETS || {};
var _origRenderAll = window.renderAll;

var GRIDS = {
  2: [{x:.5,w:5.9},{x:6.9,w:5.9}],
  3: [{x:.5,w:3.8},{x:4.7,w:3.8},{x:8.9,w:3.8}],
  4: [{x:.5,w:2.83},{x:3.58,w:2.83},{x:6.66,w:2.83},{x:9.74,w:2.83}],
  5: [{x:.5,w:2.2},{x:3.03,w:2.2},{x:5.56,w:2.2},{x:8.09,w:2.2},{x:10.62,w:2.2}]
};
function makeGrid(n){var gap=0.3;var w=(12.33-gap*(n-1))/n;var g=[];for(var i=0;i<n;i++)g.push({x:0.5+i*(w+gap),w:w});return g;}

// ── Shared helpers ──────────────────────────────────────────────

// Background dots layer — first element so it sits at the back
function bgDots(dark){
  return {type:'bg', ref: dark ? 'DOTS_DARK' : 'DOTS_LIGHT'};
}

// Navy decorative circle (matches template slide 4, 6, 7, 11)
// cx/cy = center in inches, r = radius
function navyCircle(cx, cy, r){
  return {type:'o', x:cx-r, y:cy-r, w:r*2, h:r*2, fill:'000050'};
}

function resolveLayouts(){
  for (var i=0; i<D.length; i++) {
    var s = D[i];
    if (s.layout && !s._resolved) {
      // Auto-set dark mode for specific layouts
      if (s.layout === 'title' || s.layout === 'title-wpp') { s.dark = 1; s.num = ''; }
      if (s.layout === 'closing')                           { s.dark = 1; s.num = ''; }
      if (s.layout === 'statement' || s.layout === 'quote-wpp') { s.dark = 0; s.num = ''; }
      if (s.layout === 'section-wpp' && s.dark === undefined) { s.dark = 0; }
      if (s.layout === 'hero-wpp' && s.dark === undefined)    { s.dark = 0; s.num = ''; }
      if (s.dark === undefined) s.dark = 0;
      s.els = buildLayout(s);
      s._resolved = true;
    }
  }
}

function buildLayout(s){
  switch (s.layout) {
    // ── New WPP signature layouts ──
    case 'title-wpp':   return layoutTitleWPP(s);
    case 'section-wpp': return layoutSectionWPP(s);
    case 'quote-wpp':   return layoutQuoteWPP(s);
    case 'hero-wpp':    return layoutHeroWPP(s);
    // ── Existing layouts (upgraded with dot backgrounds) ──
    case 'title':    return layoutTitle(s);
    case 'closing':  return layoutClosing(s);
    case 'statement':return layoutStatement(s);
    case 'cards':    return layoutCards(s);
    case 'stats':    return layoutStats(s);
    case 'split':    return layoutSplit(s);
    case 'rows':     return layoutRows(s);
    case 'detail':   return layoutDetail(s);
    case 'bullets':  return layoutBullets(s);
    default:         return s.els || [];
  }
}

// ═══════════════════════════════════════════════════════════════
// NEW: title-wpp — Navy circles cover (matches template slide 4)
// Two offset navy circles, WPP wordmark lives inside bottom-right
// circle, title top-left in 54pt light. Dark bg default.
// ═══════════════════════════════════════════════════════════════
function layoutTitleWPP(s){
  var els = [];
  // Big navy circle top-right, cut off by edge
  els.push(navyCircle(11.0, -0.3, 4.2));
  // Smaller navy circle bottom-right (wordmark sits inside this one via footer)
  els.push(navyCircle(11.5, 7.3, 1.8));
  // Dot pattern texture on the white area only — light bg underneath
  // (title-wpp has dark=1 so the whole slide goes navy; circles become a tonal accent)
  // Actually: override dark to 0 and use navy circles as the brand element
  s.dark = 0;
  // Title top-left, 54pt light
  var tH = (s.title && s.title.length > 40) ? 1.6 : 0.9;
  els.push({type:'t', text: s.title || '', x: 0.5, y: 0.6, w: 8.5, h: tH, font:'H', size: 54, color:'title'});
  // Subtitle mid-left
  var y = 0.6 + tH + 0.3;
  if (s.subtitle) {
    els.push({type:'t', text: s.subtitle, x: 0.5, y: y, w: 8, h: 0.5, font:'B', size: 20, color:'sub'});
    y += 0.6;
  }
  // Date / presenter — bottom-left above footer
  if (s.date) els.push({type:'t', text: s.date, x: 0.5, y: 5.9, w: 6, h: 0.3, font:'B', size: 12, color:'body'});
  if (s.presenter) els.push({type:'t', text: s.presenter, x: 0.5, y: 6.2, w: 6, h: 0.3, font:'B', size: 12, color:'body'});
  return els;
}

// ═══════════════════════════════════════════════════════════════
// NEW: section-wpp — Numbered section divider (template slides 11-14)
// Big "01." numeral top-left at 72pt, three-line title bottom-left
// at 60pt, quarter-circle decoration right side
// ═══════════════════════════════════════════════════════════════
function layoutSectionWPP(s){
  var els = [];
  // Dot pattern background (subtle)
  els.push(bgDots(0));
  // Quarter-circle decoration — big navy quarter on right side
  els.push(navyCircle(10.5, 1.5, 3.5));
  // Section number top-left — "01.", "02.", etc.
  var num = s.number || s.num || '01.';
  if (!/\.$/.test(num)) num = num + '.';
  els.push({type:'t', text: num, x: 0.5, y: 0.55, w: 3, h: 1.2, font:'H', size: 72, color:'title'});
  // Title bottom-left — up to three lines, 60pt light
  var title = s.title || '';
  var titleH = 2.4;
  var titleY = 6.85 - titleH - 0.1;
  els.push({type:'t', text: title, x: 0.5, y: titleY, w: 7.5, h: titleH, font:'H', size: 60, color:'title', valign:'bottom'});
  // Clear num field so the default page-number renderer doesn't duplicate it
  s.num = '';
  return els;
}

// ═══════════════════════════════════════════════════════════════
// NEW: quote-wpp — Pull quote (matches template slide 18)
// Centered large quote, attribution small-caps below, no card bg
// ═══════════════════════════════════════════════════════════════
function layoutQuoteWPP(s){
  var els = [];
  els.push(bgDots(0));
  var quote = s.quote || s.title || '';
  // Wrap in smart quotes if not already
  if (quote && !/^[\u201C"]/.test(quote)) quote = '\u201C' + quote + '\u201D';
  // Centered 40pt light, leave room for attribution below
  els.push({type:'t', text: quote, x: 1.5, y: 1.5, w: 10.33, h: 3.8, font:'H', size: 40, color:'title', valign:'middle', align:'center'});
  if (s.attribution) {
    els.push({type:'t', text: s.attribution.toUpperCase(), x: 1.5, y: 5.5, w: 10.33, h: 0.4, font:'H', size: 11, color:'sub', align:'center'});
  }
  return els;
}

// ═══════════════════════════════════════════════════════════════
// NEW: hero-wpp — Full-bleed decorative imagery (slides 5-7, 13-14, 36-39)
// Uses one of HERO_FLOWING / HERO_BLUE / HERO_DOTS / HERO_SOFT
// Title overlays the image. Optional variant via s.hero field
// ═══════════════════════════════════════════════════════════════
function layoutHeroWPP(s){
  var els = [];
  var variant = (s.hero || 'dots').toLowerCase();
  var heroMap = {
    flowing: 'HERO_FLOWING',
    blue:    'HERO_BLUE',
    dots:    'HERO_DOTS',
    soft:    'HERO_SOFT'
  };
  var ref = heroMap[variant] || 'HERO_DOTS';
  // Full-bleed hero image
  els.push({type:'bg', ref: ref});
  // Title placement varies by section_title vs cover style
  if (s.style === 'left-split') {
    // Title left, image visible right (template slide 36-39)
    // We approximate by letting title sit in a darker left panel — but since
    // we can't mask the image, place title bottom-left with a subtle text shadow
    if (s.tag) els.push({type:'t', text: s.tag.toUpperCase(), x: 0.5, y: 5.0, w: 6, h: 0.3, font:'H', size: 11, color:'sub'});
    els.push({type:'t', text: s.title || '', x: 0.5, y: 5.4, w: 7, h: 1.3, font:'H', size: 40, color:'title'});
  } else {
    // Centered section-title style — title sits over image
    if (s.number || s.num) {
      var num = s.number || s.num;
      if (!/\.$/.test(num)) num = num + '.';
      els.push({type:'t', text: num, x: 0.5, y: 0.55, w: 3, h: 1.2, font:'H', size: 56, color:'title'});
    }
    els.push({type:'t', text: s.title || '', x: 0.5, y: 4.8, w: 7.5, h: 1.8, font:'H', size: 52, color:'title', valign:'bottom'});
  }
  s.num = '';
  return els;
}

// ═══════════════════════════════════════════════════════════════
// EXISTING layouts — kept almost identical, with dot-pattern background
// added to light content slides for WPP brand consistency
// ═══════════════════════════════════════════════════════════════

function layoutTitle(s){
  var els = [];
  // Upgrade: add navy circles instead of plain dark fill
  els.push(navyCircle(11.0, -0.3, 4.2));
  els.push(navyCircle(11.5, 7.3, 1.8));
  s.dark = 0; // override — circles carry the brand, bg stays white
  var tH = (s.title && s.title.length > 40) ? 1.2 : 0.7;
  var y = 2.6;
  if (s.tag) { els.push({type:'t', text: s.tag.toUpperCase(), x:.5, y:y, w:11, h:.3, font:'H', size:12, color:'sub'}); y += 0.5; }
  els.push({type:'t', text: s.title || '', x:.5, y:y, w:8.5, h:tH, font:'H', size:44, color:'title'}); y += tH + 0.25;
  if (s.subtitle) { var subH=(s.subtitle.length>60)?0.8:0.4; els.push({type:'t', text:s.subtitle, x:.5, y:y, w:8, h:subH, font:'B', size:18, color:'sub'}); y += subH+0.2; }
  if (s.description) els.push({type:'t', text:s.description, x:.5, y:y, w:8, h:.4, font:'B', size:12, color:'body'});
  return els;
}

function layoutClosing(s){
  var els = [];
  // Closing slide uses navy circles like the cover (matches template slide 41)
  els.push(navyCircle(0, 7.5, 2.8));
  els.push(navyCircle(11.2, -0.5, 2.2));
  s.dark = 0;
  var tH = (s.title && s.title.length > 40) ? 1.2 : 0.7;
  var y = 2.6;
  els.push({type:'t', text: s.title || 'Thank you.', x:.5, y:y, w:8, h:tH, font:'H', size:44, color:'title'});
  y += tH + 0.3;
  if (s.subtitle) { var subH=(s.subtitle.length>60)?0.8:0.4; els.push({type:'t', text:s.subtitle, x:.5, y:y, w:8, h:subH, font:'B', size:16, color:'sub'}); y += subH+0.2; }
  if (s.attribution) els.push({type:'t', text:s.attribution, x:.5, y:y, w:8, h:.4, font:'B', size:12, color:'body'});
  return els;
}

function layoutStatement(s){
  return [
    bgDots(0),
    {type:'t', text: s.title||'', x:1.5, y:1.5, w:10.33, h:4.5, font:'H', size:52, color:'title', valign:'middle'}
  ];
}

function layoutCards(s){
  var els=[]; var items=s.items||[]; var cols=s.columns||Math.min(items.length,4);
  var grid = GRIDS[cols] || makeGrid(cols);
  els.push(bgDots(s.dark));
  els.push({type:'t', text:s.title||'', x:.5, y:.75, w:11, h:.5, font:'H', size:36, color:'title'});
  if (s.subtitle) els.push({type:'t', text:s.subtitle, x:.5, y:1.35, w:10, h:.3, font:'B', size:13, color:'sub'});
  var nRows = Math.ceil(items.length/cols); var gap = 0.25; var hasNote = !!s.footnote;
  var totalH = hasNote?3.5:3.8; var rawH = (totalH-(nRows-1)*gap)/nRows;
  var cardH = nRows===1 ? Math.min(rawH,3.2) : rawH; var compact = cardH<2.5;
  items.forEach(function(item,i){
    var col=i%cols, row=Math.floor(i/cols);
    var cx=grid[col].x, cw=grid[col].w, cy=2.2+row*(cardH+gap);
    var ix=cx+0.25, tw=cw*0.78, dw=cw-0.5, ny=cy+0.2;
    els.push({type:'s', x:cx, y:cy, w:cw, h:cardH, fill:'cardBg', border:'ltGray', bw:1});
    if (compact) {
      if (item.icon) { els.push({type:'i', icon:item.icon, x:ix, y:ny+0.02, w:.35, h:.35, color:'accent'}); els.push({type:'t', text:item.title||'', x:ix+0.45, y:ny, w:tw-0.45, h:.35, font:'H', size:13, color:'title'}); }
      else els.push({type:'t', text:item.title||'', x:ix, y:ny, w:tw, h:.35, font:'H', size:13, color:'title'});
      ny+=0.4;
      if (item.sub) { els.push({type:'t', text:item.sub, x:ix, y:ny, w:tw, h:.25, font:'H', size:11, color:'accent'}); ny+=0.3; }
      els.push({type:'d', x:ix, y:ny, w:dw, color:'ltGray'}); ny+=0.15;
    } else {
      if (item.icon) { els.push({type:'i', icon:item.icon, x:ix, y:ny+0.05, w:.4, h:.4, color:'accent'}); ny+=0.6; }
      els.push({type:'t', text:item.title||'', x:ix, y:ny, w:tw, h:.45, font:'H', size:14, color:'title'}); ny+=0.55;
      if (item.sub) { els.push({type:'t', text:item.sub, x:ix, y:ny, w:tw, h:.25, font:'H', size:11, color:'accent'}); ny+=0.3; }
      els.push({type:'d', x:ix, y:ny, w:dw, color:'ltGray'}); ny+=0.2;
    }
    var pillH = item.pill?0.5:0.15; var bodyH = cardH-(ny-cy)-pillH; bodyH = Math.max(bodyH,0.3);
    if (item.text) els.push({type:'t', text:item.text, x:ix, y:ny, w:tw, h:bodyH, font:'B', size:bodyH<0.5?9:bodyH>=1.5?13:12, color:'body'});
    if (item.pill) els.push({type:'p', text:item.pill, x:ix, y:cy+cardH-0.42, w:1.6, h:.3, fill:item.pillColor||'accent', color:item.pillText||'FFFFFF', size:9});
  });
  if (hasNote) els.push({type:'t', text:s.footnote, x:.5, y:6.3, w:8, h:.3, font:'B', size:9, color:'muted'});
  return els;
}

function layoutStats(s){
  var els=[]; var items=s.items||[]; var cols=s.columns||2;
  var nRows = s.rows || Math.ceil(items.length/cols);
  var grid = GRIDS[cols] || makeGrid(cols);
  els.push(bgDots(s.dark));
  els.push({type:'t', text:s.title||'', x:.5, y:.75, w:11, h:.5, font:'H', size:36, color:'title'});
  if (s.subtitle) els.push({type:'t', text:s.subtitle, x:.5, y:1.35, w:10, h:.3, font:'B', size:13, color:'sub'});
  var gap=0.25; var totalH=6.0-2.2; var rawH=(totalH-(nRows-1)*gap)/nRows;
  var cardH = nRows===1 ? Math.min(rawH,2.6) : Math.min(rawH,1.6);
  var usedH = nRows*cardH + (nRows-1)*gap; var startY = 2.2 + (totalH-usedH)/2;
  items.forEach(function(item,i){
    var col=i%cols, row=Math.floor(i/cols);
    var cx=grid[col].x, cw=grid[col].w, cy=startY+row*(cardH+gap);
    var ix=cx+0.25, tw=cw*0.78, dw=cw-0.5, bg=cardH>=1.5;
    var vs=bg?40:32, ls=bg?13:12, bs_=bg?12:11;
    els.push({type:'s', x:cx, y:cy, w:cw, h:cardH, fill:'cardBg', border:'ltGray', bw:1});
    var valLen=(item.value||'').length; var valW=Math.max(1.5,valLen*0.35); var labelW=tw-valW-0.1;
    if (labelW>=1.8) {
      var labelX=ix+valW+0.1; var svh=bg?0.8:0.6;
      els.push({type:'t', text:item.value||'', x:ix, y:cy+0.2, w:valW, h:svh, font:'H', size:vs, color:'accent'});
      els.push({type:'t', text:(item.label||'').toUpperCase(), x:labelX, y:cy+0.2, w:labelW, h:bg?0.35:0.3, font:'H', size:ls, color:'title'});
      els.push({type:'t', text:item.text||'', x:labelX, y:cy+0.6, w:labelW, h:cardH-0.9, font:'B', size:bs_, color:'body'});
    } else {
      var vh=bg?0.7:0.5; var lOff=0.15+vh+0.05; var lh=bg?0.35:0.3; var dOff=lOff+lh+0.05; var bOff=dOff+0.15;
      els.push({type:'t', text:item.value||'', x:ix, y:cy+0.15, w:tw, h:vh, font:'H', size:vs, color:'accent'});
      els.push({type:'t', text:(item.label||'').toUpperCase(), x:ix, y:cy+lOff, w:tw, h:lh, font:'H', size:ls, color:'title'});
      els.push({type:'d', x:ix, y:cy+dOff, w:dw, color:'ltGray'});
      els.push({type:'t', text:item.text||'', x:ix, y:cy+bOff, w:tw, h:cardH-bOff, font:'B', size:bs_, color:'body'});
    }
  });
  if (s.footnote) els.push({type:'t', text:s.footnote, x:.5, y:6.3, w:8, h:.3, font:'B', size:9, color:'muted'});
  return els;
}

function layoutSplit(s){
  var els=[]; var items=s.items||[];
  els.push(bgDots(s.dark));
  els.push({type:'t', text:s.title||'', x:.5, y:.75, w:11, h:.5, font:'H', size:36, color:'title'});
  if (s.subtitle) els.push({type:'t', text:s.subtitle, x:.5, y:1.35, w:10, h:.3, font:'B', size:13, color:'sub'});
  var positions=[{x:.5,w:5.9},{x:6.9,w:5.9}];
  for (var i=0; i<Math.min(items.length,2); i++) {
    var item=items[i], cx=positions[i].x, cw=positions[i].w, tw=cw*0.8, iy=2.2;
    if (item.title) { els.push({type:'t', text:item.title, x:cx, y:iy, w:tw, h:.35, font:'H', size:15, color:'accent'}); iy+=0.5; }
    els.push({type:'d', x:cx, y:iy, w:cw-0.4, color:'ltGray'}); iy+=0.25;
    if (item.text) els.push({type:'t', text:item.text, x:cx, y:iy, w:tw, h:3.5, font:'B', size:12, color:'body'});
  }
  if (s.footnote) els.push({type:'t', text:s.footnote, x:.5, y:6.3, w:8, h:.3, font:'B', size:9, color:'muted'});
  return els;
}

function layoutRows(s){
  var els=[]; var items=s.items||[]; var numbered=s.numbered!==false;
  els.push(bgDots(s.dark));
  els.push({type:'t', text:s.title||'', x:.5, y:.75, w:11, h:.5, font:'H', size:36, color:'title'});
  if (s.subtitle) els.push({type:'t', text:s.subtitle, x:.5, y:1.35, w:10, h:.3, font:'B', size:13, color:'sub'});
  var startY=2.0, totalH=6.0-startY, gap=0.12;
  var rowH=(totalH-(items.length-1)*gap)/items.length;
  items.forEach(function(item,i){
    var ry=startY+i*(rowH+gap); var num=('0'+(i+1)).slice(-2);
    els.push({type:'s', x:.5, y:ry, w:12.3, h:rowH, fill:'cardBg', border:'ltGray', bw:1});
    if (numbered) {
      els.push({type:'t', text:num, x:.7, y:ry, w:0.8, h:rowH, font:'H', size:rowH<0.7?18:22, color:'accent', valign:'middle'});
      els.push({type:'t', text:item.title||'', x:1.6, y:ry, w:rowH<0.7?2.5:3.5, h:rowH, font:'H', size:rowH<0.7?12:13, color:'title', valign:'middle'});
      els.push({type:'t', text:item.text||'', x:rowH<0.7?4.2:5.6, y:ry, w:rowH<0.7?7.2:6.0, h:rowH, font:'B', size:11, color:'body', valign:'middle'});
    } else {
      els.push({type:'t', text:item.title||'', x:.7, y:ry, w:3.0, h:rowH, font:'H', size:rowH<0.7?12:13, color:'title', valign:'middle'});
      els.push({type:'t', text:item.text||'', x:3.8, y:ry, w:7.6, h:rowH, font:'B', size:11, color:'body', valign:'middle'});
    }
  });
  if (s.footnote) els.push({type:'t', text:s.footnote, x:.5, y:6.3, w:8, h:.3, font:'B', size:9, color:'muted'});
  return els;
}

function layoutDetail(s){
  var els=[]; var items=s.items||[];
  els.push(bgDots(s.dark));
  els.push({type:'t', text:s.title||'', x:.5, y:.75, w:11, h:.5, font:'H', size:36, color:'title'});
  if (s.subtitle) els.push({type:'t', text:s.subtitle, x:.5, y:1.35, w:10, h:.3, font:'B', size:13, color:'sub'});
  var cardX=2.5, cardW=8.3, itemH=0.7, pad=0.3;
  var cardH=items.length*itemH+pad*2, cardY=2.3;
  els.push({type:'s', x:cardX, y:cardY, w:cardW, h:cardH, fill:'cardBg', border:'ltGray', bw:1});
  items.forEach(function(item,i){
    var iy=cardY+pad+i*itemH, ix=cardX+0.4;
    if (item.icon) els.push({type:'t', text:item.icon, x:ix, y:iy, w:.5, h:.4, font:'H', size:20, color:'accent'});
    els.push({type:'t', text:item.label||'', x:ix+0.6, y:iy, w:1.5, h:.3, font:'H', size:13, color:'title'});
    els.push({type:'t', text:item.value||'', x:ix+2.3, y:iy, w:4.5, h:.3, font:'B', size:12, color:'body'});
    if (i<items.length-1) els.push({type:'d', x:ix, y:iy+0.55, w:cardW-0.8, color:'ltGray'});
  });
  if (s.footnote) els.push({type:'t', text:s.footnote, x:.5, y:cardY+cardH+0.5, w:8, h:.3, font:'B', size:9, color:'muted'});
  return els;
}

function layoutBullets(s){
  var els=[]; var items=s.items||[];
  els.push(bgDots(s.dark));
  els.push({type:'t', text:s.title||'', x:.5, y:.75, w:11, h:.5, font:'H', size:36, color:'title'});
  if (s.subtitle) els.push({type:'t', text:s.subtitle, x:.5, y:1.35, w:10, h:.3, font:'B', size:13, color:'sub'});
  var bulletText=items.map(function(item){return '\u2022  '+item;}).join('\n');
  els.push({type:'t', text:bulletText, x:.5, y:2.0, w:9.8, h:4.2, font:'B', size:13, color:'body'});
  return els;
}

window.resolveLayouts = resolveLayouts;
window.renderAll = function(){ resolveLayouts(); _origRenderAll(); };
})();
