sap.ui.define([
    'sap/ui/core/UIComponent'
], function (UIComponent) {
    'use strict';
    return UIComponent.extend("tcs.fin.ap.Component", {
        metadata: {
            manifest: "json"
        },
        init: function () {
            UIComponent.prototype.init.apply(this);
            var oRouter = this.getRouter();
            oRouter.initialize();
        },
        // createContent: function() {
        //     var oView = new sap.ui.view({
        //         id: "idRoot",
        //         viewName: "tcs.fin.ap.view.App",
        //         type: "XML"
        //     });

        //     var oView1 = new sap.ui.view({
        //         id: "idView1",
        //         viewName: "tcs.fin.ap.view.View1",
        //         type: "XML"
        //     });

        //     var oView2 = new sap.ui.view({
        //         id: "idView2",
        //         viewName: "tcs.fin.ap.view.View2",
        //         type: "XML"
        //     });

        //     var oAppCon = oView.byId("idAppCon")
        //     oAppCon.addMasterPage(oView1).addDetailPage(oView2);
        //     return oView;
        // },
        destroy: function () {
            // Cleanup if necessary
        }
    });
});
