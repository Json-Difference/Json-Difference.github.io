'use strict';

var bulma = {};

document.addEventListener('DOMContentLoaded', function () {

  // Modals

  var rootEl = document.documentElement;
  var $modals = [];
  var $modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button, .delete');

  bulma.showModal = function (targetId) {
    var $target = document.getElementById(targetId);
    rootEl.classList.add('is-clipped');
    $target.classList.add('is-active');
    $modals.push($target);
  }
  

  if ($modalCloses.length > 0) {
    $modalCloses.forEach(function ($el) {
      $el.addEventListener('click', function () {
        closeLastModal();
      });
    });
  }

  document.addEventListener('keydown', function (event) {
    var e = event || window.event;
    if (e.keyCode === 27) {
      closeLastModal();
    }
  });

  function closeLastModal() {
    $modals.pop().classList.remove('is-active');
    if ($modals.length === 0) {
      rootEl.classList.remove('is-clipped');
    }
  }

  // Functions

  function getAll(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
  }

});