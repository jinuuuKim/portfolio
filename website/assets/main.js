/* ==========================================================================
   김진우 포트폴리오 — 공통 스크립트
   0) 이메일 조립 (소스에 평문 주소를 남기지 않음)
   1) scroll spy (홈 앵커)
   2) 이미지 라이트박스
   3) 이미지 미배치 시 자리 표시 (파일을 넣으면 자동으로 사라짐)
   4) 탭 갤러리 (JS 미동작 시 세로 나열)
   5) 데모 영상 파사드 (클릭 전까지 유튜브 미요청)
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
  // 홈 상단 탭과 프로젝트 우측 목차가 함께 쓴다([data-spy]).
  //
  // IntersectionObserver 로 "보이는 것 중 가장 위"를 고르면 한 칸 밀린다.
  // 다음 섹션이 화면 아래로 들어와도 이전 섹션이 여전히 더 위에 걸쳐 있어
  // 계속 이전 것이 뽑히기 때문이다.
  // 그래서 화면 높이 32% 지점에 기준선을 두고, 그 선을 지나간 마지막 섹션을
  // 현재 위치로 본다. 판정이 한 곳에서만 이뤄져 밀릴 여지가 없다.

  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('[data-spy] a[href^="#"]')
  );

  if (spyLinks.length) {
    var pairs = spyLinks
      .map(function (a) {
        var el = document.querySelector(a.getAttribute('href'));
        return el ? { link: a, el: el } : null;
      })
      .filter(Boolean);

    if (pairs.length) {
      var TRIGGER = 0.32;
      var lastId = null;

      var setActive = function (id) {
        if (id === lastId) return;
        lastId = id;
        spyLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      };

      var updateSpy = function () {
        var line = window.innerHeight * TRIGGER;
        var current = pairs[0];

        for (var i = 0; i < pairs.length; i++) {
          if (pairs[i].el.getBoundingClientRect().top <= line) current = pairs[i];
          else break;
        }

        // 페이지 바닥에 닿으면 마지막 섹션. 짧은 마지막 섹션이 기준선까지
        // 못 올라와 영영 활성화되지 않는 경우를 막는다.
        var atBottom =
          window.innerHeight + window.pageYOffset >=
          document.documentElement.scrollHeight - 2;
        if (atBottom) current = pairs[pairs.length - 1];

        setActive(current.el.id);
      };

      var ticking = false;
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          ticking = false;
          updateSpy();
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      window.addEventListener('load', updateSpy);
      updateSpy();
    }
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

  /* --- 4. 탭 갤러리 ------------------------------------------------------- */
  // 마크업은 전부 펼쳐진 상태로 오고, 여기서 탭 UI로 승격한다.
  // 이 코드가 안 돌면 화면이 세로로 나열될 뿐 정보는 그대로 남는다.

  Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), function (box) {
    var tabs = [].slice.call(box.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    if (!tabs.length) return;

    var select = function (i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (panels[n]) panels[n].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, next = null;
        if (k === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (k === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') next = 0;
        else if (k === 'End') next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });

    box.classList.add('is-ready');
    select(0);
  });

  /* --- 5. 데모 영상 파사드 ------------------------------------------------- */
  // 재생을 누르기 전까지는 유튜브에 아무 요청도 보내지 않는다(쿠키 없음).
  // 눌렀을 때만 youtube-nocookie 아이프레임으로 교체한다.

  Array.prototype.forEach.call(document.querySelectorAll('[data-video]'), function (box) {
    var btn = box.querySelector('.video-play');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var id = box.getAttribute('data-video');
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = box.getAttribute('data-title') || '데모 영상';
      f.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
      f.setAttribute('allowfullscreen', '');
      box.innerHTML = '';
      box.appendChild(f);
    });
  });

  /* --- 6. 우측 목차 노출 제어 --------------------------------------------- */
  // 히어로(네이비)를 지나야 나타난다. 어두운 배경 위에 겹치면 글씨가 묻힌다.

  var toc = document.querySelector('.toc');
  var heroEl = document.querySelector('.hero');
  if (toc && heroEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      toc.classList.toggle('is-visible', !es[0].isIntersecting);
    }, { threshold: 0 }).observe(heroEl);
  } else if (toc) {
    toc.classList.add('is-visible');
  }

})();
