(function() {
    "use strict";



    core.ui.modules.displayPoweredByController = core.ui.modules.displayPoweredByController  || (function() {
        return {

            //#region properties and consts

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#display-powered-by-control-container");
                //NOTE: no noeed to translate this is the format on every languages
                $container.html("<span class='font-weight-bold' style='display: none'>Powered by:</span> <a  style='display: none' class='font-weight-bold cursor-pointer text-decoration-none' id='open-wecdev-url'>wecdev.com</a><span style='display: none'>&nbsp;/&nbsp;</span>");


                $("#open-wecdev-url").click(core.ui.modules.displayPoweredByController.openWecdevUrlLinkOnClick);

                browser.i18n.setAllI18nStrings($container);
            },

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            openWecdevUrlLinkOnClick: function() {
                core.ui.modules.displayPoweredByLogic.openWecdevUrl();
            }

            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(core.ui.modules.displayPoweredByController.initUI);


})();





