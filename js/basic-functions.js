function clearStyleAttribute(Element, properties) {
    "use strict";
    var counter = 0;
    var pattern = /.?/;
    if (Element.hasAttribute("style")) {
        for (counter = 0; counter < properties.length; counter++) {
            switch (properties[counter]) {
                case "position":
                    pattern = /\s*position:\s*[a-z\-]+;\s*/ig;
                    break;
                case "width":
                case "height":
                case "top":
                case "left":
                    pattern = "\\s*" + properties[counter] + ":\\s*\\-{0,1}[0-9]+(\\.[0-9]+)*(px|%);\\s*";
                    break;
                case "opacity":
                    pattern = /\s*opacity:\s*[0-9]+(\.[0-9]+)*;\s*/ig;
                    break;
                case "display":
                    pattern = /\s*display:\s*(block|none);\s*/ig;
                    break;
                case "margin":
                    pattern = /\s*margin(-top|-left|-right|-bottom):\s*(-)?[0-9]+(\.[0-9]+)*(px|%);\s*/ig;
                    break;
                case "z-index":
                    pattern = /\s*z-index:\s*[0-9]+;\s*/ig;
                    break;
                default:
                    break;
            }
            if (new RegExp(pattern).test(Element.getAttribute("style")))
                Element.setAttribute("style", Element.getAttribute("style").replace(new RegExp(pattern), ""));
        }
        if (!Element.getAttribute("style").length) Element.removeAttribute("style");
    }
}
function addClassName(Element, className) {
    "use strict";
    if (Element.className.length) Element.className = Element.className + " ";
    if (!new RegExp(className).test(Element.className)) Element.className = Element.className + className;
}
function clearClassName(Element, className) {
    "use strict";
    Element.className = Element.className.replace(new RegExp(className), "");
    Element.className = Element.className.replace(/\s+$/ig, "");
    if (!Element.className.length) Element.removeAttribute("class");
}
function testClassName(Element, className) {
    "use strict";
    if (new RegExp("\\b" + className + "\\b(?!-)").test(Element.className)) return true;
    else return false;
}
/**
* Функция используется для определения позиции DOM-элемента относительно начала страницы;
* @param {HTMLElement} Element DOM-элемент, для которого необходимо определить вертикальный и горизонтальный отступ
* относительно начала документа;
* @author Илья Кантор;
*/
function calculateOffset(Element) {
    "use strict";
    //Получение ограничивающего прямоугольника элемента;
    var Rectangle = Element.getBoundingClientRect();
    //В переменных содержатся ссылки на DOM-элементы "body" и "html";
    var Body = document.body;
    var HTML = document.documentElement;
    //Определение текущей горизонтальной и вертикальной прокрутки документа;
    var scrollTop = window.pageYOffset || HTML.scrollTop || Body.scrollTop;
    var scrollLeft = window.pageXOffset || HTML.scrollLeft || Body.scrollLeft;
    //Получение сдвига DOM-элементов "body" и "html" относительно окна браузера;
    var clientTop = HTML.clientTop || Body.clientTop || 0;
    var clientLeft = HTML.clientLeft || Body.clientLeft || 0;
    //Получение координат элемента относительно начала страницы;
    var top  = Rectangle.top +  scrollTop - clientTop;
    var left = Rectangle.left + scrollLeft - clientLeft;
    return { "top": Math.round(top), "left": Math.round(left) };
}