/* ------------------------------------------------
   dynamic-photoswipe loader  v1.0.4               */
(function loadPhotoSwipe(cb) {

  // 已載過就直接回呼
  if (window.PhotoSwipe && window.PhotoSwipeLightbox) return cb();

  /* 1) 載核心 (pswp) --------------------------- */
  var core   = document.createElement('script');
  core.src   = 'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/umd/photoswipe.umd.min.js';
  core.onload = function () {

      /* 2) 核心 OK → 載 Lightbox --------------- */
      var lb   = document.createElement('script');
      lb.src   = 'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/umd/photoswipe-lightbox.umd.min.js';
      lb.onload = cb;
      document.head.appendChild(lb);
  };
  document.head.appendChild(core);

})(initProductLightbox);


/* ====== 下面才是主程式 ======================== */
function initProductLightbox() {

  /* --- 收集圖片 -------------------------------- */
  if (!location.href.includes('ProductDetail')) return;

  var big = [];
  document.querySelectorAll('#projectCarousel .carousel-inner img')
          .forEach(function (img) {
              var src = img.getAttribute('src');
              if (src && !big.some(function (o) { return o.src === src; })) {
                  big.push({ src: src, w: 1200, h: 900 });
              }
          });
  if (!big.length) return;


  /* --- 產生 DOM（主圖 + 縮圖 + 左右鍵） -------- */
  var html =
    '<div id="psArea" style="text-align:center;position:relative">' +
      '<button id="prev" class="psArrow">‹</button>' +
      '<img id="mainImg" src="'+ big[0].src +'" style="max-width:500px;cursor:zoom-in">' +
      '<button id="next" class="psArrow">›</button>' +
      '<div id="thumbs" style="display:flex;gap:8px;justify-content:center;margin-top:6px"></div>' +
    '</div>';
  document.getElementById('projectCarousel').outerHTML = html;

  big.forEach(function (o,i) {
      thumbs.insertAdjacentHTML('beforeend',
        '<img class="t'+(i?'':' act')+'" data-i="'+i+'" src="'+o.src+
        '" style="width:70px;height:70px;object-fit:cover;border:2px solid transparent">');
  });

  /* --- PhotoSwipe Lightbox -------------------- */
  var lightbox = new PhotoSwipeLightbox({
      gallery:   '#psArea',
      children:  'img',
      pswpModule: PhotoSwipe,            // 核心物件在 global → 直接指定
      dataSource: big
  });
  lightbox.init();

  /* --- 本地同步縮圖 / 左右鍵 -------------------- */
  var idx = 0;
  function switchTo(i){
      idx=i;
      mainImg.src = big[i].src;
      document.querySelectorAll('#thumbs img').forEach(function(t){ t.classList.remove('act'); });
      document.querySelector('#thumbs img[data-i="'+i+'"]').classList.add('act');
  }
  thumbs.onclick = function(e){ if(e.target.dataset.i) switchTo(+e.target.dataset.i); };
  prev.onclick   = function(){ switchTo( (idx-1+big.length)%big.length ); };
  next.onclick   = function(){ switchTo( (idx+1)%big.length ); };
  mainImg.onclick= function(){ lightbox.loadAndOpen(idx); };

  lightbox.on('change', function(){ switchTo(this.currIndex); });
}

/* --- 小樣式 ----------------------------------- */
var css = document.createElement('style');
css.textContent = '.psArrow{position:absolute;top:50%;transform:translateY(-50%);background:#0008;color:#fff;border:0;border-radius:50%;width:38px;height:38px;cursor:pointer;font-size:24px}#prev{left:10px}#next{right:10px}.act{border-color:#f60}';
document.head.appendChild(css);
