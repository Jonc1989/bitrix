function diff(a, b) {
    return a.filter(function(i) {return b.indexOf(i) < 0;});
}

function sortByParams(a,b) {
    return a.params.parent.substring(1) - b.params.parent.substring(1);
}

function sortById(a,b) {
    return a.id.substring(1) - b.id.substring(1);
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