

var serialized_forms = {}
function renderForm(form_id_selector, data, field_map = {}, convert_select_text_to_value = false, try_obj_id = true, try_uncamelize = false, deep_levels = 1, add_maxlen = false, add_hint = false, use_m2m_id_on_entity = false, iter_ = 0){
  console.log("***renderForm - form_id_selector: ", form_id_selector, "data: ", data, "iter_!!: ", iter_)
  let tooltip_added = false;
  let field_selector = null;
  
  /*var initial_serialize = null;
  if (iter_ == 0 && $(form_id_selector).length)
    initial_serialize = $(form_id_selector).serialize();*/
  
  console.log("check tr-li: ", form_id_selector, form_id_selector.toString().includes(" tr"), $(form_id_selector).length, $(form_id_selector).length > 1, $(form_id_selector).first().data("id"));
  if (form_id_selector && typeof form_id_selector === "string" && (form_id_selector.endsWith(" tr") || form_id_selector.endsWith(" li")) && $(form_id_selector).length >= 1){
    console.log("has tr or li...", form_id_selector, $(form_id_selector))
    if ($(form_id_selector).find(':not(:has(th))').first().attr("data-id") == null)
      $(form_id_selector).each(function(index, value){
        $(value).attr("data-id", index);
        console.log("set tr id: ", $(value).attr("data-id"), index);
      });
    
    //var _data = [];
    var used_trs = []
    $(form_id_selector).find(':not(:has(th))').each(function(index, value){
      let id_ = $(value).attr("data-id"); //? $(value).attr("data-id") : index ;
      console.log("value-id_: ", value, id_, index, $(form_id_selector));
      if (id_ && !isNaN(id_))
        id_ = id_.includes(".") ? parseFloat(id_) : parseInt(id_);
      id_ = id_ && !used_trs.includes(id_) ? id_ : index ;
      used_trs.push(id_);
      
      console.log("tr iteration selector-row: ", index, value, form_id_selector+"[data-id='"+id_+"']");
      console.log("used_trs: ", used_trs);
      //_data.push(
      let row = data[index] ? data[index] : null;
      if (row){
        if (!$(value).attr("data-id")) { console.warn("tr no id detected: ", id_); }
        renderForm(form_id_selector+"[data-id='"+id_+"']", row, field_map, convert_select_text_to_value, try_obj_id, try_uncamelize, deep_levels, add_maxlen, add_hint, use_m2m_id_on_entity, iter_ = iter_+1)
      }
      //)
      console.log("tr iteration result-row: ", row);
    })
  }
  else{
    
    for (var field in data) {
      
      field_selector = typeof form_id_selector === "string" ? form_id_selector + ' ' + '[name="' + field + '"]': $(form_id_selector).find('[name="' + field + '"]');
      console.log("field-rf: ", field, data[field], field_selector, !$(field_selector).length);
      
      if (!$(field_selector).length){
        
        if (try_uncamelize){
          let field_uncamelize = toUncamelize(field);
          console.log("try_uncamelize...", field, field_uncamelize)
          let field_uncamelize_selector = form_id_selector + ' ' + '[name="' + field_uncamelize + '"]';
          
          if ($(field_uncamelize_selector).length){
            data[field_uncamelize] = data[field];
            field = field_uncamelize;
            field_selector = field_uncamelize_selector;
          }
        }
      }
      
      if (field.endsWith("_id")){
        form_field = field.replace("_id", "");
        field_selector = form_id_selector + ' ' + '[name="' + form_field + '"]';
      }
      else
        form_field = field;
      
      if (field_map && !Array.isArray(field_map) && typeof field_map === "object" && Object.keys(field_map).includes(form_field))
        field_selector = form_id_selector + ' ' + '[name="' + field_map[form_field] + '"]';
      
      form_field_el = $(field_selector);
      console.log("-form_field_el: ", form_field_el, field_selector, $(form_id_selector).find('[name="' + field_map[form_field] + '"]'));
      
      //second intent on fail, try id as normal field and not as foreign-key
      //console.log("INFO: second intent on fail, try id as normal field and not as foreign-key...")
      if (!$(form_field_el).length && field.endsWith("_id") ){
        field_selector_2 = form_id_selector + ' ' + '[name="' + field + '"]';
        form_field_el_2 = $(field_selector_2);
        if (!$(form_field_el).length){
          form_field_el = form_field_el_2;
          field_selector = field_selector_2
        }
      } 
      else if (!field.endsWith("_id") && ( (typeof form_id_selector === "string" && $(form_id_selector + ' ' + '[name="' + form_field + '_id"]').length) || ($(form_id_selector).find('[name="' + form_field + '_id"]').length) ) ){
        console.log("obj id detected...");
        field_selector = typeof form_id_selector === "string" ? form_id_selector + ' ' + '[name="' + form_field + '_id"]' : $(form_id_selector).find('[name="' + form_field + '_id"]');
        form_field_el = $(field_selector);
        if ($(form_field_el).length && data[field] && typeof data[field] === "object" && Object.keys(data[field]).includes("id") && data[field]["id"]){
          console.log("el: ", form_field_el, "data[field][id]: ", data[field]["id"]);
          $(form_field_el).first().val(parseInt(data[field]["id"]));
          console.log("INFO: pre-value-set, continue...");
          continue;
        }
      }
      
      console.log("form_field-rf: ", form_field, "form_field_el: ", form_field_el, "field: ", "'"+field.toString()+"'", "value: ", data[field], field_selector, form_field, try_obj_id)
      
      if (data[field] && typeof data[field] === "object" && Object.keys(data[field]).length && iter_ + 1 < deep_levels && !(try_obj_id && Object.keys(data[field]).includes("id"))){
        console.log("data-field is object, trying recursive call: ", field);
        renderForm(form_id_selector, data[field], field_map = field_map, convert_select_text_to_value = convert_select_text_to_value, try_obj_id = try_obj_id, try_uncamelize = try_uncamelize, deep_levels = deep_levels, add_maxlen = add_maxlen, add_hint = add_hint, use_m2m_id_on_entity = use_m2m_id_on_entity, iter_ = iter_+1);
        return;
      }
      
      if ((!$(form_field_el).length && typeof form_id_selector === "string" && $(form_id_selector + ' ' + '[group_field="'+form_field+'"]').length && form_field_el.attr('type') != "range") || (form_field_el.attr('type') == "checkbox")){
        console.log("has group_field or is checkbox...")
        let is_group_field = $(form_id_selector + ' ' + '[group_field="'+form_field+'"]').length && form_field_el.attr('type') != "range" ? true : false;
        if (is_group_field){
          console.log("has group_field...")
          field_selector = form_id_selector + ' ' + '[group_field="'+form_field+'"]';
          form_field_el = $(field_selector);
        }
        
        if (form_field_el.attr('type') == "checkbox" && form_field_el.hasClass("text-nicelabel"))
            console.log("CHECK: is nicelabel checkbox-1...", data[field])
        
        value = data[field]
        //TODO when value came from graphql an is like: ['0', '1'], "'"!
        value = value && value.toString().startsWith("[") ? value.replace("[", "").replace("]", "").split(", ") : value //JSON.parse(value) : value;
        
        console.log("is nicelabel checkbox-2...", value, Array.isArray(value), typeof value)
        if (value) { console.log("value.toString().startsWith([): ", value.toString().startsWith("[")); }
        
        if (value && Array.isArray(value) && value.length)
          for (var k = 0; k < value.length; k++){
            try {
              $(field_selector+"[value='"+value[k]+"']").prop("checked", true);
            } catch (error_) {
              if (typeof value[k] === "string" && value[k].startsWith("'"))
                $(field_selector+"[value="+value[k]+"]").prop("checked", true);
              else
                console.warn(error_);
            }
          }
        else if (is_group_field)
          $(field_selector+"[value='"+value+"']").prop("checked", true);
        else{
          value = value && value.toString().length && value != "0" && value != "false" && value != false ? true : false;
          console.log("checkbox-val: ", value, $(form_field_el));
          $(form_field_el).prop("checked", value);
          if ($(form_field_el).hasClass("switchery")){
            //$(form_field_el).attr("data-switchery", value);
            loadSwitchery($(form_field_el)) //.switchery
          }
        }
        
      }
      else if ($(form_field_el).length){
        console.log("else if-has len...");
        
        if (form_field_el.attr('type') != "file") {
          
          let node_name = form_field_el && $(form_field_el).length ? $(form_field_el)[0].nodeName.toLowerCase() : null
          console.log("node_name: ", node_name, form_field_el)
          
          //SELECT
          if (node_name == "select"){
            console.log("1-select detected try_obj_id...", try_obj_id, "field: ", field, typeof data[field], data[field])
            
            if (data[field] && typeof data[field] === "object" && Object.keys(data[field]).includes("id")){
              console.log("1...");
              value = data[field]["id"];
            }
            else if (Object.keys(data).includes(field+"_id") && !Object.keys(data).includes(field) && data[field+"_id"] && isNumeric(data[field])){
              console.log("2...", field, data[field]);
              value = data[field+"_id"];
            }
            else if (convert_select_text_to_value && data[field] && !data[field].toString().startsWith("A_") && typeof data[field] !== "object" && !isNumeric(data[field])){
              value = $(field_selector+' option:contains("'+data[field]+'")').val() //.attr('selected', true);
              console.log("3...option text contains", field, data[field], value);
              
              if (value == null){
                value = $(field_selector+' option[value="'+data[field]+'"]').val() //.attr('selected', true);
                console.log("3.2...reintent with option value", field, data[field], value);
              }
            }
            else if (try_obj_id && data[field] && typeof data[field] === "object" && Object.keys(data[field]).includes("id")){
              console.log("4...", field, data[field]);
              value = data[field]["id"];
            }
            else if (Array.isArray(data[field]) && data[field].length){
              console.log("5...", field, data[field]);
              if (typeof data[field][0] === "object" && Object.keys(data[field][0]).includes("id")){
                value = [];
                for (var i = 0; i < data[field].length; i++) {
                  value.push(data[field][i]["id"]);
                }
              }
              else if (typeof data[field][0] === "number" || typeof data[field][0] === "string")
                value = data[field]
              else
                console.warn("WARNING: dict of list value detected for select element");
            }
            else{
              value = data[field] && data[field].toString().startsWith("A_") ? data[field].replace("A_", "") : data[field];
              console.log("6...", field, data[field], typeof data[field], value);
            }
            console.log("7-field: ", field, "value: ", value)
            
            if (value && value.toString().startsWith("A_")){
              value = isNumeric(value.replace("A_", "")) ? parseInt(value.replace("A_", "")) : value.replace("A_", "");
              console.log("-select choice A_ detected, new value: ", value);
            }
            console.log("3-field: ", field, "value: ", value, typeof value);
            
            if (!Array.isArray(value)){
              console.log("is not array...");
              
              //value or text, not selecting cascade
              let option_selector = form_field_el.find("option[value='"+value+"']").first(); 
              console.log("$(option_selector): ",$(option_selector))
              if (!$(option_selector).length && isNaN(value)){
                console.log("!isNaN...", form_field_el, form_field_el.find('option:contains("'+value+'")').first());
                option_selector = form_field_el.find('option:contains("'+value+'")').first();
                value = option_selector.val();
              }
              if ($(option_selector).length){
                let is_multi = $(form_field_el).hasClass("multiple-select2") || ($(form_field_el).hasClass("select2-hidden-accessible") && $(form_field_el).attr("multiple") == "multiple")
                if (is_multi)
                  if (Array.isArray(value))
                    $(option_selector).val([value]);
                  else
                    $(option_selector).val(value);
                  $(option_selector).prop('selected', true);
              }
              console.log("$(option_selector).selected: ", $(option_selector).is(':selected'), form_field_el.find(':selected'), form_field_el.find(':selected').val());
              
              let is_cascade_filter = $(form_field_el).hasClass("cascade_filter") ? true : false;
              console.log("is_cascade_filter: ", is_cascade_filter, form_id_selector);
              if (is_cascade_filter){
                let cascade_filter_child_options = $(form_id_selector).find("select option["+field+"]");
                //let cascade_filter_child = $(cascade_filter_child_options).first().parent(); //change this to "for-each" to implement more than 1 cascades
                console.log("cascade_filter render-triggering: ", cascade_filter_child_options, cascade_filter_child_options.find(":selected"), form_field_el);
                
                let on_event = form_field_el.hasClass("default-select2") ? "select2:select" : "change";
                console.log("select2 on_event: ", on_event, form_field_el);
                if (on_event == "select2:select")
                  $(form_field_el).trigger(on_event, false);
              }
            }
            else //select multiple?
              console.log("is array...");
          }
          else {
            console.log("else...", form_field_el, form_field_el.attr('type'), form_field_el.hasClass("text-nicelabel"));
            if (form_field_el.attr('type') == "checkbox"){
                value = data[field] && data[field] != "false" && data[field] != "0" ? 1 : 0 
            }
            /*else if (form_field_el.attr('type') == "file" && data[field]){
              '<img src="'+data[field]+'" alt="'+field+'" class="media-object">'
            }*/
            else
              value = data[field]
          }
          
          // console.log("set: ", form_field_el, "value-2: ", value);
          /*if ($(form_field_el).hasClass("select2-hidden-accessible") && !Array.isArray(value))
            form_field_el.select2("val", value);
          else*/
          // console.log("is_radio: ", form_field_el.attr('type') == "radio", $(field_selector+"[value='"+value+"']"));
          if (form_field_el.attr('type') == "radio"){
            console.log("is_radio...");
            if ($(field_selector+"[value='"+value+"']").length)
              $(field_selector+"[value='"+value+"']").prop("checked", true);
          }
          else{
            console.log("else - normal set...", form_field_el, $(form_field_el).hasClass("multiple-select2"), $(form_field_el).prop("multiple"), value);
            $(form_field_el).val(value);
            
            if ($(form_field_el).hasClass("multiple-select2") || $(form_field_el).prop("multiple")){
              console.log("multiple trigger... select2 loaded: ", $(form_field_el).data('select2'), $(form_field_el).find("option").length, $(form_field_el).find("option:selected").length);
              $(form_field_el).trigger("change");
              if (!$(form_field_el).find("option").length)
                console.warn("WARNING: no options to select, review loading order...", form_field_el);
            }
            else if ($(form_field_el).attr("type") == "range")
              $(form_field_el).attr("value", value);
          }
          console.log("field set ends...", field, "value: ", value, "set-on-el: ", $(form_field_el).val(), $(form_field_el).attr("value"));
          
          if (add_maxlen)
            tooltip_added = addTooltipInfo("maxlen");
          if (add_hint)
            tooltip_added = addTooltipInfo("hint") || tooltip_added;
          
        }
        else { //FILES - IMGS
          console.log("FILE: ", field, data[field]);
          
          //if ($("#" + field + "_img")){
          /*if(data[field].indexOf('/media/') !== -1){
            //$("#" + field + "_img").html("<a href='" + data[field] + "' target='_blank'>Archivo</a>");
            $(field_selector + "_img").html("<a href='" + data[field] + "' target='_blank'>Archivo</a>");
            let filename = data[field];
            $(field_selector).parent().find('label').text(filename)
          } 
          else {
            //$("#" + field + "_img").html("<a href='/media/" + data[field] + "' target='_blank'>Archivo</a>");
            $(field_selector + "_img").html("<a href='/media/" + data[field] + "' target='_blank'>Archivo</a>");
          }*/
          
          if (data[field])
            readFile($(field_selector), data[field], field_selector + "_img");
          else{
            $(field_selector).val("");
            $(form_id_selector+' input[type="file"]').parent().find('label').text("");
          }
          
          /*}
          else{
            createImageElement(field + "_img", data[field])
          }*/
          
          //$(form_id_selector + ' ' + '[name="' + field + '"]').val("");
          //form_field_el.val("");
        }
      }

    }
  }
  
  console.log("add_maxlen && tooltip_added: ", add_maxlen && tooltip_added)
  if (add_maxlen && tooltip_added)
      $(form_id_selector).find('[data-toggle="tooltip"]').tooltip();
  //select2-hidden-accessible
  //console.log("form_id_selector: ", form_id_selector)
  
  $(document).ready(function() {
    loadFormPlugins(form_id_selector);
  });
  
  if (iter_ == 0){
    
    serialized_forms[form_id_selector] = $(form_id_selector).serialize();
    console.log("SET serialize-form: ", form_id_selector);
    //$(form_id_selector).addClass("rendered");
  }
  
}

function isDisabledForm(jq_selector){
  var enabled_fields = $(jq_selector).find(":input, :text, :file, :checkbox, select, textarea").not('option').not("[type='hidden'], .hidden").not(':disabled'); //.find(":visible")
  console.log("disable-input: ", jq_selector, $(jq_selector).find(":input, :text, :file, :checkbox, select, textarea").not('option').not("[type='hidden'], .hidden").not(':disabled'), enabled_fields.length); //.find(":visible")
  var is_disabled = enabled_fields.length == 0;
  console.log("+res is_disabled: ", is_disabled);
  return is_disabled
}

function isEmptyForm(jq_selector){
  console.log("***isEmptyForm", jq_selector);
  var is_empty = true;
  console.log("form inputs: ", $(jq_selector).find(":input, :text, :file, :checkbox, select, textarea"), $(jq_selector).find(":input, :text, :file, :checkbox, select, textarea").find(":visible"));
  $(jq_selector).find(":input, :text, :file, :checkbox, select, textarea").each(function() { //.find(":visible")
    console.log("el: ", $(this), $(this).val());
    if($(this).val() !== ""){
      is_empty = false;
      return false;
    }
  });
  
  console.log("+res is_empty: ", is_empty);
  return is_empty
}

function readFile(input, src, img_selector = null) {
  console.log("***readFile ", input, src, img_selector);
  let result = null
  
  if (img_selector && $(img_selector).length)
    $(img_selector).attr('src', src);
  
  //$(img_selector).html("<a href='" + data[field] + "' target='_blank'>Archivo</a>");
  let filename = getFileName(src); //.includes("/") ? src.rsplit("/")[1] : src;
  console.log($(input).parent().find('label'));
  $(input).parent().find('label').text(filename);
  //$(input).val(src);
  
  console.log("+result reader: ", result)
  return result;
}

function uploadFile(input, img_selector, src, mode = "readAsDataURL") {
  console.log("***readFile ", input, img_selector, src, mode);
  let result = null
  
  if ($(input).length && $(input).prop('files')[0]) {
    let reader = new FileReader();
    file = $(input).prop('files')[0];
    
    reader.onload = function (e) {
        $(img_selector).attr('src', e.target.result);
        //$(img_selector).html("<a href='" + data[field] + "' target='_blank'>Archivo</a>");
        let filename = src;
        console.log($(input).parent().find('label'))
        $(input).parent().find('label').text(filename)
        
        const url = URL.createObjectURL(file)
        //const imageBox = document.getElementById('logo-box');
        //imageBox.innerHTML = '<img src="'+url+'" alt="avatar" id= "logo-default">'
    }
    
    reader.onerror = function() {
      console.log("reader.error: ", reader.error);
    };
    
    if (mode == "readAsDataURL")
      reader.readAsDataURL(file);
    else if (mode != "readAsArrayBuffer")
      reader.readAsArrayBuffer(file);
    else
      reader.readAsText(file);
    
    result = reader.result;
  }
  
  console.log("+result reader: ", result)
  return result;
}

function loadFormPlugins(form_id_selector){
  console.log("***loading Form Plugins: ", form_id_selector);
  let form_select2_default = $(form_id_selector).find(".default-select2");
  // console.log("***loadFormPlugins - $(form_select2_default): ", $(form_select2_default));
  if ($(form_select2_default).length)
    if ($(form_select2_default).not('.select2-hidden-accessible').length)
      loadSelect2(form_select2_default, default_value = null, multiple = false, closeOnSelect = true, free_input = false) //$(".default-select2").select2();
    else{
      console.log("trigger change...", form_select2_default);
      $(form_select2_default).trigger("change");
    }
  
  //console.log("form_select2_default: ", form_select2_default)
  
  let form_select2_multiple = $(form_id_selector).find(".multiple-select2, select[multiple]");
  // console.log("$(form_select2_multiple): ", form_select2_multiple);
  if ($(form_select2_multiple).length){
    console.log("select_multiple found...", $(form_select2_multiple));
    let form_select2_multiple_final = $.merge($(form_select2_multiple).not('.select2-hidden-accessible'), $(form_select2_multiple).find('option[icon]'));
    //console.log("$(form_select2_multiple_final): ", form_select2_multiple_final,  $(form_select2_multiple).find('option[icon]'));
    if (form_select2_multiple_final.length)
      loadSelect2(form_select2_multiple_final, default_value = null, multiple = null, closeOnSelect = false, free_input = false) //$(".multiple-select2").select2();
    else{
      console.log("trigger multiple change...", form_select2_multiple);
      /*let on_event = form_field_el.hasClass("default-select2") ? "select2:select" : "change";
      console.log("select2 on_event: ", on_event, form_field_el);
      if (on_event == "select2:select")
        $(form_field_el).trigger(on_event, false);*/
      $(form_select2_multiple).trigger("change"); //.trigger("select2:select", false);
    }
  }
  
  loadSwitchery($(form_id_selector).find("[type='checkbox']").not(".text-nicelabel").not(".checks")) //.switchery
  
  try{
    //console.log("loading-nicelabel: ", $(form_id_selector).find('.nicelabel > input'));
    if ($(form_id_selector).find('.nicelabel > input').length)
      $(form_id_selector).find('.nicelabel > input').nicelabel();
  } catch (error) { console.warn("Warning: ", "No nicelabel detected in view, but class found in some elements, forget to import js library, skipping..."); }
  try{
    console.log("loading-checks: ", $(form_id_selector).find(".checks"));
    loadChecks($(form_id_selector).find(".checks"), 1.5);
  } catch (error) { console.warn("Warning: ", "No checks detected in view, but class found in some elements, forget to import js library, skipping..."); }
  try{
    //console.log("loading-niceselect: ", $(form_id_selector).find("select.niceselect"));
    if ($('select.niceselect').length)
      $('select.niceselect').niceSelect(); //'update'
  } catch (error) { console.warn("Warning: ", "No niceSelect detected in view, but class found in some elements, forget to import js library, skipping..."); }
  
  //FORM FOCUS NEXT
  //loadFormTabs(form_id_selector)
  
  //Change submit button when processing (disabled)
  jQuery.propHooks.disabled = {
    set: function (el, value) {
      if (el.disabled !== value) {
        el.disabled = value;
        value && $(el).trigger('disabledSet');
        !value && $(el).trigger('enabledSet');
      }
    }
  };
  
  $(form_id_selector).find("button[type='submit']").on('disabledSet', function(event){
    $(this).attr("default", $(this).text());
    console.log("disable-default: ", $(this).text());
    if ($(this).text())
      $(this).text("Procesando...");
  });
  $(form_id_selector).find("button[type='submit']").on('enabledSet', function(event){
    let default_ = $(this).attr("default");
    console.log("enabled-default: ", default_);
    if (default_)
      $(this).text(default_);
  });
  
  loadRangeSlider(jq_selector = form_id_selector);
  
  //load * for required fields
  console.log("$(form_id_selector): ", $(form_id_selector));
  if (!$(form_id_selector).length)
    console.warn("form not found?: ", form_id_selector, $(form_id_selector));
  let rules = !$(form_id_selector).length ? {} : $(form_id_selector).validate().settings.rules;
  renderFormRules(rules);
  
  console.log("loadFormPlugins loaded...");
}

function loadCountDownTimer(jq_selector, datetime, text_finish = "EXPIRED", days = true, hours = true, minutes = true, seconds = true, exclude_empty = true){
  jq_selector = jq_selector.toString().startsWith("#") || jq_selector.toString().startsWith(".") ? jq_selector.toString().replace("#", "").replace(".", "") : jq_selector;

  // Set the date we're counting down to
  var countDownDate = new Date(datetime).getTime();

  // Update the count down every 1 second
  var x = setInterval(function() {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;
    let text = "";

    // Time calculations for days, hours, minutes and seconds
    if (days){
      var days_ = Math.floor(distance / (1000 * 60 * 60 * 24));
      if (!exclude_empty || days_ != 0)
        text = text + days_ + "d ";
    }
    
    if (hours){
      var hours_ = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      if (!exclude_empty || hours_ != 0)
        text = text + hours_ + "h ";
    }
    
    if (minutes){
      var minutes_ = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      if (!exclude_empty || minutes_ != 0)
        text = text + minutes_ + "m ";
    }
    
    if (minutes){
      var seconds_ = Math.floor((distance % (1000 * 60)) / 1000);
      text = text + seconds_ + "s ";;
    }
    
    
    // Display the result in the element with id="demo"
    document.getElementById(jq_selector).innerHTML = text
    
    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById(jq_selector).innerHTML = text_finish;
    }
  }, 1000);
}

function timeoutRedirect(url, seconds){
  window.setTimeout(() => {
    window.location.href = url;
  }, 1000*seconds) // 1 seg = 1000
}


function loadFormTabs(form_id_selector){
  let elements = $(form_id_selector).find("input, select, textarea").not("[type='hidden'], .hidden");
  console.log("elements: ", elements);
  
  $(elements).keydown(function(e){
    console.log("keydown: ", e, e.keyIdentifier, e.keyCode);
    if (e.keyIdentifier == 'tab' || e.keyCode == 9) { //e.keyIdentifier == 'U+000A' || 
      //if (e.target.nodeName === 'INPUT' && e.target.type !== 'textarea') {
      let found = focusNextElement(form_id_selector);
      if (found)
        e.preventDefault();
      return !found;
      //}
    }
  });
}

function loadCascadeFiltering(form_id_selector){
  //CASCADE FILTER - PARENT
  let cascade_filters_parents = $(form_id_selector).find("select.cascade_filter");
  if (cascade_filters_parents && cascade_filters_parents.length){
    console.log("***STARTING LOADING cascade_filters_parents: ", cascade_filters_parents, form_id_selector);

    cascade_filters_parents.each(function( index ) {
      console.log(index, "LOADING cascade_filters_parent: ", form_id_selector, $(this).attr("id"), $(this).find("option:selected").length, $(this).find("option:selected").val());
      
      var name = $(this).attr("name");
      console.log("STARTING - search for name", name); //, "preventDefault()", this);
      var on_event = $(this).hasClass("default-select2") ? "select2:select" : "change"; //.trigger(on_event);
      
      //CASCADE CHILD
      var cascade_filter_child_options = $(form_id_selector).find("select option["+name+"]");
      var cascade_filter_child = $(cascade_filter_child_options).first().parent(); //change firs for each to implement more than 1 cascades
      var cascade_filter_child_id = $(cascade_filter_child).attr("id");
      console.log("SET cascade_filter_child_id: ", cascade_filter_child_id, cascade_filter_child.length, cascade_filter_child_options.length);
      
      //init - create child aux
      var cascade_filter_child_aux_id = cascade_filter_child_id+"_aux";
      let has_aux = $("#"+cascade_filter_child_aux_id).length;
      var cascade_filter_child_aux = !has_aux ? $(cascade_filter_child).clone().addClass("exclude-from-parent-form").addClass("select2-cascade-filter-aux").addClass("hidden").attr("id", cascade_filter_child_aux_id) : $("#"+cascade_filter_child_aux_id); //.removeClass("default-select2")
      console.log("has_aux: ", has_aux, cascade_filter_child_aux.attr("id"), !has_aux || has_aux == 0);
      
      if (!has_aux || has_aux == 0){
        console.log("cloning: ", cascade_filter_child_id, "to: ", cascade_filter_child_aux.attr("id"), "data: ", cascade_filter_child.find("option").length);
        cascade_filter_child_aux.hide()
        console.log("cascade_filter_child_aux: ", cascade_filter_child_aux_id, cascade_filter_child_aux.length, on_event, cascade_filter_child_id);
        
        //add to DOM
        $(form_id_selector).append(cascade_filter_child_aux);
        //mark
        $(cascade_filter_child).addClass("cascade_filter_child");
        //$(cascade_filter_child).prop('selected', false).parent().hide();
        
        //BY EACH cascade_filters_parents - this === cascade_filters_parent
        //ON CHANGE TRIGGER - THEN CASCADE FILTER IN CHILD
        $(this).on(on_event, function(event, reset_selection = true){ //change
          console.log("***TRIGGER parent CHANGE: ", $(this).attr("id"), $(this).find("option:selected").val(), cascade_filter_child_id, name, cascade_filter_child_aux_id, on_event, reset_selection); //, event
          
          if (on_event == "change"){
            console.log("event.preventDefault()...");
            event.preventDefault();
          }
          
          cascade_filtering(this, cascade_filter_child_id, cascade_filter_child, cascade_filter_child_options, name, cascade_filter_child_aux_id, on_event, reset_selection);
          
        });
      }
      
      if ($(cascade_filter_child).hasClass("default-select2") && $(cascade_filter_child).is(":visible")){
        console.log("trigger cascade_filter_child select2 initi change event...", cascade_filter_child)
        $(cascade_filter_child).trigger('change').trigger('change.select2'); //.val(null)
      }
      
      //init - clean childs, first filter
      let parent_selected_value = $(this).find("option:selected").val();
      console.log("init-clean-cascade_filters_parents...", $(this).attr("id"), name, parent_selected_value, cascade_filter_child_id); 
      if (parent_selected_value){
        //$(cascade_filter_child).find("option["+name+"!='" + parent_selected_value + "']").remove();
        console.log("remove?: ", $(cascade_filter_child).find("option["+name+"!='" + parent_selected_value + "']"))
      }
      
    });
  }
  else
    console.log("cascade_filter: No option selected...");
}

function cascade_filtering(cascade_filters_parent, cascade_filter_child_id, cascade_filter_child, cascade_filter_child_options, name, cascade_filter_child_aux_id, on_event = null, reset_selection = true){
  
  let parent_selected_value = $(cascade_filters_parent).find("option:selected").val();
  let child_options = $(cascade_filter_child).find("option").length;
  let child_option_selected = $(cascade_filter_child).find("option:selected").length;
  on_event = on_event ? on_event : $(cascade_filters_parent).hasClass("default-select2") ? "select2:select" : "change";
  console.log("***STARTING - parent change...", name, parent_selected_value, cascade_filter_child_aux_id); //, "preventDefault()", cascade_filters_parent);
  
  let use_aux_refresh_ok = !child_option_selected ? true : reset_selection;
  let filter_required = $(cascade_filter_child).find("option["+name+"!='" + parent_selected_value + "']").length;
  
  console.log("cascade_filtering:", cascade_filter_child_id, parent_selected_value, "filter_required: ", filter_required, "child_options: ", child_options, "use_aux_refresh_ok: ", use_aux_refresh_ok, cascade_filter_child_options, $(cascade_filter_child).hasClass("default-select2"));
  
  if (!parent_selected_value){
    console.log("0-no selection, clean child options:", cascade_filter_child_options, cascade_filter_child, $(cascade_filter_child).hasClass("default-select2"), cascade_filter_child_id);
    //clean child
    $(cascade_filter_child).html('').parent().hide();
  }

  
  if (parent_selected_value && (filter_required || !child_options) && use_aux_refresh_ok){
    console.log("1-start refresh options from aux:", cascade_filter_child_id, cascade_filter_child_options.hasClass("default-select2")); //cascade_filter_child.attr("id"), 
    
    //clean child
    $(cascade_filter_child).html('');
    
    //addd new from aux element
    console.log("aux search: ", cascade_filter_child_aux_id, $("#"+cascade_filter_child_aux_id).attr("id"), $("#"+cascade_filter_child_aux_id).find("option["+name+"='" + parent_selected_value + "']").length, name, parent_selected_value);
    let find_selector = "option["+name+"='" + parent_selected_value + "'], option["+name+"*=', " + parent_selected_value + "'], option["+name+"^='" + parent_selected_value + ", ']";
    $("#"+cascade_filter_child_aux_id).find(find_selector).each(function() {
      let option = $(this).first().clone();
      console.log("ADDING cascade_filter_child_aux_id - option: ", cascade_filter_child_aux_id, option, name, parent_selected_value, cascade_filter_child_id, $(cascade_filter_child).attr("id"));
      $(cascade_filter_child).append(option);
    });
    
    //POST LOGIC - EXTRA FUNCTIONALITY FEATURES
    //IF ONLY ONE OPTION
    let results = $(cascade_filter_child).find(find_selector); //"option["+name+"='" + parent_selected_value + "']"
    console.log("results.first().val(): ", results.first().val())
    
    if (results.length == 1){
      
      //SELECT OPTION 1
      console.log("1.1-cascade filtering-1 on: ", $(results).first());
      $(results).first().prop('selected', true) //.parent().trigger(on_event);
      
      //IF OPTION == PARENT OPTION
      let child_value = $(results).first().val().toString();
      let child_text = $(results).first().text().toString();
      let result_in_parent_value = parent_selected_value.toString().includes(child_value); //|| parent_selected_value.toString().includes(child_text);
      console.log("results.length == 1: ", child_value, child_text, result_in_parent_value)
      
      //IF CHILD EQUAL PARENT, HIDE
      if (child_value == parent_selected_value || child_text == parent_selected_value || child_value.includes(", "+parent_selected_value) || child_value.startsWith(parent_selected_value+", ") || result_in_parent_value){
        console.log("SHOW CHILD-1: ", cascade_filter_child);
        $(cascade_filter_child).parent().hide();
      }
      else{
        console.log("HIDE CHILD-1: ", cascade_filter_child);
        $(cascade_filter_child).parent().show("slow");
      }
      
    }
    else{ //ELIF SAME SELECT OR HIDEs
      console.log("1.2-cascade filtering-else...");
      
      /*
      //let val_ = $(cascade_filters_parents).find(":selected").val();
      let cascade_val_ = $(cascade_filter_child).find("option:contains('"+parent_selected_value+"')")
      console.log("cascade_val_: ", cascade_val_, parent_selected_value);
      
      //IF PARENT OPTION IN OPTIONS
      if (parent_selected_value && cascade_val_.length){
        console.log("1.3-cascade filtering-2 on: ", $(results).first());
        cascade_val_.first().prop('selected', true).parent().trigger(on_event);
      }
      else
        console.log("1.4-NO cascade filtering on: ", $(results).first());*/
      
      //CLEAN SELECTION ON CHILD SELECT
      console.log("1.3-clean selection on child...", cascade_filter_child.attr("id"), $(cascade_filter_child));
      $(cascade_filter_child).attr("selected", false).val([]);
      
      console.log("SHOW CHILD-2: ", cascade_filter_child);
      $(cascade_filter_child).parent().show("slow");
    }
    
    /*if (results.length == 0 || child_option_selected){
      console.log("1.5-No result or no selection - starting casacade unselect")
      //cascade unselect
      let cascade_filter_child_options_2 = $(cascade_filter_child).parents("form").find("select option["+name+"]");
      let cascade_filter_child_2 = $(cascade_filter_child_options_2).first().parent(); //change firs for each to implement more than 1 cascades
      cascade_filter_child_id_2 = $(cascade_filter_child_2).attr("selected", false).val([]).trigger(on_event);
    }*/
  }
  else if (filter_required && child_options){
    console.log("2-deleting not valid options: ", cascade_filter_child_id, $("#"+cascade_filter_child_id+"_aux").find("option"));
    $(cascade_filter_child).find("option").not("["+name+"='" + parent_selected_value + "'], ["+name+"*=', " + parent_selected_value + "'], ["+name+"^='" + parent_selected_value + ", ']").remove(); //"option["+name+"!='" + parent_selected_value + "']"
  }
  
  //CASCADE CHANGES
  on_event = on_event ? on_event : $(cascade_filter_child).hasClass("default-select2") ? "select2:select" : "change";
  console.log("TRIGGER CASCADE CHANGES: ", cascade_filter_child.attr("id"), on_event);
  $(cascade_filter_child).trigger(on_event);
}

function createImageElement(id, src, add_to_selector = null, height = 200, width = 200){
  var image = new Image();
  image.id = id;
  image.src = src;
  image.height = height;
  image.width = width;

  if (add_to_selector){
    imageBox.innerHTML = '';
    imageBox.appendChild(image);
    $(add_to_selector).attr('src',image.src);
  }

  return image;
}

function loadGraphSwitch(jq_selector, graphCallback){
  loadSwitchery(jq_selector);
  
  $(jq_selector).on('change', function(event) {
    event.preventDefault();
    console.log('Checkbox changed...', event);
    if ((graphCallback && typeof graphCallback === "function")){
      //let checked = $(this).is(":checked") ? 1 : 0;
      var checked = $(this).is(':checked'); //event.target.checked;
      // Your callback code here
      disableButton($(this));
      graphCallback({"checked": checked}, function(response, error){
        if (response && !error){
          let text = checked ? "Activación" : "Desactivación"
          let result = Object.keys(Object.keys(response)[0])[0];
          console.log("graphCallback OK...", response, result, text);
          //if ()
          loadAlertPopup(text+" exitosa");
        }
        else{
          console.warn("graphCallback Fail...", error, response);
          //loadAlertPopup("Algo salio mal... pruebe más tarde");
        }
        enableButton($(this));
      });
      /*if (checked) {
        // Checkbox is now checked
        console.log('Checkbox is checked');
        
      } else {
        // Checkbox is now unchecked
        console.log('Checkbox is unchecked');
        // Your callback code here
      }*/
      console.log("loadGraphSwitch-checked: ", checked);
    }
  });
}

var switchery = {};
function loadSwitchery(searchBy = "[type='checkbox'].switchery"){
  console.log("***loadSwitchery: ", searchBy)
  //Init CheckBox Style
  $(searchBy).each(function (i, element) {
      //debugger;
      //console.log("element-sw: ", element, $(element).attr("switchery"))
      
      if (!$(element).attr("data-switchery")) {
        console.log("element-sw: Loaded", element)
        let element_id = element.getAttribute('id') ? element.getAttribute('id') : "checkbox_"+i;
        if (!element.getAttribute('id'))
          console.warn("Switchery id not found in element: ", element, "element_id: ", element_id);
        switchery[element_id] = new Switchery(element, { color: '#8753de', secondaryColor: 'rgb(241, 241, 241)'}, $(element).data());
      }
      else if ($(element).length && $(element)[0].nodeName.toLowerCase() == "input"){
        
        let switchElement = $(element);
        if (!switchElement.hasClass('switchery'))
          switchElement.addClass("switchery");
        let err_clicked = (switchElement.is(':checked') && parseInt(switchElement.val()) == 0)
        let err_no_clicked = (!switchElement.is(':checked') && parseInt(switchElement.val()) == 1)
        console.log("switchElement - check state: ", switchElement, switchElement.is(':checked'), switchElement.val(), err_clicked, err_no_clicked)
        
        if (err_clicked || err_no_clicked){
          console.log("here...")
          switchElement.parent().find('input[type="checkbox"].switchery').trigger('click');
          /*if (err_no_clicked)
            switchElement.show();
          else
            switchElement.hide();*/
          
          console.log("switch rendered...", switchElement.parent().find('input[type="checkbox"].switchery'), err_no_clicked)
        }
      }
  });
}

function addTooltipInfo(attr_ = "maxlength"){
  let form_group_el = form_field_el.parents(".form-group");
  form_group_el = form_group_el && form_group_el.length ? form_group_el[0] : null;
  let value = form_field_el.attr(attr_);
  let tooltip_added = false;
  //console.log("1: ", form_group_el, value);

  if (value && form_group_el){
    console.log("childs: ", $(form_group_el).children());
    let label_el = $(form_group_el).children("label").first();
    let i_el = $(label_el).children("i").first();
    //console.log("2: ", label_el, i_el, i_el.length);

    if (!i_el || (i_el && !i_el.length)){
      console.log("adding i el...");
      i_el = '<i class="fa fa-question-circle info-label" style="color: #909090;" data-toggle="tooltip" data-placement="top" title=""></i>' //$();
      console.log("i_el: ", i_el);
      $(label_el).append("&nbsp;&nbsp;"+i_el);
      i_el = $(label_el).children("i").first();
      console.log("append i_el...");
    }
    
    let i_text = i_el && $(i_el).attr("title") ? $(i_el).attr("title") + "\n" : $(i_el).attr("title");
    //console.log("3: ", i_text);
    $(i_el).attr("title", i_text + "*"+attr_+": " + value);
    tooltip_added = true
  }
  return tooltip_added
}

function loadNiceSelect(jq_selector, options = [], default_value = null, required = null, placeholder = "Seleccionar", error_jq_selector = "div.container-error"){
  if ($(jq_selector).length && options.length){
    for (var i = 0; i < options.length; i++) {
      let option = createHTMLElement("option", options[i]);
      console.log("option: ", option);
      $(jq_selector).append(option);
    }
    $(jq_selector).niceSelect();
  }
}

function loadSelect2(jq_selector, default_value = null, multiple = null, closeOnSelect = true, free_input = false, allowClear = false, required = null, placeholder = "Seleccionar", error_jq_selector = "div.container-error"){
  if (multiple == null){
    if (typeof jq_selector === "string")
      multiple = jq_selector.includes("multiple") || $(jq_selector).hasClass("multiple-select2") || $(jq_selector).attr("multiple");
    else
      multiple = $(jq_selector).hasClass("multiple-select2") || $(jq_selector).attr("multiple");
  }
  console.log("***load_select2 - jq_selector: ", jq_selector, "multiple: ", multiple, $(jq_selector));
  console.log("jq_selector:selected ", $(jq_selector).find(":selected"));

  if (!$(jq_selector).length)
    console.warn("Warning: select2 selector fail, element not found... - jq_selector: ", jq_selector)
  else if ($(jq_selector).hasClass("select2-hidden-accessible")) {
    // Select2 has been initialized
    /*try {
      $(jq_selector).select2('destroy');
    } catch (e) {
      // sentencias para manejar cualquier excepción
      console.log("Warning: ", e);
      //logMyErrors(e); // pasa el objeto de la excepción al manejador de errores
    }*/
  }
  
  console.log("default_value-1: ", default_value);
  if (!default_value && $(jq_selector).find(":selected").length && !multiple){
    default_value = $(jq_selector).find(":selected").val();
  }
  
  console.log("default_value-2: ", default_value);
  if (default_value){
    
    console.log("set default_value: ", default_value)
    
    if (typeof default_value === 'string' && !isNumeric(default_value))
      default_value = $(jq_selector).find(' option:contains("'+default_value+'")').prop('selected', true); //.attr('selected', true);
    else{
      
      console.log("trigger change-1...", jq_selector)
      $(jq_selector).val(default_value).trigger('change');
      //$(jq_selector).select2("val", default_value);
      /*if (multiple == true && Array.isArray(default_value)){
        
        $(jq_selector).on("select2:open", function (e) {
          var options = $(jq_selector).find("option[selected='selected']");
          console.log("selector: ", "ul#select2-"+$(jq_selector).attr("id").toString()+"-results");;
          var result_list = $("ul#select2-"+$(jq_selector).attr("id").toString()+"-results");
          console.log("$(jq_selector): ", $(jq_selector), "options: ", options, "jq_selector: ", jq_selector, $(jq_selector).attr("id"), "result_list: ", result_list);
          
          if (options.length && !result_list.find("li[aria-selected='true']").length){
            var interval = setInterval(function() {
              // do your loop
              let loop_should_stop = $(result_list).find("li:contains('"+$(options).first().text()+"')").length;
              if (loop_should_stop) {
                clearInterval(interval);
                options.each(function( index_ ) {
                  console.log("option: ", $(this), $(this).text(), "lis: ", $(result_list).find("li"), $(result_list).find("li:contains('"+$(this).text()+"')"));
                  $(result_list).find("li:contains('"+$(this).text()+"')").attr("aria-selected", "true"); //.trigger('select2:select');
                });
              }
            }, 1000);
            
          }
        });
      }*/
    }
  }
  console.log("jq_selector:selected-2: ", $(jq_selector).find(":selected"));
  
  var list;
  allowClear = $(jq_selector).hasClass("allow-clear") ? true : allowClear;
  required = allowClear ? false : required;
  console.log("placeholder: ", placeholder, "closeOnSelect: ", closeOnSelect, "multiple: ", multiple, "free_input: ", free_input, "allowClear: ", allowClear);
  
  //ALLWAYS IF-1
  if (!free_input || true){
    var params = {
      placeholder: placeholder,
      closeOnSelect: closeOnSelect,
      multiple: multiple,
      tags: false,
      allowClear: allowClear //clear content button
      //maximumSelectionLength: 2
      //dropdownParent: $('#myModal')
    }
    
    console.log("select: ", $(jq_selector), "options2: ", $(jq_selector).find("option[data-icon]"));
    var has_icon = $(jq_selector).find("option[data-icon]").length;
    console.log("has_icon: ", has_icon);
    if (has_icon){
      //params["dropdownParent"] = $("#vendor_form-group");
      params["templateResult"] = function (data) {
        //console.log("templateResult - data: ", data, $(data.element));
        if (data.disabled == false) {
          let option = $(data.element); //data.element.attributes[0].nodeValue
          var $span = $("<span><img src='/media/" + option.data("icon") + "' width='25' height='25' class='img-flag'/> " + data.text + "</span>");
          return $span;
        }
      }
      params["templateSelection"] = function (data) {
        //console.log("templateSelection - data: ", data, $(data.element));
        let option = $(data.element);
        var $span = $("<span><img src='/media/" + option.data("icon") + "' width='25' height='25'  class='img-flag'/> " + data.text + "</span>");
        return $span;
      }
    }
    
    console.log("select final params: ", params);
    list = $(jq_selector).select2(params);
    console.log("jq_selector:selected-3: ", $(jq_selector).find(":selected"), $(jq_selector).is(":selected"));
  }
  else{
    /*list = $(jq_selector).select2({
      tags: true,
      createTag: function (params) {
        return {
          id: params.term,
          text: params.term,
          newOption: true
        }
      }
    });*/
    
    console.log("****free_input")
    list = $(jq_selector).select2({
        createSearchChoice:function(term, data) { 
          console.log(term, data)
          if ($(data).filter(function() { 
              return this.text.localeCompare(term)===0; 
          }).length===0) 
          {return {id:term, text:term};} 
      },
      multiple: false
    }).on('select2:open', () => {
      $(".select2-results:not(:has(a))").append('<a href="#" style="padding: 6px;height: 20px;display: inline-table;">Create new item</a>');
    });
    
    $("select2-search__field").keydown(function(event){ 
      var id = event.key || event.which || event.keyCode || 0;
      console.log(event, id)
      if (id == 13) {
        let new_value = $(this).val()
        let optionExists = ($(jq_selector).find('option[value=' + $(this).val() + ']').length > 0);
        console.log(new_value, optionExists)
        
        if(!optionExists){
          $(jq_selector).append($('<option>', { 
            value: new_value,
            text : new_value 
          }));
          $(jq_selector).trigger('change');
        }
      }
  });
  }
  
  //SET ON-CHANGE
  if (!multiple)
    $(jq_selector).on("change", function (event) {
      console.log("select2-change - event: ", event, "selected: ", $(this).find(":selected"));
      var option = $(this).find(":selected");
      var error_elem = $(this).parent().find(error_jq_selector);
      
      //console.log("this: ", $(this), "select_change... - option: ", option, "error_container_elem: ", error_elem, "error_jq_selector: ", error_jq_selector, option.text(), option.text().startsWith("---"));
      if (option && !option.text().startsWith("---") && error_elem) {
        //console.log("select2-error_elem empty");
        error_elem.empty();
      }
      $(this).validate(); //.find(":selected").val()
    });
  
  console.log("default_value: ", default_value, "jq_selector", jq_selector, "multiple: ", multiple, "required", required, "allowClear", allowClear);
  //if (!required)
  //  $(jq_selector).prop("selected", false).val([]);
  
  console.log("trigger change...", jq_selector);
  $(jq_selector).trigger('change') //.trigger('change.select2'); //select2:select
  //$('select.select2-hidden-accessible').change();
  console.log("select2 load finish - change triggered..", jq_selector);
}

function formClean(form_selector, country_default = "Chile"){
  console.log("***formClean: ", form_selector);

  if ($(form_selector).length && $(form_selector)[0].nodeName.toLowerCase() == "form"){
    console.log("form reset...");
    $(form_selector).trigger("reset");
    $(form_selector+' input[type="file"]').parent().find('label').text("");
    console.log("$(form_selector+' select'): ", $(form_selector+' select'))
  }
  else{
    console.log("form custom clean...");
    $(form_selector+' input[type="text"]').val("");
    $(form_selector+' input[type="password"]').val("");
    $(form_selector+' input[type="number"]').val("");
    $(form_selector+' input[type="file"]').val("");
    $(form_selector+' input[type="file"]').parent().find('label').text("");
    $(form_selector+' textarea').val("");

    $(form_selector+' input[type=checkbox]').val(0).prop('checked', false);
    //$(form_selector+' select').prop('selectedIndex',0);
  }
  
  //MODAL - SELECT - AUTO SELECT OPTION
  $(form_selector+' select').not('.allow-clear').prop('selectedIndex',0)
  //$(form_selector+' select').find('.allow-clear').prop('selected',false).val([]);
  $(form_selector+' select.select2-hidden-accessible').change(); //.not('.allow-clear')

  $(form_selector).find('input[type="checkbox"][data-switchery="true"]').each(function(index){
    let switchElement = $(this) //.length ? $(this)[0] : null
    console.log("cleaning switchElement: ", switchElement)
    //if (switchElement.is(':checked')) {
    switchElement.parent().find('.switchery').trigger('click'); //input[type="checkbox"]
    switchElement.hide();
    //}
  });
    
  if (country_default){
    let country_selector = form_selector+" select[name='country']";
    let option_selector = country_selector+" option:contains('"+country_default+"')";
    console.log("select set default country...", country_default, $(country_selector), $(option_selector));
    //console.log("country_default: ", country_default, "option_selector: ", $(option_selector).first())
    $(option_selector).prop('selected', true) // attr('selected', "selected");
    $(country_selector).trigger('change');
    //console.log("country_selector: ", $(country_selector), "option_selector: ", $(option_selector))
  }
  console.log("select2 finish selected: ", $(form_selector+' select').find(":selected"))
}

function formCleanErrors(form_selector, error_jq_selector = ".container-error"){
  $(form_selector+' '+error_jq_selector).html('')
}


function formErrors(errors, level, prefix){
    if (level == 'parent') {
        $.each(errors, function(index, value) {
      var label = '<label id="id_'+index+'-error" class="error" for="id_'+index+'">'+value[0]+'.</label>'
            $("#id_"+index).closest('.form-group').find('.container-error').append(label)
        });
    }else{
        $.each(errors, function(index, value) {
            $.each(value, function(k, v) {
              var label = '<label id="id_'+k+'-error" class="error" for="id_'+k+'">'+v+'.</label>';
              $('#id_'+prefix+'-'+index+'-'+k).closest('.form-group').find('.container-error').append(label);
            })
        });
    }
}


function formErrorPlacement(error, element, rules = {}, form_selector = ".form-group", error_container_selector = '.container-error'){ //form_selector = ".form-group"
  console.log("***formErrorPlacement... - error: ", error, "element: ", element)
  console.log("initial clean: ", element.closest(form_selector).find(error_container_selector))
  element.closest(form_selector).find(error_container_selector).html('')
  error.appendTo(element.closest(form_selector).find(error_container_selector));
  console.log("error-p: ", error, element)
  if ( error && error.length ){
    console.log("error-visible: ", error.is(":visible"), $(error).parents("[aria-expanded='false']"), $(error).parents("[aria-expanded=false]"), $(error).parents("[aria-expanded]"), $(error).parents("div.collapse"), $(error).parent());
    //TODO: add logic for error in another tab-pill tab
    if (!error.is(":visible") && $(error).parents("div.collapse").length){
      let accordion_card_id = $(error).parents("div.collapse").attr("id");
      let accordionindex = 1;
      let accordion_id = $(error).parents("div.collapse").data("parent")
      $(error).parents("div.card-accordion").find(".card-header[data-toggle]").each(function(element){
        console.log("accordion_card_id: ", accordion_card_id, $(this).data("target"));
        if (accordion_card_id == $(this).data("target").toString().replace("#", ""))
        {
          $(this).click();
          return false;
        }
        accordionindex = accordionindex + 1
      })
      console.log("target: ", accordionindex, accordion_card_id);
      //$(accordion_id).accordion('activate', accordionindex ); //.tabCollapse();//      .click();
    }
    error.focus();
  }
  if ( rules && Object.keys(rules).length && !Object.keys(rules).includes($(element).attr('name')) )
    console.warns("WARNING: error in a field out of defined rules, please review if the field has 'blank=True' defined in the model, this produce unexpected validation and render element as 'required' when using forms.py ...")
}




//*** VALIDATORS ***/

function emailEndsWith(host, ends){
  let value = false;
  value = ends.some(element => {
    return host.endsWith(element);
  });
  //console.log(value);
  return value;
};

function valid_domain(value, element, invalid_domains = []) {
  if (value.length == 0) { return true; }
  
  console.log("value",value)
  if (invalid_domains && invalid_domains.length && emailEndsWith(value, invalid_domains)) {
  //if (value.endsWith('@gmail.com')) {
    //app_vue.emailcorp = '0'; 
    return false;
  }
  else{
    //app_vue.emailcorp = '1'
    return true;
  }
}

function valid_email(value, element, message = 'Ingresa un email válido'){
  console.log("-valid_email: ", value);
  if (value.length == 0) { return true; }
  return value.match(/^[a-zA-Z0-9_\.%\+\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/); //true //
}

function valid_phone(value, element, message = 'Ingresa un teléfono válido'){
  console.log("-valid_phone: ", value, value.match(/^[0-9\+]{1}[0-9\s]{5,}/));
  if (value.length == 0) { return true; }
  return value.match(/^[0-9\+]{1}[0-9\s]{5,}/); //true //
}

function valid_url(val, elem, message = null){
  // if no url, don't do anything
  if (val.length == 0) { return true; }
  
  // if user has not entered http:// https:// or ftp:// assume they mean http://
  if(!/^(https?|ftp):\/\//i.test(val)) {
      val = 'https://'+val; // set both the value
      $(elem).val(val); // also update the form element
  }
  
  result = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(val);
  //if (!result){
  //    message = message ? message : 'formato invalido';
  //    $.validator.messages.valid_url = message;
  //}

  // now check if valid url
  // http://docs.jquery.com/Plugins/Validation/Methods/url
  // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
  return result
}

function valid_company_nif(nif, elem, message = null){
  var text = $(elem).val();
  if (text.length == 0) { return true; }
  text = text.replace(".", "").replace(".", "");
  $(elem).val(text);

  if (!/^[a-zA-Z]{0,4}[0-9]{6,}(?:-[0-9kK]{1})?$/.test(nif))
      return false;
  return true;
}

function cl_valid_company_rut(rutCompleto, elem, message = null){
  result = valid_company_nif(rutCompleto, elem, message = null)
  if (!result){ return false; }
  
  //No se permite inscribir Usuarios con Rut igual o mayor a 50.000.000.
  var tmp = rutCompleto.split('-');
  var digv = tmp[1];
  var rut = tmp[0];
  if (digv == 'K') digv = 'k';
  result = (cl_valid_company_rut_dv(rut) == digv)
  
  return result;
}

function cl_valid_company_rut_dv(T){
  var M = 0,
      S = 1;
  for (; T; T = Math.floor(T / 10))
      S = (S + T % 10 * (9 - M++ % 6)) % 11;
  return S ? S - 1 : 'k';
}

function non_empty_form(element, message = 'Selecciona un elemento'){
  console.log("non_empty_form: ", element);
  return $(element).find(":input, :text, :file, :checkbox, select, textarea").length == 0 ? false : true;
}


$.validator.addMethod("valid_url", function (val, elem) {
  return valid_url(val, elem);
}, 'Ingresa una url válida');

$.validator.addMethod("valid_domain", function (value, element) {
  var is_valid_domain = valid_domain(value, element);
  app_vue.emailcorp = is_valid_domain ? "1" : "0";
  return is_valid_domain;
}, 'Ingresa un dominio válido');

$.validator.addMethod("valid_email", function(value, element, param) { //
  console.log("valid-email-1...");
  return valid_email(value, element); //, app_vue.invalidD //value.match(/^[a-zA-Z0-9_\.%\+\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/); //true; //
}, 'Ingresa un email válido');

$.validator.addMethod("valid_phone", function(value, element, param) { //
  console.log("valid_phone-method...", value);
  return valid_phone(value, element); //, app_vue.invalidD //value.match(/^[a-zA-Z0-9_\.%\+\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/); //true; //
}, 'Ingresa un teléfono válido');

$.validator.addMethod("valid_company_rut", function (val, elem) {
  result = valid_company_nif(val, elem);
  if (!result) {$.validator.messages.valid_company_rut = "NIF o Rut invalido.";}
  return result;
}, 'Ingrese un rut de empresa válido');


function valid_selection(val, elem, message = null){
  console.log("***valid_selection: ", val, elem)
  //result = $(elem).find("option:selected").val();
  //console.log("selected-vs: ", result);
  result = val == "O0" ? false : true;
  return result
}

$.validator.addMethod("valid_selection", function (val, elem) {
  result = valid_selection(val, elem);
  if (!result) {$.validator.messages.valid_selection = "Debe seleccionar una opción valida";}
  return result;
});

function is_checked(val, elem, message = null){
  console.log("***is_checked: ", val, elem)
  result = val ? false : true;
  return result
}

$.validator.addMethod("is_checked", function (val, elem) {
  result = is_checked(val, elem);
  if (!result) {$.validator.messages.valid_selection = "Confirmación requerida";}
  return result;
});


function only_numbers(val, elem, message = null){
  console.log("***only_numbers: ", val, elem)
  if (val.length == 0) { return true; }
  result = false
  if(/\d+/i.test(val) && !val.toString().startsWith("0"))
    result = true
  return result
}

$.validator.addMethod("only_numbers", function (val, elem) {
  result = only_numbers(val, elem);
  if (!result) {$.validator.messages.valid_selection = "Debe ingresar un número valido";}
  return result;
}, "Debe ingresar un número valido");


function loadTagit(jq_selector, name, availableTags, assignedTags = [], allow_new_tags = true, return_ids = true, tag_keys = {"label": "name", "value": "name", "id": "id"}){
  console.log("******** load_tagit ***********", jq_selector, name, return_ids, allow_new_tags)

  var tags = []
  console.log("availableTags.length: ", availableTags.length, "loading: ", typeof tags)
  for (var i = 0; i < availableTags.length; i++) {
    //tags.push(response.allTagsDesc[i].name)
    if (return_ids){
      tags.push({
        label: availableTags[i].name,
        value: availableTags[i].name,
        id: availableTags[i].id
      });
    }
    else if(availableTags[i].constructor === String)
      tags.push(availableTags[i])
    else
      tags.push(availableTags[i].name)
  }
  
  if (return_ids){
    //console.log("return_ids: ", return_ids)
    window[name] = {"availableTags": tags, "assignedTags": []}
    
    params = {
        //availableTags: availableTags,
        allowSpaces: true,
        tagSource: function (request, response) {
          console.log("tagSource...")
          //console.log("tagSource: ", name, request, response, "$.ui: ", $.ui)
          //setup the search to search the label
          var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term.toString()), "i");
          response($.grep(window[name].availableTags, function (value) {
            return matcher.test(value.label);
          }));
          //console.log("tagSource2 finish...", name)
        },
        beforeTagAdded: function(event, ui){
          console.log("beforeTagAdded...")
          //get id for that tag and signal if it was in the tagSource list
          var id, result = false;
          //console.log("beforeTagAdded-ui: ", name, ui)
          
          $.each(window[name].availableTags, function(){
            if(ui.tagLabel === this.label){
              result = true;
              id = this.id;
              return false;
            }
          });
          
          console.log("beforeTagAdded-result: ", name, result)
          if(result){
            console.log("f(result)", id);
            //put id in the list of ids we are using
            window[name].assignedTags.push(id);
          }
          else if (allow_new_tags){
            console.log("else if (allow_new_tags)");
            window[name].assignedTags.push(ui.tagLabel); 
            result = true;
          }
          console.log("result: ", result)
          return result;
        },
        afterTagAdded: function(event, ui){
          console.log("afterTagAdded...")
          //replace the values in the single input field with the assigned ids
          $(jq_selector).val(window[name].assignedTags.join(','));
        },
        afterTagRemoved: function(event, ui){
          console.log("afterTag removed...")
          $(jq_selector).val(window[name].assignedTags.join(','));
        },
        beforeTagRemoved: function(event, ui){
          console.log("beforeTagremoved...")
          var id, result = false;
          //get the id for the removed tag and signal if it was in the tagSource list
          $.each(window[name].availableTags, function(){
            if(ui.tagLabel === this.label){
              result = true;
              id = this.id;
              return false;
            }
          });
          
          //console.log("beforeTagRemoved-result: ", name, result)
          if(result){
            //remove the unassigned tag's id from our list
            window[name].assignedTags = $.grep(window[name].assignedTags, function(el){
                return el != id;
            });
          }
        }
    }
  }
  else{
    console.log("tagit-tags: ", tags);
    if (allow_new_tags){
      params = {
        availableTags: tags,
        allowSpaces: true
      };
    }
    else{
      params = {
        availableTags: tags,
        allowSpaces: true,
        beforeTagAdded : function(event, ui) {
            if(this.availableTags.indexOf(ui.tagLabel) == -1){
                return false;
            }
        }
      };
    }
  }
  
  
  $(jq_selector).tagit(params);
  $(jq_selector).attr("windowsname", name);
  $(jq_selector).on("assignedTags", function(i = null){
    if (!i)
      return window[name]["assignedTags"];
    else
      return window[name]["assignedTags"][i];
  });

  if (assignedTags && assignedTags.length){
    console.log("loading assignedTags...")
		$.each(assignedTags, function (i, v) {
      var val = (typeof v === 'string') ? v : v.name
			$(jq_selector).tagit("createTag", val);
		});
  }
  console.log("TRIGGERING: ", $(jq_selector).attr("id")+"_load_finish")
  $(document).trigger($(jq_selector).attr("id")+"_load_finish")
}


Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key))
}

function introJsInit(){
  var introJs_ = introJs().setOption('showProgress', true).start();
  introJs_.oncomplete(introJsSetSkip);
  introJs_.onexit(introJsSetSkip);
}

function introJsSetSkip(){ 
  var skip_introjs = window.localStorage.getObj("skip_introjs")
  var pathname = window.location.pathname
  console.log("skip_introjs2: ", skip_introjs)
  if (!skip_introjs)
      skip_introjs = [pathname]
  else
      skip_introjs.push(pathname)
  window.localStorage.setObj("skip_introjs", skip_introjs);
}

function introJsSkip(){
  var skip_introjs = window.localStorage.getObj("skip_introjs")
  var result = skip_introjs && skip_introjs.includes(window.location.pathname)
  console.log("skip_introjs: ", skip_introjs, result)
  return result
}


function confirmAlert(title, text, callback = null, data_params = null, trigger_event_on_finish = null, cancel_text = "Cancelar", ok_text = "Aceptar", allowOutsideClick = false, icon = 'warning'){
  console.log("***confirm_alert... - callback", callback, "title: ", title)
  let result = null
  
  swal.fire({
    title: title,
    text: text,
    type: icon,
    allowOutsideClick: allowOutsideClick,
    icon: icon,
    showCancelButton: true,
    cancelButtonText: cancel_text,
    //confirmButtonColor: '#3085d6',
    //cancelButtonColor: '#d33',
    confirmButtonText: ok_text
  }).then((result_) => {
    console.log("+result confirm-alert: ", result_)
    //result_ = result_  result_.hasOwnProperty("dismiss")
    
    if (!result_ || Object.keys(result_).includes("dismiss")){
      console.log("result-to: false...")
      result = false
    }
    else if (callback && typeof callback === "function"){
      console.log("confirm callback...", result_)
      data_params = data_params ? data_params : result_
      result = callback(data_params, result_)
    }
    else if (callback == "refresh"){
      location.reload();
    }
    else{
      result_ = true
      result = true
    }
    
    if (trigger_event_on_finish){
      let event = trigger_event_on_finish.replace("#", "") + "_confirmation_alert";
      console.log("TRIGGERING CONFIRMATION ALERT: ", trigger_event_on_finish, "event: ", event, "result_: ", result_)
      $(trigger_event_on_finish).trigger(event, result)
    }
  });
  
  //console.log("+result-ca: ", result)
  //return result
}

function messageAlert(title, text, icon = 'success', refresh_page = false, cancel_text = null, ok_text = "Aceptar", allowOutsideClick = false, callback = null){
  console.log("***message_alert lunch...", text); //cancel_text = "Cancelar"
  class_name = icon == 'success' ? 'btn btn-sm' : 'btn btn-default';
  
  var params = {
    type: icon,
    title: title,
    text: text,
    //icon: icon,
    showCloseButton: false,
    showCancelButton: cancel_text ? true : false,
    allowOutsideClick: allowOutsideClick,
    allowEscapeKey: cancel_text ? true : false,
    allowEnterKey: cancel_text ? false : true,
    buttons: {
        cancel: {
            text: cancel_text,
            value: false,
            visible: cancel_text ? true : false,
            className: class_name,
            closeModal: true,
        }
    }
  }

  if (cancel_text){
    params["buttons"]["confirm"] = {
      text: ok_text,
      value: true,
      visible: true,
      className: 'btn btn-success',
      closeModal: true
    }
  }
  
  
  swal(params).then((result) => {
    console.log("result: ", result)
      if (result) {
        console.log("refresh_page-1: ", refresh_page);
        if (refresh_page){
          console.log("refresh_page-2: ", refresh_page, typeof refresh_page, refresh_page.toString().startsWith("#form"));
          if (typeof refresh_page === 'boolean')
            location.reload(true) //  
          else if(typeof refresh_page === 'function')
            refresh_page(result)
          else if(refresh_page.toString().startsWith("#form")){
            console.log("submit form...");
            $(refresh_page).submit();
          }
          else{
            console.log("normal redirect...")
            window.location.href = refresh_page
          }
        }
      }
  })
}



function getAllInputVals(class_){
  let data = []
  $('#form input.'+class_).each(function(i) {
      //console.log("loc-i", i, this)
      data.push($(this).val());
  });

  return data
}

/*
function loadSmartWizard2(jq_selector = '#smartwizard', leaveStepFunction = null, on_finish_callback = null, form_id = "#form", min_high = true, selected_step = 1, extended_toolbar = true, vue_var = null, final_step = null, step_suffix = 'step-') {
  console.log("***loadSmartWizard: ", $(jq_selector), selected_step);
  //"use strict";
  
  //CHECK TAB HEADERS
  // Main container element
  var main = $(jq_selector);
  let n;
  if (!$(jq_selector).length)
    console.warn("WARNING: loadSmartWizard container not found...");
    
  // Navigation bar element
  var nav = main.children('ul');
  console.log("main: ", main, "nav: ", nav, $(nav).length, selected_step);
  if (!nav || !$(nav).length){
    nav = `
    <!-- dummy for smartwizards -->
    <ul style="visibility: hidden;" class="nav">
    `
    n = 1;
    while ($(jq_selector).find("div[data-step='"+n.toString()+"'], div[id='"+step_suffix.toString()+n.toString()+"']").not('.sw-toolbar').length) {
      nav = nav + `
      <li class="nav-item"><a href="#step-`+n.toString()+`" style="visibility: hidden;"></a></li>`;
      n ++;
    }
    nav = nav + `
    </ul>
    <!-- dummy for smartwizards -->
    `
    console.log("Info: no tabs for smartwizard, adding dummy.", nav, n);
    //console.log("dummy nav: ", nav)
    $(jq_selector).prepend(nav);
  }
  
  var toolbar_style = 'btn-toolbar sw-toolbar sw-toolbar-bottom justify-content-end mr-2';
  if (extended_toolbar)
    toolbar_style = toolbar_style + ' btn-group';
  
  console.log("selected_step: ", selected_step);
  $(document).ready(function () {
    $(jq_selector).smartWizard({ 
      selected: 0, //selected_step-1, // Initial selected step, 0 = first steps
      theme: 'default',
      autoAdjustHeight: min_high, // Automatically adjust content height
      transitionEffect: '', //slide
      transitionSpeed: 0,
      useURLhash: false,
      showStepURLhash: false,
      enableFinishButton: true,
      keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
      toolbarSettings: {
        toolbarPosition: 'bottom',
        toolbarExtraButtons: [
          $('<button id="btn_final_submit"></button>').text('Finalizar')
            .addClass('btn btn-primary btn-indigo btn-lg ')
            .on('click', function(){
              console.log("form_id: ", form_id);
              if (typeof form_id === "string"){
                var res = $(form_id).parsley().validate();
                var ok = $('.parsley-required').length === 0;
                console.log("ok: ", ok, "res: ", res);
                
                if (ok && res){
                  $(jq_selector).find('.btn-primary').attr("disabled", true);
                  $(jq_selector).find('.btn-primary').submit()
                  if (on_finish_callback && typeof on_finish_callback === "function"){
                    console.log("on_finish_callback...", on_finish_callback);
                    on_finish_callback();
                  }
                  console.log("ok - res...");
                }
                else
                  $('parsley:field:error').focus();
              }
              else{
                let stepNumber = $(jq_selector).find("div[data-step]").not('.sw-toolbar').last().data("step");
                stepNumber = stepNumber ? parseInt(stepNumber) - 1 : stepNumber;
                console.log("stepNumber-f: ", stepNumber)
                res = formSubmitValidation_(form_id, jq_selector, stepNumber, "forward", vue_var);
                console.log("final res: ", res);
                if (res && on_finish_callback && typeof on_finish_callback === "function")
                  on_finish_callback();
              }
              
            })
        ]
      },
      lang: {
        next: 'Siguiente',
        previous: 'Anterior'
      },
      style: { // CSS Class settings
        btnCss: 'btn btn-secondary btn-indigo btn-lg', //default: sw-btn
        btnNextCss: 'sw-btn-next',
        btnPrevCss: 'sw-btn-prev',
        toolbarCss: toolbar_style, //default: toolbar sw-btn-group
        toolbarPrefixCss: 'toolbar-',
      }
    });
    
    var buttons_ = $(jq_selector).find('.sw-toolbar');
    console.log("buttons_.length: ", buttons_.length);
    
    function formSubmitValidation_(form_id, jq_selector, stepNumber, direction = "forward", vue_var = null){
      console.log("***formSubmitValidation_: ", jq_selector, stepNumber, direction, form_id)
      let res = false;
      //let next_step_number = direction == "backward" ? parseInt(stepNumber) : parseInt(stepNumber) + 1;
      let current_step = parseInt(stepNumber) + 1;
      let element = $(jq_selector).find("div[data-step='"+(current_step).toString()+"'], div[id='"+(current_step).toString()+"']").not('.sw-toolbar').first();
      element = !element && $(jq_selector).find("div[data-step='"+(current_step).toString()+"']").not('.sw-toolbar').length ? $(jq_selector).find("div[data-step]").not('.sw-toolbar').slice(current_step, current_step+1) : element;
      console.log("element-lsf: ", stepNumber, current_step, element, buttons_); //$(element).attr("style"), current_step, 
      
      if (form_id && typeof form_id === "string" && $(form_id).length){
        var has_group_validation = $(form_id).find("[data-parsley-group]").length; //?  : '';
        res = has_group_validation ? $(form_id).parsley().validate(step_suffix + (stepNumber)) : $(form_id).parsley().validate();
        console.log("validation result: ", res, "has_group_validation: ", has_group_validation);
      }
      else if (buttons_.length > 1){
        
        let form = $(element).find("form").first();
        console.log("form-lsw: ", form, form.attr("id"), element);
        
        if (!form_id){
          
          let form_change = true;
          console.log("form id: ", form.attr("id"));
          if (serialized_forms && $(form).length && form.attr("id") && Object.keys(serialized_forms).includes("#"+form.attr("id").toString())){
            let origForm = serialized_forms["#"+form.attr("id")];
            form_change = form.serialize() !== origForm;
            console.log("form.serialize: ", form.serialize(), origForm);
          }
          
          console.log("form_change: ", form_change);
          res = true;
          if (form_change){
            res = form.submit(); //form.validate();
            //form.validate();
            console.log("form: ", form, form_id);
            res = !form.hasOwnProperty("errorList") || form.errorList.length == 0 ? true : false;
          }
          
        }
        else if(typeof form_id === "object" && Object.keys(form_id).length){
          
          if (Object.keys(form_id).includes(form.attr("id"))){
            
            let options = form_id[form.attr("id")];
            console.log("options-lsw: ", options);
            
            if (Object.keys(options).includes("rules") && typeof options["rules"] === "object"){
              res = form.submit();
              console.log("validate res-lsw-1: ", res); //, res_);
              res = form.validate().errorList.length == 0 ? true : false;
            }
          }
        }
        else {
          console.log("Info: no form for smartwizard.");
          res = true;
        }
      }
      
      return res;
    }
    
    $(jq_selector).find(".btn-secondary").addClass("btn btn-indigo btn-lg ");
    $(jq_selector).find(".sw-btn-group-extra").hide();
    $(jq_selector).find(".btn-primary").attr("disabled", true);
    
    if (!leaveStepFunction || typeof leaveStepFunction !== "function")
      function leaveStepFunction(e, anchorObject, currentStepIndex, nextStepIndex, stepDirection){ //
        
        console.log("***leaveStep: ", currentStepIndex, nextStepIndex, stepDirection, form_id, step_suffix, $(form_id).find("[data-parsley-group]"), $(form_id).find("[data-parsley-group]").length); //stepNumber, 
        res = true;
        console.log("real current-step: ", $(jq_selector).find("ul.nav-tabs").find("li.active").length, stepNumber);
        
        if (stepDirection == "forward")
          res = formSubmitValidation_(form_id, jq_selector, stepNumber, stepDirection, vue_var);
        console.log("+res-2: ", res, stepDirection);
        return res;
      }
    
    console.log("SET leaveStepFunction...");
    $(jq_selector).on('leaveStep', leaveStepFunction);
    
    //SHOW-STEP
    $(jq_selector).on("showStep", function(e, anchorObject, stepNumber, stepDirection) {
      console.log("***showStep...", stepNumber, stepDirection, $('button.sw-btn-next').hasClass('disabled'));
      
      //SHOW-HIDE FINISH-EXTRA-BUTTON
      if($(jq_selector).find('button.sw-btn-next').hasClass('disabled')){
        console.log("final button detected...");
        $(jq_selector).find('.btn-primary').attr("disabled", false);
        $(jq_selector).find('button.sw-btn-next').hide();
        $(jq_selector).find('.sw-btn-group-extra').show(); // show the button extra only in the last page
      }else{
        console.log("not final button detected...");
        $(jq_selector).find('.sw-btn-group-extra').attr("disabled", true);
        $(jq_selector).find('.sw-btn-group-extra').hide();
        $(jq_selector).find('button.sw-btn-next').show();			
      }
      
      console.log("showStep-end...");
    });
    
  });
  console.log("showStep-end-2...");
};
*/

function form_has_changes(jq_selector){
  let form_change = true;
  let form = $(jq_selector);
  let isEmptyForm_ = isEmptyForm(jq_selector);
  let isDisabledForm_ = isDisabledForm(jq_selector);
  // && !isDisabledForm_
  
  console.log("***form_change: ", form.attr("id"), isEmptyForm_, form.attr("id"), Object.keys(serialized_forms).includes("#"+form.attr("id").toString()));
  if (!isDisabledForm_ && serialized_forms && $(form).length && !isEmptyForm_ && form.attr("id") && Object.keys(serialized_forms).includes("#"+form.attr("id").toString())){
    
    let origForm = serialized_forms["#"+form.attr("id")];
    form_change = form.serialize() !== origForm;
    console.log("if-compare-fs: ", form_change, form, form.serialize());
    
    if (form_change)
      serialized_forms["#"+form.attr("id")] = form.serialize();
    console.log("form.serialize: ", form.serialize(), "origForm: ", origForm);
  }
  else
    form_change = isDisabledForm_ ? false : form_change;
  
  console.log("+res form_change: ", form_change);
  return form_change
}

//http://techlaboratory.net/jquery-smartwizard
function loadSmartWizard(jq_selector = '#smartwizard', leaveStepFunction = null, on_finish_callback = null, on_show_callback = null, min_high = true, selected_step = 1, vue_var = null, options = null, form_id = "#form", extended_toolbar = true, final_step = null, step_suffix = 'step-') {
  console.log("***loadSmartWizard: ", $(jq_selector), selected_step, vue_var);
  //"use strict";
  
  //CHECK TAB HEADERS
  // Main container element
  var main = $(jq_selector);
  let n;
  if (!$(jq_selector).length)
    console.warn("WARNING: loadSmartWizard container not found...");
  
  //SET DIV-STEPS
  let i = 1;
  $(jq_selector).find(".sw-step").each(function(element, index){
    $(this).attr("data-step", i);
    i++;
  });
  
  // Navigation bar element
  var nav = main.children('ul');
  console.log("main: ", main, "nav: ", nav, $(nav).length, selected_step);
  if (!nav || !$(nav).length){
    nav = `
    <!-- START - DUMMY HEADERS FOR SMARTWIZARDS -->
    <ul style="visibility: hidden;" class="nav-tabs">
    `
    n = 1;
    while ($(jq_selector).find("div[data-step='"+n.toString()+"'], div[id='"+step_suffix.toString()+n.toString()+"']").not('.sw-toolbar').length) {
      nav = nav + `
      <li><a href="#step-`+n.toString()+`" style="visibility: hidden;"></a></li>`;
      n ++;
    }
    nav = nav + `
    </ul>
    <!-- FINISH - DUMMY HEADERS FOR SMARTWIZARDS -->
    `
    console.log("Info: no tabs for smartwizard, adding dummy.", nav, n);
    //console.log("dummy nav: ", nav)
    $(jq_selector).prepend(nav);
  }
  /*else if (!$(jq_selector).find("div[data-step]").length) {
    n = 1;
    while ($(jq_selector).find("div[id='"+step_suffix.toString()+n.toString()+"']").not('.sw-toolbar').length) {
      $(jq_selector).find("div[id='"+step_suffix.toString()+n.toString()+"']").not('.sw-toolbar').first().attr("data-step", n);
      n ++;
    }
  }*/
  
  //SKIP COMPLETED FORM-STEPs with sw-skip-on-complete prop
  let element_selector = "input, select, textarea";
  let completed = 0
  let selected_step_ = selected_step;
  let skip_on_complete = $(jq_selector).find("[data-step='"+selected_step+"']").attr("sw-skip-on-complete");
  let step_completed = true;
  console.log("skip_on_complete: ", skip_on_complete);
  
  while (skip_on_complete && skip_on_complete.length && step_completed){
    let form_inputs = $("#company_form").find(element_selector).not("[type='hidden']")
    $(form_inputs).each(function(element){
      let value_ = this.nodeName.toLowerCase() == "select" ? $(this).find(":selected").text() : $(this).val();
      console.log("$(this).tagName: ", this.nodeName.toLowerCase(), "value_: ", value_, value_.toString().length, ["all", "All", "--"].includes(value_));
      if (value_ && value_.length && !["all", "All", "--"].includes(value_))
        completed = completed + 1
      console.log("completed: ", completed);
    });
    console.log("form_inputs.length: ", $(form_inputs).length, completed, selected_step, vue_var.current_step, vue_var.form_step_save);
    step_completed = selected_step_ == $(form_inputs).length ? true : false;
    if (step_completed){
      //vue_var.current_step = app_vue.current_step + 1;
      //vue_var.form_step_save = app_vue.form_step_save + 1;
      selected_step_ = selected_step_ + 1
      skip_on_complete = $(jq_selector).find("[data-step='"+selected_step_+"']").attr("sw-skip-on-complete");
    }
    console.log("step-it-result: ", step_completed, vue_var.form_step_save, skip_on_complete);
  }
  
  selected_step = selected_step_;
  try{
    vue_var.current_step = app_vue.current_step + selected_step_;
    vue_var.form_step_save = app_vue.form_step_save + selected_step_;
    console.log("step-complete-result: ", vue_var.current_step, vue_var.form_step_save, selected_step);
  } catch (e) {}
  
  
  
  function getCurrentActiveStep(jq_selector) {
    let active_step = 1;
    $(jq_selector).find("ul.nav-tabs").find("li").each(function(i, el){
      console.log("this: ", this, el, $(this).hasClass("active"), $(el).hasClass("active"));
      if ($(this).hasClass("active"))
        return false; // breaks
      else
        active_step++;
    })
    console.log("active_step: ", active_step);
    return active_step;
  }
  
  function formSubmitValidation_(form_id, jq_selector, stepNumber, direction = "forward", vue_var = null){
    console.log("***formSubmitValidation_: ", jq_selector, form_id, stepNumber, direction, form_id)
    let res = false;
    //let next_step_number = direction == "backward" ? parseInt(stepNumber) : parseInt(stepNumber) + 1;
    form_id = typeof form_id === 'string' && !form_id.startsWith("#") ? "#"+form_id : form_id;
    let current_step = parseInt(stepNumber) + 1;
    let element = $(jq_selector).find("div[data-step='"+(current_step).toString()+"'], div[id='"+(current_step).toString()+"']").not('.sw-toolbar').first();
    element = !element && $(jq_selector).find("div[data-step='"+(current_step).toString()+"']").not('.sw-toolbar').length ? $(jq_selector).find("div[data-step]").not('.sw-toolbar').slice(current_step, current_step+1) : element;
    console.log("element-lsf: ", stepNumber, current_step, element, buttons_); //$(element).attr("style"), current_step, 
    var buttons_ = $(jq_selector).find('.sw-toolbar');
    var has_group_validation = $(form_id).find("[data-parsley-group]").length != 0 ? true : false; //?  : '';
    console.log("buttons_.length-2: ", buttons_.length, has_group_validation, $(form_id).find("[data-parsley-group]"));
    
    if (form_id && typeof form_id === "string" && $(form_id).length && has_group_validation){
      res = has_group_validation ? $(form_id).parsley().validate(step_suffix + (stepNumber)) : $(form_id).parsley().validate();
      console.log("validation result: ", res, "has_group_validation: ", has_group_validation);
    }
    else { //if (buttons_.length > 1){
      
      let form = $(element).find("form").first();
      console.log("form-sw: ", form, form_id, $(form_id), (!form || !form.length), (form_id && $(form_id).length));
      form = (!form || !form.length) && (form_id && $(form_id).length) ? $(form_id) : form;
      console.log("form-sw-2: ", form, form.attr("id"), form.length, element);
      
      if (form && form.length){ //!form_id || !$(form_id).length
        
        //TODO: auto-filter on file-upload cards
        res = form.length && !form.hasClass("smartwizard-exclude-submit") ? form.valid() : true;
        console.log("rules-validation: ", res, form.attr("id"), form.length && !form.hasClass("smartwizard-exclude-submit"));
        if (res && !form.hasClass("smartwizard-exclude-submit")){
          
          console.log("rules-ok: ", form, form.attr("id"));
          let form_change = form.length ? form_has_changes(form) : false;
          
          if (form_change){
            form.submit(); //form.validate(); res = 
            res = (!form.hasOwnProperty("errorList") || form.errorList.length == 0) && form.find(".error:visible").length == 0 ? true : false;
            //res = true
            console.log("+res-1 form-submit: ", form, res, form.hasOwnProperty("errorList"), form.errorList, form.find(".error").length, form.find(".error"));
          }
          
        }
        
      }
      /*else if(typeof form_id === "object" && Object.keys(form_id).length){
        
        if (Object.keys(form_id).includes(form.attr("id"))){
          
          let options = form_id[form.attr("id")];
          console.log("options-lsw: ", options);
          
          if (Object.keys(options).includes("rules") && typeof options["rules"] === "object"){
            res = form.submit();
            console.log("validate res-lsw-1: ", res); //, res_);
            res = form.validate().errorList.length == 0 ? true : false;
          }
        }
      }*/
      else {
        console.log("Info: no form for smartwizard.");
        res = true;
      }
    }
    
    console.log("+res-2 form-submit: ", res);
    return res;
  }
  
  var toolbar_style = 'btn-toolbar sw-toolbar sw-toolbar-bottom justify-content-end mr-2';
  if (extended_toolbar)
    toolbar_style = toolbar_style + ' btn-group';
  
  var extra_btns = $(jq_selector).find('button.extra-btn');
  if (extra_btns.length){
    $(extra_btns).each(function(i, el){
      $(el).addClass('btn btn-primary btn-indigo btn-lg ')
    });
    console.log("extra_btns: ", extra_btns, typeof extra_btns);
    extra_btns = extra_btns.get();
    console.log("extra_btns-2: ", extra_btns, typeof extra_btns);
  }
  else {
    
    function on_submit_click_callback(index_, element_){
      console.log("form_id: ", form_id);
      
      if (!$(form_id).length)
        console.log("INFO: default form_id not found...", form_id);
      if (typeof form_id === "string" && $(form_id).length){
        var res = $(form_id).parsley().validate();
        var ok = $('.parsley-required').length === 0;
        console.log("ok: ", ok, "res: ", res);
        
        if (ok && res){
          $(jq_selector).find('.btn-primary').attr("disabled", true);
          $(jq_selector).find('.btn-primary').submit()
          if (on_finish_callback && typeof on_finish_callback === "function"){
            console.log("on_finish_callback...", on_finish_callback);
            on_finish_callback();
          }
          console.log("ok - res...");
        }
        else
          $('parsley:field:error').focus();
      }
      else{
        let stepNumber = $(jq_selector).find("div[data-step]").not('.sw-toolbar').last().data("step");
        stepNumber = stepNumber ? parseInt(stepNumber) - 1 : stepNumber;
        console.log("stepNumber-f: ", stepNumber);
        
        function on_submit_callback_(current_step = null){
          res = formSubmitValidation_(form_id, jq_selector, stepNumber, "forward", vue_var);
          console.log("+final res: ", res, typeof on_finish_callback, "current_step: ", current_step);
          if (res && on_finish_callback && typeof on_finish_callback === "function"){
            current_step = !current_step || current_step.constructor == Object ? getCurrentActiveStep(jq_selector) : current_step;
            let step_name = $(jq_selector).find("div[data-step="+current_step+"]").not('.sw-toolbar').attr("stepname");
            console.log("current_step-2: ", current_step, step_name);
            on_finish_callback(current_step, step_name, form_id);
          }
        }
        
        let current_step = getCurrentActiveStep(jq_selector);
        let step_div = $(jq_selector).find("div[data-step='"+current_step.toString()+"'], div[id='"+step_suffix.toString()+current_step.toString()+"']").not('.sw-toolbar').first();
        console.log("step_div: ", step_div, "current_step: ", current_step);
        let submit_btn_confirmation = step_div.prop("sw-submit-btn-confirmation") ? step_div.prop("sw-submit-btn-confirmation") : step_div.attr("sw-submit-btn-confirmation");
        console.log("submit_btn_confirmation: ", submit_btn_confirmation, step_div);
        submit_btn_confirmation = check_attr_from_options(options, current_step, "sw-submit-btn-confirmation", submit_btn_confirmation);
        
        if (submit_btn_confirmation){
          console.log("in-submit_btn_confirmation: ", submit_btn_confirmation);
          let msg = submit_btn_confirmation.toLowerCase() == "true" ? "Está seguro que desea continuar con el proceso?" : submit_btn_confirmation;
          confirmAlert("Confirmación", msg, on_submit_callback_);
        }
        else
          on_submit_callback_(current_step);
        
      }
      
    }
    
    extra_btns = [
      $('<button id="btn_final_submit"></button>').text('Finalizar')
        .addClass('btn btn-primary btn-indigo btn-lg ')
        .on('click', on_submit_click_callback)
    ]
  }
  
  let total_steps = $(jq_selector).children("ul").find("li").length; //.nav-tabs
  selected_step_ = selected_step > total_steps ? total_steps-1 : selected_step-1;
  if (selected_step > total_steps)
    console.warn("WARNING: selected step lower than total steps, auto-correcting max value...");
  selected_step = selected_step > total_steps ? total_steps : selected_step;
  console.log("total_steps: ", total_steps, selected_step, selected_step_);

  $(document).ready(function () {
    $(jq_selector).smartWizard({ 
      selected: selected_step_,
      theme: 'default',
      autoAdjustHeight: min_high, // Automatically adjust content height
      transitionEffect: '', //slide
      transitionSpeed: 0,
      useURLhash: false,
      showStepURLhash: false,
      enableFinishButton: true,
      
      //PARSLEY: some quite advanced configuration here..
      /*errors: {
        defaultMessage: "Este valor parece ser inválido.",
        //classHandler: function ( elem ) {}
        //container: function ( elem, template, isRadioOrCheckbox ) {}
        // ul elem that would receive errors' list
        errorsWrapper: '', //'<div class="container-error"></div>', //'<ul class="parsley-errors-list"></ul>',
        // li elem that would receive error message
        errorElem: '', 
      },*/
      /*listeners: {
        //onFieldValidate: $(jq_selector).validate(), //function ( elem, ParsleyField ) { return false; }
        //, onFormSubmit: function ( isFormValid, event, ParsleyForm ) {}
        //onFieldError: //function ( elem, constraints, ParsleyField ) {}
        //, onFieldSuccess: function ( elem, constraints, ParsleyField ) {}
      }*/
      
      keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
      toolbarSettings: {
        toolbarPosition: 'bottom',
        toolbarExtraButtons: extra_btns,
      },
      lang: {
        next: 'Siguiente',
        previous: 'Anterior'
      },
      style: { // CSS Class settings
        /*mainCss: 'sw',
        navCss: 'nav',
        navLinkCss: 'nav-link',
        contentCss: 'tab-content',
        contentPanelCss: 'tab-pane',
        themePrefixCss: 'sw-theme-',
        anchorDefaultCss: 'default',
        anchorDoneCss: 'done',
        anchorActiveCss: 'active',
        anchorDisabledCss: 'disabled',
        anchorHiddenCss: 'hidden',
        anchorErrorCss: 'error',
        anchorWarningCss: 'warning',
        justifiedCss: 'sw-justified',*/
        btnCss: 'btn btn-secondary btn-indigo btn-lg', //default: sw-btn
        btnNextCss: 'sw-btn-next',
        btnPrevCss: 'sw-btn-prev',
        /*loaderCss: 'sw-loading',
        progressCss: 'progress',
        progressBarCss: 'progress-bar',*/
        toolbarCss: toolbar_style, //default: toolbar sw-btn-group
        toolbarPrefixCss: 'toolbar-',
      }
    });
    
    var buttons_ = $(jq_selector).find('.sw-toolbar');
    console.log("buttons_.length: ", buttons_.length);
    
    $(jq_selector).find(".btn-secondary").addClass("btn btn-indigo btn-lg ");
    $(jq_selector).find(".sw-btn-group-extra").hide();
    $(jq_selector).find(".btn-primary").attr("disabled", true);
    
    function updateContent_(jq_selector, stepNumber, newStepNumber, min_high, vue_var){
      console.log("***updateContent_: ", jq_selector, stepNumber, newStepNumber);
      
      //SHOW-HIDE FINISH-EXTRA-BUTTON
      if($(jq_selector).find('button.sw-btn-next').hasClass('disabled')){
        console.log("final button detected...");
        $(jq_selector).find('.btn-primary').attr("disabled", false);
        console.log("btn-next: ", $(jq_selector).find('button.sw-btn-next'));
        $(jq_selector).find('button.sw-btn-next').hide();
        console.log("btn-extra: ", $(jq_selector).find('.sw-btn-group-extra'));
        
        let submit_btn_text = $(jq_selector).find("div[data-step='"+newStepNumber.toString()+"'], div[id='"+step_suffix.toString()+newStepNumber.toString()+"']").not('.sw-toolbar').first().attr("sw-submit-btn-text");
        console.log(newStepNumber, "submit_btn_text: ", submit_btn_text, $(jq_selector).find("#btn_final_submit").first());
        
        //GET PROPERTY FROM OPTION PARAMS
        submit_btn_text = check_attr_from_options(options, newStepNumber, "sw-submit-btn-text", submit_btn_text);
        console.log(newStepNumber, "submit_btn_text-2: ", submit_btn_text, $(jq_selector).find("#btn_final_submit").first());
        if (submit_btn_text){
          console.log("in-submit_btn_text: ", submit_btn_text);
          $(jq_selector).find("button#btn_final_submit").text(submit_btn_text).html(submit_btn_text);
        }
        
        submit_btn_disabled = check_attr_from_options(options, newStepNumber, "sw-submit-btn-disabled");
        console.log(newStepNumber, "submit_btn_disabled-2: ", submit_btn_disabled, $(jq_selector).find("#btn_final_submit").first());
        if (submit_btn_disabled){
          console.log("in-submit_btn_disabled: ", submit_btn_disabled);
          disableButton($(jq_selector).find("button#btn_final_submit"))
        }
        
        submit_btn_hidden = check_attr_from_options(options, newStepNumber, "sw-submit-btn-hidden");
        console.log(newStepNumber, "submit_btn_hidden-2: ", submit_btn_hidden, $(jq_selector).find("#btn_final_submit").first());
        if (submit_btn_hidden){
          console.log("in-submit_btn_hidden: ", submit_btn_hidden);
          $(jq_selector).find("button#btn_final_submit").hide()
        }
        
        $(jq_selector).find('.sw-btn-group-extra').show(); //show the button extra only in the last page
        
      } else {
        console.log("not final button detected...");
        $(jq_selector).find('.sw-btn-group-extra').attr("disabled", true);
        $(jq_selector).find('.sw-btn-group-extra').hide();
        $(jq_selector).find('button.sw-btn-next').show();			
      }
      
      if (buttons_.length > 1){
        
        if (newStepNumber >= 1){
          $(jq_selector).find("div[data-step='"+newStepNumber+"'], div[id='"+step_suffix+newStepNumber+"']").show();
          console.log("show-2: ", $(jq_selector).find("div[data-step='"+newStepNumber+"'], div[id='"+step_suffix+newStepNumber+"']"), "newStepNumber: ", newStepNumber);
          $(jq_selector).find("div[data-step][data-step!='"+newStepNumber+"']").hide();
          console.log("hide-2: ", $(jq_selector).find("div[data-step][data-step!='"+newStepNumber+"']"));
        }
        
        //CLEAN MIN-HIGH ADDED BY LIBRARY
        /*if (!min_high){
          let steps = $(jq_selector).find("div[data-step]").not('.sw-toolbar');
          console.log("steps: ", steps, stepNumber);
          
          steps.each(function(i, element){
            let elementStepNumber = $(element).data("step");
            console.log("steps-2: ", elementStepNumber, stepNumber, newStepNumber);
            
            //if (elementStepNumber != stepNumber){
              let step = $(jq_selector).find("div[data-step='"+(elementStepNumber).toString()+"'], div[id='"+step_suffix.toString()+(elementStepNumber).toString()+"']").not('.sw-toolbar').first();
              let style_ = $(step).attr("style");
              const re = /min-height\: [^;]+;/;
              style_ = style_.replace(re, "").trim();
              console.log("step-mh: ", step, "style_: ", style_); // Cruz, Maria
              $(step).attr("style", style_);
            //}
          });
        }*/
        
        console.log("vue var: ", vue_var);
        if (vue_var){
          vue_var.current_step = newStepNumber;
          console.log("changing step - current: ", newStepNumber);
        }
        else
          console.log("INFO: No vue_var...", vue_var);
      }
    }
    
    //SET LEAVE FUNCTION
    if (!leaveStepFunction || typeof leaveStepFunction !== "function")
      leaveStepFunction = function(e, anchorObject, stepNumber, stepDirection) { //, currentStepIndex, nextStepIndex, stepDirection){ //
        
        console.log("***leaveStep: ", stepNumber, stepDirection, form_id, step_suffix, $(form_id).find("[data-parsley-group]"), $(form_id).find("[data-parsley-group]").length); //stepNumber, 
        res = true;
        console.log("real current-step: ", $(jq_selector).find("ul.nav-tabs").find("li.active").length, stepNumber);
        
        if (stepDirection == "forward")
          res = formSubmitValidation_(form_id, jq_selector, stepNumber, stepDirection, vue_var);
        console.log("+res: ", res, stepDirection);
        return res;
      }
    
    
    $(jq_selector).on('leaveStep', leaveStepFunction);
    
    
    if (buttons_.length > 1){ 
      console.log("hide: ", $(buttons_).slice(1));
      $(buttons_).slice(1).hide(); 
      
      //CHECK DOM - DOM WARNINGS
      if ($(jq_selector).find("div[data-step='0'], div[id='"+step_suffix.toString()+"0']").not('.sw-toolbar').length)
        console.warn("WARNING: step 0 detected, use 0 as first element...");
      if (!$(jq_selector).find("div[data-step='1'], div[id='"+step_suffix.toString()+"1']").not('.sw-toolbar').length)
        console.warn("WARNING: step 1 not detected, use 1 as first element...");
      
      //SET INITIAL DATA STEP-NUMBER TO BUTTON-TOOLBARS + FORMS
      let n = 1;
      while ($(jq_selector).find("div[data-step='"+n.toString()+"'], div[id='"+step_suffix.toString()+n.toString()+"']").not('.sw-toolbar').length) {
        
        let element = $(jq_selector).find("div[data-step='"+n.toString()+"'], div[id='"+step_suffix.toString()+n.toString()+"']").not('.sw-toolbar').first();
        console.log("setting step for: ", element);
        let element_step = $("div[data-step='"+n.toString()+"']").not('.sw-toolbar').length ? $("div[data-step='"+n.toString()+"']").not('.sw-toolbar').first().data("step") : $("div[id='"+step_suffix.toString()+n.toString()+"']").not('.sw-toolbar').first().attr("id").replace("step-", "");
        console.log("element_step: ", element_step, "slice: ", n-1, $(jq_selector).find(".sw-toolbar").slice(n-1, n)); //$(jq_selector).find(".sw-toolbar"), 
        
        $(jq_selector).find(".sw-toolbar").slice(n-1, n).attr("data-step", element_step);
        $(element).find("form").first().attr("data-step", element_step);
        
        n ++;
      }
      
      //INITIAL CONTENT-LOAD
      console.log("loading: ", selected_step, selected_step_);
      updateContent_(jq_selector, selected_step, selected_step, min_high, vue_var);
      $(jq_selector).trigger("smart_wizard_load_finish")
    }
    
    //SHOW-STEP
    $(jq_selector).on("showStep", function(e, anchorObject, stepNumber, stepDirection) {
      console.log("***showStep...", stepNumber, stepDirection, $('button.sw-btn-next').hasClass('disabled'));
      
      //SHOW-HIDE CONTENT - TOOLBAR-BUTTONS
      let newStepNumber = getCurrentActiveStep(jq_selector);
      //newStepNumber = stepDirection == "forward" ? stepNumber + 1 : stepNumber - 1;
      //newStepNumber = stepNumber <= 1 ? 1 : stepNumber + 1;
      console.log("newStepNumber: ", newStepNumber, stepNumber, stepDirection);
      updateContent_(jq_selector, stepNumber, newStepNumber, min_high, vue_var);
      
      if (on_show_callback && typeof on_show_callback === "function")
        on_show_callback(jq_selector, stepNumber, newStepNumber, min_high, vue_var);
      console.log("showStep-end...");
    });
    
  });
  console.log("showStep-end-2...");
};

function getSmartWizardStep(stepname, jq_selector = "#smartwizard"){
  //var step = null;
  if (typeof stepname !== "string"){
    stepname = $(stepname).parents("[data-stepname]").attr("data-stepname");
  }
  step = $(jq_selector).find("[data-stepname='"+stepname+"']").data("step");
  return step
}


/*** START FORM-CONTROLS */
var all_modalls = []
function loadContentCRUDModal(content_selector = "#content_locations", modal_form_selector = "#formodalnew", rules = {}, on_delete_callback = null, on_action_callback = null, vue_var = null, foreign_key = null, master = {}, exclude_fields = [], on_change_callback = null, preprocess_data_callback = null, postprocess_data_callback = null, delete_class = null, edit_class = null, initial_data = [], callback_is_mutation = true, use_external_action_callback = false, add_select_text_and_val = null, on_close_callback = null, on_open_callback = null){
  console.log("***loadContentCRUDModal - content_selector", content_selector, "modal_form_selector: ", modal_form_selector, "vue_var: ", vue_var, "on_action_callback: ", on_action_callback)
  
  let modal_selector = getModalSelector(modal_form_selector)
  let modal_name = content_selector.includes("_") ? content_selector.split("_")[1] : content_selector;
  modal_name = modal_name.replace("#", "")
  
  if (vue_var == null)
    console.warn("WARNING: empty vue_var param, bad name??...", content_selector, modal_form_selector);
  
  if (master && typeof master === "object" && Object.keys(master).length){
    for (let [jq_selector, vue_var] of Object.entries(master))
      if (!exclude_fields.includes(jq_selector))
        exclude_fields.push(jq_selector.replace("#", ""));
  }
  
  if (!on_action_callback || (on_action_callback && !on_action_callback.toString().includes("mutation"))){
    all_modalls[modal_name] = content_selector;
    add_select_text_and_val = add_select_text_and_val == null ? true : add_select_text_and_val
  }
  else if (add_select_text_and_val == null)
    add_select_text_and_val = false;
  
  callback_is_mutation = callback_is_mutation == true || ((on_delete_callback && typeof on_delete_callback === "function") && on_delete_callback_.toString().includes("mutation"));
  
  edit_class = edit_class ? edit_class : '.edit-'+modal_name;
  delete_class = delete_class ? delete_class : '.remove-'+modal_name;
  console.log("edit_class: ", edit_class, "delete_class: ", delete_class);
  
  //MODAL UNIQUE CheckBox
  let unique_checkbox = $(modal_form_selector).find("input[type='checkbox'].unique_value").first()
  if (unique_checkbox && $(unique_checkbox).length){
    console.log("SETTING CHECKBOX UNIQUE!!!")
    
    $(modal_form_selector).on("crud_create_or_edit_finish_trigger", function(event, _data, loaded_element_id = null) {
      
      console.log("CHECK UNIQUE-CHECKBOX: crud_create_or_edit_finish_trigger - _data:", _data, "loaded_element_id: ", loaded_element_id, "unique_checkbox: ", unique_checkbox, "this.checked: ", $(unique_checkbox).is(":checked"), "unique_checkbox.name: ", unique_checkbox.attr("name"))
      ucheckbox_field_name = unique_checkbox.attr("name") ? unique_checkbox.attr("name") : null;
      let checked = ucheckbox_field_name ? $(unique_checkbox).is(":checked") || _data[ucheckbox_field_name] == 1 || _data[ucheckbox_field_name] == "1" || _data[ucheckbox_field_name] == "true" || _data[ucheckbox_field_name] == 1 : $(unique_checkbox).is(":checked");
      console.log("checked: ", checked, "ucheckbox_field_name: ", ucheckbox_field_name)
      
      if (checked){  
        
        element_id = loaded_element_id ? loaded_element_id : contentCRUDgetId(_data);
        console.log("checked-unique element_id: ", element_id);
        
        if (element_id){
          
          console.log("getting other_inputs for update: ", $(content_selector).find("input[type='hidden']"), unique_checkbox.attr("name"), Number(!$(unique_checkbox).is(":checked")))
          let any_updates = false;
          $(content_selector).find("input[type='hidden']").each(function(index){
            
            let other_input = $(this)
            console.log("other_input: ", other_input)
            
            if (other_input && $(other_input).length && other_input.attr("id") != element_id)
              other_input = updateJSONinputValue(other_input, unique_checkbox.attr("name"), Number(!checked), content_selector)
            else
              console.log("INFO: skip updatejson for unique checkbox with same element_id....")
            
            if (other_input && $(other_input).length){
              $(other_input).attr("updated", true);
              any_updates = true
            }
          });
          
          if (any_updates && on_change_callback && typeof on_change_callback === "function")
            on_change_callback(content_selector, _data, modal_form_selector, "update");
        }
      }
      //$(this).val(this.checked)
      
    });
  }
  
  //MODAL CLOSE BUTTON
  let button_close = $(modal_form_selector).find("button.button_close, a.button_close").first()
  console.log("button_close: ", button_close, "button_close.id: ", button_close.attr("id"))
  $(button_close).unbind();
  $(document).on('click', "#"+button_close.attr("id"), function (event) {
    event.preventDefault();
    if (on_close_callback && typeof on_close_callback === "function")
      on_close_callback(modal_form_selector, modal_selector);
    
    let modal_is_open = isModalOpen(modal_form_selector)
    console.log("modal_is_open-1: ", modal_is_open)
    if (modal_is_open) {
      $(modal_selector).modal('toggle'); //.css('display', 'none');
    }
    
    cleanModal(modal_form_selector, "clean-on-close")
  });
  
  //MODAL OPEN BUTTON
  let button_open = $(content_selector).find(".btn[data-toggle='modal']").first()
  console.log("BUTTON OPEN SET !!!!!", button_open, "id: ", button_open.attr("id"))
  if (!button_open.attr("id"))
    alert("WARNING: MODAL BUTTON-OPEN WITHOUT ID, PLEASE ADD ONE TO TEMPLATE... content_selector: "+content_selector);
  $(document).on('click', "#"+button_open.attr("id"), function () {
    console.log("OPEN CLICKED !!!!!");
    toggleModal(null, modal_form_selector, content_selector, on_open_callback);
  });
  
  //MODAL ACTION / ADD
  let button_action = $(modal_form_selector).find("button.button_action, a.button_action").first()
  console.log("button_action: ", button_action, "button_action.id: ", button_action.attr("id"))
  console.log("use_external_action_callback: ", use_external_action_callback)
  
  if (!use_external_action_callback){
    console.log("enter !use_external_action_callback...!!!")
    
    //SET FORM VALIDATION + SUBMIT-HANDLER
    let node_name = $(modal_form_selector).length ? $(modal_form_selector)[0].nodeName.toLowerCase() : null;
    if (node_name == "form"){
      console.log("form modal detected...", modal_form_selector, "rules: ", rules, "$(modal_form_selector):", $(modal_form_selector))
      console.log("setting rules for form: ", modal_form_selector, rules);
      $(modal_form_selector).validate({
        rules: rules,
        errorPlacement: function (error, element) {
          console.log("errorPlacement-1...", error, element);
          formErrorPlacement(error, element, rules);
        },
        submitHandler: function(form, event_) { 
          console.log("SUBMIT-HANDLER...", form, event_);
          event_.preventDefault();
          let loaded_element_id = $(modal_form_selector).attr("loaded_id");
          console.log("SUBMIT-1 - sending element_id: ", loaded_element_id, "modal_form_selector: ", modal_form_selector, "form: ", form, "on_action_callback: ", on_action_callback);
          _submitModal(loaded_element_id, modal_form_selector, content_selector, add_select_text_and_val, on_action_callback, on_delete_callback = on_delete_callback, callback_is_mutation = callback_is_mutation, vue_var = vue_var, foreign_key = foreign_key, master = master, exclude_fields = exclude_fields, preprocess_data_callback = preprocess_data_callback, postprocess_data_callback = postprocess_data_callback, edit_class = edit_class, delete_class = delete_class, on_change_callback = on_change_callback);
        }
      });
      console.log("submit-1 set...");
      //return false;
    }
    
    //ACTION = "Update" + Create
    $(modal_form_selector).find(button_action).unbind();
    $(modal_form_selector).on('click', "#"+button_action.attr("id"), function (event) {
      event.preventDefault();
      console.log("ACTION CLICK BUTTON: ", modal_form_selector, $(modal_form_selector))
      //event.preventDefault();
      let loaded_element_id = modal_form_selector && $(modal_form_selector).length ? $(modal_form_selector).attr("loaded_id") : null;
      console.log("MODAL ACTION CLICKED!!!! - loaded_element_id: ", loaded_element_id, "modal_form_selector: ", modal_form_selector)
      
      let node_name = $(modal_form_selector).length ? $(modal_form_selector)[0].nodeName.toLowerCase() : null;
      loaded_element_id = $(modal_form_selector).attr("loaded_id");
      let is_creation = !loaded_element_id ? true : false;
      console.log("-IS_CREATION (info-before submit): ", is_creation, loaded_element_id)
      console.log("*********EVENT: pre-submit-loaded_element_id: ", loaded_element_id)
      
      if (node_name == "form"){
        let $form = $(modal_form_selector)
        let form_change = $form.length ? form_has_changes(modal_form_selector) : false;
        if (form_change){
          $form.submit(); //form.validate(); res = 
          res = (!$form.hasOwnProperty("errorList") || $form.errorList.length == 0) && $form.find(".error:visible").length == 0 ? true : false;
          //res = true
          console.log("+res-2 form-submit: ", $form, res, $form.hasOwnProperty("errorList"), $form.errorList, $form.find(".error").length, $form.find(".error"));
        }
        return res;
        /*console.log("form modal detected...", modal_form_selector, "loaded_element_id: ", loaded_element_id, "rules: ", rules, "$(modal_form_selector):", $(modal_form_selector))
        console.log("setting rules for form: ", modal_form_selector, rules);

        $(modal_form_selector).validate({
          rules: rules,
          errorPlacement: function (error, element) {
            console.log("errorPlacement-1...", error, element);
            formErrorPlacement(error, element, rules);
          },
          submitHandler: function(form, event_) { 
            console.log("SUBMIT-HANDLER...", form, event_);
            event_.preventDefault();
            loaded_element_id = $(modal_form_selector).attr("loaded_id");
            console.log("SUBMIT-1 - sending element_id: ", loaded_element_id, "modal_form_selector: ", modal_form_selector, "form: ", form, "on_action_callback: ", on_action_callback);
            _submitModal(loaded_element_id, modal_form_selector, content_selector, add_select_text_and_val, on_action_callback, on_delete_callback = on_delete_callback, callback_is_mutation = callback_is_mutation, vue_var = vue_var, foreign_key = foreign_key, master = master, exclude_fields = exclude_fields, preprocess_data_callback = preprocess_data_callback, postprocess_data_callback = postprocess_data_callback, edit_class = edit_class, delete_class = delete_class, on_change_callback = on_change_callback);
          }
        });
        console.log("submit-1 set...");
        //return false;*/
      }
      else{
        console.log("SUBMIT-2 - sending element_id: ", loaded_element_id, "on_action_callback: ", on_action_callback);
        _submitModal(loaded_element_id, modal_form_selector, content_selector, add_select_text_and_val, on_action_callback, on_delete_callback = on_delete_callback, callback_is_mutation = callback_is_mutation, vue_var = vue_var, foreign_key = foreign_key, master = master, exclude_fields = exclude_fields, preprocess_data_callback = preprocess_data_callback, postprocess_data_callback = postprocess_data_callback, edit_class = edit_class, delete_class = delete_class, on_change_callback = on_change_callback);
      }
      
    });
    console.log("submit set...");
    
    loadFormPlugins(modal_form_selector)
    console.log("LOAD-MODAL-FINISH for: ", content_selector);
  }
  
  //LOAD INPUT-hidden
  console.log("LOADING INPUT-HIDDEN for:", content_selector, "vue_var: ", vue_var)
  if (content_selector || (initial_data && initial_data.length) || vue_var){
    
    let rows = []
    if (initial_data && initial_data.length)
      rows = initial_data;
    else
    rows = vue_var ? vue_var : $(content_selector).children("div");
    console.log("content rows: ", rows, modal_selector)
    
    let any_updates = false;
    for (var i = 0; i < rows.length; i++) {
      let data_ = vue_var ? rows[i] : getElementDataAttrs(rows[i]);
      console.log("INFO-1: LoadMOdal input creation...", data_, rows[i])
      if (data_ && typeof data_ === "object" && Object.keys(data_).length && data_.id && !$(content_selector).children("input[id='"+data_.id.toString()+"']").length){
        console.log("INFO-2: LoadMOdal input creation...", data_, rows[i])
        createJSONinput(data_, content_selector);
        any_updates = true;
      }
    }
    
    if (any_updates && on_change_callback && typeof on_change_callback === "function")
      on_change_callback(content_selector, null, modal_form_selector, "load");
    
    //ALLOW-CLEAR SELECT2
    var allow_clear_selects = $(modal_form_selector).find(".allow-clear");
    if (allow_clear_selects.length)
      loadSelect2(allow_clear_selects, default_value = null);
    
    //CASCADE FILTER
    var detect_cascade_filters = $(modal_form_selector).find(".cascade_filter");
    if (detect_cascade_filters.length)
      loadCascadeFiltering(modal_form_selector);
  }
  
  //REFRESH EDIT-DELETE BUTTONS FROM ALREADY EXISTENT ELEMENTS
  setContentButtonEvents(content_selector, modal_form_selector, delete_class, edit_class, on_delete_callback, null, vue_var = vue_var, callback_is_mutation, on_change_callback = on_change_callback, master = master)
  
  enable_escape_modal_hide()
}

function toggleDisableForm(jq_selector, disable = true, find_selector=null, skip_input_files = false){
  var element_selector = skip_input_files ? "input[type!=file], select, textarea, button" : "input, select, textarea, button"; //[type='submit'], button#btn_final_submit, .btn-del
  console.log("***toggleDisableForm: ", jq_selector, disable, find_selector);
  var elements;
  var sub_elements;
  //var is_disabled = isDisabledForm(jq_selector);
  
  if (find_selector){ //!is_disabled && 
    console.log("typeof: ", typeof find_selector)
    if (typeof find_selector === "function"){
      elements = $(jq_selector).filter(find_selector);
      sub_elements = $(jq_selector).find(element_selector).filter(find_selector);
    }
    else{
      elements = $(jq_selector).find(find_selector).not(":disabled");
      sub_elements = $(jq_selector).find(element_selector).not(":disabled");
    }
  }
  else{
    elements = $(jq_selector).not(":disabled");
    console.log("elements: ", elements, find_selector);
    sub_elements = $(jq_selector).find(element_selector).not(":disabled");
    //console.log("sub_elements: ", sub_elements, element_selector);
    
    //if (){
      let element_selectors = element_selector.split(",");
      
      for (var i = 0; i < element_selectors.length; i++) {
        
        let element_selector_ = element_selectors[i].trim();
        console.log("element_selector_: ", element_selector_, typeof element_selector_);
        
        if ((typeof jq_selector === "string" && jq_selector.includes(element_selector_)) || ($(jq_selector).find(element_selector_).length)){
          console.log("jq_selector.includes(element_selector_)...", element_selector_);
          let sub_elements_ = $();
          
          if ((typeof jq_selector === "string" && (jq_selector.includes("id=") || jq_selector.includes("name="))) ||  $(jq_selector).parent().first().find(element_selector_).length){
            sub_elements_ = $(jq_selector).parent().first().find(element_selector_).not(":disabled");
            //console.log("sub_elements_: ", sub_elements_);
          }
          else{
            sub_elements_ = element_selector.split(element_selector_)[1].split(",")[0].trim() != "" ? element_selector_+element_selector.split(element_selector_)[1].split(",")[0].trim() : element_selector_;
            console.log("else... sub_elements_: ", sub_elements_, element_selector_, element_selector.split(element_selector_), element_selector.split(element_selector_)[1].split(","), sub_elements_);
            sub_elements_ = $(sub_elements_).not(":disabled");
            /*onDetectElement(sub_elements_, function($element){
              console.log("onDetectElement-callback: ", $element, disable);
              $($element).attr("disabled", disable);
            })*/
          }
          //console.log("sub_elements_: ", sub_elements_);
          sub_elements.add(sub_elements_);
        }
        else
          console.log("CHECK: element not includ for disable: ", jq_selector, element_selector_);
      }
    //}
  }
  sub_elements.attr("disabled", disable);
  
  let btn_selector = elements.find("button"); //[type='submit'], button#btn_final_submit, .btn-del
  if (disable)
    disableButton(btn_selector)
  else
    enableButton(btn_selector)
}

function onDetectElement(element_id, callback){
  console.log("***onDetectElement: ", element_id, typeof callback);
  // Select the target node for observing changes
  var targetNode = typeof element_id === "string" ? document.getElementById(element_id) : $(element_id)[0];
  
  // Create a new MutationObserver instance
  var observer = new MutationObserver(function(mutationsList) {
    // Iterate through the mutations
    for (var mutation of mutationsList) {
      // Check if the DOM mutation type is 'childList' or 'attributes'
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        // Call your callback function or perform the desired logic here
        callback(targetNode);
      }
    }
  });
  
  // Configure and start the observer
  var observerConfig = { childList: true, attributes: true, subtree: true };
  observer.observe(targetNode, observerConfig);
}


function _submitModal(loaded_element_id_, modal_form_selector, content_selector, add_select_text_and_val, on_action_callback = null, on_delete_callback = null, callback_is_mutation = false, vue_var = null, foreign_key = null, master = {}, exclude_fields = [], preprocess_data_callback  = null, postprocess_data_callback  = null, edit_class = null, delete_class = null, on_change_callback = null){
  console.log("***MODAL-SUBMIT - modal_form_selector: ", modal_form_selector, "loaded_element_id_: ", loaded_element_id_, "vue_var: ", vue_var, "on_action_callback: ", on_action_callback)
  
  let modal_selector = getModalSelector(modal_form_selector);
  let action_callback_is_mutation = on_action_callback.toString().includes("mutation");
  let _data = getFormData(modal_form_selector, [], {}, exclude_fields = exclude_fields, skip_input_files = false, camelize = false, add_select_text_and_val = add_select_text_and_val, include_crud = true, create_objet_level = false);
  console.log("exist input-id?: ", $(content_selector).find("input[type='hidden'][id='"+loaded_element_id_.toString()+"']"));
  let is_creation = !loaded_element_id_ && !$(content_selector).find("input[type='hidden'][id='"+loaded_element_id_.toString()+"']").length;
  console.log("_submitModal data-1: ", _data, "loaded_element_id_: ", loaded_element_id_, "is_creation: ", is_creation);
  
  let entity = modal_form_selector && $(modal_form_selector).attr("entity") ? $(modal_form_selector).attr("entity") : null;
  console.log("entity: ", entity);
  
  if (loaded_element_id_ && (!Object.keys(_data).includes("id") || (Object.keys(_data).includes("id") && _data["id"] != loaded_element_id_))){
    console.log("adding id...", entity, $(modal_form_selector).attr("entity_id"), "loaded_element_id_: ", loaded_element_id_);
    if (!$(modal_form_selector).attr("entity_id")) { console.warn("WARNING-1: entity detected but not entity_id found... using loaded_element_id_..."); }
    _data["id"] = entity && $(modal_form_selector).attr("entity_id") ? $(modal_form_selector).attr("entity_id") : loaded_element_id_;
  }
  else if (!Object.keys(_data).includes("id") && ($(modal_form_selector).attr("entity_id") || loaded_element_id_)){
    if (!$(modal_form_selector).attr("entity_id")) { console.warn("WARNING-2: entity detected but not entity_id found... using loaded_element_id_..."); }
    _data["id"] = entity && $(modal_form_selector).attr("entity_id") ? $(modal_form_selector).attr("entity_id") : loaded_element_id_;
  }
  console.log("_submitModal data-2: ", _data, "loaded_element_id_: ", loaded_element_id_);
  
  let button_action = $(modal_form_selector).find("button.button_action, a.button_action").first()
  $(button_action).attr("disabled", true);
  
  let response = true
  let _trigger_event_on_finish = modal_form_selector.replace("#", "")+"_preprocess_finish";
  console.log("preprocess_data_callback:", preprocess_data_callback);
  
  //SET PREPROCESS EVENT
  $(modal_form_selector).on(_trigger_event_on_finish, function(event_, _response){
    event_.stopImmediatePropagation();
    _submitAction(content_selector , modal_form_selector, _trigger_event_on_finish, event_, _response, loaded_element_id_, _data, on_action_callback, on_delete_callback, callback_is_mutation, vue_var, foreign_key, master, exclude_fields, preprocess_data_callback, postprocess_data_callback, edit_class, delete_class, on_change_callback, action_callback_is_mutation, button_action, modal_selector, is_creation);
  });
  
  //TRIGGER PREPROCESS EVENT
  if (preprocess_data_callback && typeof preprocess_data_callback === "function"){
    
    console.log("preprocess_data_callback... - loaded_element_id_", loaded_element_id_);
    response = preprocess_data_callback(_data, loaded_element_id_, content_selector, modal_form_selector);
    
    if (response == null){
      console.log("INFO-1: callback 'preprocess_data_callback' returns null, waiting for trigger event, use trigger '"+_trigger_event_on_finish+"' inside callback function. for element_id_: ", loaded_element_id_);
      //$(modal_form_selector).trigger(_trigger_event_on_finish, [_data, loaded_element_id_]);
    }
    else{
      console.log("TRIGGERING preprocess_data_callback DUMMY BECAUSE RESPONSE: ", response);
      $(modal_form_selector).trigger(_trigger_event_on_finish, [response, loaded_element_id_]);
    }
  }
  else{
    console.log("NO PREPROCESS TRIGGERING preprocess_data_callback DUMMY...", _trigger_event_on_finish, "response: ", response);
    $(modal_form_selector).trigger(_trigger_event_on_finish, [_data, loaded_element_id_]);
  }
  console.log("_data0: ", _data);
  console.log("preprocess finish...", _trigger_event_on_finish, response);
  console.log("MODAL-SUBMIT-FINISH...")
}

function _submitAction(content_selector, modal_form_selector, _trigger_event_on_finish, event_, _response, loaded_element_id_, _data, on_action_callback, on_delete_callback = null, callback_is_mutation = false, vue_var = null, foreign_key = null, master = {}, exclude_fields = [], preprocess_data_callback  = null, postprocess_data_callback  = null, edit_class = null, delete_class = null, on_change_callback = null, action_callback_is_mutation = null, button_action = null, modal_selector = null, is_creation = null){
  console.log("***_submitAction - PREPROCESS FINISH RESPONSE TRIGGERED: ", _trigger_event_on_finish, "event_: ", event_, _response, typeof _response);
    
  let __data = typeof _response === "object" ? _response : _data;
  let __trigger_event_on_finish = modal_form_selector.replace("#", "")+"_action_finish"
  if (on_action_callback && typeof on_action_callback === "function"){
    
    console.log("CALLING on_action_callback - action_callback_is_mutation: ", action_callback_is_mutation, "_data: ", _data, "loaded_element_id_:", loaded_element_id_, modal_form_selector, "__trigger_event_on_finish: ", __trigger_event_on_finish);
    
    if (action_callback_is_mutation){
      
      let images = null;
      console.log("$(modal_form_selector).find(input[type='file'])...");
      
      if ($(modal_form_selector).find("input[type='file']").length && _data && typeof _data === "object"){
        
        $(modal_form_selector).find("input[type='file']").each(function( index ) {
          
          let field = $(this).attr("name");
          images = [];
          console.log("input file - img set: ", $(this), "field: ", field, "__data: ", __data);
          
          if (Object.keys(__data).includes(field)){
            
            let id = $(this).attr("id");
            console.log("id: ", id);
            
            if (!id)
              console.warn("WARNING: File input without id.", field);
            else{
              images.push(id);
              delete __data[field];
            }
          }
        });
      }
      console.log("images: ", images, "__data: ", __data);
      
      function _processMutationResponseCallback(response_, error_){
        console.log("response_: ", response_, "_response: ", _response, "error_: ", error_);
        
        if (response_ && typeof response_ === "object" && (!Object.keys(response_).includes("errors") || !response_["errors"] || (typeof response_["errors"] === "object"  && !Object.keys(response_).length) ) ){
          console.log("MUTATION RESPONSE_ OK...", response_);
          
          response_ = Object.keys(response_).includes("data") ? response_["data"] : response_;
          let iter = 1
          while (Object.keys(response_).length == 1 && !Object.keys(response_).includes("id") && iter != 3)
            response_ = response_[Object.keys(response_)[0]]; //Object.keys(response_).length ? response_[Object.keys(response_)[0]] : response_;
          console.log("+result mytation response: ", response_);
          
          let entity = modal_form_selector && $(modal_form_selector).attr("entity") ? $(modal_form_selector).attr("entity") : null;
          console.log("entity: ", entity);
          
          if (entity && Object.keys(response_).includes(entity)){
            console.log("response include entity... ", Object.keys(response_), Object.keys(response_).length);
            if (Object.keys(response_).length == 2){
              console.log("response include entity + m2m entity...");
              let m2m_entity = null;
              for (let key of Object.keys(response_)) {
                if (key == entity) { continue; }
                else
                  m2m_entity = key;
              }
              
              console.log("m2m_entity: ", m2m_entity);
              if (m2m_entity && typeof response_[m2m_entity] === "object" && Object.keys(response_[m2m_entity]).includes("id")){
                let tmp_response_ = response_;
                response_ = {"id": tmp_response_[m2m_entity]["id"]}
                response_[entity] = tmp_response_[entity];
                console.log("final response: ", response_);
              }
              
            }
            else if (Object.keys(response_).keys().length == 1)
              response_ = response_[entity];
          }
          
          if (Object.keys(response_).includes("id")){
            loaded_element_id_ = response_["id"];
            $(modal_form_selector).attr("loaded_id", loaded_element_id_);
          }
        }
        else{
          error_ = !error_ && typeof response_ === "object" && Object.keys(response_).includes("errors") ? response_["errors"] : error_;
          error_ = error_ && typeof error_ === "object" && Array.isArray(error_) && error_.length && Object.keys(error_[0]).includes("message") ? error_[0]["message"] : error_;
          console.log("CALLBACK FAIL: ", error_);
          response_ = false;
        }
        
        _response = response_;
        console.log("TRIGGERING ACTION IN SUBMIT: ", __trigger_event_on_finish)
        $(modal_form_selector).trigger(__trigger_event_on_finish, [response_, error_, loaded_element_id_]);
        console.log("mutation response callback finish... calling: ", __trigger_event_on_finish, response_, error_);
      }
      //PROCESS-RESPONSE-FINISH
      
      let params = { "data": setMutationData(__data, foreign_key) };
      if (images && images.length)
        on_action_callback(params, images, _processMutationResponseCallback);
      else
        on_action_callback(params, _processMutationResponseCallback);
      console.log("on_action_callback finish...");
      
    }
    else{
      console.log("CALLBACK IS NOT MUTATION: ", loaded_element_id_, __data, content_selector)
      _response = on_action_callback(__data, loaded_element_id_, content_selector, modal_form_selector, on_delete_callback = on_delete_callback, callback_is_mutation = callback_is_mutation, postprocess_data_callback = postprocess_data_callback, vue_var = vue_var, edit_class = edit_class, delete_class = delete_class);
      console.log("_response no-mutation on_action_call: ", _response)
      
      if (_response == null)
        console.log("INFO-2: callback 'on_action_callback' returns null, waiting for trigger event, use trigger '"+__trigger_event_on_finish+"' inside callback function. for element_id_: ", loaded_element_id_);
      else{
        console.log("TRIGGERING ACTION DUMMY BECAUSE RESPONSE: ", _response)
        $(modal_form_selector).trigger(__trigger_event_on_finish, [_response, null, loaded_element_id_]);
      }
      
    }
    console.log("here5");
  }
  //PROCESS-MUTATION-RESPONSE-DEF-FINISH
  
  console.log("MODAL ACTION - SAVE STARTS - loaded_element_id_: ", loaded_element_id_, "content_selector: ", content_selector, "__trigger_event_on_finish: ", __trigger_event_on_finish)
  $(modal_form_selector).on(__trigger_event_on_finish, function(event, response__, error__){ //+"_confirmed"
    event.stopImmediatePropagation();
    console.log("ACTION RESPONSE TRIGGERED: ", __trigger_event_on_finish, "event: ", event, response__, error__);
    
    if (response__){
      let element_id_ = loaded_element_id_;
      console.log("response__", response__, "__data: ", __data, element_id_, loaded_element_id_);
      
      if (typeof response__=== "object" && response__.id){
        console.log("set data-response, refresh element_id...");
        __data = response__;
      }
      else if (action_callback_is_mutation){
        __data = undoCreateObjsInData(__data, modal_form_selector);
      }

      if (typeof __data=== "object" && __data.id){
        element_id_ = __data.id;
        if (!$(modal_form_selector).attr("loaded_id")){
          $(modal_form_selector).attr("loaded_id", __data.id);
        }
      }

      if (modal_form_selector && $(modal_form_selector).attr("entity")){
        let entity = $(modal_form_selector).attr("entity");
        if (!Object.keys(__data).includes(entity)){ // && Object.keys(__data).includes("id")){
          let tmp_data = __data;
          __data = {"id": $(modal_form_selector).attr("loaded_id")};
          __data[entity] = tmp_data;
        }
      }

      //console.log("is_creation-on-response-trigger: ", is_creation);
      let is_creation_ = !element_id_ || (element_id_ && !$(content_selector).find("input[type='hidden'][id='"+element_id_.toString()+"']").length);
      console.log("__data before update: ", __data, "is_creation-on-response-trigger: ", is_creation_, "element_id_: ", element_id_, "loaded_element_id_: ", loaded_element_id_, "loaded_id: ", $(modal_form_selector).attr("loaded_id"), "vue_var: ", vue_var);

      if(!is_creation_)
        contentCRUDupdate(element_id_, __data, content_selector, modal_form_selector, postprocess_data_callback = postprocess_data_callback, on_change_callback = on_change_callback, vue_var = vue_var) //, master = master
      else{
        element_id_ = contentCRUDcreate(__data, content_selector, modal_form_selector, on_delete_callback = on_delete_callback, callback_is_mutation = callback_is_mutation, postprocess_data_callback = postprocess_data_callback, vue_var = vue_var, edit_class = edit_class, delete_class = delete_class, on_change_callback = on_change_callback, master = master)
      }
      console.log("MODAL ACTION - SAVE FINISH!!", modal_form_selector, "element_id_: ", element_id_, "is_creation_: ", is_creation_);

      if (element_id_ != false){

        //$(modal_form_selector).validate()
        let modal_is_open = isModalOpen(modal_form_selector)
        console.log("modal_is_open-2: ", modal_is_open)
        if (modal_is_open) {
          $(modal_selector).modal('toggle'); //.css('display', 'none');
        }
        
        console.log("TRIGGERING crud_create_or_edit_finish_trigger: ", __data, "element_id_: ", element_id_)
        $(modal_form_selector).trigger("crud_create_or_edit_finish_trigger", [__data, element_id_]);

        cleanModal(modal_form_selector, "after-sumbit-finish")
      }
      else
        $(button_action).attr("disabled", false);

      console.log("here...");
    }
    else{
      console.log("RESPONSE NOT OK... error__: ", error__)
      $(button_action).attr("disabled", false);
      if (error__)
        messageAlert("", error__, "warning");
    }
    console.log("here-2...");
  });
}

function getGraphQLResponse(data_, set_exception = false){
  // console.log("***getObjData - data_: ", data_);
  var new_data = {};

  for (let [key, value] of Object.entries(data_)) {
    // console.log("loading data for - key: ", key, "value: ", value);
    if (value && typeof value === "object" && !Array.isArray(value)){
      if (Object.keys(value).includes("id")) //value.id
        new_data[toUncamelize(key)] = value.id;
      else
        console.warn("WARNING: obj found in data and skipped: ", key, value);
    }
    else if (!set_exception || !key.toString().endsWith("Set"))
      new_data[toUncamelize(key)] = value;
  }

  return new_data;
}

function setModalsData(data_, foreign_id_name = null){
  // console.log("***setModalsData - current: ", all_modalls)
  let foreign_id = foreign_id_name && data_.hasOwnProperty("id") ? data_.id : null;
  for (let [key, content_selector_] of Object.entries(all_modalls)) {
    // console.log("loading data for - key: ", key, "content_selector: ", content_selector_)
    data_[key] = contentCRUDdata(content_selector_);
    if (foreign_id_name && foreign_id)
      data_[key][foreign_id_name] = foreign_id;
  };
  
  return data_
}

function isModalOpen(modal_form_selector){
  let modal_selector = getModalSelector(modal_form_selector)
  return $(modal_selector).hasClass("modal") && ($(modal_selector).hasClass("show") || $(modal_selector).hasClass("in"))
}

function cleanModal(modal_form_selector, event_ = null){ //, modal_selector = "#modal_locations"){
  console.log("***CLEAN MODAL ", event_)
  let modal_selector = getModalSelector(modal_form_selector)
  
  formClean(modal_form_selector)
  
  console.log("*********EVENT: loaded_id cleaned - previous_id_on_modal: ", $(modal_form_selector).attr("loaded_id"));
  $(modal_form_selector).attr("loaded_id", "");
  $(modal_form_selector).attr("entity_id", "");
  $(modal_form_selector).find(".container-error").html("");
  $(modal_form_selector).find("input, select, textarea").removeAttr("aria-invalid").removeClass("error");
  $(modal_form_selector).find("select, input").attr("disabled", false);
  $(modal_form_selector).find("button.button_action, a.button_action").show();
  //$(modal_form_selector).find("select option").not(':visible').show();
  
  console.log("cascade_filter_child is_creation: ", event_.toString().endsWith("is_creation"))
  let is_creation = event_ &&event_.toString().endsWith("is_creation");
  console.log("is_creation: ", is_creation, event_, $(modal_form_selector).find(".cascade_filter_child, .allow-clear"));
  if (is_creation){
    $(modal_form_selector).find(".cascade_filter_child, .allow-clear").prop('selected', false).val([]).trigger("change"); //.parent().hide();
  }
  //$(modal_form_selector).find(".cascade_filter_child, .allow-clear").trigger("change");
  
  let button_action = $(modal_form_selector).find("button.button_action").first()
  $(button_action).html('Añadir');
  $(button_action).attr("disabled", false);
  console.log("cleanModal finish...");
}


function getFormData(jq_selector, exclude_when_empty = [], field_map = {}, exclude_fields = [], skip_input_files = true, camelize = true, add_select_text_and_val = false, include_crud = false, create_objet_level = false, empty_as_null = true){
  console.log("***getFormData - jq_selector", jq_selector, "include_crud: ", include_crud, exclude_fields); //$(jq_selector).find("input, select, textarea")
  var _data;
  //var rows_form = false;
  
  console.log("check tr-li: ", jq_selector, jq_selector.toString().includes(" tr"), $(jq_selector).length > 1, $(jq_selector).first().data("id"));
  if (jq_selector && typeof jq_selector === "string" && (jq_selector.endsWith(" tr") || jq_selector.endsWith(" li")) && $(jq_selector).length >= 1){
    console.log("has tr or li...", $(jq_selector))
    _data = []
    $(jq_selector).each(function(index_, value_){
      console.log("tr iter selector result: ", jq_selector+"[data-id='"+$(this).data("id")+"']");
      let elm = $(jq_selector).first().data("id") != null ? jq_selector+"[data-id='"+$(this).data("id")+"']" : value_;
      _data.push(getFormData(elm, exclude_when_empty, field_map, exclude_fields, skip_input_files, camelize, add_select_text_and_val, include_crud, create_objet_level, empty_as_null))
      console.log("tr iteration result: ", _data);
    })
  }
  else{
    _data = {}
    element_selector = skip_input_files ? "input[type!=file], select, textarea" : "input, select, textarea";
    console.log("element_selector--: ", element_selector)
    
    exclude_fields_ = []
    console.log("excludes: ", $(jq_selector).find(".exclude-from-parent-form"));
    $(jq_selector).find(".exclude-from-parent-form").find(element_selector).each(function(){
      if ($(this).attr("name"))
        exclude_fields_.push($(this).attr("name"));
    });
    console.log("excludes: ", $(jq_selector).find("input.exclude-from-parent-form"), typeof element_selector);
    $(jq_selector).find("input.exclude-from-parent-form").each(function(){
      if ($(this).attr("name"))
        exclude_fields_.push($(this).attr("name"));
    });
    console.log("exclude_fields_: ", exclude_fields_, element_selector);
    exclude_fields = [ ...exclude_fields, ...exclude_fields_ ]; 
    
    console.log("+start - jq_selector: ", element_selector, $(jq_selector).find(element_selector).not(".select2-cascade-filter-aux"))
    $(jq_selector).find(element_selector).not(".select2-cascade-filter-aux").each(function( index ) {
      console.log(index, "this: ", $(this), "attr: ", $( this ).attr("name"));
      
      if (include_crud || !$(this).hasClass("crud")){
        //console.log("INPUT CRUD FOUND...")
        
        let tag = this && $(this).length ? $(this)[0].nodeName.toLowerCase() : null;
        //console.log("tag: ", tag);
        let field_name = $(this).attr("name")
        let field_name_ = field_name
        let field_id = $(this).attr("id")
        console.log("$(this)-1: ", $(this), $(this).hasClass("note-codable"), "field_id: ", field_id, "field_name: ", field_name, "_data: ", _data);
        
        if ($(this).hasClass("note-codable")){
          var summernoteElement = $(this).closest('.summernote');
          value = $(summernoteElement).summernote('code');
          console.log("summernote-value: ",$(summernoteElement),  value);
        }
        
        if ((!field_name || typeof field_name === null) && !$(this).hasClass("select2-search__field") && !$(this).hasClass("ui-autocomplete-input"))
          console.warn("WARNING: form field does not have a name defined in DOM... - $(this): ", $(this));
        
        if (field_name && field_name != "csrfmiddlewaretoken" && field_name != "" && !exclude_fields.includes(field_name) && !$(this).hasClass("select2-search__field") && !$(this).hasClass("ui-autocomplete-input")){
          console.log("getFormData-field_name: ", field_name, "tag-node: ", tag);
          
          if (field_map && typeof field_map === "object")
            field_name = Object.keys(field_map).includes(field_name) ? field_map[field_name] : field_name;
          
          if (tag == "select"){
            
            console.log("1-is select...");
            //if ($(this).hasClass("tagit"))
            //  console.log("is tagit... field_name: ", field_name, field_name.indexOf('_'));
            
            if ($(this).hasClass("multiple-select2") || ($(this).hasClass("select2-hidden-accessible") && $(this).attr("multiple") == "multiple")){
              value = $(this).select2("val");
              console.log("1.1-is select...", value, $(this), $(this).is(':selected'));
            }
            else if (add_select_text_and_val){
              value = $(this).find(":selected").val();
              console.log("1.2-is select...", value);
              _data[field_name+"_id"] = value && isNumeric(value) ? parseInt(value) : value
              value = $(this).find(":selected").text();
            }
            else{
              value = $(this).find(":selected").val();
              console.log("1.3-is select...", value, $(this), $(this).is(':selected'));
              if ($(this).hasClass("cascade_filter_child")) { console.log("$(this).select2(val): ", $(this).select2("val")); }
            }
          }
          else{
            //console.log("hasclass: ", $(this).hasClass("tagit-hidden-field"))
            console.log("2-is not select...");
            if ($(this).hasClass("tagit-hidden-field")){
              var tagit_select_input = $(jq_selector).find("select[name='"+field_name+"']");
              console.log("is tagit... field_name: ", field_name, field_name.indexOf('_'), "tagit_select_input: ", tagit_select_input);
              if (tagit_select_input.length && tagit_select_input.hasClass("tagit"))
                return true;
              if (field_name.indexOf('_') && field_name.indexOf('_') != -1)
                field_name = field_name.substring(0, field_name.indexOf('_'));
              else if (field_name.indexOf('-') && field_name.indexOf('-') != -1)
                field_name = field_name.substring(0, field_name.indexOf('-'));
              
              console.log("$(this)-: ", $(this));
              console.log("$(this).tagit(assignedTags):", $(this).tagit("assignedTags"))
              value = $(this).tagit("assignedTags");
              if (value && value.length != 0 && value.includes('[object Object]'))
                value = window[$(this).attr("windowsname")]["assignedTags"];
              console.log("is tagit... - field_name: ", field_name, "value: ", value);
            }
            else if ($(this).attr("type") == "checkbox")
              value = $(this).is(":checked") ? 1 : 0;
            else if ($(this).attr("type") == "radio"){
              console.log("is_radio - checked?: ", $(this).is(":checked"));
              if (!$(this).is(":checked"))
                return;
              else
                value = $(this).val();
                console.log("selected radio: ", $(this), $(this).val())
            }
            else if ($(this).attr("type") == "file"){
              console.log("is_file field...");
              let path = $(this).val();
              value = getFileName(path);
            }
            else{
              
              value = $(this).val()
              console.log("else - value: ", value, "attr val: ", $(this).attr("value"));
              
              if (value){
                if (isNumeric(value, false))
                  value = parseInt(value);
                else if (isNumeric(value))
                  value = parseFloat(value);
              }
              
            }
          }
          
          console.log("getFormData-2-field_name: ", field_name, value);
          field_name = camelize ? toCamelCase(field_name) : field_name;
          console.log("-setting data", field_name, "value-2: ", value);
          if (exclude_fields)
            console.log("exclude_fields: ", exclude_fields, field_name, exclude_fields.includes(field_name));
          
          if ((!value || value === "") && exclude_when_empty && (exclude_when_empty.includes(field_name_) || exclude_when_empty.includes(field_name))){
            console.log("set-0...", element_selector);
          }
          else if (empty_as_null && value === ""){ //(value == null || 
            console.log("set-1...", element_selector);
            _data[field_name] = null;
          }
          else if (value && typeof value === "string" && isNumeric(value)){
            console.log("set-2...", element_selector);
            _data[field_name] = value.toString().includes(".") ? parseFloat(value) : parseInt(value);
          }
          else{
            console.log("set-3...", field_name, value);
            _data[field_name] = value;
          }
          console.log("getFormData-3-field_name: ", field_name, value, _data)
        }
      }
      else
        console.log("INFO: crud skipped...");
      
    });
    
    console.log("+result _data-1: ", _data, value, create_objet_level);
    if (create_objet_level){
      _data = createObjsInData(_data, false)
    }
  }
  
  console.log("$(jq_selector).find(element_selector): ", $(jq_selector).find("input[data-nicelabel]"));
  let $nicelabel_inputs = $(jq_selector).find("input[data-nicelabel]");
  let nl_data = {};
  let pre_field = null;
  let field_index = 0;
  
  $nicelabel_inputs.each(function(index, value){
    let nl_id = $(this).attr("id");
    let nl_name = $(this).attr("name");
    console.log("nl_name: ", nl_name, nl_id, pre_field, index, value, pre_field != nl_name);
    if (pre_field != nl_name){
      pre_field = nl_name;
      field_index = 0;
    }
    else
      field_index += 1;
    
    let visible = $("label[for='"+nl_id+"'").find(".nicelabel-checked-image").is(":visible");
    console.log("field_index: ", field_index, Object.keys(nl_data).includes(nl_name));
    if (visible){
      nl_data[nl_name] = !Object.keys(nl_data).includes(nl_name) ? [] : nl_data[nl_name];
      nl_data[nl_name].push(field_index+1);
    }
    console.log("-nl_data: ", nl_data);
  });
  for (let [key, value] of Object.entries(nl_data)) {
    _data[key] = value;
  }
  
  console.log("+result _data-2: ", _data)
  return _data
}

function getFileName(path){
  let value;
  if (path.includes("/"))
    value = path.rsplit("/")[1];
  else if (path.includes("\\"))
    value = path.rsplit("\\")[1];
  else
    value = path;
  return value;
}

function setMutationData(_data, extra_data = null, camelize = true){
  console.log("***setMutationData....", Object.keys(_data), "extra_data: ", extra_data);
  let new_data = {}
  
  for (let [key, value] of Object.entries(_data)) {
    //console.log("--key", key, "value", value);
    
    if (!key.endsWith("_id")){
      
      if (Object.keys(_data).includes(key+"_id")){
        //console.log("if-1.1-no id... obj");
        new_data[key] =  _data[key+"_id"];
      }
      else if (!Object.keys(new_data).includes(key)){
        //console.log("if-1.2-no id... - direct-set");
        if (camelize && key.count("_") != 0) {new_data[toCamelCase(key)] = value;}
        else {new_data[key] = value;}
      }
    }
    else if (key.endsWith("_id")){ //key.count("_") != 1 && 
      //console.log("if-2... endsWith _id");
      
      if (Object.keys(_data).includes(key.replace("_id", ""))){
        //console.log("if-2.1-endsWith _id... obj");
        new_data[key.replace("_id", "")] =  _data[key];
      }
      else{
        //console.log("if-2.2-endsWith _id... - direct-set");
        if (camelize && key.count("_") != 0) {new_data[toCamelCase(key)] = value;}
        else {new_data[key] = value;}
      }

    }
    else{
      //console.log("if-3... direct assign");
      if (camelize && key.count("_") != 0) {new_data[toCamelCase(key)] = value;}
      else {new_data[key] = value;}
    }
    //console.log("new_data: ", new_data);
  }
  
  if (extra_data && typeof extra_data === "object")
    new_data = Object.assign({}, new_data, extra_data);

  if (Object.keys(new_data).includes("id") && !isNumeric(new_data["id"]))
    delete new_data["id"];

  console.log("+result setMutationData: ", new_data);
  return new_data;
}

function undoCreateObjsInData(_data, form_selector, create_obj = true, add_select_value_as_id = false){
  console.log("***undoCreateObjsInData: ", form_selector, _data);
  new_data = {}

  for (let [key, value] of Object.entries(_data)) {
    //console.log("--key", key, "value", value);
    if (key != "id" && !key.endsWith("_id") && isNumeric(value) && $(form_selector).find("select[name='"+key+"']").length){
      if (!create_obj){
        new_data[key] = $(field_selector+' option:contains("'+value+'")').val();
        if(add_select_value_as_id)
          new_data[key+"_id"] = value;
      }
      else{
        new_data[key] = {"name": $(form_selector).find("select[name='"+key+"'] option[value='" + value + "']").text(), "id": value};
      }
    }
    else
      new_data[key] = value;
  }

  console.log("+result undoCreateObjsInData: ", new_data);
  return new_data
}

function createObjsInData(_data, camelize = false){
  console.log("***createObjsInData....", _data);
  //console.log("Object.keys(_data)", Object.keys(_data));
  let new_data = {}
  
  for (let [key, value] of Object.entries(_data)) {
    //console.log("--key", key, "value", value);
    
    if (!key.endsWith("_id")){
      
      if (Object.keys(_data).includes(key+"_id") && key.count("_") == 0){ //TODO: count works? or use str_ocurrence_count(
        //console.log("if-1.1... obj");
        new_data[key] = {"name": value, "id": _data[key+"_id"]};
        //delete _data[key+"_id"];
      }
      else if (key.includes("_")){
        //console.log("if-1.2... includes");
        if (camelize){
          //console.log("if-1.2.1... camelize");
          new_data[toCamelCase(key)] = Object.keys(_data).includes(key+"_id") ? _data[key+"_id"] : value;
        }
        else{
          //console.log("if-1.2.2... camelize");
          new_data[key] = Object.keys(_data).includes(key+"_id") ? _data[key+"_id"] : value;
        }
          
      }
      else{
        //console.log("if-1.3... - direct-set");
        new_data[key] = value;
      }
    }
    else if (Object.keys(_data).includes(key.replace("_id", ""))){ //key.count("_") != 1 && 
      console.log("if-2... dicard");
    }
    else{
      //console.log("if-3... direct assign");
      new_data[key] = value
    }
    //console.log("new_data: ", new_data);
  }

  console.log("+result createObjsInData: ", new_data);
  return new_data;
}

function toggleModal(element_id = null, modal_form_selector = "#location_modal_form", content_selector = "#content_locations", callback = null, master = {}){
  console.log("***toggleModal - modal_form_selector: ", modal_form_selector, "element_id: ", element_id);
  
  let modal_selector = getModalSelector(modal_form_selector)

  if (element_id)
    element_id = isNumeric(element_id) || element_id.toString().includes("new_") ? element_id : element_id.data('id');
  let find_selector = typeof element_id === "number" || typeof element_id === "string" ? "[id="+element_id.toString()+"]" : element_id
  element = element_id ? $(content_selector).find(find_selector).first() : null

  let data = element_id ? contentCRUDread(element_id, content_selector, false) : null
  let is_creation = data == null ? true : false
  console.log("toggleModal - LOADING - data: ", data, "is_creation: ", is_creation, "element_id: ", element_id);

  if (is_creation){
    console.log("is creation...");
    cleanModal(modal_form_selector, "toggleModal-is_creation");
  }
  else{
    console.log("is update...")
    
    if (modal_form_selector && $(modal_form_selector).attr("entity")){    
      let entity = $(modal_form_selector).attr("entity");
      console.log("has entity: ", entity);
      
      if (data && typeof data === "object" && Object.keys(data).includes(entity) && typeof data[entity] === "object" ){
        data = data[entity];
        $(modal_form_selector).attr("entity_id", data["id"]);
      }
    }
    
    //renderForm(modal_form_selector, data, {}, true, false, true, 2);
    renderForm(modal_form_selector, data, {}, true, true, true, 2);
    
    console.log("master: ", master, "element_id: ", element_id, "data[id]: ", data["id"]);
    
    if (master && typeof master === "object" && Object.keys(master).length){
      console.log("has master...");
      
      for (let [jq_selector, vue_var] of Object.entries(master)) {
        
        let select_element = !jq_selector.includes(modal_form_selector) ? $(modal_form_selector).find(jq_selector).first() : $(jq_selector);
        let option_selector = select_element.find("option[value='"+data["id"]+"']").first();
        console.log("jq_selector: ", jq_selector, $(jq_selector), "option_selector: ", option_selector, $(option_selector));
        
        if ($(option_selector).length){
          $(option_selector).prop('selected', true);
          //if (!element.hasClass("new")){
          $(modal_form_selector).find("select, input").attr("disabled", true);
          $(modal_form_selector).find("button.button_action, a.button_action").hide();
          //}
        }
        else
          $(select_element).attr("disabled", true);
      }
    }
    
    $(modal_form_selector).attr("loaded_id", element_id);
    console.log("element_id loaded...", element_id);
  }
  console.log("FINISH LOAD - element: ", element, "element_id: ", element_id);
  
  if (callback && typeof callback === "function")
    callback(element, modal_form_selector, modal_selector);
  
  let button_action = $(modal_form_selector).find("button.button_action, a.button_action").first()
  console.log("button_action: ", button_action);
  if (button_action)
    if (!is_creation)
      $(button_action).html('Editar');
    else
      $(button_action).html('Añadir')
  else
    alert("WARNING: button_action not added to html element. modal_selector: ", modal_selector)

  console.log("modal-toggle: ", modal_selector, $(modal_selector), $(modal_selector).hasClass('in'));
  //jQuery.noConflict(); 
  //$(modal_selector).modal('toggle');
  $(modal_selector).modal('show');
  if($(modal_selector).hasClass('in')){
    //Do something here
  }
  return element_id
}

function getModalSelector(modal_form_selector){
  console.log("***getModalSelector - modal_form_selector: ", modal_form_selector, $(modal_form_selector))
  let modal_selector = modal_form_selector && $(modal_form_selector).length && $(modal_form_selector)[0].nodeName.toLowerCase() == "form" ?  $(modal_form_selector).children(".modal").first().attr("id") : modal_form_selector
  if (modal_selector)
    modal_selector = !modal_selector.startsWith('#') ? "#"+modal_selector.toString() : modal_selector.toString()
  console.log("+result getModalSelector: ", modal_selector)
  return modal_selector
}


function contentCRUDcreate(data, add_to = '#content_locations', modal_form_selector = "#location_modal_form", on_delete_callback = null, callback_is_mutation = true, postprocess_data_callback = null, vue_var = null, edit_class = '.edit-locations', delete_class = '.remove-locations', on_change_callback = null, master = {}) {
  console.log("***CRUDcreateElement - data: ", data, "modal_form_selector: ", modal_form_selector, "vue_var: ", vue_var);
  
  let response = true;
  let modal_selector = getModalSelector(modal_form_selector);
  let has_processed_data = false;
  let element_id = false;

  //if (mutation_callback && typeof mutation_callback === "function"){
  //  console.log("***calling mutation!");
  //  response = mutation_callback({"data": data})
  //}
  //console.log("+response: ", response);

  if (response){
    
    element_id = null
    //if (response && typeof response === "object" && response.hasOwnProperty("id"))
    if (data && typeof data === "object" && data.hasOwnProperty("id"))
      element_id = data["id"]
    else
      element_id = contentCRUDgetId(data, add_to, on_fail_create_new_id = true)
    
    console.log("postprocess_data_callback: ", postprocess_data_callback, "element_id: ", element_id)
    
    if (data && typeof data === "object" && (!data.hasOwnProperty("id") || !data.id) && element_id)
      data["id"] = element_id

    if (postprocess_data_callback && typeof postprocess_data_callback === "function"){
      console.log("postprocess_data_callback...: ", data, "element_id: ", element_id)
      //ID created on Action button
      data_ = postprocess_data_callback(data, element_id, add_to, modal_form_selector, response);
      has_processed_data = true
    }
    else
      data_ = data
    console.log("data: ", data, "data_:", data_);

    //CHECK IF ALREADY exists
    let is_unique_input_val = true;
    let processed_data_is_str = typeof data_ === "string";
    
    if (!isNumeric(data["id"])){
      let existent_inputs = processed_data_is_str ? $(add_to).find("input") : $(add_to).find("input[id!='"+data["id"]+"']");
      console.log("existent_inputs:", existent_inputs, "processed_data_is_str: ", processed_data_is_str)
      
      if (existent_inputs && $(existent_inputs).length){
        console.log("inside existent_inputs: ", existent_inputs, "processed_data_is_str: ", processed_data_is_str, "JSON.stringify(data_): ", JSON.stringify(data_))
        let current_str = processed_data_is_str ? JSON.stringify(data) : JSON.stringify(data_);
        current_str = current_str.includes(',"id"') ? current_str.split(',"id"')[1] : current_str.substring(current_str.indexOf('","')+1);
        
        for (var i = 0; i < existent_inputs.length; i++) {
          
          console.log("$(existent_inputs[i]).val(): ", $(existent_inputs[i]).val())
          let new_str = $(existent_inputs[i]).val();
          new_str = new_str.includes(',"id"') ? new_str.split(',"id"')[0] : new_str.substring(new_str.indexOf('","')+1);
          
          if (processed_data_is_str){
            console.log("1-JSON.stringify(data): ", JSON.stringify(data).split(',"id"')[1])
            if (data && current_str == new_str){
              is_unique_input_val = false;
              break;
            }
          }
          else if (data_ && current_str == new_str){
            console.log("2-JSON.stringify(data_): ", JSON.stringify(data_).split(',"id"')[1])
            is_unique_input_val = false;
            break;
          }
        }
      }
    }
    console.log("+data_: ", data_, "is_unique_input_val: ", is_unique_input_val);
    
    if (is_unique_input_val && data_){
      console.log("is_unique_input_val creating obj...");
      
      if (vue_var){
        vue_var.push(createObjsInData(data_, camelize = true)); //Object.assign({}, data_)
        console.log("vue_var add", vue_var, data_) //, "vue_data: ", createObjsInData(data_, camelize = true))
        //element = $(vue_var).children("[id='"+data_.id+"]'")
      }
      else if (typeof add_to === "string"){
        //element = data_ //setElementDataAttributes(data_)
        console.log("data_ pre-append...", data_)
        $(add_to).prepend(data_); //prepend(data_);
      }
      console.log("added to: ", add_to, "data: ", data, "data_:", data_);
      
      let input = null;
      if (!has_processed_data || !$(add_to).find("input[id='"+data.id+"']").length ){
        input = processed_data_is_str ? createJSONinput(data, add_to) : createJSONinput(data_, add_to);
        // console.log("input", input)
      }
      else{
        console.warn("WARNING: INPUT CREATION SKIPED...")
        //input = null;
      }
      
      if (input && $(input).length)
        $(input).attr("updated", false);
      
      element_id = has_processed_data && $(data_).attr("id") ? $(data_).attr("id") : $(data).attr("id");
      console.log("BUTTONS -- element_id: ", element_id)
      
      //EDIT-DELETE BUTTONS
      setContentButtonEvents(add_to, modal_form_selector, delete_class, edit_class, on_delete_callback, element_id, vue_var = vue_var, callback_is_mutation, on_change_callback = on_change_callback, master = master)
      console.log("BUTTONS POST SET -- element_id: ", element_id)
      
    }
    else{
      messageAlert("", "El valor que intenta ingresar ya se encuentra agregado", "warning");
      element_id = false;
    }
    
  }
  else{
    alert("Response false while creating CRUD...", content_selector);
  }
  
  //console.log("on_change_callback: ", on_change_callback)
  //if (on_change_callback && typeof on_change_callback === "function")
  //  on_change_callback(add_to, data, modal_form_selector, operation = "create");
  
  console.log("+result return element_id: ", element_id);
  return element_id;
}

function setContentButtonEvents(add_to, modal_form_selector, delete_class, edit_class = null, on_delete_callback = null, element_id_ = null, vue_var = null, callback_is_mutation = false, on_change_callback = null, master = {}){
  console.log("***setContentButtonEvents - element_id: ", element_id_, "vue_var: ", vue_var, "delete_class: ", delete_class, "edit_class: ", edit_class)
  
  let button = null
  let button_id = null
  let button_selector = null
  //let element_id = has_processed_data ? $(data_).attr("id") : data_;
  console.log("BUTTONS - element_id_: ", element_id_)
  
  //EDIT
  console.log("add_to: ", add_to, "$(add_to).find(edit_class): ", $(add_to).find(edit_class), "edit_class: ", edit_class);
  if (edit_class){ //&& (typeof data_ === "string" || typeof data_ === "number")){

    button = null
    button_id = element_id_
    
    button_selector = button_id ? "a[data-id='"+button_id+"']"+edit_class : edit_class; //[id="+button_id+"]"+edit_class+",
    console.log("button_selector: ", button_selector, "button_id: ", button_id);

    var has_master = 0;
    /*if (master && typeof master === "object" && Object.keys(master).length){
      let entity = $(modal_form_selector).attr("entity");
      let obj_ids = [];
      if (button_id){
        let objIndex = vue_var.findIndex((obj => obj.id == button_id));
        obj_ids = objIndex && objIndex != -1 ? [vue_var[objIndex]] : null;
      }
      else
        obj_ids = vue_var;
      console.log("obj_ids: ", obj_ids, "obj_ids.length: ", obj_ids.length);
      
      for (let i = 0; i < obj_ids.length; i++) {
        
        let reg = JSON.parse(JSON.stringify(obj_ids[i]));
        let obj_entity_id = entity && Object.keys(reg).includes(entity) && Object.keys(reg[entity]).includes("id") ? reg[entity].id : null;
        let obj_id = Object.keys(reg).includes("id") ? reg.id : null;
        console.log("i: ", i, "reg: ", reg, "entity: ", entity, "obj_entity_id: ", obj_entity_id, "obj_id: ", obj_id, "Object.keys(reg): ", Object.keys(reg));
        
        if (obj_entity_id && obj_id){
          
          for (let [jq_selector, vue_var_master] of Object.entries(master)) {
            
            let select_element = !jq_selector.includes(modal_form_selector) ? $(modal_form_selector).find(jq_selector).first() : $(jq_selector);
            let option_selector = select_element.find("option[value='"+obj_entity_id+"']").first();
            console.log("jq_selector: ", jq_selector, $(jq_selector), "option_selector: ", "option[value='"+obj_entity_id+"']", $(option_selector));
            
            if ($(option_selector).length){
              has_master = 1;
              let edit_button_selector = "a[data-id='"+obj_id+"']"+edit_class;
              console.log("edit_button_selector: ", edit_button_selector, $(add_to), "$(add_to).find(: ", $(add_to).find("[data-id='"+obj_id+"']"), "$(edit_button_selector): ", $("a#"+obj_id), "remove: ", $(add_to).find(edit_button_selector));
              $(add_to).find(edit_button_selector).remove();
            }
            console.log("has_master: ", has_master)
          }
        }
      }
    }*/
    
    if (has_master == 0){
      $(add_to).find(button_selector).unbind();
      $(add_to).on('click', button_selector, function (event) {
        event.preventDefault();
        console.log("EDIT CLICKED!!!!!!!!!!!", event, master)
        updateModal(event, modal_form_selector, add_to, master = master)
      });
      console.log("EDIT CLICK SET-2!!!!!!!!!!! - button: ", button, "button_id: ", button_id, "button_selector: ", button_selector, "$button_selector: ", $(button_selector));
    }
  }
  
  //DELETE
  console.log("add_to: ", add_to, "$(add_to).find(delete_class): ", $(add_to).find(delete_class))
  if (delete_class){

    button = null
    button_id = element_id_

    button_selector = button_id ? "a[data-id='"+button_id+"']"+delete_class : delete_class //[id="+button_id+"]"+delete_class+", 
  
    $(button_selector).unbind();
    $(add_to).on('click', button_selector, function (event) {
      event.preventDefault();
      //let vue_var_ = vue_var
      console.log("DELETE CLICKED!!!!!!!!!!!", event, "vue_var: ", vue_var)
      contentCRUDdelete(event, modal_form_selector, add_to, on_delete_callback, callback_is_mutation, on_change_callback = on_change_callback, vue_var = vue_var)
    });
    console.log("DELETE CLICK SET-2!!!!!!!!!!! - button: ", button, button_id, button_selector, "vue_var: ", vue_var)
    //}
  }

}

function contentCRUDdelete(element_id, modal_form_selector = "#location_modal_form", remove_from = '#content_locations', on_delete_callback = null, callback_is_mutation = true, on_change_callback = null, vue_var = null) {
  console.log("***CRUDdeleteElement - element_id: ", element_id, "vue_var: ", vue_var);
  callback_is_mutation = callback_is_mutation == true || on_delete_callback.toString().includes("mutation");

  if (element_id.hasOwnProperty('originalEvent')){
    let row = element_id.target //.parentElement
    element_id = contentCRUDgetId($(row)) //.children("div").attr("id") //".row-reg"
    console.log("row: ", row, "element_id: ", element_id)
  }
  
  element_id = isNumeric(element_id) || element_id.toString().includes("new_") ? element_id : element_id.data('id');
  console.log("element_id: ", element_id)
  let response = null
  
  let _trigger_event_on_finish = modal_form_selector.replace("#", "") + "_confirmation_alert"
  confirmAlert("", "Está seguro que desea eliminar estos datos?", null, element_id, trigger_event_on_finish = modal_form_selector)
  console.log("confirmation alert response: ", response)
  
  $(modal_form_selector).on(_trigger_event_on_finish, function(event, response){ //+"_confirmed"
    console.log("confirmation_alert triggered... - response: ", response)
    
    if (response === null || response){
      console.log("calling _on_delete_callback...");
      response_2 = _on_delete_callback(element_id, modal_form_selector, remove_from, on_delete_callback, callback_is_mutation)
      if (response_2 == null)
        console.warn("WARNING: callback '_on_delete_callback' does not have return or trigger"); //, use trigger '"+_trigger_event_on_finish+"' inside callback function.");
      
      console.log("response_2: ", response_2)
      
      if (response_2){
        
        if (vue_var){
          console.log("has vue_var...");
          let objIndex = vue_var.findIndex((obj => obj.id == element_id));
          console.log("vue_var delete: ", vue_var, "objIndex-d: ", objIndex, element_id)
          app_vue.$delete(vue_var, objIndex)
        }
        else if (typeof remove_from === "string"){
          let find_selector = typeof element_id === "number" || typeof element_id === "string" ? "[id="+element_id.toString()+"], [data-id="+element_id.toString()+"]" : element_id
          console.log("remove - find_selector: ", find_selector, $(remove_from), $(remove_from).find(find_selector))
          $(remove_from).find(find_selector).remove();
        }
        
        
        //Delete input if exists
        let input = $(remove_from).find("input[id="+element_id.toString()+"]").first()
        if (input && $(input).length)
          $(input).remove();
          
        console.log("on_delete_change_callback: ", on_change_callback);
        if (on_change_callback && typeof on_change_callback === "function")
          on_change_callback(remove_from, element_id, modal_form_selector, operation = "delete");
      }
      else
        console.log("NO response_2 result....")
      
    }
        
    console.log("CRUD-DELETE-FINISH....")
    //$(modal_form_selector).attr("loaded_id", "");
  });
}

function _on_delete_callback(element_id_, modal_form_selector_, remove_from_, on_delete_callback_ = null, callback_is_mutation = true, on_change_callback = null)
{
  let response = true
  callback_is_mutation = callback_is_mutation == true || on_delete_callback_.toString().includes("mutation");
  console.log("***_on_delete_callback - callback_is_mutation: ", callback_is_mutation)
  
  if ((element_id_ && element_id_.toString().includes("new_")) || !(callback_is_mutation && on_delete_callback_ && typeof on_delete_callback_ === "function"))
    response = true
  else{  //x
      console.log("calling mutation: ", callback_is_mutation, element_id_, )
      if (on_delete_callback_ && typeof on_delete_callback_ === "function"){ //!mutation_processMutationResponseCallback_ && 
        console.log("on_delete_callback_ is func...")
        if (callback_is_mutation){
          on_delete_callback_({"id": element_id_}, function(response_){
            response = response_
            console.log("on_delete_callback_ response_: ", response_, "response: ", response)
          });
        }
        else
          response = on_delete_callback_(element_id_, modal_form_selector_, remove_from_);
      }
      /*else{
        console.log("calling mutation: ", element_id_)
        response = on_delete_callback_(element_id_, mutation_processMutationResponseCallback_, remove_from_)
      }*/
        
      console.log("+delete_scallback response: ", response)
      //if (response && on_change_callback && typeof on_change_callback === "function"){
      //  on_change_callback
      //}
  
  }
  
  return response
}

function contentCRUDread(element_id, get_from  = '#content_locations', as_string = false) {
  console.log("***CRUDreadElement - get_from: ", get_from, element_id, "as_string: ", as_string)
  
  element_id = isNumeric(element_id) || element_id.toString().includes("new_") ? element_id : element_id.data('id');
  console.log("element_id-1: ", element_id, typeof element_id, typeof element_id === "number" || typeof element_id === "string")
  let data = {}
  let find_selector = typeof element_id === "number" || typeof element_id === "string" ? "input[id="+element_id.toString()+"]" : element_id
  console.log("element_id-2: ", element_id, "find_selector: ", find_selector)
  element = $(get_from).find(find_selector).first()
  console.log("element-: ", element)
  
  if (as_string){
    console.log("get as_string")
    data = $(element).html()
  }
  else{
    console.log("get not as_string", element.attributes)
    
    data = getJSONinputData(get_from, element_id)
    if (!data || Object.keys(data).length === 0){
      data = $(element).data()
      if (!data || Object.keys(data).length === 0)
        data = getElementDataAttrs(element)
    }
    
  }
  
  return data
}

function getJSONinputData(content_selector, element_id){
  console.log("***getJSONinputData - content_selector: ", content_selector, "element_id: ", element_id)
  
  let data = null
  let input = $(content_selector).find("input[id='"+element_id.toString()+"']").first()
  
  if (input && $(input).length)
    data = JSON.parse($(input).val())
  console.log("input: ", input, "data: ", data)
  
  return data
}

function updateJSONinputValue(inputs, attr_or_data, value = null, content_selector = null, attrs_ = []){
  console.log("***updateJSONinputValue: ", inputs, "attr_or_data: ", attr_or_data, "value: ", value);
  
  let result = false;
  inputs = content_selector && (isNumeric(inputs) || inputs.toString().includes("new_")) ?  $(content_selector).find("input[type='hidden'][id='"+inputs.toString()+"']") : inputs;
  console.log("inputs: ", inputs)

  $(inputs).each(function(index){
    let input = $(this);
    console.log("input: ", input);
    
    if (attrs_){
      for (let [key, value] of attrs_) {
        if (attr_or_data.hasOwnProperty(key))
          input.attr(key, value)
      };
    }
    
    let data = JSON.parse(input.val());
    console.log("update-input: ", input, "current data: ", data, typeof attr_or_data, attr_or_data)
    if (typeof attr_or_data === "object")
      input.val(JSON.stringify(attr_or_data))
    else{
      if (data.hasOwnProperty(attr_or_data)){
        data[attr_or_data] = value
        input.val(JSON.stringify(data))
        result = true
      }
    }
      
  });
  
  console.log("+result inputs: ", inputs)
  return inputs
}

function contentCRUDIdExists(element_id, content_selector = "#content_locations"){
  console.log("***contentCRUDIdExists ", element_id, content_selector)

  if (element_id instanceof jQuery && element_id.length){ return true; }
  element_id = typeof element_id === "object" && element_id.hasOwnProperty("id") || element_id.id ? element_id.id : null;
  let result = false
  
  let input = null;
  if (element_id && content_selector){
    input = content_selector && (isNumeric(element_id) || element_id.toString().includes("new_")) ?  $(content_selector).find("input[type='hidden'][id='"+element_id.toString()+"']") : false;
    result = input && $(input).length ? input : null;
  }
  
  console.log("+result contentCRUDIdExists: ", element_id, input, result);
  return result;
}

function contentCRUDnewId(content_selector, elements = [], preffix = ""){
  if (content_selector){
    console.log("using content_selector...")
    let content_elements = content_selector && $(content_selector).length ? $(content_selector).find("input.new") : []
    elements = content_elements //elements && elements.length ? elements : content_elements
    console.log("elements: ", elements, "content_elements: ", content_elements)
  }
  let element_id = preffix + "new_" + (elements.length + 1).toString()
  return element_id
}

function contentCRUDgetId(element = null, content_selector = "#content_locations", on_fail_create_new_id = false, elements = [], preffix = ""){
  console.log("***contentCRUDgetId - content_selector", content_selector, "element: ", element, typeof element, "elements: ", elements)
  let element_id = null
  
  if (element && element !== ""){
      //console.log("element not null...", element, Object.keys(element))
      
      if (typeof element === "object" && !(element instanceof jQuery)){
        //console.log("FROM ID ATTR - newid-1...", !element.hasOwnProperty("id"), Object.keys(element), element.id, element.toString())
        element_id = element.hasOwnProperty("id") ? element.id : null //? element.id : preffix + "new_" + (element.length + 1).toString()
      }
      else if (isNumeric(element) || element.toString().includes("new_")){
        //console.log("FROM ELEMENT - newid-2...")
        element_id = element;
      }
      else{
        //console.log("FROM ID ATTR FROM JQUERY OBJ - newid-3...", element)
        element_id = $(element).attr("id") ? $(element).attr("id") : $(element).attr("data-id");
      }

  }
  //console.log("mid-element_id", element_id)

  if (!element_id && on_fail_create_new_id){
    element_id = contentCRUDnewId(content_selector, elements, preffix)
  }

  element_id = element_id && isNumeric(element_id) ? parseInt(element_id) : element_id;
  console.log("+result element_id: ", element_id)
  return element_id
}


function createJSONinput(data, content_selector, class_name, attrs_ = []){ //element_id, 
  console.log("***createJSONinput: ", data, content_selector, class_name, attrs_)
  var input = null;

  if (data){
    class_name = class_name ? class_name.replace("#", "").replace("s", "") : ""
    let form_group = $(content_selector) //.first() //+":first"
    let content_selector_class = content_selector.toString().replace(".", "").replace("#", "").replace("[", "").replace("]", "").replace("=", "").replace("'", "").replace(" ", "_").toLowerCase();
    
    //locations = locations && locations.length ? locations : $(content_selector).find("input.new")
    data.id = !data.hasOwnProperty("id") || !data.id ? contentCRUDnewId(content_selector) : data.id
    console.log("data save to input: ", data, "class_name: ", class_name)

    class_name = data.id && data.id.toString().includes("new_") && !class_name.includes("new ") ? "new "+class_name+" crud "+content_selector_class : class_name+" crud "+content_selector_class
    input = $("<input>", {id: data.id, name: data.id, class: class_name, type: "hidden"});

    if (attrs_){
      for (let [key, value] of attrs_) {
        if (data.hasOwnProperty(key))
          input.attr(key, value)
      };
    }

    form_group.append(input)
    console.log("input inserted: ", input, "class_name: ", class_name)
    
    input.val(JSON.stringify(data))
    console.log("input loaded: ", input)
  }

  return input
}

function contentCRUDdata(content_selector, data = {}, name = null){
  let results = []

  let inputs = $(content_selector).find("input")
  $(inputs).each(function(i) { //[updated='true'] //.location
    
    let input = $(this)
    console.log("input-i", i, input, input.val())
    console.log($(inputs).length)
    
    if(input.val()) {
        let data_ = JSON.parse(input.val())
        console.log("data_: ", data_)
        results.push(data_);
    }
  });
  
  if (name && data && !data.hasOwnProperty(name)){
    data[name] = results
    results = data
  }
  
  return results
}

function getElementDataAttrs(element, excludes = ["class"]){
  let data = {}
  let node = $(element).length ? $(element).get(0) : element;
  
  $.each(node.attributes, function(i, attrib){
    let name = attrib.name;
    let value = attrib.value;
    console.log("attr - name: ", name, "value: ", value);
    if (!excludes.includes(name))
      data[name] = value;
  });
  
  return data
}

function setElementDataAttrs(element, data){
  console.log("***setElementDataAttributes - element: ", element, "data: ", data)
  if (!data)
    return element

  //let node = $(element).length ? $(element).get(0) : element;
  for (const [name, value] of Object.entries(data)) {
    console.log("set attr - name: ", name, value)
    $(element).attr(name, value)
  };
  
  result = $(element).html()
  console.log("+result-se: ", result)
  return $(element).html()
}

function updateModal(element_id, modal_form_selector = "#location_modal_form", content_selector = "#content_locations", callback = null, master = {}){
  console.log("***updateModal - element_id: ", element_id, master);

  if (element_id.hasOwnProperty('originalEvent')){ //event
    let row = element_id.target //.parentElement
    element_id = contentCRUDgetId($(row)) //$(row) //.children("div").attr("id") //".row-reg"
    console.log("row: ", row, "element_id: " , element_id);
  }

  element_id = element_id && (isNumeric(element_id) || element_id.toString().includes("new_")) ? element_id : element_id.data('id');
  console.log("element_id: ", element_id)

  toggleModal(element_id, modal_form_selector = modal_form_selector, content_selector = content_selector, callback = callback, master = master)
}

/*function contentCRUDcreateModal(element, modal_form_selector = "#location_modal_form", content_selector = "#content_locations", callback = null){
  toggleModal(element, modal_form_selector = modal_form_selector, content_selector = content_selector, callback = callback)
}*/

function contentCRUDupdate(element_id, data, edit_from = '#content_locations', modal_form_selector = "#location_modal_form", postprocess_data_callback = null, on_change_callback = null, vue_var = null, mutation_callback = null) {
  console.log("***CRUDupdateElement - element_id: ", element_id, "edit_from: ", edit_from, modal_form_selector, "vue_var: ", vue_var);
  
  element_id = isNumeric(element_id) || element_id.toString().includes("new_") ? element_id : element_id.data('id');
  let response = true;
  let element = null;
  let find_selector = null;
  let modal_selector = getModalSelector(modal_form_selector)
  
  //if (mutation_callback && typeof mutation_callback === "function")
  //  response = mutation_callback(element_id)
  
  if (response){
    //always clean modal?
    console.log("data-2: ", data, "element_id: ", element_id);
    console.log("postprocess_data_callback: ", postprocess_data_callback);
    
    if (data && typeof data === "object" && (!data.hasOwnProperty("id") || !data.id) && element_id)
      data["id"] = element_id
    
    if (postprocess_data_callback && typeof postprocess_data_callback === "function"){
      console.log("A) postprocess_data_callback... - element_id", element_id);
      data_ = postprocess_data_callback(data, element_id, edit_from, modal_form_selector, response);
      has_processed_data = true;
    }
    else
      data_ = data
    console.log("data_3: ", data_)
    //element_id = has_processed_data ? $(data_).attr("id") : data_;

    console.log("typeof edit_from: ", typeof edit_from)
    if (vue_var){
      let objIndex = vue_var.findIndex((obj => obj.id == element_id));
      console.log("vue_var update: ", vue_var, "objIndex: ", objIndex, element_id); //, "vue_data: ", createObjsInData(data_, camelize = true))
      app_vue.$set(vue_var, objIndex, createObjsInData(data_, camelize = true)) //Object.assign({}, data_)
    }
    else if (typeof edit_from === "string"){
      find_selector = typeof element_id === "number" || typeof element_id === "string"  ? "[id="+element_id.toString()+"]" : element_id
      element = $(edit_from).find(find_selector).first()
      element.replaceWith(data_) //html(data_)
    }
    
    //console.log("modal_selector toggle...", modal_selector)
    //$(modal_selector).modal('toggle');
  }

  console.log("B) on_change_callback: ", on_change_callback)
  if (on_change_callback && typeof on_change_callback === "function")
    on_change_callback(edit_from, data, modal_form_selector, operation = "update");

  if ($(modal_selector+".modal.in, "+modal_selector+".modal.show").length)
      $(modal_selector).modal('toggle');
  
  console.log("C) contentCRUDUpdate - updateJSONinputValue...", edit_from);
  let inputs = updateJSONinputValue(element_id, data, null, edit_from);
  if (inputs && $(inputs).length)
    $(inputs).attr("updated", true);

  console.log("CONTENT-CRUD-UPDATE-FINISH...")
}

function processResponse(response){
  if (response.data.createNews){
    //addnewtotable(response.data.createNews.news);
    callback(response.data.createNews.news);
    if ($("#modal_new.modal.in, #modal_new.modal.show").length)
        $('#modal_new').modal('toggle');
  }
  else{
      Swal.fire(
          'Un error inesperado ha ocurrido!!',
          '',
          'error'
      )
  }
  $("#button_action_modalnew").attr("disabled", false);
}


function setDates(){
  var $date_fields = $("form").find("input[type='date'][name$='_date']");
  $date_fields.each(function(index, element){
    console.log("element: ", element, "val: ", $(element).attr("value"));
    if ($(element).attr("value")){
      //let parsedDate = $.datepicker.formatDate("mm/dd/yy", new Date($(element).attr("value")));
      $(element).val($(element).attr("value")).attr("value", $(element).attr("value"));
    }
    console.log("element-2: ", element, "val: ", $(element).attr("value"), $(element).val());
  })
}

function checkExtension(file, validFilesTypes = []) {
    console.log("***checkExtension: ", validFilesTypes);
    /*global document: false */
    const validFilesTypes_ = validFilesTypes;
    var office_exts = ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "vnd.ms-excel", "msword"];
    if (typeof validFilesTypes === "string")
      if (validFilesTypes == "images")
        validFilesTypes = ["bmp", "gif", "png", "jpg", "jpeg", "svg", "webp"];
      else if (validFilesTypes == "files")
        validFilesTypes = office_exts.concat(["rar", "zip", "txt", "pdf", "csv", "plain"]);
      else{
        console.warn("Warning: not in custom valid types: ", validFilesTypes);
        validFilesTypes = [validFilesTypes]
      }
      
    var filePath = file.value;
    var ext = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
    const ext_type_ = file.files[0].type.toString();
    var ext_type = file.files[0].type.toString().includes("/") ? file.files[0].type.toString().split("/")[1] : file.files[0].type.toString();
    
    console.log("ext_type_: ", ext_type_, ext_type_.toString().startsWith("vnd.openxmlformats-officedocument"));
    const is_office = ext_type.toString().startsWith("vnd.openxmlformats-officedocument") || ext_type in office_exts;
    console.log("is_office: ", is_office);
    if (is_office && ext_type_.toString().endsWith(".presentation")){
      ext_type = "ppt";
    }

    var isValidFile = false;
    
    console.log("ext_type: ", ext_type, "file.files[0].type: ", file.files[0].type, file, file.type, file.type.toString(), "validFilesTypes: ", validFilesTypes);
    if (validFilesTypes_ == "files" && is_office)
      isValidFile = true;
    else
      for (var i = 0; i < validFilesTypes.length; i++) {
          if (ext_type == validFilesTypes[i] || ext_type.endsWith(validFilesTypes[i])) { //ext
              isValidFile = true;
              break;
          }
      }

    if (!isValidFile) {
        file.value = null;
        console.log("Invalid File. Valid extensions are:\n\n" + validFilesTypes.join(", "));
    }

    return isValidFile;
}

//var validFileSize = 15 * 1024 * 1024;

function checkFileSize(file, validFileSizeMB) {
    /*global document: false */
    validFileSize = validFileSizeMB ? validFileSizeMB * 1024 * 1024: validFileSizeMB;
    var fileSize = file.files[0].size;
    var isValidFile = false;
    console.log("fileSize: ", fileSize / 1024 * 1024, "validFileSizeMB: ", validFileSizeMB);
    if (fileSize !== 0 && (!validFileSize || fileSize <= validFileSize)) {
        isValidFile = true;
    }
    else {
        file.value = null;
        console.log("File Size Should be Greater than 0 and less than "+validFileSize.toString()+" MB.");
    }
    return isValidFile;
}

function checkFileFormat(file, validFilesTypes = [], validFileSize = null) {
  var isValidFile = validFilesTypes && validFilesTypes.length ? checkExtension(file, validFilesTypes) : true;

  if (isValidFile)
      isValidFile = checkFileSize(file, validFileSize);

  return isValidFile;
}

function checkFile(input_file_element, validFilesTypes = [], vue_var = null, validFileSizeMB = setting_max_file_size_mb){
  console.log("***checkFile - input_file_element: ", input_file_element, validFilesTypes);
  console.log("input_file_element.files: ", input_file_element.files, "input_file_element.files.length: ", input_file_element.files.length, "val: ", input_file_element.value);
  // Check file selected or not
  var msg_error = false;
  if (input_file_element && input_file_element.files.length){
      console.log("file: ", input_file_element.files[0], "vue_var: ", vue_var);
      
      let file_already_exists = vue_var ? vue_var.findIndex((obj => obj.name == input_file_element.files[0].name)) : true;
      console.log("file_already_exists: ", file_already_exists);
      
      if(file_already_exists != -1) 
        msg_error = 'Archivo agregado previamente';
      else{
        let is_valid_file = checkFileFormat(input_file_element, validFilesTypes, validFileSizeMB);
        console.log("is_valid_file: ", is_valid_file);
        if (!is_valid_file) { 
          if (validFileSizeMB)
            msg_error = 'Seleccione un archivo de tamaño (<'+validFileSizeMB.toString()+'MB) y formato valido';
          else
            msg_error = 'Seleccione un archivo de tamaño y formato valido'; 
        }
      }
      
  } else { msg_error = 'Seleccione un archivo'; }

  return msg_error;
}


function loadInputTable(container_selector = "[name='productpricing']", vue_var = null, data_vue_var_name = null, row_template = null, input_container_id = null, btn_add_class = '.btn_add', btn_del_class = '.btn_del'){
  console.log("***loadInputTable start...", container_selector, "vue_var: ", vue_var);
  
  //CHECK
  input_container_selector = !input_container_id ? $(container_selector).find(btn_add_class).parents(".input-group").first() : input_container_id; //.attr("name")+"']" : input_container_id;
  console.log("input_container_id: ", input_container_id, btn_add_class, $(container_selector).find(btn_add_class));
  if (!input_container_selector)
    console.log("Error: no input-group / input_container_id detected in DOM...", container_selector, input_container_selector);
  
  //FIRST LOAD
  if(vue_var && vue_var.length){
    
    let vue_var_name = typeof vue_var === "string" ? vue_var : $(container_selector).attr("vue-var-name");
    console.log("vue_var-name-1: ", vue_var_name, typeof vue_var === "string", vue_var);
    
    if (vue_var_name)
      vue_var = app_vue[vue_var_name];
    
    //VUE INSERT
    if (data_vue_var_name && row_template){
      vue_component = createVueComponent({data_vue_var_name: row_template}, vue_var, $(container_selector).find("tbody"));
      
      // Load a customMethod on the component for processing row
      /*vue_component.customMethod = function(element) {
        // Check data-default value
        console.log('Custom method loaded later and invoked by element:', element);
        let default_ = $(element).attr("data-default");
        //if (default_ && $(element).attr("data-default");)
          
      };*/
    }
    else{
      //MANUAL INSERT
      for (var i = 0; i < vue_var.length; i++) {
        let row = $(container_selector).find("tbody > tr").first().clone();
        let row_index = $(container_selector).find("tbody > tr").length;
        let reg = vue_var[i];
        
        console.log("fit-row-bf: ", row, reg);
        row = renderForm(row, reg);
        console.log("fit-row-af: ", row, reg);
        
        row = $(row).attr("data-id", reg["id"]);
        row = $(row).attr("data-index", row_index);
        row = $(row).find("[data-id]").attr("data-id", reg["id"]);
        row = $(row).find("[data-index]").attr("data-index", row_index);
        $(container_selector).find("tbody").append(row);
      }
    }
    console.log("result vue_var after add-1: ", vue_var);
    //formClean(input_container_selector);
  }
  
  //ADD BTN
  console.log("add-btn: ", container_selector, $(container_selector).find(btn_add_class))
  $(container_selector).find(btn_add_class).unbind();
  $(container_selector).on('click', btn_add_class, function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    console.log("btn_add CLICK - e :", e, "container_selector: ", container_selector, "input_container_selector: ", input_container_selector);
    
    let input_id = $(input_container_selector).attr("id");
    console.log("input_container_selector input_id: ", input_id, typeof input_id, typeof input_container_selector);
    if (input_id)
      input_container_selector = typeof input_container_selector === "string" ? input_container_selector : container_selector+" #"+input_id;
    else if (input_id.length != 1)
      console.log("ERROR--18: MULTI container_selector found, use unique id in DOM... input_id: ", input_id);
    else
      console.log("ERROR--19: container_selector not found, check id in DOM... input_id: ", input_id);
    console.log("input_container_selector: ", input_container_selector);
    
    let row = getFormData(input_container_selector);
    console.log("loadInputTable row: ", row);
    
    if(vue_var){
      let vue_var_name = typeof vue_var === "string" ? vue_var : $(container_selector).attr("vue-var-name");
      console.log("vue_var-name: ", vue_var_name);
      if (vue_var_name){
        vue_var = app_vue[vue_var_name]; 
        //app_vue[vue_var_name].push(row);
      }
      //else
      console.log("vue_var pre add: ", vue_var, app_vue[vue_var_name]);
      vue_var.push(row);
      console.log("result vue_var after add: ", vue_var);
      //formClean(input_container_selector);
    }
    else{
      console.warn("Warning: No vue_var for adding rows, adding empty row to table...");
      row = $(container_selector).find("tbody > tr").first().clone();
      console.log("row-bs: ", container_selector, row, row.attr("class"));
      let row_index = row.length;
      $(row).attr("data-id", row_index);
      console.log("row-as: ", row, row.attr("class"), row.attr("data-id"), row_index);
      $(row).attr("data-index", row_index);
      $(row).find("[data-id]").attr("data-id", row_index);
      $(row).find("[data-index]").attr("data-index", row_index);
      console.log("container_selector: ", container_selector, $(container_selector).find("tbody"), row, row_index)
      $(container_selector).find("tbody").append(row);
    }
    
  });
  
  //DEL BTN
  $(container_selector).find(btn_del_class).unbind();
  $(container_selector).on('click', btn_del_class, function(e) {
    e.preventDefault();
    console.log("btn_del clieck: ", e);
    //$(this).closest("tr").remove();
    let id = $(this).data('index');
    id = id ? parseInt(id) : id;
    if (!id)
      console.log("Error: no data-index added to element in DOM...", container_selector);
    //let objIndex = app_vue.pricing.findIndex((obj => obj.id == element_id));
    //console.log("vue_var delete: ", vue_var, "objIndex-d: ", objIndex, element_id)
    let vue_var_name = typeof vue_var === "string" ? vue_var : $(container_selector).attr("vue-var-name");
    console.log("vue_var_name: ", vue_var_name);
    if (vue_var_name)
      app_vue.$delete(app_vue[vue_var_name], id);
    else if (vue_var && id)
      app_vue.$delete(vue_var, id);
    else{
      console.log("remove: ", $(this).parents("tr").first());
      $(this).parents("tr").first().remove();
    }
    console.log("loadInputTable del id: ", id, container_selector);
  });
  
  //loadFormPlugins(container_selector);
}

function getAllFiles(entity, entity_id, vue_var, gql_files_set_name = null, is_staff = false){
  console.log("***getAllFiles: ", entity, entity_id, vue_var, gql_files_set_name, use_set_name_as_entity, is_staff);
  
  let file_type = gql_files_set_name != "images" ? "file" : "image"; //gql_files_set_name.slice(0, -1);
  entity = entity.indexOf("_") != -1 ? toCamelCase(entity) : entity; //camelize(entity) : entity;
  
  var use_set_name_as_entity = typeof entity_id === "object";
  var filters = {}
  var custom_filters = []
  if (typeof entity_id === "object")
    for (const [key, value] of Object.entries(entity_id)) {
      filters[key] = key.toString().endsWith("_id") || key == "id" ? parseInt(value) : value;
      if (key != "id" && value != null)
        custom_filters.push(key);
    }
  else
    filters = {"id": parseInt(entity_id)}
  console.log("filters: ", filters, "gql_files_set_name: ", gql_files_set_name, "custom_filters: ", custom_filters);
  
  if (use_set_name_as_entity){ // && !gql_files_set_name
    query_filters = "$filters: GenericScalar!";
    entity_filters = "filters: $filters";
    filters = {"filters": filters};
    for (var i = 0; i < custom_filters.length; i++) {
      let custom_filter = custom_filters[i];
      custom_filter = toCamelCase(custom_filter)
      console.log("custom_filter: ", custom_filter);
      if (custom_filter.toString().endsWith("Id")){
        custom_filter = custom_filter.replace("Id", "") + "{id}";
      }
      custom_filters[i] = custom_filter;
    }
  }
  else{
    query_filters = "$id: Int!";
    entity_filters = "id: $id";
  }
  
  var query = `
  query(%query_filters%) {
    %entity%(%entity_filters%) {`
  if (!use_set_name_as_entity) //gql_files_set_name
    query += `
      %gql_files_set_name%Set{`
  query += `
        id
        name
        %file_type%
        %custom_filters%`
  if (!use_set_name_as_entity)
    query += `
      }`
  query += `  }
  }`;
  console.log("query: ", query);

  query = !use_set_name_as_entity ? query.replace("%entity%", entity) : query.replace("%entity%", gql_files_set_name.replace("Set", ""));
  query = query.replace("%gql_files_set_name%", gql_files_set_name).replace("%file_type%", file_type);
  query = query.replace("%query_filters%", query_filters).replace("%entity_filters%", entity_filters)
  query = custom_filters && custom_filters.length ? query.replace("%custom_filters%", custom_filters.join(" ")) : query.replace("%custom_filters%", "");
  //console.log("getAllFiles-query: ", query, "entity: ", entity, "entity_id: ", entity_id,gql_files_set_name);
  
  console.log("query: ", query, filters);
  DP_functs.getQuery(query, filters, function (response) {
    console.log("getAllFiles-response: ", response, "entity: ", entity, "entity_id: ", entity_id, gql_files_set_name, use_set_name_as_entity);
    
    let data = [];
    if (!use_set_name_as_entity){
      console.log("if-1...");
      gql_files_set_name = gql_files_set_name.endsWith("Set") ? gql_files_set_name : gql_files_set_name+"Set";
      console.log("gql_files_set_name: ", gql_files_set_name, response && typeof response === "object" && Object.keys(response).includes(entity) && response[entity]);
      data = response && typeof response === "object" && Object.keys(response).includes(entity) && response[entity] ? response[entity][gql_files_set_name] : [];
    }
    else {
      console.log("if-2...");
      data = response && typeof response === "object" && Object.keys(response).includes(gql_files_set_name) && response[gql_files_set_name] ? response[gql_files_set_name] : [];
      for (var i = 0; i < data.length; i++) {
        row = data[i];
        if (row && typeof row === "object" && Object.keys(row).includes(entity) && response[entity]){
          let key_val = row[entity]["id"];
          let key_ = toUncamelize(entity)+"_id";
          data[i][key] =  key_val;
        }
      }
      
    }
    console.log("vue_var set data-response: ", data, "vue_var.length: ", vue_var.length);
    
    if (vue_var.length != 0){
      //You need to empty the array:
      vue_var.splice(0, vue_var.length);
    }
    
    for (var i = 0; i < data.length; i++) {
      let skip = false;
      console.log("if-is_staff: ", is_staff, data[i], !is_staff, Object.keys(data[i]).includes("is_staff") && data[i]["is_staff"] == true);
      
      /*if (!is_staff && Object.keys(data[i]).includes("is_staff") && data[i]["is_staff"] == true) 
        console.log("pass");
      else if (custom_filters && custom_filters.length){
        custom_filters.every(custom_filter => {
          if (Object.keys(data[i]).includes(custom_filter) && filters[custom_filter] != data[i][custom_filter]){
            skip = true;
            return false;
          }
          else
            return true;
        });
      }*/
      console.log("skip: ", skip);
      
      if (!skip){
        vue_var.push(data[i]);
        console.log("added: ", data[i], vue_var);
      }
      else
        console.log("skipped: ", data[i], vue_var);
    }
    
    console.log("vue_var after-set: ", vue_var);
  });
}

function loadFileInputTable(entity, vue_var, entity_id=null, file_type="all", form_file_selector="#f-files", url_preffix = '/enterprise/', csrf=null, form_class=null, gql_files_set_name = null, start_get_files = false, is_staff = false, t_files_selector = null, input_container_id = null, btn_upload_class = ".btn-upload", btn_del_class = ".btn-del"){
  console.log("***loadFileInputTable-1: ", entity, entity_id, vue_var, is_staff); //, csrf
  //input_container_selector = !input_container_id ? "[name='"+$(container_selector).find(btn_add_class).parents(".input-group").attr("name")+"']" : input_container_id;
  
  console.log("form csrf: ", csrf, $(form_file_selector.toString()+" input[name='csrfmiddlewaretoken']"), $(form_file_selector.toString()+" input[name='csrfmiddlewaretoken']").val());
  if (csrf && !$(form_file_selector.toString()+" input[name='csrfmiddlewaretoken']").val()){
    let $fd =$(form_file_selector).first();
    csrf = csrf ? csrf : $(form_file_selector.toString()+" input[name='csrfmiddlewaretoken']").val();
    console.log("token-1: ", csrf, $fd);
    if ($fd && csrf)
      $fd.append('<input type="hidden" name="csrfmiddlewaretoken" value="'+csrf+'">');
  }
  
  var container_selector = $(form_file_selector).parent();
  console.log("***loadFileInputTable-2: ", entity, entity_id, container_selector, file_type, vue_var);
  
  var file_type_pl = file_type == "all" ? "files" : file_type + "s";
  gql_files_set_name = gql_files_set_name == null ? file_type_pl : gql_files_set_name;
  t_files_selector = !t_files_selector ? "#t-"+file_type_pl : t_files_selector;
  
  if (start_get_files && vue_var.length == 0)
    getAllFiles(entity, entity_id, vue_var, gql_files_set_name, is_staff = is_staff);
  
  $(container_selector).find('.custom-file-input').change(function(){
    var pattern = /\\/;
    var name = $(this).val().split(pattern)
    value = name[name.length - 1]
    // $(this).closest('.custom-file').find('.custom-file-label').text(value)
    console.log("tr val set...");
    $(this).closest('tr').find('input.name').val(value)
    console.log("tr val set...");
  });
  
  console.log("form_class-1: ", form_class);
  loadInputFile(entity, vue_var, entity_id, file_type, form_file_selector, url_preffix, form_class, gql_files_set_name, is_staff, container_selector, btn_upload_class);
  
  var new_rows = $(container_selector).find(btn_del_class).not(".file_input_loaded");
  //new_rows.unbind();
  console.log("del btn: ", $(container_selector).find(btn_del_class), "$(container_selector): ", $(container_selector), "btn_del_class: ", btn_del_class, "results ", $(btn_del_class+" :not(.file_input_loaded)"), "new_rows ", new_rows);
  
  //BUTTON-DELETE
  $(container_selector).find(btn_del_class).unbind();
  $(container_selector).on('click', btn_del_class, function(_event_) {
    _event_.preventDefault();
    //_event_.stopImmediatePropagation();
    console.log("loadFileInputTable - CLICK btn_del_class! eliminar - event: ", _event_, "$(this): ", $(this), "t_files_selector: ", t_files_selector, "$(_event_.currentTarget).data('index'): ", $(_event_.currentTarget).data('index'), "$(t_files_selector): ", $(t_files_selector), "$(t_files_selector).find(btn_del_class): ", $(t_files_selector).find(btn_del_class));
    
    var _id_= $(t_files_selector).find(btn_del_class)[$(_event_.currentTarget).data('index').toString()]; //$(this).data('id');
    console.log("t-files: ", $(t_files_selector).find(btn_del_class), "init id: ", _id_);
    //let t_files_id = $("#t-files").find(btn_del_class)[$(_event_.currentTarget).data('index').toString()].data('id');
    //console.log("t_files_id: ", t_files_id,  $("#t-files").find(btn_del_class), $(_event_.currentTarget).data('index').toString())
    
    _id_ = $(_event_.currentTarget).attr('data-id') //$(_id_).data('id');
    console.log("before send id_: ", _id_, "e_id: ", $(_event_.currentTarget).data('id'), $(container_selector).find(btn_del_class["data-id='"+$(_event_.currentTarget).data('id').toString()+"'"]), "att_data_id: ", $(_event_.currentTarget).attr('data-id'), $(this).attr('data-id')); //, "t-files-id", t_files_id
    
    files_del_call_(entity, entity_id, _id_, vue_var, file_type_pl, gql_files_set_name, is_staff, container_selector, form_file_selector, url_preffix, btn_del_class);
    new_rows.addClass("file_input_loaded");
    
  });
  
}


function loadInputFile(entity, vue_var = null, entity_id = null, file_type="all", form_file_selector="#f-files", url_preffix = null, form_class=null, gql_files_set_name=null, is_staff=false, container_selector = null, btn_upload_class = "btn-upload"){
  console.log("***loadInputFile: ", entity, entity_id, vue_var, form_file_selector, typeof form_file_selector, container_selector);
  var file_type_pl = file_type == "all" ? "files" : file_type + "s";
  let has_container = container_selector ? true : false;
  container_selector = !has_container ? form_file_selector : container_selector;
  
  var csrf = $(form_file_selector.toString()+" input[name='csrfmiddlewaretoken']").val();
  if (!csrf)
    console.warn("Warning: NO CSRF in form ?...", form_file_selector);
  else
    console.log("INFO: CSRF OK!...", form_file_selector);
  console.log("csrf: ", csrf);
  
  $(container_selector).find(btn_upload_class).unbind();
  console.log("upload btn: ", container_selector, $(container_selector).find(btn_upload_class), "$(container_selector): ", $(container_selector), "btn_upload_class: ", btn_upload_class);
  $(container_selector).on('click', btn_upload_class, function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    
    console.log("loadFileInputTable - CLICK btn_upload_class!! - form_file_selector: ", form_file_selector)
    var files = $(form_file_selector).find("input[type='file']")[0]; //.files
    msg_error = file_type == "all" ? false : checkFile(files, file_type_pl, vue_var);
    console.log("msg_error: ", msg_error, file_type);
    
    if(msg_error){
      messageAlert('Actualizar Archivos', msg_error, 'error', refresh_page = false, cancel_text = null)
    }
    else if (files.files[0]) {
      console.log("uploading - files: ", files, files.files[0]);
      var entity_id_name = entity+"_id"; //"pk" //!url_preffix ? "pk" : entity.toString()+"_id";
      console.log("entity: ", entity, entity_id_name);
      
      /*csrf = $(form_file_selector.toString()+" input[name='csrfmiddlewaretoken']").val();
      csrf = csrf ? csrf : $(form_file_selector).parents("form").find("input[name='csrfmiddlewaretoken']").val();
      let csrf_by_name = $(document).find("input[name='csrfmiddlewaretoken']").first().val()
      csrf = !csrf && csrf_by_name ? csrf_by_name : csrf;
      console.log("token-2: ", csrf);
      fd.append('csrfmiddlewaretoken', csrf);*/
      
      //add btn-class to form_type
      let form_type =  $(form_file_selector+" input[name='form_type']").val();
      console.log("form_type: ", form_type);
      //fd.append('form_type', form_type);
      //let entity_id = $(form_file_selector+" input[name='"+entity_id_name.toString()+"']").val()
      
      const fd = new FormData();
      let inputs = {
        type: 'POST',
        enctype: 'multipart/form-data',
        data: fd,
        cache: false,
        contentType: false,
        processData: false,
        //dataType: "json",
        beforeSend: function(xhr) {
          console.log("set xhr...")
          let csrf = $(form_file_selector.toString()+" input[name='csrfmiddlewaretoken']").val();
          csrf = csrf ? csrf : $(form_file_selector).parents("form").find("input[name='csrfmiddlewaretoken']").val();
          let csrf_by_name = $(document).find("input[name='csrfmiddlewaretoken']").first().val()
          csrf = !csrf && csrf_by_name ? csrf_by_name : csrf;
          //console.log("token-4: ", csrf);
          xhr.setRequestHeader("X-CSRFToken", csrf);
        },
        success: function(response){
          console.log("upload file response: ", response, file_type, files, gql_files_set_name, is_staff);
          if (response && response.status)
            getAllFiles(entity, entity_id, vue_var, gql_files_set_name, is_staff=is_staff);
          else{
            console.log("error on file-call...", response.error);
            messageAlert('Subir Archivos', 'ocurrio un error durante el proceso, por favor intente denuevo más tarde', 'error', refresh_page = false, cancel_text = null);
          }
          $(files).val("");
          $(form_file_selector).find("#label_"+file_type).html("Seleccionar archivo");
          stopSpinWheel();
        },
        error: function(response){
          console.log("error on file-call-2...", response.error);
          messageAlert('Subir Archivos', 'ocurrio un error durante el proceso, por favor intente denuevo más tarde', 'error', refresh_page = false, cancel_text = null)
          stopSpinWheel();
        }
      }
      
      //if (!url_preffix)
        //fd.append("model", toCamelCase(entity, true));
      //URL
      if (typeof entity_id === "object"){
        var entity_id_ = null;
        for (const [key, value] of Object.entries(entity_id)) {
          if (entity == key.toString().replace("_id", ""))
            entity_id_ = value;
        }
        if (!entity_id_)
          console.warn("CHECK: no entity_id found?: ", entity_id, entity_id_);
        console.log("entity_id: ", entity_id, entity_id_, url_preffix);
        inputs["url"] = url_preffix + entity_id_ + "/"+file_type_pl+"/update/";
        fd.append(entity_id_name, entity_id_);
      }
      else{
        inputs["url"] = url_preffix + entity_id + "/"+file_type_pl+"/update/";
        fd.append(entity_id_name, entity_id);
      }
      
      //POST-DATA
      file_type = file_type == "all" ? "file" : file_type;
      console.log("file_type: ", file_type)
      fd.append(file_type, files.files[0]);
      console.log("fd: ", fd)
      inputs["data"] = fd;

      console.log("ainputs-url: ", inputs["url"]);
      console.log("ainputs-entity_id_name: ", entity_id_name, "entity_id: ", entity_id, fd)
      
      loadSpinWheel(null, ["Subiendo archivo..."])
      $.ajax(inputs); 
    } 
  });
  
  console.log("form_class-2: ", form_class);
  if (form_class)
    $(form_file_selector).addClass(form_class);
  
}

function files_del_call_(entity, entity_id, id_, vue_var, file_type_pl, gql_files_set_name=null, is_staff=false, container_selector = null, form_file_selector="#f-files", url_preffix = null, btn_del_class = ".btn-del"){ 
  console.log("***files_del_call_", entity, entity_id, id_, file_type_pl);
  
  var url = url_preffix.toString() + id_ +'/'+file_type_pl.toString()+'/update/';
  console.log("final-url: ", url, $(this), $(this).data("index"),  $(this).data("id"));
  //var index = $(this).data("index") ?  $(this).data("index") :  $(this).data("id");
  var new_rows = $(container_selector).find(btn_del_class).not(".file_input_loaded");
  console.log("files_del_call_ - id_: ", id_, "file_type_pl: ", file_type_pl, "url: ", url);
  console.log("del row-data-index: ", id_, "new_rows: ", new_rows);
  
  if (!url_preffix){
    var fd = new FormData();
    fd.append("pk", id_);
    fd.append("model", toCamelCase(entity, true));
  }
  
  $.ajax({
      url: url,
      type: 'delete',
      data: {}, //fd
      contentType: false,
      processData: false,
      beforeSend: function(xhr) {
        console.log("set x-c...")
        let csrf = $(form_file_selector.toString()+" input[name='csrfmiddlewaretoken']").val();
        csrf = csrf ? csrf : $(form_file_selector).parents("form").find("input[name='csrfmiddlewaretoken']").val();
        let csrf_by_name = $(document).find("input[name='csrfmiddlewaretoken']").first().val()
        csrf = !csrf && csrf_by_name ? csrf_by_name : csrf;
        //console.log("token-3: ", csrf);
        xhr.setRequestHeader("X-CSRFToken", csrf);
      },
      success: function(response){
        console.log("delete file response: ", response);
        if (response && response.status){ // 
          
          if (!response.status)
            console.log("error on del-2...", response.error);
          
          getAllFiles(entity, entity_id, vue_var, gql_files_set_name, is_staff=is_staff);
          
          /*
          let objIndex = vue_var.findIndex((obj => obj.id == id));
          console.log("vue_var delete: ", vue_var, "objIndex-d: ", objIndex, "id: ", id)
          if (objIndex != -1)
            app_vue.$delete(vue_var, objIndex)
          else{
            //objIndex = index;
            //console.log("vue_var delete-2: ", vue_var, "objIndex-d-2: ", objIndex);
            //app_vue.$delete(vue_var, objIndex)
            console.warn("Warning: error deleting file, id not found: ", id, vue_var)
          }*/
          
        }
        else{
          
          console.log("error on del-4...", response.error, "id_: ", id_, "vue_var: ", vue_var);
          //messageAlert('Eliminar Archivos', 'ocurrio un error durante el proceso, por favor intente denuevo más tarde', 'error', refresh_page = false, cancel_text = null)
          let objIndex = vue_var.findIndex((obj => obj.id == id_));
          console.log("vue_var-4 delete: ", vue_var, "objIndex-d-4: ", objIndex, "id_: ", id_)
          if (objIndex != -1)
            app_vue.$delete(vue_var, objIndex)
          
        }
      },
      error: function(data, textStatus, jqXHR) {
        console.log("error on del-4...")
        messageAlert('Eliminar Archivos', 'ocurrio un error durante el proceso, por favor intente denuevo más tarde', 'error', refresh_page = false, cancel_text = null)
      }
  });
}



function loadParsleyRules(form_selector, rules_obj){
  console.log("***loadParsleyRules: ", form_selector, rules_obj);
  var element_selector = "input, select, textarea";
  var input_elements = $(form_selector).find(element_selector);
  console.log("input_elements: ", $(form_selector).find(element_selector));
  
  for (const [name, value] of Object.entries(rules_obj)) {
    let element = $(form_selector).find("[name='"+name.toString()+"']"); //input_elements.find("[name='"+name.toString()+"']");
    console.log("name: ", name, element, value);
    if (typeof value === "object" && Object.keys(value).includes("required") && value["required"])
      $(element).attr("required", "required");
  }
}

function httpRequest(method, data, url, csrf = null, fields = []){
  const formData = new FormData();
  method = method.toString().toUpperCase();
  let exclude_ = ["password", "passwordRepeat", "password_repeat"];

  //TODO: 
  if (typeof data === "string"){
    //let exclude = method == "GET" ? "password" : [];
    data = getFormData(data, [], {}, exclude = exclude_);
  }
  
  for (const [name, value] of Object.entries(data)) {
    if (fields && fields.length && !fields.includes(name)) {}
    else if (method == "GET" && exclude_ && exclude_.length && exclude_.includes(name)) {}
    else
      formData.append(name, value);
    
    /*formData.append("accountnum", 123456); // number 123456 is immediately converted to a string "123456"

    // HTML file input, chosen by user
    formData.append("userfile", fileInputElement.files[0]);

    // JavaScript file-like object
    const content = '<q id="a"><span id="b">hey!</span></q>'; // the body of the new file…
    const blob = new Blob([content], { method: "text/xml"});
    
    formData.append("webmasterfile", blob);*/
  }
  
  let request = new XMLHttpRequest();
  request.open(method, url); //toUpper, true

  if (method == "POST"){
    /*if (Object.keys(data).includes("csrf")){
    
    }
    else */
    console.log("csrf-1: ", csrf);
    csrf = csrf && (csrf.toString().startsWith(".") || csrf.toString().startsWith("#")) ? getFormCSRF(csrf) : csrf;
    
    console.log("csrf-2: ", csrf);
    if (csrf){
      console.log("added...");
      //csrf = typeof === "string" ? csrf : $(csrf).
      request.setRequestHeader("X-CSRFToken", csrf); //, form
    }
    else
      console.warn("WARNING: no crf to add...");
  }
  
  request.send(formData);
}

function preventPostBackError(){
  //PREVENT POST REQUEST ERROR WHEN CLICKING BACK BUTTON AFTER THIS PAGE
  if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
  }
}

function httpSubmitRequest(method, url, data = {}, csrf = null, timeout_secs = null, fields = [], callback = null){
  var form = '';
  method = method.toString().toUpperCase();
  let exclude_ = ["password", "passwordRepeat", "password_repeat"];
  
  if (data){
    
    if (typeof data === "string"){
      //let exclude = method == "GET" ? "password" : [];
      data = getFormData(data, [], {}, exclude = exclude_);
    }
    
    $.each(data, function( name, value ) {
        if (fields && fields.length && !fields.includes(name)) {}
        else if (method == "GET" && exclude_ && exclude_.length && exclude_.includes(name)) {}
        else{
          let stringify = value && typeof value === "object" && value.toString().includes("[object") ? true : false;
          console.log("stringify: ", stringify, value, typeof value);
          if (value)
            console.log("value: ", value, typeof value, value.toString(), value.toString().includes("[object"));
          value = stringify == true ? JSON.stringify(value) : value;
          //value = value && value.toString().includes('"') ? value.toString().replace(/\"/g, '\\"') : value;
          if (stringify == true){
            console.log("input-1...")
            form += "<input type='hidden' name='"+name+"' value='"+value+"'>";
          }
          else{
            console.log("input-2...")
            form += '<input type="hidden" name="'+name+'" value="'+value+'">';
          }
        }
        console.log("form-httpsub: ", form);
    });
  }
  
  if (method == "POST"){
    console.log("csrf-1: ", csrf, url);
    csrf = csrf && (csrf.toString().startsWith(".") || csrf.toString().startsWith("#")) ? getFormCSRF(csrf) : csrf;
    
    console.log("csrf-2: ", csrf, url);
    if (csrf){
      console.log("added...");
      form += '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrf+'">';
    }
    else
      console.warn("WARNING: no crf to add...");
  }
  
  if (!timeout_secs)
    $('<form action="' + url + '" method="'+method+'">' + form + '</form>').appendTo($(document.body)).submit();
  else{
    window.setTimeout(() => {
      $('<form action="' + url + '" method="'+method+'">' + form + '</form>').appendTo($(document.body)).submit();
    }, 1000*timeout_secs) // 1 seg = 1000
  }
}

function loadLoadingDots(jq_selector){
  html = '';
  html += '<ul class="loading">';
  html += '<li> </li>';
  html += '<li> </li>';
  html += '<li> </li>';
  html += '<li> </li>';
  html += '</ul>';
  $(jq_selector).append(html);
}

function getFormCSRF(form_selector = null){
  let csrf = null;
  //console.log("form_selector: ", form_selector, typeof form_selector);
  form_selector = form_selector && typeof form_selector === "string" && (!form_selector.toString().startsWith("#") && !form_selector.toString().startsWith(".")) ? "#"+form_selector : form_selector;
  
  if (form_selector){
    csrf = form_selector instanceof jQuery ? $(form_selector).find("input[name='csrfmiddlewaretoken']").first().val() : $(form_selector.toString()).find("input[name='csrfmiddlewaretoken']").first().val();
    //console.log("me-1: ", csrf, typeof csrf);
    csrf = csrf ? csrf : $(form_selector).parents("form").find("input[name='csrfmiddlewaretoken']").first().val();
    //console.log("me-2: ", csrf, typeof csrf, !csrf);
    
    let csrf_by_name = $(document).find("input[name='csrfmiddlewaretoken']").first().val()
    csrf = !csrf && csrf_by_name ? csrf_by_name : csrf;
  }
  //console.log("me-3: ", csrf, typeof csrf);
  
  csrf = !csrf ? $(document.getElementsByName('csrfmiddlewaretoken')).first().val() : csrf;
  //console.log("re: ", csrf, typeof csrf);
  return csrf
}

function loadBoxShadowSelector(selector = "#plan_selector", default_value = null, submit_btn_selector = null, callback = null, class_selector = ".box-shadow-hover"){
  
  selector = selector.startsWith("#") ? selector : "#"+selector;
  class_selector = class_selector.startsWith(".") ? class_selector : "."+class_selector;
  submit_btn_selector = $(submit_btn_selector);
  var input_selector = $(selector).find("input[type=hidden]");
  
  /*$(selector).addEventListener('val', function(event) {
    event.preventDefault();
    console.log("selected: ",  $(this).find(".selected"), event);
    let value_ = $(this).find(".selected").data("value");
    console.log("s-value: ", value);
    return value_;
  });*/
  
  $(selector).find(class_selector).click( function(){
    console.log("CLICK!!!!!!!!!!!!!!!!!");
    
    var plans = [];
    $(selector).find(class_selector).each(function(elm){
      plans.push($(this).attr("id"));
    });
    console.log("plans: ", plans);
    
    var selected_plan = $(this).attr("id") //.split("-")[1]; //.data("id")
    var selected_val = $(this).data("value");
    console.log("selected-plan: ", selected_plan)
    
    for (var i = 0; i < plans.length; i++) {
      let plan_ = plans[i];
      if (selected_plan == plan_){ //selected
        $("#"+plan_).find(".card").css('background-color', 'rgb(163, 157, 210)')
        $('#'+plan_).find(".text-plan").css('color', '#fff')
        $('#'+plan_).find(".text-muted").removeClass("text-muted");
        $('#'+plan_).addClass("selected");
        $(input_selector).val(selected_plan.replace("card-", ""))
      }
      else{ //unselected
        $("#"+plan_).find(".card").css('background-color', '#fff')
        $("#"+plan_).find(".text-plan").css('color', '#9E9E9E')
        $("#"+plan_).removeClass("selected")
      }
    }
    
    if (selected_val != default_value){
      console.log("change");
      
      if (input_selector && input_selector.length){
        input_selector.val(selected_val);
        console.log("input val: ", selected_val, input_selector.val());
      }
      
      if (submit_btn_selector && submit_btn_selector.length)
        enableButton(submit_btn_selector);
      
      if (callback && typeof callback === "function")
        callback($(this), selected_plan.toString().split("-")[1]);
    }
    else{
      console.log("NO change");
      if (submit_btn_selector && submit_btn_selector.length)
        disableButton(submit_btn_selector);
    }
    
    console.log("selected_val: ", $(input_selector).val());
  });
  
  console.log("default_value: ", default_value);
  if(default_value){
    var selected_el = default_value;
    if (!default_value.startsWith("#")){
      let default_value_camel = toCamelCase(default_value, first_letter = true);
      console.log("default_value_camel: ", default_value_camel);
      selected_el = $(selector).find("[data-value='"+default_value+"'], [data-value='"+default_value_camel+"']")
      //default_value = $(default_value).length ? "#"+default_value : "#card-"+default_value;
    }
    console.log("selected_el: ", selected_el)
    $(selected_el).click()

    if (input_selector && input_selector.length){
      input_selector.val(default_value);
      console.log("input val: ", default_value, input_selector.val());
    }
  }
  
  console.log("submit_btn_selector: ", submit_btn_selector);
  //if (submit_btn_selector && submit_btn_selector.length)
  //  submit_btn_selector.attr("disabled", true);
}

function enableButton(btn_selector){
  $(btn_selector).attr("disabled", false).css({"opacity": 1, "cursor": "pointer", "pointer-events": "auto"});;
}

function disableButton(btn_selector){
  let $btn_selector = $(btn_selector).attr("disabled", true).css({"opacity": 0.7, "cursor": "not-allowed", "pointer-events": "none"});
  $btn_selector = $btn_selector && $btn_selector.length ? $btn_selector[0] : null;
  return $btn_selector;
}

function loadSpinWheel(btn_selector = null, text = ["Por favor espere un momento...", "...estamos actualizando los datos"], element_id = "divLoadingFrame"){
  var element = document.getElementById(element_id);
  console.log("***loadSpinWheel", element);
  if (element != null) {
    return;
  }
  
  //btn_selector = typeof btn_selector === "string" && !btn_selector.startsWith("#") ? btn_selector : btn_selector
  if (Array.isArray(btn_selector)){
    text = btn_selector;
    btn_selector = null;
  }
  else if (btn_selector && $(btn_selector).length)
    disableButton(btn_selector)

  
  var style = document.createElement("style");
  style.id = "styleLoadingWindow";
  style.innerHTML = `
    .loading-frame {
      position: fixed;
      background-color: rgba(0, 0, 0, 0.8);
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1100;
    }
    
    .loading-text {
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: 50px;
      line-height: 20px;
      text-align: center;
      z-index: 1100;
      width: 100%;
      
      margin-left: 0%;
      
      color: white;
      font-size: 18px;
      font-weight: 500;
    }
    
    .loading-track {
      height: 50px;
      display: inline-block;
      position: absolute;
      top: calc(50% - 50px);
      left: 50%;
    }
    
    .loading-dot {
      height: 10px;
      width: 10px;
      background-color: white;
      border-radius: 100%;
      opacity: 0;
    }
    
    .loading-dot-animated {
      animation-name: loading-dot-animated;
      animation-direction: alternate;
      animation-duration: .75s;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
    }
    
    @keyframes loading-dot-animated {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `
  document.body.appendChild(style);
  var frame = document.createElement("div");
  frame.id = "divLoadingFrame";
  frame.classList.add("loading-frame");
  
  for (var i = 0; i < 10; i++) {
    
    var track = document.createElement("div");
    track.classList.add("loading-track");
    
    var dot = document.createElement("div");
    dot.classList.add("loading-dot");
    
    track.style.transform = "rotate(" + String(i * 36) + "deg)";
    
    track.appendChild(dot);
    frame.appendChild(track);
  }
  
  // Adding a paragraph to it
  var divText = document.createElement("div");
  
  if (text){
    console.log("typeof-dt: ", typeof text)
    
    var text_ = typeof text === "string" ? text : "";
    //text = document.createTextNode(text_);
    //text.id = "text-node";
    //divText.appendChild(text);
    $(divText).text(text_)
    
    divText.classList.add("loading-text")
    frame.appendChild(divText);
    console.log("divText: ", divText)
    
  }
  
  document.body.appendChild(frame);
  var wait = 0;
  var dots = document.getElementsByClassName("loading-dot");
  
  for (var i = 0; i < dots.length; i++) {
    window.setTimeout(function(dot) {
      dot.classList.add("loading-dot-animated");
    }, wait, dots[i]);
    wait += 150;
  }
  
  if (text && typeof text !== "string"){
    console.log("text is not str...")
    var textArray = text; //text = ["foo","bar","blah1","blah2"];
    console.log("loading-text: ", $(".loading-text"), $("#text-node").first());
    
    animateText(textArray);
  }

}

function animateText(textArray, jq_selector = ".loading-text"){
  textArray = typeof textArray === "string" ? [textArray] : textArray;
  var index = 0;
  setInterval(function(){        
    $(jq_selector).animate(
      {opacity:0}, 
      function(){
        console.log("this: ", $(this))
        if(textArray.length > index) {
          $(this).text(textArray[index]).animate({opacity:1})
          index++;
        }
        else if ($(jq_selector).is(":visible"))
          index = 0;
      }
    );
  }, 2000);
}

function stopSpinWheel(btn_selector = null){
  if (btn_selector && $(btn_selector).length)
    enableButton(btn_selector)

  if ($("#divLoadingFrame").length){
    document.body.removeChild(document.getElementById("divLoadingFrame"));
    document.body.removeChild(document.getElementById("styleLoadingWindow"));
  }
};

function isLastNavPillTab(params = {}, jq_selector = null){
  console.log("params+: ", params, typeof params);
  var stepNumber = params && typeof params === "object" && Object.keys(params).includes("stepNumber") ? params["stepNumber"] : null;
  var final_tab = jq_selector ? $(jq_selector).find(".nav-item a").last().data("step") : $(".nav-item a").last().data("step");
  var current_tab = stepNumber ? stepNumber+1 : null;
  if (!current_tab)
    current_tab = jq_selector ? $(jq_selector).find(".nav-item.active a").first().data("step") : $(".nav-item.active a").first().data("step");
  console.log("***isLastNavPillTab - current_tab: ", stepNumber, current_tab, "final_tab: ", stepNumber, final_tab, jq_selector, $(jq_selector).find(".nav-item.active a"), $(".nav-item.active a"));
  if (jq_selector)
    console.log("ilnpt-1: ", $(jq_selector).find(".nav-item a").last().data("step"), $(".nav-item a").last().data("step"), $(jq_selector).find(".nav-item.active a").first().data("step"), $(".nav-item.done a"), $(".nav-item.active a").first().data("step"));
  else
    console.log("ilnpt-2: ", $(".nav-item a").last().data("step"), $(".nav-item.active a").first().data("step"));
  var is_last_tab = final_tab == current_tab ? true : false;
  return is_last_tab
}

function focusNextElement(form_id_selector = null) {
  console.log("***focusNextElement: ", document.activeElement, document.activeElement.form, document.activeElement.form.querySelectorAll(focussableElements));
  
  if (document.activeElement && document.activeElement.form) {
    var focussableElements = 'button, input, textarea, select'; //a.btn:not([disabled]), 
    let elements = $(document.activeElement).parents("form").find(focussableElements).not("[disabled], [type='hidden'], [tabindex='-1'], .hidden");
    console.log("elements: ", $(elements));
    
    if ($(elements).length){
      var index = elements.index(document.activeElement);
      console.log("elements-2: ", $(elements), index, $(elements).index(index+1));
      $(elements).index(index+1).focus();
      return true
    }
    
    /*var focussable = Array.prototype.filter.call(
      document.activeElement.form.querySelectorAll(focussableElements),
      function(element) {
        console.log("element: ", element, element.offsetWidth > 0, element.offsetHeight > 0,  element === document.activeElement, $(element).attr("type") == "checkbox")
        return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement || $(element).attr("type") == "checkbox";
      }
    );
    var index = focussable.indexOf(document.activeElement);
    console.log("focussable: ", focussable, index, focussable[index + 1]);
    focussable[index + 1].focus();*/
  }
  return false
}

function getNextUrl(default_else = null){
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  const next = urlParams.get('next')
  var next_url = next ? next : default_else;
  return next_url
}

function loadCropper(img_type="logo", vue_var_id, vue_var_path){
  //IMAGES
  var id_selector = "id_"+img_type;
  var id_modal_selector = "edit-"+img_type;
  var btn_id_selector = 'btn_'+img_type;
  var box_id_selector = img_type+'-box';
  var default_id_selector = img_type+'-default';
  var form_id_selector = img_type+"-form";
  
  var $image = '';
  var cropper = '';
  const input = document.getElementById(id_selector);
  
  $("#"+id_modal_selector).on('shown.bs.modal', function () {
    $("#"+id_selector).css('display', 'none');
    $("#"+btn_selector).css({"width": "200px", "font-size": "12px", "line-height": "18px", "padding": "1px 5px", "cursor": "pointer", "color": "#fff",
    "background-color": "#8753de", "border-color": "#8753de", "font-weight": "600", "display": "inline-block", "text-align": "center",
    "vertical-align": "middle", "user-select": "none", "border": "1px solid transparent", "border-radius": "4px",
    "transition": "color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out"});
    
    $("#"+box_id_selector).css({"max-width": "100%", "width": "200px", "height": "200px", "cursor": "default", "border": "1px solid black"});
    $("#"+default_id_selector).css({"max-width": "100%", "width": "200px", "height": "200px"});
    
  }).on('hidden.bs.modal', function (e) {
    //cropper.destroy();
    document.getElementById(btn_id_selector).classList.remove('hide')      
    document.getElementById('confirm-btn').classList.add('hide')
    document.getElementById(box_id_selector).innerHTML = ' <img src="'+vue_var_path+'" id= "'+default_id_selector+'">'
  });
  
  input.addEventListener('change', () =>{
    console.log("cambia foto input");
    const imageBox = document.getElementById(box_id_selector);
    const imageForm = document.getElementById(form_id_selector);
    const confirmBtn = document.getElementById('confirm-btn');
    const changeBtn = document.getElementById(btn_id_selector);
    const csrf = $("#"+form_id_selector).find("[name='csrfmiddlewaretoken']");
    const img_default = document.getElementById(default_id_selector)
    const finalAspectRatio = 120 / 120;
    
    changeBtn.classList.add('hide')      
    confirmBtn.classList.remove('hide')
    
    const img_data = input.files[0]
    const url = URL.createObjectURL(img_data)
    
    if(img_default){
      img_default.remove();
    }
            
    imageBox.innerHTML = '<img src="'+url+'" alt="avatar" id= "'+default_id_selector+'">'
    $image = $('#'+default_id_selector);
    $image.cropper({
      aspectRatio: finalAspectRatio,
      viewMode: 3,
      dragMode: 'move',
      zoomable: true,
      minCropBoxWidth     : 120,
      minCropBoxHeight    : 120, 
      crop: function(event) {
        /*console.log(event.detail.x);
        console.log(event.detail.y);
        console.log(event.detail.width);
        console.log(event.detail.height);
        console.log(event.detail.rotate);
        console.log(event.detail.scaleX);
        console.log(event.detail.scaleY);*/
      }
    });
    
    // Get the Cropper.js instance after initialized
    cropper_img = $image.data('cropper');
    console.log('cropper:', cropper_img)
    
    //CONFIRM BUTTON - LOGO
    confirmBtn.addEventListener('click', ()=>{
      cropper_img.getCroppedCanvas({ width: 200, height: 200 }).toBlob((blob) =>{
        console.log("CLICK IMG SAVE: ", vue_var_path, img_data.name)
        const fd = new FormData()
        fd.append("csrfmiddlewaretoken", csrf[0].value)
        fd.append(img_type, blob, img_data.name)
        fd.append('id', vue_var_id)
        console.log('blob: ', blob, img_data.name, vue_var_id);
        
        loadSpinWheel();
        $.ajax({
          type: 'POST',
          url: imageForm.action,
          enctype: 'multipart/form-data',
          data: fd,
          success: function(response){
            console.log("blob success res-1-: "); //, response);
            var image = new Image();
            image.id = default_id_selector
            image.src = cropper_img.getCroppedCanvas().toDataURL(); 
            image.height = 200;
            image.width = 200;
            
            imageBox.innerHTML = '';
            imageBox.appendChild(image)
            $('.'+img_type).attr('src', image.src);
            //$('#logo-box').attr('src', response.product.logo);
            $('#'+default_id_selector).attr('src', image.src);
            $image.cropper('reset');
            stopSpinWheel();
          },
          error: function(error){
            console.log("error: ", error);
            messageAlert('', 'ocurrio un error durante el proceso, por favor intente denuevo más tarde', 'error', refresh_page = false, cancel_text = null)
            stopSpinWheel();
          },
          cache: false,
          contentType: false,
          processData: false,
        })
        //}
      });
    });
  });
}

function createModal(id, title, content_selector, open_btn_selector=null, return_btn=false, edit_callback=null, set_callback=null, append_to=true){
  console.log("***createModal: ", id, content_selector, typeof content_selector, $(content_selector), id && typeof id === "string" && id.toString().includes("#"));
  id = id && typeof id === "string" && id.toString().includes("#") ? id.replace(/#/g, "").replace(/\./g, "") : id;
  console.log("id: ", id, "return_btn: ", return_btn);
  var content_type = isSelectorOrHtmlString(content_selector)
  content_selector = content_type == "selector" && !content_selector.toString().startsWith("#") ? "#"+$(content_selector).attr("id") : content_selector;
  var content = content_type == "html" ? content_selector : $(content_selector).html();
  //id = id && !id.toString().startsWith("modal-") ? "modal-"+id : id;
  if (!content || !content.length)
    console.warn("No content found");
  
  return_btn_el = "";
  if (return_btn && typeof return_btn === "string"){
    console.log("return_btn-1: ", return_btn);
    return_btn_el = '<div class="row">';
    return_btn_el += '<div class="col-12">';
    return_btn_el += '<div class = "row" name="button_panel">';
    return_btn_el += '<button type="button" class="btn btn-primary btn-lg btn-block" id="edit_modal">'+return_btn+'</button>';
    return_btn_el += '</div>';
    return_btn_el += '</div>';
    return_btn_el += '</div>';
  }
  console.log("return_btn_el-2: ", return_btn_el);
  
  template = `
  <div class="modal fade" id="`+id.toString()+`" style="display:none;">
    <div class="modal-dialog" style="display:block;max-width:85%;border: 0px solid #ccc;">
      
      <div class="modal-content" style="position: relative; display:block; overflow: hidden;border: 0px solid #ccc;" >
        
        <!-- Modal header -->
        <div class="modal-header" style="width: 100%;border: 0px solid #ccc;">
            <h4 class="modal-title">`+title.toString()+`</h4>
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
        </div>
        
        <!-- Modal body -->
        <div class="modal-body" style="width: 100%;border: 0px solid #ccc;flex-wrap:wrap;">
          <div class="container row" style="overflow: hidden;flex-wrap:wrap;">
            `+content.toString()+`
          </div>
        </div>
        
        <!-- Modal footer -->
        <div class="modal-footer">
          `+return_btn_el.toString()+`
        </div>
      </div>
    </div>
  </div>
  `
  
  //$(content_selector).after($(template));
  // Append the new element to the body
  console.log("append_to: ", append_to);
  if (append_to == true)
    $('body').append($(template));
  else if(typeof append_to === "string")
    $(append_to).append($(template));
  //$(document).append($(template));
  
  if (append_to != false && content_type == "selector")
    $(content_selector).remove();
  
  //SAVE BUTTON
  var modal_form_selector = ".modal#"+id.toString();
  /*if (edit_callback && typeof edit_callback === "function"){
    let data = getFormData(modal_form_selector);
    edit_callback(data);
  }*/
  let submit_btn = $(modal_form_selector).find("#edit_modal");
  $(submit_btn).click(function(event){
    event.preventDefault();
    console.log("CLICK submit_btn-2...", event, typeof set_callback);
    let obj_id = $(modal_form_selector).attr("loaded_id");
    data = getFormData(modal_form_selector);
    
    if (set_callback && typeof set_callback === "function"){
      set_callback(data);
      console.log("data-submit_btn: ", data, this);
    }
    else{
      //mutationSetForeign
      console.log("else...");
      for (const [key, value] of Object.entries(data)) {
        $("[data-id='"+obj_id+"'][name='"+key+"']").val(value);
      }
    }
  });
  
  //open button
  if (open_btn_selector){
    //$(open_btn_selector).attr("data-toggle", "modal");
    //$(open_btn_selector).attr("href", "#"+id.toString());
  }
  
  let button_open = content_type == "selector" ? $(content_selector).find(".btn[data-toggle='modal']").first() : $(open_btn_selector).first();
  console.log("BUTTON OPEN SET-2 !!!!!", button_open, "id", button_open.attr("id"));
  $(document).on('click', "#"+button_open.attr("id"), function () {
    console.log("OPEN CLICKED-2 !!!!!");
    toggleModal(null, modal_form_selector, content_selector, on_open_callback);
  });
  
  return template;
}

function loadModalProgressBar(panel_selector){
  var steps = $("[data-step]")
  //each return steps create progress bar
  var progress_bars = ""
  $("div[data-step]").each(function(i, element){
    
  });
  
  //max-min, create buttons
  //add click functionality to buttons
}


function objSelectionAddSelected($element, vue_var = null, form_id = "#search_form", content_container_id = "#search-content", selected_container_id = "#selected-elements"){
  let element_id = typeof $element === "object" && $element instanceof jQuery ? $element.attr("data-id") : $element.id;
  $(form_id).find(selected_container_id).append('<input  type="hidden" name="hidden_element_'+element_id+'" data-id="'+element_id+'" value='+element_id+' />');
  console.log("***addSelected_: ", $element, element_id, typeof $element, vue_var);
  
  if (typeof $element === "object" && $element instanceof jQuery){
    $element.addClass("selected").css("border","3px solid purple"); //.css("background-color","blue");
    $clone = $element.clone(); //true
  }
  else{
    if (vue_var)
      vue_var.push($element);
    $element = $(selected_container_id).find("[data-id="+$element.id+"]").not("input");
    $clone = $element;
  }
  console.log("$element-2: ", $clone, $element, element_id);
  
  $clone.removeAttr("style");
  $clone.removeClass( "search-result selected" );
  $clone.addClass( "selected-result added" );
  
  //REMOVE FROM SELECTED LIST
  $clone.unbind( "click" );
  $clone.attr("href", "javascript:void(0)");
  $clone.click(function(event_){
    event_.preventDefault();
    event_.stopImmediatePropagation();
    //let self = this;
    console.log("***CLONE-REMOVE-CLICK: ", $(this), $(this).data("id"));
    $(form_id).find(content_container_id).find("[data-id='"+$(this).data("id")+"'].search-result").removeAttr("style")
    $(form_id).find(content_container_id).find("[data-id='"+$(this).data("id")+"'].search-result").removeClass("selected");
    $(form_id).find(selected_container_id).find("[data-id='"+$(this).data("id")+"']").remove();
    //$(self).remove(); //.delete();
  });
  
  //element.addClass("loaded");
  $(form_id).find(selected_container_id).append($clone);
}

function loadObjSelection(model, related, id = null, vue_var = null, key = null, set_callback = null, form_id = "#search_form", content_container_id = "#search-content", selected_container_id = "#selected-elements"){
  
  form_id = form_id.startsWith("#") ? form_id : "#"+form_id;
  content_container_id = content_container_id.startsWith("#") ? content_container_id : "#"+content_container_id;
  selected_container_id = selected_container_id.startsWith("#") ? selected_container_id : "#"+selected_container_id;
  
  console.log("ADDING FUNCTIONALITY: search-result-anchor")
  
  
  function selectFunction_(self){
    let $element = $(self).parent().first();
    console.log("****selectFunction_ - SELECTION-CLICK...", $(self), $element, $element.hasClass("selected"));
    
    //REMOVE SELECTED
    if ($element.hasClass("selected")){
      console.log("1--remove-selected");
      $element.removeClass("selected")
      $element.removeAttr("style");
      $(form_id).find(selected_container_id).find("[data-id='"+$element.data("id")+"']").remove();
    }
    else{ //ADD SELECTED
      console.log("2--add-selected");
      objSelectionAddSelected($element, vue_var, form_id, content_container_id, selected_container_id);
    }
    let submit_btn = $(form_id).find(selected_container_id).parent().find("button");
    enableButton(submit_btn);
  }
  
  $(form_id).find(content_container_id).on("refresh", function(){
    //REMOVE SELECTED FROM NEW SEARCH RESULTS
    $(form_id).find(content_container_id).find(".selected").removeAttr("style")
    $(form_id).find(content_container_id).find(".selected").removeClass("selected");
    console.log("after-remove: ", $(form_id).find(content_container_id).find(".selected"));
    
    //$("#search_form").find("#search-content").find(".selected");
    //MARK ALREADY SELECTED
    $(form_id).find(selected_container_id).children(".selected-result").each(function(index, element){
      console.log("selecting-already: ", $(this), index, element);
      $(form_id).find(content_container_id).find("[data-id='"+$(element).data("id")+"'].search-result").addClass("selected").css("border","3px solid purple");
    });
    
    console.log("LOADING ADD SELECT-BTN: ", $(form_id).find(content_container_id).find(".search-result-anchor").not(".loaded"));
    $(form_id).find(content_container_id).find(".search-result-anchor").not(".loaded").attr("href", "javascript:void(0)");
    $(form_id).find(content_container_id).find(".search-result-anchor").not(".loaded").click( function(event){
      console.log("CLICK-1!!...", typeof set_callback);
      event.preventDefault();
      event.stopImmediatePropagation();
      selectFunction_(this);
    });
    $(form_id).find(content_container_id).find(".search-result-anchor").not(".loaded").addClass("loaded");
    
    let submit_btn = $(form_id).find(selected_container_id).parent().find("button");
    if (submit_btn && submit_btn.length){
      if ($(form_id).find(selected_container_id).length)
        enableButton(submit_btn);
      else
        disableButton(submit_btn);
    }
  });
  
  //FIRST-LOAD
  console.log("vue_var-fl : ", vue_var);
  if (vue_var && vue_var.length){
    let $element;
    vue_var.forEach((element) => {
      let obj_id = getDeepValue(element, key);
      console.log("element-load: ", element, obj_id);
      $element = $(selected_container_id).find("[data-id="+obj_id+"]").first();
      console.log("element-load-2: ", element);
      if ($element.length){
        $element = $element.first();
        //addSelected_($element);
      }
      else {
        $element = element;
        //$element = getDeepValue(element, key.split(".")[0]);
        //console.log("element not found...", $element, key.split(".")[0]);
      }
      console.log("element-load-9: ", $element, typeof $element);
      if ($element && ((typeof $element === "object" && Object.keys($element).length) || ($element.length)))
        objSelectionAddSelected($element);
    });
    
  }
  
  //SAVE BUTTON
  let submit_btn = $(form_id).find(selected_container_id).parent().find("button");
  $(submit_btn).click(function(event){
    event.preventDefault();
    console.log("CLICK submit_btn...", event, typeof set_callback);
    if (set_callback && typeof set_callback === "function"){
        
      let obj_id = $(this).parent().data("id");
      data = getFormData(selected_container_id);
      data = data ? Object.values(data) : data;
      if (obj_id)
        data.push(obj_id);
      console.log("data-submit_btn: ", data, this);
      
      mutationSetForeign(
        {
          "model": model,
          "related": related,
          "id": id,
          "data": data
        }, 
        function (response) {
          console.log("response-2: ", response);
          //if (response && response.setForeign)
          //  selectFunction_(this);
        }
      );
      
    }
    else
      disableButton(submit_btn);
  });
  $(form_id).find(content_container_id).trigger("refresh");
  console.log("submit_btn: ", submit_btn, submit_btn.length);
  disableButton(submit_btn);
}

function renderFormRules(rules, form_id = "#form"){
  let $form = typeof form_id === "string" && !form_id.startsWith("#") ? $("#"+form_id) : $(form_id);
  console.log("***renderFormRules: ", rules, form_id);
  
  Object.keys(rules).forEach(key => {
    console.log("it-key-rfr: ", key, rules[key]);
    if (Object.keys(rules[key]).includes("required") && rules[key]["required"]){
      let label = $form.find("[name='"+key+"']").parents(".form-group").children("label").first();
      //find(".col-form-label")
      console.log("label: ", label)
      if (label && $(label).length && !$(label).text().trim().startsWith("*")){
        let $i_element = $(label).find("i[data-toggle]").first().tooltip("dispose").clone(true);
        label.html('<strong style="color: #904ae5;">*</strong>'+label.text().trim());
        if ($i_element){
          //$i_element = $i_element.first().clone(true)
          $($i_element).tooltip();
          label.append($i_element);
        }
        
      }
    }
  });
  //console.log("tooltips: ", $form.find('[data-toggle="tooltip"]'));
  //$form.find('[data-toggle="tooltip"]').tooltip('toggleEnabled');
}

function setObjData(obj, data){
  return {...obj,...data}
}

function removeElement(element) {
  //console.log(this) //will log Window Object
  //I have also tried using document.getElementByID(this.id)
  element.remove();
  //I have also tried using element.parentNode.removeChild(element); to remove the element.
}

function loadChecks(jq_selector, scale = 1){
  $(jq_selector).checks();
  $('.ico-checkbox').css("zoom", scale).css({"border-radius": "999px"});
  $('.ico-radio').css("zoom", scale).css("border-radius", "999px");
}

//type = info, check, times, exclamation
//size = fa-2xs, fa-xs, fa-sm, , fa-lg, fa-xl, fa-2xl
function loadAlertBox(icon_size=2, text_tag="span", jq_selector = ".alert-box", closeBtn = false, type = null, msg = null){
  
  //icon size
  if (icon_size && typeof icon_size === "number"){
    icon_size = !icon_size.toString().endsWith("x") ? icon_size.toString() + "x" : icon_size;
    icon_size = !icon_size.toString().startsWith("fa-") ? "fa-"+icon_size.toString() : icon_size;
  }
  else
    icon_size = ""
  console.log("***loadAlertBox: ", icon_size, jq_selector, $(jq_selector));
  
  $(jq_selector).each(function(index, element){
    var html = "";
    console.log("loadAlertBox-index: ", index, element, jq_selector, $(jq_selector));
    
    if (closeBtn){  
      html += '<a href="javascript:void(0)" data-dismiss="msg" class="close delete-me">×</a>'
    }
    
    var class_ = type;
    if(!class_){
      class_ = "info";
      if($(element).attr("type")) 
        class_ = $(element).attr("type");
      else if($(element).hasClass("alert-warning"))
        class_ = "warning";
      else if($(element).hasClass("alert-error"))
        class_ = "error";
    }
    
    //icon type
    var type_ = class_;
    console.log("type_-1: ", type_, type);
    //if (!type_){ type_ = "info-circle"; }
    if (type_ == "success"){ type_ = "check-circle"; }
    else if (type_ == "error" || class_ == "error" ){ type_ = "times-circle"; }
    else if (type_ == "warning" || class_ == "warning" ){ type_ = "exclamation-triangle"; }
    else if (type_)
      type_ = type_+"-circle";
    
    console.log("msg-1: ", msg, class_, type_, type);
    var msg_ = !msg ? $(element).text() : msg;
    console.log("msg_-2: ", msg_, class_, type_, type, icon_size);
    
    if (icon_size && icon_size.length){
      html += '<i class="fa '+icon_size+' fa-'+type_+' col-md2"></i>'
    }
    
    var text_class_ = icon_size && icon_size.length ? 'class="col"' : ""; //-md-6 
    html += '<'+text_tag+' '+text_class_+'>'+msg_+'</'+text_tag+'>'
    //html += '<div class="alert alert-'+type+' msg-progress" style="width: 100%;"></div>'
    
    $(element).addClass("alert alert-"+class_+" row").css({"vertical-align":  "middle", "padding-left": "3%"}); //.css("column-count: 2");
    console.log("html: ", html)
    $(element).html(html);
  });
  
  if (closeBtn){
    $('.delete-me').click(function (e) {
      $(this).parent().slideUp(function() {
        $(this).remove();
      });
    }); 
  }
  
  return $(jq_selector);
}

function loadAlertPopup(html_msg, type = "success", show_on_init=false, autohide = true, delay = 2000){
  console.log("***loadAlertPopup: ", type, $("alert-"+type).length, $(".alert-popup.alert-"+type).length)
  if(!type)
      type = $(element).attr("type") ? $(element).attr("type") : "info";
  
  if (!$(".alert-popup.alert-"+type).length){
    let icon_type = null;
    if (type == "success"){ icon_type = "check"; }
    else if (type == "error"){ icon_type = "times"; }
    else if (type == "warning"){ icon_type = "exclamation"; }
    
    //ICON
    let icon_size = 1.2;
    let icon = "";
    
    if (icon_size && typeof icon_size === "number"){
      icon_size = !icon_size.toString().endsWith("x") ? icon_size.toString() + "x" : icon_size;
      icon_size = !icon_size.toString().startsWith("fa-") ? "fa-"+icon_size.toString() : icon_size;
    }
    else
      icon_size = ""
    console.log("icon_size: ", icon_size);
    
    if (icon_type && icon_size && icon_size.length){
      icon = '<i class="fa '+icon_size+' fa-'+icon_type+'-circle col-md2"></i>'
    }
    console.log("icon: ", icon, icon_type, type);
    
    var html = `
    <div class="popup_message" style="display: none;">
      <div class="alert alert-`+type+` alert-popup" role="alert">
        `+icon+`
        `+html_msg+`
      </div>
    </div>`;
    console.log("alert-poup: ", $("#header"));
    $("#header").after(html);
    
    // get a reference to the document's style sheet
    var styleSheet = document.styleSheets[0];
    
    // create a new CSS rule
    var rule = `
    .popup_message {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
      width: 100%;
      font-size: 120%;
      box-sizing: border-box;
      vertical-align: middle;
    }`;
    
    // add the rule to the style sheet
    console.log("rule: ", rule, styleSheet.cssRules.length)
    styleSheet.insertRule(rule, styleSheet.cssRules.length);
    
    //document.body.appendChild(html);
    $(".popup_message").addClass("loaded");
    console.log("popul-message-loaded: ", $(".popup_message"));
    
    $(".popup_message").on("show", function(event, text = null, type=null){
      console.log("SHOW TRIGGERED!!...", $(".popup_message"), text, type);
      if (text && text.length)
        $(".popup_message").find("[role='alert']").text(text);
        if (type && type.length)
          $(".popup_message").attr("class", "alert alert-"+type+" alert-popup");
      $(".popup_message").fadeIn("fast").delay(delay).fadeOut()//.show().hide();
    })
  }
  
  if (show_on_init)
    $(".popup_message").trigger("show", html_msg, type);
}


function loadTimeline(events, orientation = 'vertical', visible = null, jq_selector = '.timeline'){
  html = ""
  html += '<div class="timeline__wrap">'
  html += '<div class="timeline__items">'
  
  events.forEach(element => {
    element = element.startsWith("<") ? element : '<p>'+element+'</p>';
    html += '<div class="timeline__item">'
    html += '<div class="timeline__content">'
    html += element
    html += '</div>'
    html += '</div>'
  });
  
  html += '</div>'
  html += '</div>'
  
  $(jq_selector).html(html);
  
  visible = !visible ? events.length : visible;
  timeline(document.querySelectorAll(jq_selector), {
    //forceVerticalMode: 700,
    mode: orientation,
    verticalStartPosition: 'left',
    visibleItems: visible
  });
}

function loadScrollingTimeline(data, map = {}, jq_selector = '#jtimeline-demo'){
  let options = {
    minimumSpacing: 110, // minimum spacing between events
    step: 250, // scrolling (translateX) step size
  }
  
  
  $(jq_selector).jTimeline(options);
}

function check_attr_from_options(options, id, attr, default_value = null, empty_value = null){
  console.log("***check_attr_from_options: ", options, id, attr, default_value)
  if (default_value)
    return default_value
  
  let value = empty_value
  if (id && options && typeof options === "object"){
    console.log("if: ", typeof options === "object", typeof id, Object.keys(options),  Object.keys(options).includes(id));
    let key = null;
    
    if (Object.keys(options).includes(id)){
      console.log("Object.keys(options[id]).includes(attr): ", Object.keys(options[id]).includes(attr));
      key = id;
    }
      
    else if (Object.keys(options).includes(id.toString()))
      key = id.toString();
    
    if (key && Object.keys(options[key]).includes(attr)){
      value = options[key][attr];
    }
  }
  return value
}

function checkCamelKey(data, key){
  if (key && data && typeof data === "object"){
    if (!Object.keys(data).includes(key) && key != key.toString().toLowerCase())
      key = toUncamelize(key);
    else if (!Object.keys(data).includes(key) && key.includes("_"))
      key = camelize(key);
  }
  return key
}

function loadRequestButton(jq_selector, url, callback=null, confirm_message = null){
  url = url.endsWith("/") ? url : url + "/";
  
  function callFunction_(obj){
    //let obj_id = $(self).data("id");
    let obj_id = $(obj).attr("data-id");
    let url_ = url+obj_id;
    console.log("btn: ", obj_id, url_); //, self);
    
    $.get(url_, {}, function(response) {
      
      let status = getDeepValue(response, "status");
      console.log("response: ", response, status);
      
      if (status){
        if (callback && typeof callback === "function")
          callback(response)
        else{
          function download(file_name, file_path = "") {
            file_path = file_path.startsWith("/") ? window.location.origin + file_path : file_path;
            console.log("download: ", file_name, file_path, encodeURIComponent(file_path))
            //creating an invisible element
            var element = $(obj); //document.createElement('a');
            $(element).attr('href', file_path); //encodeURIComponent( 'data:text/plain;charset=utf-8, '
            $(element).addClass('loaded');
            $(element).attr('target', "_blank"); //'data:text/plain;charset=utf-8, '
            
            //element.setAttribute('download', file_name);
            // Above code is equivalent to
            // <a href="path of file" download="file name">
            //document.body.appendChild(element);
            //onClick property
            //$(element).click();
            let redirectWindow = window.open(file_path, '_blank');
            redirectWindow.location;
            //document.body.removeChild(element);
          }
          // Start file download.
          var file = response.data;
          console.log("status ok...", file);
          download(file.name, file.url);
          //$(obj).click();
        }
      }
      else{
        messageAlert('', 'Adjunto no disponible de momento', 'warning', refresh_page = false, cancel_text = null)
        disableButton(obj)
      }
    });
  }
  
  $(jq_selector).on("click", function(event, param = null){
    console.log("download click...");
    if (!$(this).hasClass("loaded")){
      event.preventDefault();
      console.log("this: ", this, event);
      if (confirm_message)
        confirmAlert("Confirmación", message, callFunction_, $(this));
      else
        callFunction_($(this));
    }
  });
}

function loadReactiveDeleteButton(del_url, vue_var = null, message = "Está seguro que desea elminar este registro?", jq_selector = ".del_btn"){
  del_url = del_url.endsWith("/") ? del_url : del_url + "/";
  
  function deleteFunction_(obj_id){
    //let obj_id = $(self).data("id");
    let url = del_url+obj_id;
    console.log("del: ", obj_id, url); //, self);
    
    $.get(url, {}, function(response) {
      
      let status = getDeepValue(response, "status");
      console.log("response: ", response, status);
      
      if (status){
        console.log("status ok...", vue_var);
        
        if (vue_var){
          console.log("has vue_var...");
          let objIndex = vue_var.findIndex((obj => obj.id == obj_id));
          console.log("vue_var-4 delete: ", vue_var, "objIndex-d-4: ", objIndex, "id_: ", obj_id)
          if (objIndex != -1){
            app_vue.$delete(vue_var, objIndex);
            console.log("deleted-index: ", objIndex);
          }
        } 
        else {
          $(jq_selector).find("[data-id="+obj_id+"]").remove();
        }
      }
    });
  }
  
  $(jq_selector).on("click", function(event, param = null){
    event.preventDefault();
    console.log("this: ", this, event);
    confirmAlert("Confirmación", message, deleteFunction_, $(this).attr("data-id"));
  });
}


function pasteAjaxTextButton(jq_selector, gql_callback, gql_id, callback, field = "name"){
  var result_ = null
  console.log("***pasteFromAJAXButton: ", jq_selector, gql_callback, gql_id, callback);
  let $pasteBtn = $(jq_selector);
  console.log("$pasteBtn2: ", $pasteBtn);
  
  $pasteBtn.click( function(event){
    console.log("CLICK2!!...", typeof gql_callback, gql_id);
    event.preventDefault();
    event.stopImmediatePropagation();
    
    if (gql_callback && typeof gql_callback === "function"){
      var $icon = $pasteBtn.find("i");
      var pre_class = $icon.attr("class");
      var targe_is_jquery_selector = callback.toString().startsWith("#") || callback.toString().startsWith(".") ? true : false;
      console.log("pre_class: ", pre_class, $icon, targe_is_jquery_selector);
      $icon.attr("class", "spinner-border spinner-border-sm text-secondary");
      
      if (targe_is_jquery_selector)
        disableButton(callback);
      disableButton(jq_selector);
      
      gql_callback({
        id: gql_id
      }, function(response) {
        
        if (pre_class)
          $icon.attr("class", pre_class);
        if (targe_is_jquery_selector)
          enableButton(callback);
        enableButton(jq_selector);
        console.log("response-3: ", response, Object.values(response))
        
        if (response && Object.values(response).length){
          result_ = Object.values(response)[0];
          console.log("result_: ", result_, targe_is_jquery_selector);
          
          if (callback && typeof callback === "function")
            callback(result_);
          else if (targe_is_jquery_selector){
            console.log("$(callback): ", $(callback));
            if ($(callback).hasClass("tagit-hidden-field")){
              $.each(result_, function(i, tag){
                console.log("tag: ", tag, tag[field], i, typeof tag);
                $(callback).tagit("createTag", tag[field]);
              });
            }
            else
              $(callback).val(result_.join(", "));
          }
          else
            document.getElementById(callback).innerText = cliptext;
        }
      });
      console.log("post-call...")
    }
  });
  return result_
}

function cleanButton(btn_jq_selector, jq_selector){
  let $btn = $(btn_jq_selector);
  console.log("$btn: ", $btn);
  $btn.click( function(event){
    console.log("CLICK-6!!...");
    event.preventDefault();
    event.stopImmediatePropagation();
    let node_name = $(jq_selector)[0].nodeName.toLowerCase();
    console.log("node: ", node_name, $(jq_selector).find("option"));
    if (node_name == "select"){
      $(jq_selector).find("option").prop('selected', false);
      let is_select2 = $(jq_selector).hasClass("select2-hidden-accessible") //default-select2
      if (is_select2)
        $(jq_selector).trigger("change");
    }
    else{
      $(jq_selector).val("");
      if ($(jq_selector).hasClass("tagit-hidden-field"))
        $(jq_selector).tagit("removeAll");
    }
  });
}


function pasteFromClipboardButton(jq_selector, callback, btn_add = null){
  var cliptext_ = null
  console.log("***pasteFromClipboardButton: ", jq_selector, callback);
  
  $(document).ready(function() {
    let $pasteBtn = $(jq_selector);
    console.log("$pasteBtn: ", $pasteBtn);
    
    $pasteBtn.click( function(event){
      console.log("CLICK-2!!...");
      event.preventDefault();
      event.stopImmediatePropagation();
      
      navigator.clipboard.readText()
        .then(function(cliptext) {
          // cumplimiento
          cliptext_ = cliptext;
          console.log("-cliptext: ", cliptext);
          if (callback && typeof callback === "function")
            callback(cliptext);
          else if (callback.toString().startsWith("#") || callback.toString().startsWith(".")){
            console.log("$(callback): ", $(callback), $(callback).first());
            let node_name = $(callback)[0].nodeName.toLowerCase();
            console.log("node_name: ", node_name, jq_selector);
            
            //PASTE ON TABLE
            if (node_name == "table"){
              loadSpinWheel(null, ["Cargando datos..."]);
              console.log("is_table: ", node_name);
              // split the text into rows and columns
              const rows = cliptext.split('\n');
              var data = rows.map(row => row.split('\t'));
              const num_keys = data && data.length ? Object.keys(data[0]).length : 0;
              console.log("ps-parsed-data: ", data, num_keys); // display the parsed data in the console
              
              if (num_keys != 0){
                
                if (num_keys != $(callback).find("th").length && num_keys != $(callback).find("th").length-1){
                  console.warn("Warning: num_keys for pasteTable does not match...", num_keys, $(callback).find("th").length);
                  loadAlertPopup("Nada que pegar, clipboard no coincide con tabla?", "warning");
                }
                else{
                  var has_columns = false;
                  var columns = [];
                  $(callback).find("tbody").find("tr").first().find(":input, :text, :file, :checkbox, select, textarea").each(function(index, value){
                    let name = $(value).attr("name");
                    console.log("name: ", name, $(value), has_columns, data[0], data[0].includes(name));
                    has_columns = has_columns || name && data[0].includes(name);
                    columns.push(name);
                  });
                  console.log("has_columns: ", has_columns, columns, data, data.length);
                  
                  if (has_columns || columns.length){
                    if (has_columns){
                      columns = data[0]
                      for (let j = 0; j < columns.length; j++) {
                        columns[j] = columns[j].replace("\r", "");
                      }
                      data.shift();
                    }
                    else if (columns[0] == "id" && !isNumeric(data[0][0]))
                      columns.shift();
                    const objs = [];
                    
                    //Create OBJ with data and columns
                    console.log("data-af: ", data, data.length, columns);
                    for (let i = 0; i < data.length; i++) {
                      const row = data[i];
                      const obj = {}
                      console.log("data-row: ", row)
                      for (let j = 0; j < columns.length; j++) {
                        console.log("set-cell[j]: ", j, columns[j], row[j]);
                        obj[columns[j]] = row[j];
                      }
                      console.log("obj: ", obj)
                      objs.push(obj);
                    }
                    console.log("objs: ", objs, data, data.length, columns.length);
                    
                    //already existent rows
                    const current_rows = $(callback).find("tbody").find("tr").length;
                    // Example usage
                    var hasClickEvent = hasClickListener(btn_add);
                    var hasSubmitEvent = hasSubmitListener(btn_add);
                    console.log("hasClickEvent: ", hasClickEvent, hasSubmitEvent, data.length, current_rows, data.length-current_rows);
                    for (let i = 0; i < data.length-current_rows; i++) {
                      console.log("btn_add - i: ", i, current_rows, data.length, data.length-current_rows, data.length-$(callback).find("tbody").find("tr").length);
                      $(btn_add).click();
                    }
                    renderForm(callback+" tbody tr", objs);
                  }
                  else{
                    console.log("implement here...");
                    //already existent rows
                    $(callback).find("tbody").find("tr").each(function(index, value){
                      
                    });
                    
                    //new rows
                  }
                }
              }
              stopSpinWheel();
            }
            else if ($(callback).hasClass("tagit-hidden-field") || node_name == "select"){
              
              function pasteTags(cliptext){
                var current_val = $(callback).val();
                let separator = cliptext.indexOf("\n") != -1 ? "\n" : ",";
                let node_name = $(callback)[0].nodeName.toLowerCase();
                let is_select2 = $(callback).hasClass("select2-hidden-accessible") //default-select2
                var max_len = $(callback).attr("max-len");
                console.log("current_val: ", current_val, cliptext, node_name, separator, is_select2);
                counter = str_ocurrence_count(cliptext, separator); //.count(separator);
                
                cliptext = cliptext.includes(" / ") ? cliptext.replace(" / ", ", ") : cliptext;
                cliptext = cliptext.includes(":") && node_name == "select" ? cliptext.replace(":", ", ") : cliptext;
                
                $.each(cliptext.split(separator), function(i, tag){
                    tag = tag.trim();
                    let short_linkedin_test = ((str_ocurrence_count(tag, " and ") == 1 && str_ocurrence_count(tag, " y ") == 1) && !tag.includes(separator))
                    let word_test = (str_ocurrence_count(tag, " and ") == 1 || str_ocurrence_count(tag, " y ") == 1 || (str_ocurrence_count(tag, " & ") == 1 && tag.split(" ").length > 3))
                    console.log("word_test: ", word_test, ((str_ocurrence_count(tag, " and ") == 1 && str_ocurrence_count(tag, " y ") == 1) && !tag.includes(separator)));
                    console.log("tag-1: ", tag, node_name, is_select2, i, counter, str_ocurrence_count(tag, " and "), str_ocurrence_count(tag, " y "));
                    if ((counter != 0 && i == counter && word_test) || short_linkedin_test ){
                      if (tag.includes(" and ")){
                        tag = tag.split(" and ")
                        console.log("tag: ", tag);
                        if (short_linkedin_test){
                          tag = [tag[0]].concat(tag[1].split(" y "));
                          console.log("tag--: ", tag);
                        }
                      }
                      else if(tag.includes(" y "))
                        tag = tag.split(" y ");
                      else
                        tag = tag.split(" & ");
                      
                      if (node_name == "select" && tag[0].toLowerCase() != "service" && tag[0].toLowerCase() != "services"){
                        console.log("selecting-contains: ", tag[0]);
                        if (tag[0] && tag[0].length > 3){
                          var selected = false;
                          $(callback).find(' option:contains("'+tag[0]+'")').each(function () {
                            if ($.trim($(this).text()) == tag[0]) {
                              $(this).prop('selected', true);
                              selected = true;
                              return false;
                            }
                          });
                          if (!selected)
                            $(callback).find(' option:contains("'+tag[0]+'")').prop('selected', true);
                        }
                      }
                      else{
                        console.log("tag[0].toString().length: ", tag[0].toString().length, max_len);
                        if (!max_len || tag[0].toString().length <= max_len)
                          $(callback).tagit("createTag", tag[0]);
                      }
                      
                      if (short_linkedin_test && tag.length == 3)
                        $(callback).tagit("createTag", tag[2]);
                      tag = tag[1];
                      
                    }
                    else
                      tag = str_ocurrence_count(tag, " and ") == 1 || str_ocurrence_count(tag, " y ") == 1 ? tag.replace(" and ", " & ").replace(" y ", " & ") : tag;
                    
                    if (tag.count(":") == 1 && node_name != "select"){
                      let parts = tag.split(":")
                      if (parts[0].length == parts[1].trim().split(" ").length && getAcronym(parts[1]) == parts[0].toUpperCase()){
                        tag = parts[1] + " (" + parts[0].toUpperCase() + ")";
                      }
                    }
                    console.log("tag-2: ", tag, node_name, is_select2, i);
                    
                    if (node_name == "select" && tag.toLowerCase() != "service" && tag.toLowerCase() != "services"){
                      console.log("selecting-contains-2: ", tag);
                      if (tag && tag.length > 3){
                        var selected = false;
                        $(callback).find(' option:contains("'+tag+'")').each(function () {
                          if ($.trim($(this).text()) == tag) {
                            $(this).prop('selected', true);
                            selected = true;
                            return false;
                          }
                        });
                        if (!selected)
                          $(callback).find(' option:contains("'+tag+'")').prop('selected', true);
                      }
                    }
                    else{
                      console.log("tag.toString().length: ", tag.toString().length, max_len);
                      if (!max_len || tag.toString().length <= max_len){
                        $(callback).tagit("createTag", tag);
                        console.log("tag-added: ", tag);
                      }
                      else
                        loadAlertPopup("Pegar: tag '"+tag+"' descartada por largo", "warning", true);
                    }
                });
                
                if (node_name == "select" && is_select2){
                  //let on_event = is_select2 ? "select2:select" : "change";
                  //console.log("select2 on_event: ", on_event, is_select2);
                  //if (on_event == "select2:select")
                  //  $(callback).trigger(on_event, false);
                  $(callback).trigger("change");
                }
              }
              
              pasteTags(cliptext);
            }
            else{
              $(callback).val(cliptext);
            }
          }
          else
            document.getElementById(callback).innerText = cliptext;
        }, function(reason) {
          // rechazo
          console.log("err: ", reason);
        });
    });
  });
  
  return cliptext_;
}

function loadVerticalTable(jq_selector, data = {}, columns=[], buttons=[], categorical_values_dict={}, options = {}){
  console.log("***loadVerticalTable: ", $(jq_selector), data, options);
  var html = "";
  
  //INITIALIZATION CHECKS
  let tableId = null;
  if (!jq_selector || !$(jq_selector).length){
    console.warn("Warning: Table not found...", jq_selector, $(jq_selector));
    return null;
  }
  else{
    tableId = $(jq_selector).attr("id");
    console.log("tableId: ", tableId, $(jq_selector))
    if (!tableId)
      console.warn("Warning: no tableId?...", jq_selector, $(jq_selector), $(jq_selector).attr("id"));
    else{
      tableId = "#"+tableId;
      console.log("tableId-2: ", tableId);
    }
  }
  
  let node_name = jq_selector && $(jq_selector).length ? $(jq_selector)[0].nodeName.toLowerCase() : null;
  console.log("***loadVerticalTable - node_name: ", node_name, jq_selector, tableId, data.length)
  var columns_none_values = {};

  //OPTIONS:
  var table_order = varInit(options, "order_by", null);
  if (table_order){
    data = orderObjList(data, table_order[0], table_order[0], true);
    table_order = {};
  }
  var add_index = varInit(options, "add_index", false);
  console.log("add_index-1: ", add_index, options, typeof columns);
  
  if (node_name != "table"){ //|| Object.keys(data).length
    
    //IF NOT COLUMNS THEN COLUMNS FROM DATA
    console.log("columns-: ", columns, typeof columns, data);
    if (!columns || typeof columns !== "object" || (Array.isArray(columns) && !columns.length) || (!Array.isArray(columns) && !Object.keys(columns).length))
      columns = Object.keys(data);
    else if (data && data.length)
      console.warn("data is list and not dict / object?...");
    console.log("columns-init: ", typeof columns, columns, Array.isArray(columns));
    
    //IF COLUMNS IS LIST AND COL_OPTIONS IN OPTIONS THEN CONVERT TO OBJECT
    if (typeof columns === "object" && Array.isArray(columns)){
      let columns_ = columns;
      columns = {};
      for (var i = 0; i < columns_.length; i++) {
        let column = columns_[i];
        let column_name = null;
        col_options = varInit(options, column, {});
        console.log("converting column: ", column, col_options);
        
        let column_split = column.includes(".") ? column.split(".") : column;
        column_split = column.includes(".") ? column_split[column_split.length-1] : column;
        console.log("column-to-obj-1: ", column, column_split, column_split != column);
        
        if (!(col_options && Object.keys(col_options).length)){
          if (column.includes("_"))
            column_name = column.includes(".") ? camelizeSnakeCase(column_split, first_letter = true) : camelizeSnakeCase(column, first_letter = true); //, true, " "
          else
            column_name = column.includes(".") ? separateCamelizedString(column_split) : separateCamelizedString(column);
        }
        columns[column] = col_options && Object.keys(col_options).length ? { ...{}, ...col_options } : column_name;
      }
      console.log("columns-converted-1...");
    }
    
    if (typeof columns === "object"){
      
      //ORDER COLUMNS
      var keyIndexOrder = {}
      var index = 0;
      var has_order = false;
      
      //SET COLUMNS / ORDER COLUMNS
      for (let [column, col_options] of Object.entries(columns)) {
        console.log("if-o: ", col_options, typeof col_options === "object", Object.keys(col_options).includes("order"))
        if (typeof col_options === "object" && Object.keys(col_options).includes("order") && col_options["order"]){
          has_order = true
          //keyIndexOrder.push(col_options["order"])
          keyIndexOrder[col_options["order"]] = column
        }
        else
          //keyIndexOrder.push(index)
          keyIndexOrder[index] = column
        if (!table_order && typeof col_options === "object" && Object.keys(col_options).includes("table_order") && col_options["table_order"]){
          table_order = add_index ? index+1 : index;
          table_order = [[table_order, col_options["table_order"]]]
        }
        index += 1
      }
      console.log("keyIndexOrder-pre: ", keyIndexOrder);
      //columns = has_order ? reorderObjectKeys(columns, keyIndexOrder) : columns;
      console.log("new_cols: ", columns, has_order, keyIndexOrder);
    }
    
    //RENDER TABLE
    //RENDER TABLE BODY
    html += '<table class="table table-striped table-hover table-bordered">'
    html += '<tbody>'
    console.log("tbody-data: ", data);
    //TRS
    for (let [index, column] of Object.entries(keyIndexOrder)) {
      let row = data; //cell = [column];
      console.log("adding-trs-row: ", row, index, columns);
      if (row){
        
        html += '<tr>';
        
        //RENDER TABLE HEADERS
        //THS
        console.log("add_index: ", add_index);
        if (add_index)
          html += '<th>#</th>';
        
        console.log("rendering-columns-pua: ", columns);
        let col_options = columns[column];
        let column_name = col_options && typeof col_options === "object" && Object.keys(col_options).includes("column") ? col_options["column"] : col_options;
        console.log("render-column-th: ", column, col_options, typeof col_options, column.includes("_"), column_name);
        
        let column_split = column.includes(".") ? column.split(".") : column;
        column_split = column.includes(".") ? column_split[column_split.length-1] : column;
        console.log("column-to-obj-1: ", column, column_split, column_split != column);
        
        if (column_name && typeof column_name === "object"){
          if (column.includes("_"))
            column_name = column.includes(".") ? camelizeSnakeCase(column_split, first_letter = true) : camelizeSnakeCase(column, first_letter = true); //, true, " "
          else
            column_name = column.includes(".") ? separateCamelizedString(column_split) : separateCamelizedString(column);
        }
        console.log("column_name-1: ", column_name, column_split != column, typeof column, typeof col_options, col_options);
        
        //set as obj
        if (column_split != column){
          col_options = typeof col_options === "string" ? {"column": col_options} : col_options;
          console.log("set value_location: ", column, col_options);
          columns[column] = { ...{"value_location": column}, ...col_options };
        }
        
        if (Object.keys(col_options).includes("show_empty") && !col_options["show_empty"])
          columns_none_values[column_split] = 0;
        
        //TDS
        //ADD-INDEX
        console.log("add_index: ", add_index);
        if (add_index)
          html += '<td style="text-align: center; vertical-align: middle;">'+(i+1).toString()+'</td>'; //RENDER BY DataTable
        
        console.log("render - column_name-vt: ", column_name, column, columns[column]);
        let title = col_options && typeof col_options === "object" && Object.keys(col_options).includes("help_text") && col_options["help_text"] ? col_options["help_text"] : "";
        if (title && title.length){
          title = title.replace(/"/g, "'");
          title = isHTMLString(title) ? 'data-html="true" data-toggle="tooltip" data-placement="top" title="'+title+'"' : 'title="'+title+'"';
        }
        html += '<th '+title+' class="'+column_split+'" style="background-color: #d9d2e9;">'+column_name+'</th>';
        
        //BUTTONS
        if (buttons && buttons.length){
          let btns_html = '';
          for (var j = 0; j < buttons.length; j++) {
            console.log("buttons[j]: ", buttons[j], j);
            let button = { ...buttons[j] };
            let text = ""
            if (Object.keys(button).includes("text")){
              text = button["text"];
              delete button["text"];
            }
            let btn_el = '';
            if (button && Object.keys(button).length){
              let btn_options = '';
              console.log("href-1: ", Object.keys(button).includes("href"), button["href"]);
              button["href"] = Object.keys(button).includes("href") && button["href"] ? button["href"] : "javascript:void(0)";
              button["href"] = Object.keys(button).includes("href") && button["href"] && button["href"].includes("%%") ? strReplaceData(button["href"], row) : button["href"];
              button["href"] = button["href"] && button["href"].toString().startsWith("uploads/") || button["href"].toString().startsWith("default/") ? "/media/" + button["href"] : button["href"];
              //button["href"] = button["href"] && !button["href"].includes("%%") ? button["href"] : "javascript::void(0)";
              console.log("href-2: ", button["href"], typeof button["href"]);
              
              for (let [attr, val] of Object.entries(button)) {
                if (val && typeof val === "string" && val.includes("%%"))
                  button[attr] = strReplaceData(val, row);
              }
              button["style"] = Object.keys(button).includes("style") ? button["style"]+"margin-left: 5px;" : "margin-left: 5px;";
              
              btn_options = Object.entries(button)
              .map(([key, value]) => `${key}="${value}"`)
              .join(' ').replace('disabled="true"', "disabled").replace('checked="true"', "checked");
              btn_el = '<a '+btn_options+' > '+text+' </a>';
              btn_el = !button["href"] || button["href"].includes("%%") ? disableButton($(btn_el)).outerHTML : btn_el;
            }
            btns_html += btn_el; //class="btn btn-sm btn-indigo ml-1"  style="background-color: #2542A3;"
          }
          html += '<td style="white-space: nowrap; vertical-align: middle;">'+btns_html+'</td>';
        }
        
        console.log("columns-na-vt: ", columns);
        if (row && Object.keys(row).includes("id")) 
          console.log("it-id-1-vt: ", row["id"]);
        
        console.log("adding-row-td-1-vt: ", column, row, col_options);
        //html = createTableTD(html, column, null, row, col_options, categorical_values_dict, options);
        html = createTableTD(html, column, null, row, columns[column], categorical_values_dict, options);
        if (Object.keys(columns_none_values).includes(column) && (!value || value == "--"))
          columns_none_values[column] += 1;
        index += 1;
        
        //BUTTONS
        if (buttons && buttons.length){
          let btns_html = '';
          for (var j = 0; j < buttons.length; j++) {
            console.log("buttons[j]: ", buttons[j], j);
            let button = { ...buttons[j] };
            let text = ""
            if (Object.keys(button).includes("text")){
              text = button["text"];
              delete button["text"];
            }
            let btn_el = '';
            if (button && Object.keys(button).length){
              let btn_options = '';
              console.log("href-1: ", Object.keys(button).includes("href"), button["href"]);
              button["href"] = Object.keys(button).includes("href") && button["href"] ? button["href"] : "javascript:void(0)";
              button["href"] = Object.keys(button).includes("href") && button["href"] && button["href"].includes("%%") ? strReplaceData(button["href"], row) : button["href"];
              button["href"] = button["href"] && button["href"].toString().startsWith("uploads/") || button["href"].toString().startsWith("default/") ? "/media/" + button["href"] : button["href"];
              //button["href"] = button["href"] && !button["href"].includes("%%") ? button["href"] : "javascript::void(0)";
              console.log("href-2: ", button["href"], typeof button["href"]);
              
              for (let [attr, val] of Object.entries(button)) {
                if (val && typeof val === "string" && val.includes("%%"))
                  button[attr] = strReplaceData(val, row);
              }
              button["style"] = Object.keys(button).includes("style") ? button["style"]+"margin-left: 5px;" : "margin-left: 5px;";
              
              btn_options = Object.entries(button)
              .map(([key, value]) => `${key}="${value}"`)
              .join(' ').replace('disabled="true"', "disabled").replace('checked="true"', "checked");
              btn_el = '<a '+btn_options+' > '+text+' </a>';
              btn_el = !button["href"] || button["href"].includes("%%") ? disableButton($(btn_el)).outerHTML : btn_el;
            }
            btns_html += btn_el; //class="btn btn-sm btn-indigo ml-1"  style="background-color: #2542A3;"
          }
          html += '<td style="white-space: nowrap; vertical-align: middle;">'+btns_html+'</td>';
        }
        
        html += '</tr>';
      }
    }
    html += '</tbody>'
    html += '</table>'
    
    let style = "";
    console.log("node_name--: ", node_name);
    if (node_name && node_name != "table"){
      style = $(jq_selector).attr("style") ? $(jq_selector).attr("style") : "";
      $(jq_selector).attr("style", style+" overflow-x: auto;");
      $(jq_selector).append(html);
    }
    else{
      let classes = $(jq_selector).attr("class");
      classes = classes ? classes+" table table-striped table-hover table-bordered" : " table table-striped table-hover table-bordered";
      style = $(jq_selector).parent().attr("style") ? $(jq_selector).attr("style") : "";
      console.log("jq_selector-pin: ", jq_selector);
      $(jq_selector).parent().attr("style", style+" overflow-x: auto;");
      $(jq_selector).html(html).attr("class", classes);
    }
  }
}

function loadRates(jq_selector = "body", options = {}, size_scale = 1){ //, rate_class = "rate-circle"){
  
  var renderType = varInit(options, "renderType", "circle");
  var rate_class = renderType == "box" ? ".rate-box" : ".rate-circle";
  console.log("***loadRates: ", jq_selector, $(jq_selector).find(rate_class))
  
  if($(jq_selector).find(rate_class).length && $(jq_selector).find(rate_class).find("canvas").length != $(jq_selector).find(rate_class).length){
    function loadRateCircles_(event){
      //let size_scale = options && typeof options === "number" ? options : 1;
      //options = options && typeof options === "number" ? {} : options;
      size_scale = varInit(options, "size_scale", size_scale);
      console.log("size_scale: ", size_scale)
      let defaultOptions = { //rateCircle({
        size: 40 * size_scale,
        lineWidth: 3 * size_scale,
        fontSize: 10 * size_scale,
      }
      let mergedOptions = $.extend({}, defaultOptions, options);
      if (renderType == "box")
        $(jq_selector).find(rate_class).rateBox(mergedOptions);
      else
        $(jq_selector).find(rate_class).modifiedRateCircle(mergedOptions);
    }
    let loaded = checkAndImportMethod($(jq_selector).find(rate_class), "rateCircle", loadRateCircles_);
    if (!loaded){
      loadRateCircles_();
    }
  }
}

function loadTable(jq_selector, data = [], columns=[], buttons=[], categorical_values_dict={}, options = {}){
  console.log("***loadTable: ", jq_selector, data, options);
  var html = "";
  
  //INITIALIZATION CHECKS
  if (!jq_selector || !$(jq_selector).length){
    console.warn("Warning: Table not found...", jq_selector, $(jq_selector));
    return null;
  }
  else{
    let tableId = $(jq_selector).attr("id");
    if (!tableId)
      console.warn("Warning: no tableId?...", jq_selector, $(jq_selector), $(jq_selector).attr("id"));
    else{
      tableId = "#"+tableId;
      console.log("tableId: ", tableId);
    }
    if ($.fn.DataTable.isDataTable(tableId)) {
      // Table is already a DataTable, handle accordingly
      // destroy previous DataTable:
      $(tableId).DataTable().destroy();
    }
  }
  
  let node_name = jq_selector && $(jq_selector).length ? $(jq_selector)[0].nodeName.toLowerCase() : null;
  console.log("***loadTable - node_name: ", node_name, jq_selector, typeof data, data.length)
  var columns_none_values = {};
  
  //OPTIONS:
  var table_order = varInit(options, "order_by", null);
  if (table_order){
    data = orderObjList(data, table_order[0], table_order[0], true);
    table_order = {};
  }
  var is_first_col_header = data && typeof data === "object" && !Array.isArray(data) ? true : false;
  var add_index = varInit(options, "add_index", false);
  console.log("add_index-1: ", add_index, options, typeof columns);
  
  if (is_first_col_header)
    data = [data];
  //  return loadVerticalTable(jq_selector, data = data, columns=columns, buttons=buttons, categorical_values_dict=categorical_values_dict, options = options)
  
  if (node_name != "table" || data.length){
    let table_options = varInit(options, "table", {});
    let center_content = varInit(table_options, "center", false);
    center_content = center_content ? 'style="text-align: center;"': "";
    let default_table_options = {"class": "table table-striped table-hover table-bordered"};
    table_options = { ...default_table_options, ...table_options };
    html += createHTMLElement("table", table_options, as_str = true)
    //html += '<table class="table table-striped table-hover table-bordered">'
    
    html += '<thead>'
    html += '<tr>'
    
    //IF NOT COLUMNS THEN COLUMNS FROM DATA
    console.log("columns-: ", columns, typeof columns, data);
    if (columns && (columns.length || (typeof columns === "object"  && !Array.isArray(columns))))
      columns = columns;
    else if (data && data.length)
      columns = Object.keys(data[0]);
    console.log("columns-init: ", typeof columns, columns);
    
    //IF COLUMNS IS LIST AND COL_OPTIONS IN OPTIONS THEN CONVERT TO OBJECT
    if (typeof columns === "object" && Array.isArray(columns)){
      let columns_ = columns;
      columns = {};
      for (var i = 0; i < columns_.length; i++) {
        let column = columns_[i];
        col_options = varInit(options, column, {});
        console.log("converting column: ", column);
        columns[column] = { ...{}, ...col_options };
      }
      console.log("columns-converted-1...");
    }
    
    if (typeof columns === "object"){
      
      //ORDER COLUMNS
      var keyIndexOrder = {}
      var index = 0;
      var has_order = false;
      
      //SET COLUMNS / ORDER COLUMNS
      for (let [column, col_options] of Object.entries(columns)) {
        console.log("if-o: ", col_options, typeof col_options === "object", Object.keys(col_options).includes("order"))
        if (typeof col_options === "object" && Object.keys(col_options).includes("order") && col_options["order"]){
          has_order = true
          //keyIndexOrder.push(col_options["order"])
          keyIndexOrder[col_options["order"]] = column
        }
        else
          //keyIndexOrder.push(index)
          keyIndexOrder[index] = column
        if (!table_order && typeof col_options === "object" && Object.keys(col_options).includes("table_order") && col_options["table_order"]){
          table_order = add_index ? index+1 : index;
          table_order = [[table_order, col_options["table_order"]]]
        }
        index += 1
      }
      console.log("keyIndexOrder-pre: ", keyIndexOrder);
      //columns = has_order ? reorderObjectKeys(columns, keyIndexOrder) : columns;
      console.log("new_cols: ", columns, has_order, keyIndexOrder);
      
      //RENDER TABLE
      //RENDER TABLE HEADERS
      //THS
      console.log("add_index: ", add_index);
      //let th_options = varInit(options, "th", {});
      //let th_element = createHTMLElement("th", th_options, as_str = true);
      if (add_index)
        html += '<th>#</th>'; //th_element+
      
      console.log("rendering-columns-pua: ", columns);
      //for (let [column, col_options] of Object.entries(columns)) {
      for (let [index, column] of Object.entries(keyIndexOrder)) {
        let col_options = columns[column];
        let column_name = col_options && typeof col_options === "object" && Object.keys(col_options).includes("column") ? col_options["column"] : col_options;
        console.log("render-column-th: ", column, col_options, typeof col_options, column.includes("_"), column_name);
        
        let column_split = column.includes(".") ? column.split(".") : column;
        column_split = column.includes(".") ? column_split[column_split.length-1] : column;
        console.log("column-to-obj-1: ", column, column_split, column_split != column);
        
        if (column_name && typeof column_name === "object"){
          if (column.includes("_"))
            column_name = column.includes(".") ? camelizeSnakeCase(column_split, first_letter = true) : camelizeSnakeCase(column, first_letter = true); //, true, " "
          else
            column_name = column.includes(".") ? separateCamelizedString(column_split) : separateCamelizedString(column);
        }
        console.log("column_name-1: ", column_name, column_split != column, typeof column, typeof col_options, col_options);
        
        //set as obj
        if (column_split != column){
          col_options = typeof col_options === "string" ? {"column": col_options} : col_options;
          console.log("set value_location: ", column, col_options);
          columns[column] = { ...{"value_location": column}, ...col_options };
        }
        
        if (Object.keys(col_options).includes("show_empty") && !col_options["show_empty"])
          columns_none_values[column_split] = 0;
        
        console.log("render - column_name: ", column_name, column, columns[column]);
        let title = col_options && typeof col_options === "object" && Object.keys(col_options).includes("help_text") && col_options["help_text"] ? col_options["help_text"] : "";
        let help_icon = col_options && typeof col_options === "object" && Object.keys(col_options).includes("help_icon") ? col_options["help_icon"] : false;
        if (title && title.length){
          if (help_icon == true){
            let data_html = isSelectorOrHtmlString(title) == "html" ? 'data-html="true"' : "";
            help_icon = ' <i class="fa fa-question-circle info-label" data-toggle="tooltip" data-placement="bottom" title="'+title+'" '+data_html+'></i>';
            title = "";
          }
          else{
            title = title.replace(/"/g, "'");
            console.log("isHTMLString(title): ", column_name, column, isHTMLString(title), title);
            title = isHTMLString(title) ? 'data-html="true" data-toggle="tooltip" data-placement="top" title="'+title+'"' : 'title="'+title+'"';
            help_icon = "";
          }
        }
        else
          help_icon = "";
        html += '<th '+title+' class="'+column_split+'" '+center_content+' >'+column_name+help_icon+'</th>';
      }
      console.log("columns-2...");
    }
    else
      for (var i = 0; i < columns.length; i++) {
        let column_name = columns[i];
        console.log("rendering-column-th-2: ", column_name, typeof column_name);
        html += '<th '+center_content+' >'+column_name+'</th>'
      }
    
    //BUTTONS COL TH
    if (buttons && buttons.length)
      html += '<th></th>'
    
    html += '</tr>'
    html += '</thead>'
    
    html += '<tbody>'
    console.log("tbody-data: ", data);
    
    //RENDER TABLE BODY
    //TRS
    for (var i = 0; i < data.length; i++) {
      row = data[i];
      console.log("adding-trs-row: ", row, i, columns);
      if (row){
        
        html += '<tr>';
        
        //TDS
        //ADD-INDEX
        console.log("add_index: ", add_index);
        if (add_index)
          html += '<td style="text-align: center; vertical-align: middle;">'+(i+1).toString()+'</td>'; //RENDER BY DataTable
        
        if (typeof columns === "object" && !Array.isArray(columns)){
          console.log("columns-na: ", columns);
          
          //for (let [column, col_options] of Object.entries(columns)) {
          for (let [index, column] of Object.entries(keyIndexOrder)) {
            let col_options = columns[column];
            console.log("adding-row-td-1: ", column, row, col_options);
            
            //let value = getDeepValue(row, column);
            if (row && Object.keys(row).includes("id")) 
              console.log("it-id-1: ", row["id"]);
            //console.log("value-1: ", value, i, column);
            //html = createTableTD(html, column, value, row, col_options, categorical_values_dict, options);
            html = createTableTD(html, column, null, row, col_options, categorical_values_dict, options);
            if (Object.keys(columns_none_values).includes(column) && (!value || value == "--"))
              columns_none_values[column] += 1;
            index += 1;
          }
        }
        else{
          console.log("columns-a2: ", columns);
          for (var j = 0; j < columns.length; j++) {
            let column = columns[j];
            console.log("it-row-2: ", row, column, j, add_index);
            //let value = column && Object.keys(row).includes(column) ? row[column] : "";
            //console.log("value-2: ", value, i, j, column);
            //html = createTableTD(html, column, value, row, {}, categorical_values_dict, options);
            html = createTableTD(html, column, null, row, {}, categorical_values_dict, options);
            index += 1;
          }
        }
        
        //BUTTONS
        if (buttons && buttons.length){
          let btns_html = '';
          for (var j = 0; j < buttons.length; j++) {
            console.log("buttons[j]: ", buttons[j], j);
            let button = { ...buttons[j] };
            let text = ""
            if (Object.keys(button).includes("text")){
              text = button["text"];
              delete button["text"];
            }
            let btn_el = '';
            if (button && Object.keys(button).length){
              let btn_options = '';
              console.log("href-1: ", Object.keys(button).includes("href"), button["href"]);
              button["href"] = Object.keys(button).includes("href") && button["href"] ? button["href"] : "javascript:void(0)";
              button["href"] = Object.keys(button).includes("href") && button["href"] && button["href"].includes("%%") ? strReplaceData(button["href"], row) : button["href"];
              button["href"] = button["href"] && button["href"].toString().startsWith("uploads/") || button["href"].toString().startsWith("default/") ? "/media/" + button["href"] : button["href"];
              //button["href"] = button["href"] && !button["href"].includes("%%") ? button["href"] : "javascript::void(0)";
              console.log("href-2: ", button["href"], typeof button["href"]);
              
              for (let [attr, val] of Object.entries(button)) {
                if (val && typeof val === "string" && val.includes("%%"))
                  button[attr] = strReplaceData(val, row);
              }
              button["style"] = Object.keys(button).includes("style") ? button["style"]+"margin-left: 5px;" : "margin-left: 5px;";
              
              btn_options = Object.entries(button)
              .map(([key, value]) => `${key}="${value}"`)
              .join(' ').replace('disabled="true"', "disabled").replace('checked="true"', "checked");
              btn_el = '<a '+btn_options+' > '+text+' </a>';
              btn_el = !button["href"] || button["href"].includes("%%") ? disableButton($(btn_el)).outerHTML : btn_el;
            }
            btns_html += btn_el; //class="btn btn-sm btn-indigo ml-1"  style="background-color: #2542A3;"
          }
          html += '<td style="white-space: nowrap; vertical-align: middle;">'+btns_html+'</td>';
        }
        
        html += '</tr>';
      }
    }
    html += '</tbody>'
    html += '</table>'
    
    let style = "";
    console.log("node_name--: ", node_name);
    if (node_name && node_name != "table"){
      style = $(jq_selector).attr("style") ? $(jq_selector).attr("style") : "";
      $(jq_selector).attr("style", style+" overflow-x: auto;");
      $(jq_selector).append(html);
    }
    else{
      let classes = $(jq_selector).attr("class");
      classes = classes ? classes+" table table-striped table-hover table-bordered" : " table table-striped table-hover table-bordered";
      style = $(jq_selector).parent().attr("style") ? $(jq_selector).attr("style") : "";
      console.log("jq_selector-pin: ", jq_selector);
      $(jq_selector).parent().attr("style", style+" overflow-x: auto;");
      $(jq_selector).html(html).attr("class", classes);
    }
  }
  
  //https://datatables.net/examples
  //DataTable Options
  console.log("datatable options: ", options);
  options["columnDefs"] = [];
  if (buttons && buttons.length)
    options["columnDefs"].push(
      { targets: -1, orderable: false }
    ) // Disables sorting for the last column (index -1), first [0]
  /*if (add_index && !Array.isArray(table_order)){
    options["columnDefs"].push(
      {
        targets: 0,
        render: function(data, type, row, meta) {
          console.log("meta.row: ", data, type, row, meta, meta.row);
          if (type === 'display') {
            return meta.row + 1;
          }
          return data;
        }
      }
    )
  }*/
  
  $(document).ready(function() {
    
    function handleDataTableChange(options){
      //https://www.jqueryscript.net/demo/jQuery-Plugin-To-Create-Canvas-Based-Graphical-Ratings-Rate/
      let rate_options = varInit(options, "rate", {});
      loadRates(jq_selector, rate_options);
    }
    
    //LOAD-RENDER PLUGINS
    let table_name = $(jq_selector).attr("id") ? $(jq_selector).attr("id").replace("_wrapper", "") : jq_selector.replace("#", ""); //.split(" ")[0]
    console.log("table_name: ", table_name);
    handleDataTableChange(options);
    
    if (table_order && Array.isArray(table_order))
      options["order"] = table_order;
    console.log("table_order-: ", table_order, options);
    
    /*{
      "info": true,
      "language": {
        "info": "Showing _START_ to _END_ of _TOTAL_ entries"
      }
      scrollX: true,
      fixedColumns: {
        leftColumns: 1
      },
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
      "pageLength": 25
    }*/
    
    dataTable = null;
    if (node_name && node_name != "table"){
      console.log("if-1-: ", $(jq_selector).find(".datatables"));
      dataTable = $(jq_selector).find(".datatables").DataTable(options);
    }
    else if ($(jq_selector).hasClass("datatables") && $(jq_selector).html() != ""){
      console.log("if-2-: ", $(jq_selector).find(".datatables"));
      dataTable = $(jq_selector).length ? $(jq_selector).DataTable(options) : null;
    }
    loadUXPlugins();
    
    if (dataTable){
      
      // TRUNCATE: Truncate text in cells
      let truncate = varInit(options, "truncate", false);
      if (truncate){
        console.log("truncate: ", truncate);
        dataTable.on('draw', function () {
          console.log("draw.dt-event...");
          dataTable.cells('.dataTable-cell').render(function (data, type, row) {
            console.log("cell: ", data);
            if (type === 'display' && data && data.length > 20) {
              return data.substring(0, 17) + '...';
            }
            return data;
          });
        });
        
        // TOOLTIP: Add tooltip to truncated cells //init.dt, draw, draw.dt (re-draw)
        dataTable.on('draw', function () {
          dataTable.cells('.dataTable-cell').every(function () {
            const cell = this;
            if (cell.data() && cell.data().length > 20) {
              cell.nodes().to$().attr('title', cell.data());
            }
          });
        });
      }
      
      // COLLAPSIBLE: Add collapsible rows
      let collapse = varInit(options, "collapse", false);
      if (collapse){
        console.log("collapse: ", collapse);
        /*dataTable.on('click', "tr[role='row']", function (event) {
          event.preventDefault();
          console.log("CLICK tr.parent: ", event);
          const row = this;
          const rowData = dataTable.row(row).data();
          console.log("rowData: ", rowData);
          
          if (row.nextSibling && row.nextSibling.classList.contains('child')) {
            dataTable.row(row.nextSibling).remove();
            row.classList.remove('shown');
          } else {
            const childRow = dataTable.row.add({
              // Create a child row with detailed content
              content: 'Detailed content goes here...',
              // ...
            }, row.nextSibling).node();
            childRow.classList.add('child');
            row.classList.add('shown');
          }
        });*/
        
        //REDUCE TEXT CONTENT
        function format ( d, columnNamesStr = null) {
          // `d` is the original data object for the row
          console.log("d: ", d);
          return createTableFromObject(d, columnNamesStr); /*'<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
              '<tr>'+
                  '<td>Full name:</td>'+
                  '<td>'+d.name+'</td>'+
              '</tr>'+
              '<tr>'+
                  '<td>Extension number:</td>'+
                  '<td>'+d.extn+'</td>'+
              '</tr>'+
              '<tr>'+
                  '<td>Extra info:</td>'+
                  '<td>And any further details here (images etc)...</td>'+
              '</tr>'+
          '</table>';*/
        }
        
        // DOUBLECLICK: Add event listener for opening and closing details
        var columnNames = dataTable.columns().header().toArray();
        // Convert column names to string
        const columnNamesStr = columnNames.map(column => column.innerText);
        dataTable.on('dblclick', "tr[role='row']", function(event){ //td.dataTable-cell
          event.preventDefault();
          console.log("CLICK-dt: ", event);
          var tr = $(this); //.closest('tr');
          var row = dataTable.row( tr );
          
          if(row.child.isShown()){
              // This row is already open - close it
              row.child.hide();
              tr.removeClass('shown');
          } else {
              // Open this row
              row.child(format(row.data(), columnNamesStr)).show();
              tr.addClass('shown');
          }
      });
      }
      
      // Find the control target element and insert the button after it
      let wrapper_id = "#"+$(jq_selector).attr("id")+"_wrapper";
      let targetElement = $(wrapper_id).find(".row").first().find(".dataTables_length");
      console.log("targetElement: ", targetElement, $(wrapper_id).find(".row").first(), $(wrapper_id).find(".row").first().find(".dataTables_length"));
      
      //MOVE NUMBER ENTRY INFO TO TOP
      console.log(".dataTables_info: ", $($(wrapper_id).find(".dataTables_info").length).find(".dataTables_info"), $(wrapper_id).find(".dataTables_info").length);
      if ($(wrapper_id).find(".dataTables_info").length){
        targetElement.after($(wrapper_id).find(".dataTables_info"));
      }
      
      // COPY-TO-CLIPBOARD: Attach click event handler to the Copy to Clipboard button
      controls_clipboard = varInit(options, "controls.clipboard", false);
      console.log("controls_clipboard: ", controls_clipboard, dataTable);
      if (controls_clipboard){
        
        // Create the button element
        let table_name = $(jq_selector).attr("name");
        if (!table_name)
          console.warn("Warning: No name for DataTable, using id...", $(jq_selector).attr("name"), $(jq_selector));
          table_name = $(jq_selector).attr("id");
        
        var button = createPasteButton(table_name+"_paste_button", false, "align:right;margin-left: 10px;");
        console.log("button: ", button, $(jq_selector).attr("name"));
        
        //controls_clipboard = controls_clipboard.toString().startsWith("#") ? controls_clipboard : "#"+controls_clipboard;
        $(button).on('click', function(event) {
          event.preventDefault();
          console.log("CLICK: ", event, dataTable);
          // Get the table data as a formatted string
          copyDataTable2Clipboard(dataTable);
        });
        
        
        targetElement.after(button);
      }
    }
    
    //ANY_VALUE: HIDE COLUMNS WITH NO VALUES
    /*console.log("columns_none_values-3: ", columns_none_values);
    if (Object.keys(columns_none_values).length){
      for (const [column, none_value] of Object.entries(columns_none_values)) {
        console.log("+res columns_none_values: ", column, none_value);
        if (none_value == data.length)
          $(jq_selector).find("."+column).hide();
      }
    }*/
    
    /*
    // Attach event listeners for content changes
    //$(jq_selector).on('DOMSubtreeModified', handleDataTableChange);
    
    $(jq_selector).on('page.dt', function (e, settings) {
      //var info = $(jq_selector).DataTable().page.info();
      //console.log('info: ', info);
      console.log('Page-event occurred at: '+new Date().getTime(), e, settings);
    }) //.then(function(element){handleDataTableChange();});
    
    $(jq_selector).on('length.dt', function (e, settings, len) {
      console.log('length-event occurred at: '+new Date().getTime(), e, settings, len);
    });
    
    $(jq_selector).on('draw', function () {
      console.log('Redraw occurred at: '+new Date().getTime());
    });
    
    $(jq_selector).on('childRow.dt', function(e, show, row) {
      console.log((show ? "Showing " : "Hiding ") + "row " + row.index());
    });
    
    $(jq_selector).on( 'buttons-action', function ( e, buttonApi, dataTable, node, config ) {
      console.log( 'Button '+buttonApi.text()+' was activated', e, buttonApi, dataTable, node, config );
    } );
    
    // Attach a click event handler to the pagination buttons
    $(jq_selector).parent().on('click', '.paginate_button, a[data-dt-idx]', function () {
      console.log("datatable-paginate_button CLICKED!...");
      handleDataTableChange();
    });
    
    // Attach a change event handler to the results per page dropdown
    if (table_name)
      $(jq_selector).on('change', 'select[name="'+table_name+'_length"]', function () {
        console.log("datatable-select-change CHANGED!...");
        handleDataTableChange();
      });
    */
  });
  
}

function createTableTD(html, column, value = null, row = {}, col_options = {}, categorical_values_dict = {}, options = {}){
  console.log("***createTableTD: ", column, value, col_options);
  console.log("row-: ", row, column);
  let value_location = Object.keys(col_options).includes("value_location") ? col_options["value_location"] : column;
  console.log("value_location-ctd: ", value_location);
  if (value_location)
    value = !value ? getDeepValue(row, value_location) : value;
  value = value == null ? getDeepValue(row, column) : value;
  let value_ = null; //categorical value //used when json value
  console.log("value-ctd: ", value)
  var id = row && typeof row === "object" && Object.keys(row).includes("id") ? row["id"] : null;
  var name = row && typeof row === "object" && Object.keys(row).includes("name") ? row["name"] : null;
  let class_ = [];
  let style = [];
  let sorting = "";
  let title = "";
  let has_wrapper = Object.keys(col_options).includes("wrapper") ? true : false;
  var is_constraint = Object.keys(col_options).includes("is_constraint") ? col_options["is_constraint"] : false;
  
  column = column.split(".");
  //column = column[column.length-1];
  column = column && Array.isArray(column) ? column[column.length-1] : column;
  let column_single_name = column;
  column = column && column != column.toString().toLowerCase() ? toUncamelize(column) : column;
  console.log("ctv-value: ", column, value);
  
  if (value != null){
    
    //CHECK URL FIELDS
    if (!has_wrapper && (column == "url" || value.toString().startsWith("http") || value.toString().startsWith("www.")))
      value = '<a target="_blank" href="'+value+'">'+value+'</a>';
    //EMAIL
    else if (!has_wrapper && (column == "email" || (value.toString().includes("@") && value.toString().split("@")[1].includes(".") && !value.toString().includes(" "))))
      value = '<a href="mailto:'+value+'">'+value+'</a>';
    //IMAGES
    else if (value.toString().startsWith("/media/") || value.toString().startsWith("uploads/") || value.toString().startsWith("default/")){ // && ["logo", "img", "photo_cover"].includes(column)
      sorting = value
      value = value.toString().startsWith("uploads/") || value.toString().startsWith("default/") ? "/media/" + value : value; 
      value = '<img src="'+value+'" class="img-rounded height-30">';
      class_.push("with-img");
    }
    //else if (typeof value === "number")
    
    //CATEGORICAL VALUES
    column = Array.isArray(column) ? column[column.length-1] : column;
    if (typeof categorical_values_dict === "string" && col_options && Object.keys(col_options).includes(categorical_values_dict)){
      let categorical_values_dict_ = {};
      categorical_values_dict_[column] = col_options[categorical_values_dict]
      categorical_values_dict = categorical_values_dict_;
    }
    console.log("1-categorical_values_dict-: ", column, value, categorical_values_dict, typeof value, Object.keys(categorical_values_dict).includes(column));
    
    if (Object.keys(categorical_values_dict).includes(column))
      console.log("if-: ", id, column, Object.keys(categorical_values_dict[column]).includes(value), typeof Object.keys(categorical_values_dict)[0], typeof value);
    
    if (categorical_values_dict && Object.keys(categorical_values_dict).includes(column) && (typeof value === "string" || typeof value === "number")){
      value_ = Object.keys(categorical_values_dict[column]).includes(value.toString()) ? categorical_values_dict[column][value.toString()] : categorical_values_dict[column];
      if(value){
        sorting = value.toString().startsWith("O") ? value.toString().replace("O", "") : value.toString().replace("A_", "");
        //sorting to int?
      }
      console.log("2-value-set: ", id, column, value, typeof value, value_, typeof value_, value.toString(), value.toString().startsWith("["));
      
      //JSON-STR
      if (typeof value === "string" && value.toString().startsWith("[") && value.toString().endsWith("]")){
        value_ = JsonStr2Obj(value);
        value = convertCategoricalValues(value_, categorical_values_dict[column]); //[];
        sorting = calculateAverage(value_);
        console.log("3-value_l: ", column, value_, sorting);
        
        //UPDATE CATEGORICAL VALUES
        /*for (var j = 0; j < value_.length; j++) {
          let value__ = value_[j] ? value_[j].toString() : value_[j];
          console.log("it-value_: ", id, column, value__, value__.toString (), Object.keys(categorical_values_dict[column]), Object.keys(categorical_values_dict[column]).includes(value__.toString()));
          if (Object.keys(categorical_values_dict[column]).includes(value__))
            value.push(categorical_values_dict[column][value__]);
          else if (Object.keys(categorical_values_dict[column]).includes(value__.toString()))
            value.push(categorical_values_dict[column][value__.toString()]);
          console.log("value-set-2: ", id, column, value, value__.toString());
        }*/
        value = value.join(", ");
      }
      else if (typeof value === "string" && value && value.toString().startsWith("A_") && typeof value_ === "object" && Object.keys(value_).length){
        value = value_[value.toString().replace("A_", "")];
      }
      else if (!isNaN(value)){ //if is a number or can be cast to number
        console.log("!isNaN...", value, typeof value, value_, typeof value_);
        value = is_constraint ? value : convertCategoricalValues(value, categorical_values_dict[column]); //value;
      }
      else{
        console.log("isNaN?...", value, value_, typeof value, typeof value_);
        value = value_;
      }
    }
    else { console.log("CHECK: No categorical value..."); }
    
    //CHECK COUNTRY FIELDS
    console.log("4-check-COUNTRY: ", value);
    if (Object.keys(value).includes("country")){
      console.log("country: ", value["country"]);
      let country = value["country"];
      if (typeof country === "object"){
        let flag_img = null; //getDeepValue(country, "flag_img");
        let name = getDeepValue(country, "country.name");
        let location_name = getDeepValue(country, "name");
        name = name ? name : location_name;
        console.log("flag_img: ", flag_img);
        if (flag_img){
          flag_img = flag_img.toString().startsWith("uploads/") || value.toString().startsWith("default/") || value.toString().startsWith("/media/") ? country.flag_img : "uploads/countries/23px-"+flag_img;
          flag_img = flag_img.toString().startsWith("uploads/") || value.toString().startsWith("default/") ? "/media/" + flag_img : flag_img; 
          value = '<img src="'+flag_img+'" title="'+location_name+'" class=""> '; //img-rounded
          sorting = name ? name.toString() : "";
          class_.push("with-img");
        }
        else { value = name; }
      }
      value = typeof value === "object" ? value.name : value;
    }
  }
  else { console.log("CHECK: No value..."); }
  
  //CHECK NONE-STR-VALUE
  console.log("5-check-value-1: ", value);
  value = value == null && (!value && !is_constraint) || value == "None" || value == "null" ? "--" : value;
  console.log("check-value-2: ", value, typeof value);
  //let null_value = Object.keys(col_options).includes("null_value") ? col_options["null_value"] : null;
  //if ((!value || value == "--") && null_value)
  //  value = null_value;
  //console.log("null_value: ", null_value, value);
  if (value && value !="--"){
    let no_staff = Object.keys(col_options).includes("no_staff") ? col_options["no_staff"] : false;
    if (no_staff == true && value.toString().endsWith("@digitalpartners.ai"))
      value = null;
    
    let exceptions = Object.keys(col_options).includes("exceptions") ? col_options["exceptions"] : null;
    exceptions = Array.isArray(exceptions) ? exceptions : [exceptions];
    console.log("exceptions-: ", exceptions);
    if (exceptions && exceptions.length && (exceptions.includes(value) || (typeof exceptions[0] === "number" && exceptions.includes(parseInt(value))) || (typeof exceptions[0] === "string" && isNumeric(value) && exceptions.includes(value.toString()))))
      value = null;
    let negate = Object.keys(col_options).includes("negate") ? col_options["negate"] : false;
    console.log("negate: ", negate, typeof negate, value, typeof value);
    if (negate == true){
      value = negateValue(value);
      console.log("negated: ", value, typeof value);
    }
  }
  
  var numeric_precision = varInit(col_options, "numeric_precision", null);
  if (numeric_precision)
    value = applyPrecision(value, numeric_precision); //if not numeric don't do anything
  
  //SUMMARICE LONG text
  let max_len = varInit(options, "max_len", null);
  console.log("6-value-long: ", value, typeof value, max_len);
  if (typeof value === "string" && value != "--")
    console.log("value.length-long: ", value.length, max_len, value, isHTMLString(value));
  if (max_len && typeof value === "string" && value.length > max_len && (!value.startsWith("/") && !isHTMLString(value))){
    title = value;
    if (value.includes("(")){
      value = value.replace(/\([^)]+\)/g, "");
    }
    if (value.length > max_len){
      if (value.includes("/"))
        value = value.replace(/\s*\/\s*[^,]+/g, "");
      if (value.length > max_len)
        value = value.substring(0, max_len)+"...";
    }
    console.log("long-max_len: ", title, value, max_len);
  }
  
  //DISPLAY RENDER
  console.log("7-display-render-td: ", value);
  if (col_options && Object.keys(col_options).length){
    
    //CONSTRAINTS / KO
    console.log("is_constraint-1?: ", is_constraint, value)
    if(is_constraint){
      console.log("is_constraint-2: ", id, name, col_options["is_constraint"], "'", value, "'", column, value_location);
      let icon = "fas fa-question-circle";
      if ((!value || (value && value == "--")) && value_location != column && value_location.includes(".") && Object.keys(row).includes(column)){
        console.log("ic-value: ", value, row[column]);
        value = row[column];
        if (typeof value === "string" && value.toString().startsWith("[") && value.toString().endsWith("]")){
          value_ = JsonStr2Obj(value);
          value_ = convertCategoricalValues(value_, categorical_values_dict[column]); //[];
          value_ = value_.join(", ");
        }
      }
      
      console.log("ic-value-2: ", value, typeof value, column, row);
      let constraint_ok = 0;
      let any_options = varInit(col_options, "any_option", false);
      if (value != null && value != "--"){
        constraint_ok = typeof value === "string" && col_options["best_values"] ? getScoreByPresence(col_options["best_values"].split(", "), value.toString().split(", "), any_options) : value;
        icon = constraint_ok && constraint_ok != 0 ? "fas fa-check-circle" : "fas fa-times-circle";
        //value = constraint_ok;
        console.log("constraint_ok: ", id, name, constraint_ok, icon, title);
      }
      else{
        value = "--";
        console.log("CHECK: none-value", col_options);
      }
      
      console.log("value_c: ", value, typeof value, value_, typeof value_, any_options);
      //value_ = value_ == null ? JsonStr2Obj(value) : value_;
      let constraint_title_value = (typeof value !== "string" || (value.toString().startsWith("[") && value.toString().endsWith("]"))) && typeof value_ === "string" ? value_ : value;
      console.log("is_constraint-22: ", id, name, constraint_ok, icon, constraint_title_value, value, typeof value, value_location, typeof value_location, col_options["best_values"]);
      if (typeof constraint_title_value === "string" && col_options["best_values"]){
        let any_options_ = any_options == true ? " (any)" : "";
        col_options["wrapper"] = '<div title="value: '+constraint_title_value+'&#10;target'+any_options_+': '+col_options["best_values"]+'" style="font-size: 200%;" class="'+icon+'" data-value="'+constraint_ok+'"></div>'
      }
      else{
        if (column == "constraintResult" || column == "constraint_result")
          constraint_title_value = constraint_title_value == 1 ? "Success" : "Fail";
        col_options["wrapper"] = '<div title="'+constraint_title_value.toString()+'" style="font-size: 200%;" class="'+icon+'" data-value="'+constraint_ok+'"></div>'
      }
      //value = constraint_ok;
      style.push("text-align: center; vertical-align: middle");
    }
    
    //RENDER TYPE
    let render_type = null;
    if (Object.keys(col_options).includes("render_type"))
      render_type = col_options["render_type"];
    else if(Object.keys(col_options).includes("type"))
      render_type = col_options["type"];
    console.log("render_type: ", id, name, render_type, col_options, value);
    if (render_type){
      //SCORE-OPTIONS
      if (render_type == "score" || render_type == "scoring"){
        let rate_class = varInit(options, "rate.renderType", "circle") == "box" ? "rate-box" : "rate-circle";
        col_options["wrapper"] = '<div class="'+rate_class+'" data-value="%%value%%"></div>';
        sorting = value;
        let has_multiplicator = Object.keys(col_options).includes("multiplicator") && typeof col_options["multiplicator"] === "number" ? true : false;
        value = has_multiplicator ? Math.round(value*col_options["multiplicator"]) : value;
        value = value ? value : "--";
      }
      else if (render_type == "num_label" || render_type == "num_label"){
        sorting = value;
        value = value ? num2Label(value) : "--";
      }
    }
    
    //HTML WRAPPERS
    if (Object.keys(col_options).includes("wrapper")){
      console.log("wrapper: ", id, column, col_options["wrapper"], row, title);
      console.log("sorting: ", id, column, sorting, value);
      sorting = !sorting ? value : sorting;
      let null_wrapper = Object.keys(col_options).includes("null_wrapper") ? col_options["null_wrapper"] : null;
      let wrapper = (!value || value == "--") && null_wrapper ? strReplaceData(col_options["null_wrapper"], row, ["%%value%%"]) : strReplaceData(col_options["wrapper"], row, ["%%value%%"]);
      value = wrapper.replace("%%value%%", value);
    }
  }
  
  if (col_options && value){
    let col_label = typeof col_options === "object" ? col_options["label"] : col_options;
    let col_unit = col_label && col_label.includes("[") ? col_label.split("[")[1].replace("]", "") : null;
    if (col_unit)
      value = value.replace(" "+col_unit, "")
    console.log("col_unit: ", col_unit, value);
  }
  
  //CREATE ELEMENT
  console.log("+res ctdv-value: ", id, column, value, sorting, sorting && sorting.length, typeof sorting);
  sorting = sorting && (sorting.length || typeof sorting === "number") ? 'data-order="'+sorting.toString()+'" data-sorting="'+sorting.toString()+'"' : "";
  console.log("sorting: ", id, column, sorting)
  class_.push("dataTable-cell");
  class_.push(column_single_name); //for show_empty attr logic
  class_ = class_ && class_.length ? 'class="'+class_.join(" ")+'"' : class_;
  style.push("vertical-align: middle");
  style = style && style.length ? 'style="'+style.join("; ")+'"' : style;
  console.log("style-ptd: ", style, style.length);
  title = title && title.length ? 'title="'+title+'"' : title;
  let td_element = '<td '+class_+' '+style+' '+sorting+' '+title+' >'+value+'</td>';
  html += td_element;
  console.log("+res td_element: ", id, column, td_element);
  return html
}

function dataTableGetInvalidCells(jqSelector) {
  // Retrieve the DataTable using the jQuery selector
  var table = $(jqSelector);

  // Extract the column headers
  var headers = [];
  table.find('thead th').each(function() {
    headers.push($(this).text());
  });

  // Initialize an object to store invalid values for each column
  var invalidValues = {};
  headers.forEach(function(header) {
    invalidValues[header] = [];
  });

  // Find invalid cells with '--' or 'none' values
  table.find('tbody tr').each(function() {
    $(this).find('td').each(function(index) {
      var value = $(this).text().trim();
      if (value === '--' || value.toLowerCase() === 'none') {
        invalidValues[headers[index]].push(value);
      }
    });
  });

  // Create HTML elements for the list of invalid values for each column
  for (var header in invalidValues) {
    var values = invalidValues[header];
    if (values.length > 0) {
      var headerElement = $('<h3>').text("Invalid values in column '" + header + "':");
      var list = $('<ul>');
      values.forEach(function(value) {
        var listItem = $('<li>').text(value);
        list.append(listItem);
      });
      $('body').append(headerElement, list);
      $('body').append('<br>');
    }
  }
}




function dinamic_form(jq_selector, data, template, field_name = "field", help_field = "help_text", button_submit = null, callback = null, title_field = "title", value_field = "value", input_type_field = "input_type", input_options_field = "input_options"){
  console.log("***dinamic_form: ", jq_selector, data, template, field_name, help_field, button_submit, typeof callback);
  var data_ = list_to_dict(data, field_name);
  console.log("data_: ", data_);
  var template_ = list_to_dict(template, field_name);
  var form_data = {}
  let pre_type = null;
  let i = 1;
  let category = null;
  console.log("template_: ", template_, template, data_, Object.entries(template_));
  var html = "";
  
  for (const [field, template_reg] of Object.entries(template_)) {
    console.log("--i: ", i, field)
    //CREATE FORM
    
    let type =  template_reg && Object.keys(template_reg).includes(input_type_field) ? template_reg[input_type_field] : null;
    type = !type ? "checklist" : type;
    let type_ = type.includes("_") ? type.split("_")[1] : type;
    let options =  template_reg && Object.keys(template_reg).includes(input_options_field) ? template_reg[input_options_field] : null;
    let title = template_reg && Object.keys(template_reg).includes(title_field) ? template_reg[title_field] : null;
    title = !title && field ? toCamelCase(field, true, " ") : title;
    help_text = template_reg && Object.keys(template_reg).includes(help_field) ? template_reg[help_field] : null;
    help_text = !help_text && field ? "Seleccione el/los valores que mejor describen al partner y sus servicios" : help_text;
    console.log("iter: ", field, template_reg, type, type_, options, title);
    //disabled = disabled ? "disabled" : "";
    
    if (type == "multi_checkbox" || type == "slider" ){
      
      //html += '<div class="clearfix"></div>';
      //html += '<br>';
      let margin_top = type == "slider" ? 80 : 40;
      html += '<div id="'+field+'" class="nicelabel" style="white-space: nowrap; display: inline-block; margin-left:50px; margin-top:40px;">';
      html += '<h2 style="margin-rigth:20px;">'+title+'';
      if (help_text && help_text.length){
        let data_html = isSelectorOrHtmlString(help_text) == "html" ? 'data-html="true"' : "";
        html += ' <i class="fa fa-question-circle info-label" data-toggle="tooltip" data-placement="top" title="'+help_text+'" '+data_html+'></i>'
      }
      html += '</h2><br>';
      
      if (type == "multi_checkbox"){
        console.log("is multi_checkbox...", field);
        var j = 0;
        
        for (const [option_value, option_label] of Object.entries(options)) {
          console.log("option: ", option_value, option_label);
          //'{"position_class": "text_radio", "checked_text": "Checked", "unchecked_text": "jQuery"}' 
          //checked
          html += "<input class='text-nicelabel' value='"+option_value+"' data-nicelabel='{\"position_class\": \"text_"+type_+"\", \"checked_text\": \""+option_label+"\", \"unchecked_text\": \""+option_label+"\"}' type='"+type_+"' name='"+field+"-"+j+"' group_field='"+field+"' />";
          j += 1;
        };
      }
      else if (type == "slider"){
        let min_ = options && typeof options === "object" && Object.keys(options).includes("min") ? options["min"] : 0 ;
        let max_ = options && typeof options === "object" && Object.keys(options).includes("max") ? options["max"] : 100 ;
        let value_ = options && typeof options === "object" && Object.keys(options).includes("value") ? options["value"] : "" ;
        let step_ = options && typeof options === "object" && Object.keys(options).includes("step") ? options["step"] : 10 ;
        console.log("slider-value_: ", field, value_);
        html += '<br><div class="range-slider">';
        // '+disabled+'" '+disabled+'
        html += '<input name="'+field+'" class="range-slider__range" type="range" value="'+value_+'" min="'+min_+'" max="'+max_+'" step="'+step_+'" data-updated="0">';
        html += '<span class="range-slider__value">'+value_+'</span>';
        html += '</div>';
      }
      
      console.log("html.length: ", html.length);
      if (html && html.length){
        html += '</div>';
      }
    
    }
    else if (type == "checklist"){
      console.log("----is checklist...", jq_selector, field, pre_type);
      let next_category = template_reg && Object.keys(template_reg).includes("category") ? template_reg["category"] : null;
      let is_new_category = next_category && next_category.length && next_category != category ? true : false;
      category = template_reg && Object.keys(template_reg).includes("category") ? template_reg["category"] : null;
      //html += '<input type="checkbox" class="checks">';
      //html += '<div class="row" style="text-align: left">'; //row start
      
      if (is_new_category){
        if (i!=0)
          html += '</tbody></table>';
        html += '<br><br><table class="table table-striped table-hover table-bordered" style="table-layout: fixed;border: none;">'
        html += '<tbody>';
        html += '<tr style="width: 100%;">';
        //html += '<td style="vertical-align: middle; width: 15%"></td>';
        html += '<td colspan="2" class="text_checkbox" style="padding: 15px;color: white; background-color: #a67eb9; border-radius: 10px;"><strong>'+category+'</strong></td>'; // colspan="2"
        html += '</tr></tbody></table>'
        
      }
      
      if (pre_type == null || is_new_category){
        console.log("open table...", i);
        html += '<table class="table table-striped table-hover table-bordered" style="table-layout: fixed;">'
        html += '<tbody>';
      }
      
      html += '<tr style="width: 100%;"><td style="vertical-align: middle; width: 15%; padding-left: 8px">';
      //html += '<div class="col-xs-4">';  //col start
      html += '<select class="niceselect" name="'+field+'">';
      html += '<option value="0" selected>No</option>';
      html += '<option value="1">Parcial</option>';
      html += '<option value="2">Sí</option>';
      html += '</select></td>';
      
      html += '<td style="vertical-align: middle; width: 85%; padding-left: 15px">'
      html += '<div class="row"><h6 padding-left: 5px>'+title+'</h6>';
      
      //if (category && category.length){
      //  html += '<span class="label label-theme m-l-3">'+category+'</span>';
      //}
      html += '</div><em>'+help_text+'</em>'
      html += '</td></tr>'
      
      console.log("if-type: ", jq_selector, type, pre_type, Object.entries(template_).length, i, i, Object.entries(template_).length == i)
      if (type != pre_type && pre_type != null || Object.entries(template_).length == i){
        console.log("close table...", i);
        html += '</tbody>'
        html += '</table>'
      }
    }
    
    i += 1
    console.log("append-to: ", jq_selector, $(jq_selector), html.length); //, html
    pre_type = type;
    
    //LOAD DATA
    let input_reg = data_ && Object.keys(data_).includes(field) ? data_[field] : null;
    console.log("input_reg: ", input_reg, field, data_);
    let value = input_reg && Object.keys(input_reg).includes(value_field) ? input_reg[value_field] : null;
    console.log("value: ", field, value_field, value, input_reg, input_reg && Object.keys(input_reg).includes(value_field));
    form_data[field] = type == "checklist" && !value ? 0 : value;
    console.log("form_data-it: ", form_data, value)
    
    //SUBMIT BUTTON
    $(document).ready(function() {
      //console.log("button_submit: ", button_submit, $(jq_selector), $(jq_selector).find(button_submit));
      if (button_submit && $(jq_selector).find(button_submit).length){
        $(jq_selector).find(button_submit).unbind();
        $(jq_selector).find(button_submit).on('click', function (event) {
          event.preventDefault();
          event.stopImmediatePropagation();
          console.log("CLICK: ", event);
          loadSpinWheel($(this));
          $(jq_selector).find(".range-slider__range[data-updated='0']").remove();
          //console.log("range_sliders-left: ", $(jq_selector).find(".range-slider__range[data-updated='0']"));
          $(jq_selector).submit();
          //data = getFormData($(jq_selector));
          //console.log("SUBMIT data: ", data);
        });
      }
    });
  }
  
  //APPEND HTML
  $(document).ready(function() {
    console.log("append - $(jq_selector): ", jq_selector, $(jq_selector), html.length);
    $(jq_selector).append(html)
    let form_ = jq_selector;
    console.log("form_data-rf: ", form_data);
    renderForm(form_, form_data);
    loadUXPlugins();
    handleScroll(jq_selector);
    //$(jq_selector).find('.nicelabel').nicelabel();
    if (callback && typeof callback === "function"){
      console.log("SET CALLBACK FUNCTION: ", jq_selector)
      callback(jq_selector);
    }
  });
}

function loadRangeSlider(jq_selector = null, class_selector = '.range-slider'){
  var rangeSlider = function(){
    var slider = jq_selector ? $(jq_selector).find(class_selector) : $(class_selector),
        range = jq_selector ? $(jq_selector).find(class_selector+'__range') : $(class_selector+'__range'),
        value = jq_selector ? $(jq_selector).find(class_selector+'__value') : $(class_selector+'__value');
    
    slider.each(function(){
      var $range_el = $(this).find(class_selector+'__range');
      var $value_el = $(this).find(class_selector+'__value');
      var value = $(this).find("input[type='range']").attr("value");
      console.log("$(this): ", $range_el, $range_el.attr("name"), $range_el.attr("value"), $value_el, $value_el.attr("class"), value)
      $($value_el).html(value);
      /*value.each(function(){
        var value = $(this).prev().attr('value');
        console.log("value-vse: ", value, $(this));
        $(this).html(value);
      });*/
      
      $range_el.on('input', function(event){
        console.log("range-change: ", event, $(this), $(this).val());//$(this).next(value), $(this).next(event.target), this.value);
        $(this).next(event.target).html(this.value);
        $(this).attr("data-updated", 1);
      });
      //var value = $(this).prev().attr('value');
      //$(this).html(value);
    });
  };
  rangeSlider();
}

function loadImportForm(form_selector, btn_export_class = ".btn_export", btn_import_class  = ".btn_import", fileName = null, type = 'application/json', export_title="Exportar Formulario", import_title="Importar Formulario"){
  
  //var element = '<a id="downloadAnchorElem" style="display:none"></a>'
  //$(btn_jq_selector).parent().append(element);
  
  $(btn_export_class).attr("class", $(btn_export_class).attr("class")+" fa fa-file-export");
  $(btn_export_class).attr("title", export_title);
  $(btn_export_class).click( function(event){
    console.log("CLICK-LIF!!...");
    event.preventDefault();
    event.stopImmediatePropagation();
    var data = getFormData(form_selector);
    
    if (!fileName)
      fileName = $(form_selector).attr("name") ? $(form_selector).attr("name") : $(form_selector).attr("id");
    fileName = fileName.includes(".json") ? fileName : fileName + ".json";
    
    // Create a blob of the data
    var fileToSave = new Blob([JSON.stringify(data)], {
        type: type
    });
    
    // Save the file
    saveAs(fileToSave, fileName); 
  });
  
  var element = '<input type="file" id="hiddenFileInput" style="display:none;" visibility="hidden">'
  $(btn_import_class).parent().append(element);
  $(btn_import_class).attr("title", import_title);
  var fileInput = document.getElementById('hiddenFileInput');
  
  // Add an event listener to the file input element
  fileInput.addEventListener('change', function(event) {
    console.log("file selected...", event)
    enableButton(btn_import_class);
    // Get the selected file
    var file = event.target.files[0];
    console.log("file: ", file, typeof file);
    
    // Create a new FileReader object
    var reader = new FileReader();
    
    // Define the function to be called when the FileReader has finished loading the file
    reader.onload = function() {
      // Get the JSON data as a string
      var jsonStr = reader.result;
      console.log("file loaded...", typeof jsonStr)
      
      // Convert the JSON string to a JavaScript object
      var jsonObj = JSON.parse(jsonStr);
      
      // Do something with the JavaScript object
      console.log("rendered jsonObj: ", jsonObj, typeof jsonObj);
      renderForm(form_selector, jsonObj);
    };
    
    // Read the contents of the selected file as text
    reader.readAsText(file);
  });
  
  $(btn_import_class).attr("class", $(btn_import_class).attr("class")+" fa fa-file-import")
  $(btn_import_class).click( function(event){
    console.log("CLICK-LIF!!...");
    event.preventDefault();
    event.stopImmediatePropagation();
    $("#hiddenFileInput").click();
    disableButton(btn_import_class);
  })
}

function getUserData(callback = null, vue_var = null){
  fetch('https://api.ipregistry.co/?key=tryout') //https://api.ipregistry.co/?key=tryout
    .then(function (response) {
        return response.json();
    })
    .then(function (payload) {
        console.log("payload: ", payload);
        set_or_callback(payload, callback, vue_var);
  }); 
}

function getUserIP(callback = null, vue_var = null){
  fetch('https://api.ipify.org?format=json')
    .then(function (response) {
        return response.json();
    })
    .then(function (payload) {
        console.log("payload: ", payload);
        set_or_callback(payload, callback, vue_var);
  }); 
}

//https://opencagedata.com/dashboard#geocoding
function getUserLocation(callback = null, vue_var = null){
  navigator.geolocation.getCurrentPosition(position => {
    const {latitude, longitude} = position.coords;
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=4c5380da29d14105945b360bdea7f5ba`)
      .then(response => response.json())
      .then(function(payload){
        console.log("payload: ", payload.results[0].components.country)
        set_or_callback(payload, callback, vue_var);
      });
  });
}

function set_or_callback(payload, callback = null, vue_var = null){
  console.log("payload: ", payload)
  if (payload){
    if (callback && typeof callback === "function"){
      callback(payload);
    }
    else if (vue_var){
      let vue_var_name = typeof vue_var === "string" ? vue_var : null;
      console.log("vue_var-name: ", vue_var_name);
      if (vue_var_name){
        console.log("vue_var pre add: ", vue_var, app_vue[vue_var_name]);
        vue_var = app_vue[vue_var_name]; 
        //app_vue[vue_var_name].push(row);
      }
      console.log("set: ", payload, vue_var_name, vue_var)
      vue_var = payload;
      app_vue.$forceUpdate(); // call update method
    }
    else
      console.log("else-no...");
  }
}

function generateHarveyBall(value, container = '#harvey-balls-container') {
  var harveyBall = $('<div class="harvey-ball"></div>');
  var fill = $('<div class="fill"></div>');
  var empty = $('<div class="empty"></div>');
  
  fill.css('width', value + '%');
  empty.css('width', (100 - value) + '%');
  
  harveyBall.append(fill, empty);
  
  console.log("harveyBall: ", harveyBall, document.styleSheets, document.styleSheets.length);
  // Append the Harvey Balls to the container
  if (container)
    $(container).append(harveyBall);
  
  // get a reference to the document's style sheet
  var styleSheet = document.styleSheets[0];
    
  // create a new CSS rule
  var rule = `
  .harvey-ball {
    width: 100px;
    height: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .fill {
    height: 100%;
    background-color: #5cb85c;
    float: left;
  }
  
  .empty {
    height: 100%;
    background-color: #eee;
    float: left;
  }
  `;
  
  // add the rule to the style sheet
  console.log("rule: ", rule, styleSheet.cssRules.length)
  styleSheet.insertRule(rule, styleSheet.cssRules.length);
  
  
  return harveyBall;
}

function loadModalRichText(jq_selector, name, title = ""){
  console.log("***loadModalRichText: ", $(jq_selector), $(jq_selector).find('#openModalBtn'));
  //if (!$(jq_selector).length)
  //  jq_selector = $(jq_selector).parent();
  //console.log("-jq_selector: ", $(jq_selector), $(jq_selector).find('#openModalBtn'));
  title = (!title || !title.length) && typeof name === "string" ? camelizeSnakeCase(name.replace(/#/g, "").replace(/\./g, "").replace(/-/g, "_"), true) : title;
  
  //SET MODAL
  let content_selector = '<div id="richTextEditor_'+name+'" name="'+name+'" class="summernote" ></textarea>';
  //content_selector += '</div>';
  //$('body').append($(content_selector));
  //content_selector = "#"+$(content_selector).attr("id");
  console.log("lr-content_selector: ", content_selector);
  let modal_id = "#modal-"+name;
  function editRichText(event, data){
    console.log("***editRichText: ", event, data);
    toggleModal(null, modal_id, $modal); //, on_open_callback
  }
  createModal(modal_id, title, content_selector, null, "Editar", editRichText); //, null, true
  
  /*function widthResize() {
    // Event code to execute when Summernote finishes loading
    console.log('Summernote loaded!');
    // Get the parent element
    var $parent = $(modal_id).find(".modal-body");
    let css_ = $parent.find(".note-toolbar").attr("style");
    console.log("css_: ", $parent, $parent.find(".note-toolbar"), css_);
    //if (css_)
    //  $parent.find(".note-toolbar.panel-heading").css()
    
    // Initialize the maximum width as 0
    var maxWidth = 0;
    // Iterate over each child element
    console.log("$parent.children(): ", $parent, $parent.find('*'));
    // Find all child elements with non-zero width
    $parent.find('*').each(function() {
      var childWidth = $(this).outerWidth();
      // Only consider elements with non-zero width
      if (childWidth > 0) {
        // Update the maximum width if necessary
        if (childWidth > maxWidth) {
          maxWidth = childWidth;
        }
      }
    });
    console.log("maxWidth: ", maxWidth);
    // Set the parent element's width to the maximum width
    if (maxWidth > $parent.outerWidth())
      $parent.css('width', maxWidth + 'px');
  }*/

  let options = {
    dialogsInBody: true,
    //width: 200,
    //disableResizeEditor: true,
    //airMode: true,
  }; /*{
    // Other Summernote options...
    callbacks: {
      onInit: function(){} //widthResize()
    }
  }*/
  let summernote_selector = $(modal_id).find(".summernote"); //$(".summernote"); //
  loadSummernote(summernote_selector, null, options);
  
  //AUTO-ADJUST SUMMERNOTE 
  /*$(document).on("show.bs.modal", '.modal', function (event) {
    console.log("Global show.bs.modal fire");
    var zIndex = 100000 + (10 * $(".modal:visible").length);
    $(this).css("z-index", zIndex);
    setTimeout(function () {
        $(".modal-backdrop").not(".modal-stack").first().css("z-index", zIndex - 1).addClass("modal-stack");
    }, 0);
  }).on("hidden.bs.modal", '.modal', function (event) {
      console.log("Global hidden.bs.modal fire");
      $(".modal:visible").length && $("body").addClass("modal-open");
  });
  $(document).on('inserted.bs.tooltip', function (event) {
      console.log("Global show.bs.tooltip fire");
      var zIndex = 100000 + (10 * $(".modal:visible").length);
      var tooltipId = $(event.target).attr("aria-describedby");
      $("#" + tooltipId).css("z-index", zIndex);
  });
  $(document).on('inserted.bs.popover', function (event) {
      console.log("Global inserted.bs.popover fire");
      var zIndex = 100000 + (10 * $(".modal:visible").length);
      var popoverId = $(event.target).attr("aria-describedby");
      $("#" + popoverId).css("z-index", zIndex);
  });*/
  
  //SET LOAD OPEN BTN
  $(jq_selector).each(function(index, element){
    
    let id = $(element).attr("data-id") ? $(element).attr("data-id") : $(element).attr("data-index");
    if (id) 
      element_id = name+"-"+id.toString();
    else
      element_id = $(element).attr("id");
    console.log("mrt-element_id: ", element_id, element);
    
    if (element_id){
      
      let content_selector = $(element).next();
      console.log("mrt-content_selector: ", content_selector, element_id);
      
      if (!content_selector.hasClass("modal")){
        content_selector = '<textarea id="richTextEditor_'+element_id+'" name="'+name+'" style="display:none;" data-id="id" ></textarea>';
        $(element).after($(content_selector));
        console.log("lr-content_selector: ", content_selector);
      }
      
      // Add custom CSS dynamically
      /*var customCss = '.modal.fade .note-editor .note-toolbar {position: absolute;top: 0;z-index: 9999;}';
      var styleElement = document.createElement('style');
      styleElement.innerHTML = customCss;
      document.head.appendChild(styleElement);
      */
      
    }
    else
      console.warn("Warning: No element_id for modal rich text...");
    
    
    // OPEN-MODAL: when the button is clicked
    $(element).click(function(event) { //.find('#openModalBtn')
      let $modal = $(event.target).next();
      //$modal.css('display', 'block');
      console.log("element-OPEN-MRT CLICKED !!!!!");
      // Make the Summernote element visible
      //$('.summernote').show();
      toggleModal(id, modal_id, $modal); //, on_open_callback
    });
  });
  
  /*
  // Close modal when the close button or outside the modal is clicked
  $(jq_selector).next().find('.close, .modal').click(function(event) {
    let $modal = $(event.target).parent();
    $modal.css('display', 'none');
  });
  
  // Prevent modal from closing when clicking inside the modal content
  $(jq_selector).next().find('.modal-content').click(function(event) {
    event.stopPropagation();
  });*/
}



function loadSummernote(jq_selector=".summernote", placeholder = "", options = {}){
  console.log("***loaSummernote: ", jq_selector, $(jq_selector), Object.keys(options).length);
  
  $(document).ready(function() {
    console.log("Object.keys(options): ", Object.keys(options).length);
    default_options = {
      placeholder: placeholder,
      //tabsize: 2,
      height: 300,
      fontSizes: ['8', '9', '10', '11', '12', '14', '15','16','17','18','21','24','28','31', '40', '50'], 
      toolbar: [
          ['fontsize', ['fontsize']],
          ['style', ['style']],
          ['font', ['bold', 'italic', 'underline', 'clear']],
          ['fontname', ['fontname']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'hr']],
          ['view', ['fullscreen', 'codeview']],
          ['help', ['help']]
      ],
      callbacks: {
        onInit: function() {
          console.log("summernote-init...");
          $('.note-toolbar').css('flex-wrap', 'wrap');
          //$('.note-toolbar.panel-heading').css('flex-wrap', 'wrap');
          $('.note-editable').css('flex-wrap', 'wrap');
          $('.note-editor').css('flex-wrap', 'wrap');
          $('.note-editing-area').css('flex-wrap', 'wrap');
          // Get the height of the source element
          var sourceHeight = $(jq_selector).next().find(".note-toolbar.panel-heading").outerHeight();
          // Convert the height value to the desired unit if needed
          sourceHeight = 80;
          var paddingTopValue = sourceHeight + 'px';
          console.log("sourceHeight: ", jq_selector, $(jq_selector).next(), $(jq_selector).next().find(".note-toolbar.panel-heading"), sourceHeight, paddingTopValue, $(jq_selector).next().find('.note-editable'));
          // Set the height as the padding-top of the target element
          $(jq_selector).next().find('.note-editing-area').css('padding-top', paddingTopValue);
        }
      }
    }
    
    if (options == false){
      //setTimeout(function() {
        $(jq_selector).summernote();
      //}, 500); // Delay of 500 milliseconds (adjust as needed)
    }
    else{
      if (options != false && (typeof options === "object" && Object.keys(options).length != 0))
        options = { ...default_options, ...options };
      $(jq_selector).summernote(options);
    }
      
    
    /*$(jq_selector).css({
      'position': 'absolute',
      'top': '0',
      'left': '0'
    });*/
    console.log("Summernote-loaded: ", jq_selector, $(jq_selector));
  });
}

function createPasteButton(id, copy_from_element = null, style=null, title=null, tooltip=null){
  style = !style ? "" : style;
  style = style && style.toString().startsWith("style") ? style : 'style="'+style+'"';
  var button = $('<button id="'+id+'" class="btn-white" '+style+' data-toogle="Copia utilizando este botón. Copia contenido hacia el portapapeles." title="Copia utilizando este botón. Copia contenido hacia el portapapeles." data-clipboard-target="#clipboard-default"><i class="fa fa-clipboard"></i></button>');
  
  //controls_clipboard = controls_clipboard.toString().startsWith("#") ? controls_clipboard : "#"+controls_clipboard;
  if (copy_from_element)
    $(button).on('click', function(event) {
      event.preventDefault();
      // Get the table data as a formatted string
      copyToClipboard(copy_from_element);
    });
  return button;
}

function copyDataTable2Clipboard(dataTable, jq_selector = null){
  // Initialize the DataTable
  /*var dataTable = $(jq_selector).DataTable({
    // DataTable configuration options
  });*/
  
  var tableData = dataTable
    .data()
    .toArray()
    .map(row => row.join('\t')) // Use tab (\t) as column delimiter
    .join('\n'); // Use new line (\n) as row delimiter
  console.log("tableData: ", tableData)
  // Copy the table data to the clipboard
  copyToClipboard(tableData);
};


function createCircleElement(jq_selector, number, size = 40, attrs = {}) {
  const element = document.createElement('div');

  // Apply default attributes
  let factor = 0.6;
  size = size * factor
  element.style.borderRadius = '50%';
  element.style.width = size + 'px';
  element.style.height = size + 'px';
  element.style.backgroundColor = '#ccc';
  element.style.display = 'flex';
  element.style.justifyContent = 'center';
  element.style.alignItems = 'center';

  // Apply custom attributes
  for (const attr in attrs) {
    element.setAttribute(attr, attrs[attr]);
  }

  // Create number element
  const numberElement = document.createElement('span');
  numberElement.textContent = number;
  numberElement.style.fontSize = (16*factor).toString()+'px';
  numberElement.style.fontWeight = 'bold';

  // Append number element to circle element
  element.appendChild(numberElement);

  // Insert circle element before the jq_selector element
  //console.log("jq_selector: ", jq_selector, typeof jq_selector, document.querySelector(jq_selector));
  //const parentElement = document.querySelector(jq_selector).parentNode;
  //parentElement.insertBefore(element, document.querySelector(jq_selector));

  return element;
}

function createCircleElements(jq_selector, size = 1, attrs = {}, excludedIds = []) {
  const defaultSize = 40; // Default size in pixels
  
  const elements = document.querySelectorAll(jq_selector);
  console.log("elements: ", $(elements));
  elements.forEach((element, index) => {
    // Check if element ID is excluded
    const elementId = element.getAttribute('id');
    if (excludedIds.includes(elementId)) {
      return;
    }
    
    // Calculate the actual size based on the percentage
    const actualSize = size * defaultSize;
    
    // Create circle element
    const number = index + 1;
    const circleElement = createCircleElement(element, number, actualSize, attrs);
    
    // Insert circle element before the current element
    const parentElement = element.parentNode;
    
    //parentElement.insertBefore(circleElement, element);
    // Insert circle element based on element type
    if (typeof jq_selector === 'string' && (element.tagName === 'LI' || element.tagName === 'A')) {
      if (element.firstChild) {
        element.insertBefore(circleElement, element.firstChild);
      } else {
        element.appendChild(circleElement);
      }
    } else if (jq_selector instanceof jQuery && element && element.parentNode) {
      const parentElement = element.parentNode;
      parentElement.insertBefore(circleElement, element);
    }
  });

  return elements;
}


function rateCirclesTesting(){
  $(document).ready(function() {
    for (var k = 0; k < 110; k++) {
      let _id = "rate-circle-"+k.toString();
      let el = createHTMLElement("div", {"data-value": k, "id": _id, "class": "rate-circle", "text": k})
      console.log("rc: ", k, el, _id);
      $("#harvey-balls-container").append(el);
    }
    $(".rate-circle").modifiedRateCircle({
      size: 40,
      lineWidth: 3,
      fontSize: 10,
      colorThresholds: [
        { min: 0, max: 0.39, color: '#f28d4f' },
        { min: 0.40, max: 0.59, color: '#eedf14' },
        { min: 0.60, max: 0.79, color: '#F3B700' },
        { min: 0.80, max: 1, color: '#00FF00' }
      ]
    });
  });
}