// ═══ WPP DECK ENGINE PATCH v1.1 ═══
// Fixes TWO bugs in the existing wpp-deck.js engine:
//
// 1. LOGO NEVER RENDERED — the canvas-based rl(VP.w, ...) rendering of the
//    massive embedded SVG path was silently failing (try/catch returning null).
//    We now override L.wW and L.bW with pre-rendered PNGs from wpp-assets.js
//    which are higher quality anyway.
//
// 2. NO BG-ELEMENT SUPPORT — new v2 layouts emit {type:'bg', ref:'ASSET_KEY'}
//    elements for dot-pattern textures and hero imagery. The base engine didn't
//    know about these. We patch renderSlideHTML and the ms() slide builder
//    so backgrounds render in both preview and downloaded PPTX.
//
// Apply by loading AFTER wpp-deck.js in the artifact template.
//
// CDN loading order:
//   <script src="wpp-assets.js"></script>
//   <script src="pptxgen.bundle.js"></script>
//   <script src="wpp-deck.js"></script>
//   <script src="wpp-deck-patch-bg.js"></script>   ← THIS FILE
//   <script src="icons.js"></script>
//   <script src="wpp-deck-layouts-v2.js"></script>
//   <script src="wpp-deck-shell.js"></script>

(function(){
'use strict';

if (!window.WPP_ASSETS) {
  console.error('[WPP patch] WPP_ASSETS missing — wpp-assets.js must load before this patch');
  return;
}

// ── FIX 1: Logo never rendered ──────────────────────────────────
// The original engine does: var L = {wW: rl(VP.w,150,52,'#FFFFFF'), bW: rl(VP.w,150,52,'#000050'), ...}
// rl() attempts canvas-based SVG path rendering which silently returns null on failure.
// Override the L global with pre-rendered, correctly-colored PNG wordmarks from wpp-assets.js
if (typeof window.L === 'object' && window.L !== null) {
  window.L.wW = window.WPP_ASSETS.WM_WHITE;
  window.L.bW = window.WPP_ASSETS.WM_NAVY;
  console.log('[WPP patch] logo override applied: L.wW and L.bW now use pre-rendered PNGs');
} else {
  console.error('[WPP patch] window.L not found — wpp-deck.js must load before this patch');
}

// ── FIX 2: Background-element support (for v2 layouts) ──────────
// New v2 layouts emit {type:'bg', ref:'ASSET_KEY'} elements. Teach the engine
// to render them as full-bleed backgrounds in both HTML preview and PPTX.

var _origRenderSlideHTML = window.renderSlideHTML;
if (typeof _origRenderSlideHTML === 'function') {
  window.renderSlideHTML = function(s) {
    var bgHtml = '';
    (s.els || []).forEach(function(el){
      if (el.type === 'bg') {
        var src = window.WPP_ASSETS[el.ref];
        if (src) {
          var opacity = el.opacity != null ? el.opacity : 1;
          bgHtml += '<img src="' + src + '" style="position:absolute;left:0;top:0;width:1066px;height:600px;object-fit:cover;opacity:' + opacity + ';pointer-events:none;z-index:0;">';
        }
      }
    });
    var originalEls = s.els;
    s.els = (s.els || []).filter(function(el){ return el.type !== 'bg'; });
    var rest = _origRenderSlideHTML(s);
    s.els = originalEls;
    return bgHtml + rest;
  };
} else {
  console.error('[WPP patch] renderSlideHTML not found — patch cannot install HTML preview hook');
}

// PPTX side — hook ms() so that when a slide has a bg element, we attach it
// to the slide BEFORE other content is added. Then strip bg from s.els so the
// main bs() loop ignores it.
var _origMs = window.ms;
var _origBs = window.bs;

if (typeof _origMs === 'function' && typeof _origBs === 'function') {
  function extractBg(s) {
    if (!s.els || !s.els.length) return;
    var bgEl = null;
    for (var i = 0; i < s.els.length; i++) {
      if (s.els[i].type === 'bg') { bgEl = s.els[i]; break; }
    }
    if (bgEl) {
      var src = window.WPP_ASSETS[bgEl.ref];
      if (src) s._bgData = src;
      s.els = s.els.filter(function(el){ return el.type !== 'bg'; });
    }
  }

  window.bs = async function(pptx, s, slideIdx) {
    extractBg(s);
    return await _origBs(pptx, s, slideIdx);
  };

  window.ms = function(pptx, s) {
    var sl = _origMs(pptx, s);
    if (s._bgData) {
      var applied = false;
      try {
        sl.background = { data: s._bgData };
        applied = true;
      } catch (e) { /* fall through */ }
      if (!applied) {
        try {
          sl.addImage({ data: s._bgData, x: 0, y: 0, w: 13.33, h: 7.5 });
        } catch (e) {
          console.error('[WPP patch] background image failed:', e);
        }
      }
    }
    return sl;
  };
} else {
  console.error('[WPP patch] ms/bs not found — patch cannot install PPTX hooks');
}

console.log('[WPP patch] v1.1 loaded (logo fix + bg-element support)');
})();
