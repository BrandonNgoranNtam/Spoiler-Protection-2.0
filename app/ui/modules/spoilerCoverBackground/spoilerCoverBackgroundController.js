(function() {
    "use strict";

    app.ui.modules.spoilerCoverBackgroundController = app.ui.modules.spoilerCoverBackgroundController  || (function() {
        return {

            //#region properties and consts

            $whiteList: null,
            $whiteListUrlText: null,

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#spoiler-cover-background-controller-container");

                $container.html("" +
                    "<div class='text-align-center'>" +
                    "   <span class='font-weight-bold' i18n='background_color'></span>" +
                    "</div>" +
                    "<table class='td-vertical-center-content-table'>" +
                    "    <tbody>" +
                    "        <tr>" +
                    "            <td>" +
                    "                <input type='text' id='background-color-picker'>" +
                    "            </td>" +
                    "        </tr>" +
                    "    </tbody>" +
                    "</table>" +
                    "");


                   var backgroundColorPicker = $('#background-color-picker');
                   backgroundColorPicker.spectrum({
                       color: app.ui.modules.spoilerCoverBackgroundLogic.getBackgroundColor(),
                       preferredFormat: "hex",
                       showInput: true,
                       allowEmpty:true,
                       showPalette: true,
                       showSelectionPalette: false,
                       clickoutFiresChange: true,
                       showButtons: false,
                       palette: [
                           ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                           ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                           ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                           ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                           ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                           ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                           ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                           ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
                       ],
                       change: function(color) {
                           if (color == null) {
                               core.utilities.settings.setBackgroundColor(color, app.ui.modules.spoilerCoverBackgroundController.backgroundColorChangedInSetting);
                           } else {
                               var colorHex = color.toHexString();
                               core.utilities.settings.setBackgroundColor(colorHex, app.ui.modules.spoilerCoverBackgroundController.backgroundColorChangedInSetting);
                           }
                           backgroundColorPicker.spectrum("hide");
                       }
                   });
               browser.i18n.setAllI18nStrings($container);
            },

            backgroundColorChangedInSetting: function () {
                core.utilities.message.sendReloadCurrentTabSpoilersMessage();
            }

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(app.ui.modules.spoilerCoverBackgroundController.initUI);


})();





