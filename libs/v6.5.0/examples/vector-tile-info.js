(window.webpackJsonp=window.webpackJsonp||[]).push([[167],{394:function(e,t,r){"use strict";r.r(t);var n=r(103),a=r(3),i=r(94),o=r(88),s=r(2),c=new a.a({target:"map",view:new s.a({center:[0,0],zoom:2}),layers:[new i.a({source:new o.a({format:new n.a,url:"https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf"})})]});c.on("pointermove",(function(e){var t=c.getFeaturesAtPixel(e.pixel);if(0==t.length)return p.innerText="",void(p.style.opacity=0);var r=t[0].getProperties();p.innerText=JSON.stringify(r,null,2),p.style.opacity=1}));var p=document.getElementById("info")}},[[394,0]]]);
//# sourceMappingURL=vector-tile-info.js.map