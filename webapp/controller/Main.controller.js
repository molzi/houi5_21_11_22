sap.ui.define([
	"at/clouddna/training0/FioriDeepDive/controller/BaseController",
	"sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("at.clouddna.training0.FioriDeepDive.controller.Main", {

		onInit: function () {
			this.getRouter().getRoute("Main").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {

		},

		onNewCustomerPress: function (oEvent) {
			let oRouter = this.getRouter();

			oRouter.navTo("Customer", {
				customerid: "create"
			}, false);
		},

		onCustomerPress: function (oEvent) {
			let oRouter = this.getRouter(),
				sCustomerId = oEvent.getSource().getBindingContext().sPath.split("'")[1];

			oRouter.navTo("Customer", {
				customerid: sCustomerId
			}, false);
		},

		onDeleteCustomerPress: function (oEvent) {
			let sCustomerPath = oEvent.getSource().getBindingContext().sPath,
				oModel = this.getModel();

			MessageBox.confirm(this.geti18nText("dialog.delete", []), {
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.OK) {
						this.getView().setBusy(true);
						oModel.remove(sCustomerPath, {
							success: function () {
								MessageBox.success(this.geti18nText("dialog.delete.success"));
								this.logInfo("Delete successful for " + sCustomerPath);
								this.getView().setBusy(false);
							}.bind(this),
							error: function (oError) {
								MessageBox.error(oError.message);
								this.logError("Delete successful for " + sCustomerPath);
								this.getView().setBusy(false);
							}.bind(this)
						});
					}
				}.bind(this)
			});
		}

	});

});