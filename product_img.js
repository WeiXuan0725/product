/* --- product_img.js  v1.0.5  ---------------------------- */
(function(init){          // ← 把主程式包起來，等 PhotoSwipe 載完再呼叫
  // 1) 先載 core  + lightbox（UMD 版）
  loadJs('https://cdn.jsdelivr.net/npm/photoswipe@5/dist/umd/photoswipe.umd.min.js', function(){
    loadJs('https://cdn.jsdelivr.net/npm/photoswipe@5/dist/umd/photoswipe-lightbox.umd.min.js', init);
  });

  // 動態載入 JS 的小工具
  function loadJs(src, cb){
    var s = document.createElement('script');
    s.src   = src;
    s.async = true;
    s.onload = cb;
    document.head.appendChild(s);
  }
})(function(){             // === 這裡才是原本的燈箱程式 ===
  if(!location.href.includes('ProductDetail')) return;

  /* 1. 收集圖片 ------------------------------------------------ */
  var imgSet=[];
  $('#projectCarousel .carousel-inner img').each(function(){
    var src=this.src;
    if(src && imgSet.indexOf(src)===-1) imgSet.push(src);
  });
  if(!imgSet.length) return;

  /* 2. 產生 DOM：主圖 + 縮圖列 + 左右鍵 ----------------------- */
  $('#projectCarousel').replaceWith(`
     <div id="psArea" style="position:relative;text-align:center;">
       <button id="prev" class="psBtn">‹</button>
       <img id="mainImg" src="${imgSet[0]}" style="max-width:500px;cursor:zoom-in">
       <button id="next" class="psBtn psNext">›</button>
       <div id="thumbBar" style="display:flex;gap:8px;justify-content:center;margin-top:6px"></div>
     </div>`);
  imgSet.forEach((src,i)=>$('#thumbBar').append(
     `<img class="thumb ${!i?'on':''}" data-i="${i}" src="${src}" style="width:68px;height:68px;object-fit:cover;border:2px solid ${!i?'#f60':'transparent'}">`
  ));

  /* 3. Lightbox ------------------------------------------------ */
  var lightbox = new PhotoSwipeLightbox({
      gallery:   '#psArea',
      children:  'img',
      pswpModule: window.PhotoSwipe          // 這裡直接傳 **物件本身**
  });
  lightbox.init();

  /* 4. 縮圖 / 左右鍵 / 同步 ----------------------------------- */
  var idx=0;
  function show(i){
    idx=i; $('#mainImg').attr('src',imgSet[i]);
    $('.thumb').removeClass('on').css('border','2px solid transparent')
               .eq(i).addClass('on').css('border','2px solid #f60');
  }
  $('#thumbBar').on('click','.thumb',e=>show(+e.target.dataset.i));
  $('#prev').on('click',()=>show((idx-1+imgSet.length)%imgSet.length));
  $('#next').on('click',()=>show((idx+1)%imgSet.length));
  $('#mainImg').on('click',()=>lightbox.loadAndOpen(idx));
  lightbox.on('change',e=>show(e.currIndex));
});
/* --- 版面用的小 CSS ------------------------------------------ */
var css = document.createElement('style');
css.textContent = `
  .psBtn{position:absolute;top:50%;transform:translateY(-50%);
         width:40px;height:40px;border-radius:50%;border:none;
         background:#0008;color:#fff;font:26px/40px "arial";cursor:pointer}
  .psNext{right:6px}.psBtn:not(.psNext){left:6px}
  .psBtn:hover{background:#000c}
`;
document.head.appendChild(css);
