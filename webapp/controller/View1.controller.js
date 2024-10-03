sap.ui.define(['tcs/fin/ap/controller/BaseController',
    'sap/m/MessageBox',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
],
    function (BaseController, MessageBox, Filter, FilterOperator) {
        'use strict';
        return BaseController.extend("tcs.fin.app.controller.View1", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("detail").attachMatched(this.herculis.bind(this));
            },

            herculis: function (oEvent) {
                var fruitId = oEvent.getParameter("arguments").fruitId;
                // build the path again
                var sPath = "/fruits/" + fruitId;
                var oList = this.getView().byId("idList"); // Get the list control
                oList.setSelectedItem();
                var aItems = oList.getItems(); // Get all items in the list

                for (let i = 0; i < aItems.length; i++) {
                    const element = aItems[i];
                    var sItemPath = element.getBindingContextPath();
                    if (sItemPath === sPath) {
                        oList.setSelectedItem(element);
                        return;
                    }
                }
            },
            onGoTo: function (sIndex) {
                // MessageBox.confirm("this functionality is under construction");
                // var oAppCon = this.getView().getParent();
                // oAppCon.to("idView2");
                this.oRouter.navTo("detail", {
                    fruitId: sIndex
                });
            },
            onItemPress: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("listItem");
                var sPath = oSelectedItem.getBindingContextPath();
                // var oView2 = this.getView().getParent().getPages()[1];
                // var oView2 = this.getView().getParent().getParent().getDetailPages()[0];
                // oView2.bindElement(sPath);

                var sIndex = sPath.split("/")[sPath.split("/").length - 1];

                this.onGoTo(sIndex);
            },
            onItemDelete: function (oEvent) {
                var oItemtoBeDeleted = oEvent.getParameter("listItem");
                this.getView().byId("idList");  //
                var oList = oEvent.getSource();
                oList.removeItem(oItemtoBeDeleted);
            },
            onDeleteSelectedItems: function () {
                var oList = this.getView().byId("idList");
                var aSelectedItems = oList.getSelectedItems();

                for (let i = 0; i < aSelectedItems.length; i++) {
                    const element = aSelectedItems[i];
                    oList.removeItem(element);
                    return;
                }
            },
            onAddProduct: function () {
                this.oRouter.navTo("add");
            },
            onSearch: function (oEvent) {
               //Step 1: What is the value user is searching
            var sVal = oEvent.getParameter("query");
            //Step 2: Constrcust a filter object using model class
            //like a IF condition OP1 operator OP2 - name CONTAINS search_string
            var oFilter = new Filter("CATEGORY", FilterOperator.Contains, sVal);
            // var oFilterCat = new Filter("taste", FilterOperator.Contains, sVal);
            // //Step 3: It is mandatory to add this filter or Multiple filter in an array
            // var aFilter = [oFilter, oFilterCat];
            // //Construct a special OR filter
            // var oFilterMain = new Filter({
            //     filters: aFilter,
            //     and: false
            // });
            //Step 4: Get the filtering of list for items
            var oBinding = this.getView().byId("idList").getBinding("items");
            //Step 5: Apply the filtering on our binding
            oBinding.filter(oFilter);
            }

        })
    });