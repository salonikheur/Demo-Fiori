sap.ui.define(['tcs/fin/ap/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/routing/History'
],
    function (BaseController, MessageBox, MessageToast, History) {
        'use strict';
        return BaseController.extend("tcs.fin.app.controller.View3", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("supplier").attachMatched(this.herculis.bind(this));
            },
            herculis: function (oEvent) {
                var suppId = oEvent.getParameter("arguments").suppId;
                var sPath = "/suppliers/" + suppId;
                this.getView().bindElement(sPath);
            },
            onBack: function () {
                const oHistory = History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("detail", { fruitId: 0 }, true);
                }
            }

        })
    });