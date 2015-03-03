// _.templateSettings.interpolate = /{([\s\S])}/g;

// var api_key = "e5akcrosbhe7wyu22vdfda2b";

// var etsy_url = [
//     "https://openapi.etsy.com/",
//     "v2/",
//     "listings/",
//     "active.js", // <--- added '.js' to the end here, because Etsy provides JSONP this way
//     "?",
//     "api_key=",
//     api_key,
//     "&callback=?" // <--- told jQuery to handle the request as JSONP
// ].join("");


// $.getJSON(etsy_url).then(function(data){
//     console.log(data);
// });

// function EtsyClient(options) {
//     if (!options.api_key) {
//         throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY!?!?");
//     }
//     this.etsy_url = "https://openapi.etsy.com/";
//     this.version = options.api_version || "v2/";
//     this.api_key = options.api_key;
//     this.complete_api_url = this.etsy_url + this.version;

//     this.init();
// }


// EtsyClient.prototype.pullAllActiveListings = function() {
//     var model = 'listings/';
//     var filter = 'active';
//     return $.getJSON(this.complete_api_url + model + filter + ".js?api_key=" + this.api_key + "&includes=Images&callback=?")
//     .then(function(data) {
//         console.log(data);
//     });
// };

// EtsyClient.prototype.getListingInfo = function(id) {
//     var model = 'listings';
//     return $.getJSON(this.complete_api_url + model + '/' + id + ".js?api_key=" + this.api_key + "&callback=?").then(function(data) {
//         console.log(data);
//     });
// };

// EtsyClient.prototype.loadTemplateFile = function (templateName) {
//     return $.get('./templates/' + templateName + '.html').then(function(htmlstring){
//         return htmlstring;
//     });
// };

// EtsyClient.prototype.drawListings = function(templateString, data) {
//     var items = document.querySelector('large-8 columns');

//     var bigHtmlString = data.results.map(function(element) {
//         return _.template(templateString, element);
//     }).join('');

//     items.innerHTML = bigHtmlString;
// }

// EtsyClient.prototype.putListingInfoOnPage = function(listingHTML, listing) {
//         console.log(listing);
//     document.querySelector('.large-4 .small-6 .columns').innerHTML = _.template(listingHTML, listing);
// };

// EtsyClient.prototype.init = function() {
//     var self = this;
//     $.when(
//         this.pullAllActiveListings(),
//         this.getListingInfo(),
//         this.loadTemplateFile("allListings"),
//         this.loadTemplateFile("singleListing")
//         // this.putAllActiveListingsOnPage(),
//         // this.putListingInfoOnPage(),
//     ).then(function(data, listing, LISTINGShtml, listingHTML) {
//         debugger;
//         self.drawListings(LISTINGShtml, data),
//         self.putListingInfoOnPage(listingHTML, listing);
//         });
// };



// // $.getJSON(etsy_url).then(function(data){
// //     console.log(data);
// // });

window.onload = app;

// runs when the DOM is loaded

function app() {

    // load some scripts (uses promises :D)
    //loader.load(
    {
        url: "./bower_components/jquery/dist/jquery.min.js"
    }; {
        url: "./bower_components/lodash/dist/lodash.min.js"
    }; {
        url: "./bower_components/pathjs/path.min.js"
    };then(function() {
        _.templateSettings.interpolate = /{([\s\S]+?)}/g;

        var options = {
                api_key: "ab2ph0vvjrfql5ppli3pucmw"
            }
            // start app?
        var client = new EtsyClient(options);


    })

}

function EtsyClient(options) {
    if (!options.api_key) {
        throw new Error("nope! need an API");
    }
    this.etsy_url = "https://openapi.etsy.com/";
    this.version = "v2/";
    this.api_key = options.api_key;
    this.complete_api_url = this.etsy_url + this.version;

    this.setupRouting();
}

EtsyClient.prototype.pullAllActiveListings = function() {
    return $.getJSON(
            this.complete_api_url + "listings/active.js?api_key=" + this.api_key + "&includes=Images,Shop&callback=?")
        .then(function(data) {
            console.log(data);
            return data;
        });
}

EtsyClient.prototype.pullSingleListing = function(id) {
    return $.getJSON(this.complete_api_url + "listings/" + id + ".js?api_key=" + this.api_key + "&includes=Images,Shop&callback=?")
        .then(function(data) {
            console.log(data);
            return data;
        });
}

// EtsyClient.prototype.pullShopInfo = function() {

//  return $.get(this.complete_api_url + "listings/active.js?api_key=" + this.api_key + "&includes=Images,Shop&callback=?")
// }

EtsyClient.prototype.loadTemplate = function(name) {
    if (!this.templates) {
        this.templates = {};
    }

    var self = this;

    if (this.templates[name]) {
        var promise = $.Deferred();
        promise.resolve(this.templates[name]);
        return promise;
    } else {
        return $.get('./templates/' + name + '.html').then(function(data) {
            self.templates[name] = data; // <-- cache it for any subsequent requests to this template
            return data;
        });
    }
}

EtsyClient.prototype.drawListings = function(templateString, data) {
    var items = document.querySelector('#all_listings');

    var bigHtmlString = data.results.map(function(element) {
        return _.template(templateString, element);
    }).join('');

    items.innerHTML = bigHtmlString;
}

EtsyClient.prototype.drawSingleListing = function(templateString, data) {
    var single = document.querySelector("#home");

    var bigHtmlString = _.template(templateString, data.results[0]);

    single.innerHTML = bigHtmlString;
            $('#description').trunk8({
            lines: 5
        });
}

// EtsyClient.prototype.drawShopInfo = function(templateString, data) {
//  var shop = document.querySelector("#shop");

//  var bigHtmlString = _.template(templateString, data.results[0].shop);

//  single.innerHTML = bigHtmlString;
// }

EtsyClient.prototype.setupRouting = function() {
    var self = this;

    Path.map("#/").to(function() {
        $.when(
            self.loadTemplate("allListings"),
            self.pullAllActiveListings()
        ).then(function(allHtml, allData) {
            self.drawListings(allHtml, allData);
        });
    });

    Path.map("#/message/anymessage").to(function() {
        alert(this.params.anymessage);
    });

    Path.map("#/listing/:id").to(function() {
        $.when(
            self.loadTemplate("singleListing"),
            // self.loadTemplate("shop"),
            self.pullSingleListing(this.params.id)
        ).then(function(singleHtml, singleData) {
            self.drawSingleListing(singleHtml, singleData);
            // self.drawShopInfo(singleData);
        });
    });

    Path.root("#/");
    Path.listen();

}

//mine
// Add data to HTML functions
// Add all active listings on page
// EtsyClient.prototype.addAllActiveListingsToPage = function(html, data) {
//     // console.log(data);
//     // console.log(html);
//     document.querySelector('#all_listings').innerHTML =
//         data.results.map(function(element) {
//             return _.template(html, element);
//         }).join("");
// };

// First try
// _.templateSettings.interpolate = /{([\s\S]+?)}/g;

// // The code below correctly gets all the active listings from Etsy.
// // var etsy_url = "https://openapi.etsy.com/";
// // var version = "v2/";
// // var model = "listings/";
// // var filter = "active";
// // var js = ".js";
// // var api_key = "aavnvygu0h5r52qes74x9zvo";
// // var complete_api_url = etsy_url + version;

// // $.getJSON(complete_api_url + model + filter + js + "?" + "api_key=" + api_key + "&callback=?").then(function(data){
// //     console.log(data);
// // });


// // so when we create a new EtsyClient instance, we will be passing an options object
// // as its argument. Something like:
// // var example = new EtsyClient({version: v2/, api_key: blah, complete_api_url: blah})
// function EtsyClient(options) {
//     if (!options.api_key) {
//         throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY!?!?");
//     }
//     this.etsy_url = "https://openapi.etsy.com/";
//     this.version = options.api_version || "v2/";
//     this.api_key = options.api_key;
//     this.complete_api_url = this.etsy_url + this.version;

//     // this.getAllActiveListings();
//     this.init();
// }

// // Get data functions
// // Get all active listings. Also added an includes to get the images FUCKYAAAAA.
// EtsyClient.prototype.getAllActiveListings = function() {
//     var model = 'listings/'; // the forward slash was missing from the notes code.
//     var filter = 'active';
//     return $.getJSON(this.complete_api_url + model + filter + ".js?includes=Images(url_75x75)&api_key=" + this.api_key + "&callback=?").then(function(data) {
//         // console.log(data);
//         return data;
//     });
// };



// // Get HTML templates function
// EtsyClient.prototype.loadTemplateFile = function(templateName) {
//     return $.get('templates/' + templateName + '.html')
//         .then(function(htmlString) {
//             return htmlString;
//         });
// };


// // Add data to HTML functions
// // Add all active listings on page
// EtsyClient.prototype.addAllActiveListingsToPage = function(html, data) {
//     // console.log(data);
//     // console.log(html);
//     document.querySelector('#all_listings').innerHTML =
//         data.results.map(function(element) {
//             return _.template(html, element);
//         }).join("");
// };

// // Add single listing to page
// EtsyClient.prototype.addSingleListingToPage = function(html, data) {
//     // console.log(data);
//     document.querySelector('#home').innerHTML =
//         data.results.map(function(element) {
//             return _.template(html, element);
//         }).join("");
// };



// EtsyClient.prototype.init = function() {
//     var self = this;
//     this.setupRouting();

//     $.when(
//         this.getAllActiveListings(),
//         this.loadTemplateFile('allListings')
//     ).then(function(allActiveListings, allListingsHtml) {
//         self.addAllActiveListingsToPage(allListingsHtml, allActiveListings);
//     });
// };


// // -----------------------------------
// // pathJS single page
// EtsyClient.prototype.setupRouting = function() {
//     var self = this;

//     Path.map("#/").to(function() {
//         self.showListings();
//     });

//     Path.map("#/listing/:id").to(function() {
//         console.log(this);
//         self.showListing(this.params.id);
//     });

//     // set the default hash
//     Path.root("#/");
//     Path.listen();
// }



// // -----------------------------------


// //---------------------------
// // jQuery singlepage
// // EtsyClient.prototype.singleProduct = function(listingId) {
// //     var self = this;
// //     $.when(
// //         this.getListingInfo(listingId),
// //         this.loadTemplateFile('singleListing')
// //     ).then(function(singleListing, singleListingHtml) {
// //         self.addSingleListingToPage(singleListingHtml, singleListing);
// //     });
// // };
// // ---------------------------
// // // Add single listing to page
// // EtsyClient.prototype.addSingleListingToPage = function(html, data) {
// //     // console.log(data);
// //     document.querySelector('#home').innerHTML =
// //         data.results.map(function(element) {
// //             return _.template(html, element);
// //         }).join("");
// // };
// // ---------------------------
// // // Get individual listing
// // EtsyClient.prototype.getListingInfo = function(etsyId) {
// //     var model = 'listings/'; // the forward slash was missing from the notes code.
// //     var filter = etsyId;
// //     return $.getJSON("https://openapi.etsy.com/v2/" + model + filter + ".js?api_key=" + "ab2ph0vvjrfql5ppli3pucmw" + "&callback=?").then(function(data) {
// //         console.log(data);
// //         return data;
// //     });
// // };
// //---------------------------

// // window.onload = app;

// // function app() {
// //     var etsy = new EtsyClient({
// //         api_key: "ab2ph0vvjrfql5ppli3pucmw"
// //     });
// //     $("body").on("click", ".etsyItem", function() {
// //         etsy.singleProduct(this.getAttribute("listingid"));
// //     });
// // }

// // var etsyId = $(".etsyItem").click(function(){$(this).listing_id;});
