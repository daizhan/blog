(function() {
    function Popup() {
        var timer = null;

        function createPopup(msg) {
            var popup = document.createElement("div"),
                container = document.createElement("div"),
                wrapper = document.createElement("div"),
                p = document.createElement("p");
            popup.className = "popup";
            container.className = "popup-container";
            wrapper.className = "popup-wrapper";
            p.innerHTML = msg;
            wrapper.appendChild(p);
            container.appendChild(wrapper);
            popup.appendChild(container);
            return popup;
        }

        function insertPopup(popup) {
            $(".popup").remove();
            document.body.appendChild(popup);
        }

        function bindEvent() {
            var $popup = $(".popup");
            $popup.click(function() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                    $popup.remove();
                }
            });
        }

        function showPopup(callback) {
            setTimeout(function() {
                $(".popup").addClass("show");
                callback();
            }, 0);
        }

        function open(msg, time) {
            if (typeof time === "undefined") {
                time = 3000;
            }
            var popup = createPopup(msg);
            insertPopup(popup);
            showPopup(function() {
                timer = setTimeout(function() {
                    $(".popup").remove();
                    timer = null;
                }, time);
                bindEvent();
            });
        }
        return open;
    }

    // 公共方法
    function createEmptyQuestionArea() {
        var $target = $(".common-question"),
            div = document.createElement("div"),
            img = document.createElement("img"),
            p = document.createElement("p");
        img.src = "/static/repository/static_page/interview/img/empty.png";
        p.innerHTML = "从右侧点选或拖动您需要在主页呈现的常见问题，<br/>该标签内的医生会自动匹配。（最多可添加8个）";
        div.appendChild(img);
        div.appendChild(p);
        div.className = "empty";
        $target.append(div);
    }

    function createExistQuestionArea(questions) {
        var $target = $(".common-question"),
            ul, count,
            i, len;
        if (!$target.find("ul").length) {
            ul = document.createElement("ul");
            $target.append(ul);
        }
        ul = $target.find("ul");
        count = ul.find(".label").length;
        for (i = 0, len = questions.length; i < len; i++) {
            if (!count) {
                ul.append(createQuestionDom(questions[i].key, questions[i].value));
            } else {
                ul.find("li").eq(count + i).replaceWith(createQuestionDom(questions[i].key, questions[i].value));
            }
        }
        if (!count) {
            for (; i < MAX_COUNT; i++) {
                ul.append(createPlaceholder());
            }
        }
    }

    function createQuestionDom(key, value, draggable) {
        var li = document.createElement("li"),
            p = document.createElement("p"),
            button = document.createElement("button");
        p.innerHTML = value;
        p.className = "label";
        button.setAttribute("data-key", key);
        button.setAttribute("data-value", value);
        p.appendChild(button);
        li.appendChild(p);
        if (draggable) {
            li.setAttribute("draggable", "true");
        }
        return li;
    }

    function createPlaceholder() {
        var li = document.createElement("li");
        li.className = "placeholder";
        return li;
    }

    function saveQuestion(questions) {
        var $target = $(".js-add-question.current"),
            wrapper = document.createElement("div"),
            h5 = document.createElement("h5"),
            ul = document.createElement("ul"),
            li,
            i, len;
        for (i = 0, len = questions.length; i < len; i++) {
            li = document.createElement("li");
            li.innerHTML = questions[i].value;
            ul.appendChild(li);
        }
        h5.innerHTML = "常见问题";
        wrapper.appendChild(h5);
        wrapper.appendChild(ul);
        wrapper.className = "wrapper";
        $target.removeClass("empty").addClass("has-content");
        $target.find(".wrapper").replaceWith(wrapper);
    }

    function updateHeight() {
        var $content = $(".content"),
            $target = $(".management .empty"),
            totalHeight = $content.height(),
            leftHeight = totalHeight - ($target.offset().top - $content.offset().top);
        leftHeight -= $target.length * 2 * parseInt($target.css("padding-top"));
        $target.css("line-height", leftHeight / $target.length + "px");
    }

    function afterSave() {
        $(".edit-area").addClass("hidden");
    }

    function addQuestion(key, value) {
        var questions = [{
            key: key,
            value: value
        }];
        if ($(".common-question .label").length >= MAX_COUNT) {
            popup("展示标签已满" + MAX_COUNT + "个");
            return;
        }
        if (!$(".common-question li").length) {
            $(".common-question").find(".empty").remove();
        }
        createExistQuestionArea(questions);
    }

    function checkQuestion(key) {
        var i, len;
        for (i = 0, len = myQuestions.length; i < len; i++) {
            if (myQuestions[i].key == key) {
                return i
            }
        }
        return -1;
    }

    function updateMyQuestion(key, value, isAdd) {
        var index = checkQuestion(key);
        if (isAdd && index == -1) {
            myQuestions.push({
                key: key,
                value: value
            });
        } else if (!isAdd && index != -1) {
            myQuestions.splice(index, 1);
        }
    }


    // events
    function onClickEditArea() {
        var selector = ".js-add-question";
        $(selector).click(function() {
            var $this = $(this);
            if ($this.hasClass("current") && !$this.hasClass("has-content")) {
                return;
            }
            $(selector).removeClass("current");
            $this.addClass("current");
            $(".edit-area").removeClass("hidden");
        });
    }

    function onRemoveQuestion() {
        $("body").on("click", ".common-question li", function() {
            var $this = $(this),
                $btn = $this.find("button"),
                key = $btn.attr("data-key"),
                value = $btn.attr("data-value"),
                $target = $(".common-question"),
                count;
            if ($this.hasClass("placeholder")) {
                return;
            }
            count = $this.siblings(".placeholder").length;
            if (count + 1 >= MAX_COUNT) {
                $this.parent().remove();
                createEmptyQuestionArea();
            } else {
                $this.remove();
                $(".common-question ul").append(createPlaceholder());
            }
            $target.find(".question-num").html(MAX_COUNT - count - 1);
            updateMyQuestion(key, value, false);
        });
    }

    function onClickLabel() {
        $("body").on("click", ".label-list li", function() {
            var $btn = $(this).find("button"),
                key = $btn.attr("data-key"),
                value = $btn.attr("data-value"),
                i, len;
            if (checkQuestion(key) != -1) {
                popup("该标签已存在");
                return;
            }
            addQuestion(key, value);
            updateMyQuestion(key, value, true);
            $(".common-question").find(".question-num").html(myQuestions.length);
        });
    }

    function onSave() {
        $("body").on("click", ".save", function() {
            if (myQuestions.length) {
                saveQuestion(myQuestions);
                updateHeight();
            } else {
                $(".js-add-question").removeClass("current");
            }
            afterSave();
        });
    }

    function onDragQuestion() {
        var $target = $(".label-list li"),
            i, len;
        for (i = 0, len = $target.length; i < len; i++) {
            $target[i].addEventListener("dragstart", function(event) {
                var $btn = $(event.target).find("button"),
                    key = $btn.attr("data-key"),
                    value = $btn.attr("data-value");
                event.dataTransfer.setData("Text", JSON.stringify({ key: key, value: value }));
            });
        }
    }

    function onDropQuestion() {
        $(".common-question")[0].addEventListener("drop", function(event) {
            event.preventDefault();
            var data = event.dataTransfer.getData("Text");
            if (data) {
                data = JSON.parse(data);
                if (checkQuestion(data.key) != -1) {
                    popup("该标签已存在");
                    return;
                }
                addQuestion(data.key, data.value);
                updateMyQuestion(data.key, data.value, true);
                $(".common-question").find(".question-num").html(myQuestions.length);
            }
        }, false);
        $(".common-question")[0].addEventListener("dragover", function(event) {
            event.preventDefault();
        }, false);
    }

    function bindEvent() {
        onClickEditArea();
        onClickLabel();
        onRemoveQuestion();
        onSave();
        onDragQuestion();
        onDropQuestion();
    }

    // init
    function initLabels() {
        var defaultLabel = {
            1: "感冒",
            2: "慢性鼻炎",
            3: "扁桃体发炎",
            4: "智齿",
            5: "近视",
            6: "发烧",
            7: "头晕",
            8: "耳鸣",
            9: "儿童科基因高热发烧",
            10: "中老年疾病",
        };
        var key, dom,
            ul = document.createElement("ul"),
            $target = $(".label-list"),
            count = 0;
        for (key in defaultLabel) {
            if (defaultLabel.hasOwnProperty(key)) {
                count++;
                ul.appendChild(createQuestionDom(key, defaultLabel[key], true));
            }
        }
        $target.append(ul);
        $target.find(".label-num").html(count);
    }

    function initQuestion() {
        var count = 0,
            $target = $(".common-question"),
            ul = document.createElement("ul"),
            i, len;
        $target.find(".question-num").html(myQuestions.length || 0);
        $target.find(".question-max").html(MAX_COUNT);
        if (!myQuestions.length) {
            createEmptyQuestionArea();
        } else {
            createExistQuestionArea(myQuestions);
        }
    }

    function init() {
        initQuestion();
        initLabels();

        bindEvent();
    }

    var popup = Popup(),
        myQuestions = [];
    var MAX_COUNT = 8;
    init();

})();
