var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var customersSchema= new Schema({
    name:           {type:String,required: true,unique:true},
    occupation:     String,
    address:        String,
    vatId:          {type:String,required: true,unique:true},
    taxOffice:      String,
    phone:          Number,
    mobile:         Number,
    email:          String,
    taxisUser:      String,
    taxisPass:      String,
    amka:           String,
    priceContract:  Number,
    user :      [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

//create the mongoose Model by calling mongoose.model.
var Customers=mongoose.model('customers',customersSchema);

module.exports=Customers;

