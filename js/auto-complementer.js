/**
 * Класс отвечает за авто-дополнение телефонного номера кодом страны;
 */
function AutoComplementer() {
    //Коды стран;
    var countryCodes = new Array();
    //Название текстового поля, в котором сохраняется аббревиатура текущей страны;
    var coutryFieldTitle = "country";
    //Ссылка на форму, которой принадлежит текущее текстовое поле;
    var form = new Object();
    //Текущая страна пользователя;
    var currentCountry = "";
    //Текстовое поле, к которому добавляется обработчик;
    var element = new Object();
    var reloadIndictor = true;
    //Метод отвечает за проверку текстового поля на заполение;
    var checkForEmpty = function () {
        "use strict";
        var indicator = false;
        var value = element.value.trim();
        if (!value.length) indicator = true;
        return indicator;
    };
    //Метод отвечает за добавление кода оператора в текстовое поле;
    var addCountryCode = function() {
        "use strict";
        if (checkForEmpty()) {
            if (countryCodes[currentCountry]) element.value = countryCodes[currentCountry];
            else element.value = "+";
        }
    };
    //Метод отвечает за начальную очистку текстового поля;
    var reloadPhoneField = function () {
        "use strict";
        element.value = "";
    };
    //Метод отвечает за поиск формы, к которой относится данное текстовое поле;
    var searchForm = function () {
        "use strict";
        var indicator = false;
        var additoryVariable = element;
        while (!indicator && additoryVariable.nodeName !== "BODY") {
            if (additoryVariable.nodeName === "FORM") indicator = true;
            if (!indicator)
                additoryVariable = additoryVariable.parentNode;
        }
        return {"status": indicator, "element": additoryVariable};
    };
    //Метод отвечает за определение кода страны (в зависимости от
    //гео-локации пользователя);
    var getСountryCodes = function () {
        "use strict";
        var url = "operator-code.json";
        var XHR = new XMLHttpRequest();
        XHR.onreadystatechange = function() {
            if (XHR.readyState === 4) {
                if (XHR.status !== 200)
                    console.error(XHR.status + ": " + XHR.statusText);
                else countryCodes = JSON.parse(XHR.responseText);
            }
        };
        XHR.open("GET", url);
        XHR.send();
    };
    //Инициализирующий метод;
    this.create = function (value) {
        "use strict";
        var additoryVariable = new Object();
        if (value && value.nodeName === "INPUT") {
            element = value;
            //Очистка поля "Номер телефона" перед началом работы скрипта;
            if (reloadIndictor) reloadPhoneField();
            element.addEventListener("focus", this, true);
            //Получение всех доступных кодов стран;
            getСountryCodes();
            //Поиск формы, которой принадлежит данное текстовое поле;
            additoryVariable = searchForm();
            //Если форма найдена
            if (additoryVariable.status) {
                form = additoryVariable.element;
            } else {
                element.removeEventListener("focus", this, false);
                console.error("Форма не найдена;");
            }
        }
    };
    //Обработчик;
    this.handleEvent = function (event) {
        "use strict";
        event = event || window.event;
        if (event.type === "focus") {
            //Отложеное выполнение обработки события (гарантированная асинхронность);
            setTimeout(function() { 
                if (form.elements[coutryFieldTitle]) currentCountry = form.elements[coutryFieldTitle].value;
                addCountryCode();
            }.bind(this), 0);
        }
    };
}