sap.ui.define(['tcs/fin/ap/controller/BaseController'],
    function(BaseController){ 
        'use strict';
return BaseController.extend("tcs.fin.ap.controller.App",{
    onInit:function(){
        BaseController.prototype.onInit.apply(this);
    }
});
});