function Clock(options) {
    var elem = options.elem;
    var hour = document.createElement('span');
    var min = document.createElement('span');
    var sec = document.createElement('span');
    var timerId;

    function renderClock() {
        var clock = document.createElement('div');
        function ch (elem) { clock.appendChild(elem); }

        hour.innerHTML = min.innerHTML = sec.innerHTML = '00';
        ch(hour);
        ch(document.createTextNode(':'));
        ch(min);
        ch(document.createTextNode(':'));
        ch(sec);

        elem.appendChild(clock);
    }

    function renderButtons() {
        var buttons = document.createElement('div');

        for (i = 0; i < 3; i++)  {
            var item = document.createElement('input');
            item.type = 'button';
            item.value = i == 0 ? 'Start' : i == 1 ? 'Stop' : 'Alert';
            item.style.marginRight = '5px';
            buttons.appendChild(item);
        }

        buttons.addEventListener('click', function (event) {
            var v = event.target.value;
            (v == 'Start') && startClock();
            (v == 'Stop') && stopClock();
            (v == 'Alert') && suspendClock();
        });

        elem.appendChild(buttons);
    }

    function setTime()  {
        if (elem.classList.contains('suspended'))
            return;
        var date = new Date();
        hour.innerHTML = ('0' + date.getHours()).slice(-2);
        min.innerHTML = ('0' + date.getMinutes()).slice(-2);
        sec.innerHTML = ('0' + date.getSeconds()).slice(-2);
    }

    function startClock() {
        if (!elem.classList.contains('going')) {
            timerId = setInterval(setTime, 1000);
            elem.classList.add('going');
        }
    }

    function stopClock() {
        if (elem.classList.contains('going')) {
            clearInterval(timerId);
            elem.classList.remove('going');
        }
    }

    function suspendClock ()  {
        elem.classList.add('suspended');
        alert('Press OK to continue');
        elem.classList.remove('suspended');
    }

    renderClock();
    renderButtons();

    this.start = startClock;
    this.stop = stopClock;
}
