(function() {
    "use strict";

    //TOOD NOW: a messages-eket rendberakni, kontorlonként szétszedni
    app.ui.modules.spoilerCategoriesController = app.ui.modules.spoilerCategoriesController  || (function() {
        return {

            //#region properties and consts

            isCategoryEditing: false,

            newCategoryName: "",

            $categoryId : null,
            $categoryName : null,
            $categorySpoilerText : null,
            $selectCategoryLanguage : null,
            $selectCategoryType : null,
            $categoryList : null,            

            //#endregion

            //#region init

            initUI: function () {
                var $container = $("#spoiler-category-list-control-container");
                //!!!!!in the selects, the space is important in the value!!!!!
                $container.html("" +
                "<div class='text-align-center'>" +
                "   <span class='font-weight-bold' i18n='categories'></span>" + 
                "</div>" +
                "<table id='spoiler-category-edit-table' class='td-vertical-center-content-table td-padding-4px-table'>" +
                "    <tbody>" +             
                "        <tr>" +
                "            <td colspan='3'>" +
                "               <input type='text' id='category-selector' class='form-control' i18n-placeholder='import_category'/>" + 
                "            </td>" +                
                "        </tr>" +
                "        <tr>" +
                "            <td colspan='3'>" +
                "                <textarea id='category-spoiler-text' class='form-control textarea-resize-none textarea-3row-height full-input-width' i18n-placeholder='enter_spoilers'  ></textarea>" +
                "            </td>" +
                "            <td>" +
                "                <div id='add-category' class='button button-add' i18n-title='save_category'></div>" +
                "            </td>" +
                "        </tr>" +
                "        <tr>" +
                "            <td>" +
                "                <input type='text' id='category-name' class='form-control' i18n-placeholder='new_category'/>" +
                "                <input type='hidden' id='category-id' />" +
                "            </td>" +
                "            <td>" +
                "                <select id='select-category-language'>" +
                "                    <option value=' ' i18n='select'></option>" +
                "                </select>" +
                "            </td>" +
                "            <td>" +
                "                <select id='select-category-type'>" +
                "                    <option value=' ' i18n='select'></option>" +
                "                    <option value='tv_show' i18n='tv_show'></option>" +
                "                    <option value='movie' i18n='movie'></option>" +
                "                    <option value='game' i18n='game'></option>" +
                "                    <option value='sport' i18n='sport'></option>" +
                "                    <option value='politics' i18n='politics'></option>" +
                "                    <option value='other' i18n='other'></option>" +
                "                </select>" +
                "            </td>" +
                "        </tr>" +
                "    </tbody>" +
                "</table>" +
                "<div class='category-list-container'>" +
                "    <table><tbody id='category-list'></tbody></table>" +
                "</div>" +
                "");


                app.ui.modules.spoilerCategoriesController.$categoryId = $("#category-id");
                app.ui.modules.spoilerCategoriesController.$categoryName = $("#category-name");
                app.ui.modules.spoilerCategoriesController.$categorySpoilerText = $("#category-spoiler-text");
                app.ui.modules.spoilerCategoriesController.$selectCategoryLanguage = $("#select-category-language");
                app.ui.modules.spoilerCategoriesController.$selectCategoryType = $("#select-category-type");

                app.ui.modules.spoilerCategoriesController.$categoryList = $("#category-list");

                core.ui.controls.selectize.init(app.ui.modules.spoilerCategoriesController.$selectCategoryLanguage, "language", app.ui.modules.spoilerCategoriesLogic.getLanguageList());                
                core.ui.controls.selectize.init(app.ui.modules.spoilerCategoriesController.$selectCategoryType, "type");


                var keypressFunction = function (e) {
                    if (e.which === 13) {
                        app.ui.modules.spoilerCategoriesController.addCategoryOnClick();
                    }
                };
                app.ui.modules.spoilerCategoriesController.$categoryName.keypress(keypressFunction);
                app.ui.modules.spoilerCategoriesController.$categorySpoilerText.keypress(keypressFunction);

                $("#add-category").click(app.ui.modules.spoilerCategoriesController.addCategoryOnClick);

                app.ui.modules.spoilerCategoriesController.renderSpoilerCategoryList();
                

                browser.i18n.setAllI18nStrings($container);

                app.ui.modules.spoilerCategoriesController.initCategoryAutoComplete("#category-selector");

            },
            
            initCategoryAutoComplete(categorySelector) {                                                                                                                                                                                                                 
                    $(categorySelector).autocomplete({
                        minLength: 2,                        
                        delay: 500,
                        source: function (request, response) {
                            var type = app.ui.modules.spoilerCategoriesController.$selectCategoryType.val();
                            var language = app.ui.modules.spoilerCategoriesController.$selectCategoryLanguage.val();
                            jQuery.get("https://spoilerprotection.wecdev.com/api/Category/GetFilteredCategories?categoryId=&name=" + request.term + "&type=" + type + "&language=" + language + "&showExpired=false&showOnlyApproved=true", function (data) {
                                response(data);
                            });
                        },
                        focus: function (event, ui) {
                            var category = ui.item;                      
                            $(categorySelector).val(category.Name);
                            return false;
                        },
                        select: function (event, ui) {                                  
                            var category = ui.item;                                                 
                            if (app.ui.modules.spoilerCategoriesController.checkCategoryExists(category.Name)) {
                                return false;
                            }
                            app.ui.modules.spoilerCategoriesLogic.addOrUpdateCategory(false, category.Id, category.Name, category.SpoilerList.split(","), category.Language, category.Type, app.ui.modules.spoilerCategoriesController.spoilerCategoryOnChangedInSetting);

                            var userNameString = app.ui.modules.spoilerCategoriesController.getUploderUserName(category);                        
                            if (userNameString) {
                                $.confirm({
                                    type: 'blue',
                                    useBootstrap:false,
                                    boxWidth:'75%',
                                    backgroundDismiss: true,
                                    title:  browser.i18n.getMessage("import"),
                                    content: browser.i18n.getMessage("category_imported") + " <b class='color-red'>" + category.Name + "</b><br>" +
                                    browser.i18n.getMessage("support_the_uploader") + " <b class='color-red'>" + userNameString + "</b><br><br>"+ 
                                    "<table class='td-vertical-center-content-table'>"+ 
                                    "    <tbody>"+ 
                                    "    <tr>"+ 
                                    "        <td>"+ 
                                    "            <a id='open-patreon-url-button-for-uploader' class='btn btn-social btn-warning'>"+ 
                                    "                <i class='background-patreon'></i>&nbsp;<span i18n='support_patreon_uploder'>Donate via Patreon</span>"+ 
                                    "            </a>&nbsp;"+ 
                                    "            <a id='open-kofi-url-button-for-uploader' class='btn btn-social btn-info'>"+ 
                                    "                <i class='background-kofi'></i>&nbsp;<span i18n='support_kofi_uploder'>Donate via Ko-fi</span>"+ 
                                    "            </a>"+ 
                                    "        </td>"+ 
                                    "    </tr>"+ 
                                    "    </tbody>"+ 
                                    "</table>"                                
                                    ,
                                    onContentReady: function () {                                    
                                        browser.i18n.setAllI18nStrings(this.$content);                
                                        if (category.UploaderPatreonUrl) {
                                            $('#open-patreon-url-button-for-uploader').click(function() {
                                                browser.tabs.openUrl(category.UploaderPatreonUrl);
                                            });
                                        } else {
                                            $('#open-patreon-url-button-for-uploader').hide();
                                        }
                                        if (category.UploaderKofiUrl) {
                                            $('#open-kofi-url-button-for-uploader').click(function() {                                            
                                                browser.tabs.openUrl(category.UploaderKofiUrl);
                                            });
                                        } else {
                                            $('#open-kofi-url-button-for-uploader').hide();
                                        }
                                    },
                                    buttons: {                                    
                                        cancel: {
                                            text: browser.i18n.getMessage("close"),
                                            btnClass: 'btn-default'
                                        }
                                    }
                                });
                            }

                            return false;
                        }
                    }).data("autocomplete")._renderItem = function (ul, item) {
                        var formatedUserNameString = app.ui.modules.spoilerCategoriesController.getUploderUserName(item);                        
                        if (formatedUserNameString) {
                            formatedUserNameString = "<br>" + browser.i18n.getMessage("uploader") + ":  <b class='color-red'><i> " + formatedUserNameString +"</i></b>";
                        }
                        var spoilerCount = item.SpoilerList.split(",");

                        var typeString =  browser.i18n.getMessage("type") + ": <b>" + (item.Type ? browser.i18n.getMessage(item.Type) : " - ") + "</b>";                        
                        var languageString = browser.i18n.getMessage("language") + ": <b>" + (item.Language ? item.Language : " - ") + "</b>";                        
                        var lastRow = typeString + " | " + languageString;
                        
                        return $("<li>")
                            .data("item.autocomplete", item)
                            .append("<a><b class='color-red'>" + item.Name + "</b>" + "<br>" + browser.i18n.getMessage("spoiler_count") + ": <b>" + spoilerCount.length + "</b>" + formatedUserNameString + "<br>" + lastRow + "</a>")
                            .appendTo(ul);
                    };
                
            },
            
            getUploderUserName:function (item) {
                var userNameString = "";
                if (item.UploaderKofiUrl) {
                    userNameString = item.UploaderKofiUrl.getLastPart("/");
                } else  if (item.UploaderPatreonUrl) {
                    userNameString = item.UploaderPatreonUrl.getLastPart("/");
                }

                return userNameString;
            },
       
            //#endregion

            //#region public functions

            //#endregion

            //#region private functions

            //#region SpoilerCategory
            
            renderSpoilerCategoryList: function () {
                var $container = $("#category-list");
                $container.empty();


                var categoryList = app.ui.modules.spoilerCategoriesLogic.getSpoilerCategoryList();
                if (app.ui.modules.spoilerCategoriesController.newCategoryName !== "") {
                    var newCategory = categoryList.removeObjectByName(app.ui.modules.spoilerCategoriesController.newCategoryName);
                    categoryList.insert(0, newCategory);
                    app.ui.modules.spoilerCategoriesController.newCategoryName = "";
                }

                $.each(categoryList, function (key, value) {
                    var $categoryTr = $("<tr />")
                        .appendTo($container);

                    core.ui.controls.button.addButtonToTr($categoryTr,
                        value.name,
                        app.ui.modules.spoilerCategoriesController.removeCategoryOnClick,
                        "remove_category",
                        "button-delete");

                    var $toggleCategoryOnButton = core.ui.controls.button.addButtonToTr($categoryTr,
                        value.name,
                        app.ui.modules.spoilerCategoriesController.toggleCategoryOnOffOnClick,
                        "enable_disable");
                    $toggleCategoryOnButton.attr("data-toggle-on-off-marker", value.name.normalizeString());

                    core.ui.controls.button.addButtonToTr($categoryTr,
                        value.name,
                        app.ui.modules.spoilerCategoriesController.editCategoryOnClick,
                        "edit_category",
                        "button-edit");

                    var $categoryTextTd = $("<td />")
                        .appendTo($categoryTr);
                    
                    var languageText = !core.utilities.utils.isNullOrEmpty(value.language) ? " - " + value.language : "";
                    var typeText = !core.utilities.utils.isNullOrEmpty(value.type) ? " - " + browser.i18n.getMessage(value.type) : "";

                    $("<span />")
                        .html(" - <b>" + value.name + "</b>" + languageText + typeText)
                        .appendTo($categoryTextTd);
                });

                $.each(app.ui.modules.spoilerCategoriesLogic.getSpoilerCategoryList(), function (key, value) {
                    core.ui.controls.button.toggleOnOffButton("[data-toggle-on-off-marker='" + value.name.normalizeString() + "']", value.isActive);
                });

                browser.i18n.setAllI18nStrings($container);
            },


            addCategoryOnClick: function () {
                var $categoryId = app.ui.modules.spoilerCategoriesController.$categoryId;
                var $categoryName = app.ui.modules.spoilerCategoriesController.$categoryName;
                var $categorySpoilerText = app.ui.modules.spoilerCategoriesController.$categorySpoilerText;
                var $selectCategoryLanguage = app.ui.modules.spoilerCategoriesController.$selectCategoryLanguage;
                var $selectCategoryType =  app.ui.modules.spoilerCategoriesController.$selectCategoryType;
                var $categoryList = app.ui.modules.spoilerCategoriesController.$categoryList;


                var categorySpoilerText = $categorySpoilerText.val().trimString();
                var categorySpoilerList = categorySpoilerText.split(",").removeEmptyOrWhiteSpaceStringsFromArray();
                if (core.utilities.utils.isNullOrEmpty(categorySpoilerText) || core.utilities.utils.isNullOrEmpty(categorySpoilerList)) {
                    $.alert({
                        type: 'red',
                        title: browser.i18n.getMessage("error"),
                        content: browser.i18n.getMessage("category_spoiler_text_required")
                    });
                    return;
                }

                // '/' cause javascript error
                var categoryName = $categoryName.val().trimString().replaceAll("/", "-");
                var originalCategoryName = $categoryName.attr("data-original-name");
                if (categoryName.isNullOrWhiteSpace()) {
                    $.alert({
                        type: 'red',
                        title: browser.i18n.getMessage("error"),
                        content: browser.i18n.getMessage("category_name_required")
                    });
                    return;
                }

                if (categoryName != originalCategoryName) {
                    if (app.ui.modules.spoilerCategoriesController.checkCategoryExists(categoryName)) {
                        return;
                    }
                }

                var categoryLanguage = $selectCategoryLanguage.val().trim();
                var categoryType = $selectCategoryType.val().trim();
                var categoryId = $categoryId.val().trim();

                //export only new categories
                if (!app.ui.modules.spoilerCategoriesController.isCategoryEditing) {
                    categoryId = core.utilities.utils.newGuid();
                    //just show the confirm dialog everything else will run after this anyway
                    app.ui.modules.spoilerCategoriesController.showShareConfirm(categoryId, categoryName, categoryLanguage, categoryType, categorySpoilerText);
                }

                $categorySpoilerText.val("");
                $categorySpoilerText.removeClass("edit-category-spoiler");
                $categoryList.show();
                $categoryName.val("");
                $categoryName.removeAttr("data-original-name");
                $categoryId.val("");

                app.ui.modules.spoilerCategoriesController.newCategoryName = categoryName;
                app.ui.modules.spoilerCategoriesLogic.addOrUpdateCategory(app.ui.modules.spoilerCategoriesController.isCategoryEditing, categoryId, categoryName, categorySpoilerList, categoryLanguage, categoryType, app.ui.modules.spoilerCategoriesController.spoilerCategoryOnChangedInSetting);

                app.ui.modules.spoilerCategoriesController.isCategoryEditing = false;
            },

            showShareConfirm: function (categoryId, categoryName, categoryLanguage, categoryType, categorySpoilerText) {
                $.confirm({
                    type: 'blue',
                    draggable: false,
                    useBootstrap:false,
                    boxWidth:'75%',
                    title: browser.i18n.getMessage('share_your_category_with_other_people'),
                    onContentReady: function () {                     
                        browser.i18n.setAllI18nStrings(this.$content);
                        $("#just_for_myself_button").click(function() {
                            this.close();
                        });   
                        
                        $("#share_button").click(function() {
                            app.ui.modules.spoilerCategoriesController.shareCategory(categoryId, categoryName, categoryLanguage, categoryType, categorySpoilerText, false);
                            this.close();
                        }); 

                        $("#share_earn_money_button").click(function() {
                            app.ui.modules.spoilerCategoriesController.shareCategory(categoryId, categoryName, categoryLanguage, categoryType, categorySpoilerText, true);
                            this.close();
                        }); 
                    },
                    content:
                    '<form action="" class="formName" style="text-align: justify;">' +
                        '<div class="form-group">' +                                                        
                            '<label i18n="share_your_category_with_other_people"></label>' + 
                            '<div class="jconfirm-buttons" style="float: none">' +                            
                                '<button id="share_button" type="button" class="btn btn-blue" i18n="share" ></button>' +                            
                                '<button id="share_earn_money_button" type="button" class="btn btn-blue" i18n="share_earn_money" ></button>' +  
                            '</div>' + 
                            '<hr style="margin-top: 10px !important; margin-bottom: 10px !important;"/>' +
                        '</div>' +
                    '</form>',
                    buttons: {
                        cancel:  {
                            btnClass: 'btn-default',
                            text: browser.i18n.getMessage("just_for_myself")
                        }
                    }
                });               
            },

            shareCategory: function(categoryId, categoryName, categoryLanguage, categoryType, categorySpoilerText, withEarnMoney) {
                $.confirm({
                    type: 'blue',
                    draggable: false,
                    useBootstrap:false,
                    boxWidth:'75%',
                    title: browser.i18n.getMessage('share_your_category_with_other_people'),
                    onContentReady: function () {
                        var date = new Date();
                        date.setFullYear(date.getFullYear() + 1);
                        var dateString = date.getDate() + "/"  + (date.getMonth() + 1)  + "/" + date.getFullYear();
                        var datePicker = $('[data-toggle="datepicker"]').datepicker({
                            zIndex: 100000000,
                            format: 'dd/mm/yyyy',
                            weekStart: 1,
                            autoHide: true,
                            date:  date
                        });
                        datePicker.val(dateString);
                        browser.i18n.setAllI18nStrings(this.$content);

                        if (withEarnMoney) {
                            $('#kofi-user-name').val(core.ui.modules.supportUploaderLogic.getKofiUserName());
                            $('#patreon-user-name').val(core.ui.modules.supportUploaderLogic.getPatreonUserName());
                        } else {
                            $('#with-earn-money-container').hide();
                        }
                    },
                    content:
                    '<form action="" class="formName" style="text-align: justify;">' +
                        '<div class="form-group">' +
                            '<label i18n="share_warning"></label>' +
                            '<hr style="margin-top: 10px !important; margin-bottom: 10px !important;"/>' +
                            '<label style="margin-top: 7px;float:left;margin-right: 10px;" i18n="expiration_date"></label>' +
                            '<input type="text" id="expirationDate" placeholder="dd/mm/yyyy" class="name form-control" style="width:180px;"  required data-toggle="datepicker">' +
                            '<label style="font-weight: inherit" i18n="expiration_date_explanation"></label>' +
                            '<div id="with-earn-money-container">' + 
                                '<hr style="margin-top: 10px !important; margin-bottom: 10px !important;"/>' +
                                '<label style="font-weight: inherit" i18n="earn_money"></label>' +
                                '<label style="margin-top: 9px;margin-left: 21px;float:left">https://ko-fi.com/</label>' +
                                '<input i18n-placeholder="your_kofi_username" type="text" id="kofi-user-name" placeholder="" class="name form-control" style="width:180px;margin-bottom: 5px;" >' +
                                '<label style="margin-top: 9px;float:left">https://patreon.com/</label>' +
                                '<input i18n-placeholder="your_patreon_username" type="text" id="patreon-user-name" placeholder="" class="name form-control" style="width:180px;" >' +
                            '</div>' +
                        '</div>' +
                    '</form>',
                    buttons: {                        
                        cancel:  {
                            btnClass: 'btn-default',
                            text: browser.i18n.getMessage("close")
                        },
                        confirm: {
                            btnClass: 'btn-blue',
                            text: browser.i18n.getMessage("share"),
                            action:  function () {
                                var expirationDate = $('[data-toggle="datepicker"]').datepicker('getDate');
                                var kofiUserName = $('#kofi-user-name').val().trim();
                                core.ui.modules.supportUploaderLogic.setKofiUserName(kofiUserName);
                                var patreonUserName = $('#patreon-user-name').val().trim();
                                core.ui.modules.supportUploaderLogic.setPatreonUserName(patreonUserName);
                                app.ui.modules.spoilerCategoriesLogic.exportCategory(kofiUserName, patreonUserName, categoryId, categoryName,  categoryLanguage, categoryType, expirationDate.getTicks(), categorySpoilerText, function () {                                    
                                    $.confirm({
                                        type: 'green',
                                        useBootstrap:false,
                                        boxWidth:'75%',
                                        title:  browser.i18n.getMessage("success"),
                                        content: browser.i18n.getMessage("export_success_text"),
                                        buttons: {
                                            confirm: {
                                                btnClass: 'btn-blue',
                                                text: browser.i18n.getMessage("visit_page_and_share"),
                                                action: function () {
                                                    browser.tabs.openCategoryListWithCategory(categoryId);
                                                }
                                            },
                                            cancel: {
                                                text: browser.i18n.getMessage("close"),
                                                btnClass: 'btn-default'
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    }
                });
            },

            checkCategoryExists(categoryName) {
                var itemAlreadyExistsWithNewName = app.ui.modules.spoilerCategoriesLogic.getSpoilerCategorByName(categoryName) != null;
                if (itemAlreadyExistsWithNewName) {
                    $.alert({
                        type: 'red',
                        title: browser.i18n.getMessage("error"),
                        content: browser.i18n.getMessage("item_already_exists_with_name")
                    });
                    return true;
                }
                return false
            },

            toggleCategoryOnOffOnClick: function (event) {
                var categoryName = $(this).attr("data");
                app.ui.modules.spoilerCategoriesLogic.toggleCategoryOnOff(categoryName, app.ui.modules.spoilerCategoriesController.spoilerCategoryOnChangedInSetting);
            },

            editCategoryOnClick: function () {
                var $categoryId = app.ui.modules.spoilerCategoriesController.$categoryId;
                var $categoryName = app.ui.modules.spoilerCategoriesController.$categoryName;
                var $categorySpoilerText = app.ui.modules.spoilerCategoriesController.$categorySpoilerText;
                var $selectCategoryLanguage = app.ui.modules.spoilerCategoriesController.$selectCategoryLanguage;
                var $selectCategoryType =  app.ui.modules.spoilerCategoriesController.$selectCategoryType;
                var $categoryList = app.ui.modules.spoilerCategoriesController.$categoryList;

                var categoryName = $(this).attr("data");
                var category = app.ui.modules.spoilerCategoriesLogic.getSpoilerCategorByName(categoryName);

                $categorySpoilerText.addClass("edit-category-spoiler");
                $categoryList.hide();

                $categorySpoilerText.val(category.spoilerList.join(","));

                //we add id to old categories which doesn't has one
                if (!category.id) {
                    category.id = core.utilities.utils.newGuid();
                }

                $categoryId.val(category.id);
                $categoryName.val(category.name);
                $categoryName.attr("data-original-name", categoryName);
                core.ui.controls.selectize.setValue($selectCategoryLanguage, category.language);
                core.ui.controls.selectize.setValue($selectCategoryType, category.type);

                app.ui.modules.spoilerCategoriesController.isCategoryEditing = true;
            },

            removeCategoryOnClick: function () {
                var categoryName = $(this).attr("data");
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

                                app.ui.modules.spoilerCategoriesLogic.removeCategory(categoryName, app.ui.modules.spoilerCategoriesController.spoilerCategoryOnChangedInSetting);
                            }
                        },
                        cancel: {
                            text: browser.i18n.getMessage("cancel"),
                            btnClass: 'btn-default'
                        }
                    }
                });
            },

            spoilerCategoryOnChangedInSetting: function () {
                app.ui.modules.spoilerCategoriesController.renderSpoilerCategoryList();
                app.ui.modules.spoilersController.renderSpoilerStringList();
                app.ui.modules.spoilersLogic.reloadTabsWithNewSpoilerList();
            }

            //#endregion
        }
    })();

    core.ui.utilities.ui.addOnInitUIEvent(app.ui.modules.spoilerCategoriesController.initUI);

})();





