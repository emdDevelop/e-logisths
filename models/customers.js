var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var customersSchema= new Schema({
    name:               {type:String,required: true,unique:true},
    occupation:         String,
    address:            String,
    vatId:              String,
    taxOffice:          String,
    phone:              Number,
    mobile:             Number,
    email:              String,
    taxisUser:          String,
    taxisPass:          String,
    gemiUser:           String,
    gemiPass:           String,
    amka:               String,
    priceContract:      Number,
    typeOfContract:     Boolean,
    regularCustomers:   Boolean,
    efkaConfirm:        Boolean,
    user :              [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

//create the mongoose Model by calling mongoose.model.
var Customers=mongoose.model('Customer',customersSchema);

module.exports=Customers;

