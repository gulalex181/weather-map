const API_KEY = '6bfff57ae4123636eff7e1df1cb6613b';
const CALLBACK = 'owm';
let coors = '30,50,179,80';
let url = `http://api.openweathermap.org/data/2.5/box/city?bbox=${coors},50&callback=${CALLBACK}&appid=${API_KEY}`;

function loadJSONP(url) {
    var script = document.createElement('script');
    script.src = url;

    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
}

const colors = {
    "30": '#F27935',
    "24": "#F37C31",
    "15": "#FF9A0E",
    "10": "#FFAB0E",
    "7": "#EABA31",
    "5": "#CBC867",
    "3": "#ABD39F",
    "0": "#99D8BD",
    "-6": "#7DDCED",
    "-8": "#78D9F5",
    "-10": "#78CFF5",
    "-15": "#78BFF2",
    "-20": "#7EA8DF",
    "-25": "#8498D0",
    "-30": "#795FB3"
}

function chooseTemp(temp) {
    if (temp > 30) return colors['30'];
    if (temp < 30 && temp > 24) return colors['24'];
    if (temp < 24 && temp > 15) return colors['15'];
    if (temp < 15 && temp > 10) return colors['10'];
    if (temp < 10 && temp > 7) return colors['7'];
    if (temp < 7 && temp > 5) return colors['5'];
    if (temp < 5 && temp > 3) return colors['3'];
    if (temp < 3 && temp > 0) return colors['0'];
    if (temp < 0 && temp > -3) return colors['0'];
    if (temp < -3 && temp > -6) return colors['-6'];
    if (temp < -6 && temp > -8) return colors['-8'];
    if (temp < -8 && temp > -10) return colors['-10'];
    if (temp < -10 && temp > -15) return colors['-15'];
    if (temp < -15 && temp > -20) return colors['-20'];
    if (temp < -20 && temp > -25) return colors['-25'];
    if (temp < -25 && temp > -30) return colors['-30'];
    if (temp < -30) return colors['-30'];
}

let cities = [];

let map = L.map('map', {
    center: [55.75, 37.66],
    zoom: 5
});
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

let weather = Rx.Observable.create(observer => {
        window[CALLBACK] = function (response) {
            observer.next(response);
            observer.complete();
        };
        loadJSONP(url);
    })
    .flatMap(res => {
        return Rx.Observable.from(res.list);
    })
    .map(city => {
        return {
            city: city.name,
            lat: city.coord.lat,
            lon: city.coord.lon,
            temp: city.main.temp
        };
    });

weather.subscribe(
    city => {
        L.circle([city.lat, city.lon], 10000, { color: chooseTemp(city.temp) }).addTo(map);
    }
);
