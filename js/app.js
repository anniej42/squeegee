$(document).ready(function() {
    var svg = d3.select("div#view").append("svg").attr("id", "canvas");

    //Config
    // const googleImages = require('google-images');
    // var client = googleImages('010335386721245577896:2b1-dmghx1y', 'AIzaSyAxG2VaoKrkV5gztGfUlAZdUCdAH-0NFso');
    var circleRadius = 100;
    var blurAmount = 20;
    var clipDelay = 200;
    var mode = 0;
    var img, svg, mask;
    var clipDuration = 30000;
    var clipEase = 'quad'; //quad and circle look good
    var imageUrl;
    // var prevPoint = new paper.Point(0,0);
    var prevPoint = {
        "x": 0,
        "y": 0
    };
    var curPoint = {
        "x": 0,
        "y": 0
    };
    var cursorAngle;
    var squeegee = $("#squeegee")

    $("#toggle").click(function() {
        mode = 1 - mode;
        if (mode == 0) {
            clipDuration = 20000;
        } else {
            clipDuration = 5;
        }
    });

    var cursor = d3.select("body").append("svg").attr("id", "cursor");
    console.log(cursor);

    var sqicon = cursor.append('svg:image')
        .attr({
            'xlink:href': "http://anniejiao.me/squeegee/css/cursor.png",
            width: 100,
            height: 40,
        })

    //CLIP
    var clips = svg.append('svg:defs')
        .append('svg:mask')
        .attr({
            id: 'mask'
        });

    var addMask = function addMask(x, y, deg) {
        // circle blur
        var clip = clips.append('svg:circle')
            .attr({
                cx: x,
                cy: y,
                r: circleRadius,
                fill: '#ffffff',
                'class': 'clipCircle'
            });
        // var clip = clips.append('svg:rect')
        //     .attr({
        //         width: 125,
        //         height: 60,
        //         fill: '#ffffff',
        //         'class': 'clipCircle',
        //         "transform": "translate("+ x + "," + y + ") rotate("+deg+")"
        //     });

        return clip;
    };


    $(".category").on("click", function() {
        // svg.html("");
        svg.selectAll("image").remove();
        svg.selectAll(".clipCircle").remove();

        $(".category").removeClass("active");
        $(this).addClass("active")
        var category = $(this).attr("id");
        getImage(category)
    })

    $("input").keyup(function(e) {
        svg.selectAll("image").remove();
        if (e.keyCode == 13) {
            svg.selectAll("image").remove();
            $(".category").removeClass("active");
            var category = $(this).val();
            searchImage(category);
        }
    });

    //Blur filter
    var defs = svg.append('svg:defs');
    var filterBlur = defs.append('svg:filter')
        .attr({
            id: 'blur'
        });
    filterBlur.append('feGaussianBlur')
        .attr({
            'in': "SourceGraphic",
            'stdDeviation': blurAmount
        });

    var enableHandler = true;

    var cursorAngle;
    var rotateCounter =0;
    var mouseMove = function move(e) {
      rotateCounter = (rotateCounter+1)%18;

        //erase on mouse over
        if (enableHandler) {
            curPoint.x = d3.event.pageX
            curPoint.y = d3.event.pageY;

            // dx = curPoint.x - prevPoint.x
            // dy = curPoint.y - prevPoint.y
            // var vector = new paper.Point(dx, dy);
            // cursorAngle = vector.angle + 90;

            // sqicon.attr("transform", "translate(" + curPoint.x + "," + curPoint.y + ") rotate(" + cursorAngle + ")");
            sqicon.attr("transform", "translate(" + curPoint.x + "," + curPoint.y + ") rotate(" + rotateCounter*20 + ")");
            // sqicon.attr("transform", "translate(" + curPoint.x + "," + curPoint.y + ")");
            // var t0 = Date.now();
            // d3.timer(function() {
            //     var delta = (Date.now() - t0);
            //     sqicon.attr("transform", "translate(" + curPoint.x + "," + curPoint.y + ") rotate(" + delta * 2 / 200 + ")");
            //     // sqicon.attr("transform", function(d) {
            //     //     return "rotate(" + delta * 2 / 200 + ")";
            //     // });
            // });
            prevPoint.x = curPoint.x;
            prevPoint.y = curPoint.y;
            // enableHandler = false;

        }

        //Add mask
        var clip = addMask(curPoint.x, curPoint.y, cursorAngle);

        clip.transition().ease(clipEase)
            .delay(clipDelay)
            .duration(clipDuration)
            .attr({
                fill: '#000000',
                r: 0
            })
            .each('end', function end() {
                this.remove();
            })
    };

    $(document).ready(function() {

        _500px.init({
            sdk_key: 'ff6d61fac0e96e8c54f17f9bef8674230426f07e',
            "consumer_key": "toNzUXsgWhv6knJFYzFEaALwZyJosUTAAta9Rh3D"
        });

        getImage(" ");
        $(window).resize(resize);
        svg.on('mousemove', mouseMove);
        resize();
    });

    function getImage(category) {
        _500px.api('/photos', 'get', {
            rpp: 5,
            "feature": "editor",
            "image_size": "2048",
            "only": category,
            "exclude": "People, Nude"
        }, function(response) {
            handleResponse(response)
        });
    }

    function searchImage(term) {
        _500px.api('/photos/search', 'get', {
            rpp: 5,
            term: term,
            "feature": "editor",
            "image_size": "2048",
            "exclude": "People, Nude"
        }, function(response) {
            handleResponse(response);
        });
    }

    function handleResponse(response) {
        if (response.success) {
            var i = Math.floor(Math.random() * 5);
            imageUrl = response.data.photos[i].image_url;
            //Add blurred image
            img = svg.append('svg:image')
                .attr({
                    x: 0,
                    y: 0,
                    filter: 'url(#blur)',
                    'xlink:href': imageUrl,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    fill: '#336699'
                })

            //MASK
            //  Add masked image (regular, non blurred image which will be revealed
            mask = svg.append('svg:image')
                .attr({
                    x: 0,
                    y: 0,
                    'xlink:href': imageUrl,
                    'mask': 'url(#mask)',
                    width: window.innerWidth,
                    height: window.innerHeight,
                    filter: 'url(#blur2)',
                    fill: '#336699'
                });
        } else {
            console.log("failed")
        }
    }

    function resize() {
        var width = window.innerWidth || e.clientWidth || g.clientWidth;;
        var height = window.innerHeight || e.clientHeight || g.clientHeight;

        svg.attr("width", width).attr("height", height);
        img.attr("width", width).attr("height", height);
        mask.attr("width", width).attr("height", height);
    }
})
