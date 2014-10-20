_.templateSettings.interpolate = /{([\s\S])}/g;

var api_key = "e5akcrosbhe7wyu22vdfda2b";

var etsy_url = [
    "https://openapi.etsy.com/",
    "v2/",
    "listings/",
    "active.js",
    "?",
    "api_key=",
    api_key,
    "&callback=?"
].join("");

$.getJSON(etsy_url).then(function(data){
    console.log(data);
});


function EtsyClient(options) {
    if (!options.api_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY!?!?");
    }
    this.etsy_url = "https://openapi.etsy.com/";
    this.version = options.api_version || "v2/";
    this.api_key = options.api_key;
    this.complete_api_url = this.etsy_url + this.version;

    this.init();
}
debugger


EtsyClient.prototype.pullAllActiveListings = function() {
    var model = 'listings/';
    var filter = 'active';
    return $.getJSON(this.complete_api_url + model + filter + ".js?api_key=" + this.api_key + "&callback=?").then(function(data) {
        console.log(data);
    });
};

EtsyClient.prototype.getListingInfo = function(id) {
    var model = 'listings';
    return $.getJSON(this.complete_api_url + model + '/' + id + ".js?api_key=" + this.api_key + "&callback=?").then(function(data) {
        console.log(data);
    });
};

EtsyClient.prototype.loadTemplateFile = function (templateName) {
    return $.get('./templates/' + templateName + '.html').then(function(htmlstring){
        return htmlstring;
    });
};

EtsyClient.prototype.putAllActiveListingsOnPage = function (LISTINGShtml, listings) {
    document.querySelector('.large-8 .columns').innerHTML = _.template(LISTINGShtml, listings);
};

EtsyClient.prototype.putListingInfoOnPage = function(listingHTML, listing) {
        console.log(listing);
    document.querySelector('.large-4 .small-6 .columns').innerHTML = _.template(listingHTML, listing);
};

EtsyClient.prototype.init = function() {
    var self = this;
    $.when(
        this.pullAllActiveListings(),
        this.getListingInfo(),
        this.loadTemplateFile(),
        this.putAllActiveListingsOnPage(),
        this.putListingInfoOnPage(),
    ).then(function(listings, linsting, LISTINGShtml, listingHTML) {
        self.putAllActiveListingsOnPage(LISTINGShtml, listings);
        self.putListingInfoOnPage(listingHTML, listing);
        });
};

window.onload = app;

function app (){
    var etsyApp = new EtsyClient (e5akcrosbhe7wyu22vdfda2b);
}
