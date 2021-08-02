window.onload = init;
function init() {
    // Attribution Control
    var attributionControl = new ol.control.Attribution({
        collapsible: true
    })
    // Map object

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
                'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
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

    var lngtat = ol.proj.transform([77.50, 18.95], 'EPSG:4326', 'EPSG:3857');
    view = new ol.View({
        center: lngtat,
        zoom: 6.5
    });

    //------------------------on click display table-------------------------
    var container = document.getElementById('popup');
    var container1 = document.getElementById('popup1');
    var content = document.getElementById('popup-content');
    var content1 = document.getElementById('popup-content1');
    var closer = document.getElementById('popup-closer');

    var overlay = new ol.Overlay({
        element: container,
        positioning: 'center-center'
    });
    var overlay1 = new ol.Overlay({
        element: container1,
        positioning: 'center-right'
    });



    var districtLabelStyle = new ol.style.Style({
        text: new ol.style.Text({
            font: '12px Calibri,sans-serif',
            overflow: true,
            fill: new ol.style.Fill({
                color: '#000'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        })
    });
    var districtBoundaryStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: '#ee7300',
            opacity:0
        }),
        stroke: new ol.style.Stroke({
            color: '#808080',
            width: 1.5,
            // line: [3, 3]
        })
    });
    var districtStyle = [districtBoundaryStyle, districtLabelStyle];


    // ========== Taluka Layer Style ==========

    var talukaLabelStyle = new ol.style.Style({
        text: new ol.style.Text({
            font: '14px Calibri,sans-serif',
            overflow: true,
            fill: new ol.style.Fill({
                color: '#000000',

            }),
            stroke: new ol.style.Stroke({
                color: '#dbd3d3',
                width: 1
            })
        })
    });
    var talukaBoundaryStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.1)'
        }),
        stroke: new ol.style.Stroke({
            color: '#A9A9A9',
            width: 1,
            // lineDash: [3, 3]
        })
    });
    var talukaStyle = [talukaBoundaryStyle, talukaLabelStyle];
    // ========== Taluka Layer Style ==========

    var villageLabelStyle = new ol.style.Style({
        text: new ol.style.Text({
            font: '14px Calibri,sans-serif',
            overflow: true,
            fill: new ol.style.Fill({
                color: '#000000',

            }),
            stroke: new ol.style.Stroke({
                color: '#dbd3d3',
                width: 2
            })
        })
    });
    var villageBoundaryStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.1)'
        }),
        stroke: new ol.style.Stroke({
            color: '#D3D3D3',
            width: 1,
            lineDash: [3, 5]
        })
    });
    var villageStyle = [villageBoundaryStyle, villageLabelStyle];

    // =============================== Admin Layers ===============================

    var district = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/geonode/wms',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'geonode:District_WGS84',
                'TILED': true
            }
        })
    });

    var taluka = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/geonode/wms',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'geonode:taluka',
                'TILED': true
            }
        })
    });

    

    var villages = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/geonode/wms',
            serverType: 'geoserver',
            visible: true,
            params: {
                'LAYERS': 'geonode:villages',
                'TILED': true
            }
        })
    });

    var villages1 = new ol.layer.VectorImage({
        // title:'Village Boundary',
        minZoom: 12,
        name: "Village Layer",
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: 'http://localhost:8080/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode%3Avillages&outputFormat=application%2Fjson',
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
            villageLabelStyle.getText().setText(feature.get('vil_name'));
            villageLabelStyle.getText().setTextAlign(textAlign);
            return villageStyle;
        },
        showLegend: true,
        renderMode: 'image'
    })

    // var approved_point = new ol.layer.Tile({
    //     source: new ol.source.TileWMS({
    //         url: 'http://localhost:8080/geoserver/geonode/wms',
    //         serverType: 'geoserver',
    //         params: {
    //             'LAYERS': 'geonode:tbl_approved_point',
    //             'TILED': true
    //         }
    //     }),
    //     visible: false,
    // });
    // http://localhost:8080/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode%3Atbl_approved_point&maxFeatures=50&outputFormat=application%2Fjson
    const styleForSelect = function (feature) {
        let cityID = feature.get('full_name');
        let cityIDString = cityID.toString();
        const styles = [
            new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: [247, 26, 10, 0.5]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [6, 125, 34, 1],
                        width: 2
                    }),
                    radius: 12
                }),
                text: new ol.style.Text({
                    text: cityIDString,
                    scale: 1.5,
                    fill: new ol.style.Fill({
                        color: [87, 9, 9, 1]
                    }),
                    stroke: new ol.style.Stroke({
                        color: [87, 9, 9, 1],
                        width: 0.5
                    })
                })
            })
        ]
        return styles
    }

    var approvedStyle = new ol.style.Style({
        image: new ol.style.RegularShape({
            radius: 5,
            radius2: 3,
            points: 4,
            stroke: new ol.style.Stroke({ color: [255, 128, 0, 1], width: 0.5 }),
            fill: new ol.style.Fill({ color: [255, 255, 0, .3], width: 1 })
        })
    });

    var approved_point = new ol.layer.VectorImage({
        name: 'DBT Point',
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: 'http://localhost:8080/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode%3Atestview&maxFeatures=50&outputFormat=application%2Fjson',
        }),
        style: approvedStyle,
        // style: function (feature) {
        //     var geometry = feature.getGeometry();
        //     if (geometry.getType() == 'Point') {
        //         feature.setStyle(approvedStyle);
        //         legend.addRow({
        //             title: 'DBT Point Layer',
        //             typeGeom: 'Point',
        //             style: approvedStyle
        //         });
        //     }
        // },
        showLegend: true,
        renderMode: 'image',
        visible: false,
        crossOrigin: 'anonymous'
    })
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

        layerList = [topo,MahaDist]
    // layerList = [topo, bing, osm, street, nomap, district, taluka, villages, approved_point, rejected_point,villages1];

    map = new ol.Map({
        overlays: [popup],
        controls: ol.control.defaults({
            attribution: false
        }).extend([mouse, scaleLineControl]),
        target: 'map',
        layers: layerList,//featurelayer
        view: view
    });



    // var layerSwitcher = new ol.control.LayerSwitcher();
    // map.addControl(layerSwitcher);

    // Define a new legend



    // var legend = new ol.control.Legend({
    //     title: 'Legend',
    //     margin: 5,
    //     collapsed: false
    // });
    // map.addControl(legend);

    // Add a new one
    // var legend2 = new ol.control.Legend({
    //     title: ' ',
    //     margin: 5,
    //     target: legend.element
    // });
    // map.addControl(legend2);
    // function addRowToLegent(inputLayer) {
    //     // map.getLayers().forEach(function (layer) {
    //     console.log(inputLayer.get('name'))
    //     var features = inputLayer.getSource();
        
    //     console.log(features);
    //     // });
    //     // legend.addRow({
    //     //     title: inputLayer.get('name'),
    //     //     typeGeom: 'MultiPolygon',
    //     //     style: districtBoundaryStyle
    //     // });
    // }
    // legend.addRow({
    //     title: 'District Layer',
    //     typeGeom: 'MultiPolygon',
    //     style: districtBoundaryStyle
    // });
    // legend.addRow({
    //     title: 'Taluka Layer',
    //     typeGeom: 'MultiPolygon',
    //     style: talukaBoundaryStyle
    // });
    // legend.addRow({
    //     title: 'Village Layer',
    //     typeGeom: 'MultiPolygon',
    //     style: villageBoundaryStyle
    // });
    // legend.addRow({
    //     title: 'DBT Point Layer',
    //     typeGeom: 'Point',
    //     style: approvedStyle
    // });
    const mapView = map.getView();
    // Control Select 
    // var select = new ol.interaction.Select({});
    // map.addInteraction(select);
    var select = new ol.interaction.Select({ hitTolerance: 3 });
    map.addInteraction(select);

    map.on('singleclick', function (evt) {
        map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            // if (feature.get('geometry').getType() == 'Point') {
            //     feature.setStyle(new ol.style.Style({
            //         image: new ol.style.RegularShape({
            //             radius: 18,
            //             radius2: 7,
            //             points: 5,
            //             stroke: new ol.style.Stroke({ color: [255, 128, 0, 1], width: 1.5 }),
            //             fill: new ol.style.Fill({ color: [255, 255, 0, .3], width: 1 })
            //         })
            //     }));
            // }

            if (feature.get('geometry').getType() == 'Point') {
                mainLogic(feature)
                // console.log(feature.get('geometry').getType());
            }
            // let featureName = feature.get('full_name');
            // let navElement = navElements.children.namedItem(featureName);
            // mainLogic(feature)
        })
    })
    function mainLogic(feature) {
        // Change the view based on the feature
        let featureCoordinates = feature.get('geometry').getCoordinates();
        mapView.animate({ center: featureCoordinates }, { zoom: 12 })

    }



    // On selected => show/hide popup
    select.getFeatures().on(['add'], function (e) {
        var feature = e.element;
        if (feature.get('geometry').getType() == 'Point') {
            var content = "";
            // content += f_name;
            var html = '<div style=width:100%;><table border="1" style="border-collapse: collapse;width: 100%;font-family: helvetica;font-size: 12px;">\n\
                    <tr style="background-color:#008B8B;height:30px;"><td colspan=2><h5 style=text-align:center;color:#fff><b> Village Profile</b></h5></td></tr>\n\
                    <tr style="height:30px;"><td style="padding-left:15px;">Farmer Name:</td><td style="height:30px;">'+ feature.get("full_name") + '</td></tr>\n\
                    <tr style="height:30px;"><td style="padding-left:15px;">District:</td><td style="height:30px;">'+ feature.get("cityname") + '</td></tr>\n\
                    <tr style="height:30px;"><td style="padding-left:15px;">Village:</td><td style="height:30px;">'+ feature.get("villagename") + '</td></tr>\n\
                    </table>\n\
                    </div>';

            content += '<div>' + html + '</div>';
            popup.show(feature.getGeometry().getFirstCoordinate(), content);
        }
    })
    select.getFeatures().on(['remove'], function (e) {
        popup.hide();
    })



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
        console.log(visibilityInput)
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
    var lswitcher = new ol.control.LayerSwitcher({
        target: $(".layerSwitcher").get(0),
    });
    map.addControl(lswitcher);

    function show_sub() {
        var selectData = document.getElementById("id_component").value;
        console.log(selectData)
        // cat.getElementsByTagName("ul")[0].style.display = (cat.getElementsByTagName("ul")[0].style.display == "none") ? "inline" : "none";
    }

}
function getDisdrict() {

    var ele = document.getElementById("id_component");
    var results = [];
    const Http = new XMLHttpRequest();
    const url = 'http://127.0.0.1:5000/district';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            results = JSON.parse(xhttp.responseText);
            for (var i = 0; i < results.length; i++) {
                // POPULATE SELECT ELEMENT WITH JSON.
                ele.innerHTML = ele.innerHTML +
                    '<option value="' + results[i]['cat_code'] + '">' + results[i]['category'] + '</option>';
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
    // alert("kh")
}


//alert('jdgf');
function wms_layers()
{
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
      }
}
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
            // message += "   " + row.cells[2].innerHTML;
            // message += "   " + row.cells[3].innerHTML;
            message += "\n";
        }
    }

    //Display selected Row data in Alert Box.
    // alert(message);
}