sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        'sap/ui/model/json/JSONModel',
        "sap/m/MessageBox",
    ],
    function(BaseController,History,JSONModel,MessageBox) {
      "use strict";
  
      return BaseController.extend("logali.logali.controller.CreateEmployee", {
        onInit: function () {
          this._wizard = this.byId("CreateEmployee");
          this._oNavContainer = this.byId("wizardNavContainer");
          this._oWizardContentPage = this.byId("wizardContentPage");

          this.model = new JSONModel();    
          this.getView().setModel(this.model);
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

        scrollto2: function () {
          this._wizard.goToStep(this.byId("EmployeeStep"));
        },
    
        wizardCompletedHandler: function () {
          this._oNavContainer.to(this.byId("wizardReviewPage"));
        },
    
        backToWizardContent: function () {
          this._oNavContainer.backToPage(this._oWizardContentPage.getId());
        },
    
        editStepOne: function () {
          this._handleNavigationToStep(0);
        },
    
        editStepTwo: function () {
          this._handleNavigationToStep(1);
        },
    
        editStepThree: function () {
          this._handleNavigationToStep(2);
        },
    
        _handleNavigationToStep: function (iStepNumber) {
          var fnAfterNavigate = function () {
            this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
            this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
          }.bind(this);
    
          this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
          this.backToWizardContent();
        },
    
        _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
          MessageBox[sMessageBoxType](sMessage, {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.YES) {
                this._handleNavigationToStep(0);
                this._wizard.discardProgress(this._wizard.getSteps()[0]);
              }
            }.bind(this)
          });
        },
    
        _setEmptyValue: function (sPath) {
          this.model.setProperty(sPath, "n/a");
        },
    
        handleWizardCancel: function () {
          this._handleMessageBoxOpen("Are you sure you want to cancel your report?", "warning");
        },
    
        handleWizardSubmit: function () {
          this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");
        },
    
        productWeighStateFormatter: function (val) {
          return isNaN(val) ? "Error" : "None";
        },
    
        discardProgress: function () {
          this._wizard.discardProgress(this.byId("TypeStep"));
    
          var clearContent = function (content) {
            for (var i = 0; i < content.length; i++) {
              if (content[i].setValue) {
                content[i].setValue("");
              }
    
              if (content[i].getContent) {
                clearContent(content[i].getContent());
              }
            }
          };
    
          this.model.setProperty("/productWeightState", "Error");
          this.model.setProperty("/productNameState", "Error");
          clearContent(this._wizard.getSteps());
        },
        
        handleNavigationChange: function (oEvent) {
          this._oSelectedStep = oEvent.getParameter("step");
          this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
        },

        onDialogNextButton: function (oEvent) {
          this._oWizard = this.getView().byId("CreateEmployee");
          var text = this.getView().byId("_IDGenSegmentedButton1").getSelectedKey();
          this.model.setProperty("/tipo", text);
          //this._oWizard.nextStep();

          this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
          var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];

          if (this._oSelectedStep && !this._oSelectedStep.bLast) {
            this._oWizard.goToStep(oNextStep, true);
          } else {
            this._oWizard.nextStep();
          }

          this._iSelectedStepIndex++;
          this._oSelectedStep = oNextStep;
        },

        addInfoEmployee: function () {
          var name = this.byId("_IDGenLabel1").getValue();
          //var weight = parseInt(this.byId("ProductWeight").getValue());

          if (name !== '') {
            this.model.setProperty("/nombre", name);
          } else {
            this.model.setProperty("/nombre", name);
          }
        },

        onSetTypeEmployee: function(evt){
          var tipo = evt.getParameters().item.getText();

          if (tipo == "Autónomo"){
            this.getView().byId("_IDGenLabel8").setVisible(false);
            this.getView().byId("idInpDNI").setVisible(false);
            this.getView().byId("_IDGenLabel3").setVisible(true);
            this.getView().byId("idInpCIF").setVisible(true);
          }else{
            this.getView().byId("_IDGenLabel8").setVisible(true);
            this.getView().byId("idInpDNI").setVisible(true);
            this.getView().byId("_IDGenLabel3").setVisible(false);
            this.getView().byId("idInpCIF").setVisible(false);
          }
			    //this.model.setProperty("/TypeEmployee", productType);
        },
        
        onStartUpload: function() {
          var oAttachmentUpl = this.byId("attachmentUpl");
          var aIncompleteItems = oAttachmentUpl.getIncompleteItems();
          var textSlug = "iepvapeche@gmail.com";
          this.iIncompleteItems = aIncompleteItems.length; //used to turn off busy indicator upon completion of all pending uploads
          if (this.iIncompleteItems !== 0) {
            //oAttachmentUpl.setBusy(true);
            this.i = 0; //used to turn off busy indicator when all uploads complete
            for (var i = 0; i < this.iIncompleteItems; i++) {
            var sFileName = aIncompleteItems[i].getProperty("fileName");
            var oXCSRFToken = new sap.ui.core.Item({
              key: "X-CSRF-Token",
              text: this.getOwnerComponent().getModel().getSecurityToken()
            });
            textSlug = textSlug + ";" + 'id' + ";" + sFileName;
            var oSlug = new sap.ui.core.Item({
              key: "SLUG",
              text: textSlug
            });
            oAttachmentUpl.addHeaderField(oXCSRFToken).addHeaderField(oSlug).uploadItem(aIncompleteItems[i]);
            oAttachmentUpl.removeAllHeaderFields(); //at least slug header field must be reset after each upload
            }
          }
        },

        onUploadCompleted: function() {
          this.i += 1;
          if (this.i === this.iIncompleteItems) { //turn off busy indicator when all attachments have completed uploading
            this.byId('attachmentUpl').setBusy(false);
          }
        },

        onSaveEmployee:function(){
          this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");
        },


      });
    }
  );
  