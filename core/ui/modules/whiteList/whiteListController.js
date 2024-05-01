(function() {
    "use strict";

    core.ui.modules.whiteListController = core.ui.modules.whiteListController  || (function() {
        return {

            //#region properties and consts

            $whiteList: null,
            $whiteListUrlText: null,

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#white-list-control-container");

                $container.html("" +
                    "<div class='text-align-center'>" +
                    "   <span class='font-weight-bold' i18n='white_list'></span>" +
                    "</div>" +
                    "<table class='td-vertical-center-content-table td-padding-4px-table'>" +
                    "    <tbody>" +
                    "        <tr>" +
                    "            <td>" +
                    "                <input type='text' id='white-list-url-text' class='form-control full-input-width' i18n-placeholder='enter_white_list_url'/>" +
                    "            </td>" +
                    "            <td>" +
                    "                <div id='add-white-list-url' class='button button-add' i18n-title='add_white_list_url'></div>" +
                    "            </td>" +
                    "        </tr>" +
                    "    </tbody>" +
                    "</table>" +
                    "<div class='white-list-container'>" +
                    "    <table><tbody id='white-list'></tbody></table>" +
                    "</div>" +
                    "");

                core.ui.modules.whiteListController.$whiteList = $("#white-list");
                core.ui.modules.whiteListController.$whiteListUrlText = $("#white-list-url-text");
                var $addWhiteListUrl = $("#add-white-list-url");

                core.ui.modules.whiteListController.$whiteListUrlText.keypress(function(e) {
                    if (e.which === 13) {
                        core.ui.modules.whiteListController.addWhiteListUrlOnClick();
                    }
                });
                core.ui.modules.whiteListController.$whiteListUrlText.focus();

                $addWhiteListUrl.click(core.ui.modules.whiteListController.addWhiteListUrlOnClick);


                core.ui.modules.whiteListController.renderWhiteListUrlList();

                browser.i18n.setAllI18nStrings($container);
            },

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            renderWhiteListUrlList: function() {
                var $container = core.ui.modules.whiteListController.$whiteList;
                $container.empty();
                $.each(core.ui.modules.whiteListLogic.getSortedWhiteListUrlList(), function (key, value) {
                    var $whiteListTr = $("<tr />")
                        .appendTo($container);

                    core.ui.controls.button.addButtonToTr($whiteListTr,
                        value,
                        core.ui.modules.whiteListController.removeWhiteListUrlOnClick,
                        "remove_white_list_url_text",
                        "button-delete");

                    var $whiteListContainerTextTd = $("<td />")
                        .appendTo($whiteListTr);

                    $("<div />")
                        .text(value)
                        .appendTo($whiteListContainerTextTd);
                });

                browser.i18n.setAllI18nStrings($container);
            },

            addWhiteListUrlOnClick: function() {
                var $whiteListUrlText = core.ui.modules.whiteListController.$whiteListUrlText;
                var whiteListUrlText = $whiteListUrlText.val().trim();
                core.ui.modules.whiteListLogic.addWhiteListUrl(whiteListUrlText, core.ui.modules.whiteListController.whiteListChangedInSetting);
                $whiteListUrlText.val("");
            },

            removeWhiteListUrlOnClick: function() {
                var removeLink = $(this);
                var whiteListUrlText = removeLink.attr("data");
                core.ui.modules.whiteListLogic.removeWhiteListUrl(whiteListUrlText, core.ui.modules.whiteListController.whiteListChangedInSetting);
            },

            whiteListChangedInSetting:  function () {
                core.ui.modules.whiteListController.renderWhiteListUrlList();
                core.ui.modules.whiteListLogic.executeWhiteListChangedFunction();
            }

            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(core.ui.modules.whiteListController.initUI);


})();





