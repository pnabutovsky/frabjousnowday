O Frabjous Snow Day
=======================

TODO: Description

Obtaining the GIS data
--------------------------
Massachusetts town boundries can be downloaded as shape files from [mass.gov](http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/townsurvey.html). TOWNSSURVEY_POLY.shp provides the desired paths.



To generate the [TopoJSON](https://github.com/mbostock/topojson) file, you can follow Mike Bostock's [directions](http://bost.ocks.org/mike/map/). Briefly:

Install GDAL by grabbing the proper binary from <http://trac.osgeo.org/gdal/wiki/DownloadingGdalBinaries>. To install on Mac OS X:

    brew install gdal

Install the TopoJSON libary and console tools. You will first need to install Node.js, but this is a project requirement in any case.

    npm install -g topojson

Convert the shape file to GeoJSON using the GDAL toolkit. Massachusetts uses a gridded coordinate system in the shape file. The points must be conveted to logitude and lattitude.

    ogr2ogr -f GeoJSON -t_srs EPSG:4326 ma.json TOWNSSURVEY_POLY.shp

Convert the GeoJSON into a more compact TopoJSON file. Since the original file is at a very high resolution, we will simplify by retaining 6% of the existing geographic points:

    topojson --id-property TOWN --simplify-proportion .06 -o ma_topo.json ma.json



Application deployment steps
--------------------------
Install CouchDB and start it up:

    $ #TODO: Instructions

Install Erica

    $ #TODO: Instructions

Install Node.js

    $ #TODO: Instructions

Install Node.js dependencies and Grunt

    $ npm install

Deploy the Couchapp:

    $ cd couchapp ; erica push http://127.0.0.1:5984/frabjousnowday ; cd ..

Populate the towns and associated GIS data:

    $ #TODO: This directory structure will totally change
    $ grunt load-town-topo:"./data/gis/ma_topo.json"


One Liners
---------------------------
To pull back the TopoJSON of all towns:

    $ curl -X GET "http://127.0.0.1:5984/frabjousnowday/_design/couchapp/_list/topojson/geometries"