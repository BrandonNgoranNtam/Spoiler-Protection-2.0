(function() {
    "use strict";

    function horizontalShareLogicConfig() {
        this.jsSocialsConfiguration = null;
    };

    core.ui.modules.horizontalShareLogic = core.ui.modules.horizontalShareLogic  || (function() {
        return {

            //#region properties and consts

            moduleName: "horizontalShare",
            config: null,

            //#endregion

            //#region init


            //#endregion

            //#region public functions


            getJsSocialsConfiguration: function() {
                return core.ui.modules.horizontalShareLogic.config.jsSocialsConfiguration;
            },

            linkClicked: function (linkClass) {
                core.utilities.googleAnalitics.trackEvent("Share " + linkClass, "Clicked");
            }
            //#endregion

            //#region private functions

            //#endregion
        }
    })();

    core.ui.modules.horizontalShareLogic.config = new horizontalShareLogicConfig();

})();





