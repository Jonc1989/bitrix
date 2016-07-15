function diff(a, b) {
    return a.filter(function(i) {return b.indexOf(i) < 0;});
}

function sortByParams(a,b) {
    return a.params.parent.substring(1) - b.params.parent.substring(1);
}

function sortById(a,b) {
    return a.id.substring(1) - b.id.substring(1);
}


function sortByValues( myObj, bool ){
    var values = [];
    $.each(myObj, function(i, v){
        values.push(v);
    });

    if( bool ){
        values.sort(sortByParams);
    }else{
        values.sort(sortById);
    }

return values;
}
function addProperties( keys, response, data, name ){
    $.each(keys, function (i, params) {
        if( params.method == name ){
            data[i] = {
                value: response[i],
                params: params,
                field: i
            }
        }
    });
    delete data['ID'];
    return data;
}

function mergeObjects( data, dataToAdd){
    for (var attrname in dataToAdd) { data[attrname] = dataToAdd[attrname]; }
    return data;
}
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}