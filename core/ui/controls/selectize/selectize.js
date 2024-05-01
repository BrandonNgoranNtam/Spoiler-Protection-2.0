(function() {
    "use strict";


    core.ui.controls.selectize = core.ui.controls.selectize || (function() {

        return {

            //#region properties and consts

            //#endregion

            //#region init

            init: function (jQuerySelector, placeholder, data, cssClass) {
                var $selectize = $(jQuerySelector);

                var allCssClass = "form-control selectize-input";
                if (cssClass) {
                    allCssClass += " " + cssClass;
                }

                if (data) {
                    $.each(data, function(key, item) {
                        $selectize.append($("<option></option>")
                            .attr("value",item.value)
                            .text(item.text));
                    });
                }

                browser.i18n.setAllI18nStrings($selectize);
                $selectize.selectize({
                    inputClass: allCssClass,
                    placeholder: browser.i18n.getMessage(placeholder)
                });

            },


            //#endregion

            //#region public functions

            clear: function(selector) {
                var $selectize = $(selector).selectize();
                var selectize = $selectize[0].selectize;
                selectize.clear(true);
            },

            setValue: function(selector, value, silent) {
                var $selectize = $(selector).selectize();
                var selectize = $selectize[0].selectize;
                selectize.setValue(value, silent);
            },

            getValue: function(selector) {
                var $selectize = $(selector).selectize();
                var selectize = $selectize[0].selectize;
                selectize.getValue();
            },

            //#endregion

            //#region private functions

            //#endregion

        }

    })();
})();

