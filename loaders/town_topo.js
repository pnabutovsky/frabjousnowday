module.exports = function(grunt) {
    grunt.registerTask("load-town-topo", "Build town documents from a TopoJSON file.", function(topo_json_file){
        console.log("Building town data from file " + topo_json_file);
        var self = this;
        self.async();
        // this.data here contains your configuration

        //Read the topo_json_file. Suuuure, we can load it into memory:
        var topo = require(process.cwd() + '/' + topo_json_file);
        var objects = topo.objects;
        var parent_object_name = Object.keys(objects)[0];
        var geometries = objects[parent_object_name].geometries;
        geometries = geometries.sort(function(a, b){return a.id.localeCompare(b.id);});


        var towns = [];
        for (var i in geometries){
            var geometry = geometries[i];
            if (towns.length == 0 || towns[towns.length-1]._id != geometry.id){
                towns.push(
                    {
                        "_id": geometry.id,
                        "type": "town",
                        "geometries": [geometry]
                    }
                );
            } else {
                towns[towns.length-1].geometries.push(geometry);
            }
        }

        //connect to CouchDB:
        var nano = require('nano')({
            "url": "http://localhost:5984",
            "log": function(id, args) {
                console.log(id, args);
            }
        });
        var db = nano.db.use('frabjousnowday');

        //Upload the town GIS data to CouchDB
        if (towns.length > 0){
            db.bulk({"docs":towns}, function(err, body){
                if (err){
                    console.log("Error uploading town GIS data");
                } else {
                    console.log("Successfully uploaded town GIS data");
                }
            });
        }

    });
};