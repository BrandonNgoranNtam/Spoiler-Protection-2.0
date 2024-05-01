(function() {
    "use strict";

    app.ui.modules.spoilerContextsController = app.ui.modules.spoilerContextsController  || (function() {
        return {

            //#region properties and consts

            isSpoilerContextEditing: false,
            $spoilerContextName: null,
            $spoilerContextSite: null,

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#spoiler-context-control-container");

                $container.html("" +
                    "<div class='half-panel content-panel rbl-border float-left'>" +
                    "    <div class='text-align-center'>" +
                    "       <span class='font-weight-bold' i18n='description'></span>" +
                    "    </div>" +
                    "    <div class='description-text'>" +
                    "        <span i18n='spoiler_context_description'></span>" +
                    "    </div>" +
                    "    <hr/>" +
                    "    <div class='text-align-center'>" +
                    "        <span class='font-weight-bold' i18n='list'></span>" +
                    "    </div>" +
                    "    <div class='spoiler-context-list-container'>" +
                    "        <table><tbody id='spoiler-context-list'></tbody></table>" +
                    "    </div>" +
                    "</div>" +
                    "<div class='half-panel content-panel rb-border float-left'>" +
                    "    <table class='td-vertical-center-content-table td-padding-4px-table'>" +
                    "        <tbody>" +
                    "            <tr>" +
                    "                <td>" +
                    "                    <input type='text' id='spoiler-context-name' class='form-control full-input-width' i18n-placeholder='name'/>" +
                    "                </td>" +
                    "                <td>" +
                    "                    <div id='add-spoiler-context' class='button button-add' i18n-title='save'></div>" +
                    "                </td>" +
                    "            </tr>" +
                    "            <tr>" +
                    "                <td colspan='2'>" +
                    "                    <input type='text' id='spoiler-context-site' class='form-control full-input-width' i18n-placeholder='site'/>" +
                    "                </td>" +
                    "            </tr>" +
                    "        </tbody>" +
                    "    </table> " +
                    "    <div id='element-marker-control-container'>" +
                    "    </div>" +
                    "</div>" +
                    "");

                app.ui.modules.spoilerContextsController.$spoilerContextName = $("#spoiler-context-name");
                app.ui.modules.spoilerContextsController.$spoilerContextSite = $("#spoiler-context-site");


                $("#add-spoiler-context").click(app.ui.modules.spoilerContextsController.addSpoilerContextOnClick);

                app.ui.modules.spoilerContextsController.renderSpoilerContextList();

                core.ui.modules.elementMarkerController.initUI();

                browser.i18n.setAllI18nStrings($container);
            },

            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            renderSpoilerContextList: function () {
                var $container = $("#spoiler-context-list");
                $container.empty();
                $.each(app.ui.modules.spoilerContextsLogic.getSpoilerContextList(), function (key, value) {
                    var $categoryTr = $("<tr />")
                        .appendTo($container);

                    core.ui.controls.button.addButtonToTr($categoryTr,
                        value.name,
                        app.ui.modules.spoilerContextsController.removeSpoilerContextListOnClick,
                        "remove",
                        "button-delete");

                    core.ui.controls.button.addButtonToTr($categoryTr,
                        value.name,
                        app.ui.modules.spoilerContextsController.editSpoilerContextOnClick,
                        "edit",
                        "button-edit");

                    var $categoryTextTd = $("<td />")
                        .appendTo($categoryTr);

                    $("<span />")
                        .html(" - <b>" + value.name + "</b>")
                        .appendTo($categoryTextTd);
                });

                browser.i18n.setAllI18nStrings($container);
            },

            removeSpoilerContextListOnClick: function () {
                var removedName = $(this).attr("data");
                $.confirm({
                    type: 'orange',
                    useBootstrap:false,
                    boxWidth:'50%',
                    title:  browser.i18n.getMessage("warning"),
                    content: browser.i18n.getMessage("delete_question"),
                    buttons: {
                        confirm: {
                            btnClass: 'btn-orange',
                            text: browser.i18n.getMessage("delete"),
                            action: function () {

                                app.ui.modules.spoilerContextsLogic.removeSpoilerContextList(removedName);
                                app.ui.modules.spoilerContextsController.renderSpoilerContextList();
                            }
                        },
                        cancel: {
                            text: browser.i18n.getMessage("cancel"),
                            btnClass: 'btn-default'
                        }
                    }
                });
            },

            editSpoilerContextOnClick: function () {
                var $spoilerContextName = app.ui.modules.spoilerContextsController.$spoilerContextName;
                var $spoilerContextSite = app.ui.modules.spoilerContextsController.$spoilerContextSite;

                var editName = $(this).attr("data");
                var spoilerContextItem = app.ui.modules.spoilerContextsLogic.getSpoilerContextByName(editName);

                $spoilerContextName.val(spoilerContextItem.name);
                $spoilerContextName.attr("data-original-name", spoilerContextItem.name);

                $spoilerContextSite.val(spoilerContextItem.siteUrlPart);

                core.ui.modules.elementMarkerController.setElementMarker(spoilerContextItem.elementMarker);

                app.ui.modules.spoilerContextsController.isSpoilerContextEditing = true;
            },

            addSpoilerContextOnClick: function () {
                var $spoilerContextName = app.ui.modules.spoilerContextsController.$spoilerContextName;
                var $spoilerContextSite = app.ui.modules.spoilerContextsController.$spoilerContextSite;

                // '/' cause javascript error
                var name = $spoilerContextName.val().trimString().replaceAll("/", "-");
                var originalName = $spoilerContextName.attr("data-original-name");

                if (name.isNullOrWhiteSpace()) {
                    $.alert({
                        type: 'red',
                        title: browser.i18n.getMessage("error"),
                        content: browser.i18n.getMessage("name_required")
                    });
                    return;
                }

                if (name != originalName) {
                    var itemAlreadyExistsWithNewName = app.ui.modules.spoilerContextsLogic.getSpoilerContextByName(name) != null;
                    if (itemAlreadyExistsWithNewName) {
                        $.alert({
                            type: 'red',
                            title: browser.i18n.getMessage("error"),
                            content: browser.i18n.getMessage("item_already_exists_with_name")
                        });
                        return;
                    }
                }

                var sitePartUrl = $spoilerContextSite.val().trimString();
                if (sitePartUrl.isNullOrWhiteSpace()) {
                    $.alert({
                        type: 'red',
                        title: browser.i18n.getMessage("error"),
                        content: browser.i18n.getMessage("site_url_part_required")
                    });
                    return;
                }

                $spoilerContextName.val("");
                $spoilerContextName.removeAttr("data-original-name");
                $spoilerContextSite.val("");


                var elementMarker = core.ui.modules.elementMarkerController.getElementMarkerAndClear();

                app.ui.modules.spoilerContextsLogic.addOrUpdateSpoilerContex(app.ui.modules.spoilerContextsController.isSpoilerContextEditing, name, sitePartUrl, elementMarker);


                app.ui.modules.spoilerContextsController.renderSpoilerContextList();
                app.ui.modules.spoilerContextsController.isSpoilerContextEditing = false;

            }

            //#endregion
        }
    })();


    core.ui.utilities.ui.addOnInitUIEvent(app.ui.modules.spoilerContextsController.initUI);


})();





