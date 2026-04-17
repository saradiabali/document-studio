// ═══ WPP DECK ENGINE v1.1 → v1.2 PATCH ═══
// Adds support for the 'bg' element type — full-bleed decorative backgrounds
// used by the new WPP-signature layouts (title-wpp, section-wpp, quote-wpp,
// hero-wpp) and the auto-injected dot-pattern texture on content slides.
//
// Apply by:
//   1. Append this file (or inline its contents) AFTER wpp-deck.js loads
//   2. It monkey-patches renderSlideHTML and the PPTX slide builder to
//      recognize {type:'bg', ref:'ASSET_KEY'} elements
//
// CDN loading order:
//   <script src="wpp-assets.js"></script>
//   <script src="pptxgen.bundle.js"></script>
//   <script src="wpp-deck.js"></script>
//   <script src="wpp-deck-patch-bg.js"></script>   ← this file
//   <script src="icons.js"></script>
//   <script src="wpp-deck-layouts-v2.js"></script>
//   <script src="wpp-deck-shell.js"></script>

(function(){
'use strict';
if (!window.WPP_ASSETS) { console.error('[WPP patch] WPP_ASSETS missing'); return; }

// ── HTML PREVIEW PATCH ──────────────────────────────────────────
// The original renderSlideHTML builds an HTML string. We wrap it to
// detect 'bg' elements and emit a full-bleed absolutely-positioned
// <img> BEFORE other content, so it sits at the back z-index.
var _origRenderSlideHTML = window.renderSlideHTML;
window.renderSlideHTML = function(s) {
  var bgHtml = '';
  // Find any bg elements and render them as full-bleed images
  (s.els || []).forEach(function(el){
    if (el.type === 'bg') {
      var src = window.WPP_ASSETS[el.ref];
      if (src) {
        var opacity = el.opacity != null ? el.opacity : 1;
        bgHtml += '<img src="' + src + '" style="position:absolute;left:0;top:0;width:1066px;height:600px;object-fit:cover;opacity:' + opacity + ';pointer-events:none;z-index:0;">';
      }
    }
  });
  // Filter bg out of the regular render loop (so it doesn't try to draw text etc)
  var originalEls = s.els;
  s.els = (s.els || []).filter(function(el){ return el.type !== 'bg'; });
  var rest = _origRenderSlideHTML(s);
  s.els = originalEls;
  // Wrap rest to ensure it renders above the bg layer
  // (z-index:1 on a wrapper div; but simpler: just prepend bgHtml — the
  // later-declared absolutely-positioned elements naturally sit on top)
  return bgHtml + rest;
};

// ── PPTX COMPILATION PATCH ──────────────────────────────────────
// Monkey-patch bs() to handle 'bg' as a full-bleed addImage before
// any other elements. Since bs() is defined as a top-level function,
// we wrap it.
var _origBs = window.bs;
window.bs = async function(pptx, s, slideIdx) {
  // Pre-process: extract bg elements and add them to the slide first
  if (s.els && s.els.length) {
    // We need a reference to the slide object; easiest is to build our
    // own mini-pipeline: create the slide via ms(), add backgrounds, then
    // let bs() handle the rest WITHOUT calling ms() again.
    // But bs() calls ms() internally — so instead we inject bg handling
    // by intercepting. Cleaner approach: add bg elements to a temporary
    // field, let bs() run, then post-add. But PptxGenJS requires bg be
    // added to slide, not pptx-level.
    //
    // Simplest safe approach: filter bg out before calling _origBs,
    // then manually add them to the slide after. Since _origBs creates
    // the slide internally via ms(), we need a different pattern.
    //
    // Solution: re-implement the slide-creation header inline here,
    // then delegate el-rendering to a helper.
  }
  // Since we can't easily get a handle to the internal slide object,
  // we take a different path: add bg as a slide background via
  // pptxgenjs's native background image support, which we inject
  // by appending to s a background override BEFORE calling the original.
  var bgEl = null;
  if (s.els) {
    for (var i = 0; i < s.els.length; i++) {
      if (s.els[i].type === 'bg') { bgEl = s.els[i]; break; }
    }
  }
  if (bgEl) {
    var src = window.WPP_ASSETS[bgEl.ref];
    if (src) {
      // Use pptxgenjs background:{data:...} — set on slide via _bgOverride
      // But ms() creates the slide. We need to hook it.
      s._bgData = src;
      // Remove bg from els so the original bs loop doesn't try to render it
      s.els = s.els.filter(function(el){ return el.type !== 'bg'; });
    }
  }
  // Call the original bs
  return await _origBs(pptx, s, slideIdx);
};

// Patch ms() to apply the background data when _bgData is set
var _origMs = window.ms;
window.ms = function(pptx, s) {
  var sl = _origMs(pptx, s);
  if (s._bgData) {
    // PptxGenJS exposes slide.background — set it to a data URI
    try {
      sl.background = { data: s._bgData };
    } catch(e) {
      // Fallback: add as first image element covering full slide
      try {
        sl.addImage({ data: s._bgData, x: 0, y: 0, w: 13.33, h: 7.5 });
      } catch(e2) {}
    }
  }
  return sl;
};

console.log('[WPP patch] bg-element support loaded');
})();
