(function() {
    "use strict";

    core.ui.modules.enableDisableExtensionController = core.ui.modules.enableDisableExtensionController  || (function() {
        return {

            //#region properties and consts

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#enable-disable-extension-control-container");

                //NOTE: quick-animation is needed only the first time when the input gets it's default value, and we need the toggle without animation
                //later we have to remove it

                $container.html("<input type='checkbox' id='enable-disable-extension-toggle' checked='checked' data-toggle='toggle' data-width='157' data-onstyle='success' data-offstyle='danger' i18n-data-on='extension_on' i18n-data-off='extension_off' data-style='quick-animation' /> ");

                core.ui.controls.toggler.init("#enable-disable-extension-toggle",
                    core.ui.modules.enableDisableExtensionLogic.getExtensionIsEnabled(),
                    core.ui.modules.enableDisableExtensionController.toggleEnableDisableExtensionOnChanged);

                browser.i18n.setAllI18nStrings($container);

            },

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            toggleEnableDisableExtensionOnChanged: function(event) {
                 core.ui.modules.enableDisableExtensionLogic.toggleExtensionIsEnabled(event);
            }

            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(core.ui.modules.enableDisableExtensionController.initUI);


})();





