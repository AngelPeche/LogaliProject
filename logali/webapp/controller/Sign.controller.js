sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History"
    ],
    function(BaseController,History) {
      "use strict";
  
      return BaseController.extend("logali.logali.controller.Sign", {
        onInit() {
        },

        onNavBack: function () {
          var oHistory = History.getInstance();
          var sPreviousHash = oHistory.getPreviousHash();
    
          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("MainView", {}, true);
          }
        }
      });
    }
  );
  