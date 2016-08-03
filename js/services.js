function addEntity( name, data ){
    BX24.callMethod('entity.item.add', {
        ENTITY: 'Document',
        NAME: name,
        PROPERTY_VALUES: data
    },function( result ){
        if(!result.error()){

            saveFields( name, data );
        }
    });
}

function updateEntity( id, entity, name, data ){
    return BX24.callMethod('entity.item.update', {
        ENTITY: entity,
        NAME: name,
        ID: id,
        PROPERTY_VALUES: data
    },function( result ){
        if(result.error())
            console.error(result.error(), 'Kluda');
        else{
            return result.data();
        }
    });
}

function getDomain(){
    return BX24.getAuth();
}

function saveFields( name, data ){
    $.each( data, function( i, val ){
        saveField( name, i, val );
    });
}

function saveField( name, field, value ){
    BX24.callMethod('entity.item.property.add', {ENTITY: name, PROPERTY: field, NAME: field, TYPE: 'S'},
        function( result ){
            if(!result.error()){

            }
        });
}

function deleteFields( name, data ){
    $.each( data, function( i, val ){
        deleteField( name, i );
    });
}

function deleteField( name, field ){
    BX24.callMethod('entity.item.property.delete', {ENTITY: name, PROPERTY: field },
        function( result ){
            if(!result.error()){

            }
        });
}
function deleteEntity( name, id ){
    BX24.callMethod('entity.item.delete', {
        ENTITY: name,
        ID: id
    },function (result) {
        console.log(result);
    });
}