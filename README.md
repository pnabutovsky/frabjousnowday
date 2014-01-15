O Frabjous Snow Day
=======================

TODO: Description


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

    $ cd couchapp ; erica push http://127.0.0.1:5984/frabjousnowday

Populate the towns and associated GIS data:

    $ #TODO: This directory structure will totally change
    $ grunt load-town-topo:"./data/ma_gis/ma_poly_topo.json"

