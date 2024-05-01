(function() {
    "use strict";

    app.ui.modules.openFacebookGroupUrlController = app.ui.modules.openFacebookGroupUrlController  || (function() {
        return {

            //#region properties and consts

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#open-facebook-group-url-control-container");
                $container.html("<b><a id='open-facebook-group-link' i18n='ask_in_facebook_group' class='cursor-pointer text-decoration-none'></a></b>");
                $("#open-facebook-group-link").click(app.ui.modules.openFacebookGroupUrlController.openFacebookGroupButtonOnClick);

                browser.i18n.setAllI18nStrings($container);
            },

            //#endregion

            //#region public functions

            //#endregion

            //# region private functions

            openFacebookGroupButtonOnClick: function() {
                app.ui.modules.openFacebookGroupUrlLogic.openOrReloadFacebookGroupUrl();
            }

            //#endregion
        }
    })();


    core.ui.utilities.ui.addOnInitUIEvent(app.ui.modules.openFacebookGroupUrlController.initUI);


})();







