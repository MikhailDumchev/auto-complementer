/**
 * Класс отвечает за отправку и получение кросс-доменных сообщений
 */
function Listener() {
    //Индикатор, который указывает на необходимость отправки кросс-доменного сообщения
    //после загрузки содержимого iframe (асинхронная загрузка);
    var executionIndicator = false;
    var container = document.body;
    //Класс целевого iframe;
    var iframeClass = "cross-domain-iframe";
    //Ссылка на целевой iframe;
    var iframe = new Object();
    //Название гео-ключка для localStorage;
    var key = "fr-user-geo";
    this.setGeoKey = function(value) {
        "use strict";
        key = value;
    };
    this.getGeoKey = function() {
        return key;
    };
    //Объект класса "Detector", который отвечает за определение гео-данных пользователя; 
    var detector = new Object();
    //Объект класса "", который отвечает за установку значений гео-полей формы;
    var setter = new Object();
    //Ссылка на HTML-форму, гео-поля которой нужно заполнить;
    var form = new Object();
    this.setForm = function(value) {
        "use strict";
        form = value;
    };
    //Индикатор необходимости отладки;
    var debuggingIndicator = false;
    //Метод для отладки;
    var showDebuggingMessage = function(message) {
        "use strict";
        if (debuggingIndicator) {
            console.log(message);
        }
    };
    //Метод используется для поиска iframe с классом iframeClass;
    var findIframe = function() {
        "use strict";
        var counter = 0;
        var indicator = false;
        while (!indicator && counter < document.getElementsByTagName("iframe").length) {
            if (testClassName(document.getElementsByTagName("iframe")[counter], iframeClass)) {
                indicator = true;
                iframe = document.getElementsByTagName("iframe")[counter];
            } else counter++;
        }
    };
    //Метод используется для получения кросс-доменных сообщений;
    var receiveMessage = function(event) {
        "use strict";
        event = event || window.event;
        var message = JSON.parse(event.data);
        switch (message.type) {
            case "set":
                localStorage.setItem(message.key, JSON.stringify(message.data));
                break;
            case "get":
                //Если гео-данные найдены в текущем локальном хранилище;
                if (localStorage.getItem(message.key)) {
                    window.parent.postMessage(JSON.stringify({"type": "response", "status": true, "key": message.key, "data": localStorage.getItem(message.key)}), "*");
                //Если гео-данные не найдены;
                } else {
                    window.parent.postMessage(JSON.stringify({"type": "response", "status": false}), "*");
                }
                break;
            case "response":
                //Если гео-данные были найдены в стороннем localStorage;
                if (message.status) {
                    try {
                        //Установка значений гео-полей формы;
                        setter = new Setter();
                        setter.setGeoData(JSON.parse(message.data));
                        setter.initialize(form);
                    } catch (error) {
                        console.error("Не подключен скрипт 'detector.js';");
                    }
                //В противном случае начинаем определять текущие гео-данные пользователя;
                } else {
                    if (form.toString() !== "[object Object]") {
                        try {
                            //Определение текущих гео-данных пользователя с одновременным заполнением гео-полей формы;
                            detector = new Detector();
                            detector.detect(form);
                        } catch (error) {
                            console.error("Не подключен скрипт 'detector.js';");
                        }
                        //Сохранение текущих гео-данных во внешнем localStorage;
                        if (iframe.toString() === "[object Object]") findIframe();
                        iframe.contentWindow.postMessage(JSON.stringify({"type": "set", "key": key, "data": detector.getGeoData()}), "*");
                    } else console.error("Форма не определена;");
                }
                break;
            default: break;
        }
    };
    //Метод используется для отправки сообщения на другой домен;
    var sendMessage = function() {
        "use strict";
        if (executionIndicator) {
            try {
                //Проверка, не сохранены ли гео-данные в текущем localStorage;
                if (!localStorage.getItem(key)) {
                    //Попытка получения гео-данных из домена второго уровня;
                    iframe.contentWindow.postMessage(JSON.stringify({"type": "get", "key": key}), "*");
                }
            } catch (error) {
                console.error("Не удалось получить ссылку на окно;");
            }
        }
    };
    //Метод используется для создания временного iframe;
    var addIframe = function () {
        "use strict";
        iframe = document.createElement("iframe");
        iframe.className = iframeClass;
        iframe.src = "http://mmv.com.ua/test-index.html";
        container.appendChild(iframe);
        iframe.addEventListener("load", sendMessage, true);
    };
    /**
     * Метод для инициализации отправки сообщения;
     */
    this.execute = function() {
        "use strict";
        executionIndicator = true;
        addIframe();
    };
    /**
     * Метод инициализирует обработчик события "receiveMessage";
     */
    this.startListening = function() {
        "use strict";
        window.addEventListener("message", receiveMessage, false);
    };
}