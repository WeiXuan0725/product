function initProductLightbox(){
  if (!location.href.includes('ProductDetail')) return;

  // 1. 收集圖片
  var imgs = [];
  $('#projectCarousel .carousel-inner img').each(function(){
    var u = this.src;
    if (u && imgs.indexOf(u)===-1) imgs.push(u);
  });
  if (!imgs.length) return;

  // 2. 產生 DOM
  $('#projectCarousel').replaceWith(
    '<div id="psArea" style="position:relative;text-align:center;">'+
      '<button id="prev" class="psBtn">‹</button>'+
      '<img id="mainImg" src="'+imgs[0]+'" style="max-width:500px;cursor:zoom-in">'+
      '<button id="next" class="psBtn psNext">›</button>'+
      '<div id="thumbBar" style="display:flex;gap:8px;justify-content:center;margin-top:6px"></div>'+
    '</div>'
  );
  imgs.forEach(function(src,i){
    $('#thumbBar').append(
      '<img class="thumb'+(i===0?' on':'')+'" data-i="'+i+
      '" src="'+src+'" '+
      'style="width:68px;height:68px;object-fit:cover;border:2px solid '+(i===0?'#f60':'transparent')+'">'
    );
  });

  // 3. 啟動 Lightbox
  var lb = new PhotoSwipeLightbox({
    gallery:   '#psArea',
    children:  'img',
    pswpModule: window.PhotoSwipe
  });
  lb.init();

  // 4. 互動行為
  var idx = 0;
  function show(i){
    idx = i;
    $('#mainImg').attr('src', imgs[i]);
    $('.thumb')
      .removeClass('on')
      .css('border','2px solid transparent')
      .eq(i).addClass('on').css('border','2px solid #f60');
  }
  $('#thumbBar').on('click','.thumb', function(){
    show(+this.dataset.i);
  });
  $('#prev').on('click', function(){
    show((idx-1+imgs.length)%imgs.length);
  });
  $('#next').on('click', function(){
    show((idx+1)%imgs.length);
  });
  $('#mainImg').on('click', function(){
    lb.loadAndOpen(idx);
  });
  lb.on('change', function(e){
    show(e.currIndex);
  });

  // 5. 小按鈕樣式
  var style=document.createElement('style');
  style.textContent = '\
    .psBtn{position:absolute;top:50%;transform:translateY(-50%);\
      width:40px;height:40px;border-radius:50%;border:none;\
      background:#0008;color:#fff;font:26px/40px arial;cursor:pointer}\
    .psNext{right:6px}.psBtn:not(.psNext){left:6px}\
    .psBtn:hover{background:#000c}\
  ';
  document.head.appendChild(style);
}
