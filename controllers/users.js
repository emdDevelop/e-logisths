var express=require('express');
var router=express.Router();
var webdriver=require('selenium-webdriver');
var firefox = require('selenium-webdriver/firefox');
var path=require('path');
var User=require('../models/user');
var Customers=require('../models/customers');

By = webdriver.By,
    until = webdriver.until;

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

router.get('/customers/:customersId',function(req,res){
    Customers.findOne({_id: req.params.customersId},function(err,customers){
        if (err) console.log(err);

        res.render('customersAdd',{
            name: req.user.name,
            customers:customers
        });
    })
})

router.post('/customers/:customersId',function(req,res){
    Customers.findOne({_id: req.params.customersId},function(err,customers){
        if (err) console.log(err);

            customers.name=req.body.name;
            customers.phone=req.body.phone;
            customers.mobile=req.body.mobile;
            customers.mail=req.body.email;
            customers.taxisUser=req.body.taxisUser;
            customers.taxisPass=req.body.taxisPass;
            customers.amka=req.body.amka;

        customers.save(function(err){
            if (err) console.log(err);
            else{
                console.log('Customers saved....');
                res.render('customersAdd',{
                    name: req.user.name,
                    customers:customers
                });
            }
        })
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

//Page to connect to taxisnet
router.get('/taxis',function(req,res){
    Customers.find({user:req.user._id},function(err,customers){
        if (err) console.log(err);
        res.render('taxis',{
            name: req.user.name,
            customers:customers
        });
    })
})

//Taxis connect
router.post('/taxis',function(req,res){
    Customers.findOne({user:req.user._id,_id:req.body.selectedCustomer},function(err,customer){
        if (err) console.log(err);
        else{
            res.redirect('taxis');

            var profile = new firefox.Profile();
//set download directory
            profile.preferences_["browser.download.folderList"] = 2
            profile.preferences_["browser.download.dir"] = path.join(__dirname+ '/');
//disable Firefox's built-in PDF viewer
            profile.preferences_["pdfjs.disabled"] = true;
            profile.preferences_["browser.helperApps.neverAsk.saveToDisk"] = 'application/pdf';
//disable Adobe Acrobat PDF preview plugin
            profile.preferences_["plugin.scan.plid.all"] = false
            profile.preferences_["plugin.scan.Acrobat"] = "99.0"

            var opts = new firefox.Options();
            opts.setProfile(profile);

            var driver = new webdriver.Builder()
                .forBrowser('firefox')
                .setFirefoxOptions(opts)
                .build();

            driver.get('http://www.gsis.gr/gsis/info/gsis_site/index.html');
            driver.wait(until.titleIs('Γενική Γραμματεία Πληροφοριακών Συστημάτων'), 10000);
            driver.findElement(By.xpath("//a[@href='https://www1.gsis.gr/taxisnet/mytaxisnet']")).click();
            // select the newly opened window
            driver.sleep(10000);
            driver.getAllWindowHandles().then(function gotWindowHandles(allhandles) {
                driver.switchTo().window(allhandles[allhandles.length - 1]);
                driver.wait(until.titleIs('Sign In'), 20000);
                driver.findElement(By.name('ssousername')).sendKeys(customer.taxisUser);
                driver.findElement(By.name('password')).sendKeys(customer.taxisPass);
                driver.findElement(By.xpath("/*//*[@value='OK']")).click();
            });
        }
    })
})

module.exports = router;


