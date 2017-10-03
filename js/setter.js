function Setter() {
    //Ссылка на HTML-форму;
    var form = new Object();
    //Объект с гео-данными;
    var geoData = new Object();
    //Метод отвечает за получение гео-данных пользователя;
    this.setGeoData = function(value) {
        "use strict";
        geoData = value;
    };
    //Инициализирующий метод;
    this.initialize = function(value) {
        "use strict";
        if (value && value.nodeName === "FORM") {
            form = value;
            //Названия текстовых полей должны быть идентичны названиям свойств
            //объекта, в котором хранятся гео-данные;
            for (var key in geoData) {
                if (form[key] && form[key].hasAttribute("data-geo")) {
                    form[key].value = geoData[key];
                }
            }
        }
    };
}