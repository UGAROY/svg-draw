// Some customized code specified for this demo
$(document).ready(function () {
    var editor = new VectorEditor.Editor(document.getElementById("canvas")),
        canvas = $('#canvas'),
        svgCanvas = $('#canvas svg');

    initialize();

    function initialize() {
        loadSplash();
        registerToolbarEvents();
        setMode("path");
    }

    function registerToolbarEvents() {
        $('#toolbar').on('click', 'button', function (e) {
            var mode = $(this)[0].dataset.mode;
            if (!mode) { return; }
            setMode(mode);
        });
    }

    function loadSplash() {
        editor.paper.text(360, 270, 'Let\'s Doodle!').attr({ "font-family": "'Comic Sans MS',cursive" }).animate({ fill: "#223fa3", "stroke-opacity": 0.5, "font-size": 64 }, 1000);
        editor.paper.path("M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM20.729,7.375c0.934,0,1.688,1.483,1.688,3.312S21.661,14,20.729,14c-0.932,0-1.688-1.483-1.688-3.312S19.798,7.375,20.729,7.375zM11.104,7.375c0.932,0,1.688,1.483,1.688,3.312S12.037,14,11.104,14s-1.688-1.483-1.688-3.312S10.172,7.375,11.104,7.375zM16.021,26c-2.873,0-5.563-1.757-7.879-4.811c2.397,1.564,5.021,2.436,7.774,2.436c2.923,0,5.701-0.98,8.215-2.734C21.766,24.132,18.99,26,16.021,26z").attr({ fill: "#223fa3", stroke: "none" }).transform("t360,80s5").glow();
        setTimeout(smoothClearCanvas, 4000);
    }

    function setMode(mode) {
        if (mode === 'delete') {
            smoothClearCanvas();
        }
        if (mode === 'text') {
            editor.prop.text = prompt('Text:', editor.prop.text)
        }
        editor.setMode(mode);
        
        // set cursor
        if (mode === 'select' || mode === 'delete') {
            canvas.removeClass('pen');
        } else {
            canvas.addClass('pen');
        }
    }

    function smoothClearCanvas() {
        $('#canvas svg').animate({
            opacity: 0
        }, 1000, function () {
            editor.paper.clear();
            svgCanvas.css('opacity', 1);
            setMode('path');
        });
    }
});