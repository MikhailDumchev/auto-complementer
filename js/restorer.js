function Restorer() {
    var form = new Object();
    this.setForm = function(value) {
        "use strict";
        form = value;
    };
    //Метод отвечает за восстановление введённых пользователем данных на
    //основании использования localStorage;
    this.execute = function() {
        "use strict";
        var user = JSON.parse(localStorage.getItem('fr-user'));
        if (user) {
            //Заполнение текстовых полей;
            for (var key in user) {
                if (form[key]) form[key].value = user[key];
            }
        }
    };
}