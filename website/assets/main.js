/* ==========================================================================
   김진우 포트폴리오 — 공통 스크립트
   1) scroll spy (홈 앵커)
   2) 이미지 라이트박스
   3) 이미지 미배치 시 자리 표시 (파일을 넣으면 자동으로 사라짐)
   ========================================================================== */

(function () {
  'use strict';

  /* --- 0. 이메일 조립 ------------------------------------------------------ */
  // 소스에 평문 주소를 남기지 않는다(SITE-SPEC §4.1). 사용자/사용자 이름과 도메인을
  // 따로 두고 여기서 합친다. JS가 없으면 <noscript>의 "[at]" 표기가 그대로 보인다.

  Array.prototype.forEach.call(document.querySelectorAll('[data-mail]'), function (el) {
    var addr = el.getAttribute('data-u') + String.fromCharCode(64) + el.getAttribute('data-d');
    var a = document.createElement('a');
    a.href = 'mailto:' + addr;
    a.textContent = addr;
    el.textContent = '';
    el.appendChild(a);
  });

  /* --- 1. scroll spy ------------------------------------------------------ */
  // 홈에서만 동작. 프로젝트 페이지는 nav의 is-active가 HTML에 고정돼 있다.
  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('[data-spy] a[href^="#"]')
  );

  if (spyLinks.length && 'IntersectionObserver' in window) {
    var targets = spyLinks
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    var visible = new Map();

    var setActive = function (id) {
      spyLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
      });
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
        else visible.delete(e.target.id);
      });
      if (!visible.size) return;
      // 화면에 걸린 것 중 가장 위에 있는 섹션을 현재 위치로 본다.
      var top = null, min = Infinity;
      visible.forEach(function (v, id) { if (v < min) { min = v; top = id; } });
      if (top) setActive(top);
    }, { rootMargin: '-60px 0px -55% 0px', threshold: 0 });

    targets.forEach(function (t) { io.observe(t); });
  }

  /* --- 2. 라이트박스 ------------------------------------------------------- */

  var box = document.querySelector('.lightbox');

  if (box) {
    var boxImg = box.querySelector('img');
    var lastFocus = null;

    var open = function (src, alt) {
      lastFocus = document.activeElement;
      boxImg.src = src;
      boxImg.alt = alt || '';
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      box.querySelector('.lightbox-close').focus();
    };

    var close = function () {
      box.classList.remove('is-open');
      boxImg.removeAttribute('src');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    document.addEventListener('click', function (e) {
      var img = e.target.closest('figure:not(.is-missing) img');
      if (img) { open(img.currentSrc || img.src, img.alt); return; }
      if (e.target.closest('.lightbox')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) close();
    });
  }

  /* --- 3. 이미지 자리 표시 ------------------------------------------------- */
  // 아직 파일이 없는 이미지는 경로와 설명이 적힌 점선 박스로 대체한다.
  // assets/img/에 파일을 넣으면 이 코드는 아무 일도 하지 않는다.

  var mark = function (img) {
    var fig = img.closest('figure, .profile-photo');
    if (!fig || fig.classList.contains('is-missing')) return;
    fig.classList.add('is-missing');

    // 프로필 사진은 캡션 없이 경로만
    if (fig.classList.contains('profile-photo')) {
      var l = document.createElement('span');
      l.className = 'ph-label';
      l.textContent = 'PHOTO';
      var p = document.createElement('span');
      p.className = 'ph-path';
      p.textContent = img.getAttribute('src') || '';
      fig.appendChild(l);
      fig.appendChild(p);
      return;
    }

    var ph = document.createElement('div');
    ph.className = 'ph';

    var label = document.createElement('span');
    label.className = 'ph-label';
    label.textContent = 'IMAGE PENDING';

    var path = document.createElement('span');
    path.className = 'ph-path';
    path.textContent = img.getAttribute('src') || '';

    var alt = document.createElement('span');
    alt.className = 'ph-alt';
    alt.textContent = img.getAttribute('alt') || '';

    ph.appendChild(label);
    ph.appendChild(path);
    if (alt.textContent) ph.appendChild(alt);
    img.insertAdjacentElement('afterend', ph);
  };

  Array.prototype.forEach.call(document.images, function (img) {
    if (!img.closest('figure, .profile-photo')) return;
    if (img.complete) { if (!img.naturalWidth) mark(img); }
    else img.addEventListener('error', function () { mark(img); });
  });
})();
