module.exports = function(grunt) {
    grunt.registerTask("load-town-topo", "Build town documents from a TopoJSON file.", function(topo_json_file){
        console.log("Building town data from file " + topo_json_file);
        var self = this;
        // this.data here contains your configuration

    });
};