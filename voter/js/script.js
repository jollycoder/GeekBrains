function Voter(options) {
    var elem = options.elem;
    var vote = elem.querySelector('.vote');

    elem.querySelector('.down').style.cursor = 'pointer';
    elem.querySelector('.up').style.cursor = 'pointer';

    elem.addEventListener('click', function (event) {
        var tClass = event.target.className;
        (tClass == 'up') && (vote.innerHTML)++;
        (tClass == 'down') && (vote.innerHTML)--;
    });

    this.setVote = function (number)  {
        if (!number.toString().match(/^-?\d+$/))  {
            alert('Должно быть указано целое число!');
            return;
        }
        vote.innerHTML = number;
    };
}
