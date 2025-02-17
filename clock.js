let RATE = 25.00;
let main;
let laps;

function Lap(start, end, ePay, eStart) {
    this.start = start;
    this.end = end;
    this.ePay = ePay;
    this.eStart = eStart;
}

Lap.prototype.pay = function () {
    let end = this.end;
    if (end == null) end = new Date();

    let millis = (end - this.start);
    let hours = millis / 1000 / 60 / 60;

    return RATE * hours;
};

Lap.prototype.updatePay = function () {
    this.ePay.html("$" + this.pay().toFixed(2));
};

Lap.prototype.updateStart = function () {
    this.eStart
        .html(this.start.toLocaleTimeString())
        .attr("title", this.start.toLocaleString());
};


function getRate() {
    let rate = parseFloat(prompt("hourly rate", RATE.toFixed(2)));
    if (isNaN(rate)) return;
    RATE = rate;
    $(".rate").html("$" + RATE.toFixed(2));
}

function updateAllPay() {
    main.updatePay();
    laps.forEach(function (e) {
        return e.updatePay();
    });

    let t = setTimeout(updateAllPay, 10);
}

function reset() {
    main = new Lap(new Date(), null, $(".pay"), $(".start"));
    main.updateStart();

    clearLaps();
}

function addLap() {
    let now = new Date();
    if (laps.length > 0) laps[laps.length - 1].end = now;

    let ePay = $("<span></span>");
    let eStart = $("<span></span>");

    let li = $("<li></li>")
        .append(ePay)
        .append(" (")
        .append(eStart)
        .append(")");

    $("#laps").prepend(li);

    let lap = new Lap(now, null, ePay, eStart);
    lap.updateStart();

    laps.push(lap);
}

function clearLaps() {
    laps = [];
    $("#laps").html("");
    addLap();
}

function init() {
    let params = new URLSearchParams(window.location.search);
    if (params.get('rate')) {
        RATE = parseInt(params.get('rate'));
    }

    $(".rate").html("$" + RATE.toFixed(2));
    reset();
    updateAllPay();
}
