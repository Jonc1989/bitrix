function diff(a, b) {
    return a.filter(function(i) {return b.indexOf(i) < 0;});
}

function sortByParams(a,b) {
    return a.params.parent.substring(1) - b.params.parent.substring(1);
}

function sortById(a,b) {
    return a.id.substring(1) - b.id.substring(1);
}

function resizeMe(){
    BX24.resizeWindow(window.innerWidth, $("#document-edit-modal").height());
}

function filterField( currentCRMSection, entityFields, fieldName, method ){
    if( currentCRMSection == 'invoice' ){
        if( method == 'productrow' ){
            if( fieldName == 'CUSTOMIZED' || fieldName == 'DISCOUNT_PRICE' || fieldName == 'PRODUCT_NAME' || fieldName == 'PRICE' || fieldName == 'QUANTITY'
                || fieldName == 'TAX_INCLUDED' || fieldName == 'TAX_RATE' ){
                if( fieldName == 'TAX_INCLUDED' ){
                    fieldName = 'VAT_INCLUDED'
                }
                if( fieldName == 'TAX_RATE' ){
                    fieldName = 'VAT_RATE'
                }
                createField( entityFields, fieldName, method );
            }
        }else{
            createField( entityFields, fieldName, method );
        }
    }else{
        createField( entityFields, fieldName, method );
    }
}

function filterCRM( crm ){
    $('#api option').show();


    switch (crm) {
        case 'company':
            $('#api option[value="deal"]').hide();
            $('#api option[value="contact"]').hide();
            $('#api option[value="quote"]').hide();
            $('#api option[value="invoice"]').hide();
            $('#api option[value="productrow"]').hide();
            break;
        case 'contact':
            $('#api option[value="deal"]').hide();
            $('#api option[value="quote"]').hide();
            $('#api option[value="invoice"]').hide();
            $('#api option[value="productrow"]').hide();
            break;
        case 'deal':
            $('#api option[value="invoice"]').hide();
            break;
        case 'invoice':
            $('#api option[value="quote"]').hide();
            $('#api option[value="lead"]').hide();
            break;
        case 'lead':
            $('#api option[value="deal"]').hide();
            $('#api option[value="quote"]').hide();
            $('#api option[value="invoice"]').hide();
            break;
        case 'quote':
            $('#api option[value="invoice"]').hide();
            $('#api option[value="productrow"]').hide();
            $('#api option[value="invoice"]').hide();
            break;
        default:
            console.log('default');
    }
}
function checkDate( date ){
    var dates = [
        'BEGINDATE',
        'CLOSEDATE',
        'DATE_CREATE',
        'DATE_MODIFY',
        'DATE_UPDATE',
        'BIRTHDATE',
        'DATE_CLOSED',
        'DATE_BILL',
        'DATE_INSERT',
        'DATE_MARKED',
        'DATE_PAY_BEFORE',
        'DATE_PAYED',
        'DATE_STATUS',
        'DATE_UPDATE',
        'PAY_VOUCHER_DATE'
    ];
    return $.inArray( date, dates );
}
function formatDateString( date, format ){
    return moment(date).format( format )
}

function format() {

    var span = document.createElement("span");
    span.style.fontWeight = "bold";
    //span.style.color = "green";

    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

}