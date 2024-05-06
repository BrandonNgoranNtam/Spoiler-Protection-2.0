(function () {
  "use strict";

  app.ui.modules.spoilersController =
    app.ui.modules.spoilersController ||
    (function () {
      return {
        $spoilerList: null, // A jQuery object that represents the container where the list of spoilers is displayed.
        $spoilerText: null, // A jQuery object for the text input field where users can enter new spoilers.

        // This function sets up the initial state of the UI components related to spoilers.
        // It dynamically generates HTML content for managing spoilers, including input fields for entering spoilers and buttons for adding them.
        // It also initializes the spoiler categories controller for category selection and sets up event listeners for UI interactions like adding a spoiler on pressing the enter key or clicking the add button.
        initUI: function () {
          var $container = $("#spoiler-list-control-container");
          $container.html(
            "" +
              "<table class='td-vertical-center-content-table td-padding-4px-table'>" +
              "    <tbody>" +
              "       <tr>" +
              "           <td>" +
              "               <input type='text' id='category-selector-2' class='form-control' i18n-placeholder='import_category'/>" +
              "           </td>" +
              "           <td>" +
              "               <a id='manage-categories' class='btn btn-info'><span i18n='manage_categories'></span></a>" +
              "           </td>" +
              "       </tr>" +
              "        <tr>" +
              "            <td id='spoiler-header-text'>" +
              "                <div class='font-weight-bold' i18n='spoiler_keywords'></div>" +
              "            </td>" +
              "        </tr>" +
              "        <tr>" +
              "            <td>" +
              "                <textarea id='spoiler-text' class='form-control textarea-resize-none textarea-3row-height' i18n-placeholder='enter_spoilers'  ></textarea>" +
              "            </td>" +
              "            <td>" +
              "                <div id='add-spoiler' class='button button-add' i18n-title='add_spoilers'></div>" +
              "            </td>" +
              "        </tr>" +
              "    </tbody>" +
              "</table>" +
              "<div class='spoiler-list-container'>" +
              "    <table><tbody id='spoiler-list'></tbody></table>" +
              "</div>" +
              ""
          );

          app.ui.modules.spoilersController.$spoilerList = $("#spoiler-list");
          app.ui.modules.spoilersController.$spoilerText = $("#spoiler-text");
          var $addSpoiler = $("#add-spoiler");

          app.ui.modules.spoilerCategoriesController.initCategoryAutoComplete(
            "#category-selector-2"
          );
          $("#manage-categories").click(function () {
            $("#spoiler-categories-tab").click();
          });

          if (!app.ui.modules.spoilersLogic.getIsSpoilerListVisible()) {
            app.ui.modules.spoilersController.$spoilerList.hide();
          }

          app.ui.modules.spoilersController.$spoilerText.keypress(function (e) {
            if (e.which === 13) {
              app.ui.modules.spoilersController.addSpoilerOnClick();
            }
          });
          app.ui.modules.spoilersController.$spoilerText.focus();

          $addSpoiler.click(
            app.ui.modules.spoilersController.addSpoilerOnClick
          );

          app.ui.modules.spoilersController.renderSpoilerStringList();

          browser.i18n.setAllI18nStrings($container);
        },

        // Toggles the visibility of spoiler names based on user settings.
        toggleSpoilerNameVisibilityOnChange: function () {
          app.ui.modules.spoilersLogic.toggleSpoilerNameVisibility();
        },

        // Toggles the visibility of spoiler categories.
        toggleSpoilerCategoryVisibilityOnChange: function () {
          app.ui.modules.spoilersLogic.toggleSpoilerCategoryVisibility();
        },

        // Toggles the visibility of images within spoilers.
        toggleImagesVisibilityOnChange: function () {
          app.ui.modules.spoilersLogic.toggleImagesVisibility();
        },

        // Toggles the visibility of videos within spoilers.
        toggleVideosVisibilityOnChange: function () {
          app.ui.modules.spoilersLogic.toggleVideosVisibility();
        },

        // Toggles the visibility of the entire spoiler list based on user preferences.
        toggleSpoilerListVisibilityOnChange: function () {
          app.ui.modules.spoilersLogic.toggleSpoilerListVisibility(function (
            newValue
          ) {
            var $spoilerList = app.ui.modules.spoilersController.$spoilerList;
            if (newValue) {
              $spoilerList.show();
            } else {
              $spoilerList.hide();
            }
          });
        },

        // Renders the list of spoilers. It fetches the current list of spoilers, clears the existing list in the UI, and iterates over the spoilers to create and display each one. It also sets up buttons for removing spoilers from the list.

        renderSpoilerStringList: function () {
          var $container = app.ui.modules.spoilersController.$spoilerList;
          $container.empty();
          $.each(
            app.ui.modules.spoilersLogic.getSortedSpoilerStringList(),
            function (key, value) {
              var $spoilerListTr = $("<tr />").appendTo($container);

              core.ui.controls.button.addButtonToTr(
                $spoilerListTr,
                value,
                app.ui.modules.spoilersController.removeSpoilerOnClick,
                "remove_spoiler_text",
                "button-delete"
              );

              var $spoilerContainerTextTd =
                $("<td />").appendTo($spoilerListTr);

              $("<div />")
                .text(value)
                //.addClass("spoiler-container-text")
                .appendTo($spoilerContainerTextTd);
            }
          );

          browser.i18n.setAllI18nStrings($container);
        },

        /*
         * This function is triggered when the user clicks on the 'Add Spoiler' button.
         *
         * It retrieves the value of the text input field identified by $spoilerText,
         * trims any leading or trailing whitespace, and assigns it to the variable
         * spoilerListText. It then passes spoilerListText and a callback function
         * named spoilerListOnChangedInSetting to the addSpoiler function of
         * app.ui.modules.spoilersLogic. This function adds the spoiler to the list
         * of spoilers and updates the settings. Once it's done, it clears the
         * text input field.
         *
         * spoilerListText: a string containing the text the user typed in the text
         * input field.
         * $spoilerText: a jQuery object representing the text input field.
         * addSpoiler: a function of app.ui.modules.spoilersLogic that adds a spoiler
         * to the list of spoilers and updates the settings.
         * spoilerListOnChangedInSetting: a callback function that is called once
         * the spoiler is added to the list of spoilers.
         * val(): a jQuery function that gets the value of the text input field.
         * empty(): a jQuery function that clears the text input field.
         */
        addSpoilerOnClick: function () {
          // Get the value of the text input field
          var $spoilerText = app.ui.modules.spoilersController.$spoilerText;
          var spoilerListText = $spoilerText.val().trim();

          // Add the spoiler to the list of spoilers and update the settings
          app.ui.modules.spoilersLogic.addSpoiler(
            spoilerListText,
            app.ui.modules.spoilersController.spoilerListOnChangedInSetting
          );

          // Clear the text input field
          $spoilerText.val("");
        },

        // Triggered when the user clicks the remove button next to a spoiler.
        // It identifies the spoiler to be removed and calls the removeSpoiler function of spoilersLogic.js to update the settings accordingly.
        removeSpoilerOnClick: function () {
          var removeLink = $(this);
          var spoilerToRemove = removeLink.attr("data");
          app.ui.modules.spoilersLogic.removeSpoiler(
            spoilerToRemove,
            app.ui.modules.spoilersController.spoilerListOnChangedInSetting
          );
        },

        // A callback function that is called after adding or removing a spoiler.
        // It re-renders the spoiler list and triggers the reloadTabsWithNewSpoilerList function of spoilersLogic.js to apply the changes across the application.
        spoilerListOnChangedInSetting: function () {
          app.ui.modules.spoilersController.renderSpoilerStringList();
          app.ui.modules.spoilersLogic.reloadTabsWithNewSpoilerList();
        },
      };
    })();

  core.ui.utilities.ui.addOnInitUIEvent(
    app.ui.modules.spoilersController.initUI
  );
})();

// At the end of the file, the initUI function is registered to be called on the initialization of the UI, ensuring that the spoiler management components are set up as soon as the application's UI is ready.
//This file effectively bridges the user interactions with the underlying logic for managing spoilers, making it a key component for the spoiler management feature of the application.
