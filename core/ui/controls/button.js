(function() {
    "use strict";

    core.ui.controls.button = core.ui.controls.table || (function() {

            return {

                //#region properties and consts

                //#endregion

                //#region init

                //#endregion

                //#region public functions


                toggleOnOffButton: function(selector, setToState) {
                    var $button = $(selector);
                    if (core.utilities.utils.isUndefined(setToState)) {
                        var currentState = $button.attr("data-state") == "on" ? true : false;
                        setToState = !currentState;
                    }
                    $button.removeClass().addClass(setToState ? "button button-light-bulb-on" : "button button-light-bulb-off");
                    $button.attr("data-state", setToState ? "on" : "off");
                },

                addButtonToTr: function($tr, data, onClickFunction, tooltip, classString) {
                    var $td = $("<td />")
                        .appendTo($tr);

                    var res = $("<div />")
                        .attr("data", data)
                        .attr("i18n-title", tooltip)
                        .click(onClickFunction)
                        .appendTo($td);

                    if (classString) {
                        res.addClass("button " + classString);
                    }
                    return res;
                }

                //#endregion

                //#region private functions

                //#endregion

            }

        })();

})();