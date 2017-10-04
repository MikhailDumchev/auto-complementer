function Listener() {
    //Класс целевого iframe;
    var iframeClass = "cross-domain-iframe";
    //Ссылка на целевой iframe;
    var iframe = new Object();
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
    var showDebuggingMessage = function(message) {
        "use strict";
        if (debuggingIndicator) {
            console.log(message);
        }
    };
    //Метод инициализирует обработчик события "receiveMessage";
    this.startListening = function() {
        "use strict";
        window.addEventListener("message", receiveMessage, false);
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
                    //TODO: Занести данные в поля;
                    localStorage.setItem(message.key, message.data);
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
                        findIframe();
                        iframe.contentWindow.postMessage(JSON.stringify({"type": "set", "key": key, "data": detector.getGeoData()}), "*");
                    } else console.error("Форма не определена;");
                }
                break;
            default: break;
        }
    };
}