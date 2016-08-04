function Voter(options) {
    var elem = options.elem;
    var vote = elem.getElementsByClassName('vote')[0];

    elem.getElementsByClassName('down')[0].style.cursor = 'pointer';
    elem.getElementsByClassName('up')[0].style.cursor = 'pointer';

    elem.addEventListener('click', function (event) {
        var tClass = event.target.className;
        (tClass == 'up') && +vote.innerHTML++;
        (tClass == 'down') && +vote.innerHTML--;
    });

    this.setVote = function (number)  {
        if (!number.toString().match(/^-?\d+$/))  {
            alert('Должно быть указано целое число!');
            return;
        }
        vote.innerHTML = number;
    };
}
