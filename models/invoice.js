var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var invoicesSchema= new Schema({
    invoiceNumber:  Number,
    totalPrice:     Number,
    dateOfPublish:  {type:Date,default:Date.now},
    description:    String,
    customer :      { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
});

//create the mongoose Model by calling mongoose.model.
var Invoices=mongoose.model('Invoice',invoicesSchema);

module.exports=Invoices;

