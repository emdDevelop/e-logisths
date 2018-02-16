
function formatDate(dateToFormat){
    var monthsArray=[1,2,3,4,5,6,7,8,9,10,11,12];
    var invoiceDate=new Date(dateToFormat);
    var setDateToInput;
        setDateToInput=invoiceDate.getDate()+'-'+monthsArray[invoiceDate.getMonth()]+'-'+invoiceDate.getFullYear();

    return setDateToInput;
}

function formatDateForInput(dateToFormat){
    var monthsArray=[1,2,3,4,5,6,7,8,9,10,11,12];
    var invoiceDate=new Date(dateToFormat);
    var setDateToInput;
    if(invoiceDate.getMonth()<10)
        setDateToInput=invoiceDate.getFullYear()+'-0'+monthsArray[invoiceDate.getMonth()]+'-'+invoiceDate.getDate();
    else if(invoiceDate.getDate()<10)
        setDateToInput=invoiceDate.getFullYear()+'-'+monthsArray[invoiceDate.getMonth()]+'-0'+invoiceDate.getDate();
    else if(invoiceDate.getMonth()<10 && invoiceDate.getDate()<10)
        setDateToInput=invoiceDate.getFullYear()+'-0'+monthsArray[invoiceDate.getMonth()]+'-0'+invoiceDate.getDate();
    else
        setDateToInput=invoiceDate.getFullYear()+'-'+monthsArray[invoiceDate.getMonth()]+'-'+invoiceDate.getDate();

    return setDateToInput;
}

