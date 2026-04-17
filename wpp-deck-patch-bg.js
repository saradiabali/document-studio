// ═══ WPP DECK ENGINE PATCH v1.2 ═══
// Fixes for the existing wpp-deck.js engine:
//
// 1. LOGO RENDERING — original canvas-based rl() silently fails. Override
//    L.wW and L.bW with pre-rendered PNGs from wpp-assets.js.
//
// 2. BG-ELEMENT SUPPORT — v2 layouts emit {type:'bg', ref:'ASSET_KEY'} for
//    full-bleed backgrounds. Patch renderSlideHTML and ms() to handle them.
//
// 3. IMG-ASSET ELEMENT — v2.1 layouts emit {type:'img-asset', ref:'WM_WHITE',
//    x, y, w, h} to place the wordmark (or other assets) at specific positions.
//    This is simpler than {type:'img'} which expects a DOM ref.
//
// 4. FOOTER TEXT COLOR — template uses a darker navy for "PRIVATE & CONFIDENTIAL"
//    on light slides. Original was too light (6464D2 light-purple). We override
//    the footer master objects.
//
// Apply by loading AFTER wpp-deck.js in the artifact template.

(function(){
'use strict';

if (!window.WPP_ASSETS) {
  console.error('[WPP patch v1.2] WPP_ASSETS missing');
  return;
}

// ── FIX 1: Logo never rendered ──────────────────────────────────
if (typeof window.L === 'object' && window.L !== null) {
  window.L.wW = window.WPP_ASSETS.WM_WHITE;
  window.L.bW = window.WPP_ASSETS.WM_NAVY;
  console.log('[WPP patch v1.2] logo override applied');
} else {
  console.error('[WPP patch v1.2] window.L not found');
}

// ── FIX 2: bg element support (HTML preview) ────────────────────
var _origRenderSlideHTML = window.renderSlideHTML;
if (typeof _origRenderSlideHTML === 'function') {
  window.renderSlideHTML = function(s) {
    var bgHtml = '';
    var imgAssetHtml = '';
    (s.els || []).forEach(function(el){
      if (el.type === 'bg') {
        var src = window.WPP_ASSETS[el.ref];
        if (src) {
          var opacity = el.opacity != null ? el.opacity : 1;
          bgHtml += '<img src="' + src + '" style="position:absolute;left:0;top:0;width:1066px;height:600px;object-fit:cover;opacity:' + opacity + ';pointer-events:none;z-index:0;">';
        }
      } else if (el.type === 'img-asset') {
        var src = window.WPP_ASSETS[el.ref];
        if (src) {
          var PPI = 80;
          imgAssetHtml += '<img src="' + src + '" style="position:absolute;left:' + Math.round(el.x*PPI) + 'px;top:' + Math.round(el.y*PPI) + 'px;width:' + Math.round(el.w*PPI) + 'px;height:' + Math.round(el.h*PPI) + 'px;object-fit:contain;z-index:2;pointer-events:none;">';
        }
      }
    });
    // Filter bg AND img-asset out so base engine doesn't see them
    var originalEls = s.els;
    s.els = (s.els || []).filter(function(el){ return el.type !== 'bg' && el.type !== 'img-asset'; });
    var rest = _origRenderSlideHTML(s);
    s.els = originalEls;
    return bgHtml + rest + imgAssetHtml;
  };
} else {
  console.error('[WPP patch v1.2] renderSlideHTML not found');
}

// ── FIX 3: bg + img-asset support (PPTX compilation) ────────────
var _origMs = window.ms;
var _origBs = window.bs;

if (typeof _origMs === 'function' && typeof _origBs === 'function') {

  function extractBgAndAssets(s) {
    if (!s.els || !s.els.length) return;
    var bgEl = null;
    var assetEls = [];
    for (var i = 0; i < s.els.length; i++) {
      if (s.els[i].type === 'bg' && !bgEl) bgEl = s.els[i];
      else if (s.els[i].type === 'img-asset') assetEls.push(s.els[i]);
    }
    if (bgEl) {
      var src = window.WPP_ASSETS[bgEl.ref];
      if (src) s._bgData = src;
    }
    if (assetEls.length) s._imgAssets = assetEls;
    // Remove bg and img-asset so base loop ignores them
    s.els = s.els.filter(function(el){ return el.type !== 'bg' && el.type !== 'img-asset'; });
  }

  window.bs = async function(pptx, s, slideIdx) {
    extractBgAndAssets(s);
    var result = await _origBs(pptx, s, slideIdx);
    // After base has added text/shapes, we'd like to add img-assets on top.
    // But _origBs doesn't return the slide object. We handle img-assets inside ms() below.
    return result;
  };

  window.ms = function(pptx, s) {
    var sl = _origMs(pptx, s);
    // Attach bg
    if (s._bgData) {
      var applied = false;
      try { sl.background = { data: s._bgData }; applied = true; } catch (e) {}
      if (!applied) {
        try { sl.addImage({ data: s._bgData, x: 0, y: 0, w: 13.33, h: 7.5 }); } catch (e) {}
      }
    }
    // Attach img-asset elements (e.g. the wordmark inside the circle)
    if (s._imgAssets && s._imgAssets.length) {
      s._imgAssets.forEach(function(el){
        var src = window.WPP_ASSETS[el.ref];
        if (src) {
          try { sl.addImage({ data: src, x: el.x, y: el.y, w: el.w, h: el.h }); } catch (e) {
            console.error('[WPP patch v1.2] img-asset failed:', e);
          }
        }
      });
    }
    return sl;
  };
} else {
  console.error('[WPP patch v1.2] ms/bs not found');
}

// ── FIX 4: Darker "PRIVATE & CONFIDENTIAL" footer color ─────────
// Override the dlP() function's master definitions by patching after it runs.
// The original uses 6464D2 (light purple) which is too faint. Use 323CAA (mid-blue)
// which reads clearly on white but isn't harsh navy.
// We achieve this by wrapping dlP — but it's large. Simpler: override at master-definition
// time is inside dlP which we don't easily intercept. Instead, we monkey-patch the footer
// string through defineSlideMaster.
//
// Simplest reliable fix: override pptx.defineSlideMaster when it's called with our
// known titles and swap the color in the text object.
var _origDefineSlideMaster = null;
function installMasterPatcher() {
  // We need to hook pptx instances. dlP creates `var pptx = new PptxGenJS();` inside.
  // Intercept at the prototype level:
  if (typeof PptxGenJS !== 'undefined' && PptxGenJS.prototype && !PptxGenJS.prototype.__wppPatched) {
    var orig = PptxGenJS.prototype.defineSlideMaster;
    PptxGenJS.prototype.defineSlideMaster = function(spec) {
      if (spec && spec.title && (spec.title === 'WPP_LIGHT' || spec.title === 'WPP_DARK') && Array.isArray(spec.objects)) {
        spec.objects.forEach(function(obj){
          if (obj && obj.text && obj.text.options && obj.text.text === 'PRIVATE & CONFIDENTIAL') {
            // Light master — darker navy text; Dark master — keep existing white-ish
            if (spec.title === 'WPP_LIGHT') obj.text.options.color = '323CAA';
            if (spec.title === 'WPP_DARK')  obj.text.options.color = 'D2BEFF';
          }
        });
      }
      return orig.call(this, spec);
    };
    PptxGenJS.prototype.__wppPatched = true;
    console.log('[WPP patch v1.2] PPTX master patcher installed');
  }
}
installMasterPatcher();

console.log('[WPP patch v1.2] loaded (logo + bg + img-asset + footer color)');
})();
