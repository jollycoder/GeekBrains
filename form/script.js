$("#myForm [name='birth']").datepicker({
    monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                 "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    firstDay: 1,
    dateFormat: "yy-mm-dd",
    changeYear: true,
    yearRange: "1900:2016"
});

$("#progressbar").progressbar({value: 0, max: 7});

$("#myForm")
    .change(function (event) {
        var counter = 0;
        $.each($(this).serializeArray(), function (i, v) {
            v.value != '' && counter++;
        });
        $("#progressbar").progressbar({value: counter});
    })
    .submit(function (event) {
        $.post('validator.php', $(this).serialize(), function (data, textStatus) {
            if (textStatus == 'success') {
                data = JSON.parse(data);
                data.result == false && errorHandling(data.error);
            }
        }).fail(function () {
            alert("$.post failed!");
        });
        event.preventDefault();
    });

function errorHandling(errorObj) {
    var firstKey = Object.keys(errorObj)[0];  // обрабатываем ошибки по одной за раз
    var inputName = firstKey.replace(/\s+/, '_').toLowerCase();
    var inputSelector = "#myForm [name=" + inputName + "]";

    $("#dialog")
        .text(errorObj[firstKey])
        .dialog({
            title: "Ошибка в поле " + firstKey,
            position: {my: "left top", at: "right+10 top", of: inputSelector},
            modal: true, close: function () {
                $(inputSelector).effect("highlight", {color: 'red'});
            }
        });
}
