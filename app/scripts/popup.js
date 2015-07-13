'use strict';

var housingRegex = /housing\.com/gi;

chrome.tabs.query({
  currentWindow: true,
  active: true
}, function(tabs) {

  var url = tabs[0].url;

  var queryString = {};
  var searchString;
  var domain;

  function openTab() {
    console.log(queryString);
    $bot.checked ? queryString.bot = true : delete queryString.bot;
    $desktop.checked ? delete queryString.desktop : queryString.desktop = false;
    var newUrl = '';
    console.log(queryString);
    var keys = Object.keys(queryString);

    console.log(keys.length, keys);
    if (keys.length) {
      newUrl = '?';
      for (var i = 0; i < keys.length; i++) {
        newUrl += keys[i] + '=' + queryString[keys[i]] + ((i === keys.length - 1) ? '' : '&');
      }
    }

    console.log(newUrl);

    chrome.tabs.create({
      'url': domain + newUrl
    });
  }

  if (url.match(housingRegex)) {

    domain = url.split('?')[0];

    var getParams;

    if (url.split('?')[1]) {
      searchString = url.split('?')[1];
      getParams = searchString.split('&');
    }


    console.log(getParams);

    if (getParams) {
      for (var i = 0; i < getParams.length; i++) {
        var y = getParams[i].split('=');
        var key = y[0];
        var value = y[1];
        queryString[key] = value;
      }
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



    var $open = document.getElementById('openPage');

    $open.onclick = openTab;
  }



});
