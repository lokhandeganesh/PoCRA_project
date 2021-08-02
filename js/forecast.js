var geojson;

var todate;
var mindate;
var maxdate;
var rain_class1, rain_class2, rain_class3, rain_class4, rain_class5, maxrainfall;




// return dates for timeline
$.ajax({
    'async': false,
    'type': "GET",
    'global': false,
    'dataType': 'json',
    'url': "http://gis.mahapocra.gov.in/weatherservices/meta/getforecastdate",
    // 'data': { 'request': "", 'target': 'arrange_url', 'method': 'method_target' },
    'success': function(data) {
        console.log(data)
        todate = data.forecast[0].today;
        mindate = data.forecast[0].mindate;
        maxdate = data.forecast[0].maxdate;
        rain_class1 = data.forecast[0].rain_class1;
        rain_class2 = data.forecast[0].rain_class2;
        rain_class3 = data.forecast[0].rain_class3;
        rain_class4 = data.forecast[0].rain_class4;
        rain_class5 = data.forecast[0].rain_class5;
        maxrainfall = data.forecast[0].maxrainfall;
    }
});

var topo = new ol.layer.Tile({
    title: 'Topo Map',
    type: 'base',
    visible: true,
    source: new ol.source.XYZ({
        attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        crossOrigin: 'Anonymous',
    })
});
var MahaDist = new ol.layer.Tile({
    title: "State",
    source: new ol.source.TileWMS({
        url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
        crossOrigin: 'Anonymous',
        serverType: 'geoserver',
        visible: true,
        params: {
            'LAYERS': 'PoCRA:MahaDist',
            'TILED': true,
        }
    })
});
var layers = new ol.layer.Tile({
    title: "State",
    source: new ol.source.TileWMS({
        attributions: ['Iowa State University'],
        crossOrigin: 'Anonymous',
        serverType: 'geoserver',
        visible: true,
        url: 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi',
        params: { 'LAYERS': 'nexrad-n0r-wmst' },
    })
});


var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

var overlay = new ol.Overlay({
    element: container,
    positioning: 'center-center',
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    },
});


var center = ol.proj.transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857');

// Style function
var cache = {};

var vectorSource = new ol.source.Vector({
    url: 'http://localhost:8080/geoserver/pocra_dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pocra_dashboard%3AIMDView&outputFormat=application%2Fjson',
    format: new ol.format.GeoJSON(),
    attributions: ["&copy; IMD Forecast"]
});
var subdivisionLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#001'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});

var subdivisionBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#00000',
        width: 2,
        // linejoin:'bevel',
        // lineDash: [4,8],
        // lineDashOffset: 6
    })
});
var vector = new ol.layer.Vector({
    name: 'Forecast',
    source: vectorSource,
});

view = new ol.View({
    center: center,
    zoom: 7.5
});
var latLong = '&nbsp;&nbsp; Latitude : {y}, &nbsp;&nbsp; Longitude: {x} &nbsp;&nbsp;';
var scaleLineControl = new ol.control.ScaleLine({
    units: 'metric',
    type: 'scalebar',
    steps: 2
});
var mouse = new ol.control.MousePosition({
    projection: 'EPSG:4326',
    coordinateFormat: function(coordinate) {
        return ol.coordinate.format(coordinate, latLong, 4);
    }
});
// var extent = ol.proj.transform([-126, 24, -66, 50], 'EPSG:4326', 'EPSG:3857');
var map = new ol.Map({
    view: view,
    overlays: [overlay],
    layers: [
        topo
    ],
    controls: ol.control.defaults({
        attribution: false
    }).extend([mouse, scaleLineControl]),
    target: 'map'
})
var dates = [];
loadMap1();
// getseries();


function getseries() {
    var d = new Date(todate);
    // var aryDates = [];

    for (var i = 1; i <= 4; i++) {
        var currentDate = new Date();
        currentDate.setDate(d.getDate() + i);
        if ((currentDate.getDate().toString).length > 1) {
            dates.push(currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + "0" + currentDate.getDate());
        } else {
            dates.push(currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate());
        }

    }
    var sliderRange = document.getElementById("myRange");
    sliderRange.max = dates.length - 1;

    var dateValue = document.getElementById("date_value");
    dateValue.innerHTML = dates[sliderRange.value].slice(0, 10);
    // layers[1].getSource().updateParams({ 'TIME': dates[sliderRange.value] });

    // Update the current slider value (each time you drag the slider handle)
    sliderRange.oninput = function() {
        dateValue.innerHTML = dates[this.value].slice(0, 10);
    }
}


function loadMap1() {

    if (geojson) {
        map.removeLayer(geojson);
    }

    var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Taluka&outputFormat=application/json";
    geojson = new ol.layer.Vector({
        title: "Taluka",
        source: new ol.source.Vector({
            url: url,
            format: new ol.format.GeoJSON()
        }),
    });
    geojson.getSource().on('addfeature', function() {
        //alert(geojson.getSource().getExtent());
        map.getView().fit(
            geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
        );
    });


    map.addLayer(geojson);
}
var imdlayer;

function loadMap(forecastdate) {
    if (imdlayer) {
        map.removeLayer(imdlayer);
    }
    var indate = "forecast_date IN('" + forecastdate + "')";
    imdlayer = new ol.layer.Tile({
        title: "IMD Forecast",
        source: new ol.source.TileWMS({
            attributions: ['&copy; IMD Forecast'],
            crossOrigin: 'Anonymous',
            serverType: 'geoserver',
            visible: true,
            url: "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms?",
            params: {
                'LAYERS': 'PoCRA:Forecast',
                'TILED': true,
                'env': "rain1:" + (parseInt(rain_class2)) + ";rain2:" + (parseInt(rain_class2) + 0.1) + ";rain3:" + (parseInt(rain_class3)) + ";rain4:" + (parseInt(rain_class3) + 0.1) + ";rain5:" + (parseInt(rain_class4)) + ";rain6:" + (parseInt(rain_class4) + 0.1),
                'CQL_FILTER': indate
            },
        })
    });
    map.addLayer(imdlayer);
}

loadMap(mindate);
var subdivisionStyle = [subdivisionBoundaryStyle, subdivisionLabelStyle];
var forcastcolor = [
    [0, 2, '#ffd380'],
    [2.1, 4, '#ffaa01'],
    [4.1, 6, '#98e500'],
    [6.1, 10, '#1c6b00']
];


// // Create Timeline control 
// var tline = new ol.control.Timeline({
//     className: 'ol-pointer',
//     features: [{
//         date: new Date(mindate),
//         endDate: new Date(maxdate)
//     }],
//     graduation: 'day', // 'month'
//     minDate: new Date(mindate),
//     maxDate: new Date(maxdate),
//     getHTML: function(f) {},
//     getFeatureDate: function(f) { return f.date; },
//     endFeatureDate: function(f) { return f.endDate }
// });
// map.addControl(tline);
// // Set the date when ready
// // var d = new Date(todate);
// setTimeout(function() { tline.setDate(mindate); });
// tline.addButton({
//     className: "go",
//     title: "GO!",
//     handleClick: function() {
//         go();
//     }
// });

// // Run on the timeline
// var running = false;
// var start = new Date(mindate);
// var end = new Date(maxdate);

// function go(next) {

//     var date = tline.getDate();
//     month = '' + (date.getMonth() + 1);
//     day = '' + date.getDate();
//     year = date.getFullYear();

//     if (month.length < 2)
//         month = '0' + month;
//     if (day.length < 2)
//         day = '0' + day;


//     var inputdate = [year, month, day].join('-');
//     document.getElementById("select").innerHTML = inputdate;
//     console.log(inputdate);
//     loadMap(inputdate);

//     // console.log(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay())
//     // imdlayer.getSource().updateParams({
//     //     'forecast_date': inputdate
//     // });
//     if (running) clearTimeout(running);
//     if (!next) {
//         // stopconsole.log(date)
//         // if (date >= start && date <= end && running) {
//         //     // console.log(">" + date)
//         //     running = false;
//         //     tline.element.classList.remove('running');
//         //     return;
//         // }
//         if (date > end) {

//             date = start;
//         }
//     }
//     if (date > end) {

//         tline.element.classList.remove('running');
//         return;
//     }
//     // if (date < start) {

//     //     date = start;
//     // }
//     // 1 day
//     // console.log(date.getTime())

//     date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
//     tline.setDate(date, { anim: false });
//     // next
//     tline.element.classList.add('running');

//     running = setTimeout(function() { go(true); }, 2000);
// }


var frameRate = 0.5; // frames per second
var animationId = null;
// var startDate = "2021-07-01";
var startDate = new Date(todate);
var endDate = new Date(maxdate);
var sdate = mindate;
var disdate;

function updateInfo() {

    var d = new Date(mindate),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    fromdate = [day, month, year].join('-');

    var ed = new Date(maxdate),
        emonth = '' + (ed.getMonth() + 1),
        eday = '' + ed.getDate(),
        eyear = ed.getFullYear();

    if (emonth.length < 2)
        emonth = '0' + emonth;
    if (eday.length < 2)
        eday = '0' + eday;
    todaydate = [eday, emonth, eyear].join('-');
    document.getElementById("today").innerHTML = "( " + fromdate + " to " + todaydate + " )";
    var el = document.getElementById('info');
    el.innerHTML = disdate;
    document.getElementById('rainclass1').innerHTML = (parseInt(rain_class1)) + " to " + (parseInt(rain_class2));
    document.getElementById('rainclass2').innerHTML = (parseInt(rain_class2) + 0.1) + " to " + (parseInt(rain_class3));
    document.getElementById('rainclass3').innerHTML = (parseInt(rain_class3) + 0.1) + " to " + (parseInt(rain_class4));
    document.getElementById('rainclass4').innerHTML = (parseInt(rain_class4) + 0.1) + " and above ";
}

function setTime() {
    startDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    var d = new Date(startDate),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    sdate = [year, month, day].join('-');

    var ed = new Date(endDate),
        emonth = '' + (ed.getMonth() + 1),
        eday = '' + ed.getDate(),
        eyear = ed.getFullYear();

    if (emonth.length < 2)
        emonth = '0' + emonth;
    if (eday.length < 2)
        eday = '0' + eday;
    edate = [eyear, emonth, eday].join('-');

    var dd = new Date(sdate),
        dmonth = '' + (dd.getMonth() + 1),
        dday = '' + dd.getDate(),
        dyear = dd.getFullYear();

    if (dmonth.length < 2)
        dmonth = '0' + dmonth;
    if (dday.length < 2)
        dday = '0' + dday;
    disdate = [dday, dmonth, dyear].join('-');
    // console.log(sdate)
    // console.log(edate)
    loadMap(sdate)

    // startDate.setMinutes(startDate.getTime() + 24 * 60 * 60 * 1000);

    if (sdate == edate) {

        startDate = new Date(todate);
        console.log("stop loop")
        stop();

    }
    // if (sdate < endeDate) {

    //     // startDate = threeHoursAgo();
    // } else {
    //     stop();
    // }
    // layers[1].getSource().updateParams({ 'TIME': startDate.toISOString() });
    updateInfo();
}
setTime();

var stop = function() {
    if (animationId !== null) {
        window.clearInterval(animationId);
        animationId = null;
    }
};

var play = function() {
    stop();
    animationId = window.setInterval(setTime, 5000 );
};

var startButton = document.getElementById('play');
startButton.addEventListener('click', play, false);

var stopButton = document.getElementById('pause');
stopButton.addEventListener('click', stop, false);

updateInfo();

map.on('singleclick', function(evt) {

    var coordinate = evt.coordinate;
    var viewResolution = /** @type {number} */ (view.getResolution());
    map.forEachLayerAtPixel(evt.pixel, function(feature, layer) {
        console.log(layer);
        // if (layer.get('title') === "IMD Forecast") {
        //     console.log(feature.getKeys())
        // }

    });
    var url = imdlayer.getSource().getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        'EPSG:3857', { 'INFO_FORMAT': 'application/json' }
    );
    if (url) {
        fetch(url)
            .then(function(response) {
                // console.log(response.text());
                return response.text();
            })
            .then(function(html) {
                var jsondata = JSON.parse(html);
                if (jsondata.features[0].properties) {
                    content.innerHTML = "";
                    content.innerHTML = '<table class="table table-bordered" style="border:1px solid black;width: 95%;color:black"><tr ><td style="background-color:skyblue" colspan=2 style="text-align:center">IMD Weather Forecast Attribute Information</td></tr><tr><td style="text-align: right">District </td><td style="text-align: left">' + jsondata.features[0].properties.dtnname + '</td></tr><tr><td style="text-align: right">Taluka </td><td style="text-align: left">' + jsondata.features[0].properties.thnname + '</td></tr><tr><td style="text-align: right">Forecast Date </td><td style="text-align: left">' + jsondata.features[0].properties.forecast_date + '</td></tr><tr><td style="text-align: right">Rainfall (mm) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.rainfall_mm) + '</td></tr><tr><td style="text-align: right">Maximum Temprature &#8451; </td><td style="text-align: left ">' + parseFloat(jsondata.features[0].properties.temp_max_deg_c) + '</td></tr><tr><td style="text-align: right">Minimum Temprature &#8451; </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.temp_min_deg_c) + '</td></tr><tr><td style="text-align: right">Wind Speed(m/s) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.wind_speed_ms) + '</td></tr><tr><td style="text-align: right">Wind Direction (Deg.)</td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.wind_direction_deg) + '</td></tr><tr><td style="text-align: right">Humidity 1 (%) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.humidity_1) + '</td></tr><tr><td style="text-align: right">Humidity 2 (%)</td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.humidity_2) + '</td></tr><tr><td style="text-align: right">Cloud Cover </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.cloud_cover_octa) + '</td></tr><tr></table>';
                    overlay.setPosition(coordinate);
                }


            });
        
    }


});