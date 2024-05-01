(function() {
    "use strict";

    core.ui.modules.resetExtensionController = core.ui.modules.resetExtensionController  || (function() {
        return {

            //#region properties and consts

            //#endregion

            //#region init

            initUI: function() {

                var $container = $("#reset-extension-control-container");
                $container.html("<button type='button' id='reset-extension-button' class='btn btn-danger' i18n='reset_extension'></button>");
                $("#reset-extension-button").click(core.ui.modules.resetExtensionController.resetExtensionButtonOnClick);

                browser.i18n.setAllI18nStrings($container);

            },

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            resetExtensionButtonOnClick: function() {
                core.ui.modules.resetExtensionLogic.resetExtension();
            }

            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(core.ui.modules.resetExtensionController.initUI);


})();






