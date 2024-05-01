(function() {
    "use strict";

    //NOTE: this class can't contains functions because storage serialization corrupts it
    function spoilerContext() {
        this.name = "";
        this.url = "";
        this.elementMarker = null;
    };


    function spoilerContextsLogicConfig () {
        this.sendGoogleTrackEvent = false;
    };


    app.ui.modules.spoilerContextsLogic = app.ui.modules.spoilerContextsLogic  || (function() {
        return {

            //#region properties and consts

            moduleName: "spoilerContexts",
            config: null,

            //#endregion

            //#region init

            getEmptySpoilerContext: function() {
                return new spoilerContext();
            },

            getSpoilerContextList: function() {
                return core.utilities.settings.spoilerContexts.spoilerContextList;
            },

            getSpoilerContextByName: function(name) {
                return app.ui.modules.spoilerContextsLogic.getSpoilerContextList().getObjectByName(name);
            },

            initSettingsDefaultValues: function() {
                core.utilities.settings.spoilerContexts = {};
                core.utilities.settings.spoilerContexts.spoilerContextList = [];

                var spoilerContextList = core.utilities.settings.spoilerContexts.spoilerContextList;

                var commonArticleContext = new spoilerContext();
                commonArticleContext.name = "Article everywhere";
                commonArticleContext.siteUrlPart = "*";
                commonArticleContext.elementMarker = core.ui.modules.elementMarkerLogic.getElementMarker("article", "", "");
                spoilerContextList.push(commonArticleContext);

                /* todo now: a facebookon elromlik emiatt, vagy prioritás kell, vagy sorrend, vag ya *-osok akkor fussanak meg, ha nem egyezik a sitepart url, ez tűnik a legjobbnak
                var commonParagraphContext = new spoilerContext();
                commonParagraphContext.name = "Paragraph everywhere";
                commonParagraphContext.siteUrlPart = "*";
                commonParagraphContext.elementMarker = core.ui.modules.elementMarkerLogic.getElementMarker("p", "", "");
                spoilerContextList.push(commonParagraphContext);*/

                var twitterContext = new spoilerContext();
                twitterContext.name = "Twitter";
                twitterContext.siteUrlPart = "twitter";
                twitterContext.elementMarker = core.ui.modules.elementMarkerLogic.getElementMarker("", "js-stream-item,AdaptiveNewsLargeImageHeadline", "");
                spoilerContextList.push(twitterContext);

                var googleContext = new spoilerContext();
                googleContext.name = "Google";
                googleContext.siteUrlPart = "google";
                googleContext.elementMarker = core.ui.modules.elementMarkerLogic.getElementMarker("g-inner-card", "g,P94G9b", "");
                spoilerContextList.push(googleContext);

                var youtubeContext = new spoilerContext();
                youtubeContext.name = "Youtube";
                youtubeContext.siteUrlPart = "youtube";
                youtubeContext.elementMarker = core.ui.modules.elementMarkerLogic.getElementMarker(
                    "ytd-rich-item-renderer,ytd-channel-renderer,ytd-grid-playlist-renderer,ytd-expander,ytd-grid-video-renderer,ytd-compact-video-renderer,ytd-video-renderer,ytd-radio-renderer,ytd-compact-radio-renderer,ytd-playlist-panel-video-renderer,ytd-rich-metadata-renderer,ytd-grid-radio-renderer,ytd-movie-renderer,ytd-movie-offer-module-renderer,ytd-grid-movie-renderer,ytd-playlist-renderer,ytd-watch-card-compact-video-renderer",
                    "video-list-item,yt-lockup-video,iv-card,ytd-comment-renderer,ytp-suggestions",
                    "",
                    ".ytp-ce-element,.ytp-ce-expanding-overlay,.ytp-ce-element-shadow,.ytp-endscreen-content");
                spoilerContextList.push(youtubeContext);

                var redditContext = new spoilerContext();
                redditContext.name = "Reddit";
                redditContext.siteUrlPart = "reddit";
                redditContext.elementMarker = core.ui.modules.elementMarkerLogic.getElementMarker("", "scrollerItem", "");
                spoilerContextList.push(redditContext);

                var facebookContext = new spoilerContext();
                facebookContext.name = "Facebook";
                facebookContext.siteUrlPart = "facebook";
                facebookContext.elementMarker = core.ui.modules.elementMarkerLogic.getElementMarker("", "_3ccb,_5pcr,_5nz1,fbFeedTickerBorder,_6rp0,_401d,_5ass,_4-u2", "");
                spoilerContextList.push(facebookContext);
            },

            extendSetting: function() {
                //spoilerContextList
                core.utilities.settings.removeSpoilerContextFromSettings =  function(spoilerContextName) {
                    core.utilities.settings.spoilerContexts.spoilerContextList.removeObjectByName(spoilerContextName);
                    //list is a reference to the setting list, so this will update the settings
                    core.utilities.settings.updateSettingsInStorage();
                };

                core.utilities.settings.addOrUpdateSpoilerContextInSettings = function(isEditing, name, sitePartUrl, elementMarker) {
                    var item;
                    if (isEditing) {
                        item = core.utilities.settings.spoilerContexts.spoilerContextList.getObjectByName(name);
                    } else {
                        item = {};
                        core.utilities.settings.spoilerContexts.spoilerContextList.push(item);
                    }

                    item.name = name;
                    item.siteUrlPart = sitePartUrl;
                    item.elementMarker = elementMarker;

                    core.utilities.settings.updateSettingsInStorage();

                };
            },


            //#endregion

            //#region public functions


            removeSpoilerContextList: function (removedName) {
                core.utilities.settings.removeSpoilerContextFromSettings(removedName);
                core.utilities.message.sendReloadCurrentTabSpoilersMessage();
            },

            addOrUpdateSpoilerContex: function (isSpoilerContextEditing, name, sitePartUrl, elementMarker) {
                var config = app.ui.modules.spoilerContextsLogic.config;
                core.utilities.settings.addOrUpdateSpoilerContextInSettings(isSpoilerContextEditing, name, sitePartUrl, elementMarker);
                core.utilities.message.sendReloadCurrentTabSpoilersMessage();

                if (config.sendGoogleTrackEvent) {
                    if (!isSpoilerContextEditing) {
                        core.utilities.googleAnalitics.trackEvent("Added spoiler context", "Clicked");
                    } else {
                        core.utilities.googleAnalitics.trackEvent("Modified spoiler context", "Clicked");
                    }
                }
            }

            //#endregion

            //#region private functions

            //#endregion
        }
    })();

    app.ui.modules.spoilerContextsLogic.config = new spoilerContextsLogicConfig();

    core.utilities.settings.addSettingModifierModule(app.ui.modules.spoilerContextsLogic);
    core.utilities.settings.addOnExtendSettingsEvent(app.ui.modules.spoilerContextsLogic.extendSetting);


})();





