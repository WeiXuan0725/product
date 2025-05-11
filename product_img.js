/* --- product_img.js  v1.0.7  --------------------------------- */
(function (init) {

  /** 動態載入外部 JS，載完才呼叫 cb */
  function loadJs(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = cb;
    document.head.appendChild(s);
  }

  /* ① 先載 PhotoSwipe core，再載 lightbox ------------------------------------------------ */
  loadJs('https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.umd.min.js', function () {
    loadJs('https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe-lightbox.umd.min.js', function () {
      requestAnimationFrame(function () {
        if (window.PhotoSwipe && window.PhotoSwipeLightbox) {
          init();                       // ← 真正開始執行
        } else {
          console.warn('PhotoSwipe not ready - 檢查 CDN 是否 200');
        }
      });
    });
  });

})(function () {

  /* 只在產品頁啟動 */
  if (!location.href.includes('ProductDetail')) return;

  /* 1. 取得所有輪播圖片 ------------------------------------------------ */
  var imgSet = [];
  $('#projectCarousel .carousel-inner img').each(function () {
    var src = this.src;
    if (src && imgSet.indexOf(src) === -1) imgSet.push(src);
  });
  if (!imgSet.length) return;

  /* 2. 動態產生主圖 / 縮圖列 / 左右鍵 ---------------------------------- */
  $('#projectCarousel').replaceWith(`
    <div id="psArea" style="position:relative;text-align:center;">
      <button id="prev" class="psBtn">‹</button>
      <img id="mainImg" src="${imgSet[0]}" style="max-width:500px;cursor:zoom-in">
      <button id="next" class="psBtn psNext">›</button>
      <div id="thumbBar" style="display:flex;gap:8px;justify-content:center;margin-top:6px"></div>
    </div>`);

  /* 縮圖列 */
  imgSet.forEach(function (src, i) {
    $('#thumbBar').append(
      `<img class="thumb ${!i ? 'on' : ''}" data-i="${i}" src="${src}"
            style="width:68px;height:68px;object-fit:cover;border:2px solid ${!i ? '#f60' : 'transparent'}">`
    );
  });

  /* 3. 啟動 PhotoSwipe Lightbox --------------------------------------- */
  var lightbox = new PhotoSwipeLightbox({
    gallery: '#psArea',
    children: 'img',
    pswpModule: PhotoSwipe
  });
  lightbox.init();

  /* 4. 切換邏輯 -------------------------------------------------------- */
  var idx = 0;
  function show(i) {
    idx = i;
    $('#mainImg').attr('src', imgSet[i]);
    $('.thumb').removeClass('on').css('border', '2px solid transparent')
               .eq(i).addClass('on').css('border', '2px solid #f60');
  }

  $('#thumbBar').on('click', '.thumb', function (e) {
    show(+e.target.dataset.i);
  });
  $('#prev').on('click', function () {
    show((idx - 1 + imgSet.length) % imgSet.length);
  });
  $('#next').on('click', function () {
    show((idx + 1) % imgSet.length);
  });
  $('#mainImg').on('click', function () {
    lightbox.loadAndOpen(idx);
  });
  lightbox.on('change', function (e) {
    show(e.currIndex);
  });

  /* 5. 小型樣式 -------------------------------------------------------- */
  var css = document.createElement('style');
  css.textContent = `
    .psBtn{
      position:absolute;top:50%;transform:translateY(-50%);
      width:40px;height:40px;border-radius:50%;border:none;
      background:#0008;color:#fff;font:26px/40px arial;cursor:pointer}
    .psNext{right:6px}.psBtn:not(.psNext){left:6px}
    .psBtn:hover{background:#000c}`;
  document.head.appendChild(css);

});
