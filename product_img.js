/* ---------- 動態載入 PhotoSwipe (JS + CSS) ---------- */
(function loadPhotoSwipe(cb) {
  // 已經載過就直接 callback
  if (window.PhotoSwipeLightbox) return cb();

  /* 1. 先塞入 CSS（有版面才不會跑掉） */
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.css';
  document.head.appendChild(link);

  /* 2. 再塞入 PhotoSwipe Lightbox 包裝 (JS)  */
  var script = document.createElement('script');
  script.src =
    'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe-lightbox.umd.js';
  script.onload = cb;                // 載完才執行你的程式
  document.head.appendChild(script);
})(function () {
/* ====== 以下才是真正 product_img.js 的主程式 ====== */

$(function () {
  /* === 這裡放之前的 initLightbox() 邏輯 === */
  if (!location.href.includes('ProductDetail')) return;

  /* 1. 收集圖片 ------------------------------------------------ */
  const bigImgs = [];
  $('#projectCarousel .carousel-inner img').each(function () {
    const src = this.src;
    if (src && !bigImgs.find(i => i.src === src)) {
      bigImgs.push({ src, w: 1200, h: 1200 }); // 不知道尺寸就給個大概值
    }
  });
  if (!bigImgs.length) return;

  /* 2. 建立版面 ------------------------------------------------ */
  $('#projectCarousel').replaceWith(`
    <div id="psArea" style="position:relative;text-align:center;">
      <button id="prev" class="pswp__button pswp__button--arrow">‹</button>
      <img id="mainImg" src="${bigImgs[0].src}"
           style="max-width:500px;border-radius:8px;cursor:zoom-in">
      <button id="next" class="pswp__button pswp__button--arrow pswp__button--arrow--next">›</button>
      <div id="thumbBar"
           style="display:flex;gap:10px;justify-content:center;margin-top:8px"></div>
    </div>`);

  bigImgs.forEach((item, i) =>
    $('#thumbBar').append(
      `<img class="thumbItem${!i ? ' ps-active' : ''}"
             src="${item.src}" data-idx="${i}"
             style="width:70px;height:70px;object-fit:cover;border:2px solid ${
               !i ? '#f60' : 'transparent'
             }">`
    )
  );

  /* 3. PhotoSwipe Lightbox ------------------------------------ */
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#psArea',
    children: 'img',
    /* 告訴 Lightbox：核心檔(js) 從哪裡抓 */
    pswpModule: () =>
      import(
        'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe-lightbox.umd.js'
      ),
    dataSource: bigImgs,
  });
  lightbox.init();

  /* 4. 主圖 / 縮圖 / 左右鍵 同步 ------------------------------- */
  let idx = 0;
  const switchTo = (i) => {
    idx = i;
    $('#mainImg').attr('src', bigImgs[i].src);
    $('.thumbItem')
      .removeClass('ps-active')
      .css('border', '2px solid transparent')
      .eq(i)
      .addClass('ps-active')
      .css('border', '2px solid #f60');
  };

  $('#thumbBar').on('click', '.thumbItem', function () {
    switchTo(+$(this).data('idx'));
  });
  $('#prev').on('click', () =>
    switchTo((idx - 1 + bigImgs.length) % bigImgs.length)
  );
  $('#next').on('click', () => switchTo((idx + 1) % bigImgs.length));
  $('#mainImg').on('click', () => lightbox.loadAndOpen(idx));

  lightbox.on('change', (e) => switchTo(e.currIndex));
});
/* ====== 以上主程式 ====== */
});
