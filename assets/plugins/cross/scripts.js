

function isEmpty(variable) {
    if (variable === null || (Array.isArray(variable) && variable.length == 0) || (variable.constructor === Object && Object.keys(variable).length == 0))
        return true;
    else
        return false;
}

function arrayFieldFreq(dict_list, field, distinct_values = [], score_method = null){
    //distinct_values = arr.map(item => item[field])
    //                   .filter((value, index, self) => self.indexOf(value) === index)
    //var distinct_values = []
    var val = null
    
    if (!distinct_values || !distinct_values.length){
        distinct_values = getDictListFieldDistinctValues(dict_list, field)
    }
    console.log("distinct_values: ", distinct_values);
    console.log("score_method", score_method);
    if (score_method){console.log("score_method.indexOf(field): ", String(score_method).indexOf(field))}
        
    //console.log("field", field);
    //var field_ = field.indexOf(".") != -1 ? field.split(".")[0] : field
    //console.log("field_: ", field_)
    var counter = {};
    if (score_method && !score_method.indexOf(field)){
        dict_list.forEach(function(item) {
            console.log("item: ", item);
            value = field.indexOf(".") == -1 ? item[field] : getDeepValue(item, field) //dict.hasOwnProperty(field)
            value = !value && item.hasOwnProperty(score_method) ? item[score_method] : value;
            console.log("value: ", value);
            
            if (Array.isArray(value)){
                value.forEach(function(dvalue, index) {
                    console.log("dvalue: ", dvalue)
                    if (!Array.isArray(dvalue) && Object.keys(dvalue).length){
                        if (Object.keys(dvalue).includes(field))
                            field_ = dvalue[field]
                        else {
                            field_ = field.replace(score_method+".", "")
                            console.log("1field_: ", field_) 
                            field_ = Object.keys(dvalue).includes(field_) ? dvalue[field_] : field_
                        }
                        
                    }
                    else
                        field_ = dvalue
                    console.log("field_: ", field_)  
                    if(field_ && typeof field_ === "string"){
                        if (!(Object.keys(counter).includes(field_)))
                            counter[field_] = 0 
                        counter[field_] += 1
                    }
                });
                console.log("counter1: ", counter)
            }
            else{
                counter[value] = score_method && Object.keys(item).includes(score_method) ? item[score_method] : null
                console.log("counter2: ", counter)
            }
            //console.log("counter[distinct_value]: ", counter[distinct_value])
        });
    }
    else{
        field = score_method && score_method.indexOf(field) ? score_method : field
        console.log("field-nsc: ", field)
        distinct_values.forEach(function(distinct_value, index) {
            console.log("distinct_value-nsc: ", distinct_value)
            if (distinct_value){
                counter[distinct_value] = dict_list.filter(function(item){
                    //console.log("item-nsci: ", item, "field: ", field)
                    value = field.indexOf(".") == -1 ? item[field] : getDeepValue(item, field) //dict.hasOwnProperty(field)
                    //console.log("value-nsci: ", value)
                    if (!value) {console.log("WARNING: value not found, review input params (score_method)...", value)}
                    result = typeof value === 'string' ? value == distinct_value : value;
                    return result
                }).length;
                console.log("counter3: ", counter)
            }
            else if (score_method){
                counter[distinct_value] = dict_list[score_method]
                console.log("counter4: ", counter)
            }
        });
    }
    //console.log("counter: ", counter)
    return counter
}

function getDictListFieldDistinctValues(dict_list, field, use_field_as_key = null, use_default = null){
    //console.log("getDictListFieldDistinctValues", dict_list, field);
    var distinct_values = use_field_as_key && typeof use_field_as_key === 'string' ? {} : []
    //use_default = use_field_as_key && typeof use_field_as_key === 'string' ? {} : []

    console.log("dict_list: ", dict_list, "field: ", field)
    if (dict_list && dict_list.length){
        $.each(dict_list, function(index, dict) {
            val = field.indexOf(".") == -1 ? dict[field] : getDeepValue(dict, field) //dict.hasOwnProperty(field)
            console.log("dict field: ", dict, field, val);
            
            if (use_field_as_key && typeof use_field_as_key === 'string'){
                key = use_field_as_key.indexOf(".") == -1 ? dict[use_field_as_key] : getDeepValue(dict, use_field_as_key)
                distinct_values[key] = use_default && Object.keys(distinct_values).includes(key) ? distinct_values[key] : val
            }
            else if (val && !distinct_values.includes(val))
                distinct_values.push(val) 
        });
    }
    return distinct_values
}

function sortObjectByKeys(o) {
    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}


//DEPRECATED: USE getDeepValue from forms.js instead
/*function getDeepVal(obj, path, return_list = false) {
    if (typeof obj === "undefined" || obj === null) return;
    path = path.split(/[\.\[\]\"\']{1,2}/);
    for (var i = 0, l = path.length; i < l; i++) {
        if (path[i] === "") continue;
        obj = obj[path[i]];
        if (typeof obj === "undefined" || obj === null) return;
    }
    return obj;
}*/

function getDeepValue(data, key, empty_value = null, return_lists = false, checkCamel = true){
    console.log("***getDeepValue: ", data, key, empty_value, return_lists);
    value = empty_value
    if (key.includes(".")){
      key_1= key.split(".")[0];
      key_2= key.replace(key_1+".", "");
      //key_2= key_2 && !Object.keys(data).includes(key_2) && key_2 != key_2.toString().toLowerCase() ? toUncamelize(key_2) : key_2;
      if (data && typeof data === "object" && Object.keys(data).includes(key_1))
        value = getDeepValue(data[key_1], key_2, empty_value = empty_value);
      else if (data && typeof data === "object" && Array.isArray(data))
        if (data.length && data[0] && typeof data[0] === "object" && Object.keys(data[0]).includes(key_1))
          value = getDeepValue(data[0][key_1], key_2, empty_value = empty_value);
        else
          value = return_lists ? data : null;
      else
        value = null;
    }
    else{
      //key= key && !Object.keys(data).includes(key) && key != key.toString().toLowerCase() ? toUncamelize(key) : key;
      key = checkCamel ? checkCamelKey(data, key) : key;
      console.log("data-: ", data, key, typeof data);
      if (data && typeof data === "object" && Object.keys(data).includes(key))
        value = data[key];
      else if (data && typeof data === "object" && Array.isArray(data))
        if (data.length && data[0] && typeof data[0] === "object" && Object.keys(data[0]).includes(key))
          value = data[0][key];
        else
          value = return_lists ? data : null;
    } 
    
    console.log("+res dvalue: ", value);
    return value;
  }
  

function sumDictListValues(dict_list){
    //console.log("sumDictListValues: ", dict_list)
    if (dict_list.length == 1)
        sum_dict_list = dict_list
    else{
        sum_dict_list = {}
        for (const [index, obj] of dict_list.entries()) {
            //console.log("dict_list: ", index, obj, typeof obj);
            if (Object.keys(obj).length === 0)
                continue;
            for (let key in obj) {
                value = obj[key]
                //console.log("obj: ", key, value, Object.keys(sum_dict_list));
                sum_dict_list[key] = sum_dict_list && sum_dict_list.hasOwnProperty(key) ? sum_dict_list[key] + value : value //Object.keys(sum_dict_list).includes(key)
            }
        }
    }
    return sum_dict_list
};


/*function toCamelCase(str) {
    // Lower cases the string
    return str.toLowerCase()
      // Replaces any - or _ characters with a space 
      .replace( /[-_]+/g, ' ')
      // Removes any non alphanumeric characters 
      .replace( /[^\w\s]/g, '')
      // Uppercases the first character in each group immediately following a space 
      // (delimited by spaces) 
      .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
      // Removes spaces 
      .replace( / /g, '' );
}*/

function isNumeric(val, include_floats = true) {
    if (!val) {return false}
    else if (typeof val === "number") {return true}
    else if (include_floats)
        return /^-?\d+(?:\.\d+)?$/.test(val.toString());
    else
        return /^-?\d+$/.test(val.toString());
}

function uuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//abcDef = abc_def
function toUncamelize(str, separator = "_")  {
    //console.log("***toUncamelize: ", str, separator);
    return str.replace(/[A-Z]/g,  (letter) => separator + letter.toLowerCase())
            .replace("/^" + separator + "/", '');
}

//abcDef = abc_def
//DEPRECATED?? SAME AS getGraphQLResponse??
function getGraphQLResponse2(obj, level = 1, separator = "_", set_exception = true, clean_objs = true, iter = 1) {
    console.log("***getGraphQLResponse2: ", obj, level, separator);
    if (obj == null || typeof obj !== "object" || iter > level) { return obj; }
    if (typeof obj === "object" && level == null && set_exception && clean_objs){
        return convertKeysCase(obj, to_camel_case = false);
    }
    
    if (typeof obj === "object"){
        let jsonString = null;
        if (!Array.isArray(obj)){
            jsonString = obj && Object.keys(obj).length ? JSON.stringify(obj) : null;
            if (jsonString && jsonString == jsonString.toLowerCase())
                return obj
            
            for (let [key, value] of Object.entries(obj)) {
                //console.log("key-uno: ", key, key != key.toString().toLocaleLowerCase(), ( !set_exception || !key.toString().endsWith("Set")));
                if (key && key != key.toString().toLocaleLowerCase()){
                    if (set_exception && key.toString().endsWith("Set"))
                        continue;
                    else{
                        let key_ = toUncamelize(key, separator);
                        if (value == null || typeof value === "string" || typeof value === "number" || typeof value === "boolean"){ // && !value.includes("_")
                            obj[key_] = value;
                        }
                        else{
                            obj[key_] = getGraphQLResponse2(value, level = level, separator = separator, set_exception = set_exception, iter = iter+1)
                            if (clean_objs){
                                delete obj[key];
                                console.log("del obj[key]: ", key, key_);
                            }
                        }
                    }
                }
            }
        }
        else{
            jsonString = obj && obj.length ? JSON.stringify(obj) : null;
            if (jsonString && jsonString == jsonString.toLowerCase())
                return obj;
            
            if (iter == 0)
                level = level + 1;
            for (var i = 0; i < obj.length; i++) {
                let value = obj[i];
                obj[i] = getGraphQLResponse2(value, level = level, separator = separator, set_exception = set_exception, iter = iter+1)
            }
        }
    }
    
    return obj
}

function camelizeKeysToSnakeCase(data) {
    function underscore(match) {
        return `_${match.toLowerCase()}`;
    }
    
    if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data)) {
            return data.map(camelizeKeysToSnakeCase);
        } else {
            const convertedObject = {};
            for (const key in data) {
                const newKey = key.replace(/[A-Z]/g, underscore);
                convertedObject[newKey] = camelizeKeysToSnakeCase(data[key]);
            }
            return convertedObject;
        }
    } else {
        return data;
    }
}

function uncamelizeKeysToCamelCase(data) {
    function capitalize(match) {
        return match.charAt(1).toUpperCase();
    }
    
    if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data)) {
            return data.map(uncamelizeKeysToCamelCase);
        } else {
            const convertedObject = {};
            for (const key in data) {
                const newKey = key.replace(/_\w/g, capitalize);
                convertedObject[newKey] = uncamelizeKeysToCamelCase(data[key]);
            }
            return convertedObject;
        }
    } else {
        return data;
    }
}

function convertKeysCase(data, to_camel_case = true) {
    if (to_camel_case) {
        return uncamelizeKeysToCamelCase(data);
    } else {
        return camelizeKeysToSnakeCase(data);
    }
}

//snakeCase first_letter == true, else camelize
//abc def = abc Def
function toCamelCase(str, first_letter = false, separator = ""){
    //console.log("***toCamelCase - str: ", str)
    if (!str || typeof str !== "string")
        result = str
    else
        result = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => separator+chr.toUpperCase());
        if (first_letter)
            result = result.charAt(0).toUpperCase() + result.slice(1)
    //console.log("+result: ", result)
    return result
}

//abc_def = abc Def
function camelizeSnakeCase(word, first_letter = false) {
    let result = word.replace(/(_\w)/g, function(match) {
        return " "+ match[1].toUpperCase();
    });
    if (first_letter && result)
        result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
}

function separateCamelizedString(str) {
    var separated = str.replace(/([a-z])([A-Z])/g, '$1 $2');
    separated = separated.toLowerCase().trim();
    var words = separated.split(' ');
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }
    var result = words.join(' ');
    return result;
}

String.prototype.count=function(c) { 
    var result = 0, i = 0;
    for (i;i<this.length;i++) if(this[i]==c) result++;
    //console.log("+result count - c: ", c, result)
    return result;
};

String.prototype.rsplit = function(sep, maxsplit = 1) {
    var split = this.split(sep);
    return maxsplit ? [ split.slice(0, -maxsplit).join(sep) ].concat(split.slice(-maxsplit)) : split;
}

function sortByAttribute(array, ...attrs) {
    // generate an array of predicate-objects contains
    // property getter, and descending indicator
    let predicates = attrs.map(pred => {
      let descending = pred.charAt(0) === '-' ? -1 : 1;
      pred = pred.replace(/^-/, '');
      return {
        getter: o => o[pred],
        descend: descending
      };
    });
    // schwartzian transform idiom implementation. aka: "decorate-sort-undecorate"
    return array.map(item => {
      return {
        src: item,
        compareValues: predicates.map(predicate => predicate.getter(item))
      };
    })
    .sort((o1, o2) => {
      let i = -1, result = 0;
      while (++i < predicates.length) {
        if (o1.compareValues[i] < o2.compareValues[i]) result = -1;
        if (o1.compareValues[i] > o2.compareValues[i]) result = 1;
        if (result *= predicates[i].descend) break;
      }
      return result;
    })
    .map(item => item.src);
}

var getInitials = function (string) {
    var names = string ? string.split(' ') : string;
    let initials = names ? names[0].substring(0, 1).toUpperCase() : names;
    
    if (names && names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    else if (names && names.length == 1 && string.length != 1) {
        initials += string.charAt(string.length - 1).toUpperCase();
    }
    
    return initials;
};

function profileImage(name = "", width=50, height=50){
    let intials = getInitials(name)
    let style = {
        "width": "50px;", 
        "height": "50px;", 
        "border-radius": "50%;", 
        "background": "#512DA8;", 
        "font-size": "10px;", 
        "color": "#fff;", 
        "text-align": "center;", 
        "line-height": "50px;", 
        "margin": "20px 0;", 
    }
    style = JSON.stringify(style).replace("{", "").replace("}", "").replace(/":"/g, ":").replace(/;","/g, ";").replace(/;"/g, ";").replace(/"/g, "");
    console.log("style: ", style);
    profile_image = '<div id="profileImage" style="'+style+'" alt="'+name+'">'+intials+'</div>';
    return profile_image
}
//console.log("profileImage: ", profileImage());



// a and b are javascript Date objects
function dateDiffInDays(a, b, unit = "days") {
    console.log("***dateDiffInDays - a: ", a, "b: ", b)
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    a = a instanceof Date ? a : new Date(a);
    b = b instanceof Date ? b : new Date(b);
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    let diff = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    diff = unit == "months" ? diff/30 : diff;
    console.log("a: ", a, "b: ", b);
    return diff;
}

function decodeHtmlSpecialChar(str){
    if (!str || !str.toString().includes(";")) { return str; }

    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&quot;/g, '"');
    str = str.replace(/&#039;/g, "'");
    return str;
}

// Return elements of array a that are also in b in linear time:
function arrayIntersect(a, b) {
    return a.filter(Set.prototype.has, new Set(b));
}


function objArrUnique(obj_arr, fields = []){
    var ids__ = []
    for (var i=0, l=obj_arr.length; i<l; i++){
        
        let obj = obj_arr[i];
        let id__ = "";
        let attr = null;
        console.log("obj: ", obj);

        fields.forEach( function(field) {
            let value = null;
            if (field.indexOf(".")){
                attr = field.split(".")[1]
                field = field.split(".")[0]
                value = obj[field];
                value = obj[field] ? obj[field][attr] : "";
            }
            else
                value = obj[field];
            id__ = id__ + value;
        });
        obj_arr[i].id__ = id__ //Object.Values(obj).join(",");
        ids__.push(id__);
    }
    function onlyUnique(obj_, index, self) {
        return ids__.indexOf(obj_.id__) === index;
    }
    var unique = obj_arr.filter(onlyUnique);
    return unique
}

function shortName(name, limit = 20){
    if (name.length > limit){
        if(name.indexOf(": "))
            name = name.split(": ")[0]
        else if(name.indexOf("( "))
            name = name.split("( ")[0]
        else
            name = name.split(" ").length >= 2 ? name.split(" ")[0] : name.slice(0, limit)+"...";
    }
    return name
}

function loadUXPlugins(){
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
    if ($(".dataTables_scrollBody").length == 1)
        handleArrowKeyPress(".dataTables_scrollBody");
}


// Function to get the scrollable element closest to the mouse pointer
function getNearestScrollableElement(event) {
    var scrollableElements = $(":scroll");
    var mouseX = event.pageX;
    var closestElement;
    var closestDistance = Number.MAX_VALUE;
    scrollableElements.each(function() {
        var scrollableElement = $(this);
        var distance = Math.abs(scrollableElement.offset().left - mouseX);
        if (distance < closestDistance) {
            closestElement = scrollableElement;
            closestDistance = distance;
        }
    });
    console.log("+res closestElement: ", closestElement);
    return closestElement;
}

// Function to handle keyboard arrow key presses
function handleArrowKeyPress(jq_selector){
    $(document).ready(function() {
        function handleArrowKeyPress_(event) {
            //console.log("***handleArrowKeyPress_: ", event);
            var keycode = event.which || event.keyCode;
            // Get the scrollable element
            var scrollableElement;
            //console.log("jq_selector: ", jq_selector, $(jq_selector));
            if (jq_selector) {
                scrollableElement = $(jq_selector);
            } else {
                scrollableElement = getNearestScrollableElement(event);
            }
            // Left arrow key
            if (keycode === 37) {
                // Scroll the element to the left
                scrollableElement.scrollLeft(scrollableElement.scrollLeft() - 10);
            }
            // Right arrow key
            else if (keycode === 39) {
                // Scroll the element to the right
                scrollableElement.scrollLeft(scrollableElement.scrollLeft() + 10);
            }
        }
        // Event listener for keydown event
        $(document).keydown(handleArrowKeyPress_);
    });
}

function isSelectorOrHtmlString(str) {
    if (!typeof content_selector === "string")
        return null
    // Check if the string starts with a "<" character
    if (str.startsWith("<")) {
      // If it starts with "<", it is likely an HTML string
      return "html";
    } else {
      try {
        // Attempt to create a jQuery object using the string as a selector
        $(str);
        // If no error is thrown, it is a valid selector
        return "selector";
      } catch (e) {
        // If an error is thrown, it is neither a valid selector nor an HTML string
        return "unknown";
      }
    }
  }


console.log("cross-script loaded...")


function str_ocurrence_count(str, find){ //= function(lit, cis) {
    //var m = this.toString().match(new RegExp(lit, ((cis) ? "gi" : "g")));
    m = str.toString().split(find).length - 1;
    console.log("m: ", m); //, lit, cis);
    return (m != null) ? m : 0;
}

function getAcronym(str){
    if (!str || str.toString().length == 0)
        return null
    
    var result = ""
    var parts = str.toString().replace(" and ", " ").replace(" y ", " ").replace(" & ", " ").trim().split(" ");
    for (var i = 0; i < parts.length; i++) {
        //console.log("parts: ", parts[i], parts);
        result += parts[i][0].toUpperCase();
    }
    console.log("+res: ", result)
    return result
}

function createHtmlElement(tag, attributes, data={}, content=null, din_attributes=[]){
    /*var elementData = {
        tag: 'div',
        attributes: {
            id: 'myElement',
            class: 'my-class',
            'data-custom-attr': 'custom-value'
        }
    };*/
    
    var $element = $('<' + tag + '>').attr(attributes);
    if (content)
        $element.html(content);
    
    // Set data attributes
    if (data && typeof data === "object" && Object.keys(data).length)
        for (var key in data) {
            $element.data(key, data[key]);
        }
    
    return $element;
}

function array2Obj(obj, path, key, value_key = null, preffix="", empty_value = []){
    let dict_list = getDeepValue(obj, path, empty_value = empty_value, return_lists = true);
    console.log("***array2Obj: ", dict_list, obj);
    let new_obj = {};
    if (dict_list && Array.isArray(dict_list) && dict_list.length && typeof dict_list[0] === "object" && !Array.isArray(dict_list[0]) && Object.keys(dict_list[0]).includes(key))
        for (var i = 0, l = dict_list.length; i < l; i++) {
            if (typeof dict_list[i] === "object" && !Array.isArray(dict_list[i]) && Object.keys(dict_list[i]).includes(key)){
                let row = dict_list[i];
                let value_ = value_key && typeof row === "object" && Object.keys(row).includes(value_key) ? row[value_key] : row 
                new_obj[preffix+dict_list[i][key]] = value_;
            }
        }
    return new_obj;
}

function objsArray2List(objs_array, path){
    let dict_list = objs_array;
    console.log("***objsArray2List: ", dict_list);
    let new_obj = [];
    if (dict_list && Array.isArray(dict_list) && dict_list.length && typeof dict_list[0] === "object" && !Array.isArray(dict_list[0]))
        for (var i = 0, l = dict_list.length; i < l; i++) {
            if (typeof dict_list[i] === "object" && !Array.isArray(dict_list[i])){
                let row = dict_list[i];
                let value_ = getDeepValue(row, path, null);
                new_obj.push(value_);
            }
        }
    return new_obj;
}

function mergeObjsByKey(obj1, obj2) {
    const mergedObj = { ...obj1 };
  
    for (const prop in obj2) {
      if (obj2.hasOwnProperty(prop)) {
        if (
          typeof obj1[prop] === 'object' &&
          typeof obj2[prop] === 'object'
        ) {
          // Merge objects using the current key
          mergedObj[prop] = { ...obj1[prop], ...obj2[prop] };
        } else {
          // If not an object or key does not exist in obj1, add the key-value pair from obj2
          mergedObj[prop] = obj2[prop];
        }
      }
    }
  
    return mergedObj;
  }


function filterObjectValuesByAttribute(obj, attributeName, attributeValue) {
    return Object.keys(obj).reduce((result, key) => {
        const innerObj = obj[key];
        if (innerObj[attributeName] === attributeValue) {
            result[key] = innerObj;
        }
        return result;
    }, {});
}

function isAllValuesLessThanOrEqualToOne(arr) {
    return arr.every((value) => {
        // Check if the value is null or a number and less than or equal to 1
        return value === null || (typeof value === 'number' && value <= 1);
    });
}