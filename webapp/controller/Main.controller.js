sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";

	return Controller.extend("at.clouddna.training00.FioriDeepDive.controller.Main", {

		onInit: function () {

		},

		onDeleteCustomerPress: function (oEvent) {
			let sCustomerPath = oEvent.getSource().getBindingContext().sPath,
				oModel = this.getView().getModel(),
				oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			MessageBox.confirm(oBundle.getText("dialog.delete"), {
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.OK) {
						oModel.remove(sCustomerPath, {
							success: function () {
								MessageBox.success(oBundle.getText("dialog.delete.success"));
							},
							error: function (oError) {
								MessageBox.error(oError.message);
							}
						});
					}
				}
			});
		}

	});

});