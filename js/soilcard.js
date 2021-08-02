var district, geojson, geojson1;
getDisdrict();
// Attribution Control
var attributionControl = new ol.control.Attribution({
    collapsible: true
})
// Map object

var extentforLayer;
// =============================== Base Layers ===============================
var osm = new ol.layer.Tile({
    type: 'base',
    title: 'Osm Base Map',
    visible: true,
    source: new ol.source.OSM()
});

var topo = new ol.layer.Tile({
    title: 'Topo Map',
    type: 'base',
    visible: true,
    source: new ol.source.XYZ({
        attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}', crossOrigin: 'Anonymous',
    })
});

var bing = new ol.layer.Tile({
    title: 'Satellite Map',
    type: 'base',
    visible: false,
    source: new ol.source.BingMaps({
        key: 'Agewfwr4IfkyAcCkaopR6tEbp2QPzDKJYSuow6YAN3tiU7_PYVvoyXBo32TpL4qE',
        imagerySet: 'AerialWithLabels'
    })
});
var street = new ol.layer.Tile({
    title: 'Street Map',
    type: 'base',
    visible: false,
    source: new ol.source.BingMaps({
        key: 'Agewfwr4IfkyAcCkaopR6tEbp2QPzDKJYSuow6YAN3tiU7_PYVvoyXBo32TpL4qE',
        imagerySet: 'Road'
    })
});

var nomap = new ol.layer.Tile({
    title: 'No Base Map',
    type: 'base',
    source: new ol.source.XYZ({
        url: ''
    })
});

var latLong = '&nbsp;&nbsp; Latitude : {y}, &nbsp;&nbsp; Longitude: {x} &nbsp;&nbsp;';
//    var wgs84Sphere = new ol.Sphere(6378137);
var scaleLineControl = new ol.control.ScaleLine({
    units: 'metric',
    type: 'scalebar',
    steps: 2
});
var mouse = new ol.control.MousePosition({
    projection: 'EPSG:4326',
    coordinateFormat: function (coordinate) {
        return ol.coordinate.format(coordinate, latLong, 4);
    }
});

var center = ol.proj.transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857');
view = new ol.View({
    center: center,
    zoom: 6.8
});

//------------------------on click display table-------------------------
var container = document.getElementById('popup');
var container1 = document.getElementById('popup1');
var content = document.getElementById('popup-content');
var content1 = document.getElementById('popup-content1');
var content2 = document.getElementById('legend');
var closer = document.getElementById('popup-closer');
closer.onclick = function () {
    overlay.setPosition(center);
    closer.blur();
    return false;
};
closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};
var overlay = new ol.Overlay(({
    element: container
}));
var overlay = new ol.Overlay({
    element: container,
    positioning: 'center-center'
});
var overlay1 = new ol.Overlay({
    element: container1,
    positioning: 'center-right'
});

// var overlay2 = new ol.Overlay({
//     element: content2,
//     positioning: 'left-left'
// });

var MahaAdmin = new ol.layer.Tile({
    title: "State",
    source: new ol.source.TileWMS({
        url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
        crossOrigin: 'Anonymous',
        serverType: 'geoserver',
        visible: true,
        params: {
            'LAYERS': 'PoCRA:MahaAdmin',
            'TILED': true,
        }
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
var rejected_point = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/geonode/wms',
        serverType: 'geoserver',
        params: {
            'LAYERS': 'geonode:tbl_rejected_point',
            'TILED': true
        }
    }),
    visible: false
});

// Popup overlay
var popup = new ol.Overlay.Popup(
    {
        popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
        closeBox: true,
        onshow: function () { console.log("You opened the box"); },
        onclose: function () { console.log("You close the box"); },
        positioning: 'top-center',
        autoPan: true,
        autoPanAnimation: { duration: 250 }
    });


layerList = [topo, MahaDist];

map = new ol.Map({
    overlays: [popup, overlay, overlay1],
    controls: ol.control.defaults({
        attribution: false
    }).extend([mouse, scaleLineControl]),
    target: 'map',
    layers: layerList,//featurelayer
    view: view
});



const mapView = map.getView();


var menu = new ol.control.Overlay({
    closeBox: true,
    className: "slide-left menu ol-visible",
    content: $("#menu").get(0)
});
map.addControl(menu);

// A toggle control to show/hide the menu
var t = new ol.control.Toggle(
    {
        html: '<i class="fa fa-bars" ></i>',
        className: "menu",
        title: "Menu",
        collapsed: false,
        onToggle: function () { menu.toggle(); }
    });
map.addControl(t);

// Print control
// var printControl = new ol.control.Print();
// map.addControl(printControl);


map.getLayers().forEach(function (layer, i) {

    bindInputs('#layer' + i, layer);
});

// map.getLayers().forEach(layer => {
//     if (layer === layer.get('name')) {
//       console.log(layer.get('name'))
//     }
// });


function bindInputs(layerid, layer) {

    var visibilityInput = $(layerid + ' input.visible');
    // alert(layerid)
    // console.log(visibilityInput)
    visibilityInput.on('change', function (evt) {
        // alert(layerid)
        // if(layer.get('name')){
        //     console.log(layer.get('name'))
        // }
        // addRowToLegent(layer);
        layer.setVisible(this.checked);

    });
    visibilityInput.prop('checked', layer.getVisible());
    var opacityInput = $(layerid + ' input.opacity');
    opacityInput.on('input change', function () {
        layer.setOpacity(parseFloat(this.value));
    });
    opacityInput.val(String(layer.getOpacity()));
}


function show_sub() {
    var selectData = document.getElementById("id_component").value;
    // console.log(selectData)
    // cat.getElementsByTagName("ul")[0].style.display = (cat.getElementsByTagName("ul")[0].style.display == "none") ? "inline" : "none";
}

function getDisdrict() {
    var ele = document.getElementById("district");
    ele.innerHTML = "<option value='-1'>--Select--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/districts", success: function (result) {
            for (var i = 0; i < result.district.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.district[i]["dtncode"] + '">' + result.district[i]["dtnname"] + '</option>';
            }

        }
    });
}
function addMapTolayer(lName, cqlparam) {
    // alert(cqlparam)
    legend();
    var district = new ol.layer.Tile({
        title: lName,
        source: new ol.source.TileWMS({
            url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
            crossOrigin: 'Anonymous',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'PoCRA:' + lName,
                'TILED': true,
                "CQL_FILTER": cqlparam
            }
        }),

    });
    map.addLayer(district)
}

function addMapTolayer2(lName) {
    var district = new ol.layer.Tile({
        title: lName,
        source: new ol.source.TileWMS({
            url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
            crossOrigin: 'Anonymous',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'PoCRA:' + lName,
                'TILED': true
            }
        })
    });
    map.addLayer(district);
}
function addMapTolayer1(lName, type) {
    var district = document.getElementById("district").value;
    var subdivision = document.getElementById("division").value;
    var taluka = document.getElementById("taluka").value;
    var village = document.getElementById("village").value;
    var layer = new ol.layer.Tile({
        extent: extentforLayer,
        title: lName,
        type: type,
        source: new ol.source.TileWMS({
            url: 'http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/wms',
            crossOrigin: 'Anonymous',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'PoCRA:' + lName,
                'TILED': true
            }
        })

    });
    if (district !== "-1" && subdivision === "-1" && taluka === "-1" && village === "-1") {
        map.getLayers().forEach(function (layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "District", "dtncode", district);
    } else if (district !== "-1" && subdivision !== "-1" && taluka === "-1" && village === "-1") {
        map.getLayers().forEach(function (layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "Subdivision", "sdcode", subdivision);
    } else if (district !== "-1" && subdivision !== "-1" && taluka !== "-1" && village === "-1") {
        map.getLayers().forEach(function (layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "Taluka", "thncode", taluka);
    } else if (district !== "-1" && subdivision !== "-1" && taluka !== "-1" && village !== "-1") {
        map.getLayers().forEach(function (layer, i) {
            if (map.getLayers().item(i).get('title') === type) {
                map.removeLayer(layer)
            }
        });
        map.addLayer(layer)
        croplayer(lName, "Village", "vincode", village);
    }



}

function getSubdivision(dtncode) {
    var ele = document.getElementById("division");
    ele.innerHTML = "<option value='-1'>--Select--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/subdivision?dtncode=" + dtncode, success: function (result) {
            console.log(result)
            for (var i = 0; i < result.taluka.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.taluka[i]["sdcode"] + '">' + result.taluka[i]["sdname"] + '</option>';
            }

        }
    });

    query('District', 'dtncode', dtncode, 'dtnname');
    // query('Subdivision', 'dtncode', dtncode, 'dtnname');
    legend();

    // addMapTolayer("District", "dtncode='" + dtncode + "'");
    // addMapTolayer("Taluka", "dtncode='" + dtncode + "'");
}




function getTaluka(dtncode) {
    var ele = document.getElementById("taluka");
    ele.innerHTML = "<option value='-1'>--Select--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/taluka?dtncode=" + dtncode, success: function (result) {
            for (var i = 0; i < result.taluka.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.taluka[i]["thncode"] + '">' + result.taluka[i]["thnname"] + '</option>';
            }

        }
    });

    query('Subdivision', 'sdcode', dtncode, 'dtnname');
    legend();

    // addMapTolayer("District", "dtncode='" + dtncode + "'");
    // addMapTolayer("Taluka", "dtncode='" + dtncode + "'");
}
function getVillage(thncode) {
    var ele = document.getElementById("village");
    ele.innerHTML = "<option value='-1'>--Select--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/village?thncode=" + thncode, success: function (result) {
            for (var i = 0; i < result.village.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.village[i]["vincode"] + '">' + result.village[i]["vinname"] + '</option>';
            }

        }
    });
    query('Taluka', 'thncode', thncode, 'thnname');
    legend();
    // addMapTolayer("Taluka", "thncode='" + thncode + "'");
    // addMapTolayer("Village", "thncode='" + thncode + "'");
    // alert("kh")

}

function getVillageData(vincode) {
    var ele = document.getElementById("surveyno");
    ele.innerHTML = "<option value='-1'>--Select--</option>";
    $.ajax({
        url: "http://gis.mahapocra.gov.in/weatherservices/meta/surveynos?vincode=" + vincode, success: function (result) {
            for (var i = 0; i < result.district.length; i++) {
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + result.district[i]["pin"] + '">' + result.district[i]["pin"] + '</option>';
            }

        }
    });
    query('Village', 'vincode', vincode, 'vil_name');
    // query('Village', 'vincode', vincode, 'vil_name');
    // addMapTolayer("Village", "vincode='" + vincode + "'");
    legend();
    // alert("kh")
}

function getSurveyData(surveyno) {
    var vincode = document.getElementById("village").value;
    // var ele = document.getElementById("surveyno");
    // ele.innerHTML = "<option value='-1'>--Select--</option>";
    // $.ajax({
    //     url: "http://gis.mahapocra.gov.in/weatherservices/meta/surveynos?vincode=" + vincode, success: function (result) {
    //         for (var i = 0; i < result.district.length; i++) {
    //             ele.innerHTML = ele.innerHTML +
    //                 '<option value="' + result.district[i]["pin"] + '">' + result.district[i]["pin"] + '</option>';
    //         }

    //     }
    // });
    query('Cadastral', 'pin,vincode', surveyno + "," + vincode, 'vil_name');
    // query('Village', 'vincode', vincode, 'vil_name');
    // addMapTolayer("Village", "vincode='" + vincode + "'");
    legend();
    // alert("kh")
}

function wms_layers() {
    if (document.getElementById("district").value === "-1") {
        alert("Select District from panel")
    } else {
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function () {
            modal.style.display = "none";
        }
    }

    // getDisdrict();

}
// function wms_layers() {
//     // var modal = document.getElementById("myModal");
//     // modal.style.display = "block";
//     // var span = document.getElementsByClassName("close")[0];
//     // span.onclick = function () {
//     //     modal.style.display = "none";
//     // }
//     // getDisdrict();

// }


function GetSelected() {
    //Reference the Table.

    var grid = document.getElementById("Table1");

    //Reference the CheckBoxes in Table.
    var checkBoxes = grid.getElementsByTagName("INPUT");
    var message = "";

    //Loop through the CheckBoxes.
    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            var row = checkBoxes[i].parentNode.parentNode;
            message += row.cells[1].innerHTML;
            message += "   " + row.cells[2].innerHTML;
            // message += "   " + row.cells[3].innerHTML;
            message += "\n";
            // alert(row.cells[2].innerHTML)
            var layerName12 = row.cells[2].innerHTML;
            addMapTolayer1(layerName12);
            legend();
        }

    }
    for (var i = 0; i < checkBoxes.length; i++) {
        if (!checkBoxes[i].checked) {
            var row = checkBoxes[i].parentNode.parentNode;
            var layerName1 = row.cells[2].innerHTML;
            //    alert(layerName12)
            map.removeLayer(layerName1);
        }

    }


    //Display selected Row data in Alert Box.
    // alert(message);
}

function checkboxevt(val) {

    if (val.checked) {
        // alert(val.value)
        if (val.value === "Settlement") {
            addMapTolayer1(val.value, "otherlayer");
            legend();
        } else if (val.value === "Structures") {
            addMapTolayer1(val.value, "otherlayer");
            legend();
        } else if (val.value === "Cadastral_Kalmnuri") {
            addMapTolayer1(val.value, "otherlayer");
            legend();
        } else {
            addMapTolayer2(val.value);
            legend();
        }
    } else {
        var chkName = val.value;
        map.getLayers().forEach(function (layer, i) {
            if (map.getLayers().item(i).get('title') === chkName) {
                map.removeLayer(layer);
            }
        });
    }

}

var districtLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#ee7300'
        }),
        stroke: new ol.style.Stroke({
            color: '#232323',
            width: 3
        })
    })
});

// ================ District Style =====================
var districtLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});
var districtBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#232323',
        width: 3,
        // linejoin:'bevel',
        lineDash: [4, 8],
        lineDashOffset: 6
    })
});


var districtBoundaryStyle1 = new ol.style.Style({

    stroke: new ol.style.Stroke({
        color: '#ee7300',
        width: 3,
        // linejoin:'bevel',
        lineDash: [4, 8]
    })
});
var districtStyle = [districtBoundaryStyle, districtBoundaryStyle1, districtLabelStyle];

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
// ===============================================

// ================ Taluka Style =====================
var talukaLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});
var talukaBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#232323',
        width: 1.5,
        // linejoin:'bevel',
        lineDash: [4, 8],
        lineDashOffset: 6
    })
});
var talukaBoundaryStyle1 = new ol.style.Style({

    stroke: new ol.style.Stroke({
        color: '#ee7300',
        width: 1.5,
        lineDash: [4, 8]
    })
});
var talukaStyle = [talukaBoundaryStyle, talukaBoundaryStyle1, talukaLabelStyle];
// ===============================================

// ================ Taluka Style =====================
var villageLabelStyle = new ol.style.Style({
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
            color: '#000'
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 4
        })
    })
});
var villageBoundaryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#232323',
        width: 1

    })
});

var villageStyle = [villageBoundaryStyle, villageLabelStyle];
// ===============================================



function query(layerName, paramName, paramValue, labelname) {
    map.getLayers().forEach(function (layer, i) {
        if (map.getLayers().item(i).get('title') === "State") {
            map.removeLayer(layer);
        }
    });

    // map.removeLayer(geojson);
    if (geojson) {
        map.removeLayer(geojson);
    }
    if (geojson1) {
        map.removeLayer(geojson1);
    }

    if (layerName === "District") {
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = feature.getGeometry().getExtent();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                extentforLayer = extent;
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                districtLabelStyle.setGeometry(geometry);
                districtLabelStyle.getText().setText(feature.get('dtnname'));
                districtLabelStyle.getText().setTextAlign(textAlign);
                return districtStyle;
            },
        });
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Subdivision&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: "Subdivision",
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = feature.getGeometry().getExtent();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }

                subdivisionLabelStyle.setGeometry(geometry);
                subdivisionLabelStyle.getText().setText(feature.get('subdivisio'));
                subdivisionLabelStyle.getText().setTextAlign(textAlign);
                return subdivisionStyle;
            },
        });
        geojson.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(),
                { duration: 1590, size: map.getSize() - 100 }
            );
        });

        geojson1.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(),
                { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);

    } else if (layerName === "Subdivision") {

        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = feature.getGeometry().getExtent();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                extentforLayer = extent;
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                subdivisionLabelStyle.setGeometry(geometry);
                subdivisionLabelStyle.getText().setText(feature.get('subdivisio'));
                subdivisionLabelStyle.getText().setTextAlign(textAlign);
                return subdivisionStyle;
            },
        });

        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Taluka&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var extent = feature.getGeometry().getExtent();
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                // var mask = new ol.filter.Mask({ feature: feature, inner:false, fill: new ol.style.Fill({ color:[255,255,255,0.8] }) });
                // topo.addFilter(mask);

                talukaLabelStyle.setGeometry(geometry);
                talukaLabelStyle.getText().setText(feature.get('thnname'));
                talukaLabelStyle.getText().setTextAlign(textAlign);
                return talukaStyle;
            },
        });
        geojson.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(),
                { duration: 1590, size: map.getSize() - 100 }
            );
        });

        geojson1.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(),
                { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);

    } else if (layerName === "Taluka") {
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                // var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var extent = feature.getGeometry().getExtent();
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);

                extentforLayer = extent;
                talukaLabelStyle.setGeometry(geometry);
                talukaLabelStyle.getText().setText(feature.get('thnname'));
                talukaLabelStyle.getText().setTextAlign(textAlign);
                return talukaStyle;
            },
        });
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Village&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: "Village",
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }

                villageLabelStyle.setGeometry(geometry);
                villageLabelStyle.getText().setText(feature.get('vilname'));
                villageLabelStyle.getText().setTextAlign(textAlign);
                return villageStyle;
            },
        });
        geojson.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(),
                { duration: 1590, size: map.getSize() - 100 }
            );
        });


        geojson1.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(),
                { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);
    }
    else if (layerName === "Village") {
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + layerName + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson = new ol.layer.Vector({
            title: layerName,
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }
                // var crop = new ol.filter.Crop({ feature: feature, inner:false });
                // topo.addFilter(crop);
                var mask = new ol.filter.Mask({ feature: feature, inner: false, fill: new ol.style.Fill({ color: [255, 255, 255, 0.8] }) });
                topo.addFilter(mask);
                extentforLayer = extent;
                villageLabelStyle.setGeometry(geometry);
                villageLabelStyle.getText().setText(feature.get('vilname'));
                villageLabelStyle.getText().setTextAlign(textAlign);
                return villageStyle;
            },
        });

        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Cadastral_Aurangabad&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: "Cadastral_Aurangabad",
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }

                villageLabelStyle.setGeometry(geometry);
                villageLabelStyle.getText().setText(feature.get('pin'));
                villageLabelStyle.getText().setTextAlign(textAlign);
                return villageStyle;
            },
        });
        geojson.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson.getSource().getExtent(),
                { duration: 1590, size: map.getSize() - 100 }
            );
        });


        geojson1.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(),
                { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);
    }
    else if (layerName === "Cadastral") {


        var pinvalue = "pin in ('" + paramValue.split(",")[0] + "')";
        var vinvalue = "vincode in ('" + paramValue.split(",")[1] + "')";
        var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Cadastral_Aurangabad&CQL_FILTER=" + pinvalue + " and " + vinvalue + "&outputFormat=application/json";
        geojson1 = new ol.layer.Vector({
            title: "Cadastral_Aurangabad",
            source: new ol.source.Vector({
                url: url,
                format: new ol.format.GeoJSON()
            }),
            style: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getType() == 'MultiPolygon') {
                    // Only render label for the widest polygon of a multipolygon
                    var polygons = geometry.getPolygons();
                    var widest = 0;
                    for (var i = 0, ii = polygons.length; i < ii; ++i) {
                        var polygon = polygons[i];
                        var width = ol.extent.getWidth(polygon.getExtent());
                        if (width > widest) {
                            widest = width;
                            geometry = polygon;
                        }
                    }
                }
                // Check if default label position fits in the view and move it inside if necessary
                geometry = geometry.getInteriorPoint();
                var size = map.getSize();
                var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                var textAlign = 'center';
                var coordinates = geometry.getCoordinates();
                if (!geometry.intersectsExtent(extent)) {
                    geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                    // Align text if at either side
                    var x = geometry.getCoordinates()[0];
                    if (x > coordinates[0]) {
                        textAlign = 'left';
                    }
                    if (x < coordinates[0]) {
                        textAlign = 'right';
                    }
                }

                villageLabelStyle.setGeometry(geometry);
                villageLabelStyle.getText().setText(feature.get('pin'));
                villageLabelStyle.getText().setTextAlign(textAlign);
                return villageStyle;
            },
        });

        geojson1.getSource().on('addfeature', function () {
            //alert(geojson.getSource().getExtent());
            map.getView().fit(
                geojson1.getSource().getExtent(),
                { duration: 1590, size: map.getSize() - 100 }
            );
        });
        map.addLayer(geojson1);
        map.addLayer(geojson);
    }
}
var layers_names = [];

function legend() {
    $('#legend').empty();
    var no_layers = map.getLayers().get('length');
    var head = document.createElement("h4");

    var txt = document.createTextNode("Legend");

    head.appendChild(txt);
    var element = document.getElementById("legend");
    element.appendChild(head);
    var ar = [];

    var i;
    var zone;
    var values = [];
    var testVals = {}
    for (i = 0; i < no_layers; i++) {
        console.log(map.getLayers().item(i).get('title'))
        ar.push("http://gis.mahapocra.gov.in/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + map.getLayers().item(i).get('title'));
        layers_names.push(map.getLayers().item(i).get('title'))

        // layers_names.push(map.getLayers().item(i).get('title'))
    }


    ar = ar.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
    });
    layers_names = layers_names.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
    });

    for (i = 0; i < ar.length; i++) {
        var head = document.createElement("p");
        var img = new Image();
        img.src = ar[i];
        var src = document.getElementById("legend");

        if (src.value === "undifined") {
        } else {
            src.appendChild(img);
        }
    }

    // reOrderLayer();
}

// legend();
var currentValue = "";
function radioChange(rdoValue) {
    if (document.getElementById("district").value === "-1") {
        alert("Select District")
        rdoValue.checked = false;
    } else {

        // alert('Old value: ' + currentValue);
        // alert('New value: ' + rdoValue.value);
        currentValue = rdoValue.value;
        addMapTolayer1(currentValue, "baselayer");
        legend();
    }

}

var dims = {
    a0: [1189, 841],
    a1: [841, 594],
    a2: [594, 420],
    a3: [420, 297],
    a4: [297, 210],
    a5: [210, 148],
};
var exportButton = document.getElementById('export-pdf');

exportButton.addEventListener(
    'click',
    function () {
        exportButton.disabled = true;
        document.body.style.cursor = 'progress';

        var format = document.getElementById('format').value;
        var resolution = document.getElementById('resolution').value;
        var dim = dims[format];
        var width = Math.round((dim[0] * resolution) / 25.4);
        var height = Math.round((dim[1] * resolution) / 25.4);
        var size = map.getSize();
        var viewResolution = map.getView().getResolution();

        map.once('rendercomplete', function () {
            var mapCanvas = document.createElement('canvas');
            mapCanvas.width = width;
            mapCanvas.height = height;
            var mapContext = mapCanvas.getContext('2d');
            Array.prototype.forEach.call(
                document.querySelectorAll('.ol-layer canvas'),
                function (canvas) {
                    if (canvas.width > 0) {
                        var opacity = canvas.parentNode.style.opacity;
                        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                        var transform = canvas.style.transform;
                        // Get the transform parameters from the style's transform matrix
                        var matrix = transform
                            .match(/^matrix\(([^\(]*)\)$/)[1]
                            .split(',')
                            .map(Number);
                        // Apply the transform to the export map context
                        CanvasRenderingContext2D.prototype.setTransform.apply(
                            mapContext,
                            matrix
                        );
                        mapContext.drawImage(canvas, 0, 0);
                    }
                }
            );
            var pdf = new jsPDF('landscape', undefined, format);
            //   var pdf = new jsPDF('p', 'pt', 'a4');
            // pdf.addHTML(document.getElementById("map"), 15, 15, "");
            pdf.addImage(
                mapCanvas.toDataURL('image/jpeg'),
                'JPEG',
                0,
                0,
                dim[0],
                dim[1]
            );
            pdf.save('map.pdf');
            // Reset original map size
            map.setSize(size);
            map.getView().setResolution(viewResolution);
            exportButton.disabled = false;
            document.body.style.cursor = 'auto';
        });

        // Set print size
        var printSize = [width, height];
        map.setSize(printSize);
        var scaling = Math.min(width / size[0], height / size[1]);
        map.getView().setResolution(viewResolution / scaling);
    },
    false
);

var imagesList
const imagesWidth = []
const imgDataList = []
const img = new Image();
var ImageToLoad = new Image();
function getImageFromUrl(url, callback) {
    // alert(url)
    ImageToLoad.crossOrigin = "Anonymous";

    ImageToLoad.onError = function () {
        console.log('Cannot load image: "' + url + '"');
    };

    ImageToLoad.onload = function () {
        alert("image is loaded");
    }

    ImageToLoad.onload = function () {
        imagesWidth.push({
            width: ImageToLoad.width,
            height: ImageToLoad.height
        })
        callback(ImageToLoad);
    };
    ImageToLoad.src = url;
    createPDF(ImageToLoad)
}
var format = document.getElementById('format').value;
var resolution = document.getElementById('resolution').value;
var dim = dims[format];
var width = Math.round((dim[0] * resolution) / 25.4);
var height = Math.round((dim[1] * resolution) / 25.4);
var pdf = new jsPDF('landscape', 'pt', 0);
function createPDF(imgData) {
    imgDataList.push(imgData)
    // var pwidth = doc.internal.pageSize.getWidth();
    // var pheight = doc.internal.pageSize.getHeight();
    var maxWidth = width - 40; // Max width for the image
    var maxHeight = height - 40;    // Max height for the image
    // var ratio = 0;  // Used for aspect ratio
    // var width = imgData.width;    // Current image width
    // var height = imgData.height;  // Current image height

    var xvar = 20;
    var yvar = 120;
    // Check if the current width is larger than the max
    if (width > maxWidth) {
        ratio = maxWidth / width;   // get ratio for scaling image
        // $(this).css("width", maxWidth); // Set new width
        // $(this).css("height", height * ratio);  // Scale height based on ratio
        height = height * ratio;    // Reset height to match scaled image
        width = width * ratio;    // Reset width to match scaled image
    }
    // Check if current height is larger than max
    if (height > maxHeight) {
        ratio = maxHeight / height; // get ratio for scaling image
        // $(this).css("height", maxHeight);   // Set new height
        // $(this).css("width", width * ratio);    // Scale width based on ratio
        width = width * ratio;    // Reset width to match scaled image
        height = height * ratio;    // Reset height to match scaled image
    }
    pdf.text(700, 90, 'Legend')
    pdf.rect(650, 70, 185, 490)
    if (imgDataList.length !== Object.keys(imagesList).length)
        yvar = yvar + imgData.height + 50;
    pdf.addImage({
        imageData: imgData,
        x: 660,
        y: yvar,
        w: imgData.width,
        h: imgData.height,
        angle: 0
    });



    // doc.addPage();
    if (imgDataList.length == Object.keys(imagesList).length) {
        // yvar=yvar+10;
        // pdf.text(700, 90, 'Legend')
        pdf.save("pocra_map.pdf");
        location.reload();
        //window.open(doc.output('bloburl'), '_blank');
    }
}


function CreatePDFfromHTML() {
    document.body.style.cursor = 'progress';


    var size = map.getSize();
    var viewResolution = map.getView().getResolution();

    var top_left_margin = 15;
    var PDF_Width = width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);



    var totalPDFPages = Math.ceil(height / PDF_Height) - 1;
    document.getElementById("menu").style.display = "None";
    // var pdf = new jsPDF('landscape', 'pt', [PDF_Width, PDF_Height]);
    document.getElementById("legend").style.display = "none";
    pdf.text(220, 50, 'NANAJI DESHMUKH KRUSHI SANJEEVANI PRAKALP')
    pdf.rect(5, 20, width - 10, 50);
    // jsPDFimages();

    html2canvas($("#content")[0]).then(function (canvas) {
        var imgDatanew = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgDatanew, 'JPG', 5, 70, width - 200, height - 100);
        pdf.rect(5, 70, width - 200, height - 100);
        jsPDFimages();
        document.getElementById("menu").style.display = "block";
        document.getElementById("legend").style.display = "block";

        // pdf.save("pocra_map.pdf");

    });

    document.body.style.cursor = 'auto';
}

function jsPDFimages() {
    var imagesListData = {}
    for (var i = 1; i < map.getLayers().get('length'); i++) {
        imagesListData["imag" + i] = "http://gis.mahapocra.gov.in/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + map.getLayers().item(i).get('title');
    }
    imagesList = imagesListData;
    console.log(imagesList)
    for (var item in imagesList) {
        getImageFromUrl(imagesList[item], createPDF);
    }

    // imagesList={ "imag1": "https://as2.ftcdn.net/jpg/00/42/98/87/500_F_42988762_JMNpHWOFWnbtCBZeYsRo5PmzD28rIquS.jpg", "imag2": "https://as2.ftcdn.net/jpg/00/42/98/87/500_F_42988762_JMNpHWOFWnbtCBZeYsRo5PmzD28rIquS.jpg" }
    // for (var item in imagesList) {
    //     getImageFromUrl(imagesList[item], createPDF);
    // }
}

// imagesList = {}
//     for(var i=1;i<map.getLayers().get('length');i++){
//         imagesList ["imag"+i] = "http://gis.mahapocra.gov.in/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + map.getLayers().item(i).get('title');
//         // imagesList ["token"+i] = "samplevalue2";
//     }
// console.log(JSON.stringify(imagesList))      


function croplayer(name, lname, paramName, paramValue) {
    legend();
    if (geojson) {
        map.removeLayer(geojson);
    }

    map.getLayers().forEach(function (layer, i) {
        // if (map.getLayers().item(i).get('title') === lname ) {
        //     map.removeLayer(layer)
        // }
        if (map.getLayers().item(i).get('title') === name) {
            var url = "http://gis.mahapocra.gov.in/geoserver/PoCRA_Dashboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + lname + "&CQL_FILTER=" + paramName + "+ILike+'" + paramValue + "'&outputFormat=application/json";
            geojson = new ol.layer.Vector({
                title: lname,
                source: new ol.source.Vector({
                    url: url,
                    format: new ol.format.GeoJSON()
                }),
                style: function (feature) {
                    var geometry = feature.getGeometry();
                    if (geometry.getType() == 'MultiPolygon') {
                        // Only render label for the widest polygon of a multipolygon
                        var polygons = geometry.getPolygons();
                        var widest = 0;
                        for (var i = 0, ii = polygons.length; i < ii; ++i) {
                            var polygon = polygons[i];
                            var width = ol.extent.getWidth(polygon.getExtent());
                            if (width > widest) {
                                widest = width;
                                geometry = polygon;
                            }
                        }
                    }
                    // Check if default label position fits in the view and move it inside if necessary
                    geometry = geometry.getInteriorPoint();
                    var size = map.getSize();
                    var extent = map.getView().calculateExtent([size[0] - 12, size[1] - 12]);
                    var textAlign = 'center';
                    var coordinates = geometry.getCoordinates();
                    if (!geometry.intersectsExtent(extent)) {
                        geometry = new ol.geom.Point(ol.geom.Polygon.fromExtent(extent).getClosestPoint(coordinates));
                        // Align text if at either side
                        var x = geometry.getCoordinates()[0];
                        if (x > coordinates[0]) {
                            textAlign = 'left';
                        }
                        if (x < coordinates[0]) {
                            textAlign = 'right';
                        }
                    }
                    var crop = new ol.filter.Crop({ feature: feature, inner: false });
                    layer.addFilter(crop);
                    if (lname === "District") {
                        query('District', paramName, paramValue, 'dtnname');
                        districtLabelStyle.setGeometry(geometry);
                        districtLabelStyle.getText().setText(feature.get('dtnname'));
                        districtLabelStyle.getText().setTextAlign(textAlign);
                        return districtStyle;
                    } else if (lname === "Subdivision") {
                        query('Subdivision', paramName, paramValue, 'thnname');
                        subdivisionLabelStyle.setGeometry(geometry);
                        subdivisionLabelStyle.getText().setText(feature.get('subdivisio'));
                        subdivisionLabelStyle.getText().setTextAlign(textAlign);
                        return subdivisionStyle;
                    } else if (lname === "Taluka") {
                        query('Taluka', paramName, paramValue, 'thnname');
                        talukaLabelStyle.setGeometry(geometry);
                        talukaLabelStyle.getText().setText(feature.get('thnname'));
                        talukaLabelStyle.getText().setTextAlign(textAlign);
                        return talukaStyle;
                    } else if (lname === "Village") {
                        query('Village', paramName, paramValue, 'vilname');
                        villageLabelStyle.setGeometry(geometry);
                        villageLabelStyle.getText().setText(feature.get('vilname'));
                        villageLabelStyle.getText().setTextAlign(textAlign);
                        return villageStyle;
                    }
                    // extentforLayer=extent;

                },
            });

            geojson.getSource().on('addfeature', function () {
                map.getView().fit(
                    geojson.getSource().getExtent(),
                    { duration: 1590, size: map.getSize() - 100 }
                );
            });
            map.addLayer(geojson);
        }
    });

}


function clearlayer() {
    location.reload();
}


// var selectClick = new ol.interaction.Select();
// map.addInteraction(selectClick);


// var select = new ol.interaction.Select();
// map.addInteraction(select);
// var selectedFeatures = select.getFeatures();

// selectClick.on('select', function(e) {
//     var featureSelected = e.selected[0];
//     var layer = selectClick.getLayer(featureSelected);
//     console.log(featureSelected.get('pin')); // here you have the selected layer
// });
// map.on('click', function (evt) {

//     map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
//         var farmername, surveyno, shcno;

//         var coordinate = evt.coordinate;


//         var customers = new Array();
//         var customers1 = new Array();
//         customers.push(["#", "District", "Taluka", "Village", "SHC No", "Farmer Name", "Survey No", "Khasara No","Soil Sample No","Sample Colletion Date"]);
//         var table = document.createElement("TABLE");
//         table.border = "1";
//         var columnCount = customers[0].length;
//         var row = table.insertRow(-1);
//         for (var i = 0; i < columnCount; i++) {
//             var headerCell = document.createElement("TH");
//             headerCell.innerHTML = customers[0][i];
//             row.appendChild(headerCell);
//         }
//         // soil_sample_no
//         $.ajax({
//             url: "http://gis.mahapocra.gov.in/weatherservices/meta/shcbasicinfo?vincode=" + feature.get('vincode') + '&pinno=' + feature.get('pin'), success: function (result) {
//                 for (var i = 0; i < result.basicInfo.length; i++) {
//                     customers1.push([i, result.basicInfo[i]["district"], result.basicInfo[i]["blockname"], result.basicInfo[i]["vinname"], result.basicInfo[i]["shc_no"], result.basicInfo[i]["farmer_name"],result.basicInfo[i]["surveyno"],result.basicInfo[i]["khasrano"],result.basicInfo[i]["soil_sample_no"], result.basicInfo[i]["sample_coll_date"]]);
//                 }
//                 for (var i = 1; i < customers1.length; i++) {
//                     row = table.insertRow(-1);
//                     for (var j = 0; j < columnCount; j++) {
//                         var cell = row.insertCell(-1);
//                         cell.innerHTML = customers1[i][j];
//                     }
//                 }
//             }
//         });


//         // for (var i = 1; i < customers.length; i++) {
//         //     row = table.insertRow(-1);
//         //     for (var j = 0; j < columnCount; j++) {
//         //         var cell = row.insertCell(-1);
//         //         cell.innerHTML = customers[i][j];
//         //     }
//         // }

//         // var html = '<tr style="height:30px;"><td style="padding-left:15px;">Farmer Name:</td><td style="height:30px;"><input type="text" style="width:100%;height:30px;border:none;padding-left:10px;" id="distcode" name="distcode" value=' + feature.get('pin') + ' readonly/></td></tr>\n\
//         //             <tr style="height:30px;"><td style="padding-left:15px;">Village:</td><td style="height:30px;"><input type="text" style="width:100%;height:30px;border:none;padding-left:10px;" name="talcode" value='  + feature.get('pin') + ' readonly  /></td></tr>\n\
//         //             <tr style="height:30px;"><td style="padding-left:15px;">Survey No:</td><td style="height:30px;"><input type="text" style="width:100%;height:30px;border:none;padding-left:10px;" name="villcode" value='  + feature.get('pin') + '  readonly /></td></tr>\n\
//         //             <tr style="height:30px;"><td style="padding-left:15px;">SHC No:</td><td style="height:30px;"><input type="text" style="width:100%;height:30px;border:none;padding-left:10px;" placeholder="  Enter Order Number" name="odrno" value='  + feature.get('pin') + ' readonly /></td></tr>\n\
//         //             <tr style="height:30px;"><td style="padding-left:15px;">Sample Collection Date:</td><td style="height:30px;"><input type="text" style="width:100%;height:30px;border:none;padding-left:10px;" name="feddate" value='  + feature.get('pin') + ' readonly></td></tr>\n\
//         //             </table>\n\
//         //             </div>';

//         content.innerHTML = "";
//         content.appendChild(table);
//         // content.innerHTML = '<div>' + html + '</div>';
//         overlay.setPosition(coordinate);
//         //    return feature.get('village_name');
//     });
//        var tname = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
//            ////console.log(feature);
//            return feature.get('taluka_name');
//        });
//        var dname = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
//            ////console.log(feature);
//            return feature.get('district_name');
//        });
//        var fdate = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
//            ////console.log(feature);
//            return feature.get('fed_date');
//        });
//        var odrno = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
//            ////console.log(feature);
//            return feature.get('order_no');
//        });

// });

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

// $('#addprimary').on('click', function () {
//     Markup.Collapsible();
// });

var Markup = new Object();



Markup.Collapsible = function () {
    $('#collapsible')
        .append($('<div>')
            .attr({
                'data-role': 'collapsible-set',
                'id': 'primary'
            }));


    $('#makecollapsible')
        .append($('<div>')
            .attr({
                'data-role': 'collapsible-set',
                'id': 'primary'
            }));
    $.ajax({
        url: "shc.json", success: function (result) {
            // console.log(result.length)

            for (var i = 0; i < result.length; i++) {
                var testResult = result[i].testresult;
                var fertrecommandation = result[i].fertrecommandation;
                var combination = result[i].combination;
                // var surveyNo = result[i].surveyno;

                var Listfarmer_name = toTitleCase(result[i].farmer_name);
                var basicDetails = "";
                basicDetails = basicDetails + '<tr><td>Soil Health Card Number</td><td>' + result[i].shc_no + '</td></tr>' + '<tr><td>Soil Sample No</td><td>' + result[i].soil_sample_no + '</td></tr>' + '<tr><td>Sample Collection Date</td><td>' + result[i].sample_coll_date + '</td></tr>' + '<tr><td>Survay No</td><td>' + result[i].surveyno + '</td></tr>' + '<tr><td>Khasra Number</td><td>' + result[i].khasrano + '</td></tr>' + '<tr><td>Farm Size</td><td>' + result[i].farmsize + '</td></tr>' + '<tr><td>Farmer Name</td><td>' + toTitleCase(result[i].farmer_name) + '</td></tr>' + '<tr><td>Father Name</td><td>' + toTitleCase(result[i].father_name) + '</td></tr>' + '<tr><td>Address</td><td>' + result[i].address + '</td></tr>' + '<tr><td>Village Name</td><td>' + result[i].vinname + '</td></tr>' + '<tr><td>Block Name</td><td>' + result[i].blockname + '</td></tr>' + '<tr><td>Sub District Name</td><td>' + result[i].subdistname + '</td></tr>' + '<tr><td>District Name</td><td>' + result[i].district + '</td></tr>';
                var testResultTable = "";
                for (var j = 0; j < testResult.length; j++) {
                    testResultTable = testResultTable + '<tr><td>Test Id</td><td>' + testResult[j].testparamid + '</td></tr>' + '<tr><td>Rating</td><td>' + testResult[j].rating + '</td></tr>' + '<tr><td>Test Parameter</td><td>' + testResult[j].testparamname + '</td></tr>' + '<tr><td>Test Value</td><td>' + testResult[j].testvalue + '</td></tr>' + '<tr><td>Unit</td><td>' + testResult[j].unit + '</td></tr>';
                }
                var fertrecommandationTable = "";
                for (var k = 0; k < fertrecommandation.length; k++) {
                    fertrecommandationTable = fertrecommandationTable + '<tr><td>Sr No</td><td>' + fertrecommandation[k].sr_no + '</td></tr>' + '<tr><td>Bio Fertilizer</td><td>' + fertrecommandation[k].bio_fert + '</td></tr>' + '<tr><td>Bio Fertilizer Qty</td><td>' + fertrecommandation[k].bio_fert_qty + '</td></tr>' + '<tr><td>Crop Variety</td><td>' + fertrecommandation[k].crop_variety + '</td></tr>' + '<tr><td>Organic Fertilizer</td><td>' + fertrecommandation[k].organic_fert + '</td></tr>' + '<tr><td>Reference Yield</td><td>' + fertrecommandation[k].reference_yield + '</td></tr>';
                }
                var combinationTable = "";
                for (var l = 0; l < combination.length; l++) {
                    combinationTable = combinationTable + '<tr><td>Sr No</td><td>' + combination[l].sr_no + '</td></tr>' + '<tr><td>Fertilizer Combination One Name</td><td>' + combination[l].furt_comb_one_name + '</td></tr>' +
                        '<tr><td>Fertilizer Combination One Quantity</td><td>' + combination[l].furt_comb_one_quantity + '</td></tr>' + '<tr><td>Fertilizer Combination Two Name</td><td>' + combination[l].furt_comb_two_name + '</td></tr>' + '<tr><td>Fertilizer Combination Two Quantity </td><td>' + combination[l].furt_comb_two_quantity + '</td></tr>';
                }
                ($('<div>')
                    .attr({
                        'data-role': 'collapsible',
                        'data-content-theme': 'c',
                        'data-collapsed': 'true'
                    })
                    .html('<h4>' + Listfarmer_name + '</h4><div style="overflow:auto;height:50vh;"><table id="BacicInfoTable"><th colspan=2>Basic Details</th>' + basicDetails + '<tr><th colspan=2> Test Results </th></tr>' + testResultTable + '<tr><th colspan=2>Fertilizer Recommendations</th></tr>' + fertrecommandationTable + '<tr><th colspan=2>Fertililzer Combinations</th></tr>' + combinationTable + '</table></div>'))
                    .appendTo('#primary');
            }
            $('#makecollapsible').collapsibleset().trigger('create');
        }

    });
}



map.on('click', function (evt) {

    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {

        var coordinate = evt.coordinate;
        Markup.Collapsible();
        overlay.setPosition(coordinate);
        //    return feature.get('village_name');
    });
});
map.on('pointermove', function (evt) {
    map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
});