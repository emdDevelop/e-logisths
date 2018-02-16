console.log('inside side');

function formatDate(dateToFormat){
    var monthsArray=[1,2,3,4,5,6,7,8,9,10,11,12];
    var invoiceDate=new Date(dateToFormat);
    var setDateToInput;
        setDateToInput=invoiceDate.getDate()+'-'+monthsArray[invoiceDate.getMonth()]+'-'+invoiceDate.getFullYear();

    return setDateToInput;
}

