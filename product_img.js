/* ---------- 1. 動態載入 PhotoSwipe（JS + CSS） ----------- */
(function loadPhotoSwipe(cb) {
  if (window.PhotoSwipeLightbox) return cb();     // 已載過
  /* 1. 先塞入 CSS（有版面才不會跑掉） */
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.css';
  document.head.appendChild(link);

  // ② PhotoSwipe 主程式
  const ps = document.createElement('script');
  ps.src = 'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/umd/photoswipe.umd.min.js';
  document.head.appendChild(ps);

  // ③ Lightbox 殼
  const lb = document.createElement('script');
  lb.src = 'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/umd/photoswipe-lightbox.umd.min.js';
  lb.onload = cb;                     // 兩支 JS 都載好才會 callback
  document.head.appendChild(lb);
})(initProductLightbox);

/* ===== 以下才是產品頁主程式 ===== */
function initProductLightbox () {
  if (!location.href.includes('ProductDetail')) return;

  /* === 收集圖片 ================================ */
  var bigImgs   = [];
  $('#projectCarousel .carousel-inner img').each(function () {
    var src = this.src;
    if (src && bigImgs.indexOf(src) === -1) {
      bigImgs.push({src: src, w: this.naturalWidth||1200, h: this.naturalHeight||1200});
    }
  });
  if (!bigImgs.length) return;

  /* === 建立 DOM =============================== */
  $('#projectCarousel').replaceWith(`
    <div id="psArea" style="position:relative;text-align:center;">
      <img id="mainImg" src="${bigImgs[0].src}" style="max-width:500px;border-radius:8px;cursor:zoom-in">
      <div id="thumbBar" style="display:flex;gap:10px;justify-content:center;margin-top:8px"></div>
    </div>`);

  bigImgs.forEach((item,i)=>{
    $('#thumbBar').append(
      `<img class="thumbItem${!i?' active':''}" data-idx="${i}" src="${item.src}"
            style="width:70px;height:70px;object-fit:cover;border:2px solid transparent">`);
  });

  /* === Lightbox =============================== */
  var lightbox = new PhotoSwipeLightbox({
      gallery: '#psArea',
      children: 'img',
      pswpModule: PhotoSwipeLightbox.loadAndOpen,
      dataSource: bigImgs
  });
  lightbox.init();

  var idx = 0;
  function switchTo(i){
    idx=i;
    $('#mainImg').attr('src', bigImgs[i].src);
    $('.thumbItem').removeClass('active').eq(i).addClass('active');
  }
  $('#thumbBar').on('click','.thumbItem',function(){ switchTo(+this.dataset.idx); });
  $('#mainImg').on('click', ()=> lightbox.loadAndOpen(idx) );
  lightbox.on('change', e=> switchTo(e.currIndex) );
}

/* 把 init 函式掛到 window，給舊內嵌代碼呼叫 */
window.initProductLightbox = initProductLightbox;
