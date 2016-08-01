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
    BX24.resizeWindow(window.innerWidth, $(".template-wrap").height());
}

function filterField( currentCRMSection, entityFields, fieldName, method ){
    // console.log( currentCRMSection );
    // console.log( entityFields );
    // console.log( fieldName );
    // console.log( method );
    if( currentCRMSection == 'invoice' ){
        if( method == 'productrow' ){
            if( fieldName == 'CUSTOMIZED' || fieldName == 'DISCOUNT_PRICE' || fieldName == 'DISCOUNT_SUM' || fieldName == 'PRODUCT_NAME' || fieldName == 'PRICE' || fieldName == 'QUANTITY'
                || fieldName == 'TAX_INCLUDED' || fieldName == 'TAX_RATE' || fieldName == 'SUM' || fieldName == 'DISCOUNT_PRICE_ALL' || fieldName == 'PRICE_EXCLUSIVE_ALL'
                || fieldName == 'TAX_SUM' || fieldName == 'SUM_ALL'){
                if( fieldName == 'TAX_INCLUDED' ){
                    fieldName = 'VAT_INCLUDED'
                }
                if( fieldName == 'TAX_RATE' ){
                    fieldName = 'VAT_RATE'
                }
                if( fieldName == 'DISCOUNT_SUM' ){
                    fieldName = 'DISCOUNT_PRICE'
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
            $('#api option[value="user"]').hide();
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

function statusFilter( crmName, status, key, value ){
    var crm = {
        lead: {
            SOURCE: '',
            STATUS: ''
        },

        contact: {
            SOURCE: '',
            CONTACT_TYPE: ''
        },

        company: {
            COMPANY_TYPE: '',
            EMPLOYEES: '',
            INDUSTRY: ''
        },

        deal: {
            DEAL_TYPE: '',
            DEAL_STAGE: '',
            DEAL_STATE: ''
        },

        quote: {
            QUOTE_STATUS: ''
        },

        invoice: {
            N: 'Melnraksts',
            S: 'Nosūtīts',
            A: 'Apstiprināts',
            P: 'Apmaksāts',
            D: 'Atteikts'
        }
    };
    if( checkStatus( key ) != -1 ){
        if( crmName == 'invoice' ){
            if( crm[crmName][key] !== undefined ){
                if( Object.keys(crm[crmName][key]) == value ){
                    value = crm[crmName][key];
                }
            }
        }else{
            if( crm[crmName][status.ENTITY_ID] !== undefined ){
                if( status.STATUS_ID == value ){
                    value = status.NAME;
                }
            }
        }
    }
    return value;

}

function checkStatus( status ){
    var statuses = [
        'EMPLOYEES',
        'INDUSTRY',
        'COMPANY_TYPE',
        'SOURCE_ID',
        'STATUS_ID',
        'TYPE_ID',
        'STAGE_ID',
    ];
    return $.inArray( status, statuses );
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