function Detector() {
    var setter = new Object();
    var city = "";
    var country = "";
    var countryEn = "";
    this.getCity = function() {
        "use strict";
        return city;
    };
    this.getCountry = function() {
        "use strict";
        return country;
    };
    this.getCountryEn = function() {
        "use strict";
        return countryEn;
    };
    this.getGeoData = function() {
        "use strict";
        return {"country": country, "city": city, "countryEn": countryEn};
    };
    //Метод отвечает за определение гео-локации пользователя и установку значений
    //для соответственных полей;
    this.detect = function(form) {
        var XHR = new XMLHttpRequest();
        var response = new Object();
        XHR.onreadystatechange = function() {
            if (XHR.readyState === 4) {
                response = JSON.parse(XHR.responseText);   
                //Установка значений для гео-полей;
                countryEn = response.country_code;
                city = response.city_rus;
                country = response.country_rus;
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
        };
        XHR.open("GET", "http://api.2ip.ua/geo.json?key=142dafee11e31629", false);
        XHR.send();
    };
}