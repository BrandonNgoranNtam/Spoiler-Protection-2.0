(function() {
    "use strict";

    core.ui.modules.dontForgetToSmileController = core.ui.modules.dontForgetToSmileController  || (function() {
        return {

            //#region properties and consts

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#dont-forget-to-smile-control-container");
                $container.html("" +
                    "<table class='td-vertical-center-content-table horizontal-center-content'>" +
                    "   <tbody>" +
                    "       <tr>" +
                    "           <td>" +
                    "               <span i18n='dont_forget_to_smile'></span>" +
                    "           </td>" +
                    "           <td>" +
                    "               <div class='button-smile'></div>" +
                    "           </td>" +
                    "       </tr>" +
                    "   </tbody>" +
                    "</table>" +
                    "");

                browser.i18n.setAllI18nStrings($container);
            }

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(core.ui.modules.dontForgetToSmileController.initUI);


})();





