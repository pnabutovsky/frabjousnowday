function(doc) {
    //Get all tows and their respective geometries.
    //TODO: May need to change the schema and map a little in the future to support filtering by multiple states.
    if (doc.type == 'town'){
        emit(doc._id, doc.geometries);
    }
}