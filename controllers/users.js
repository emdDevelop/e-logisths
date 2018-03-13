var express = require('express');
var router = express.Router();
var webdriver = require('selenium-webdriver');
var firefox = require('selenium-webdriver/firefox');
var path = require('path');
var User = require('../models/user');
var Customers = require('../models/customers');
var Invoices = require('../models/invoice');

By = webdriver.By,
    until = webdriver.until;

router.use(function requireLogin(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    }
    else {
        next();
    }
})

//User profile page
router.get('/profile', function (req, res) {
    var d = new Date(req.user.created_date);
    var mydate = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    //console.log(req.flatsShow);
    res.render('profile', {
        name: req.user.name,
        username: req.user.username,
        date: mydate
    });
})

//Update profile
router.post('/updateProfile', function (req, res) {
    User.findById(req.user._id, function (err, user) {
        if (err) console.log(err);
        user.name = req.body.name;
        user.username = req.body.username;

        user.save(function (err, update) {
            if (err) throw err;
            console.log('Profile updated');
            res.redirect('profile');
        })
    })
})

//Customers page .List with all customers
router.get('/customers', function (req, res) {
    Customers.find({user: req.user._id}, null, {sort: {name: 1}}, function (err, customers) {
        if (err) console.log(err);
        res.render('customers', {
            name: req.user.name,
            customers: customers
        });
    })
})

//Specific Customer details
router.get('/customers/:customersId', function (req, res) {
    Customers.findOne({_id: req.params.customersId}, function (err, customers) {
        if (err) console.log(err);

        res.render('customersAdd', {
            name: req.user.name,
            customers: customers
        });
    })
})

//Edit specific customer details
router.post('/customers/:customersId', function (req, res) {
    Customers.findOne({_id: req.params.customersId}, function (err, customers) {
        if (err) console.log(err);

        customers.name = req.body.name;
        customers.occupation = req.body.occupation;
        customers.address = req.body.address;
        customers.vatId = req.body.vatId;
        customers.taxOffice = req.body.taxOffice;
        customers.phone = req.body.phone;
        customers.mobile = req.body.mobile;
        customers.email = req.body.email;
        customers.taxisUser = req.body.taxisUser;
        customers.taxisPass = req.body.taxisPass;
        customers.gemiUser = req.body.gemiUser;
        customers.gemiPass = req.body.gemiPass;
        customers.amka = req.body.amka;
        customers.priceContract = req.body.priceContract;
        customers.typeOfContract = req.body.typeOfContract;
        customers.regularCustomers=req.body.regularCustomers;
        customers.efkaConfirm=req.body.efkaConfirm;

        customers.save(function (err) {
            if (err) console.log(err);
            else {
                console.log('Customers saved....');
                res.render('customersAdd', {
                    name: req.user.name,
                    customers: customers
                });
            }
        })
    })
})

//Customers add new customer page
router.get('/customersAdd', function (req, res) {
    res.render('customersAdd', {
        name: req.user.name
    });
})

//Customers Add post data
router.post('/customersAdd', function (req, res) {
    var newCustomer = new Customers({
        name: req.body.name,
        occupation: req.body.occupation,
        address: req.body.address,
        taxId: req.body.taxId,
        taxOffice: req.body.taxOffice,
        phone: req.body.phone,
        mobile: req.body.mobile,
        email: req.body.email,
        taxisUser: req.body.taxisUser,
        taxisPass: req.body.taxisPass,
        gemiUser: req.body.gemiUser,
        gemiPass: req.body.gemiPass,
        amka: req.body.amka,
        user: req.user._id,
        priceContract: req.body.priceContract,
        typeOfContract: req.body.typeOfContract,
        regularCustomers:req.body.regularCustomers,
        efkaConfirm:req.body.efkaConfirm
    })
    //Save the new customer to database
    newCustomer.save(function (err) {
        if (err) console.log(err);
        else console.log('Customer saved successfully');
        res.render('customersAdd', {
            name: req.user.name,
            customers: newCustomer
        });
    })
})

//Page to connect to taxisnet
router.get('/taxis', function (req, res) {
    Customers.find({user: req.user._id}, null, {sort: {name: 1}}, function (err, customers) {
        if (err) console.log(err);
        res.render('taxis', {
            name: req.user.name,
            customers: customers
        });
    })
})

//Taxis connect
router.post('/taxis', function (req, res) {
    Customers.findOne({user: req.user._id, _id: req.body.selectedCustomer}, function (err, customer) {
        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        ip = ip.match(/\d+\.\d+\.\d+\.\d+/);
        var url = 'http://' + ip + ':4444/wd/hub';
        console.log(url);
        if (err) console.log(err);
        else {
            res.redirect('taxis');

            var profile = new firefox.Profile();
            //set download directory
            profile.preferences_["browser.download.folderList"] = 2
            profile.preferences_["browser.download.dir"] = path.join(__dirname + '/');

            var opts = new firefox.Options();
            opts.setProfile(profile);

            var driver = new webdriver.Builder()
                .usingServer(url)
                .forBrowser('firefox')
                .setFirefoxOptions(opts)
                .build();

            driver.get('http://www.gsis.gr/gsis/info/gsis_site/index.html');
            driver.wait(until.titleIs('Γενική Γραμματεία Πληροφοριακών Συστημάτων'), 10000);
            driver.findElement(By.xpath("//a[@href='https://www1.gsis.gr/taxisnet/mytaxisnet']")).click();
            // select the newly opened window
            driver.sleep(6000);
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

//Paymenent invoice preparation
router.get('/prepareInvoice', function (req, res) {
    Customers.find({user: req.user._id}, null, {sort: {name: 1}}, function (err, customers) {
        if (err) console.log(err);
        res.render('prepareInvoice', {
            name: req.user.name,
            customers: customers
        })
    })
})

//Paymenent invoice
router.post('/invoice', function (req, res) {
    Customers.findOne({_id: req.body.customer}, function (err, customer) {
        if (err) console.log("Customer not Found");
        else {
            console.log("Customer Found");
            Invoices.count({}, function (err, count) {
                var newInvoice = new Invoices({
                    invoiceNumber: count + 1,
                    totalPrice: req.body.totalPrice,
                    dateOfPublish: req.body.dateOfPublish,
                    description: req.body.description,
                    customer: req.body.customer
                })
                //Save to database new invoice
                newInvoice.save(function (err) {
                    res.render('invoice', {
                        name: req.user.name,
                        invoice: newInvoice,
                        customer: customer
                    });
                });
            })
        }
    })
})

//History invoice
router.get('/invoicesHistory', function (req, res) {
    Invoices.find({}, null, {sort: {invoiceNumber: 1}}).populate('customer').exec(function (err, invoices) {
        if (err) console.log(err);
        else {
            res.render('invoicesHistory', {
                name: req.user.name,
                invoices: invoices
            });
        }
    });
})

router.get('/invoicesHistory/:invoicesId', function (req, res) {
    Invoices.findOne({_id: req.params.invoicesId}, null, {sort: {invoiceNumber: 1}}, function (err, invoices) {
        if (err) console.log(err);
        else{
            Customers.findOne({_id:invoices.customer},function(err,customer){
                res.render('prepareInvoice', {
                    name: req.user.name,
                    invoices: invoices,
                    customers: customer
                })
            })
        }
    })
})

router.post('/invoicesHistory/:invoicesId', function (req, res) {
    Invoices.findOne({_id: req.params.invoicesId}, function (err, invoices) {
        if (err) console.log(err);
        else{
            invoices.totalPrice=req.body.totalPrice;
            invoices.dateOfPublish=req.body.dateOfPublish;
            invoices.description=req.body.description;
            //Save the corrected invoice to Database
            invoices.save(function (err) {
                if (err) console.log(err);
                else {
                    console.log('Invoice saved....');
                    Customers.findOne({_id:invoices.customer},function(err,customer){
                        if (err) console.log(err);
                        else{
                            res.render('invoice', {
                                name: req.user.name,
                                invoice: invoices,
                                customer: customer
                            })
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;


