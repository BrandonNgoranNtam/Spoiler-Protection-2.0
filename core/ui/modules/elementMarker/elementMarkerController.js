(function() {
    "use strict";


    core.ui.modules.elementMarkerController = core.ui.modules.elementMarkerController  || (function() {
        return {

            //#region properties and consts

            $nodeNamesToMark: null,
            $classesToMark: null,
            $idsToMark: null,
            $removeSelectorsToMark: null,

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#element-marker-control-container");
                $container.html("" +
                    "<table class='td-vertical-center-content-table td-padding-4px-table'>" +
                    "    <tbody>" +
                    "        <tr>" +
                    "            <td>" +
                    "                <textarea id='node-names-to-mark' class='form-control textarea-resize-none textarea-2row-height full-input-width' i18n-placeholder='enter_node_names' ></textarea>" +
                    "            </td>" +
                    "            <td>" +
                    "                <div id='mark-elements-by-node-names' class='button button-show' i18n-title='show'></div>" +
                    "            </td>" +
                    "        </tr>" +
                    "        <tr>" +
                    "            <td>" +
                    "                <textarea id='classes-to-mark' class='form-control textarea-resize-none textarea-2row-height full-input-width' i18n-placeholder='enter_classes' ></textarea>" +
                    "            </td>" +
                    "            <td>" +
                    "                <div id='mark-elements-by-classes' class='button button-show' i18n-title='show'></div>" +
                    "            </td>" +
                    "        </tr>" +
                    "        <tr>" +
                    "            <td>" +
                    "                <textarea id='ids-to-mark' class='form-control textarea-resize-none textarea-2row-height full-input-width' i18n-placeholder='enter_ids' ></textarea>" +
                    "            </td>" +
                    "            <td>" +
                    "                <div id='mark-elements-by-ids' class='button button-show' i18n-title='show'></div>" +
                    "            </td>" +
                    "        </tr>" +
                    "        <tr>" +
                    "            <td>" +
                    "                <textarea id='remove-selectors-to-mark' class='form-control textarea-resize-none textarea-2row-height full-input-width' i18n-placeholder='enter_remove_filters' ></textarea>" +
                    "            </td>" +
                    "            <td>" +
                    "                <div id='mark-elements-by-remove-selectors' class='button button-show' i18n-title='show'></div>" +
                    "            </td>" +
                    "        </tr>" +
                    "    </tbody>" +
                    "</table> " +
                    "" );

                core.ui.modules.elementMarkerController.$nodeNamesToMark = $("#node-names-to-mark");
                core.ui.modules.elementMarkerController.$classesToMark = $("#classes-to-mark");
                core.ui.modules.elementMarkerController.$idsToMark = $("#ids-to-mark");
                core.ui.modules.elementMarkerController.$removeSelectorsToMark = $("#remove-selectors-to-mark");

                $("#mark-elements-by-node-names").click(core.ui.modules.elementMarkerController.markElementsByNodeNamesOnClick);
                $("#mark-elements-by-classes").click(core.ui.modules.elementMarkerController.markElementsByClassesOnClick);
                $("#mark-elements-by-ids").click(core.ui.modules.elementMarkerController.markElementsByNodeIdsOnClick);
                $("#mark-elements-by-remove-selectors").click(core.ui.modules.elementMarkerController.markElementsByRemoveSelectorsOnClick);

                browser.i18n.setAllI18nStrings($container);
            },

            //#endregion

            //#region public functions

            setElementMarker(elementMarker) {
                core.ui.modules.elementMarkerController.$nodeNamesToMark.val(elementMarker.nodeNames);
                core.ui.modules.elementMarkerController.$classesToMark.val(elementMarker.classes);
                core.ui.modules.elementMarkerController.$idsToMark.val(elementMarker.ids);
                core.ui.modules.elementMarkerController.$removeSelectorsToMark.val(elementMarker.removeSelectors);
            },

            getElementMarkerAndClear() {
                var $nodeNamesToMark = core.ui.modules.elementMarkerController.$nodeNamesToMark;
                var $classesToMark = core.ui.modules.elementMarkerController.$classesToMark;
                var $idsToMark = core.ui.modules.elementMarkerController.$idsToMark;
                var $removeSelectorsToMark = core.ui.modules.elementMarkerController.$removeSelectorsToMark;

                var res = core.ui.modules.elementMarkerLogic.getElementMarker($nodeNamesToMark.val().trim(), $classesToMark.val().trim(), $idsToMark.val().trim(),$removeSelectorsToMark.val().trim());

                $nodeNamesToMark.val("");
                $classesToMark.val("");
                $idsToMark.val("");

                return res;
            },

            //#endregion

            //#region private functions

            markElementsByNodeNamesOnClick: function () {
                var $nodeNamesToMark = $("#node-names-to-mark");
                var nodeNamesText =  $nodeNamesToMark.val().trim();
                core.ui.modules.elementMarkerLogic.markElementsByNodeNames(nodeNamesText);
            },

            markElementsByClassesOnClick: function () {
                var $classesToMark = $("#classes-to-mark");
                var classesText =  $classesToMark.val().trim();
                core.ui.modules.elementMarkerLogic.markElementsByClasses(classesText);
            },

            markElementsByNodeIdsOnClick: function () {
                var $idsToMark = $("#ids-to-mark");
                var idsText =  $idsToMark.val().trim();
                core.ui.modules.elementMarkerLogic.markElementsByNodeIds(idsText);
            },

            markElementsByRemoveSelectorsOnClick: function () {
                var $removeSelectorsToMark = $("#remove-selectors-to-mark");
                var removeSelectorsText =  $removeSelectorsToMark.val().trim();
                core.ui.modules.elementMarkerLogic.markElementsByRemoveSelectors(removeSelectorsText);
            },
            
            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(core.ui.modules.elementMarkerController.initUI);




})();





