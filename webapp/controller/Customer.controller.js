sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"at/clouddna/training00/FioriDeepDive/formatter/formatter",
	"sap/ui/core/routing/History"
], function (Controller, JSONModel, MessageBox, Fragment, formatter, History) {
	"use strict";

	return Controller.extend("at.clouddna.training00.FioriDeepDive.controller.Customer", {
		//Properties
		_fragmentList: {},
		_sMode: "",

		//Formatter
		formatter: formatter,

		//View initialization----------------------------------------------------------------------------------
		onInit: function () {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {
			let oEditModel = new JSONModel({
					editmode: false
				}),
				sCustomerId = oEvent.getParameter("arguments").customerid;

			this.getView().setModel(oEditModel, "editModel");

			if (sCustomerId !== "create") {
				this._sMode = "display";
				this._showCustomerFragment("DisplayCustomer");
				this.getView().bindElement("/CustomerSet(guid'" + sCustomerId + "')");
			} else {
				this._sMode = "create";

				let createModel = new JSONModel({
					Firstname: "",
					Lastname: "",
					AcademicTitle: "",
					Gender: "",
					Email: "",
					Phone: "",
					Website: ""
				});

				this.getView().setModel(createModel, "createModel");
				oEditModel.setProperty("/editmode", true);

				this._showCustomerFragment("CreateCustomer");
			}
		},

		//Button Handler-------------------------------------------------------------------------

		onNavBack: function () {
			let oHistory = History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

				oRouter.navTo("Main", true);
			}
		},

		onEditPress: function (oEvent) {
			this._toggleEdit(true, {}, false);
		},

		onSavePress: function (oEvent) {
			let oCustomer = this.getView().getModel().getData();

			this._toggleEdit(false);
			MessageBox.information(JSON.stringify(oCustomer));

		},

		//Edit/Display toggle----------------------------------------------------------------------------

		_toggleEdit: function (bEditMode) {
			let oEditModel = this.getView().getModel("editModel");

			oEditModel.setProperty("/editmode", bEditMode);

			this._showCustomerFragment(bEditMode ? "EditCustomer" : "DisplayCustomer");
		},

		_showCustomerFragment: function (sFragmentName) {
			let oPage = this.getView().byId("page");

			oPage.removeAllContent();
			if (this._fragmentList[sFragmentName]) {
				oPage.insertContent(this._fragmentList[sFragmentName]);
			} else {
				Fragment.load({
					id: this.getView().createId(sFragmentName),
					name: "at.clouddna.training00.FioriDeepDive.view." + sFragmentName,
					controller: this
				}).then(function (oFragment) {
					this._fragmentList[sFragmentName] = oFragment;
					oPage.insertContent(oFragment);
				}.bind(this));
			}
		}
	});
});