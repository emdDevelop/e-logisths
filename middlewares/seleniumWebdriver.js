var webdriver=require('selenium-webdriver');
var firefox = require('selenium-webdriver/firefox');
var path=require('path');

By = webdriver.By,
    until = webdriver.until;

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
    //.build();


module.exports=driver;
