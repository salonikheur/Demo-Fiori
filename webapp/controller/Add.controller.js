sap.ui.define(['tcs/fin/ap/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/ui/core/Fragment'
],
    function (BaseController, JSONModel, MessageBox, Fragment) {
        'use strict';
        return BaseController.extend("tcs.fin.ap.controller.Add", {
            productPayload: {
                "PRODUCT_ID": "",
                "TYPE_CODE": "PR",
                "CATEGORY": "Notebooks",
                "NAME": "",
                "DESCRIPTION": "",
                "SUPPLIER_ID": "0100000000",
                "SUPPLIER_NAME": "Becker Berlin",
                "TAX_TARIF_CODE": "1 ",
                "MEASURE_UNIT": "EA",
                "PRICE": "0.00",
                "CURRENCY_CODE": "EUR",
                "DIM_UNIT": "CM",
                "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/"
            },
            localModel: null,
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("add").attachMatched(this.herculis.bind(this));
                //create local json model with sap sample payload 
                this.localModel = new JSONModel(this.productPayload);
                //set it to only current view
                this.getView().setModel(this.localModel, 'prod');
            },
            herculis: function (oEvent) {

            },
            prodId: null,
            mode: "Create",
            setMode: function (sMode) {
                this.mode = sMode;
                if (this.mode === "Create") {
                    this.getView().byId("prodId").setEnabled(true);
                    this.getView().byId("idSave").setText("Save");
                    this.getView().byId("idDelete").setEnabled(false);
                } else {
                    this.getView().byId("prodId").setEnabled(false);
                    this.getView().byId("idSave").setText("Update");
                    this.getView().byId("idDelete").setEnabled(true);
                }
            },
            onLoadProduct: function (oEvent) {
                this.prodId = oEvent.getParameter("value");
                var oDataModel = this.getView().getModel();
                var that = this;
                oDataModel.read("/ProductSet('" + this.prodId + "')", {
                    success: function (data) {
                        that.localModel.setProperty("/", data);
                        that.setMode("Update");
                        that.getView().byId("prodImage").setSrc("/sap/opu/odata/sap/ZSALONI_ODATA_SRV/ProductImgSet('" + that.prodId + "')/$value");
                    },
                    error: function () {
                        that.setMode("Create");
                    }
                });
            },
            onClear: function () {
                this.productPayload.NAME = "";
                this.productPayload.PRODUCT_ID = "";
                this.productPayload.DESCRIPTION = "";
                this.productPayload.PRICE = 0;
                this.productPayload.SUPPLIER_ID = "0100000000";
                this.localModel.setProperty("/", this.productPayload);
                this.setMode("Create");
            },
            onLoadExp: function () {
                //1: get the category for which we need to load most exp product
                var sCat = this.localModel.getProperty("/CATEGORY");
                //2: get the odata model 
                var oDataModel = this.getView().getModel();
                //3: trigger the call to load most exp product by passing the catgeory
                var that = this;
                oDataModel.callFunction("/GetMostExpensiveProduct", {
                    urlParameters: {
                        I_CATEGORY: sCat
                    },
                    success: function(data) {
                        //4: success callback where we can set data back to local model
                        that.localModel.setProperty("/", data);
                    }
                });
            },
            onDelete: function () {
                //1: get the odata model object
                var oDataModel = this.getView().getModel();
                //2: prepare the path for deleting product
                var that = this;
                oDataModel.remove("/ProductSet('" + this.prodId + "')", {
                    success: function () {
                        //3: handle response
                        MessageBox.confirm("Deletion was success");
                        that.onClear();
                    }
                })
            },
            oSupplierPopup: null,
            oField: null,
            onConfirm: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sName = oSelectedItem.getTitle();
                var sId = oSelectedItem.getIntro();
                this.getView().getModel("prod").setProperty("/SUPPLIER_ID", sId);
                this.getView().getModel("prod").setProperty("/SUPPLIER_NAME", sName);

            },
            onF4Help: function (oEvent) {
                this.oField = oEvent.getSource();
                if (!this.oSupplierPopup) {
                    Fragment.load({
                        id: 'supplier',
                        name: 'tcs.fin.ap.fragments.popup',
                        type: 'XML',
                        controller: this
                    }).then(function (oFragment) {
                        //set global variable when first time object is created
                        this.oSupplierPopup = oFragment;
                        //The object is acting like remote control
                        this.oSupplierPopup.setTitle("Choose Supplier");
                        //Allowing access of all models which view has access;also to fragment
                        this.getView().addDependent(this.oSupplierPopup, this);
                        //Dynamic binding with our fragment to show suppliers
                        this.oSupplierPopup.bindAggregation("items", {
                            path: '/SupplierSet',
                            template: new sap.m.ObjectListItem({
                                title: '{COMPANY_NAME}',
                                intro: '{BP_ID}',
                                icon: 'sap-icon://supplier'
                            })
                        });
                        this.oSupplierPopup.setMultiSelect(true);
                        this.oSupplierPopup.open();


                    }
                        //explicitly passing my controller object to the promise function
                        .bind(this));


                } else {
                    this.oSupplierPopup.open();
                }
            },
            onSave: function () {
                var payload = this.localModel.getProperty("/");
                if (!payload.PRODUCT_ID || !payload.NAME) {
                    MessageBox.error("Oho! The mandatory data was missed");
                    return;
                }
                payload.PRODUCT_PIC_URL = payload.PRODUCT_PIC_URL + payload.PRODUCT_ID;
                var oDataModel = this.getOwnerComponent().getModel();
                if (this.mode === "Create") {
                    oDataModel.create("/ProductSet", payload, {
                        success: function (data) {
                            MessageBox.show("Boom! Your product was saved!")
                        },
                        error: function (oError) {
                            MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message)
                        }
                    });
                } else {
                    oDataModel.update("/ProductSet('" + this.prodId + "')", payload, {
                        success: function (data) {
                            MessageBox.show("Boom! Your product was updated!")
                        },
                        error: function (oError) {
                            MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message)
                        }
                    });
                }

            }
        });
    });