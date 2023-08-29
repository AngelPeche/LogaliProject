sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "jquery.sap.global"
    ],
    function(BaseController,History) {
      "use strict";
  
      return BaseController.extend("logali.logali.controller.ViewEmployee", {
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
          
        },

      });
    },
  );
  