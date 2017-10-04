function CrossDomainStorage () {
    var iframeClass = "cross-domain-iframe";
    var key = "fr-user-geo";
    this.setGeoKey = function(value) {
        "use strict";
        key = value;
    };
    this.getGeoKey = function() {
        return key;
    };
    var executionIndicator = false;
    var container = document.body;
    //Ссылка на iframe;
    var iframe = new Object();
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
    this.execute = function() {
        "use strict";
        executionIndicator = true;
        addIframe();
    };
}