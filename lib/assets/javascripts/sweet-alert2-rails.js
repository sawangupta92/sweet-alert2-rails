var sweetAlertConfirmConfig = sweetAlertConfirmConfig || {}; // Add default config object

(function($) {
  var sweetAlertConfirm = function(event) {

    swalDefaultOptions = {
      title: sweetAlertConfirmConfig.title || 'Are you sure?',
      type: sweetAlertConfirmConfig.type || 'warning',
      showCancelButton: sweetAlertConfirmConfig.showCancelButton || true,
      confirmButtonText: sweetAlertConfirmConfig.confirmButtonText || "Ok",
      cancelButtonText: sweetAlertConfirmConfig.cancelButtonText || "Cancel"
    }
    if (sweetAlertConfirmConfig.confirmButtonColor !== null) {
      swalDefaultOptions.confirmButtonColor = sweetAlertConfirmConfig.confirmButtonColor
    }

    $linkToVerify = $(this);
    var swalOptions = swalDefaultOptions;
    var optionKeys = [
                        'text',
                        'showCancelButton',
                        'confirmButtonColor',
                        'cancelButtonColor',
                        'confirmButtonText',
                        'cancelButtonText',
                        'html',
                        'imageUrl',
                        'allowOutsideClick',
                        'customClass'
                      ];

    function sweetAlertConfirmedCallback() {
      if ($linkToVerify.data().remote === true) {
        Rails.handleRemote.call($linkToVerify[0], event)
      }
      else if($linkToVerify.data().method !== undefined) {
        Rails.handleMethod.call($linkToVerify[0], event);
      }
      else {
        if($linkToVerify.attr('type') == 'submit') {
          var name = $linkToVerify.attr('name'),
          data = name ? {name: name, value: $linkToVerify.val()} : null;
          $linkToVerify.closest('form').data('ujs:submit-button', data);
          $linkToVerify.closest('form').submit();
        }
        else {
          $linkToVerify.data('swal-confirmed', true).click();
        }
      }
    }

    if ($linkToVerify.data('swal-confirmed')) {
      $linkToVerify.data('swal-confirmed', false);
      return true;
    }

    $.each($linkToVerify.data(), function(key, val) {
      if ($.inArray(key, optionKeys) >= 0) {
        swalOptions[key] = val;
      }
    });

    if ($linkToVerify.attr('data-sweet-alert-type')) {
      swalOptions['type'] = $linkToVerify.attr('data-sweet-alert-type');
    }

    htmlOption = $('<div>')

    if ($linkToVerify.attr('data-heading')) {
      htmlOption.append($('<span>').attr({'data-heading': $linkToVerify.attr('data-heading')}).addClass('alert-header'));
    }

    htmlOption.append($('<span>').html($linkToVerify.attr('data-description')));

    swalOptions['html'] = htmlOption

    message = $linkToVerify.attr('data-sweet-alert-confirm')
    swalOptions['title'] = message
    $.extend(swalOptions, sweetAlertConfirmConfig)
    swal(swalOptions).then(sweetAlertConfirmedCallback, function(dismiss) { return true; });

    return false;
  }

  $(document).on('dynatable:init dynatable:afterUpdate turbolinks:load page:update ajaxComplete ajax:success ajaxSuccess ajax:error ajaxError pubnub:received', function () {
    $('[data-sweet-alert-confirm]').on('click', sweetAlertConfirm)
  });

  $(document).on('dynatable:init dynatable:afterUpdate turbolinks:load page:load pubnub:received', function () {
    //To avoid "Uncaught TypeError: Cannot read property 'querySelector' of null" on turbolinks
    if (typeof window.sweetAlertInitialize === 'function') {
      window.sweetAlertInitialize();
    }
  });

  // Add support jQuery 3
  $(function () {
    $('[data-sweet-alert-confirm]').on('click', sweetAlertConfirm);

    if (typeof window.sweetAlertInitialize === 'function') {
      window.sweetAlertInitialize();
    }
  })

})(jQuery);
