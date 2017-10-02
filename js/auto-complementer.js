function AutoComplementer() {
    //Текстовое поле, к которому добавляется обработчик;
    var element = new Object();
    //Ссылка на текстовое поле с информацией о стране;
    var geoField = new Object();
    //Ссылка на текстовое поле с информацией о городе;
    var cityField = new Object();
    var geoFieldTitle = "geo";
    var cityFieldTitle = "city";
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
    var addPhoneNumber = function(country) {
        "use strict";
        if (checkForEmpty()) {
            getOperatorCode(country);
        }
    };
    //Метод отвечает за начальную очистку текстового поля;
    var reloadPhoneField = function () {
        "use strict";
        element.value = "";
    };
    //Метод отвечает за поиск формы, к которой относится данное текстовое поле;
    var searchForm = function (element) {
        "use strict";
        var indicator = false;
        while (!indicator && element.nodeName !== "BODY") {
            if (element.nodeName === "FORM") indicator = true;
            if (!indicator)
                element = element.parentNode;
        }
        return {"status": indicator, "element": element};
    };
    //Метод отвечает за определение кода мобильного оператора (в зависимости от
    //страны пользователя);
    var getOperatorCode = function (country) {
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
                        if (country === key) {
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
        var form = new Object();
        var result = new Object();
        if (value && value.nodeName === "INPUT") {
            element = value;
            //Инициализация скрытых текстовых полей;
            result = searchForm(element);
            if (result.status) {
                form = result.element;
                geoField = form[geoFieldTitle];
                cityField = form[cityFieldTitle];
            }
            //Очистка поля "Номер телефона" перед началом работы скрипта;
            if (reloadIndictor) reloadPhoneField();
            element.addEventListener("click", this, false);
        }
    };
    //Обработчик;
    this.handleEvent = function (event) {
        "use strict";
        event = event || window.event;
        if (event.type === "click") {
            $.get("http://api.2ip.ua/geo.json?key=142dafee11e31629", function (response) {
                var country = response.country_code;
                var city_rus = response.city_rus;
                var country_rus = response.country_rus;
                geoField.value = country_rus;
                cityField.value = city_rus;
                addPhoneNumber(country);
            }, "json");
        }
    };
}