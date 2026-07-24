// 盟峰鐵工廠網站共用小工具
// 這支檔案處理：手機版點漢堡選單開合，以及其他頁面互動功能

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    // 手機版：點了選單裡的連結後，選單要自動收起來，不然會一直擋在畫面上
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  // 設備介紹彈出視窗：按 Esc 鍵也能關閉，不是只能點 X 或點背景
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      ['equip-modal', 'gallery-modal'].forEach(function (id) {
        var modal = document.getElementById(id);
        if (modal) modal.classList.remove('open');
      });
    }
  });

  // 訪客計數器：全站共用同一組計數，不分頁面
  // 原本用的 countapi.xyz 已經停止服務(2026年5月)，改用還在維護的替代版本
  var counterEl = document.getElementById('visitor-count-num');
  if (counterEl) {
    fetch('https://countapi.mileshilliard.com/api/v1/hit/moonfong-tw-website-total-visits')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        counterEl.textContent = String(data.value).padStart(6, '0');
      })
      .catch(function () {
        counterEl.textContent = '------';
      });
  }

  // 現場實景：自動跑馬燈捲動，滑鼠移過去會暫停，方便看清楚照片
  var sceneScroll = document.getElementById('scene-scroll');
  if (sceneScroll) {
    var hoverDirection = 0; // -1=往左 0=正常自動播放 1=往右
    sceneScroll.addEventListener('mousemove', function (e) {
      var rect = sceneScroll.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var pct = x / rect.width;
      if (pct < 0.25) { hoverDirection = -1; }
      else if (pct > 0.75) { hoverDirection = 1; }
      else { hoverDirection = 0; }
    });
    sceneScroll.addEventListener('mouseleave', function () { hoverDirection = 0; });
    function scrollStep() {
      if (sceneScroll) {
        var speed = hoverDirection !== 0 ? 3 : 0.6;
        sceneScroll.scrollLeft += hoverDirection !== 0 ? hoverDirection * speed : speed;
        if (sceneScroll.scrollLeft >= sceneScroll.scrollWidth - sceneScroll.clientWidth - 1) {
          sceneScroll.scrollLeft = hoverDirection === 1 ? sceneScroll.scrollLeft : 0;
        }
        if (sceneScroll.scrollLeft <= 0 && hoverDirection === -1) {
          sceneScroll.scrollLeft = 0;
        }
      }
      requestAnimationFrame(scrollStep);
    }
    requestAnimationFrame(scrollStep);
  }

  // 通用：讓任何橫向捲動區塊都能用滑鼠按住拖曳左右移動，不是只能用捲軸
  function enableDragScroll(el) {
    var isDown = false, startX, scrollLeftStart;
    el.addEventListener('mousedown', function (e) {
      isDown = true;
      el.style.cursor = 'grabbing';
      startX = e.pageX;
      scrollLeftStart = el.scrollLeft;
    });
    window.addEventListener('mouseup', function () { isDown = false; el.style.cursor = 'grab'; });
    window.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var dx = e.pageX - startX;
      el.scrollLeft = scrollLeftStart - dx;
    });
    el.style.cursor = 'grab';
  }
  document.querySelectorAll('.h-scroll').forEach(enableDragScroll);
});
