var page = require('webpage').create();
page.open('http://localhost:8080', function(status) {
    //console.log("Status: " + status);
    if(status === "success") {
        //page.render('baidu.png');
        var title = page.evaluate(function() {
            console.log(document.body)
            return document.title;
        });
        console.log(title);
    }
    phantom.exit();
});