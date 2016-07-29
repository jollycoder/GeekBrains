document.getElementById('myForm').addEventListener('input', function (event) {
    var elem = event.target;
    var type = elem.getAttribute('name');
    var value = elem.value;
    var s = elem.style;
    var re;

    (type == 'tel')  && (re = /^\+7\(\d{3}\)\d{3}(-\d{2}){2}$/); // telephone
    (type == 'pass') && (re = /^\d{2}\s?\d{2}\s\d{6}$/);         // passport

    /*
     Валидация email.

     Локальная часть:
     регистронезависимые латинские буквы
     цифры
     символы !#$%&'*+-/=?^_`{|}~
     точка, не первый и не последний символ и не более одного раза подряд

     Доменная часть:
     регистронезависимые латинские буквы
     цифры
     точка, не первый и не последний символ и не более одного раза подряд
     дефис - не первый и не последний символ, не может быть перед точкой и не может быть сразу после точки
    */
    if (type == 'email')  {
        var p = "[-a-z0-9!#\\$%&'\\*+\\/=\\?\\^_`{\\|}~]+";
        var local = p + "((\\." + p + ")+)?";

        p  = "[a-z0-9]";
        var domain = "(" + p + "+((-+" + p + "+)+)?(\\.(?=" + p + "))?)+";

        re = new RegExp("^" + local + "@" + domain + "$", "i");
    }

    if (!value)  {
        s.background = '';
    }
    else {
        s.background = value.match(re) ? 'greenyellow' : 'salmon';
    }
});

