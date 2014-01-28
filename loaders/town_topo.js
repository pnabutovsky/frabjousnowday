module.exports = function(grunt) {
    grunt.registerTask("load-town-topo", "Build town documents from a TopoJSON file.", function(topoJsonFile){
        console.log("Building town data from file " + topoJsonFile);

        //TODO: Read external properties. Remove hardcoding.

        var self = this;
        self.async();
        // this.data here contains your configuration

        //Currently we are assuming that each topojson file represents a single region.
        //Going forward this should not be assumed.
        //See the topojson specification: https://github.com/topojson/topojson-specification/blob/master/README.md

        var fs = require('fs');

        //Read the topoJsonFile. Suuuure, we can load it into memory:
        var topology = require(process.cwd() + '/' + topoJsonFile);
        var objects = topology.objects;
        var regionKey = Object.keys(objects)[0]; //Again, assuming a single region is provided in this file
        var regionName = regionKey.toUpperCase();

        //Yeah yeah, not optimal
        var regionGeometries = objects[regionKey].geometries;
        regionGeometries = regionGeometries.sort(function(a, b){return a.id.localeCompare(b.id);});
        var towns = [];
        for (var i in regionGeometries){
            var geometry = regionGeometries[i];
            if (towns.length == 0 || towns[towns.length-1]._id != geometry.id){
                towns.push(
                    {
                        "_id": geometry.id,
                        "type": "town",
                        "region": regionName
                    }
                );
            }
        }

        //connect to CouchDB:
        var nano = require('nano')({
            "url": "http://localhost:5984",
            "log": function(id, args){} //Make sure were not logging our giant uploads.
        });
        var db = nano.db.use('frabjousnowday');

        var regionRev;
        //Create the region, and attach the topojson file
        db.head(regionName,  function(err, _, headers) {
            var regionBody;
            if (err)
                regionBody = {"type": "region"};
            else
                regionBody = {"type": "region", "_rev": eval(headers.etag)};
            db.insert(regionBody, regionName, function(err, body, headers){
                if (err){
                    console.log("Error uploading region GIS data");
                } else if (headers){
                    fs.readFile(topoJsonFile, function(err, data) {
                        if (!err){
                            db.attachment.insert(
                                regionName, "topojson",
                                data, "application/json",
                                {"rev": eval(headers.etag)},
                                function(err, body, headers){
                                    if (err){
                                        console.log("Error uploading region GIS data");
                                        console.log(err);
                                    } else {
                                        console.log("Successfully uploaded region GIS data");
                                    }
                                }
                            );
                        }
                    });
                }
            });
        });


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