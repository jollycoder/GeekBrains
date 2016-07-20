function createMarkedList(id, array) {
    var ulElem = document.createElement('ul');
    array.forEach(function (item) {
        var liElem = document.createElement('li');
        liElem.innerText = item;
        ulElem.appendChild(liElem);
    });
    document.getElementById(id).appendChild(ulElem);
}

function readJson(jsonFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', jsonFile, false);
    xhr.send();
    if (xhr.status != 200) {
        return alert(xhr.status + ': ' + xhr.statusText);
    }
    var array = [];
    JSON.parse(xhr.responseText).forEach(function (item) {
        array.push(item.name);
    });
    return array;
}

createMarkedList('phoneslist', readJson('phones.json'));
