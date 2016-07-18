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
            console.log( field )
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
    console.log( dealProductRow );
    $.each(dealProductRow, function (i, field) {
        text =  replaceMatched( field, text, 'productrow', i, field, dateFormat );
    });

    $.each(leadData, function (i, field) {
        text =  replaceMatched( field, text, 'lead', i, field, dateFormat );
    });
    //
    //
    //
    // var bold = matchAll(text, /<span style="font-weight: bold;">(.*)<\/span>/g);console.log(bold);
    //
    //
    // bold.forEach(function(b){
    //     text = text.split(b); console.log(text)
    //     text.forEach(function( t ){
    //         t = t.replace( b, {
    //             text: b, fontSize: fontSize, lineHeight: lineHeight
    //         });
    //     });
    // });
    //
    //
    //
    //
    // //text = text.split("&nbsp;"); console.log(text);
    // //text.forEach(function( t ){
    // //
    // //    output.push(
    // //        {
    // //            text: t, fontSize: fontSize, lineHeight: lineHeight
    // //        },
    // //        {
    // //            text: '.', color: 'white', lineHeight: lineHeight
    // //        }
    // //    );
    // //
    // //});
    //
    // var docDefinition = {
    //     content: [
    //         {
    //             text: output
    //         }
    //
    //     ],
    //     pageMargins: [ left, top, right, bottom ]
    // };
    // pdfMake.createPdf(docDefinition).open();
/*--------------------------------------------*/


    //$( '#render_me').modal('show');
    //$('#ok').empty();
    //$('#ok').html(text);


/*-----------------------------------------------*/
    // var doc = new jsPDF('p','pt','a4');
    //
     //$(document.body).html(text);
    // Promise.all(
    //     [
    //         new Promise(function (resolve)
    //         {
    //             html2canvas($("#print"), {
    //                 onrendered: function(canvas) {
    //
    //                     $("#print").remove();
    //                     resolve(canvas.toDataURL('image/png'));
    //                 },
    //             });
    //         })
    //     ]).then(function (ru_text) { console.log(ru_text);//window.open(url, '_blank');
    //
    //     doc.addImage(ru_text[0], 'JPEG', 0,0);
    //     doc.text(0, 10, 'Non-utf-8-string' );
    //
    //     doc.save('filename.pdf');
    // });

    // html2canvas(document.body).then(function(canvas) {
    //     //document.body.appendChild(canvas);
    //     var doc = new jsPDF('p','pt','a4');
    //     doc.addImage(canvas, 'JPEG', 40, 60);
    //
    //
    //     doc.save('filename.pdf');
    // });

    // $.get( "ajax.php", { text: text } )
    //     .done(function( data ) {
    //         alert( "Data Loaded: " + data );
    //     });

    var mywindow = window.open('', 'Document');
    mywindow.document.write('<html><head><style>@page{ margin: ' + top + 'mm ' + right + 'mm ' + bottom + 'mm ' + left + 'mm;} </style>');
    /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write(text);
    mywindow.document.write('</body></html>');

    mywindow.print();
    mywindow.close();

}