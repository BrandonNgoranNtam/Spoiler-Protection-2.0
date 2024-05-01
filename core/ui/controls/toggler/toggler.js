(function() {
    "use strict";

    core.ui.controls.toggler = core.ui.controls.toggler || (function() {

        return {

            //#region properties and consts

            //#endregion

            //#region init

            init: function (jQuerySelector, isStateOn, onChangeFunction) {
                var $toggle = $(jQuerySelector);
                browser.i18n.setAllI18nStrings($toggle);
                $toggle.bootstrapToggle(isStateOn ? "on" : "off");
                $toggle.change(onChangeFunction);
                $(document).ready(function () {
                    //NOTE: remove quick-animation for fancy switch animation
                    core.ui.controls.toggler.removeQuickAnimation($toggle);
                });

            },

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            removeQuickAnimation: function ($element) {
                $element.removeAttr("data-style")
                    .parent()
                    .removeClass("quick-animation");
            }

            //#endregion

        }

    })();

})();