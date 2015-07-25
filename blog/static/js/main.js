// main.js  
if (typeof M == 'undefined'){
    M = {};
}

// ***** DOM manipulation *****
M.dom = {
    get: function(seletor){

    }
};

// ***** common tools *******

/* 事件相关接口 */
M.eventUtil = {
    // 只支持DOM2 级的捕获事件，
    // 不支持多个DOM0 级事件
    addHandler: function(element, eventType, eventHandler, isCapturePhase){
        isCapturePhase = isCapturePhase ? true : false;
        if (element.addEventListener){  // DOM2 级事件
            element.addEventListener(eventType, eventHandler, isCapturePhase);
        }else if (element.attachEvent){ // IE 事件
            element.attachEvent('on'+eventType, eventHandler);
        }else{  // DOM0 级事件
            element['on'+eventType] = eventHandler;
        }
    },
    removeHandler: function(element, eventType, eventHandler, isCapturePhase){
        isCapturePhase = isCapturePhase ? true : false;
        if (element.removeEventListener){  // DOM2 级事件
            element.removeEventListener(eventType, eventHandler, isCapturePhase);
        }else if (element.detachEvent){ // IE 事件
            element.detachEvent('on'+eventType, eventHandler);
        }else{  // DOM0 级事件
            element['on'+eventType] = null;
        }
    },
    getEvent: function(event){
        return event || window.event;
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    },
    preventDefault: function(event){
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue = false;
        }
    },
    stopPropagation: function(event){
        if (event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    },
    stopAll: function(event){
        this.preventDefault(event);
        this.stopPropagation(event);
    }
};

/* cookie 相关接口 */
M.cookieUtil = {
    get: function(name){
        var cookie = document.cookie, 
            cookieName = encodeURIComponent(name)+"=",
            cookieValue = '',
            cookieStart = cookie.indexOf(cookieName),
            cookieEnd;
        if (cookieStart > -1){
            cookieEnd = cookie.indexOf(';', cookieStart);
            if (cookieEnd == -1){
                cookieEnd = cookie.length;
            }
            cookieValue = decodeURIComponent(cookie.substring(cookieStart+cookieName.length, cookieEnd));
        }
        return cookieValue;
    },
    getAll: function(){
        var cookies = document.cookie.split(';'),
            parts = null,
            results = {},
            cookiesLen = cookies.length,
            i;
        for (i = 0; i < cookiesLen; i ++){
            parts = cookies[i].trim().split('=');
            if (parts.length == 2){
                results[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            }
        }
        return results;
    },
    getSubCookie: function(name, subName){
        var subCookies = this.getAllSubCookie(name);
        return subCookies[subName] || null;
    },
    getAllSubCookie: function(name){
        var cookieValue = this.get(name),
            subCookies = cookieValue.split('&'),
            results = {},
            parts = null,
            subCookiesLen = subCookies.length,
            i;
        for (i = 0; i < subCookieslen; i ++) {
            parts = subCookies[i].split('=');
            if (parts.length == 2){
                results[parts[0]] = parts[1];
            }
        }
        return results;
    },
    set: function(name, value, domain, path, expires, secure){
        var cookieText = encodeURIComponent(name)+"="+encodeURIComponent(value);
        if (domain){
            cookieText += "; domain="+domain;
        }
        if (path){
            cookieText += "; path="+path;
        }
        if (expires){
            cookieText += "; expires="+ expires.toGMTString();
        }
        if (secure){
            cookieText += "; secure";
        }
        document.cookie = cookieText;
    },
    setAllSubCookie: function(name, subCookie, domain, path, expires, secure){
        var subName = '',
            subCookieParts = [],
            cookieValue='';
        for (subName in subCookie){
            if (subName.length > 0 && subCookie.hasOwnProperty(subName)){
                subCookieParts.push(subName+"="+subCookie[subName]);
            }
        }
        cookieValue = subCookieParts.join('&');
        this.set(name, cookieValue, domain, path, expires, secure);
    },
    setSubCookie: function(name, newSubCookie, domain, path, expires, secure){
        var subCookie = this.getAllSubCookie(name),
            subName = '',
            subCookieParts = [],
            cookieValue='';
        // 更新或创建新的子cookie
        for (subName in newSubCookie){
            if (subName.length > 0 && newSubCookie.hasOwnProperty(subName)){
                subCookie[subName] = newSubCookie[subName];
            }
        }
        this.setAllSubCookie(name, subCookie, domain, path, expires, secure);
    },
    unset: function(name, domain, path, secure){
        this.set(name, '', domain, path, new Date(0), secure);
    },
    unsetSubCookie: function(name, subNames, domain, path, expires, secure){
        var subCookies = this.getAllSubCookie(name),
            subNameLen = subNames.length,
            i;
        for (i = 0; i < subNameLen; i ++){
            if (subNames[i] in subCookies){
                delete subCookies[subNames[i]];
            }
        }
        this.setAllSubCookie(name, subCookies, domain, path, expires, secure);
    }
};

M.format = {
    /**
     * Returns the formatinng string 
     * @param {string} format Format control, only support '%s'
     * @param {...string} str Options arguments
     * @return {string} Formatting string
     * @throws {TypeError} If the number of format controls isn't equal to the strs's length
     */
    printf: function(format, str){
        var nextIndex = 0,
            res = "",
            argsLen = arguments.length; 
        if (arguments.length > 1){
            nextIndex = 1
        }
        for (var i=0, len=format.length; i < len; i ++){
            if (format.charAt(i) != '%'){
                res += format.charAt(i);
            }else{
                if (i + 1 < len){
                    switch(format.charAt(i+1)){
                        case 's':
                            if (nextIndex && nextIndex < argsLen){
                                res += arguments[nextIndex ++].toString();
                                i ++;
                            }else{
                                throw new TypeError("no enough arguments for format string");
                            }
                            break;
                        case '%':
                            res += '%';
                            i ++;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        if (argsLen > 1 && nextIndex < argsLen){
            throw new TypeError("not all arguments converted during string formating");
        }
        return res
    }
};

// URL实用函数
M.urlUtility = {
    // 解析查询参数
    getQueryStringArgs: function(){
        var search = location.search,
            queryString = search.length > 1 ? search.substring(1) : '',
            queryAarry = queryString.length ? queryString.split('&') : [],
            argLen = queryAarry.length,
            args = {},
            key, value, i, query;
        for (i = 0; i < argLen; i ++){
            query = queryAarry[i].split('=');
            key = decodeURIComponent(query[0]);
            value = decodeURIComponent(query[1]);
            if (key.length){
                args[key] = value;
            }
        }
        return args;
    }
}

// ***** common module *******

/* 关闭或者刷新页面提示 */
M.page = {
    showMsgBeforeLeave: function(msg){
        M.eventUtil.addHandler(window, 'beforeunload', function(event){
            event = M.eventUtil.getEvent(event);
            if (event){
                // 兼容IE 8和其他老板本浏览器
                event.returnValue = msg;
            }
            return msg;
        }); 
    }
};

