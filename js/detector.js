function Detector() {
    var setter = new Object();
    var city_rus = "";
    var country_rus = "";
    var country_en = "";
    this.getGeoData = function() {
        "use strict";
        return {"country_rus": country_rus, "city_rus": city_rus, "country": country_en};
    };
    //Метод отвечает за определение гео-локации пользователя и установку значений
    //для соответственных полей;
    this.detect = function(form) {
        "use strict";
        var XHR = new XMLHttpRequest();
        var response = new Object();
        XHR.onreadystatechange = function() {
            if (XHR.readyState === 4) {
                response = JSON.parse(XHR.responseText);   
                //Установка значений для гео-полей;
                country_en = response.country_code;
                city_rus = response.city_rus;
                country_rus = response.country_rus;
                //Установка значений для гео-полей формы;
                try {
                    setter = new Setter();
                    setter.setGeoData(this.getGeoData());
                    setter.initialize(form);
                } catch (error) {
                    if (error instanceof  ReferenceError) {
                        console.error("Не подключен скрипт 'setter.js';");
                    }
                }
            }
        }.bind(this);
        //Формирование запроса на сервер, если гео-данные ещё не получены;
        if (!localStorage.getItem("fr-user-geo")) {
            XHR.open("GET", "http://api.2ip.ua/geo.json?key=142dafee11e31629", false);
            XHR.send();
        //Иначе записываем уже имеющиеся;
        } else {
            setter = new Setter();
            setter.setGeoData(JSON.parse(localStorage.getItem("fr-user-geo")));
            setter.initialize(form);
        }
    };
}