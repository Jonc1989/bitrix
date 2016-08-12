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
function addCurrency( summa, currencyName ) {
    var sumArr = summa.split(".");
    var sum = 0, cents = '';
    if( sumArr.length == 1 ){
        sum = capitalizeFirstLetter( toWords( sumArr[0] ) ) + currencyName.toLowerCase();
    }else if( sumArr.length == 2  ){
        if( sumArr[0] != 0){
            if( sumArr[1] == '01'){
                cents = cutFirstNull( sumArr[1] ) + ' cents';
            }else{
                cents = cutFirstNull( sumArr[1] ) + ' centi';
            }

            sum = capitalizeFirstLetter( toWords( sumArr[0] ) ) + currencyName.toLowerCase() + ' ' + cents;
        }else{
            if( sumArr[1] == '00'){
                sum = '0 centi';
            }else{
                if( sumArr[1] == '01'){
                    sum = ' 1 cents';
                }else
                    sum = sumArr[1] + ' centi';
            }

        }

    }else if( sumArr.length == 0 ){
        sum = '';
    }
    return sum;
}
function replaceMatched( field, text, crmName, key, dateFormat ){

    var found = text.match('{' + crmName +':' + key + '}');
    if( found ){
        if( typeof field === 'object' ){
            var string = '';
            $.each( field, function( i, val ){
                if( val.VALUE !== undefined ) {
                    string += val.VALUE + ', ';
                }
            } );
            string.slice(0,-3);
            text = text.replace( '{' + crmName +':' + key + '}', string);
        }else if( crmName == 'byWords' ){

            text = text.replace( '{' + crmName +':' + key + '}', addCurrency( field, 'Eiro' ) );
        }else{
            if( checkDate( key ) != -1 && field != '' ){
                var date = formatDateString( field, dateFormat );
                text = text.replace( '{' + crmName +':' + key + '}', date );
            }else{
                text = text.replace( '{' + crmName +':' + key + '}', field !== false ? field : '' );
            }

        }

        return replaceMatched( field, text, crmName, key, dateFormat );
    }else{
        text = text.replace( '{' + crmName +':' + key + '}', '');
    }
    return text;
}

function deleteEmptyFields( text, regex ) {

    var match = text.match(regex);
    if( match ){
        text = text.replace( regex, '' );
        return deleteEmptyFields( text, regex );
    }
    return text;
}
function checkProduct( text, dealProductRow, name ){
    var html = $(text);
    var count = dealProductRow.length;

    if( count > 0 ){
        $.each( html, function (index, element) {

            $.each(dealProductRow, function (i, product) {
                var temp = false;
                $.each(product, function (key, field) {
                    var match = '{' + name + ':' + key + '}';
                    var found = $(element).text().match( match );
                    if( found ){
                        var tr = $(element).find('tr');
                        $.each(tr, function ( ii, trow) {
                            if( $(trow).text().match( match ) ){


                                if( temp == false ){
                                    temp = trow.outerHTML;
                                }
                            }
                        });
                        element.innerHTML = element.innerHTML.replace( match, field );
                    }
                });
                if( temp != false && (i + 1) < count ){
                    $(element).find('tbody').append(temp);
                    temp = false;
                }
            });

        });
    }else{
        var tr = $(html).find('tr');
        $.each(tr, function ( x, trow) {
            if( $(trow).text().match( '{' + name + ':' ) ){
                $(trow).remove();
            }
        });
    }


    return html.map(function() { return this.outerHTML || this.nodeValue; }).get().join('');
}

function getDateString( date ){
    var dd = date.getDate().toString();
    var mm = (date.getMonth()+1).toString(); //January is 0!
    var yyyy = date.getFullYear().toString();
    var datums = yyyy + ". gada " + dd + ". " + dateString( mm );
    return datums;
}

function currentDate() {
    var today = new Date();
    var datums = getDateString( today );
    return datums;
}
function downloadPdf( text, dataObjects, propertipes, crmName, companyData, contactData, dealData, dealProductRow, leadData, userData, quoteData, myCompanyData ){

    var left = Number(propertipes.left) * Number(0.353),
         top = Number(propertipes.top)* Number(0.353),
         right = Number(propertipes.right)* Number(0.353),
         bottom = Number(propertipes.bottom)* Number(0.353),
         lineHeight = Number(propertipes.lHeight),
         fontSize = Number(propertipes.fontSize),
         dateFormat = propertipes.dateFormat;

    text =  replaceMatched( currentDate, text, 'date', 'CURRENT_DATE', dateFormat );

    $.each(dataObjects, function (i, field) {
        text =  replaceMatched( field, text, crmName, i, dateFormat );
        text =  replaceMatched( field, text, 'byWords', i, dateFormat );
    });



    if( crmName == 'invoice' && dataObjects.PRODUCT_ROWS !== undefined ){

        $.each( dataObjects.PRODUCT_ROWS, function(i, val){
            var cena = Number(val.PRICE) + Number(val.DISCOUNT_PRICE);
            var summa = (Number(val.PRICE) + Number(val.DISCOUNT_PRICE) ) * Number(val.QUANTITY); 
            var atlaidesSumma = (Number(val.DISCOUNT_PRICE) * Number(val.QUANTITY)); 
            var summaBezNodokļa = Number(val.PRICE) * Number(val.QUANTITY);
            var nodokļuSumma = Number(summaBezNodokļa) * Number( val.VAT_RATE );
            var summaKopa = Number(summaBezNodokļa) + Number(nodokļuSumma);

            Number(0.1800) * Number(100) + '%'

            dataObjects.PRODUCT_ROWS[i].PRICE = cena.toFixed(2);
            dataObjects.PRODUCT_ROWS[i].SUM = summa.toFixed(2);
            dataObjects.PRODUCT_ROWS[i].DISCOUNT_PRICE_ALL = atlaidesSumma.toFixed(2);
            dataObjects.PRODUCT_ROWS[i].PRICE_EXCLUSIVE_ALL = summaBezNodokļa.toFixed(2);
            dataObjects.PRODUCT_ROWS[i].TAX_SUM = nodokļuSumma.toFixed(2);
            dataObjects.PRODUCT_ROWS[i].SUM_ALL = summaKopa.toFixed(2);
            dataObjects.PRODUCT_ROWS[i].VAT_RATE = Number((Number( val.VAT_RATE ) * Number(100)));
            dataObjects.PRODUCT_ROWS[i].QUANTITY = Number(dataObjects.PRODUCT_ROWS[i].QUANTITY);
        });
        text = checkProduct( text, dataObjects.PRODUCT_ROWS, 'productrow' );
    }

    if(Object.keys(companyData) !== undefined && Object.keys(companyData).length > 0 ||
        companyData !== undefined && companyData.length > 0 ){
        $.each(companyData, function (i, field) {
            text =  replaceMatched( field, text, 'company', i, dateFormat );
        });
    }else{
        text = deleteEmptyFields( text, /{company:\w+((\_\w+)?)+}/ );
    }

    if(Object.keys(contactData) !== undefined && Object.keys(contactData).length > 0 ||
        contactData !== undefined && contactData.length > 0 ){
        $.each(contactData, function (i, field) {
            text =  replaceMatched( field, text, 'contact', i, dateFormat );
        });
    }else{
        text = deleteEmptyFields( text, /{contact:\w+((\_\w+)?)+}/ );
    }

    if(Object.keys(dealData) !== undefined && Object.keys(dealData).length > 0 ||
        dealData !== undefined && dealData.length > 0 ){
        $.each(dealData, function (i, field) {
            text =  replaceMatched( field, text, 'deal', i, dateFormat );
            text =  replaceMatched( field, text, 'byWords', i, dateFormat );
        });
    }else{
        text = deleteEmptyFields( text, /{deal:\w+((\_\w+)?)+}/ );
    }

    if(dealProductRow.length !== undefined ){

        $.each( dealProductRow, function(i, val){
            var summa = (Number(val.PRICE_NETTO) * Number(val.QUANTITY));
            var atlaidesSumma = (Number(val.DISCOUNT_SUM) * Number(val.QUANTITY));
            var summaBezNodokļa = (Number(val.PRICE_EXCLUSIVE) * Number(val.QUANTITY));
            var nodokļuSumma = Number(summaBezNodokļa) * Number( val.TAX_RATE / 100 );
            var summaKopa = Number(summaBezNodokļa) + Number(nodokļuSumma);

            dealProductRow[i].SUM = summa.toFixed(2);
            dealProductRow[i].DISCOUNT_PRICE_ALL = atlaidesSumma.toFixed(2);
            dealProductRow[i].PRICE_EXCLUSIVE_ALL = summaBezNodokļa.toFixed(2);
            dealProductRow[i].TAX_SUM = nodokļuSumma.toFixed(2);
            dealProductRow[i].SUM_ALL = summaKopa.toFixed(2);
        });


        text = checkProduct( text, dealProductRow, 'productrow' );
    }

    if(Object.keys(leadData) !== undefined && Object.keys(leadData).length > 0 ||
        leadData !== undefined && leadData.length > 0 ){
        $.each(leadData, function (i, field) {
            text =  replaceMatched( field, text, 'lead', i, dateFormat );
            text =  replaceMatched( field, text, 'byWords', i, dateFormat );
        });
    }else{
        text = deleteEmptyFields( text, /{lead:\w+((\_\w+)?)+}/ );
    }

    if(Object.keys(userData) !== undefined && Object.keys(userData).length > 0 ||
        userData !== undefined && userData.length > 0 ){
        $.each(userData, function (i, field) {
            text =  replaceMatched( field, text, 'user', i, dateFormat );
        });
    }else{
        text = deleteEmptyFields( text, /{user:\w+((\_\w+)?)+}/ );
    }



    if(Object.keys(quoteData) !== undefined && Object.keys(quoteData).length > 0 ||
        quoteData !== undefined && quoteData.length > 0 ){
        $.each(quoteData, function (i, field) {
            text =  replaceMatched( field, text, 'quote', i, dateFormat );
            text =  replaceMatched( field, text, 'byWords', i, dateFormat );
        });
    }else{
        text = deleteEmptyFields( text, /{quote:\w+((\_\w+)?)+}/ );
    }

    if( myCompanyData[0].PROPERTY_VALUES !== undefined ||  myCompanyData[0].PROPERTY_VALUES != null ){
        $.each(myCompanyData[0].PROPERTY_VALUES, function (i, field) {
            text =  replaceMatched( field, text, 'MyCompany', i, dateFormat );
        });
    }else{
        text = deleteEmptyFields( text, /{MyCompany:\w+((\_\w+)?)+}/ );
    }
    var mywindow = window.open('', 'Document');
    mywindow.document.write('<html><head><style>@page{ margin: ' + top + 'mm ' + right + 'mm ' + bottom + 'mm ' + left + 'mm;}@media screen {table{border-collapse: collapse;}} @media print{table{border-collapse: collapse;}} </style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(text);
    mywindow.document.write('</body></html>');

    mywindow.print();
    mywindow.close();

}