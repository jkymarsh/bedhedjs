/*!
 * Bedhed.js - A jQuery plugin for better headers for particularly long tables
 *
 * J. Ky Marsh, jkymarsh@gmail.com
 * Copyright (c) 2012
 */

;

(function($, window, document, undefined) {

    // Create the defaults and set up the constructor for the plugin itself
    var pluginName = "bedhed",
        defaults = {
            mode: "repeater",
            period: 5,
            preserveStyle: true,
            terminateTable: false
            // headerClass has no default; no point in initializing an empty option!
        },
        Plugin = function(element, options) {
            this.element = element;
            this.defaults = defaults;
            this.name = pluginName;
            this.options = $.extend({}, defaults, options);

            // console.log(this);

            this.init();
        };

    Plugin.prototype.repeatHeader = function($element, options, thArray) {
        var constructedRow,
            openCellTag = ((options.terminateTable === false) ? "<td>" : "<th>"),
            closeCellTag = openCellTag.replace("<","</"),
            attrString,
            followingRows = [];

        console.log($element);
        console.log(options);
        console.log(thArray);

        console.log(openCellTag);
        console.log(closeCellTag);

        if (!(options.terminateTable)) {
            constructedRow = (options.headerClass) ? "<tr class=\"" + options.headerClass + "\">" : "<tr>";

            console.log(constructedRow);

            for (var i=0; i < thArray.length; i++) {
                console.log(i);

                if (options.preserveStyle) {
                    attrString = "colspan=\"" + thArray[i].colSpan + "\" "
                                + "style=\""
                                + "font-size:" + thArray[i].fontSize + ";"
                                + "font-weight:" + thArray[i].fontWeight + ";"
                                + "font-style:" + thArray[i].fontStyle + ";"
                                + "color:" + thArray[i].fontColor + ";"
                                + "\"";

                    openCellTag = openCellTag.replace(">", " " + attrString + ">");
                }

                constructedRow += openCellTag;
                constructedRow += thArray[i].content;
                constructedRow += closeCellTag;
            }

            constructedRow += "</tr>";

            console.log(constructedRow);

            $element.find("tr").each(function(index) {
                if ((index % options.period) === 0 && index !== 0) {
                    $(this).after(constructedRow);
                }
            });
        }
        else {
            console.log(followingRows);

            $element.remove();
        }
    };

    Plugin.prototype.fixHeader = function() {
        // TODO: Add in option to use fixed CSS header, rather than repeated
        // headers
    };

    // Initialization method for the plugin fires after setup is complete
    Plugin.prototype.init = function() {
        var $element = $(this.element),
            options = this.options,
            thArray = [];

        $element.find("th").each(function() {
            var thObject = {
                content: $(this).html()
            };

            if (options.preserveStyle) {
                thObject.fontSize = $(this).css("font-size"),
                thObject.fontWeight = $(this).css("font-weight"),
                thObject.fontStyle = $(this).css("font-style"),
                thObject.fontColor = $(this).css("color"),
                thObject.colSpan = $(this).attr("colspan");
            }

            thArray.push(thObject);
        });

        (options.mode === "repeater") ? this.repeatHeader($element, options, thArray) : this.fixHeader();
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);