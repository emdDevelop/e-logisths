var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var invoicesSchema= new Schema({
    invoiceNumber:  Number,
    totalPrice:     Number,
    dateOfPublish:  String,
    description:    String,
    customer :      [{ type: Schema.Types.ObjectId, ref: 'Customer' }]
})

//create the mongoose Model by calling mongoose.model.
var Invoices=mongoose.model('invoices',invoicesSchema);

module.exports=Invoices;

