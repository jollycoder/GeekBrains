$("#myForm").submit(function (event) {
    var data = {};
    $.each($( this ).serializeArray(), function (i, v) {
        data[v.name] = v.value;
    });
    // data = JSON.stringify(data); // так тоже не получается
    $.getJSON('validator.php', data, function (data, textStatus, jqXHR) {
        console.log(data);
        console.log(textStatus);
        console.log(jqXHR);
    });
    event.preventDefault();
});
