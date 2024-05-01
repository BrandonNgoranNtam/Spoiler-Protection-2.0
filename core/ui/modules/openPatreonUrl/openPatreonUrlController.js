(function() {
    "use strict";

    core.ui.modules.openPatreonUrlController = core.ui.modules.openPatreonUrlController  || (function() {
        return {

            //#region properties and consts

            //#endregion

            //#region init

            initUI: function () {

                var $container = $("#open-patreon-url-control-container");
                $container.html("<a id='open-patreon-url-button' class='btn btn-social btn-warning' >" +
                                    "<i class='background-patreon'></i>&nbsp;<span i18n='support_patreon' ></span>" +
                                "</a>"+
                                "<a id='open-kofi-url-button' class='btn btn-social btn-info' >" +
                                    "<i class='background-kofi'></i>&nbsp;<span i18n='support_kofi' ></span>" +
                                "</a>");
                $("#open-patreon-url-button").click(core.ui.modules.openPatreonUrlController.openPatreonUrlButtonOnClick);
                $("#open-kofi-url-button").click(core.ui.modules.openPatreonUrlController.openKofiUrlButtonOnClick);

                browser.i18n.setAllI18nStrings($container);
            },

            //#endregion

            //#region public functions

            //#endregion

            //# region private functions

            openPatreonUrlButtonOnClick: function() {
                core.ui.modules.openPatreonUrlLogic.openPatreonUrl();
            },


            openKofiUrlButtonOnClick: function() {
                core.ui.modules.openPatreonUrlLogic.openKofiUrl();
            }



            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(core.ui.modules.openPatreonUrlController.initUI);



})();







