(function() {
    "use strict";

    core.ui.modules.openOptionPageController = core.ui.modules.openOptionPageController  || (function() {
        return {

            //#region properties and consts

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#open-option-page-control-container");
                $container.html("<button type='button' id='open-options-page-button' class='btn btn-info' i18n='settings'></button>");
                $("#open-options-page-button").click(core.ui.modules.openOptionPageController.openOptionPageButtonOnClick);

                browser.i18n.setAllI18nStrings($container);
            },

            //#endregion

            //#region public functions

            //#endregion

            //# region private functions

            openOptionPageButtonOnClick: function() {
                core.ui.modules.openOptionPageLogic.openOptionPage()
            }

            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(core.ui.modules.openOptionPageController.initUI);

})();






