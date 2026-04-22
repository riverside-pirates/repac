// REPAC - Shared JavaScript

(function () {
  'use strict';

  // ========== REMOVE WHEN SITE ENTERS PRODUCTION ==========
  // Development/Draft Banner - Delete this entire section when launching
  document.body.insertAdjacentHTML('afterbegin', '<div style="background-color:#d32f2f;border-bottom:3px solid #b71c1c;padding:8px 16px;text-align:center;font-weight:500;font-size:13px;color:#fff;">UNOFFICIAL DRAFT — This site is a work in progress and has not been reviewed for accuracy. Visit the official site at <a href="https://www.repac-riverside.org" style="color:#ffeb3b;text-decoration:underline;font-weight:600;">repac-riverside.org</a>.</div>');
  // ========================================================

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  // Dropdown toggle on touch devices
  document.querySelectorAll('.nav-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      q.parentElement.classList.toggle('open');
    });
  });

  // Mark active nav link
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // Calendar loading animation
  var calendarContainer = document.querySelector('.calendar-container');
  if (calendarContainer) {
    var iframes = calendarContainer.querySelectorAll('.calendar-view');
    var loadedCount = 0;
    
    iframes.forEach(function(iframe) {
      iframe.addEventListener('load', function() {
        loadedCount++;
        if (loadedCount === iframes.length) {
          calendarContainer.classList.add('loaded');
        }
      });
    });
    
    // Fallback: hide loading after 10 seconds in case iframes fail to load
    setTimeout(function() {
      calendarContainer.classList.add('loaded');
    }, 10000);
  }
})();
