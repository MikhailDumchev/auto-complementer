function Setter() {
    //Ссылка на HTML-форму;
    var form = new Object();
    var geoFieldTitle = "geo";
    var cityFieldTitle = "city";
    //Объект с гео-данными;
    var geoData = new Object();
    this.setGeoData = function(value) {
        "use strict";
        geoData = value;
    };
    //Метод отвечает за инициализацию значений в текстовых полях;
    var setFieldValue = function(title, value) {
        "use strict";
        var indicator = false;
        if (form[title]) {
            indicator = true;
            form[title].value = value;
        } else console.error("К сожалению, поле с таким именем не найдено;");
        return indicator;
    };
    //Инициализирующий метод;
    this.initialize = function(value) {
        "use strict";
        if (value && value.nodeName === "FORM") {
            form = value;
            setFieldValue(geoFieldTitle, geoData.country);
            setFieldValue(cityFieldTitle, geoData.city);
        }
    };
}