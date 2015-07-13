'use strict';

var housingRegex = /housing\.com/gi;

chrome.tabs.query({
  currentWindow: true,
  active: true
}, function(tabs) {

  var url = tabs[0].url;

  if (url.match(housingRegex)) {

    var domain = url.split('?')[0];
    var searchString = url.split('?')[1];

    var queryString = {};
    var getParams = searchString.split('&');

    for (var i = 0; i < getParams.length; i++) {
      console.log(getParams[i]);

      var y = getParams[i].split('=');
      var key = y[0];
      var value = y[1];
      queryString[key] = value;
    }

    var $bot = document.getElementById('bot');
    var $desktop = document.getElementById('desktop');

    if (queryString.bot) {
      $bot.checked = true;
    } else {
      $bot.checked = false;
    }

    if (!queryString.desktop) {
      $desktop.checked = true;
    } else {
      $desktop.checked = false;
    }

    function openTab() {
      $bot.checked ? queryString.bot = true : delete queryString.bot;
      $desktop.checked ? delete queryString.desktop : queryString.desktop = false;
      var newUrl = '';
      var keys = Object.keys(queryString);
      for (var i = 0; i < keys.length; i++) {
        newUrl += keys[i] + '=' + queryString[keys[i]] + ((i === keys.length - 1) ? '' : '&');
      }
      chrome.tabs.create({
        'url': domain + '?' + newUrl
      });
    }


    var $open = document.getElementById('openPage');

    $open.onclick = openTab;
  }

});
