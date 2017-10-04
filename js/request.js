/**
 * Класс отвечает за AJAX-отправку сообщений на сервер
 */
function Request() {
    var spinnerObject = new Object();
    var requestCallerClassName = "request-caller";
    var handlerAddress = "http://fazarosta.com/add/";
    var validationObject = new Object();
    this.button = new Object();
    //Название индикатора-заглушки, который препятствует отправке формы;
    var indicator = "data-indicator";
    this.getIndicator = function() {
        return indicator;
    };
    this.setIndicator = function(value) {
        indicator = value;
    };
    this.clearTextFields = function() {
        "use strict";
        var counter = 0;
        var additoryObject = new Object();
        for (counter = 0; counter < this.container.elements.length; counter++) {
            additoryObject = this.container.elements[counter];
            switch (additoryObject.type) {
                case "submit":
                case "hidden":
                case "radio":
                case "checkbox":
                    break;
                default:
                    if (additoryObject.value.length) additoryObject.value = "";
                    break;
            }
        }
    }.bind(this);
    //Метод инициализирует возможность AJAX-отправки данных;
    this.appendHandler = function(element) {
        "use strict";
        var additoryObject = new Object();
        if (element && testClassName(element, requestCallerClassName)) {
            additoryObject = element;
            //Поиск формы, к которой относится кнопка;
            while (additoryObject.nodeName !== "BODY" && additoryObject.nodeName !== "FORM")
                additoryObject = additoryObject.parentNode;
            //Если была найдена форма;
            if (additoryObject.nodeName === "FORM") {
                this.container = additoryObject;
                this.button = element;
                this.button.addEventListener("click", this, false);
                try {
                    validationObject = new Validation();
                    validationObject.setForm(this.container);
                } catch (error) {
                    if (error instanceof  ReferenceError) {
                        this.button.removeEventListener("click", this, false);
                        console.error("Не подключен скрипт 'validation.js';");
                    }
                }
            }
        } else console.error("DOM-элемент должен иметь класс '" + requestCallerClassName + "';");
    };
    this.handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        var XHR = new XMLHttpRequest();
        var additoryObject = new Object();
        //Объект, который используется для сохранения в localStorage введённых пользователем данных;
        var localStorageObject = new Object();
        var data = new Object();
        var requestBody = "";
        var counter = 0;
        XHR.onreadystatechange = function() {
            if (XHR.readyState === 4) {
                //Заполнение localStorage на основании имён и значений текстовых полей;
                for (counter = 0; counter < this.container.elements.length; counter++) {
                    additoryObject = this.container.elements[counter];
                    if (additoryObject.type !== "submit") {
                        switch (additoryObject.type) {
                            case "text":
                            case "email":
                            case "tel":
                                localStorageObject[additoryObject.name] = additoryObject.value;
                                break;
                            case "radio":
                                if (additoryObject.checked) {
                                    localStorageObject[additoryObject.name] = additoryObject.value;
                                }
                                break;
                            default: break;
                        }
                        if (additoryObject.nodeName === "TEXTAREA") {
                            localStorageObject[additoryObject.name] = additoryObject.value;
                        }
                    }
                }
                localStorage.setItem("fr-user", JSON.stringify(
                    localStorageObject
                ));
                //Удаление индикатора-заглушки;
                document.body.removeAttribute(indicator);
                //Удаление индикатора отправки;
                spinnerObject.removeSpinner();
                //TODO: Найти и обработать ошибку, которая возникает при перегрузке сервера (код ошибки);
            }
        }.bind(this);
        if (event.type === "click") {
            if (!document.body.hasAttribute(indicator) && validationObject.validateForm()) {
                //Установка индикатора-заглушки;
                document.body.setAttribute(indicator, true);
                //Добавление индикатора отправки;
                spinnerObject = new Spinner();
                spinnerObject.setContainer(document.body);
                spinnerObject.appendSpinner();
                //Если используется POST-запросы (или на обработчик необходимо отправлять файлы); 
                if (this.container.getAttribute("method") === "POST") {
                    data = new FormData(this.container);
                    data.append("ajax_indicator", true);
                    XHR.open(this.container.getAttribute("method"), handlerAddress, true);
                    XHR.send(data);
                //Если используется GET-запросы;
                } else {
                    //Формирование тела запроса;
                    for (counter = 0; counter < this.container.elements.length; counter++) {
                        additoryObject = this.container.elements[counter];
                        if (additoryObject.type !== "submit") {
                            switch (additoryObject.type) {
                                case "text":
                                case "email":
                                case "tel":
                                case "hidden":
                                    requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                                    if (counter < this.container.elements.length - 2) requestBody = requestBody + "&";
                                    break;
                                case "radio":
                                    if (additoryObject.checked) {
                                        requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                                        if (counter < this.container.elements.length - 2) requestBody = requestBody + "&";
                                    }
                                    break;
                                default: break;
                            }
                            if (additoryObject.nodeName === "TEXTAREA") {
                                requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                                if (counter < this.container.elements.length - 2) requestBody = requestBody + "&";
                            }
                        }
                    }
                    XHR.open(this.container.getAttribute("method"), handlerAddress + "?" + requestBody + "&ajax_indicator=true", true);
                    XHR.send();
                }
            }
        }
    };
}