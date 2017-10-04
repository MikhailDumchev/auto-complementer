function AutoComplementer() {
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
    var addPhoneNumber = function() {
        "use strict";
        if (checkForEmpty()) {
            getOperatorCode();
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
    //Метод отвечает за определение кода мобильного оператора (в зависимости от
    //страны пользователя);
    var getOperatorCode = function () {
        "use strict";
        var url = "operator-code.json";
        var XHR = new XMLHttpRequest();
        XHR.onreadystatechange = function() {
            var response = new Array();
            if (XHR.readyState === 4) {
                if (XHR.status !== 200) {
                    console.error(XHR.status + ": " + XHR.statusText);
                } else {
                    response = JSON.parse(XHR.responseText);
                    for (var key in response) {
                        if (currentCountry === key) {
                            element.value = response[key];
                            return true;
                        }
                    }
                    element.value = "+";
                }
                return false;
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
            element.addEventListener("focus", this, false);
            //Поиск формы, которой принадлежит данное текстовое поле;
            additoryVariable = searchForm();
            //Если форма найдена
            if (additoryVariable.status) {
                form = additoryVariable.element;
                if (form.elements[coutryFieldTitle]) currentCountry = form.elements[coutryFieldTitle].value;
            } else console.error("Форма не найдена;");
        }
    };
    //Обработчик;
    this.handleEvent = function (event) {
        "use strict";
        event = event || window.event;
        if (event.type === "focus") {
            addPhoneNumber();
        }
    };
}