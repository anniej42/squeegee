$(function() {
    var svg = d3.select("div#view").append("svg").attr("id", "canvas");

    //Config
    var circleRadius = 50;
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
    var cursor = d3.select("body").append("svg").attr("id", "cursor");

    var sqicon = cursor.append('svg:image')
        .attr({
            'xlink:href': "/css/cursor.png",
            width: 100,
            height: 40,
        })

    // post request to the server to get images
    function google(category) {
        category = category.replace("_", " ");
        $.post(
            window.location.origin + '/getURL', {
                "category": category
            },
            function(data) {
                // console.log(data);
                putImage(data);
            }
        );
    }

    // add loading bar
    $(document).ajaxStart(function() {
        NProgress.start();
    });
    $(document).ajaxStop(function() {
        NProgress.done();
    });

    // create the cleaning effects
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
        return clip;
    };

    // switch categories, clear svg and google new category

    $(".category").on("click", function() {
        svg.selectAll("image").remove();
        svg.selectAll(".clipCircle").remove();

        $(".category").removeClass("active");
        $(this).addClass("active")
        var category = $(this).attr("id");
        google(category)
    })

    // on enter, search with text
    $("input").keyup(function(e) {
        if (e.keyCode == 13) {
            svg.selectAll("image").remove();
            svg.selectAll(".clipCircle").remove();
            $(".category").removeClass("active");
            var category = $(this).val();
            google(category)
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

    var rotateCounter = 0;

    var mouseMove = function move(e) {
        rotateCounter = (rotateCounter + 1) % 18;

        //erase on mouse over
        curPoint.x = d3.event.pageX
        curPoint.y = d3.event.pageY;

        sqicon.attr("transform", "translate(" + curPoint.x + "," + curPoint.y + ") rotate(" + rotateCounter * 20 + ")");
        prevPoint.x = curPoint.x;
        prevPoint.y = curPoint.y;

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
        google("mildly interesting"); // default category
        $(window).resize(resize);
        svg.on('mousemove', mouseMove);
        resize();
    });

    function putImage(url) {
        img = svg.append('svg:image')
            .attr({
                x: 0,
                y: 0,
                filter: 'url(#blur)',
                'xlink:href': url,
                width: window.innerWidth,
                height: window.innerHeight,
                fill: '#336699'
            })

        // MASK
        // Add masked image — regular, non blurred image which will be revealed
        mask = svg.append('svg:image')
            .attr({
                x: 0,
                y: 0,
                'xlink:href': url,
                'mask': 'url(#mask)',
                width: window.innerWidth,
                height: window.innerHeight,
                filter: 'url(#blur2)',
                fill: '#336699'
            });
    }

    function resize() {
        var width = window.innerWidth || e.clientWidth || g.clientWidth;;
        var height = window.innerHeight || e.clientHeight || g.clientHeight;

        svg.attr("width", width).attr("height", height);
        img.attr("width", width).attr("height", height);
        mask.attr("width", width).attr("height", height);
    }
});