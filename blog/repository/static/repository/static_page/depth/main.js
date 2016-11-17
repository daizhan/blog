(function(window){
    function D(selector, width, height, backgroundColor){
        this.svg = null;
        this.selector = selector;
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;

        this.init();
    }
    D.prototype = {
        init: function(){
            var size = this.getClientSize();
            this.svg = SVG(this.selector).size(size.width, size.height);
            this.svg.style({"background-color": this.backgroundColor});
            this.container = this.svg.group().addClass("container");
        },

        render: function(){
            var scale, translate;
            scale = this.getInitScale();
            translate = this.getInitTranslate();
            this.container.attr("transform", "translate(" + translate.x + "," + translate.y + ") scale(" + scale + ")");
            this.initScale(this.container);
            this.initMove(this.container);
            this.initResize(this.container);
        },

        addCommand: function(parent, data){
            var group = parent.group(),
                text = group.plain(data.title).addClass("command-title " + data.state),
                paddingTop = 30,
                paddingLeft = 66,
                textSize = text.node.getBoundingClientRect(),
                width = data.width || textSize.width + 2 * paddingLeft,
                height = 106,
                connerWidth = 16,
                offset = 27,
                d, module;

            if (typeof data.moduleIndex != "undefined") {
                module = this.commandModules[data.moduleIndex];
                data.x = module.x+(module.width-width)/2;
                if (data.position === "top") {
                    data.y = this.leftSide.y;
                } else if (data.position === "bottom") {
                    data.y = this.leftSide.y + this.leftSide.height - height;
                } else { // mid
                    data.y = this.leftSide.y + ((this.leftSide.height-(height*data.total))/(data.total-1) + height)*data.index;
                }
            } else if (typeof data.centrlX != "undefined" && typeof data.centrlY != "undefined") {
                data.x = data.centrlX - width/2;
                data.y = data.centrlY - height/2;
            }

            // add top left conner
            group.rect(connerWidth,connerWidth).attr({
                x: data.x - connerWidth/2,
                y: data.y - connerWidth/2
            }).addClass("command-icon " + data.state)

            d = "M " + data.x + " " + data.y + " " +
                "L " + (data.x+width-offset) + " " + data.y + " " +
                "L " + (data.x+width) + " " + (data.y+offset) + " " +
                "L " + (data.x+width) + " " + (data.y+height) + " " +
                "L " + data.x + " " + (data.y+height) + " " +
                "Z";
            group.path(d).style("fill", "#092a42").addClass("command-line " + data.state);
            text.attr({
                x: data.x+(width-textSize.width)/2,
                y: data.y+(height-textSize.height)/2+textSize.height*3/4
            });
            $(group.node).append(text.node);
            if (!this.commands) {
                this.commands = [];
            }
            this.commands.push({
                x: data.x,
                y: data.y,
                width: width,
                height: height
            });
        },

        addConnector: function(parent, data){
            function addCircle(radius, cx, cy){
                parent.circle(2*radius).attr({
                    cx: cx,
                    cy: cy,
                    stroke: stroke,
                    fill: fill
                });
            }

            // start and end point
            function getPoint(command, direction) {
                var x, y, centerPos,
                    gap = 6 + 2*(radius+1),
                    circleGap = gap - radius,
                    marker = {};
                if (direction === "top") {
                    x = command.x+command.width/2;
                    y = command.y-gap;
                    centerPos = "x";
                    otherPos = "y";
                    marker.x = x;
                    marker.y = y + radius;
                } else if (direction === "bottom") {
                    x = command.x+command.width/2;
                    y = command.y+command.height+gap;
                    centerPos = "x";
                    otherPos = "y";
                    marker.x = x;
                    marker.y = y - radius;
                } else if (direction === "left") {
                    x = command.x-gap;
                    y = command.y + command.height/2;
                    centerPos = "y";
                    otherPos = "x";
                    marker.x = x + radius;
                    marker.y = y;
                } else {
                    x = command.x+command.width+gap;
                    y = command.y + command.height/2;
                    centerPos = "y";
                    otherPos = "x";
                    marker.x = x - radius;
                    marker.y = y;
                }
                return {x: x, y: y, centerPos: centerPos, otherPos: otherPos, marker: marker, direction: direction};
            }

            function getMidPoint(start, end, type){
                var midPoints = [], obj = {}, offset,
                    verticals = ["bottom", "top"];
                if (type === "conner1"){
                    if (verticals.indexOf(start.direction) != -1  && verticals.indexOf(end.direction) != -1) {
                        if (end.direction === "top") {
                            end.y += radius;
                            if (start.x > end.x) {
                                end.x += radius;
                            } else {
                                end.x -= radius;
                            }
                        } else {
                            end.y -= radius;
                            if (start.x > end.x) {
                                end.x += radius;
                            } else {
                                end.x -= radius;
                            }
                        }
                        obj[start.centerPos] = start[start.centerPos];
                        obj[end.otherPos] = end[end.otherPos];
                    } else {
                        obj[start.centerPos] = start[start.centerPos];
                        obj[end.centerPos] = end[end.centerPos];
                    }
                    midPoints.push(obj);
                } else if (type === "conner2"){
                    offset = (end.x - start.x) / 2;
                    obj[start.otherPos] = start[start.otherPos] + offset;
                    obj = $.extend({}, start, obj);
                    midPoints.push(obj);
                    obj = {};
                    obj[end.otherPos] = end[end.otherPos] - offset;
                    obj = $.extend({}, end, obj);
                    midPoints.push(obj);
                }
                return midPoints;
            }

            function updateData(startCommand, startDirection, endCommand, endDirection, connectType){
                var start, end, mids, points = [];
                start = getPoint(startCommand, startDirection);
                end = getPoint(endCommand, endDirection);
                mids = getMidPoint(start, end, connectType);
                points.push(start);
                points = points.concat(mids);
                points.push(end);
                return points;
            }

            var group = parent.group(),
                stroke = "#006bb6",
                fill = "#001727",
                radius = 7,
                i, len, d, start, end;
            if (typeof data.commands != "undefined") {
                data.points = updateData(this.commands[data.commands[0]], data.startDirection, this.commands[data.commands[1]], data.endDirection, data.connectType);
            }
            for (i=0,len=data.points.length; i < len; i ++) {
                if (i == 0) {
                    d = "M "
                } else {
                    d += " L "
                }
                d += data.points[i].x + " " + data.points[i].y;
            }
            group.path(d).attr({stroke: stroke, fill: "transparent"});
            if (data.points[0].marker) {
                addCircle(radius, data.points[0].marker.x, data.points[0].marker.y);
            }
            if (data.points[data.points.length-1].marker) {
                addCircle(radius, data.points[data.points.length-1].marker.x, data.points[data.points.length-1].marker.y);
            }
        },

        addCommandState: function(parent, data){
            var group = parent.group(),
                text = group.plain(data.title).addClass("command-state"),
                textSize = text.node.getBoundingClientRect(),
                blockWidth = 30,
                blockOffset = 12,
                offset = 20,
                paddingTop = 15,
                paddingLeft = 20,
                d,
                width = 2*paddingLeft + blockWidth + offset + textSize.width,
                height = 68;
                blockPaddingTop = (height-blockWidth) / 2;
            d = "M " + data.x + " " + data.y + " " +
                "L " + (data.x+width-offset/2) + " " + data.y + " " +
                "L " + (data.x+width+offset/2) + " " + (data.y+offset) + " " +
                "L " + (data.x+width+offset/2) + " " + (data.y+height) + " " +
                "L " + (data.x+offset) + " " + (data.y+height) + " " +
                "L " + data.x + " " + (data.y+height-offset) + " " +
                "Z";
            group.path(d).addClass("command-state-line");
            d = "M " + (data.x+offset) + " " + (data.y+blockPaddingTop) + " " +
                "L " + (data.x+offset+blockWidth) + " " + (data.y+blockPaddingTop) + " " +
                "L " + (data.x+offset+blockWidth) + " " + (data.y+blockPaddingTop+blockWidth) + " " +
                "L " + (data.x+offset+blockOffset) + " " + (data.y+blockPaddingTop+blockWidth) + " " +
                "L " + (data.x+offset) + " " + (data.y+blockPaddingTop+blockWidth-blockOffset) + " " +
                "Z";
            group.path(d).addClass("command-state-icon " + data.state);
            text.attr({
                x: data.x+paddingLeft+blockWidth+offset,
                y: data.y+(height-textSize.height)/2+textSize.height*3/4
            });
            $(group.node).append(text.node);
        },

        addLeftSide: function(parent, data) {
            var group = parent.group(),
                offset = 27,
                width = 140,
                heightList = [106, 446, 106],
                gap = 12,
                offsetTop = 0,
                height, d,
                text, textSize,
                i, len, item;

            for (i = 0, len = data.items.length; i < len; i ++) {
                item = data.items[i];
                height = heightList[i];
                text = group.plain(item).addClass("side-title");
                textSize = text.node.getBoundingClientRect();
                if (i === 0) {
                    d = "M " + data.x + " " + (data.y+offsetTop) + " ";
                } else {
                    d = "M " + data.x + " " + (data.y+offsetTop-offset) + " " +
                        "L " + (data.x+offset) + " " + (data.y+offsetTop) + " ";
                }
                d += "L " + (data.x+width-offset) + " " + (data.y+offsetTop) + " " +
                     "L " + (data.x+width) + " " + (data.y+offsetTop+offset) + " " +
                     "L " + (data.x+width) + " " + (data.y+offsetTop+height) + " " +
                     "L " + (data.x+offset) + " " + (data.y+offsetTop+height) + " " +
                     "L " + data.x + " " + (data.y+offsetTop+height-offset) + " " +
                     "Z";
                group.path(d).addClass("command-state-line");
                text.attr({
                    x: data.x+(width-textSize.width)/2,
                    y: data.y+offsetTop+(height-textSize.height)/2+textSize.height*3/4
                });
                $(group.node).append(text.node);
                offsetTop += height + gap;
            }
            this.leftSide = {
                x: data.x,
                y: data.y,
                width: width,
                height: Math.max(offsetTop - gap, 0)
            };
        },

        addCommandModule: function(parent, data){
            var self = this,
                group = parent.group(),
                offset = 27,
                defaultWidth = 430,
                height = 90,
                gap = 12,
                offsetLeft = 0,
                width, d,
                text, textSize,
                i, len, item;

            for (i = 0, len = data.items.length; i < len; i ++) {
                width = defaultWidth;
                item = data.items[i];
                text = group.plain(item.title).addClass("module-title");
                textSize = text.node.getBoundingClientRect();
                if (width < textSize.width+2*offset) {
                    width = textSize.width + 3*offset;
                }
                if (i === 0) {
                    d = "M " + data.x + " " + data.y + " ";
                } else {
                    d = "M " + (data.x+offsetLeft-offset) + " " + data.y + " " +
                        "L " + (data.x+offsetLeft) + " " + (data.y+offset) + " ";
                }
                d += "L " + (data.x+offsetLeft) + " " + (data.y+height) + " " +
                     "L " + (data.x+offsetLeft+width) + " " + (data.y+height) + " " +
                     "L " + (data.x+offsetLeft+width) + " " + (data.y+offset) + " " +
                     "L " + (data.x+offsetLeft+width-offset) + " " + data.y + " " +
                     "Z";
                group.path(d).addClass("module-line");
                text.attr({
                    x: data.x+offsetLeft+(width-textSize.width)/2,
                    y: data.y+(height-textSize.height)/2+textSize.height*3/4
                });
                $(group.node).append(text.node);

                if (!this.commandModules) {
                    this.commandModules = [];
                }
                this.commandModules.push({
                    x: data.x+offsetLeft,
                    y: data.y,
                    width: width,
                    height: height
                });
                offsetLeft += width + gap;
                item.commands.forEach(function(value){
                    self.addCommand(self.container, value);
                });
            }
        },

        addTask: function(parent, data){

            function drawText(parent, value, className, transform){
                var group = parent.group(),
                    text = group.plain(value).addClass(className),
                    textSize = text.node.getBoundingClientRect();
                console.log(textSize, text.bbox());
                text.attr({
                    x: 0,
                    y: textSize.height*3/4
                });
                group.transform(transform);
            }

            var group = parent.group(),
                gap = 20,
                margin = 11,
                offset = 28,
                innerOffset = 26,
                width = 625,
                height = 450,
                innerWidth = width - 2*margin,
                innerHeight = height - 2*margin,
                offsetLeft = 0,
                innerOffsetTop = 0,
                innerOffsetLeft = 0,
                title, person, expath, rect, d, gradient,
                i, len, item;
            for (i = 0, len = data.items.length; i <len; i ++){
                innerOffsetTop = 0;
                innerOffsetLeft = 0;
                item = data.items[i];
                d = "M " + (data.x+offsetLeft) + " " + data.y + " " +
                    "L " + (data.x+offsetLeft+width-offset) + " " + data.y + " " +
                    "L " + (data.x+offsetLeft+width) + " " + (data.y+offset) + " " +
                    "L " + (data.x+offsetLeft+width) + " " + (data.y+height) + " " +
                    "L " + (data.x+offsetLeft) + " " + (data.y+height) + " " +
                    "Z";
                group.path(d).addClass("task-line");
                d = "M " + (data.x+offsetLeft+margin) + " " + (data.y+margin) + " " +
                    "L " + (data.x+offsetLeft+margin+innerWidth-innerOffset) + " " + (data.y+margin) + " " +
                    "L " + (data.x+offsetLeft+margin+innerWidth) + " " + (data.y+margin+innerOffset) + " " +
                    "L " + (data.x+offsetLeft+margin+innerWidth) + " " + (data.y+margin+innerHeight) + " " +
                    "L " + (data.x+offsetLeft+margin) + " " + (data.y+margin+innerHeight) + " " +
                    "Z";
                gradient = this.svg.gradient("linear", function(stop){
                    stop.at(0, "#005692");
                    stop.at(0.5, "#092a42");
                    stop.at(1, "#092a42");
                }).from(1, 0).to(0, 1);
                group.path(d).addClass("task-container").fill(gradient);

                text = group.plain("任务确认").addClass("task-title"),
                textSize = text.node.getBoundingClientRect();
                text.attr({
                    x: data.x+offsetLeft+margin+innerOffset,
                    y: data.y+margin+innerOffset+textSize.height*3/4
                });
                innerOffsetTop += margin + innerOffset/2 + textSize.height;

                text = group.plain("负责人："+item.person).addClass("task-person");
                textSize = text.node.getBoundingClientRect();
                innerOffsetTop += 20 // 文本间距
                text.attr({
                    x: data.x+offsetLeft+margin+innerOffset,
                    y: data.y+innerOffsetTop + textSize.height*3/4
                })
                innerOffsetTop += textSize.height;

                text = group.plain("预计完成时间").addClass("task-expect-title");
                textSize = text.node.getBoundingClientRect();
                innerOffsetTop += 20 // 文本间距
                text.attr({
                    x: data.x+offsetLeft+margin+innerOffset,
                    y: data.y+innerOffsetTop + textSize.height*3/4
                })
                innerOffsetLeft += margin+innerOffset+textSize.width + 40;
                text = group.plain("任务总耗时").addClass("task-total-title");
                textSize = text.node.getBoundingClientRect();
                text.attr({
                    x: data.x+offsetLeft+innerOffsetLeft,
                    y: data.y+innerOffsetTop + textSize.height*3/4
                })
                innerOffsetTop += textSize.height + 15;

                text = group.text(function(add){
                    add.tspan(item.expect.toString()).addClass("task-expect-number");
                    add.tspan(item.expect > 1 ? "hours" : "hour").addClass("task-expect-unit").attr("dx", 15);
                });
                textSize = text.node.getBoundingClientRect();
                rect = group.rect(textSize.width+25, textSize.height-10).addClass("task-expect-line");
                rect.attr({
                    x: data.x+offsetLeft+margin+innerOffset,
                    y: data.y+innerOffsetTop
                });
                text.attr({
                    x: data.x+offsetLeft+margin+innerOffset+(rect.width()-textSize.width)/2,
                    y: data.y+innerOffsetTop + (rect.height()-textSize.height)/2+textSize.height*3/4+3
                });
                text = group.text(function(add){
                    add.tspan(item.total.toString()).addClass("task-total-number");
                    add.tspan(item.total > 1 ? "hours" : "hour").addClass("task-total-unit").attr("dx", 15);
                });
                textSize = text.node.getBoundingClientRect();
                rect = group.rect(textSize.width+25, textSize.height-10).addClass("task-total-line");
                rect.attr({
                    x: data.x+offsetLeft+innerOffsetLeft,
                    y: data.y+innerOffsetTop
                });
                text.attr({
                    x: data.x+offsetLeft+innerOffsetLeft+(rect.width()-textSize.width)/2,
                    y: data.y+innerOffsetTop + (rect.height()-textSize.height)/2+textSize.height*3/4+3
                });
                innerOffsetTop += rect.height() + 40;

                group.rect(innerWidth-2*innerOffset, 54).addClass("task-progress-line").attr({
                    x: data.x+offsetLeft+margin+innerOffset,
                    y: data.y+innerOffsetTop,
                    "stroke-width": 2
                });
                group.rect(item.progress/100*(innerWidth-2*innerOffset-20), 34).addClass("task-progress-content").attr({
                    x: data.x+offsetLeft+margin+innerOffset+10,
                    y: data.y+innerOffsetTop+10,
                });
                offsetLeft += width + gap;
            }
        },

        addContainer: function(parent, data){
            var textPadding = 34,
                offset = 72,
                text = parent.plain(data.title).addClass("page-title"),
                textSize = text.node.getBoundingClientRect(),
                width = textSize.width + offset + textPadding*3/2,
                height = 150,
                totalWidth = 3028,
                totalHeight = 1652,
                titleGap = 10,
                lineLength = 1046,
                lineGap = 20,
                rightBarOffset = 730,
                rightBarLength = 565,
                offsetA = 24,
                offsetB = 84,
                strokeWidth = 4,
                path, d;
            d = "M " + data.x + " " + data.y + " " +
                "L " + (data.x+width-offset) + " " + data.y + " " +
                "L " + (data.x+width) + " " + (data.y+offset) + " " +
                "L " + (data.x+width) + " " + (data.y+height) + " " +
                "L " + data.x + " " + (data.y+height) + " " +
                "Z";
            path = parent.path(d).addClass("page-title-line");
            text.attr({
                x: data.x+textPadding,
                y: data.y+(height-textSize.height)/2+textSize.height*3/4
            });
            $(parent.node).append(text.node);

            d = "M " + (data.x+width+titleGap) + " " + (data.y+offset) + " L " + (data.x+width+titleGap+lineLength) + " " + (data.y+offset);
            parent.path(d).addClass("page-top-line");

            d = "M " + (data.x+width+titleGap) + " " + (data.y+offset+lineGap) + " " +
                "L " + (data.x+width+titleGap+lineLength) + " " + (data.y+offset+lineGap) + " " +
                "L " + (data.x+width+titleGap+lineLength+offsetA) + " " + (data.y+offset+lineGap-offsetA) + " " +
                "L " + (data.x+totalWidth-offsetA) + " " + (data.y+offset+lineGap-offsetA) + " " +
                "L " + (data.x+totalWidth) + " " + (data.y+offset+lineGap) + " " +
                "L " + (data.x+totalWidth) + " " + (data.y+height) + " " +
                "L " + (data.x+width+titleGap) + " " + (data.y+height) + " " +
                "Z";
            parent.path(d).addClass("page-top-line-block");

            d = "M " + (data.x+totalWidth-strokeWidth/2) + " " + (data.y+height) + " " +
                "L " + (data.x+totalWidth-strokeWidth/2) + " " + (data.y+totalHeight-offsetB) + " " +
                "L " + (data.x+totalWidth-offsetB-strokeWidth/2) + " " + (data.y+totalHeight) + " " +
                "L " + (data.x+strokeWidth/2) + " " + (data.y+totalHeight) + " " +
                "L " + (data.x+strokeWidth/2) + " " + (data.y+height);
            parent.path(d).addClass("page-container-line");

            d = "M " + (data.x+totalWidth) + " " + (data.y+height+rightBarOffset) + " " +
                "L " + (data.x+totalWidth+offsetA) + " " + (data.y+height+rightBarOffset+offsetA) + " " +
                "L " + (data.x+totalWidth+offsetA) + " " + (data.y+height+rightBarOffset+rightBarLength-offsetA) + " " +
                "L " + (data.x+totalWidth) + " " + (data.y+height+rightBarOffset+rightBarLength) + " " +
                "Z";
            parent.path(d).addClass("page-right-line-block");
        },

        addMaintenance: function(parent, data){
            var group = parent.group().addClass("person-table"),
                paddingX = 60,
                height = 120,
                offset = 30,
                cellList = [], trBorders = [], cells,
                width, textTotalWidth, totalheight,
                i, len, text, tr, widthList = [],
                d, path = group.path().addClass("table-border"),
                offsetTop = 0, offsetLeft = 0;
            for (i = 0, len = data.tr.length; i < len; i ++) {
                if (i == 0) {
                    tr = group.group().addClass("tr-title");
                } else {
                    tr = group.group().addClass("tr-text");
                }
                if (i % 2 === 0) {
                    trBorders.push(tr.path().addClass("even"));
                } else {
                    trBorders.push(tr.path().addClass("odd"));
                }
                cells = [];
                data.tr[i].forEach(function(value, index){
                    var text = tr.plain(value),
                        textSize = text.node.getBoundingClientRect();
                    if (!widthList[index] || widthList[index] < textSize.width) {
                        widthList[index] = textSize.width;
                    }
                    cells.push(text);
                });
                cellList.push(cells);
            }
            textTotalWidth = widthList.reduce(function(previous, current){
                return previous + current;
            }, 0);
            totalHeight = height * len;
            width = (paddingX * 2 * len) + textTotalWidth;
            data.x = this.width - data.paddingRight - width;
            d = "M " + (data.x+offset) + " " + data.y + " " +
                "L " + (data.x+width-offset) + " " + data.y + " " +
                "L " + (data.x+width) + " " + (data.y+offset) + " " +
                "L " + (data.x+width) + " " + (data.y+totalHeight-offset) + " " +
                "L " + (data.x+width-offset) + " " + (data.y+totalHeight) + " " +
                "L " + (data.x+offset) + " " + (data.y+totalHeight) + " " +
                "L " + data.x + " " + (data.y+totalHeight-offset) + " " +
                "L " + data.x + " " + (data.y+offset) + " " +
                "Z";
            path.attr("d", d);
            cellList.forEach(function(cells, index){
                var d;
                if (index === 0) {
                    d = "M " + (data.x+offset) + " " + data.y + " " +
                        "L " + (data.x+width-offset) + " " + data.y + " " +
                        "L " + (data.x+width) + " " + (data.y+offset) + " " +
                        "L " + (data.x+width) + " " + (data.y+height) + " " +
                        "L " + data.x + " " + (data.y+height) + " " +
                        "L " + data.x + " " + (data.y+offset) + " " +
                        "Z";
                } else if (index === cellList.length - 1) {
                    d = "M " + data.x + " " + (data.y+offsetTop) + " " +
                        "L " + (data.x+width) + " " + (data.y+offsetTop) + " " +
                        "L " + (data.x+width) + " " + (data.y+offsetTop+height-offset) + " " +
                        "L " + (data.x+width-offset) + " " + (data.y+offsetTop+height) + " " +
                        "L " + (data.x+offset) + " " + (data.y+offsetTop+height) + " " +
                        "L " + data.x + " " + (data.y+offsetTop+height-offset) + " " +
                        "Z";
                } else {
                    d = "M " + data.x + " " + (data.y+offsetTop) + " " +
                        "L " + (data.x+width) + " " + (data.y+offsetTop) + " " +
                        "L " + (data.x+width) + " " + (data.y+offsetTop+height) + " " +
                        "L " + data.x + " " + (data.y+offsetTop+height) + " " +
                        "Z";
                }
                trBorders[index].attr("d", d);
                offsetLeft = 0;
                cells.forEach(function(cell, index){
                    var textSize = cell.node.getBoundingClientRect();
                    cell.attr({
                        x: data.x + offsetLeft + paddingX + (widthList[index]-textSize.width)/2,
                        y: data.y + offsetTop + (height-textSize.height)/2 + textSize.height*3/4,
                    });
                    offsetLeft += widthList[index] + 2 * paddingX;
                });
                offsetTop += height;
            });
        },

        addExpert: function(parent, data){

            function addTitle(parent, data, offset){
                var titleGroup = parent.group().addClass("table-title-group"),
                    titleHeight = 100,
                    paddingLeft = 30,
                    paddingRight = 50,
                    overflow = 10,
                    imgSize = 43,
                    title = titleGroup.plain(data.title).addClass("table-title"),
                    titleSize = title.node.getBoundingClientRect(),
                    img = titleGroup.image("person.svg", imgSize, imgSize),
                    titleWidth = titleSize.width + imgSize + paddingRight + 2*paddingLeft,
                    d;
                d = "M " + (data.x - overflow) + " " + (data.y-overflow) + " " +
                    "L " + (data.x - overflow + titleWidth - offset) + " " + (data.y-overflow) + " " +
                    "L " + (data.x - overflow + titleWidth) + " " + (data.y-overflow + offset) + " " +
                    "L " + (data.x - overflow + titleWidth) + " " + (data.y-overflow + titleHeight) + " " +
                    "L " + (data.x - overflow) + " " + (data.y-overflow + titleHeight) + " " +
                    "Z";
                titleGroup.path(d).addClass("title-line");
                img.attr({
                    x: data.x-overflow+paddingLeft,
                    y: data.y-overflow+(titleHeight-imgSize)/2
                });
                title.attr({
                    x: data.x-overflow + 2*paddingLeft + imgSize,
                    y: data.y-overflow + (titleHeight-titleSize.height)/2 + titleSize.height*4/5
                });
                $(titleGroup.node).append(title.node);
            }

            function addArrow(parent, radius, len, className, transform){
                var group = parent.group().addClass(className);

                group.rect(len, radius*2).attr({
                    rx: radius,
                    ry: radius,
                    x: 0,
                    y: 0
                });
                group.rect(radius*2, len).attr({
                    rx: radius,
                    ry: radius,
                    x: 0,
                    y: 0
                }).transform({x: len-2*radius});
                transform.forEach(function(value){
                    group.transform(value);
                });
                return group;
            }

            function addNumber(parent, number, paddingTop, paddingLeft, borderRadius, className){
                var group = parent.group().addClass(className)
                    rect = group.rect(),
                    number = group.plain(number.toString()),
                    numberSize = number.node.getBoundingClientRect();
                // padding: 2 4;  border-radius: 3
                rect.size(numberSize.width+paddingLeft*2, numberSize.height + paddingTop*2).attr({
                    rx: borderRadius, ry: borderRadius,
                    x: 0, y: 0
                });
                number.attr({
                    x: paddingLeft,
                    y: paddingTop + numberSize.height * 4 / 5
                });
                return group;
            }

            function addTableArrow(parent, x, y){
                var group = parent.group();
                group.circle(50).attr({x: 25, y: 25}).addClass("table-circle");
                addArrow(group, 3, 25, "table-arrow", [{x: 12, y: 8}, {rotation: 135}]);
                group.transform({
                    x: x,
                    y: y
                });
                return group;
            }

            function addTr(parent, trList){
                var i, len,
                    cells, trBorders = [], cellList = [], widthList = [],
                    group = parent.group(), tr;
                for (i = 0, len = trList.length; i < len; i ++) {
                    tr = group.group().addClass("tr-text");
                    if (i % 2 === 0) {
                        trBorders.push(tr.path().addClass("even"));
                    } else {
                        trBorders.push(tr.path().addClass("odd"));
                    }
                    cells = [];
                    trList[i].forEach(function(value, index, list){
                        var cell = tr.group().addClass("table-cell"),
                            number, circle, arrow, text,
                            textSize, width;
                        if (Array.isArray(value)) {
                            // padding-top: 2, padding-left: 12, border-radius: 5
                            number = addNumber(cell, value[1], 2, 12, 5, "table-cell-number");
                            value = value[0];
                        } else if (index === list.length-1) {
                            // radius: 19
                            circle = cell.circle(2*19).addClass("table-cell-circle").attr({
                                x: 19, y: 19
                            });
                            arrow = addArrow(cell, 3, 25, "table-cell-arrow", [{rotation: 45}]);
                        }
                        text = cell.plain(value);
                        textSize = text.node.getBoundingClientRect();
                        text.attr("y", textSize.height*4/5);
                        width = textSize.width;
                        if (number) {
                            text.attr({ x: 0});
                            // padding-left: 26
                            number.transform({ x: width + 26, y: (textSize.height-number.node.getBoundingClientRect().height)/2});
                            width += number.node.getBoundingClientRect().width;
                        }
                        if (circle) {
                            // padding-left: 20
                            text.attr({ x: circle.node.getBoundingClientRect().width + 20 });
                            circle.transform({ y: (textSize.height-circle.node.getBoundingClientRect().height)/2});
                            width += circle.node.getBoundingClientRect().width;
                        }
                        if (arrow) {
                            // padding-left: 52
                            arrow.transform({ x: width + 52, y: (textSize.height-circle.node.getBoundingClientRect().height)/2-3});
                            width += arrow.node.getBoundingClientRect().width;
                        }
                        if (!widthList[index] || widthList[index] < width) {
                            widthList[index] = width;
                        }
                        cells.push(cell);
                    });
                    cellList.push(cells);
                }
                return {
                    trBorders: trBorders,
                    cellList: cellList,
                    widthList: widthList,
                };
            }

            var group = parent.group().addClass("expert-table"),
                boundaryPadding = 30,
                innerPadding = 130,
                height = 120,
                offset = 30,
                path = group.path().addClass("table-border"),
                offsetTop = 0, offsetLeft = 0,
                d, width, textTotalWidth, totalHeight,
                table;

            // create table
            table = addTr(group, data.tr);

            // calculate size and start point
            textTotalWidth = table.widthList.reduce(function(previous, current){
                return previous + current;
            }, 0);
            totalHeight = height * (data.tr.length+1);
            width = 2*(boundaryPadding + innerPadding+boundaryPadding) + textTotalWidth;
            data.x = this.width - data.paddingRight - width;

            // draw table line
            d = "M " + data.x + " " + data.y + " " +
                "L " + (data.x+width-offset) + " " + data.y + " " +
                "L " + (data.x+width) + " " + (data.y+offset) + " " +
                "L " + (data.x+width) + " " + (data.y+totalHeight-offset) + " " +
                "L " + (data.x+width-offset) + " " + (data.y+totalHeight) + " " +
                "L " + data.x + " " + (data.y+totalHeight) + " " +
                "Z";
            path.attr("d", d);

            addTitle(group, data, offset);
            // padding-top: 36, padding-right: 100
            addTableArrow(group, data.x+width-100, data.y+36);

            offsetTop += height;
            table.cellList.forEach(function(cells, index){
                var d;
                // draw table tr box
                if (index === table.cellList.length - 1) {
                    d = "M " + data.x + " " + (data.y+offsetTop) + " " +
                        "L " + (data.x+width) + " " + (data.y+offsetTop) + " " +
                        "L " + (data.x+width) + " " + (data.y+offsetTop+height-offset) + " " +
                        "L " + (data.x+width-offset) + " " + (data.y+offsetTop+height) + " " +
                        "L " + data.x + " " + (data.y+offsetTop+height) + " " +
                        "Z";
                } else {
                    d = "M " + data.x + " " + (data.y+offsetTop) + " " +
                        "L " + (data.x+width) + " " + (data.y+offsetTop) + " " +
                        "L " + (data.x+width) + " " + (data.y+offsetTop+height) + " " +
                        "L " + data.x + " " + (data.y+offsetTop+height) + " " +
                        "Z";
                }
                table.trBorders[index].attr("d", d);

                // layout cell
                offsetLeft = 0;
                cells.forEach(function(cell, index){
                    var size = cell.node.getBoundingClientRect(),
                        padding
                    if (index === 0) {
                        padding = boundaryPadding;
                    } else {
                        padding = innerPadding;
                    }
                    cell.transform({
                        x: data.x + offsetLeft + padding,
                        y: data.y + offsetTop + (height-size.height)/2
                    });
                    offsetLeft += table.widthList[index] + padding;
                });
                offsetTop += height;
            });
        },

        addEventSummary: function(parent, data){

            function drawText(parent, textValue, className, maxWidth){
                var group = parent.group(),
                    text = group.plain().addClass(className),
                    lastValue = "", value, tspanList = [],
                    textSize, height, width, d,
                    i, j, k, len;

                for (i = 0, len = textValue.length; i < len; i ++) {
                    value = lastValue + textValue[i];
                    text.text(value);
                    textSize = text.node.getBoundingClientRect();
                    if (textSize.width < maxWidth){
                        lastValue = value;
                    } else {
                        for (j = value.length-1; j >= 0; j --) {
                            if (value[j].match(/\s/)) {
                                for (k = j-1; k >= 0; k --) {
                                    if (!value[k].match(/\s/)) {
                                        break;
                                    }
                                }
                                if (k >= 0) {
                                    tspanList.push(value.slice(0, j));
                                    lastValue = value.slice(j);
                                    break;
                                } else {
                                    j = -1;
                                }
                            }
                        }
                        if (j < 0) {
                            tspanList.push(value.slice(0, value.length-1));
                            lastValue = textValue[i];
                        }
                    }
                    if (!height) {
                        height = textSize.height;
                    }
                }
                if (lastValue) {
                    tspanList.push(lastValue);
                }
                d = "";
                len = tspanList.length;
                if (len) {
                    width = len > 1 ? maxWidth : text.text(tspanList[0]).node.getBoundingClientRect().width;
                    text.remove();
                    group.text(function(add){
                        for (i = 0; i < len; i ++) {
                            add.tspan(tspanList[i]).attr({ x: 0, y: height*(i+1), dy: -10});
                        }
                    }).addClass(className);
                } else {
                    group.remove();
                    group = null;
                }
                return group;
            }

            function addTitle(parent, titleValue, icon, offset){
                var titleGroup = parent.group().addClass("table-title-group"),
                    titleHeight = 100,
                    paddingLeft = 30,
                    paddingRight = 50,
                    imgSize = 43,
                    title = titleGroup.plain(titleValue).addClass("table-title"),
                    titleSize = title.node.getBoundingClientRect(),
                    img = titleGroup.image(icon, imgSize, imgSize),
                    titleWidth = titleSize.width + imgSize + paddingRight + 2*paddingLeft,
                    d;
                d = "M 0 0 " +
                    "L " + (titleWidth - offset) + " 0 " +
                    "L " + titleWidth + " " + offset + " " +
                    "L " + titleWidth + " " + titleHeight + " " +
                    "L 0 " + titleHeight + " " +
                    "Z";
                titleGroup.path(d).addClass("title-line");
                img.attr({
                    x: paddingLeft,
                    y: (titleHeight-imgSize)/2
                });
                title.attr({
                    x: 2*paddingLeft + imgSize,
                    y: (titleHeight-titleSize.height)/2 + titleSize.height*3/4
                });
                $(titleGroup.node).append(title.node);
                console.log("test", title.bbox(), titleGroup.bbox());
                return titleGroup;
            }

            function addEventInfo(parent, type, info){
                var typeMap = {
                    "summary": ["事故描述", "type_summary.svg"],
                    "time": ["通报时间", "type_time.svg"],
                    "action": ["客户态度", "type_action.svg"]
                };
                var group = parent.group(),
                    typeInfo = typeMap[type],
                    typeGroup = group.group().addClass("event-info-type"),
                    content, img, text, textSize;

                // add event info type
                // img width 45
                img = typeGroup.image(typeInfo[1], 45, 45);
                text = typeGroup.plain(typeInfo[0]);
                textSize = text.node.getBoundingClientRect();
                text.attr({
                    x: img.node.getBoundingClientRect().width + 22,
                    y: textSize.height*4/5
                });
                img.attr({y: (textSize.height-img.node.getBoundingClientRect().height)/2});

                content = drawText(group, info, "event-info-content", 800);
                // padding-left: 60
                content.transform({x: typeGroup.node.getBoundingClientRect().width+60});
                return group;
            }

            function addRawInfo(parent, data){
                var group = parent.group().addClass("event-raw-info"),
                    path = group.path().addClass("event-info-line"),
                    type = ["summary", "time", "action"],
                    paddingY = 80,
                    paddingLeft = 106,
                    paddingRight = 160,
                    overflow = 10,
                    offset = 30,
                    offsetTop = 0,
                    width = 0, height, d,
                    i, len, title, typeInfo, typeSize;

                title = addTitle(group, "事故原始信息", "raw_info.svg", offset);
                offsetTop = title.node.getBoundingClientRect().height;
                for (i = 0, len = type.length; i < len; i ++) {
                    typeInfo = addEventInfo(group, type[i], data[type[i]]);
                    typeSize = typeInfo.node.getBoundingClientRect();
                    width = Math.max(typeSize.width, width);
                    typeInfo.transform({
                        x: paddingLeft,
                        y: offsetTop+paddingY
                    });
                    offsetTop += paddingY + typeSize.height;
                }
                height = offsetTop + paddingY - overflow;
                width += paddingLeft + paddingRight;
                d = "M 0 0 " +
                    "L " + (width-offset) + " 0 " +
                    "L " + width + " " + offset + " " +
                    "L " + width + " " + (height-offset) + " " +
                    "L " + (width-offset) + " " + height + " " +
                    "L 0 " + height + " " +
                    "Z";
                path.attr("d", d);
                title.transform({
                    x: -overflow,
                    y: -overflow
                });
                group.transform({
                    x: data.x,
                    y: data.y
                });
            }

            function getTime(time){
                var hour = parseInt(time / 3600),
                    minute = parseInt((time % 3600) / 60),
                    second = parseInt(time % 60),
                    result = "";
                result += hour > 9 ? hour : "0"+hour;
                result += ":" + (minute > 9 ? minute : "0"+minute);
                result += ":" + (second > 9 ? second : "0"+second);
                return result;
            }

            function addDuration(parent, data, obj){
                var group = parent.group().addClass("event-duration"),
                    outerPath = group.path().addClass("event-outer-line"),
                    innerPath = group.path().addClass("event-inner-line"),
                    text = group.plain(getTime(data.value)).addClass("event-duration-time"),
                    textSize = text.node.getBoundingClientRect(),
                    overflow = 10,
                    offset = 30,
                    gap = 15,
                    paddingX = 56,
                    d, height, width, gradient,
                    title = addTitle(group, "恢复时长", "event_duration.svg", offset);
                text.attr({
                    x: 0,
                    y: textSize.height*4/5
                });
                width = 2 * paddingX + textSize.width + 2 * gap;
                height = title.node.getBoundingClientRect().height + textSize.height + offset;
                d = "M 0 0 " +
                    "L " + (width-offset) + " 0 " +
                    "L " + width + " " + offset + " " +
                    "L " + width + " " + (height-offset) + " " +
                    "L " + (width-offset) + " " + height + " " +
                    "L 0 " + height + " " +
                    "Z";
                outerPath.attr("d", d);
                d = "M 0 0 " +
                    "L " + (width-offset-2*gap) + " 0 " +
                    "L " + (width-2*gap) + " " + offset + " " +
                    "L " + (width-2*gap) + " " + (height-offset-2*gap) + " " +
                    "L " + (width-offset-2*gap) + " " + (height-2*gap) + " " +
                    "L 0 " + (height-2*gap) + " " +
                    "Z";
                innerPath.attr("d", d);
                gradient = obj.svg.gradient("linear", function(stop){
                    stop.at(0, "#0179cb");
                    stop.at(0.4, "#2fa99f");
                    stop.at(1, "#84fe4f");
                });
                innerPath.fill(gradient);
                innerPath.transform({
                    x: gap,
                    y: gap
                });
                title.transform({
                    x: -overflow,
                    y: -overflow
                });
                text.transform({
                    x: gap + paddingX,
                    y: title.node.getBoundingClientRect().height
                });
                group.transform({
                    x: data.x,
                    y: data.y
                });
            }

            function addProgress(parent, data, obj){
                function drawChart(parent, value, svg){
                    var group = parent.group().addClass("progress-chart"),
                        radius = 435,
                        gap = 36,
                        arcWidth = 64,
                        maxDeg = 270,
                        arc = (maxDeg * value / 100) * Math.PI / 180,
                        i, x, y, d;

                    var text, textSize, paddingX, paddingY;

                    // var posList = [
                    //     {x: -30, y: 780},
                    //     {x: -160, y: 420},
                    //     {x: 40, y: 80},
                    //     {x: 680, y: 80},
                    //     {x: 880, y: 420},
                    //     {x: 790, y: 780},
                    // ];
                    // for (i = 0; i < 6; i ++) {
                    //     parent.plain((20*i)+"%").addClass("progress-prompt").attr(posList[i]);
                    // }
                    paddingX = 20;
                    paddingY = 10;
                    for (i = 0; i < 6; i ++) {
                        text = parent.plain((20*i)+"%").addClass("progress-prompt");
                        textSize = text.node.getBoundingClientRect();
                        text.attr({
                            x: radius - textSize.width/2,
                            y: -paddingY
                        }).transform({
                            rotation: 225 + (maxDeg/5)*i,
                            cx: radius,
                            cy: radius
                        }).transform({
                            rotation: 225 + (maxDeg/5)*i,
                            cx: radius,
                            cy: radius
                        }).transform({
                            rotation: -225-(maxDeg/5)*i,
                        }, true).transform({
                            x: i < 3 ? -textSize.width/2 - paddingX: textSize.width/2 + paddingX,
                            y: paddingY
                        }, true);
                        if (i == 2 || i == 3) {
                            text.transform({y: -paddingY-5}, true);
                        } else if (i === 4) {
                            text.transform({x: -10}, true);
                        } else if (i === 5) {
                            text.transform({x: 10}, true);
                        }
                    }

                    // outer arc
                    d = "M " + radius + " " + arcWidth + " " +
                        "A " + (radius-arcWidth) + " " + (radius-arcWidth) + " " + " 0 1 1 " + arcWidth + " " + radius;
                    group.path(d).attr({
                        stroke: "#06253b",
                        "stroke-width": 2*arcWidth,
                        fill: "#001727"
                    });

                    //inner arc
                    d = "M " + radius + " " + (arcWidth*3/2) + " " +
                        "A " + (radius-arcWidth*3/2) + " " + (radius-arcWidth*3/2) + " " + " 0 1 1 " + (arcWidth*3/2) + " " + radius;
                    group.path(d).attr({
                        stroke: "#88a3ba",
                        "stroke-width": arcWidth,
                        fill: "transparent"
                    });

                    // sector
                    x = radius + ((radius-arcWidth*2-gap)/2)*Math.sin(arc);
                    y = radius - ((radius-arcWidth*2-gap)/2)*Math.cos(arc);
                    d = "M " + radius + " " + (arcWidth*2+gap+(radius-arcWidth*2-gap)/2) + " " +
                        "A " + ((radius-arcWidth*2-gap)/2) + " " + ((radius-arcWidth*2-gap)/2) + " " + " 0 1 1 " + x + " " + y;
                    gradient = svg.gradient("linear", function(stop){
                        stop.at(0, "#28619a");
                        stop.at(0.6, "#001727");
                    }).from(0,1).to(0,0);
                    group.path(d).attr({
                        stroke: gradient,
                        "stroke-width": radius-arcWidth*2-gap,
                        fill: "transparent"
                    });

                    // progress arc
                    x = radius + (radius-arcWidth*3/2)*Math.sin(arc);
                    y = radius - (radius-arcWidth*3/2)*Math.cos(arc);
                    d = "M " + radius + " " + (arcWidth*3/2) + " " +
                        "A " + (radius-arcWidth*3/2) + " " + (radius-arcWidth*3/2) + " " + " 0 1 1 " + x + " " + y;
                    group.path(d).attr({
                        stroke: "#85ff4e",
                        "stroke-width": arcWidth,
                        fill: "transparent"
                    });

                    // point
                    d = "M " + radius + " " + (2*arcWidth+gap) + " " +
                        "L " + (radius-10) + " " + radius + " " +
                        "A 10 10 0 0 0 " + (radius + 20) + " " + radius + " " +
                        "Z";
                    group.path(d).attr({ fill: "#3acaef" }).transform({
                        rotation: maxDeg*value/100,
                        cx: radius,
                        cy: radius
                    });
                    group.transform({ rotation: 225 });
                }
                function drawShape(parent, width, height, offset){
                    var d = "M " + offset.AW + " 0 " +
                            "L " + (width-offset.AW) + " 0 " +
                            "L " + width + " " + offset.AH + " " +
                            "L " + (width-offset.BW) + " " + height + " " +
                            "L " + offset.BW + " " + height + " " +
                            "L 0 " + (height-offset.BH) + " " +
                            "Z";
                    return parent.path(d);
                }
                function drawProgress(parent, value, svg){
                    var group = parent.group().addClass("jack-test"),
                        gap = 15,
                        gradient = svg.gradient("linear", function(stop){
                            stop.at(0, "#092a42");
                            stop.at(0.4, "#092a42");
                            stop.at(1, "#005692");
                        }),
                        outerWidth = 590,
                        outerHeight = 226,
                        innerWidth = 400,
                        innerHeight = 100,
                        innerPath, textGroup, progress, text, textSize;
                    drawShape(group, outerWidth, outerHeight, {
                        AW: 125, AH: 190,
                        BW: 18, BH: 30
                    }).addClass("outer-line");
                    drawShape(group, outerWidth-2*gap, outerHeight-2*gap, {
                        AW: 113, AH: 190-gap,
                        BW: 10, BH: 30-gap,
                    }).fill(gradient).transform({ x: gap, y: gap });
                    innerPath = drawShape(group, innerWidth, innerHeight, {
                        AW: 48, AH: 76,
                        BW: 12, BH: 24
                    });

                    textGroup = group.group().addClass("progress-label");
                    $(textGroup.node).append(innerPath.node);
                    text = textGroup.plain("业务恢复进度");
                    textSize = text.node.getBoundingClientRect();
                    text.attr({
                        x: (innerWidth-textSize.width)/2,
                        y: (innerHeight-textSize.height)/2 + textSize.height*4/5
                    });
                    textGroup.transform({
                        x: (outerWidth-innerWidth)/2,
                        y: outerHeight-gap-innerHeight
                    });
                    progress = group.plain(value+"%").addClass("progress-number");
                    textSize = progress.node.getBoundingClientRect();
                    progress.attr({
                        x: (outerWidth-textSize.width)/2,
                        y: (outerHeight-innerHeight-gap*2-textSize.height)/2 + textSize.height-8
                    });
                    group.transform({
                        x: 435-outerWidth/2,
                        y: 720
                    });
                    return group;
                }
                var group = parent.group(),
                    progressChart = drawChart(group, data.value, obj.svg),
                    progressLabel = drawProgress(group, data.value, obj.svg);
                group.transform({ x: data.x, y: data.y });
            }

            var group = parent.group().addClass("event-summary");
            addRawInfo(group, data.rawInfo);
            addDuration(group, data.duration, this);
            addProgress(group, data.progress, this);
        },

        innerScale: (function(){
            var currentScale = 100;
            return function(scale){
                if (typeof scale !== "undefined") {
                    currentScale = scale;
                }
                return currentScale;
            }
        })(),

        innerTranslate: (function(){
            var translateX = 0,
                translateY = 0;
            return function(x, y){
                if (typeof x !== "undefined") {
                    translateX = x;
                }
                if (typeof y !== "undefined") {
                    translateY = y;
                }
                return {
                    x: translateX,
                    y: translateY
                };
            }
        })(),

        initScale: function(container){
            var $zoomButton = $(".zoom button"),
                scales = [1, 2, 5, 10, 15, 25, 50, 75, 100, 110, 125, 150, 175, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
                self = this;
            $zoomButton.on("click", function(event){
                var $target = $(event.target),
                    currentScale = self.innerScale(),
                    index = scales.indexOf(currentScale),
                    scale = self.getInitScale();
                if ($target.hasClass("zoom-out")) {
                    index = Math.max(0, index-1);
                } else {
                    index = Math.min(scales.length-1, index+1);
                }
                currentScale = scales[index];
                self.innerScale(currentScale);
                // $("text").each(function(index, text){
                //     var $text = $(text),
                //         fontSize;
                //     if (!$text.attr("data-font-size")) {
                //         $text.attr("data-font-size", $text.css("font-size"));
                //     }
                //     fontSize = parseFloat($text.attr("data-font-size"));
                //     $text.css("font-size", (fontSize*scale*currentScale/100)+"px")
                // });
                container.transform({
                    scaleX: scale * currentScale / 100,
                    scaleY: scale * currentScale / 100
                });
            });
        },

        initMove: function(container){
            var self = this;
            $(document).on("wheel", function(event){
                var translate = self.getInitTranslate(),
                    currentTranslate = self.innerTranslate();
                currentTranslate.x -= event.originalEvent.deltaX;
                currentTranslate.y -= event.originalEvent.deltaY;
                self.innerTranslate(currentTranslate.x, currentTranslate.y);
                container.transform({ x: translate.x + currentTranslate.x, y: translate.y + currentTranslate.y });
            });
        },

        initResize: function(container){
            var self = this;
            window.onresize = function(event){
                var scale = self.getInitScale(),
                    size = self.getClientSize(),
                    translate = self.getInitTranslate();
                container.parent().size(size.width, size.height);
                container.attr("transform", "translate(" + translate.x + "," + translate.y + ") scale(" + scale + ")");
                // reset inner state
                self.innerScale(100);
                self.innerTranslate(0, 0);
            }
        },

        getClientSize: function(){
            return {
                width: $(document.body).width(),
                height: $(document.body).height()
            };
        },

        getInitScale: function(){
            var size = this.getClientSize();
            return Math.min(size.width/this.width, size.height/this.height);
        },

        getInitTranslate: function(){
            var size = this.getClientSize(),
                scale = this.getInitScale();
            return {
                x: (size.width - (this.width * scale)) / 2,
                // y: (size.height - (this.height * scale)) / 2
                y: 0
            };
        }
    };
    window.D = D;
})(window);
