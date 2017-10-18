var express=require('express');
var router=express.Router();
var User=require('../models/user');
var Customers=require('../models/customers');

router.use(function requireLogin (req, res, next) {
    if (!req.user)
    {
        res.redirect('/login');
    }
    else
    {
        next();
    }
})

//User profile page
router.get('/profile',function(req,res){
    var d=new Date(req.user.created_date);
    var mydate= d.getDate()+'-'+ (d.getMonth()+1)+'-'+ d.getFullYear();
    //console.log(req.flatsShow);
    res.render('profile',{
        name: req.user.name,
        username:req.user.username,
        date:mydate
    });
})

//Update profile
router.post('/updateProfile',function(req,res){
    User.findById(req.user._id,function(err,user){
        if(err) console.log(err);
        user.name=req.body.name;
        user.username=req.body.username;

        user.save(function(err,update){
            if(err) throw err;
            console.log('update');
            res.redirect('profile');
        })
    })
})

//Customers page
router.get('/customers',function(req,res){
    Customers.find({user:req.user._id},function(err,customers){
        if (err) console.log(err);
        res.render('customers',{
            name: req.user.name,
            customers:customers
        });
    })
})

//Customers add page
router.get('/customersAdd',function(req,res){
    res.render('customersAdd',{
        name: req.user.name
    });
})

//Customers Add post data
router.post('/customersAdd',function(req,res){
    var newCustomer= new Customers({
        name:       req.body.name,
        phone:      req.body.phone,
        mobile:     req.body.mobile,
        email:      req.body.email,
        taxisUser:  req.body.taxisUser,
        taxisPass:  req.body.taxisPass,
        amka:       req.body.amka,
        user :      req.user._id
    })

    newCustomer.save(function(err){
        if (err) console.log(err);
        else console.log('Customer saved successfully');
        res.render('customersAdd',{
            name:req.user.name,
            customers:newCustomer
        });
    })
})

module.exports = router;


