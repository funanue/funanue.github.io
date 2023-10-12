/*
Author: Nezbeda Harald
Description: A jQuery plugin for ratings
*/
(function($) {
    "use strict";

    /*
      Rate Circle
    */
    $.fn.rateCircle = function(options) {
        // These are the default options
        var settings = $.extend({
            size: 100,
            lineWidth: 10,
            fontSize: 30,
            referenceValue: 100,
            valuePrefix: '',
            valueSufix: '',
        }, options);

        var canvasSize = settings.size,
            circlePosition = canvasSize / 2,
            circleSize = circlePosition - settings.lineWidth / 2,
            circleLineWidth = settings.lineWidth,
            textFontSize = settings.fontSize,
            referenceValue = settings.referenceValue,
            valuePrefix = settings.valuePrefix,
            valueSufix = settings.valueSufix;

        $(this).html("");
        $(this).append([
            "<canvas class='rate-circle-back' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>",
            "<canvas class='rate-circle-front' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>"
        ]);

        $(this).css({
            "position": "relative",
            "display": "block",
            "width": canvasSize,
            "height": canvasSize,
            "margin": "0 auto",
            "text-align": "center"
        });

        $(this).each(function() {

            var percent,
                value = $(this).data("value"),
                backCanvas = $(this).find(".rate-circle-back"),
                back = backCanvas.get(0).getContext("2d");

            percent = 100 * value / referenceValue;
            back.lineWidth = circleLineWidth;

            backCanvas.addClass("rate-color-back");
            back.strokeStyle = backCanvas.css("color");

            back.arc(circlePosition, circlePosition, circleSize, -(Math.PI / 180 * 90), 2 * Math.PI - (Math.PI / 180 * 90), false);
            back.stroke();

            var frontCanvas = $(this).find(".rate-circle-front");
            var front = frontCanvas.get(0).getContext("2d");

            front.lineWidth = circleLineWidth;

            frontCanvas.addClass("rate-color" + parseInt(percent / 10, 0)); //getColorClass(rate)
            front.strokeStyle = frontCanvas.css("color");

            var endAngle = (Math.PI * percent * 2 / 100);
            front.arc(circlePosition, circlePosition, circleSize, -(Math.PI / 180 * 90), endAngle - (Math.PI / 180 * 90), false);
            front.stroke();

            $(this).append("<span class='rate-circle-value'>" + valuePrefix + value + valueSufix + "</span>");

            var rateValue = $(this).find(".rate-circle-value");
            rateValue.css({
                "line-height": canvasSize + "px",
                "font-size": textFontSize + "px",
                "color": front.strokeStyle
            });
        });
    };

    /*
      Rate Box
    */
    $.fn.rateBox = function(options) {
        // These are the default options
        var settings = $.extend({
            width: 100,
            height: 100,
            fontSize: 30,
            referenceValue: 100,
            valuePrefix: '',
            valueSufix: '',
        }, options);

        var boxWidth = settings.width,
            boxHeight = settings.height,
            textFontSize = settings.fontSize,
            referenceValue = settings.referenceValue,
            valuePrefix = settings.valuePrefix,
            valueSufix = settings.valueSufix;

        $(this).each(function() {
            var box,
                grade,
                gradientClass,
                text,
                percent,
                value = $(this).data("value");

            percent = 100 * value / referenceValue;
            gradientClass = "rate-gradient" + parseInt(percent / 10, 0);

            $(this).html("<div></div>");
            box = $(this).find("div");
            box.addClass(gradientClass);

            box.css({
                "width": boxWidth + "px",
                "height": boxHeight + "px",
                "margin": "0 auto"
            });
            box.append("<span class='rate-box-value'>" + valuePrefix + value + valueSufix + "</span>");

            var rateValue = $(this).find(".rate-box-value");
            rateValue.css({
                "font-size": textFontSize + "px",
                "height": boxHeight + "px",
                "line-height": boxHeight + "px"
            });
        });
    };
}(jQuery));

(function($) {
  "use strict";

  /*
    Modified Rate Circle Function
  */
  $.fn.modifiedRateCircle = function(options) {
    
    // These are the default options
    var defaultOptions = {
      size: 100,
      lineWidth: 10,
      fontSize: 30,
      referenceValue: 100,
      round: false,
      noneValue: "--",
      valuePrefix: '',
      valueSufix: '',
      colorThresholds: [
        { min: 0, max: 0.39, label: 'low', color: '#f28d4f' },
        { min: 0.40, max: 0.59, label: 'medium', color: '#eedf14' },
        { min: 0.60, max: 0.75, label: 'medium', color: '#F3B700' },
        { min: 0.76, max: 1, label: 'high', color: '#00FF00' }
      ]
    };
    
    var mergedOptions = $.extend({}, defaultOptions, options);
    
    var canvasSize = mergedOptions.size,
    circlePosition = canvasSize / 2,
    circleSize = circlePosition - mergedOptions.lineWidth / 2,
    circleLineWidth = mergedOptions.lineWidth,
    textFontSize = mergedOptions.fontSize,
    referenceValue = mergedOptions.referenceValue,
    round = mergedOptions.round,
    noneValue = mergedOptions.noneValue,
    valuePrefix = mergedOptions.valuePrefix,
    valueSuffix = mergedOptions.valueSuffix,
    colorThresholds = mergedOptions.colorThresholds;
    
    $(this).html("");
    $(this).append([
    "<canvas class='rate-circle-back' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>",
    "<canvas class='rate-circle-front' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>"
    ]);
    
    $(this).css({
      "position": "relative",
      "display": "block",
      "width": canvasSize,
      "height": canvasSize,
      "margin": "0 auto",
      "text-align": "center"
    });
    
    $(this).each(function() {
      var percent,
      value = $(this).data("value"),
      backCanvas = $(this).find(".rate-circle-back"),
      back = backCanvas.get(0).getContext("2d");
      console.log("***modifiedRateCircle: ", value, options);
      console.log("round: ", round, referenceValue, noneValue, value);
      
      percent = typeof value === "number" ? 100 * value / referenceValue : null;
      //percent = Number.isNaN(percent) && noneValue ? noneValue : percent;
      let no_value = (typeof value !== "number" || (!value && value != 0) || Number.isNaN(value)) ? true : false;
      value = no_value && noneValue ? noneValue : value;
      value = !no_value && referenceValue == 1 ? value * 100 : value;
      value = !no_value && round == true && typeof value === "number" ? Math.round(value) : value;
      back.lineWidth = circleLineWidth;
      
      backCanvas.addClass("rate-color-back");
      back.strokeStyle = backCanvas.css("color");
      
      back.arc(circlePosition, circlePosition, circleSize, -(Math.PI / 180 * 90), 2 * Math.PI - (Math.PI / 180 * 90), false);
      back.stroke();
      
      var frontCanvas = $(this).find(".rate-circle-front");
      var front = frontCanvas.get(0).getContext("2d");
      
      front.lineWidth = circleLineWidth;
      
      if (!no_value && value != "--" && !Number.isNaN(percent) && percent != "--"){
        var className = getClassNameForPercent(percent, colorThresholds);
        frontCanvas.addClass(className);
      }
      front.strokeStyle = frontCanvas.css("color");
      console.log("mrc-color: ", front.strokeStyle, percent, value, colorThresholds, className);
      
      var endAngle = (Math.PI * percent * 2 / 100);
      front.arc(circlePosition, circlePosition, circleSize, -(Math.PI / 180 * 90), endAngle - (Math.PI / 180 * 90), false);
      front.stroke();
      
      valueSuffix = !valueSuffix ? "" : valueSuffix;
      console.log("mrc: ", valuePrefix, "value: ", value, "valueSuffix: ", valueSuffix, round, noneValue);
      $(this).append("<span class='rate-circle-value'>" + valuePrefix + value + valueSuffix + "</span>");
      
      var rateValue = $(this).find(".rate-circle-value");
      let style_attrs = {
        "line-height": canvasSize + "px",
        "font-size": textFontSize + "px",
        "color": front.strokeStyle
      };
      if (value == null || value == "--"){
        style_attrs["font-weight"] = "normal";
      }
      rateValue.css(style_attrs);
      });
      
      function getClassNameForPercent(percent, thresholds, allow_negative = false) {
        console.log("***getClassNameForPercent:", percent, typeof percent, Number.isNaN(percent))
        percent = percent && percent < 0 && !allow_negative ? 0 : percent;
        let factor = thresholds[thresholds.length-1].max == 1 ? 100 : 1;
        let color_class_range = {
          0: [1, 3], //red
          1: [4, 6], //yellow
          2: [7, 8], //orange
          3: [9, 10], //green
        }
        let max, estimated_class;
        for (var i = 0; i < thresholds.length; i++) {
          if (percent >= factor*thresholds[i].min && percent <= factor*thresholds[i].max) {
          estimated_class = Math.round(10*((i+1)/thresholds.length));
          if (color_class_range.length == 4){
            let color_range = color_class_range[i];
            if (estimated_class > color_range[1])
              estimated_class = color_range[1];
            else if (estimated_class < color_range[0])
              estimated_class = color_range[0];
          }
          console.log("estimated_class: ", i, i/thresholds.length, estimated_class);
          return "rate-color" + estimated_class;
          }
        }
        estimated_class = Math.round(10*((thresholds.length)/thresholds.length));
        return "rate-color" + estimated_class;
      }
    };
  }
)(jQuery);

