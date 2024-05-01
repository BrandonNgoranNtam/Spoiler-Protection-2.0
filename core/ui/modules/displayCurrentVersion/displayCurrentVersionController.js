(function() {
    "use strict";

    core.ui.modules.displayCurrentVersionController = core.ui.modules.displayCurrentVersionController  || (function() {
        return {

            //#region properties and consts

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#display-current-version-control-container");
                $container.html("<span i18n='version'></span>: <span id='current-version'></span>");

                $("#current-version").append(core.ui.modules.displayCurrentVersionLogic.getCurrentVersion());

                browser.i18n.setAllI18nStrings($container);
            }

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(core.ui.modules.displayCurrentVersionController.initUI);

})();






