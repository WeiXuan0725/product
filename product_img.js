/* ---------- 動態載入 PhotoSwipe (JS + CSS) ------------- */
(function loadPhotoSwipe(cb){
  // 已經載過就直接回呼
  if (window.PhotoSwipeLightbox) return cb();

  // 1. CSS
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.css';
  document.head.appendChild(link);

  // 2. JS
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe-lightbox.umd.min.js';
  script.onload = cb;                    // 載完才執行你的程式
  document.head.appendChild(script);
})(function(){
  /* ====== 以下才是原本 product_img.js 的主程式 ====== */

  $(function(){

    /* === 這裡放之前寫的 initLightbox() 那些程式 === */
    /* ……（不需要再等 0.5 秒的 waitPs 了）…… */

  });

});
(function(){
/*** 你可以調整這二個 CDN（要 https） **************************/
const PS_CSS = 'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.css';
const PS_JS  = 'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe-lightbox.umd.min.js';

/*** 小工具：動態載入 ************************************************/
const H = document.head || document.getElementsByTagName('head')[0];
function loadCSS(href){ return new Promise(ok=>{
  if (document.querySelector(`link[href="${href}"]`)) return ok();
  const link=document.createElement('link');link.rel='stylesheet';link.href=href;
  link.onload=ok;H.appendChild(link);
});}
function loadJS(src){ return new Promise(ok=>{
  if (document.querySelector(`script[src="${src}"]`)) return ok();
  const s=document.createElement('script');s.src=src;s.onload=ok;H.appendChild(s);
});}
function waitJQ(cb,i=0){                    // 確保 jQuery 已載入
  if (window.jQuery) return cb();
  if (i>30) return;                         // 3 秒沒就放棄
  setTimeout(()=>waitJQ(cb,i+1),100);
}

/*** 只在商品頁執行 **************************************************/
if (location.href.indexOf('ProductDetail')===-1) return;

Promise.all([loadCSS(PS_CSS),loadJS(PS_JS)]).then(()=>{
  waitJQ(main);
});

function main(){
  const $ = jQuery;                         // 站內本來就有 jQuery

  /*** 1. 收集圖片 ***************************************************/
  const pics=[];
  $('#projectCarousel .carousel-inner img').each(function(){
     const src=this.src;
     if (src && pics.indexOf(src)===-1) pics.push(src);
  });
  if(!pics.length) return;

  /*** 2. 產生 HTML **************************************************/
  $('#projectCarousel').replaceWith(`
      <div id="psWrap" style="text-align:center;position:relative;">
         <button id="prev" class="psA">‹</button>
         <img   id="big"  src="${pics[0]}" style="max-width:500px;border-radius:8px;cursor:zoom-in">
         <button id="next" class="psA">›</button>
         <div id="bar" style="display:flex;gap:10px;justify-content:center;margin-top:8px"></div>
      </div>`);

  pics.forEach((s,i)=>$('#bar').append(
    `<img class="tmb${!i?' on':''}" data-i="${i}"
          src="${s}" style="width:70px;height:70px;object-fit:cover;border:2px solid transparent">`)
  );

  /*** 3. 裝 PhotoSwipe **********************************************/
  const ps = new PhotoSwipeLightbox({
        gallery:'#psWrap', children:'img',
        dataSource: pics.map(s=>({src:s,w:1280,h:1280}))  // 先填 1280×1280，實際會自動再去抓
  });
  ps.init();

  /*** 4. 切換邏輯 ***************************************************/
  let idx=0;
  const go=i=>{
     idx=i;
     $('#big').attr('src',pics[i]);
     $('.tmb').removeClass('on').eq(i).addClass('on');
  };
  $('#bar').on('click','.tmb',e=>go(+e.target.dataset.i));
  $('#prev').on('click',()=>go((idx-1+pics.length)%pics.length));
  $('#next').on('click',()=>go((idx+1)%pics.length));
  $('#big').on('click',()=>ps.loadAndOpen(idx));
  ps.on('change',e=>go(e.currIndex));
}

/*** 5. 造型（直接寫進 <head>） ************************************/
const style=document.createElement('style');
style.textContent=`
  .tmb.on{border:2px solid #ff6600!important}
  .tmb:hover{transform:scale(.92)}
  .psA{position:absolute;top:50%;transform:translateY(-50%);
       width:42px;height:42px;border:0;border-radius:50%;
       background:#0006;color:#fff;font:26px/42px sans-serif;cursor:pointer;z-index:30}
  #prev{left:10px}#next{right:10px}
  .psA:hover{background:#000b}`;
H.appendChild(style);
})();
