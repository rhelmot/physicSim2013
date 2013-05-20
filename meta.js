//meta.js
//Loading functions for JS
//Andrew Dutcher

var metaLoadNum = 0;
var metaLoadCallback;

///////////
///APPLICATION-SPECIFIC CALLS
///Valid examples:
//
//metaLoad('main.js');
//metaLoad(['main.js','module.js','tables.js']);
//metaLoad(['header.js','stats.js','validation.js'], function () {onJSLoaded()});
//metaLoad(['sprites.js','area.js','debug.js'], 'src');
//metaLoad(['sprites.js','area.js','debug.js'], function () {init()}, 'src');
//
///Can be called more than once, but callbacks will be overwritten.
///////////

metaLoad(['base.js', 'workArea.js', 'compatibility.js']);

///////////
///END APPLICATION-SPECIFIC CALLS
///////////



function metaLoad(files, callback, dir) {
    if (typeof files == 'string') {
        files = [files];
    }
    if (typeof callback == 'function') {
        metaLoadCallback = callback;
    } else {
        dir = callback;
    }
    if (typeof dir != 'string') {
        dir = '.';
    }
    metaLoadNum += files.length;
    for (var i = 0; i < files.length; i++) {
        var script = document.createElement('script');
        script.onload = metaLoaded;
        script.src = dir + '/' + files[i];
        document.head.appendChild(script);
    }
}

function metaLoaded() {
    metaLoadNum--;
    if (metaLoadNum == 0) {
        if (typeof metaLoadCallback == 'function') {
            metaLoadCallback();
        }
    }
}

