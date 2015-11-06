(function ($) {

  Drupal.behaviors.gsb_filter_with_states = {
    attach: function (context, settings) {

      var start_date = "";
      var end_date = "";
      var date_range = "";

      if ($("#edit-date-search-value-datepicker-popup-0").length > 0 ) {
        $("#edit-date-search-value-datepicker-popup-0").datepicker({
          changeMonth: true,
          changeYear: true,
          minDate: new Date(),
          maxDate: "+3y",
          dateFormat: "M dd yy"
        });
        $("#edit-field-event-date-value-value-datepicker-popup-0").datepicker({
          changeMonth: true,
          changeYear: true,
          minDate: new Date(),
          maxDate: "+3y",
          dateFormat: "M dd yy"
        });

        if ($("#edit-date-search-value-datepicker-popup-0").length > 0) {
          start_date = $("#edit-date-search-value-datepicker-popup-0").val();
        }
        if ($("#edit-field-event-date-value-value-datepicker-popup-0").length > 0) {
          end_date = $("#edit-field-event-date-value-value-datepicker-popup-0").val();
        }
        if (start_date != "" || end_date != "") {
          date_selected = true;
        }
        if (start_date != "" && end_date != "") {
          date_range = start_date + " - " + end_date;
        } else if (start_date != "") {
          date_range = start_date;
        } else if (end_date != "") {
          date_range = end_date;
        }
      }
      var search_text = ($("#edit-field-search-field-value").length > 0) ? $("#edit-field-search-field-value").val() : $("#edit-search").val();
      $checked = $('.views-exposed-widgets :input[type="checkbox"]:checked').length;
      if ($checked == 0 && start_date.length == 0 && end_date.length == 0) {
        $('#edit-clear-all').hide();
        $('#edit-done').attr("disabled", "disabled");
      }
      if ($checked > 0 || start_date.length != 0  || end_date.length != 0)
      {
        $('#edit-clear-all').show();
        $('#edit-done').removeAttr("disabled");
      }
      if ($("#edit-date-search-value-datepicker-popup-0").length > 0 ){
        $("#edit-date-search-value-datepicker-popup-0").change(function (event) {
          if ($("#edit-date-search-value-datepicker-popup-0").val() != "") {
            $('#edit-done').removeAttr("disabled");
          } else {
            $('#edit-clear-all').hide();
            $('#edit-done').removeAttr("disabled");
          }
        });
      }
      if ($("#edit-field-event-date-value-value-datepicker-popup-0").length > 0 ){
        $("#edit-field-event-date-value-value-datepicker-popup-0").change(function (event) {
          if ($("#edit-field-event-date-value-value-datepicker-popup-0").val() != "") {
            $('#edit-done').removeAttr("disabled");
          } else {
            $('#edit-clear-all').hide();
            $('#edit-done').removeAttr("disabled");
          }
        });
      }
      $('.views-exposed-widgets input:checkbox').click(function (e) {
        //var chkd = $('input:checkbox').filter(':checked').length;
        $checked = $('input:checkbox').filter(':checked').length;
        if ($checked > 0) {
          $('#edit-done').removeAttr("disabled");
        } else {
          $('#edit-clear-all').hide();
          $('#edit-done').removeAttr("disabled");
        }
      });

      //Clear all the checked checkboxes only
      $('#edit-clear-all').click(function (event) {
        $(' input:checkbox').removeAttr('checked');
        $("#edit-date-search-value-datepicker-popup-0").val("");
        $("#edit-field-event-date-value-value-datepicker-popup-0").val("");
        $("#" + current_form + ' .views-submit-button input').click();
      });

      var q = ($(location).attr('href')).split('?');
      history.pushState(null, null,q[0].toString());

      //Start adding states
      if ($('.views-exposed-widgets input:checkbox').length > 0) {
        //all-research special case
        //views-exposed-form-gsb-all-research-listing-all-research-panel-pane
        if (typeof(search_text) === 'undefined' ){
          search_text = "";
        }
        var $checkboxes = $('input:checkbox');
        var $checked_count = $checkboxes.filter(':checked').length;
        if (search_text != "" || $checked_count > 0 || date_range != "") {
          //get the current form id
          var current_form ="";
          if (search_text != "") {
            var $search_id = ($('#edit-field-search-field-value').length > 0) ? $('#edit-field-search-field-value') : $('#edit-search');
            current_form = $search_id.closest('form').attr('id');
          }
          else if (date_range != ""){
            current_form = $("#edit-date-search-value-datepicker-popup-0").closest('form').attr('id');
          }
          else {
            current_form = $checkboxes.filter(':checked').first().closest('form').attr('id');
          }
          $("#" + current_form + ' .views-exposed-form').append('<div class="filter-results-wrapper">');
          if ($(".filter-results-wrapper").length == 1) {
            $("#" + current_form + ' .filter-results-wrapper').append('<div class="results-wrapper"><div class="results-text">Results for</div>');
            if (search_text != "") {
              if(search_text.length > 19){
                search_text = search_text.substring(0,19) + '...';
              }
              $("#" + current_form + ' .results-wrapper').append('<div class="filters-wrapper">');
              $("#" + current_form + ' .results-wrapper').append('<span class="filter-button"><span class="term-searched"><span class="term">' + search_text + '</span><a class="filter-exit">Clear</a></span></span>');

            }
            if ( date_range != "" ) {
              if ($(".filters-wrapper").length == 0){
                $("#" + current_form + ' .results-wrapper').append('<div class="filters-wrapper">');
              }
              $("#" + current_form + ' .results-wrapper').append('<span class="filter-button"><span class="date-searched"><span class="term">' + (date_range.substring(0,19) + '...') + '</span><a class="filter-exit">Clear</a></span></span>');
            }
            if ($checked_count > 0) {
              $checkboxes.each(function () {
                if (this.checked) {
                  var sThisVal = (this.checked ? $(this).attr("id") : "");
                  var checked_label = $('label[for=' + sThisVal + ']').text();
                  if (checked_label.length > 19){
                    checked_label = checked_label.substring(0,19) + '...';
                  }
                  $("#" + current_form + ' .results-wrapper').append('<span class="filter-button"><span class="term"><span style="display:none">' + sThisVal +'|</span>' + checked_label + '</span><a class="filter-exit">Clear</a></span>');
                }
              });
              $("#" + current_form + ' .results-wrapper').append('</div>');
            }

            $("#" + current_form + ' .filter-results-wrapper').append('</div>');
            if ((search_text != "" && $checked_count > 0) || ( $checked_count > 1 || (search_text != "" && date_range != "") || (date_range != "" && $checked_count > 0))) {
              $("#" + current_form + ' .filter-results-wrapper').append('<div class="form-actions form-wrapper" id="edit-actions"><input type="reset" id="edit-reset" name="op" value="Clear All" class="form-reset"></div>');
            }
            $("#" + current_form + ' .views-exposed-form').append('</div>');
          }
        }
        //clearing the form when clear all is pressed or any of the close marks are checked
        $('.filter-exit').click(function (event) {
          if ($(this).parent().attr("class") == "term-searched") {
            $("#" + current_form + ' .filter-results-wrapper').remove();
            ($("#" + current_form + ' #edit-field-search-field-value').length > 0) ? $("#" + current_form + ' #edit-field-search-field-value').val("") : $("#" + current_form + ' #edit-search').val("");
            $("#" + current_form + ' .views-submit-button input').click();
          }
          else if ($(this).parent().attr("class") == "date-searched") {
            $("#edit-date-search-value-datepicker-popup-0").val("");
            $("#edit-field-event-date-value-value-datepicker-popup-0").val("");
            $('#edit-done').click();
          }
          else {
            $curr = $(this).parent().text();
            $curr_text =$curr.split('|');
            var result = $curr_text[0];
            $("#" + result).prop('checked', false);
            $('#edit-done').click();
          }
        });
        $("#" + current_form + ' .form-reset').click(function (event) {
          ($("#" + current_form + ' #edit-field-search-field-value').length > 0) ? $("#" + current_form + ' #edit-field-search-field-value').val("") : $("#" + current_form + ' #edit-search').val("");
          $("#" + current_form + ' input:checkbox').removeAttr('checked');
          if ($("#edit-date-search-value-datepicker-popup-0").length > 0 ){
            $("#edit-date-search-value-datepicker-popup-0").val("");
            $("#edit-field-event-date-value-value-datepicker-popup-0").val("");
          }
          $(location).attr('href', q[0]);
        });
      }
    }
  }
})(jQuery);



