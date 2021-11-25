sap.ui.define([
	"at/clouddna/training00/FioriDeepDive/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"at/clouddna/training00/FioriDeepDive/formatter/formatter",
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, MessageBox, Fragment, formatter, History) {
	"use strict";

	return BaseController.extend("at.clouddna.training00.FioriDeepDive.controller.Customer", {
		//Properties
		_fragmentList: {},
		_sMode: "",

		//Formatter
		formatter: formatter,

		//View initialization----------------------------------------------------------------------------------
		onInit: function () {
			this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {
			let oEditModel = new JSONModel({
					editmode: false
				}),
				sCustomerId = oEvent.getParameter("arguments").customerid;

			this.setModel(oEditModel, "editModel");

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

				this.setModel(createModel, "createModel");
				oEditModel.setProperty("/editmode", true);

				this._showCustomerFragment("CreateCustomer");
			}
		},

		//Button Handler-------------------------------------------------------------------------

		onCancelPress: function (oEvent) {
			MessageBox.confirm(this.geti18nText("dialog.cancel"), {
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.OK) {
						if (this._sMode === "create") {
							this.onNavBack();
						} else {
							if (this.getModel().hasPendingChanges()) {
								this.getModel().resetChanges();
							}

							this._toggleEdit(false);
						}
					}
				}.bind(this)
			});
		},

		onEditPress: function (oEvent) {
			this._toggleEdit(true, {}, false);
		},

		onSavePress: function (oEvent) {
			if (this._sMode === "create") {
				let oModel = this.getModel(),
					oCreateData = this.getModel("createModel").getData();

				oModel.create("/CustomerSet", oCreateData, {
					success: function (oData, response) {
						MessageBox.success(this.geti18nText("dialog.create.success"), {
							onClose: function () {
								this.onNavBack();
							}.bind(this)
						});
					}.bind(this),
					error: function (oError) {
						MessageBox.error(oError.message, {
							onClose: function () {
								this.onNavBack();
							}.bind(this)
						});
					}.bind(this)
				});
			} else {
				if (this.getModel().hasPendingChanges()) {
					this.getModel().submitChanges();
					MessageBox.information(this.geti18nText("dialog.update.success"));
				} else {

				}
				this._toggleEdit(false);
			}

		},

		//Edit/Display toggle----------------------------------------------------------------------------

		_toggleEdit: function (bEditMode) {
			let oEditModel = this.getModel("editModel");

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
					this.logInfo(`Fragment ${sFragmentName} loaded`);

					this._fragmentList[sFragmentName] = oFragment;
					oPage.insertContent(oFragment);
				}.bind(this));
			}
		}
	});
});