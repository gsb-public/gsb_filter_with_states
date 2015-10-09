(function ($) {

  Drupal.behaviors.gsb_filter_with_states = {
    attach: function (context, settings) {

      if ($('.views-exposed-widgets input:checkbox').length > 0) {
        //all-research special case
        //views-exposed-form-gsb-all-research-listing-all-research-panel-pane
        var search_text = ($("#edit-field-search-field-value").length > 0) ? $("#edit-field-search-field-value").val() : $("#edit-search").val();
        if (search_text == 'undefined' ){
          search_text = "";
        }
        var $checkboxes = $('input:checkbox');
        var $checked_count = $checkboxes.filter(':checked').length;
        if (search_text != "" || $checked_count > 0) {
          //get the current form id
          var current_form ="";
          if (search_text != "") {
            var $search_id = ($('#edit-field-search-field-value').length > 0) ? $('#edit-field-search-field-value') : $('#edit-search');
            current_form = $search_id.closest('form').attr('id');
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
              $("#" + current_form + ' .results-wrapper').append('<span class="term-searched"><span class="term">' + search_text + '</span><a class="filter-exit">Clear</a></span>');
            }
            if ($checked_count > 0) {
              if (search_text != "") {
                $("#" + current_form + ' .results-wrapper').append('<span class="results-text">and</span>');
              }
              $("#" + current_form + ' .results-wrapper').append('<div class="filters-wrapper">')
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
            if ((search_text != "" && $checked_count > 0) || ( $checked_count > 1)) {
              $("#" + current_form + ' .filter-results-wrapper').append('<div class="form-actions form-wrapper" id="edit-actions"><input type="reset" id="edit-reset" name="op" value="Clear All" class="form-reset"></div>');
            }
            $("#" + current_form + ' .views-exposed-form').append('</div>');
          }
        }
        var q = ($(location).attr('href')).split('?');
        history.pushState(null, null,q[0].toString());

        //clearing the form when clear all is pressed or any of the close marks are checked
        $('.filter-exit').click(function (event) {
          if ($(this).parent().attr("class") == "term-searched") {
            $("#" + current_form + ' .filter-results-wrapper').remove();
            ($("#" + current_form + ' #edit-field-search-field-value').length > 0) ? $("#" + current_form + ' #edit-field-search-field-value').val("") : $("#" + current_form + ' #edit-search').val("");
            $("#" + current_form + ' .views-submit-button input').click();
          }
          else {
            $curr = $(this).parent().text();
            $curr_text =$curr.split('|');
            event.preventDefault();
            var result = $curr_text[0];
            $("#" + result).prop('checked', false);
            $("#" + result).change();
          }
        });
        $("#" + current_form + ' .form-reset').click(function (event) {
          ($("#" + current_form + ' #edit-field-search-field-value').length > 0) ? $("#" + current_form + ' #edit-field-search-field-value').val("") : $("#" + current_form + ' #edit-search').val("");
          $("#" + current_form + ' input:checkbox').removeAttr('checked');
          $("#" + current_form + ' input:checkbox:first').change();
        });
      }
    }
  }
})(jQuery);



