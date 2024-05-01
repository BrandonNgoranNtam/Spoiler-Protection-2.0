(function() {
    "use strict";

    core.ui.modules.horizontalShareController = core.ui.modules.horizontalShareController  || (function() {
        return {

            //#region properties and consts

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#share-control-container");
                $container.html("<div id='shareIcons'></div>");

                $("#shareIcons").jsSocials(core.ui.modules.horizontalShareLogic.getJsSocialsConfiguration());

                $(".jssocials-shares a").each(function (i, link) {
                    var $link = $(link);
                    $link.click(function(event) {
                        var $i = $(event.currentTarget).find("i");
                        core.ui.modules.horizontalShareLogic.linkClicked($i.attr('class'));
                    });
                });

                browser.i18n.setAllI18nStrings($container);
            },

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            //#endregion
        }
    })();


    core.ui.utilities.ui.addOnInitUIEvent(core.ui.modules.horizontalShareController.initUI);


})();





