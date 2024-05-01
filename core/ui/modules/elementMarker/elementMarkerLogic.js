(function() {
    "use strict";

    //NOTE: this class can't contains functions because storage serialization corrupts it
    function elementMarker() {
        this.nodeNames = "";
        this.classes = "";
        this.jQuerySelectorClasses = "";
        this.ids = "";
        this.jQuerySelectorIds = "";
        this.removeSelectors = "";
    }

    core.ui.modules.elementMarkerLogic = core.ui.modules.elementMarkerLogic || (function() {
        return {

            //#region properties and consts

            //#endregion

            //#region init

            extendMessage: function() {
                core.utilities.message.MARK_ELEMENTS_BY_JQUERY_FILTER = "markElementsByJQueryFilter";

                core.utilities.message.sendShowItemsByJQueryFilterMessage = function(jQueryFilter) {
                    var message = core.utilities.message.getMessage(core.utilities.message.MARK_ELEMENTS_BY_JQUERY_FILTER, jQueryFilter);
                    browser.tabs.sendMessageToActiveTabs(message)
                };
            },

            //#endregion

            //#region public functions

            getElementMarker: function(nodeNamesText, classesText, idsText, removeSelectors) {
                var res = new elementMarker();
                if (nodeNamesText.length > 0) {
                    res.nodeNames = nodeNamesText;
                }

                if (classesText.length > 0) {
                    res.classes = classesText;
                    res.jQuerySelectorClasses = core.ui.modules.elementMarkerLogic.getJQueryFormattedClasses(classesText);
                }

                if (idsText.length > 0) {
                    res.ids = idsText;
                    res.jQuerySelectorIds = core.ui.modules.elementMarkerLogic.getJQueryFormattedIds(idsText);
                }

                if (removeSelectors && removeSelectors.length > 0) {
                    res.removeSelectors = removeSelectors;
                }

                return res;
            },


            markElementsByNodeNames: function (nodeNamesText) {
                if (nodeNamesText.length > 0) {
                    core.utilities.message.sendShowItemsByJQueryFilterMessage(nodeNamesText);
                }
            },

            markElementsByClasses: function (classesText) {
                if (classesText.length > 0) {
                    core.utilities.message.sendShowItemsByJQueryFilterMessage(core.ui.modules.elementMarkerLogic.getJQueryFormattedClasses(classesText));
                }
            },

            markElementsByNodeIds: function (idsText) {
                if (idsText.length > 0) {
                    core.utilities.message.sendShowItemsByJQueryFilterMessage(core.ui.modules.elementMarkerLogic.getJQueryFormattedIds(idsText));
                }
            },

            markElementsByRemoveSelectors: function (removeSelectors) {
                if (removeSelectors.length > 0) {
                    core.utilities.message.sendShowItemsByJQueryFilterMessage(removeSelectors);
                }
            },

            //#endregion

            //#region private functions

            getJQueryFormattedClasses: function(text) {
                return "." + text.replaceAll(",", ",.");
            },


            getJQueryFormattedIds: function(text) {
                return "#" + text.replaceAll(",", ",#");
            },


            //#endregion
        }
    })();

    core.utilities.message.addOnExtendMessagesEvent(core.ui.modules.elementMarkerLogic.extendMessage);


})();





