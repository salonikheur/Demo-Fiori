sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'tcs/fin/ap/util/Formatter'
], function(Controller, Formatter) {
    'use strict';
    return Controller.extend("tcs.fin.ap.controller.BaseController",{
        // reuable variable
        formatter: Formatter,
        pie: 3.14,
        myReuseFunction: function() {
            alert("for testing purpose...");
        },
        onInit: function() {
            console.log("I am base controller class constructor");        }
    });
});