function(head, req) {
    // TODO: If the JSON thing rears an ugly head:
    // http://stackoverflow.com/questions/4949689/simplify-couchdb-json-response
    var geometries = [];
    var row;
    while (row = getRow()) {
        geometries.push(row);
    }
    //TODO: That ma_poly looks suspicious for a state agnostic JSON response
    var json = {
        "type": "Topology",
        "transform": {
            "scale": [1, 1],
            "translate": [180,90]
        },
        "objects": {
            "ma_poly": {
                "type": "GeometryCollection",
                "geometries": geometries
            }
        }
    };
    return JSON.stringify(json);
}