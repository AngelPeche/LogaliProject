sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox) {
        "use strict";

        return Controller.extend("logali.logali.controller.MainView", {
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            },

            onNavigate: function(iView) {
                
                var oRouter = this.getOwnerComponent().getRouter();
			    oRouter.navTo(iView);
    
            },

            onAfterRendering: function(){

                // Error en el framework: Al agregar la dirección URL de "Firmar
                //pedidos", el componente GenericTile debería navegar directamente a dicha URL,
                // pero no funciona en la versión 1.78. Por tanto, una solución encontrada es
                //eliminando la propiedad id del componente por jquery
                
                var genericTileFirmarPedido = this.byId("idTile3");
                //Id del dom
                var idGenericTileFirmarPedido = genericTileFirmarPedido.getId();
                //Se vacía el id
                jQuery("#"+idGenericTileFirmarPedido)[0].id = ""; 
            },

        });
    });
