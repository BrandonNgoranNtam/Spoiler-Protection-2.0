(function() {
    "use strict";


    // document extensions

    HTMLDocument.prototype.getHTMLPageName = function() {
        var path = window.location.pathname;
        var page = path.getLastPart();
        return page;
    };
	
		
    // String extensions

    String.prototype.getLastPart = function(separator) {        
        if (this) {            
            return this.split(separator).pop();
        }
        throw new Error("string is null");
        
    };

    String.prototype.toBool = function() {
        /// <summary>Parse string to boolean</summary>
        if (this == "true") {
            return true;
        }
        if (this == "false") {
            return false;
        }
        throw new Error("only 'true' and 'false' can be parsed to bool: " + this);
    };

    String.prototype.contains = function() {
        /// <summary>Returns a value indicating whether the specified System.String object occurs within this string.</summary>
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };

    String.prototype.isNullOrWhiteSpace = function() {
        return this.trim().match(/^ *$/) !== null;
    };

    String.prototype.trimStringLeft = function(charlist) {
        if (charlist === undefined) {
            charlist = "\\s";
        }
        return this.replace(new RegExp("^[" + charlist + "]+"), "");
    };

    String.prototype.trimStringRight = function(charlist) {
        if (charlist === undefined) {
            charlist = "\\s";
        }
        return this.replace(new RegExp("[" + charlist + "]+$"), "");
    };

    String.prototype.trimString = function(chars) {
        return this.trimStringLeft(chars).trimStringRight(chars);
    };

    String.prototype.startsWith = function(suffix) {
        return this.indexOf(suffix, 0) === 0;
    };

    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    String.prototype.replaceAll = function(search, replacement) {
        return this.replace(new RegExp(search, "g"), replacement);
    };

    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    String.prototype.decapitalizeFirstLetter = function() {
        return this.charAt(0).toLowerCase() + this.slice(1);
    };

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };

    // Array extensions

    Array.prototype.emptyAndPushArray = function (arrayToPush) {
        this.empty();
        this.pushArray(arrayToPush);
    };

    Array.prototype.empty = function () {
        while(this.length > 0) {
            this.pop();
        }
    };

    Array.prototype.pushArray = function (arrayToPush) {
        for(var i = 0; i < arrayToPush.length; i++) {
            this.push(arrayToPush[i]);
        }
    };

    Array.prototype.remove = function(item) {
        var index = this.indexOf(item);
        this.splice(index, 1);
        return item;
    };

    Array.prototype.insert = function ( index, item ) {
        this.splice( index, 0, item );
    };

    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };

    Array.prototype.removeEmptyOrWhiteSpaceStringsFromArray = function() {
        return this.filter(word => word.trim().length > 0);
    };

    Array.prototype.removeEmptyStringsFromArray = function() {
        return this.filter(word => word.length > 0);
    };

    Array.prototype.getObjectListByProperty = function (propertyName, value, contains) {
        var res = [];

        for(var i = 0; i < this.length; i++) {
            var item = this[i];
            if (contains) {
                if (item[propertyName] && item[propertyName].contains(value)) {
                    res.push(item);
                }
            } else {
                if (item[propertyName] === value) {
                    res.push(item);
                }
            }
        }

        return res;
    };


    Array.prototype.getObjectByProperty = function (propertyName, value) {
        var res = null;
        for(var i = 0; i < this.length; i++) {
            var item = this[i];
            if (item[propertyName] === value) {
                res = item;
                break;
            }
        }
        return res;
    };

    Array.prototype.removeObjectByProperty = function (propertyName, value) {
        for(var i = 0; i < this.length; i++) {
            var item = this[i];
            if (item[propertyName] === value) {
                return this.remove(item);
            }
        }
    };


    Array.prototype.getObjectById = function (id) {
        return this.getObjectByProperty("id", id);
    };

    Array.prototype.isObjectExistsById = function (id) {
        return this.getObjectById(id) != null;
    };

    Array.prototype.removeObjectById = function (id) {
        return this.removeObjectByProperty("id", id);
    };

    Array.prototype.refreshObjectById = function (source) {
        if (!this.isObjectExistsById(source.id)) {
            this.push(source);
        } else {
            var objectInList = this.getObjectById(source.id);
            core.utilities.utils.copyProperties(source, objectInList);
        }
    };


    Array.prototype.getObjectByName = function (name) {
        return this.getObjectByProperty("name", name);
    };


    Array.prototype.isObjectExistsByName = function (name) {
        return this.getObjectByName(name) != null;
    };

    Array.prototype.removeObjectByName = function (name) {
        return this.removeObjectByProperty("name", name);
    };

    Array.prototype.refreshObjectByName = function (source) {
        if (!this.isObjectExistsByName(source.name)) {
            this.push(source);
        } else {
            var objectInList = this.getObjectByName(source.name);
            core.utilities.utils.copyProperties(source, objectInList);
        }
    };

    Array.prototype.setPropertyValueForAllObjects = function(propertyName, value) {
        for (var i = 0; i < this.length; i++) {
            this[i][propertyName] = value;
        }
    };


    // -- Number extensions --
    Number.prototype.addLeadingZeros = function(length) {
        /// <summary>Add leading zeros</summary>
        /// <param name="length" type="Integer">The length with the leading zeros(e.g. number = 23; number.addLeadingZeros(5); will return "00023").</param>
        var s = String(this);
        if (typeof (length) !== "number") {
            length = 2;
        }

        while (s.length < length) {
            s = "0" + s;
        }
        return s;
    };

    Number.prototype.toBool = function() {
        /// <summary>Parse number to boolean</summary>
        if (this == 1) {
            return true;
        }
        if (this == 0) {
            return false;
        }
        throw new Error("Only 0 and 1 can be parsed to bool: " + this);
    };

    Number.prototype.isDbExistingId = function() {
        return this > 0;
    };

    // -- OADate extensions --
    var oaDate = new Date(1899, 11, 30);
    var millisecondsOfaDay = 24 * 60 * 60 * 1000;

    Date.prototype.toOADate = function() {
        var result = (Date.parse(this) - Date.parse(oaDate)) / millisecondsOfaDay;
        return result;
    };

    Number.prototype.fromOADate = function() {
        var result = new Date();
        result.setTime((this * millisecondsOfaDay) + Date.parse(oaDate));
        return result;
    };

    Date.prototype.getTicks = function() {
        var ticks = ((this.getTime() * 10000) + 621355968000000000);
        return ticks;
    }

})();