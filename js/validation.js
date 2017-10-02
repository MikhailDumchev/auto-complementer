function Validation() {
    var errorClassName = "error";
    var requireAttributeTitle = "data-required";
    var validationTypeAttributeTitle = "data-type";
    var emptyTextFieldMessage = "Обязательное поле.";
    var wrongDataMessage = "Неправильно.";
    var additoryContainerClassName = "additory-container";
    var form = new Object();
    this.setForm = function(value) {
        "use strict";
        var counter = 0;
        if (value.nodeName === "FORM") {
            form = value;
            if (window.getComputedStyle(form, "").position !== "relative")
                form.style.position = "relative";
            //Добавление обработчика для сокрытия сообщений об ошибках;
            form.addEventListener("click", this, false);
            for (counter = 0; counter < form.elements.length; counter++)
                if (form.elements[counter].type !== "submit" && form.elements[counter].type !== "button" && form.elements[counter].type !== "hidden")
                    form.elements[counter].addEventListener("focus", this, false);
        }
        else console.error("Вы указали некорректный DOM-элемент;");
    };
    this.getForm = function() {
        "use strict";
        return form;
    };
    this.removeClickHandler = function() {
        "use strict";
        form.removeEventListener("click", this, false);
    };
    this.appendSubmitHandler = function() {
        "use strict";
        form.addEventListener("submit", this, false);
    };
    this.validateForm = function() {
        "use strict";
        var counter = 0;
        var mainIdicator = true;
        var textField = new Object();
        for (counter = 0; counter < form.elements.length; counter++) {
            if (form.elements.type !== "submit" && form.elements.type !== "button" && form.elements.type !== "hidden") {
                textField = form.elements[counter];
                //Если поле имеет атрибут, который указывает на обязательность заполнения
                //этого поля;
                if (textField.hasAttribute(requireAttributeTitle) && !testClassName(textField, errorClassName)) {
                    if (!isEmpty(textField) && mainIdicator) mainIdicator = false;
                }
                if (textField.hasAttribute(validationTypeAttributeTitle) && !testClassName(textField, errorClassName)) {
                    if (!checkTextField(textField) && mainIdicator) mainIdicator = false;
                }
            }
        }
        if (form.getElementsByClassName(errorClassName).length && mainIdicator) mainIdicator = false;
        return mainIdicator;
    };
    var checkPresence = function(textField) {
        "use strict";
        var additoryObject = textField;
        var indicator = true;
        while (additoryObject.nodeName !== "BODY" && indicator) {
            additoryObject = additoryObject.parentNode;
            if (window.getComputedStyle(additoryObject, "").display === "none") indicator = false;
        }
        return indicator;
    };
    var checkTextField = function(textField) {
        "use strict";
        var pattern = /.?/ig;
        var indicator = true;
        switch(textField.getAttribute(validationTypeAttributeTitle)) {
            case "1":
                //Ввод буквенных символов в любом регистре;
                pattern = /^[a-zа-яёїъі]{4,}$/ig;
                break;
            case "2":
                //Ввод телефонного номера (украинские номера);
                pattern = /^(\+{0,1}38\s{0,1})*(\({0,1}[0-9]{3}\){0,1}\s{0,1})*[0-9]{3}\-{0,1}[0-9]{2}\-{0,1}[0-9]{2}$/ig;
                break;
            case "3":
                //Ввод email-адреса;
                pattern = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/ig;
                break;
            default: break;
        }
        if (textField.value.length && !pattern.test(textField.value)) {
            appendMessage(textField, wrongDataMessage);
            indicator = false;
        }
        return indicator;
    }.bind(this);
    var isEmpty = function(textField) {
        "use strict";
        var indicator = true;
        if (!textField.value.length && checkPresence(textField)) {
            appendMessage(textField, emptyTextFieldMessage);
            indicator = false;
        }
        return indicator;
    }.bind(this);
    var appendMessage = function(textField, textMessage) {
        "use strict";
        var verticalOffset = 0;
        var horizontalOffset = 0;
        var indicator = true;
        var additoryObject = textField;
        var message = document.createElement("span");
        message.className = errorClassName + "-message";
        message.innerHTML = textMessage;
        if (textField.name.length) {
            message.setAttribute("data-reference", textField.name);
        } else if (textField.id.length) {
            message.setAttribute("data-reference", textField.id);
        }
        if (textField.getAttribute("placeholder")) {
            textField.setAttribute("data-placeholder", textField.getAttribute("placeholder"));
            textField.removeAttribute("placeholder");
        }
        textField.parentNode.appendChild(message);
        //Вычисление отступа DOM-элемента, ссылка на который была передана в функцию, относительно формы или
        //DOM-элемента с классом addadditoryContainerClassName;
        if (additoryObject.parentNode !== form && !testClassName(additoryObject.parentNode, additoryContainerClassName)) {
            while (indicator && additoryObject.parentNode !== form && !testClassName(additoryObject, additoryContainerClassName)) {
                additoryObject = additoryObject.parentNode;
                horizontalOffset = horizontalOffset + additoryObject.offsetLeft;
                verticalOffset = verticalOffset + additoryObject.offsetTop;
                if (additoryObject.nodeName === "BODY") indicator = false;
            }
        } else {
            horizontalOffset = additoryObject.offsetLeft;
            verticalOffset = additoryObject.offsetTop;
        }
        if (indicator) {
            //Очистка текущего содержимого поля;
            textField.setAttribute("data-value", textField.value);
            textField.value = "";
            message.style.left = (horizontalOffset + 10) + "px";
            message.style.top = (verticalOffset + textField.offsetHeight / 2 - message.offsetHeight / 2) + "px";
            addClassName(textField, errorClassName);
        } else console.error("К сожалению, форма не была найдена;");
    }.bind(this);
    var hideMessage = function(textField, message) {
        "use strict";
        clearClassName(textField, errorClassName);
        message.parentNode.removeChild(message);
        textField.focus();
        //Восстановление значения в поле;
        if (textField.hasAttribute("data-value")) {
            textField.value = textField.getAttribute("data-value");
            textField.removeAttribute("data-value");
        }
        if (textField.hasAttribute("data-placeholder")) {
            textField.setAttribute("placeholder", textField.getAttribute("data-placeholder"));
            textField.removeAttribute("data-placeholder");
        }
    }.bind(this);
    var searchMessage = function(textFieldTitle) {
        "use strict";
        var counter = 0;
        var indicator = false;
        var element = new Object();
        while (!indicator && counter < form.getElementsByClassName(errorClassName + "-message").length) {
            element = form.getElementsByClassName(errorClassName + "-message")[counter];
            if (element.getAttribute("data-reference") === textFieldTitle) indicator = true;
            counter++;
        }
        return {"status": indicator, "element": element};
    }.bind(this);
    this.handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        //В переменной содержится ссылка на DOM-элемент, на который нажал пользователь;
        var element = event.target;
        //Дополнительная переменная;
        var additoryObject = new Object();
        //В переменной содержится ссылка на поле;
        var textField = new Object();
        //В переменной содержится ссылка на DOM-элемент, который выполняет роль
        //сообщения об ошибке;
        var message = new Object();
        //Индикатор указывает на то, нажал ли пользователь на поле, для которого
        //выводится сообщение об ошибке, или на сообщение об ошибке;
        var indicator = false;
        var textFieldTitle = "";
        if (event.type === "submit") {
        }
        if (event.type === "focus") {
            if (testClassName(element, errorClassName)) {
                textField = element;
                //Определение названия или идентификатора поля;
                if (textField.name.length) textFieldTitle = textField.name;
                else textFieldTitle = textField.id;
                //Поиск сообщения об ошибке;
                additoryObject = searchMessage(textFieldTitle);
                if (additoryObject.status) message = additoryObject.element;
                else console.error("При поиске сообщения об ошибке произошёл сбой в работе скрипта;");
                indicator = true;
            }
        }
        if (event.type === "click") {
            //Если пользователь нажал на поле, для которого выведено сообщение
            //об ошибке;
            if (testClassName(element, errorClassName)) {
                textField = element;
                //Определение названия или идентификатора поля;
                if (textField.name.length) textFieldTitle = textField.name;
                else textFieldTitle = textField.id;
                //Поиск сообщения об ошибке;
                additoryObject = searchMessage(textFieldTitle);
                if (additoryObject.status) message = additoryObject.element;
                else console.error("При поиске сообщения об ошибке произошёл сбой в работе скрипта;");
                indicator = true;
            }
            //Если пользователь нажал на сообщение об ошибке;
            if (testClassName(element, errorClassName + "-message")) {
                message = element;
                textFieldTitle = message.getAttribute("data-reference");
                textField = form.elements[textFieldTitle];
                if (!textField) console.error("При поиске поля произошёл сбой в работе скрипта;");
                indicator = true;
            }
        }
        if (indicator) {
            //Непосредственное сокрытие сообщений об ошибках;
            hideMessage(textField, message);
        }
    };
}