'use strict';

var housingRegex = /housing\.com/gi;

chrome.tabs.query({
  currentWindow: true,
  active: true
}, function(tabs) {

  var data = {};
  console.log(tabs);

  var url = tabs[0].url;

  var queryString = {};
  var searchString;
  var domain;

  function openVM(){
    var path = domain.split('//')[1].split('.com/')[1] || '';
    domain = 'http://'+data.user+'.housing.com:'+data.port+'/'+path;
    var newUrl = processTab();
    chrome.tabs.create({
      'url': domain + newUrl
    });
  }

  function openMain(){
    var path = domain.split('//')[1].split('.com/')[1] || '';
    domain = 'https://housing.com/'+path;
    var newUrl = processTab();
    chrome.tabs.create({
      'url': domain + newUrl
    });
  }

  function processTab() {
    $bot.checked ? queryString.bot = true : delete queryString.bot;
    $desktop.checked ? delete queryString.desktop : queryString.desktop = false;
    var newUrl = '';
    var keys = Object.keys(queryString);
    if (keys.length) {
      newUrl = '?';
      for (var i = 0; i < keys.length; i++) {
        newUrl += keys[i] + '=' + queryString[keys[i]] + ((i === keys.length - 1) ? '' : '&');
      }
    }
    return newUrl;
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



    var $openvm = document.getElementById('openVm');
    var $openmain = document.getElementById('openMain');

    $openvm.onclick = openVM;
    $openmain.onclick = openMain;

  }

  var $user = document.getElementById('user');
  var $port = document.getElementById('port');

  chrome.storage.sync.get('user', function(r) {
    data.user = r.user || '';
    $user.value = data.user;
  });

  chrome.storage.sync.get('port', function(r) {
    data.port = r.port || '';
    $port.value = data.port;
  });

  $user.onkeyup = function() {
    console.log('a');
    data.user = $user.value;
    chrome.storage.sync.set(data, function() {
      console.log('saved');
    });
  };

  $port.onkeyup = function() {
    data.port = $port.value;
    chrome.storage.sync.set(data, function() {
      console.log('port saved');
    });
  };
});
