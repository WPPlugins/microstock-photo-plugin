// Generated by CoffeeScript 1.6.3
jQuery(document).ready(function($) {
  var $back_button, $button_license_accept, $button_license_reject, $detail, $images, $nb_images, $paging, $search_button, $search_filter, $search_input, $search_input_copy, $search_sort, $search_sync, $ui_detail, $ui_search, bindImages, bindLicenseTable, bindPaging, buyImage, currentStatus, getPopularImages, isUserLogged, mpp_checkStatus, mpp_syncSearch, mpp_syncSearch1, pd, scroll_position, search;
  pd = parent.document;
  scroll_position = 0;
  $search_input = $('input[name=mpp_search_input]');
  $search_input_copy = $('input[name=mpp_search_input_copy]');
  $search_button = $('input[name=mpp_search_button]');
  $search_sync = $('input[name=mpp_search_sync]');
  $search_filter = $('.mpp_search_filter_checkbox');
  $search_sort = $('select[name=mpp_sort]');
  $back_button = $('input[name=mpp_button_back]');
  $ui_search = $('.mpp_ui_search');
  $ui_detail = $('.mpp_ui_detail');
  $images = $('.mpp_images');
  $paging = $('.mpp_paging');
  $detail = $('.mpp_detail');
  $nb_images = $('.mpp_nb_images');
  $button_license_accept = $('input[name=mpp_license_accept]');
  $button_license_reject = $('input[name=mpp_license_reject]');
  currentStatus = false;
  isUserLogged = false;
  mpp_syncSearch1 = function() {
    var filter, syncSearch, _i, _len, _ref, _results;
    syncSearch = parent.window.mpp_syncSearch;
    if (syncSearch.sync) {
      $search_sync.attr('checked', true);
      if (syncSearch.search !== $search_input.val()) {
        $search_input.val(syncSearch.search);
        $search_input_copy.val(syncSearch.search);
        search(syncSearch.search);
        if (syncSearch.filters != null) {
          $search_filter.attr('checked', false);
          _ref = syncSearch.filters;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            filter = _ref[_i];
            _results.push($('#' + filter).attr('checked', true));
          }
          return _results;
        }
      }
    } else {
      return $search_sync.attr('checked', false);
    }
  };
  mpp_checkStatus = function(refresh) {
    var _ref;
    if (refresh == null) {
      refresh = false;
    }
    if (refresh || !currentStatus) {
      return $.post(MicrostockPhotoPlugin.ajax_url, {
        a: 'getUserData',
        module: MicrostockPhotoPlugin.module
      }, function(r) {
        var _ref;
        if (r.status === 1 && r.data) {
          isUserLogged = r.isLogged ? true : false;
          currentStatus = r.data;
        } else {
          isUserLogged = false;
          currentStatus = false;
        }
        if (parent.mpp_currentState === 'mpp-' + MicrostockPhotoPlugin.module) {
          if ((_ref = $(pd).find('#mpp_status')) != null) {
            _ref.remove();
          }
          if (r.status === 1 && r.data) {
            $(pd).find('.media-frame-title').append(r.data);
          }
        }
        return mpp_syncSearch1();
      });
    } else {
      if ((_ref = $(pd).find('#mpp_status')) != null) {
        _ref.remove();
      }
      $(pd).find('.media-frame-title').append(currentStatus);
      return mpp_syncSearch1();
    }
  };
  window.mpp_checkStatus = mpp_checkStatus;
  mpp_syncSearch = function() {
    var filter, filters, _i, _len;
    filters = new Array();
    for (_i = 0, _len = $search_filter.length; _i < _len; _i++) {
      filter = $search_filter[_i];
      filter = $(filter);
      if (filter.attr('checked')) {
        filters.push(filter.attr('id'));
      }
    }
    return {
      sync: $search_sync.is(':checked'),
      search: $search_input.val(),
      filters: filters
    };
  };
  window.mpp_syncSearch = mpp_syncSearch;
  bindPaging = function() {
    return $('.mpp_page').bind('click', function() {
      return search($search_input.val(), $(this).attr('href'));
    });
  };
  buyImage = function(license_agreed) {
    $('.mpp_detail_error_message').text('');
    return $.post(MicrostockPhotoPlugin.ajax_url, {
      a: 'buy',
      module: MicrostockPhotoPlugin.module,
      id: $('input[name=mpp_buy_id]').val(),
      license: $('input[name=mpp_license]:checked').val(),
      post_id: parent.wp.media.view.settings.post.id,
      title: $('input[name=mpp_buy_title]').val(),
      search: $search_input_copy.val(),
      license_type: $('input[name=mpp_license_type]').val(),
      license_agreed: license_agreed,
      author: $('input[name=mpp_buy_author]').val(),
      image_page: $('input[name=mpp_image_page]').val()
    }, function(r) {
      if (r.status === 1 && (r.id != null)) {
        window.mpp_checkStatus(true);
        return parent.mpp_selectImage(r.id, (r.aff_link != null) && r.aff_link ? r.aff_link : false);
      } else if (r.status === 3) {
        $('.mpp_license_text').html(r.license_text);
        return tb_show(MicrostockPhotoPlugin.text.license_agreement, '#TB_inline?width=500&modal=true&height=400&inlineId=mpp_license_dialog', false);
      } else if (r.status === 2) {
        $('input[name=mpp_license]').attr('disabled', false);
        $('input[name=mpp_buy]').attr('disabled', false).removeClass('button-primary').addClass('button-secondary').val(MicrostockPhotoPlugin.text.buy);
        if (r.message) {
          return $('.mpp_detail_error_message').html(r.message);
        } else {
          return $('.mpp_detail_error_message').text(MicrostockPhotoPlugin.text.error_purchase);
        }
      }
    });
  };
  bindLicenseTable = function() {
    if (!isUserLogged) {
      $('input[name=mpp_license]').attr('disabled', true);
      $('input[name=mpp_buy]').attr('disabled', false).attr('data-link', MicrostockPhotoPlugin.options_url).val(MicrostockPhotoPlugin.text.please_login);
      if (MicrostockPhotoPlugin.module_register_link) {
        $('a.mpp_register').show().attr('href', MicrostockPhotoPlugin.module_register_link);
      }
      if (MicrostockPhotoPlugin.module_detail_offer) {
        $('.mpp_offer_detail').html(MicrostockPhotoPlugin.module_detail_offer).show();
      }
    }
    $('input[name=mpp_buy_method]').bind('change', function() {
      var $t;
      $t = $(this);
      if ($t.val() < 2) {
        $('.mpp_license_subscription').hide();
        return $('.mpp_license_credits').show();
      } else {
        $('.mpp_license_credits').hide();
        return $('.mpp_license_subscription').show();
      }
    });
    $('.mpp_license_row').bind('click', function() {
      var $t;
      $t = $(this).find('input[name=mpp_license]');
      if (!$t.attr('disabled')) {
        $('input[name=mpp_buy]').attr('disabled', false).removeClass('button-primary').addClass('button-secondary').val(MicrostockPhotoPlugin.text.buy);
        return $t.attr('checked', true);
      }
    });
    $('input[name=mpp_license]').bind('click', function() {
      if (!$(this).attr('disabled')) {
        return $('input[name=mpp_buy]').attr('disabled', false).removeClass('button-primary').addClass('button-secondary').val(MicrostockPhotoPlugin.text.buy);
      }
    });
    return $('input[name=mpp_buy]').bind('click', function() {
      var $t;
      $t = $(this);
      if (!$t.attr('disabled') && !$t.attr('data-link')) {
        if ($t.hasClass('button-secondary')) {
          $(this).removeClass('button-secondary').addClass('button-primary').val(MicrostockPhotoPlugin.text.confirm);
        } else {
          $('input[name=mpp_license]').attr('disabled', true);
          $(this).attr('disabled', true);
          buyImage(0);
        }
      } else {

      }
      if ($t.attr('data-link')) {
        return top.location.href = $t.attr('data-link');
      }
    });
  };
  $button_license_accept.bind('click', function() {
    tb_remove();
    return buyImage(1);
  });
  $button_license_reject.bind('click', function() {
    tb_remove();
    $('input[name=mpp_license]').attr('disabled', false);
    return $('input[name=mpp_buy]').attr('disabled', false).removeClass('button-primary').addClass('button-secondary').val(MicrostockPhotoPlugin.text.buy);
  });
  bindImages = function() {
    $('.mpp_offer_close').bind('click', function() {
      var $t;
      $t = $(this);
      $.post(MicrostockPhotoPlugin.ajax_url, {
        a: 'hide_offer',
        id: $t.attr('data-id')
      }, function(r) {});
      return $t.parent().fadeOut(400, function() {
        return $(this).remove();
      });
    });
    return $('.mpp_image_link').bind('click', function() {
      return $.post(MicrostockPhotoPlugin.ajax_url, {
        a: 'detail',
        module: MicrostockPhotoPlugin.module,
        id: $(this).attr('href')
      }, function(r) {
        scroll_position = $(window).scrollTop();
        $('html,body').scrollTop(0);
        if (r.status === 1 && r.data) {
          $detail.html(r.data);
          bindLicenseTable();
          $ui_search.hide();
          return $ui_detail.show();
        }
      });
    });
  };
  search = function(text, page) {
    var filters;
    if (page == null) {
      page = 1;
    }
    $search_button.attr('disabled', true);
    $search_input.attr('disabled', true);
    $search_input_copy.val($search_input.val());
    filters = [];
    $search_filter.each(function(i, e) {
      var $e;
      $e = $(e);
      if ($e.is(':checked')) {
        return filters.push($e.val());
      }
    });
    return $.post(MicrostockPhotoPlugin.ajax_url, {
      a: 'search',
      module: MicrostockPhotoPlugin.module,
      search: text,
      page: page,
      filters: filters,
      sort: $search_sort.val()
    }, function(r) {
      $search_button.attr('disabled', false);
      $search_input.attr('disabled', false);
      if (r.status === 1 && r.images && r.paging) {
        $('html,body').scrollTop(0);
        $nb_images.html(r.nb_images);
        $paging.html(r.paging);
        $images.html(r.images);
        stickytooltip.init('data-tooltip-mpp', 'mpp_tooltips');
        bindPaging();
        return bindImages();
      }
    });
  };
  $search_button.bind('click', function() {
    if (!$(this).attr('disabled')) {
      return search($search_input.val());
    }
  });
  $search_input.bind('keypress', function(e) {
    var code;
    if (!$search_button.attr('disabled')) {
      code = e.keyCode || e.charCode;
      if (code === 13) {
        return search($search_input.val());
      }
    }
  });
  getPopularImages = function() {
    return $.post(MicrostockPhotoPlugin.ajax_url, {
      a: 'getPopularImages',
      module: MicrostockPhotoPlugin.module
    }, function(r) {
      if (r.status === 1 && r.images) {
        $('html,body').scrollTop(0);
        $images.html(r.images);
        stickytooltip.init('data-tooltip-mpp', 'mpp_tooltips');
        return bindImages();
      }
    });
  };
  $(document).ajaxStart(function() {
    return parent.mpp_loader.show();
  });
  $(document).ajaxStop(function() {
    return parent.mpp_loader.hide();
  });
  $back_button.bind('click', function() {
    $ui_detail.hide();
    $ui_search.show();
    return $('html,body').scrollTop(scroll_position);
  });
  $search_input.focus();
  window.mpp_checkStatus();
  return getPopularImages();
});
