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
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        crossOrigin: 'Anonymous',
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
    coordinateFormat: function(coordinate) {
        return ol.coordinate.format(coordinate, latLong, 4);
    }
});

var center = ol.proj.transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857');
view = new ol.View({
    center: center,
    zoom: 6.5
});

//------------------------on click display table-------------------------
var container = document.getElementById('popup');
var container1 = document.getElementById('popup1');
var content = document.getElementById('popup-content');
var content1 = document.getElementById('popup-content1');
var content2 = document.getElementById('legend');
var closer = document.getElementById('popup-closer');

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
var popup = new ol.Overlay.Popup({
    popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
    closeBox: true,
    onshow: function() { console.log("You opened the box"); },
    onclose: function() { console.log("You close the box"); },
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
    layers: layerList, //featurelayer
    view: view
});



var mapView = map.getView();