sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"at/clouddna/training00/FioriDeepDive/formatter/formatter"
], function (Controller, JSONModel, MessageBox, Fragment, formatter) {
	"use strict";

	return Controller.extend("at.clouddna.training00.FioriDeepDive.controller.Customer", {
		_fragmentList: {},

		formatter: formatter,

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

			this._showCustomerFragment("DisplayCustomer");

			this.getView().bindElement("/CustomerSet(guid'" + sCustomerId + "')");
		},

		onEditPress: function (oEvent) {
			this._toggleEdit(true, {}, false);
		},

		onSavePress: function (oEvent) {
			let oCustomer = this.getView().getModel().getData();

			this._toggleEdit(false);
			MessageBox.information(JSON.stringify(oCustomer));

		},

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