(function() {
    "use strict";

    function spoilerCategoriesLogicConfig() {
        this.sendGoogleTrackEvent = false;
    };

    //NOTE: this class can't contains functions because storage serialization corrupts it
    function spoilerCategory() {
        this.id = "";
        this.name = "";
        this.language = "";
        this.type = "";
        this.isActive = true;
        this.spoilerList = new Array();
    };

    app.ui.modules.spoilerCategoriesLogic = app.ui.modules.spoilerCategoriesLogic  || (function() {
        return {

            //#region properties and consts

            moduleName: "spoilerCategories",
            config: null,

            //#endregion

            //#region init

            getSpoilerCategoryList: function() {
                return core.utilities.settings.spoilerCategories.spoilerCategoryList;
            },

            getSpoilerCategorByName: function(name) {
                return app.ui.modules.spoilerCategoriesLogic.getSpoilerCategoryList().getObjectByName(name);
            },

            getCategoryToSpoilerText: function (spoilerText) {
                var categoryName = "";
                $.each(core.utilities.settings.spoilerCategories.spoilerCategoryList, function(key, value) {
                    if (value.spoilerList.contains(spoilerText)) {
                        categoryName = value.name;
                        return;
                    }
                });
                return categoryName;
            },

            initSettingsDefaultValues: function() {
                core.utilities.settings.spoilerCategories = {};
                core.utilities.settings.spoilerCategories.spoilerCategoryList = [];
                core.utilities.settings.spoilerCategories.categoryNameToExportFacebook = null;
            },

            extendSetting: function() {
                //spoilerCategoryList
                core.utilities.settings.addOrUpdateCategoryInSettings = function(isEditing, categoryId, categoryName, categorySpoilerList, categoryLanguage, categoryType, successCallback) {
                    var category;
                    if (isEditing) {
                        category = core.utilities.settings.spoilerCategories.spoilerCategoryList.getObjectByName(categoryName);
                        core.utilities.settings.removeSpoilersFromSettings(category.spoilerList);
                    } else {
                        category = new spoilerCategory();
                        category.id = core.utilities.utils.newGuid();
                        core.utilities.settings.spoilerCategories.spoilerCategoryList.push(category);
                    }

                    var spoilerList = [];
                    $.each(categorySpoilerList, function(key, value) {
                        var spoilerText = value.trimString();
                        if (!spoilerText.isNullOrWhiteSpace()) {
                            if (spoilerList.indexOf(spoilerText) === -1) {
                                spoilerList.push(spoilerText);
                            }
                        }
                    });

                    category.id = categoryId;
                    category.name = categoryName;
                    category.language = categoryLanguage;
                    category.type = categoryType;
                    category.isActive = true;
                    category.spoilerList = spoilerList;

                    //NOTE: core.utilities.settings.updateSettingsInStorage is called in core.utilities.settings.addSpoilersToSpoilerSettingsn
                    //NOTE: So we don't call it here
                    core.utilities.settings.addSpoilersToSpoilerSettings(category.spoilerList, successCallback);
                };

                core.utilities.settings.removeCategoryFromSettings =  function(categoryName, successCallback) {
                    var removedCategory = core.utilities.settings.spoilerCategories.spoilerCategoryList.removeObjectByName(categoryName);
                    //NOTE: core.utilities.settings.updateSettingsInStorage is called in core.utilities.settings.removeSpoilersFromSettings
                    //NOTE: So we don't call it here
                    core.utilities.settings.removeSpoilersFromSettings(removedCategory.spoilerList, successCallback);
                };

                core.utilities.settings.toggleCategoryIsActive = function(categoryName, successCallback) {
                    var category = core.utilities.settings.spoilerCategories.spoilerCategoryList.getObjectByName(categoryName);
                    var newCategoryIsActiveValue = !category.isActive;
                    category.isActive = newCategoryIsActiveValue;

                    //NOTE: core.utilities.settings.updateSettingsInStorage is called in core.utilities.settings.addSpoilersToSpoilerSettingsn or core.utilities.settings.removeSpoilersFromSettings
                    //NOTE: So we don't call it here
                    if (newCategoryIsActiveValue) {
                        core.utilities.settings.addSpoilersToSpoilerSettings(category.spoilerList, successCallback);
                    } else {
                        core.utilities.settings.removeSpoilersFromSettings(category.spoilerList, successCallback);
                    }
                };

            },

            //#endregion

            //#region public functions         

            exportCategory: function(kofiUserName, patreonUserName, categoryId, categoryName,  categoryLanguage, categoryType,expirationDateTicks, categorySpoilerText, runAfterExportFunction) {
                var kofiUrl = kofiUserName ? core.utilities.settings.supportUploader.kofiSiteUrl + "/" + kofiUserName : "";
                var patreonUrl = patreonUserName ? core.utilities.settings.supportUploader.patreonSiteUrl + "/" + patreonUserName : "";

                $.post(
                    'https://spoilerprotection.wecdev.com/api/Category/ExportCategory',
                    {
                        uploaderKofiUrl: kofiUrl,
                        uploaderPatreonUrl: patreonUrl,
                        id: categoryId,
                        name: categoryName,
                        language: categoryLanguage,
                        type: categoryType,
                        expirationDateTicks: expirationDateTicks,
                        spoilerList: categorySpoilerText
                    },
                    function() {
                        runAfterExportFunction();
                    }).fail(function(xhr, status, error) {
                        $.alert({
                            type: 'red',
                            boxWidth:'50%',
                            content: error + " " + JSON.stringify(xhr)
                        });
                    });

            },

            addOrUpdateCategory: function (isCategoryEditing, id, name, categorySpoilerList, categoryLanguage, categoryType, settingChangedCallback) {                               
                core.utilities.settings.addOrUpdateCategoryInSettings(isCategoryEditing, id, name, categorySpoilerList, categoryLanguage, categoryType, settingChangedCallback);
            },

            toggleCategoryOnOff: function (categoryName, settingChangedCallback) {
                core.utilities.settings.toggleCategoryIsActive(categoryName, settingChangedCallback);
            },
            
            removeCategory: function (categoryName, settingChangedCallback) {
                core.utilities.settings.removeCategoryFromSettings(categoryName, settingChangedCallback);
            },

            getLanguageList: function() {
                var res = new Array();
                for (var key in core.data.languages.simpleMapping) {
                    var language = core.data.languages.simpleMapping[key].nativeName;
                    res.push({text: language, value: language});
                }

                //NOTE: most used languages to the top of the list
                var preferredLanguages = new Array();
                preferredLanguages.push("Nederlands");
                preferredLanguages.push("Português");
                preferredLanguages.push("Italiano");
                preferredLanguages.push("Français");
                preferredLanguages.push("Español");
                preferredLanguages.push("Magyar");
                preferredLanguages.push("Deutsch");
                preferredLanguages.push("English");                

                for(var i = 0; i < preferredLanguages.length; i++) {
                    var removedItem = res.removeObjectByProperty("text", preferredLanguages[i]);
                    res.insert(0, removedItem);
                }

                return res;
            }

            //#endregion

            //#region private functions

            //#endregion

        }
    })();

    app.ui.modules.spoilerCategoriesLogic.config = new spoilerCategoriesLogicConfig();

    core.utilities.settings.addSettingModifierModule(app.ui.modules.spoilerCategoriesLogic);
    core.utilities.settings.addOnExtendSettingsEvent(app.ui.modules.spoilerCategoriesLogic.extendSetting);




})();





