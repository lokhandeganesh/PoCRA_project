var geojson;

var todate;
var mindate;
var maxdate;
var rain_class1, rain_class2, rain_class3, rain_class4, rain_class5, maxrainfall;
var rain1, rain2, rain3, rain4, rain5, tempmax1, tempmax2, tempmax3, tempmax4, tempmin1, tempmin2, tempmin3, tempmin4;




// return dates for timeline
$.ajax({
    'async': false,
    'type': "GET",
    'global': false,
    'dataType': 'json',
    'url': "http://gis.mahapocra.gov.in/weatherservices/meta/getforecastdate",
    // 'data': { 'request': "", 'target': 'arrange_url', 'method': 'method_target' },
    'success': function(data) {
        // console.log(data)
        todate = data.forecast[0].today;
        mindate = data.forecast[0].mindate;
        maxdate = data.forecast[0].maxdate;
        rain1 = data.forecast[0].rain_class1;
        rain2 = data.forecast[0].rain_class2;
        rain3 = data.forecast[0].rain_class3;
        rain4 = data.forecast[0].rain_class4;
        rain5 = data.forecast[0].rain_class5;
        maxrainfall = data.forecast[0].maxrainfall;
        tempmax1 = data.forecast[0].temp_max1;
        tempmax2 = data.forecast[0].temp_max2;
        tempmax3 = data.forecast[0].temp_max3;
        tempmax4 = data.forecast[0].temp_max4;
        tempmin1 = data.forecast[0].temp_min1;
        tempmin2 = data.forecast[0].temp_min2;
        tempmin3 = data.forecast[0].temp_min3;
        tempmin4 = data.forecast[0].temp_min4;
    }
});

document.getElementById("forecasttable").innerHTML = '<table id="example" class="table table-striped table-bordered" >\n\
            <thead>\n\
			</tr>\n\
	<tr > <th  style="text-align: left;font-size: 14px;">Sr. No.</th>\n\
	<th  style="text-align: left;font-size: 14px;" >District</th>\n\
	 <th  style="text-align: left;font-size: 14px;" >Taluka</th>\n\
	<th  style="text-align: left;font-size: 14px;" >Forecast Date </th>\n\
	<th  style="text-align: left;font-size: 14px;" >Rainfall (mm) </th>\n\
    <th  style="text-align: left;font-size: 14px;" >Minimun Temprature (&#176;C) </th>\n\
    <th  style="text-align: left;font-size: 14px;" >Maximum Temprature (&#176;C) </th>\n\
    <th  style="text-align: left;font-size: 14px;" >Humidity 1 (%)</th>\n\
    <th  style="text-align: left;font-size: 14px;" >Humidity 2 (%)</th>\n\
    <th  style="text-align: left;font-size: 14px;" >Wind Speed (m/s)</th>\n\
    <th  style="text-align: left;font-size: 14px;" >Wind Direction </th>\n\
    <th  style="text-align: left;font-size: 14px;" >Cloud Cover</th>\n\
    </tr>\n\
                </thead>\n\
                <tbody>'
    // datatable
var table = $('#example').DataTable({
    fixedHeader: true
});
$.ajax({
    url: "http://gis.mahapocra.gov.in/dashboard_testing_api_2020_12_22/meta/todaysforecast",
    success: function(result) {
        for (var i = 0; i < result.forecast.length; i++) {
            table.row.add([
                i + 1,
                result.forecast[i].dtnname,
                result.forecast[i].thnname,
                result.forecast[i].forecast_date,
                result.forecast[i].rainfall_mm,
                result.forecast[i].temp_min_deg_c,
                result.forecast[i].temp_max_deg_c,
                result.forecast[i].humidity_1,
                result.forecast[i].humidity_2,
                result.forecast[i].wind_speed_ms,
                result.forecast[i].wind_direction_deg,
                result.forecast[i].cloud_cover_octa
            ]).draw(false);
        }

    }
});
'</tbody>'
'</table>'





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
            'LAYERS': 'PoCRA_Dashboard:District',
            'TILED': true,
        }
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
// Define a new legend

//legend.on('select', function(e){ console.log(e) });

// // Add a new one
// var legend2 = new ol.legend.Legend({
//     title: '', // no title
//     margin: 5
// });
// map.addControl(new ol.control.Legend({
//     legend: legend2,
//     target: legendCtrl.element
// }));



//legend.on('select', function(e){ console.log(e) });




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
var label;
var legend, legendCtrl;

function loadMap(forecastdate) {
    var elevalue = document.getElementById("mapselect").value;
    var propname = "";
    // alert(elevalue)
    if (legend) {
        map.removeControl(legend);
    }
    if (legendCtrl) {
        map.removeControl(legendCtrl);
    }
    if (elevalue === "rainfall") {
        propname = "rainfall_mm";
        label = "Rainfall";
        // document.getElementById("legendTitle").innerHTML = label + '(mm)';
        rain_class1 = rain1;
        rain_class2 = rain2;
        rain_class3 = rain3;
        rain_class4 = rain4;
        rain_class5 = rain5;
        updateInfo();
        legend = new ol.legend.Legend({
            title: label,
            // style: getFeatureStyle
        })
        legendCtrl = new ol.control.Legend({
            legend: legend,
            collapsed: false
        });
        map.addControl(legendCtrl);
        legend.addItem({
            title: (parseInt(rain_class1)) + " - " + (parseInt(rain_class2)),
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast1.jpg"
                })
            })
        });
        legend.addItem({
            title: (parseInt(rain_class2) + 0.1) + " - " + (parseInt(rain_class3)),
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast2.jpg"
                })
            })
        });
        legend.addItem({
            title: (parseInt(rain_class3) + 0.1) + " - " + (parseInt(rain_class4)),
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast3.jpg"
                })
            })
        });
        legend.addItem({
            title: (parseInt(rain_class4) + 0.1) + " and above ",
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast4.jpg"
                })
            })
        });
    } else if (elevalue === "mintemprature") {
        if (legend) {
            map.removeControl(legend);
        }
        if (legendCtrl) {
            map.removeControl(legendCtrl);
        }
        propname = "temp_min_deg_c";
        label = "Minimum Temprature";
        // document.getElementById("legendTitle").innerHTML = label + '(&#176;C)';
        // rain_class1 = tempmin1;
        rain_class2 = tempmin1;
        rain_class3 = tempmin2;
        rain_class4 = tempmin3;
        rain_class5 = tempmin4;
        updateInfo();
        legend = new ol.legend.Legend({
            title: label,
            // style: getFeatureStyle
        })
        legendCtrl = new ol.control.Legend({
            legend: legend,
            collapsed: false
        });

        map.addControl(legendCtrl);
        legend.addItem({
            title: (parseInt(rain_class1)) + " - " + (parseInt(rain_class2)),
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast1.jpg"
                })
            })
        });
        legend.addItem({
            title: (parseInt(rain_class3) + 0.1) + " - " + (parseInt(rain_class2)),
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast2.jpg"
                })
            })
        });
        legend.addItem({
            title: (parseInt(rain_class3) + 0.1) + " - " + (parseInt(rain_class4)),
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast3.jpg"
                })
            })
        });
        legend.addItem({
            title: (parseInt(rain_class4) + 0.1) + " and above ",
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast4.jpg"
                })
            })
        });
    } else if (elevalue === "maxtemprature") {

        if (legend) {
            map.removeControl(legend);
        }
        if (legendCtrl) {
            map.removeControl(legendCtrl);
        }
        propname = "temp_max_deg_c";
        label = "Maximum Temprature";
        // document.getElementById("legendTitle").innerHTML = label + '(&#176;C)';
        rain_class2 = tempmax1;
        rain_class3 = tempmax2;
        rain_class4 = tempmax3;
        rain_class5 = tempmax4;
        updateInfo();
        legend = new ol.legend.Legend({
            title: label,
            // style: getFeatureStyle
        })
        legendCtrl = new ol.control.Legend({
            legend: legend,
            collapsed: false
        });
        map.addControl(legendCtrl);
        legend.addItem({
            title: (parseInt(rain_class1)) + " - " + (parseInt(rain_class2)),
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast1.jpg"
                })
            })
        });
        legend.addItem({
            title: (parseInt(rain_class2) + 0.1) + " - " + (parseInt(rain_class3)),
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast2.jpg"
                })
            })
        });
        legend.addItem({
            title: (parseInt(rain_class3) + 0.1) + " - " + (parseInt(rain_class4)),
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast3.jpg"
                })
            })
        });
        legend.addItem({
            title: (parseInt(rain_class4) + 0.1) + " and above ",
            typeGeom: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    size: [35, 35],
                    src: "./legend/forcast4.jpg"
                })
            })
        });
    }

    if (imdlayer) {
        map.removeLayer(imdlayer);
    }
    if (MahaDist) {
        map.removeLayer(MahaDist);
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
                'LAYERS': 'PoCRA:ForecastView',
                'TILED': true,
                'env': "propname:" + propname + ";rain1:" + (parseInt(rain_class2)) + ";rain2:" + (parseInt(rain_class2) + 0.1) + ";rain3:" + (parseInt(rain_class3)) + ";rain4:" + (parseInt(rain_class3) + 0.1) + ";rain5:" + (parseInt(rain_class4)) + ";rain6:" + (parseInt(rain_class4) + 0.1),
                'CQL_FILTER': indate
            },
        })
    });

    map.addLayer(imdlayer);
    map.addLayer(MahaDist);
    console.log(imdlayer.getSource());

}
// console.log("propname:" + propname + ";rain1:" + (parseInt(rain_class2)) + ";rain2:" + (parseInt(rain_class2) + 0.1) + ";rain3:" + (parseInt(rain_class3)) + ";rain4:" + (parseInt(rain_class3) + 0.1) + ";rain5:" + (parseInt(rain_class4)) + ";rain6:" + (parseInt(rain_class4) + 0.1))

// loadMap(mindate);

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

    var md = new Date(mindate),
        mmonth = '' + (md.getMonth() + 1),
        mday = '' + md.getDate(),
        myear = md.getFullYear();

    if (mmonth.length < 2)
        mmonth = '0' + mmonth;
    if (mday.length < 2)
        mday = '0' + mday;
    mdate = [mday, mmonth, myear].join('-');
    // console.log(fromdate)
    // console.log(mdate)
    document.getElementById("today").innerHTML = "( " + fromdate + " - " + todaydate + " )";
    var el = document.getElementById('info');


    el.innerHTML = "Forecast  on Date: " + disdate;

    // document.getElementById('rainclass1').innerHTML = (parseInt(rain_class1)) + " to " + (parseInt(rain_class2));
    // document.getElementById('rainclass2').innerHTML = (parseInt(rain_class2) + 0.1) + " to " + (parseInt(rain_class3));
    // document.getElementById('rainclass3').innerHTML = (parseInt(rain_class3) + 0.1) + " to " + (parseInt(rain_class4));
    // document.getElementById('rainclass4').innerHTML = (parseInt(rain_class4) + 0.1) + " and above ";
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
    // updateInfo();
}
setTime();

var stop = function() {
    if (animationId !== null) {
        window.clearInterval(animationId);
        animationId = null;
    }
};

function nextTime() {
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

    loadMap(sdate)


    if (sdate == edate) {

        startDate = new Date(todate);
        console.log("stop loop")
        stop();

    }

    stop();
}

function prevTime() {
    startDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);

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
    var md = new Date(mindate),
        mmonth = '' + (md.getMonth() + 1),
        mday = '' + md.getDate(),
        myear = md.getFullYear();

    if (mmonth.length < 2)
        mmonth = '0' + mmonth;
    if (mday.length < 2)
        mday = '0' + mday;
    mdate = [mday, mmonth, myear].join('-');
    console.log("startDate" + startDate)
    console.log("md" + md)
        // loadMap(sdate)



    // startDate.setMinutes(startDate.getTime() + 24 * 60 * 60 * 1000);

    if (startDate < md) {
        startDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        stop();
    } else if (sdate == edate) {

        startDate = new Date(todate);
        console.log("stop loop")
        stop();
    } else {
        loadMap(sdate)
        updateInfo();
        stop();
    }

    stop();
}

var play = function() {
    stop();
    animationId = window.setInterval(setTime, 5000);
};

var i = 1;

var prev = function() {
    stop();
    animationId = window.setInterval(prevTime, 1000);
};

var next = function() {
    stop();
    animationId = window.setInterval(nextTime, 1000);
};


var startButton = document.getElementById('play');
startButton.addEventListener('click', play, false);

var stopButton = document.getElementById('pause');
stopButton.addEventListener('click', stop, false);

var prevButton = document.getElementById('prev');
prevButton.addEventListener('click', prev, false);

var nextButton = document.getElementById('next');
nextButton.addEventListener('click', next, false);

// updateInfo();

map.on('singleclick', function(evt) {
    overlay.setPosition(undefined);
    closer.blur();
    var coordinate = evt.coordinate;
    var viewResolution = /** @type {number} */ (view.getResolution());
    map.forEachLayerAtPixel(evt.pixel, function(feature, layer) {
        // console.log(layer);
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
                    content.innerHTML = '<table class="table table-bordered" style="border:1px solid black;width: 100%;color:black"><tr ><td style="background-color:skyblue;text-align:center;font-weight:bold;" colspan=2 >IMD Weather Forecast Attribute Information</td></tr><tr><td style="text-align: left">District </td><td style="text-align: left">' + jsondata.features[0].properties.dtnname + '</td></tr><tr><td style="text-align: left">Taluka </td><td style="text-align: left">' + jsondata.features[0].properties.thnname + '</td></tr><tr><td style="text-align: left">Forecast Date </td><td style="text-align: left">' + jsondata.features[0].properties.forecast_date + '</td></tr><tr><td style="text-align: left">Rainfall (mm) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.rainfall_mm) + '</td></tr><tr><td style="text-align: left">Maximum Temprature &#8451; </td><td style="text-align: left ">' + parseFloat(jsondata.features[0].properties.temp_max_deg_c) + '</td></tr><tr><td style="text-align: left">Minimum Temprature &#8451; </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.temp_min_deg_c) + '</td></tr><tr><td style="text-align: left">Wind Speed(m/s) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.wind_speed_ms) + '</td></tr><tr><td style="text-align: left">Wind Direction</td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.wind_direction_deg) + '</td></tr><tr><td style="text-align: left">Humidity 1 (%) </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.humidity_1) + '</td></tr><tr><td style="text-align: left">Humidity 2 (%)</td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.humidity_2) + '</td></tr><tr><td style="text-align: left">Cloud Cover </td><td style="text-align: left">' + parseFloat(jsondata.features[0].properties.cloud_cover_octa) + '</td></tr><tr></table>';
                    overlay.setPosition(coordinate);
                }
            });
    }

});

function changeMap() {
    // alert(sdate)
    loadMap(sdate);

}