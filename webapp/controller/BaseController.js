sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/base/Log"
], function (Controller, History, Log) {
	"use strict";

	return Controller.extend("at.clouddna.training0.FioriDeepDive.controller.BaseController", {
		_sContentDensityClass: "",

		getRouter: function () {
			this.setContentDensity();

			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		setContentDensity: function () {
			this.getView().addStyleClass(this._getContentDensityClass());
		},

		_getContentDensityClass: function () {
			if (!this._sContentDensityClass) {
				if (!sap.ui.Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		setDirtyState: function (bState) {
			if (sap.ushell) {
				sap.ushell.Container.setDirtyFlag(bState);
				this.logInfo("Dirty flag set to " + bState ? "true" : "false");
			} else {
				this.logWarning("Cant set dirty flag: Not in Launchpad Mode");
			}
		},

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

		logDebug: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.debug("DEBUG - " + sMessage);
		},

		logError: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.error("ERROR - " + sMessage);
		},

		logFatal: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.fatal("FATAL - " + sMessage);
		},

		logInfo: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.info("INFO - " + sMessage);
		},

		logTrace: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.trace("TRACE - " + sMessage);
		},

		logWarning: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.warning("WARNING - " + sMessage);
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			this.getView().setModel(oModel, sName);
		},

		geti18nText: function (sId, aParams) {
			let oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			return oBundle.getText(sId, aParams);
		}

	});
});