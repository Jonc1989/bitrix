function recursiveCheck( neighbours, data, obj, row ){
    var i  = neighbours;
    var index = data.indexOf(obj);
    if(index >= 0 && index < data.length - 1) {
        var nextItem = data[index + i];
        if( nextItem != undefined ){
            if (obj.params.parent == nextItem.params.parent ) {
                row.push(
                    {
                        text: nextItem.value != null ? nextItem.value : '',
                        margin: [ ( nextItem.params.position.left - ( 510 / ( ( i + 1 ) ) ) ) / 1.4 , 0, 0, 0 ]
                    }
                );
                delete data[index + i];
                i++;
                return recursiveCheck( i, data, obj, row );
            }
        }

    }
    return row;
}





function downloadPdf( text, dataObjects, propertipes, crmName, companyData, contactData, dealData ){

    var left = Number(propertipes.left),
        top = Number(propertipes.top),
        right = Number(propertipes.right),
        bottom = Number(propertipes.bottom),
        lineHeight = Number(propertipes.lHeight),
        fontSize = Number(propertipes.fontSize);

    var output = [];

    $.each(dataObjects, function (i, field) {
        text = text.replace( '{' + crmName + ':' + i + '}', field);
    });

    $.each(companyData, function (i, field) {
        text = text.replace( '{company:' + i + '}', field);
    });

    $.each(contactData, function (i, field) {
        text = text.replace( '{contact:' + i + '}', field);
    });

    $.each(dealData, function (i, field) {
        text = text.replace( '{deal:' + i + '}', field);
    });








    text = text.split(" "); console.log(text);
    text.forEach(function( t ){

        output.push(
            {
                text: t, fontSize: fontSize, lineHeight: lineHeight
            },
            {
                text: '.', color: 'white', lineHeight: lineHeight
            }
        );

    });

    var docDefinition = {
        content: [
            {
                text: output
            }

        ],
        pageMargins: [ left, top, right, bottom ]
    };
    pdfMake.createPdf(docDefinition).open();
}