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

function matchAll(str, regex) {
    var res = [];
    var m;
    if (regex.global) {
        while (m = regex.exec(str)) {
            res.push(m[1]);
        }
    } else {
        if (m = regex.exec(str)) {
            res.push(m[1]);
        }
    }
    return res;
}

function replaceMatched( field, text, crmName, key, dateFormat ){
    var found = text.match('{' + crmName +':' + key + '}');
    if( found ){
        if( typeof field === 'object' ){
            var string = '';
            $.each( field, function( i, val ){
                string += val.VALUE + ', ';
            } );
            string.slice(0,-3);
            text = text.replace( '{' + crmName +':' + key + '}', string);
        }else if( field.constructor === Array ){

        }else{
            if( checkDate( key ) != -1 ){
                var date = formatDateString( field, dateFormat );
                text = text.replace( '{' + crmName +':' + key + '}', date );
            }else{
                text = text.replace( '{' + crmName +':' + key + '}', field);
            }

        }
        return replaceMatched( field, text, crmName, key, dateFormat );
    }
    return text;
}

function checkProduct( text, dealProductRow ){

    var html = $(text);
   $.each( html, function (index, element) {
        $.each(dealProductRow, function (i, product) {
            var temp = false;
            $.each(product, function (key, field) {
                var match = '{productrow:' + key + '}';
                var found = $(element).text().match( match );
                if( found ){

                    var tr = $(element).find('tr');
                    $.each(tr, function ( ii, trow) {
                        if( $(trow).text().match( match ) ){
                            if( temp == false ){
                                temp = trow.outerHTML;console.log(trow.outerHTML);
                            }

                        }
                    });

                    element.innerHTML = element.innerHTML.replace( match, field);

                }
            });
            if( temp != false ){
                $(element).find('tbody').append(temp);
            }
        });

    });
    var x = html.map(function() { return this.outerHTML || this.nodeValue; }).get().join('');
    console.log(x);
    return x;
}


function downloadPdf( text, dataObjects, propertipes, crmName, companyData, contactData, dealData, dealProductRow, leadData ){

    var left = Number(propertipes.left) * Number(0.353),
         top = Number(propertipes.top)* Number(0.353),
         right = Number(propertipes.right)* Number(0.353),
         bottom = Number(propertipes.bottom)* Number(0.353),
         lineHeight = Number(propertipes.lHeight),
         fontSize = Number(propertipes.fontSize),
         dateFormat = propertipes.dateFormat;


    $.each(dataObjects, function (i, field) {
        text =  replaceMatched( field, text, crmName, i, dateFormat );
        //text = text.replace( '{' + crmName + ':' + i + '}', field);
    });

    $.each(companyData, function (i, field) {
        text =  replaceMatched( field, text, 'company', i, dateFormat );
    });

    $.each(contactData, function (i, field) {
        text =  replaceMatched( field, text, 'contact', i, dateFormat );
    });

    $.each(dealData, function (i, field) {
        text =  replaceMatched( field, text, 'deal', i, dateFormat );
    });


    text = checkProduct( text, dealProductRow );


    $.each(leadData, function (i, field) {
        text =  replaceMatched( field, text, 'lead', i, field, dateFormat );
    });



    var mywindow = window.open('', 'Document');
    mywindow.document.write('<html><head><style>@page{ margin: ' + top + 'mm ' + right + 'mm ' + bottom + 'mm ' + left + 'mm;} </style>');
    /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write(text);
    mywindow.document.write('</body></html>');

    mywindow.print();
    mywindow.close();

}