// Ett julkort från Simon Herteby
randInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
toRadians = function (angle) {
    return angle * (Math.PI / 180);
};
$(function () {

    var name = window.location.hash.slice(1).replace(/_/g, ' ');
    document.title = "God Jul " + name + "!";
    var text = $('#text');
    text.html('<h1>God Jul ' + name + '!</h1>önskar Simon');


    var stageWidth, stageHeight;
    body = $('body');
    canvas = $('#stage');
    $(window).resize(function () {
        if ($(document).width() > $(document).height()) {
            body.css('font-size', $(document).height() / 10 + 'px');
        } else {
            body.css('font-size', $(document).width() / 10 + 'px');
        }
        stageWidth = canvas.width();
        stageHeight = canvas.height();
        canvas.attr('width',stageWidth);
        canvas.attr('height',stageHeight);
        text.css({
            'margin-top': (-Math.round(text.height() / 2)) + 'px'
        });
    });
    $(window).trigger('resize');

    createjs.Ticker.addEventListener('tick', tick);
    createjs.Ticker.setFPS(60);
    var stage = new createjs.Stage('stage');
    var snowflake = [];
    var i;


    window.addEventListener('load', function(event){
        for (i = 0; i < 400; i++) {
            var flake = new createjs.Bitmap('snowflake' + randInt(0,4) + '.gif');
            flake.regX = 50;
            flake.regY = 50;
            flake.baseX = randInt(0, 100);
            flake.baseY = randInt(0, 100);
            flake.distance = randInt(1, 50);
            flake.radius = 5 + 30 / flake.distance;
            flake.scaleX = flake.radius / 50;
            flake.scaleY = flake.radius / 50;
            flake.filters = [
                new createjs.ColorFilter(1,1,1,1, 0,0,0,-flake.distance * 5)
            ];
            flake.cache(0,0,100,100, flake.scaleX + 0.1);
            flake.rotation = randInt(0, 359);
            snowflake[i] = flake;
            stage.addChild(snowflake[i]);
        }
    });

    var wind;
    var time = 0;

    function tick(event) {
        var i, flake;
        time++;
        wind = Math.sin(time / 350) + Math.sin(time / 100) + Math.sin(time / 70);
        for (i = 0; i < snowflake.length; i++) {
            flake = snowflake[i];
            flake.baseY += 0.1 + 0.5 / (1 + flake.distance / 10);
            flake.baseX += wind * (1 + (4 / (1 + flake.distance / 10))) / 10;
            flake.rotation += 1 - (i % 2) * 2;
            if (flake.rotation >= 360) {
                flake.rotation = 0;
            } else if (flake.rotation <= 0) {
                flake.rotation = 360;
            }
            flake.turbulence = Math.sin(toRadians(flake.rotation * 2)) * (4 - flake.distance / 25);
            if (flake.baseY - (flake.radius / stageHeight * 200) > 100) {
                flake.baseY = 0 - (flake.radius / stageHeight * 200);
                flake.baseX = randInt(0,100);
            }
            if (flake.baseX + (flake.radius / stageWidth * 300) < 0) {
                flake.baseX = 100 + (flake.radius / stageWidth * 300);
            } else if (flake.baseX - (flake.radius / stageWidth * 300) > 100) {
                flake.baseX = 0 - (flake.radius / stageWidth * 300);
            }
            flake.x = (flake.baseX + flake.turbulence) * stageWidth / 100;
            flake.y = flake.baseY * stageHeight / 100;
        }

        stage.update();
        if (time < 100) {
            text.css({
                'margin-top': (-Math.round(text.height() / 2)) + 'px'
            });
        }
    }
});