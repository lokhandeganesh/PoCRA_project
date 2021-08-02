var geojson;

function showVal() {
    var sliderRange = document.getElementById("myRange");
    sliderRange.max = dates.length - 1;
    // alert(dates[sliderRange.value].slice(0, 10))
    loadMap(dates[sliderRange.value].slice(0, 10))
}

var dates = [];
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
var lngtat = ol.proj.transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857');
var map = new ol.Map({
    view: new ol.View({
        center: lngtat,
        zoom: 6.5
    }),
    layers: [
        topo, MahaDist
    ],
    target: 'map'
})


var menu = new ol.control.Overlay({
    closeBox: true,
    className: "slide-left menu ol-visible",
    content: $("#menu").get(0)
});
map.addControl(menu);

// A toggle control to show/hide the menu
var t = new ol.control.Toggle({
    html: '<i class="fa fa-bars" ></i>',
    className: "menu",
    title: "Menu",
    collapsed: false,
    onToggle: function() { menu.toggle(); }
});
map.addControl(t);

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

var subdivisionStyle = [subdivisionBoundaryStyle, subdivisionLabelStyle];
var forcastcolor = [
    [0, 2, '#ffd380'],
    [2.1, 4, '#ffaa01'],
    [4.1, 6, '#98e500'],
    [6.1, 10, '#1c6b00']
];

// getForcastData();
getseries();
loadMap1();

function loadMap1() {
    // alert("call map1")
    var inputdate = new Date("2021-05-08");

    // alert(dates[sliderRange.value].slice(0, 10));

    // var inputdate = new Date(10);
    // if(inputdate.getDate().toString.length==1){
    //     console.log("0"+ (inputdate.getDate()))
    // }


    if (geojson) {
        map.removeLayer(geojson);
    }

    var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Taluka&outputFormat=application/json";
    geojson = new ol.layer.Vector({
        title: "Subdivision",
        source: new ol.source.Vector({
            url: url,
            format: new ol.format.GeoJSON()
        }),
        style: function(feature) {
            var medinc = getForecast(parseInt(feature.get("thncode")), inputdate);
            var fillColor;
            for (var i = 0; i < forcastcolor.length; i++) {
                if (medinc >= forcastcolor[i][0] && medinc < forcastcolor[i][1]) {
                    fillColor = forcastcolor[i][2]
                }
            }
            style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: fillColor
                }),
                stroke: new ol.style.Stroke({
                    color: [0, 0, 0, 1],
                    width: 0.5
                }),
                text: new ol.style.Text({
                    text: feature.get("thnname"),
                    fill: new ol.style.Fill({
                        color: 'Black'
                    }),
                    textAlign: 'center'
                })
            });

            return style;
        },
    });
    geojson.getSource().on('addfeature', function() {
        //alert(geojson.getSource().getExtent());
        map.getView().fit(
            geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
        );
    });


    map.addLayer(geojson);
}


function loadMap(inputdate) {
    // alert(inputdate)
    // alert("call map2")
    // alert(dates[sliderRange.value].slice(0, 10));

    // var inputdate = new Date(10);
    // if(inputdate.getDate().toString.length==1){
    //     console.log("0"+ (inputdate.getDate()))
    // }


    if (geojson) {
        map.removeLayer(geojson);
    }

    var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Taluka&outputFormat=application/json";
    geojson = new ol.layer.Vector({
        title: "Subdivision",
        source: new ol.source.Vector({
            url: url,
            format: new ol.format.GeoJSON()
        }),
        style: function(feature) {
            var medinc = getForecast(parseInt(feature.get("thncode")), inputdate);
            var fillColor;
            for (var i = 0; i < forcastcolor.length; i++) {
                if (medinc >= forcastcolor[i][0] && medinc < forcastcolor[i][1]) {
                    fillColor = forcastcolor[i][2]
                }
            }
            style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: fillColor
                }),
                stroke: new ol.style.Stroke({
                    color: [0, 0, 0, 1],
                    width: 0.5
                }),
                text: new ol.style.Text({
                    text: feature.get("thnname"),
                    fill: new ol.style.Fill({
                        color: 'yellow'
                    }),
                    textAlign: 'center'
                })
            });

            return style;
        },
    });
    geojson.getSource().on('addfeature', function() {
        //alert(geojson.getSource().getExtent());
        map.getView().fit(
            geojson.getSource().getExtent(), { duration: 1590, size: map.getSize() - 100 }
        );
    });


    map.addLayer(geojson);
}


// var vectorLayer = new ol.layer.Vector({
//     source: new ol.source.Vector({
//         url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Taluka&outputFormat=application/json',
//         format: new ol.format.GeoJSON()
//     }),
//     style: function (feature, resolution) {
//         var styles = [
//             // linestring
//             new ol.style.Style({
//                 stroke: new ol.style.Stroke({
//                     color: '#ffcc33',
//                     width: 2
//                 }),
//                 fill: new ol.style.Fill({
//                     color: 'rgba(255,0,0,0.5)'
//                 })
//             })
//         ];
//         var mygeomType = feature.getGeometry().getType();
//         //handle the case of polygons/multipolygons
//         var retGeom = null;
//         if (mygeomType === 'MultiPolygon') {
//             retGeom = feature.getGeometry().getInteriorPoints();
//         }
//         if (mygeomType === 'Polygon') {
//             retGeom = feature.getGeometry().getInteriorPoint();
//         }
//         styles.push(new ol.style.Style({
//             geometry: retGeom,
//             image: new ol.style.Icon({
//                 src: 'http://openlayers.org/en/master/examples/data/icon.png',
//                 anchor: [0.75, 0.5],
//                 rotateWithView: true
//             })
//         }));
//         return styles;
//     }
// });


// console.log(getForecast("3960"));
// var talukadata = getForecast("3960");
// // console.log(talukadata);
// // for (var j in talukadata) {
// console.log(talukadata);

// }
// var dates= new Set();


function getseries() {
    var d = new Date("2021-05-07");
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

function getForecast(talukaCode, inputdate) {
    // console.log(talukaCode)
    // alert(inputdate)
    var request = new XMLHttpRequest();
    // POST to httpbin which returns the POST data as JSON

    request.open('get', './forecast.json', /* async = */ false);
    request.send();
    // $('#loading-image').show();
    // $.ajax({
    //     url: './forecast.json',
    //     cache: false,
    //     success: function (response) {
    //         // var data = JSON.parse(request.response);
    //         console.log(response)
    //     },
    //     complete: function () {
    //         $('#loading-image').hide();
    //     }
    // });

    var data = JSON.parse(request.response);
    var jsonData = data.data;
    var month, day;
    var d = new Date(inputdate);


    if (((d.getMonth() + 1).toString).length == 1) {
        month = "0" + (d.getMonth() + 1);
    } else {
        month = (d.getMonth() + 1);
    }
    console.log("date length:-" + (d.getDate()))
    if ((d.getDate() >= 0) && (d.getDate() <= 9)) {
        day = "0" + (d.getDate());
    } else {
        day = (d.getDate());
    }
    var today = d.getFullYear() + "-" + month + "-" + (day);

    // console.log(d.getFullYear()+"-"+month+"-"+day)
    // console.log(month)
    console.log(today)
    for (var i in jsonData) {
        var key = i;
        var val = jsonData[i];
        if (key == talukaCode) {
            for (var j in val) {
                // console.log(j)
                if (j === today) {
                    return val[j].rainfall;
                    // console.log("rainfall:"+val[j].rainfall) 
                    // console.log("temp_max:"+val[j].temp_max) 
                    // console.log("temp_min:"+val[j].temp_min) 
                    // console.log("humidity_1:"+val[j].humidity_1) 
                    // console.log("humidity_2:"+val[j].humidity_2) 
                    // console.log(val[j].wind_speed) 
                    // console.log(val[j].wind_direction) 
                    // console.log(val[j].cloud_cover) 

                }
            }
        }
    }
}