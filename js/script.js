/**
 * Global variables
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
  initialDate = new Date(),

  $document = $(document),
  $window = $(window),
  $html = $("html"),

  isDesktop = $html.hasClass("desktop"),
  isRtl = $html.attr("dir") === "rtl",
  isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isTouch = "ontouchstart" in window,
  onloadCaptchaCallback,
  switchingColorMap = {
    "Primary": "#983568",
    "Secondary": "#faaf00"
  },
  plugins = {
    pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
    bootstrapTooltip: $("[data-toggle='tooltip']"),
    bootstrapModalDialog: $('.modal'),
    bootstrapTabs: $(".tabs-custom-init"),
    rdNavbar: $(".rd-navbar"),
    materialParallax: $(".material-parallax"),
    rdGoogleMaps: $(".rd-google-map"),
    rdMailForm: $(".rd-mailform"),
    rdInputLabel: $(".form-label"),
    regula: $("[data-constraints]"),
    owl: $(".owl-carousel"),
    swiper: $(".swiper-slider"),
    search: $(".rd-search"),
    searchResults: $('.rd-search-results'),
    statefulButton: $('.btn-stateful'),
    isotope: $(".isotope"),
    popover: $('[data-toggle="popover"]'),
    viewAnimate: $('.view-animate'),
    radio: $("input[type='radio']"),
    checkbox: $("input[type='checkbox']"),
    customToggle: $("[data-custom-toggle]"),
    facebookWidget: $('#fb-root'),
    counter: $(".counter"),
    progressLinear: $(".progress-linear"),
    circleProgress: $(".progress-bar-circle"),
    dateCountdown: $('.DateCountdown'),
    pageLoader: $(".page-loader"),
    captcha: $('.recaptcha'),
    scroller: $(".scroll-wrap"),
    mailchimp: $('.mailchimp-mailform'),
    campaignMonitor: $('.campaign-mailform'),
    layoutPanel: $(".layout-panel"),
    photoSwipeGallery: $("[data-photo-swipe-item]"),
    bootstrapDateTimePicker: $("[data-time-picker]"),
    selectFilter: $("select")
  }; 

/**
 * Initialize All Scripts
 */
$document.ready(function () {
  var isNoviBuilder = window.xMode;

  /**
   * getSwiperHeight
   * @description  calculate the height of swiper slider basing on data attr
   */
  function getSwiperHeight(object, attr) {
    var val = object.attr("data-" + attr),
      dim;

    if (!val) {
      return undefined;
    }

    dim = val.match(/(px)|(%)|(vh)$/i);

    if (dim.length) {
      switch (dim[0]) {
        case "px":
          return parseFloat(val);
        case "vh":
          return $(window).height() * (parseFloat(val) / 100);
        case "%":
          return object.width() * (parseFloat(val) / 100);
      }
    } else {
      return undefined;
    }
  }

  /**
   * toggleSwiperInnerVideos
   * @description  toggle swiper videos on active slides
   */
  function toggleSwiperInnerVideos(swiper) {
    var prevSlide = $(swiper.slides[swiper.previousIndex]),
      nextSlide = $(swiper.slides[swiper.activeIndex]),
      videos;

    prevSlide.find("video").each(function () {
      this.pause();
    });

    videos = nextSlide.find("video");
    if (videos.length) {
      videos.get(0).play();
    }
  }

  /**
   * toggleSwiperCaptionAnimation
   * @description  toggle swiper animations on active slides
   */
  function toggleSwiperCaptionAnimation(swiper) {
    var prevSlide = $(swiper.container),
      nextSlide = $(swiper.slides[swiper.activeIndex]);

    prevSlide
      .find("[data-caption-animate]")
      .each(function () {
        var $this = $(this);
        $this
          .removeClass("animated")
          .removeClass($this.attr("data-caption-animate"))
          .addClass("not-animated");
      });

    nextSlide
      .find("[data-caption-animate]")
      .each(function () {
        var $this = $(this),
          delay = $this.attr("data-caption-delay");


        if (!isNoviBuilder) {
          setTimeout(function () {
            $this
              .removeClass("not-animated")
              .addClass($this.attr("data-caption-animate"))
              .addClass("animated");
          }, delay ? parseInt(delay) : 0);
        } else {
          $this
            .removeClass("not-animated")
        }
      });
  }


  /**
   * initOwlCarousel
   * @description  Init owl carousel plugin
   */
  function initOwlCarousel(c) {
    var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-", "-xl-"],
      values = [0, 480, 768, 992, 1200, 1600],
      responsive = {},
      j, k;

    for (j = 0; j < values.length; j++) {
      responsive[values[j]] = {};
      for (k = j; k >= -1; k--) {
        if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
          responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"));
        }
        if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
          responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"));
        }
        if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
          responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"));
        }
      }
    }

    $window.on('layout.switch', function(){
      setTimeout(function(){
        c.trigger('refresh.owl.carousel');
      },200)
    });
    
    // Enable custom pagination
    if (c.attr('data-dots-custom')) {
      c.on("initialized.owl.carousel", function (event) {
        var carousel = $(event.currentTarget),
          customPag = $(carousel.attr("data-dots-custom")),
          active = 0;

        if (carousel.attr('data-active')) {
          active = parseInt(carousel.attr('data-active'));
        }

        carousel.trigger('to.owl.carousel', [active, 300, true]);
        customPag.find("[data-owl-item='" + active + "']").addClass("active");

        customPag.find("[data-owl-item]").on('click', function (e) {
          e.preventDefault();
          carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item")), 300, true]);
        });

        carousel.on("translate.owl.carousel", function (event) {
          customPag.find(".active").removeClass("active");
          customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
        });
      });
    }


    c.owlCarousel({
      autoplay: c.attr("data-autoplay") === "true",
      loop: isNoviBuilder ? false : c.attr('data-loop') == 'true',
      items: 1,
      rtl: isRtl,
      dotsContainer: c.attr("data-pagination-class") || false,
      navContainer: c.attr("data-navigation-class") || false,
      mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
      nav: c.attr('data-nav') === 'true',
      dots: c.attr("data-dots") === "true",
      dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each")) : false,
      animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
      animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
      responsive: responsive,
      navText: $.parseJSON(c.attr("data-nav-text")) || [],
      navClass: $.parseJSON(c.attr("data-nav-class")) || ['owl-prev', 'owl-next'],
    });
  }

  /**
   * isScrolledIntoView
   * @description  check the element whas been scrolled into the view
   */
  function isScrolledIntoView(elem) {
    if  (!isNoviBuilder){
      return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
    }
    else{
      return true;
    }
  }

  /**
   * initOnView
   * @description  calls a function when element has been scrolled into the view
   */
  function lazyInit(element, func) {
    var $win = jQuery(window);
    $win.on('load scroll', function () {
      if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
        func.call();
        element.addClass('lazy-loaded');
      }
    });
  }

  /**
   * Live Search
   * @description  create live search results
   */
  function liveSearch(options) {
    options.live.removeClass('cleared').html();
    options.current++;
    options.spin.addClass('loading');

    $.get(handler, {
      s: decodeURI(options.term),
      liveSearch: options.element.attr('data-search-live'),
      dataType: "html",
      liveCount: options.liveCount,
      filter: options.filter,
      template: options.template
    }, function (data) {
      options.processed++;
      var live = options.live;
      if (options.processed == options.current && !live.hasClass('cleared')) {
        live.find('> #search-results').removeClass('active');
        live.html(data);
        setTimeout(function () {
          live.find('> #search-results').addClass('active');
        }, 50);
      }
      options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
    })
  }

  /**
   * attachFormValidator
   * @description  attach form validation to elements
   */
  function attachFormValidator(elements) {
    for (var i = 0; i < elements.length; i++) {
      var o = $(elements[i]), v;
      o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
      v = o.parent().find(".form-validation");
      if (v.is(":last-child")) {
        o.addClass("form-control-last-child");
      }
    }

    elements
      .on('input change propertychange blur', function (e) {
        var $this = $(this), results;

        if (e.type != "blur") {
          if (!$this.parent().hasClass("has-error")) {
            return;
          }
        }

        if ($this.parents('.rd-mailform').hasClass('success')) {
          return;
        }

        if ((results = $this.regula('validate')).length) {
          for (i = 0; i < results.length; i++) {
            $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
          }
        } else {
          $this.siblings(".form-validation").text("").parent().removeClass("has-error")
        }
      })
      .regula('bind');

    var regularConstraintsMessages = [
      {
        type: regula.Constraint.Required,
        newMessage: "The text field is required."
      },
      {
        type: regula.Constraint.Email,
        newMessage: "The email is not a valid email."
      },
      {
        type: regula.Constraint.Numeric,
        newMessage: "Only numbers are required"
      },
      {
        type: regula.Constraint.Selected,
        newMessage: "Please choose an option."
      }
    ];


    for (var i = 0; i < regularConstraintsMessages.length; i++) {
      var regularConstraint = regularConstraintsMessages[i];

      regula.override({
        constraintType: regularConstraint.type,
        defaultMessage: regularConstraint.newMessage
      });
    }
  }

  /**
   * isValidated
   * @description  check if all elemnts pass validation
   */
  function isValidated(elements, captcha) {
    var results, errors = 0;

    if (elements.length) {
      for (j = 0; j < elements.length; j++) {

        var $input = $(elements[j]);
        if ((results = $input.regula('validate')).length) {
          for (k = 0; k < results.length; k++) {
            errors++;
            $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
          }
        } else {
          $input.siblings(".form-validation").text("").parent().removeClass("has-error")
        }
      }

      if (captcha) {
        if (captcha.length) {
          return validateReCaptcha(captcha) && errors == 0
        }
      }

      return errors == 0;
    }
    return true;
  }

  /**
   * Init Bootstrap tooltip
   * @description  calls a function when need to init bootstrap tooltips
   */
  function initBootstrapTooltip(tooltipPlacement) {
    if (window.innerWidth < 599) {
      plugins.bootstrapTooltip.tooltip('destroy');
      plugins.bootstrapTooltip.tooltip({
        placement: 'bottom'
      });
    } else {
      plugins.bootstrapTooltip.tooltip('destroy');
      plugins.bootstrapTooltip.tooltipPlacement;
      plugins.bootstrapTooltip.tooltip();
    }
  }


  /**
   * Copyright Year
   * @description  Evaluates correct copyright year
   */
  var o = $("#copyright-year");
  if (o.length) {
    o.text(initialDate.getFullYear());
  }


  /**
   * Page loader
   * @description Enables Page loader
   */
  if (plugins.pageLoader.length > 0) {
    setTimeout(function () {
      plugins.pageLoader.addClass("loaded");
      $window.trigger("resize");
    }, 1000);
    setTimeout(function () {
      plugins.pageLoader.addClass("ending");
      $window.trigger("resize");
    }, 1600);
  }

  /**
   * validateReCaptcha
   * @description  validate google reCaptcha
   */
  function validateReCaptcha(captcha) {
    var $captchaToken = captcha.find('.g-recaptcha-response').val();

    if ($captchaToken == '') {
      captcha
        .siblings('.form-validation')
        .html('Please, prove that you are not robot.')
        .addClass('active');
      captcha
        .closest('.form-group')
        .addClass('has-error');

      captcha.bind('propertychange', function () {
        var $this = $(this),
          $captchaToken = $this.find('.g-recaptcha-response').val();

        if($captchaToken != '') {
          $this
            .closest('.form-group')
            .removeClass('has-error');
          $this
            .siblings('.form-validation')
            .removeClass('active')
            .html('');
          $this.unbind('propertychange');
        }
      });

      return false;
    }

    return true;
  }


  /**
   * onloadCaptchaCallback
   * @description  init google reCaptcha
   */
  onloadCaptchaCallback = function () {
    for (i = 0; i < plugins.captcha.length; i++) {
      var $capthcaItem = $(plugins.captcha[i]);

      grecaptcha.render(
        $capthcaItem.attr('id'),
        {
          sitekey: $capthcaItem.attr('data-sitekey'),
          size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
          theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
          callback: function (e) {
            $('.recaptcha').trigger('propertychange');
          }
        }
      );
      $capthcaItem.after("<span class='form-validation'></span>");
    }
  };

  /**
   * Google ReCaptcha
   * @description Enables Google ReCaptcha
   */
  if (plugins.captcha.length) {
    $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
  }

  /**
   * Is Mac os
   * @description  add additional class on html if mac os.
   */
  if (navigator.platform.match(/(Mac)/i)) $html.addClass("mac-os");

  /**
   * IE Polyfills
   * @description  Adds some loosing functionality to IE browsers
   */
  if (isIE) {
    if (isIE < 10) {
      $html.addClass("lt-ie-10");
    }

    if (isIE < 11) {
      if (plugins.pointerEvents) {
        $.getScript(plugins.pointerEvents)
          .done(function () {
            $html.addClass("ie-10");
            PointerEventsPolyfill.initialize({});
          });
      }
    }

    if (isIE === 11) {
      $("html").addClass("ie-11");
    }

    if (isIE === 12) {
      $("html").addClass("ie-edge");
    }
  }

  /**
   * Bootstrap Tooltips
   * @description Activate Bootstrap Tooltips
   */
  if (plugins.bootstrapTooltip.length) {
    var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
    initBootstrapTooltip(tooltipPlacement);
    $(window).on('resize orientationchange', function () {
      initBootstrapTooltip(tooltipPlacement);
    })
  }

  /**
   * bootstrapModalDialog
   * @description Stap vioeo in bootstrapModalDialog
   */
  if (plugins.bootstrapModalDialog.length > 0) {
    var i = 0;

    for (i = 0; i < plugins.bootstrapModalDialog.length; i++) {
      var modalItem = $(plugins.bootstrapModalDialog[i]);

      modalItem.on('hidden.bs.modal', $.proxy(function () {
        var activeModal = $(this),
          rdVideoInside = activeModal.find('video'),
          youTubeVideoInside = activeModal.find('iframe');

        if (rdVideoInside.length) {
          rdVideoInside[0].pause();
        }

        if (youTubeVideoInside.length) {
          var videoUrl = youTubeVideoInside.attr('src');

          youTubeVideoInside
            .attr('src', '')
            .attr('src', videoUrl);
        }
      }, modalItem))
    }
  }

  /**
   * JQuery mousewheel plugin
   * @description  Enables jquery mousewheel plugin
   */
  if (plugins.scroller.length) {
    var i;
    for (i = 0; i < plugins.scroller.length; i++) {
      var scrollerItem = $(plugins.scroller[i]);

      scrollerItem.mCustomScrollbar({
        theme: scrollerItem.attr('data-theme') ? scrollerItem.attr('data-theme') : 'minimal',
        scrollInertia: 100,
        scrollButtons: {enable: false}
      });
    }
  }


  /**
   * RD Google Maps
   * @description Enables RD Google Maps plugin
   */
  if (plugins.rdGoogleMaps.length) {
    var i;

    $.getScript("//maps.google.com/maps/api/js?key=AIzaSyAwH60q5rWrS8bXwpkZwZwhw9Bw0pqKTZM&sensor=false&libraries=geometry,places&v=3.7", function () {
      var head = document.getElementsByTagName('head')[0],
        insertBefore = head.insertBefore;

      head.insertBefore = function (newElement, referenceElement) {
        if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') != -1 || newElement.innerHTML.indexOf('gm-style') != -1) {
          return;
        }
        insertBefore.call(head, newElement, referenceElement);
      };

      for (i = 0; i < plugins.rdGoogleMaps.length; i++) {

        var $googleMapItem = $(plugins.rdGoogleMaps[i]);

        lazyInit($googleMapItem, $.proxy(function () {
          var $this = $(this),
            styles = $this.attr("data-styles");

          $this.googleMap({
            marker: {
              basic: $this.data('marker'),
              active: $this.data('marker-active')
            },
            styles: styles ? JSON.parse(styles) : [],
            onInit: function (map) {
              var inputAddress = $('#rd-google-map-address');



              if (inputAddress.length) {
                var input = inputAddress;
                var geocoder = new google.maps.Geocoder();
                var marker = new google.maps.Marker(
                  {
                    map: map,
                    icon: $this.data('marker-url'),
                  }
                );

                var autocomplete = new google.maps.places.Autocomplete(inputAddress[0]);
                autocomplete.bindTo('bounds', map);
                inputAddress.attr('placeholder', '');
                inputAddress.on('change', function () {
                  $("#rd-google-map-address-submit").trigger('click');
                });
                inputAddress.on('keydown', function (e) {
                  if (e.keyCode == 13) {
                    $("#rd-google-map-address-submit").trigger('click');
                  }
                });


                $("#rd-google-map-address-submit").on('click', function (e) {
                  e.preventDefault();
                  var address = input.val();
                  geocoder.geocode({'address': address}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                      var latitude = results[0].geometry.location.lat();
                      var longitude = results[0].geometry.location.lng();

                      map.setCenter(new google.maps.LatLng(
                        parseFloat(latitude),
                        parseFloat(longitude)
                      ));
                      marker.setPosition(new google.maps.LatLng(
                        parseFloat(latitude),
                        parseFloat(longitude)
                      ))
                    }
                  });
                });
              }
            }
          });
        }, $googleMapItem));
      }
    });
  }

  /**
   * Facebook widget
   * @description  Enables official Facebook widget
   */
  if (plugins.facebookWidget.length) {
    lazyInit(plugins.facebookWidget, function () {
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_EN/sdk.js#xfbml=1&version=v2.5";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    });
  }

  /**
   * Radio
   * @description Add custom styling options for input[type="radio"]
   */
  if (plugins.radio.length) {
    var i;
    for (i = 0; i < plugins.radio.length; i++) {
      var $this = $(plugins.radio[i]);
      $this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
    }
  }

  /**
   * Checkbox
   * @description Add custom styling options for input[type="checkbox"]
   */
  if (plugins.checkbox.length) {
    var i;
    for (i = 0; i < plugins.checkbox.length; i++) {
      var $this = $(plugins.checkbox[i]);
      if (!$this.hasClass('toggle-custom')){
        $this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
      }
    }
  }

  /**
   * Popovers
   * @description Enables Popovers plugin
   */
  if (plugins.popover.length) {
    if (window.innerWidth < 767) {
      plugins.popover.attr('data-placement', 'bottom');
      plugins.popover.popover();
    }
    else {
      plugins.popover.popover();
    }
  }

  /**
   * Bootstrap Buttons
   * @description  Enable Bootstrap Buttons plugin
   */
  if (plugins.statefulButton.length) {
    $(plugins.statefulButton).on('click', function () {
      var statefulButtonLoading = $(this).button('loading');

      setTimeout(function () {
        statefulButtonLoading.button('reset')
      }, 2000);
    })
  }

  /**
   * UI To Top
   * @description Enables ToTop Button
   */
  if (isDesktop && !isNoviBuilder) {
    $().UItoTop({
      easingType: 'easeOutQuart',
      containerClass: 'ui-to-top fa fa-angle-up'
    });
  }

  /**
   * RD Navbar
   * @description Enables RD Navbar plugin
   */
  if (plugins.rdNavbar.length) {
    plugins.rdNavbar.RDNavbar({
      stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
      responsive: {
        0: {
          stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up") === 'true' : false
        },
        768: {
          stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-sm-stick-up") === 'true' : false
        },
        992: {
          stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-md-stick-up") === 'true' : false
        },
        1200: {
          stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-lg-stick-up") === 'true' : false
        }
      },
      callbacks: {
        onStuck: function () {
          var navbarSearch = this.$element.find('.rd-search input');

          if (navbarSearch) {
            navbarSearch.val('').trigger('propertychange');
          }
        },
        onDropdownOut: function () {
          return true;
        },
        onUnstuck: function () {
          if (this.$clone === null)
            return;

          var navbarSearch = this.$clone.find('.rd-search input');

          if (navbarSearch) {
            navbarSearch.val('').trigger('propertychange');
            navbarSearch.blur();
          }
        }
      }
    });
    if (plugins.rdNavbar.attr("data-body-class")) {
      document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
    }
  }


  /**
   * RD Search
   * @description Enables search
   */
  if (plugins.search.length || plugins.searchResults) {
    var handler = "bat/rd-search.php";
    var defaultTemplate = '<h5 class="search_title"><a target="_top" href="#{href}" class="search_link">#{title}</a></h5>' +
      '<p>...#{token}...</p>' +
      '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
    var defaultFilter = '*.html';

    if (plugins.search.length) {

      plugins.search = $('.' + plugins.search[0].className);

      for (i = 0; i < plugins.search.length; i++) {
        var searchItem = $(plugins.search[i]),
          options = {
            element: searchItem,
            filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
            template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
            live: (searchItem.attr('data-search-live')) ? (searchItem.find('.' + searchItem.attr('data-search-live'))) : false,
            liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live')) : 4,
            current: 0, processed: 0, timer: {}
          };

        if ($('.rd-navbar-search-toggle').length) {
          var toggle = $('.rd-navbar-search-toggle');
          toggle.on('click', function () {
            if (!($(this).hasClass('active'))) {
              searchItem.find('input').val('').trigger('propertychange');
            }
          });
        }

        if (options.live) {
          options.clearHandler = false;

          searchItem.find('input').on("keyup input propertychange", $.proxy(function () {
            var ctx = this;

            this.term = this.element.find('input').val().trim();
            this.spin = this.element.find('.input-group-addon');

            clearTimeout(ctx.timer);

            if (ctx.term.length > 2) {
              ctx.timer = setTimeout(liveSearch(ctx), 200);

              if (ctx.clearHandler == false) {
                ctx.clearHandler = true;

                $("body").on("click", function (e) {
                  if ($(e.toElement).parents('.rd-search').length == 0) {
                    ctx.live.addClass('cleared').html('');
                  }
                })
              }

            } else if (ctx.term.length == 0) {
              ctx.live.addClass('cleared').html('');
            }
          }, options, this));
        }

        searchItem.submit($.proxy(function () {
          $('<input />').attr('type', 'hidden')
            .attr('name', "filter")
            .attr('value', this.filter)
            .appendTo(this.element);
          return true;
        }, options, this))
      }
    }

    if (plugins.searchResults.length) {
      var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
      var match = regExp.exec(location.search);

      if (match != null) {
        $.get(handler, {
          s: decodeURI(match[1]),
          dataType: "html",
          filter: match[2],
          template: defaultTemplate,
          live: ''
        }, function (data) {
          plugins.searchResults.html(data);
        })
      }
    }
  }


  /**
   * ViewPort Universal
   * @description Add class in viewport
   */
  if (plugins.viewAnimate.length) {
    var i;
    for (i = 0; i < plugins.viewAnimate.length; i++) {
      var $view = $(plugins.viewAnimate[i]).not('.active');
      $document.on("scroll", $.proxy(function () {
        if (isScrolledIntoView(this)) {
          this.addClass("active");
        }
      }, $view))
        .trigger("scroll");
    }
  }


  /**
   * Swiper 3.1.7
   * @description  Enable Swiper Slider
   */
  if (plugins.swiper.length) {
    var i;
    for (i = 0; i < plugins.swiper.length; i++) {
      var s = $(plugins.swiper[i]);
      var pag = s.find(".swiper-pagination"),
        next = s.find(".swiper-button-next"),
        prev = s.find(".swiper-button-prev"),
        bar = s.find(".swiper-scrollbar"),
        swiperSlide = s.find(".swiper-slide"),
        autoplay = false;

      for (j = 0; j < swiperSlide.length; j++) {
        var $this = $(swiperSlide[j]),
          url;

        if (url = $this.attr("data-slide-bg")) {
          $this.css({
            "background-image": "url(" + url + ")",
            "background-size": "cover"
          })
        }
      }


      swiperSlide.end()
        .find("[data-caption-animate]")
        .addClass("not-animated")
        .end()
        .swiper({
          autoplay: isNoviBuilder ? null :  s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
          direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
          effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
          speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
          keyboardControl: s.attr('data-keyboard') === "true",
          mousewheelControl: s.attr('data-mousewheel') === "true",
          mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
          nextButton: next.length ? next.get(0) : null,
          prevButton: prev.length ? prev.get(0) : null,
          pagination: pag.length ? pag.get(0) : null,
          paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
          paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
          } : null : null,
          scrollbar: bar.length ? bar.get(0) : null,
          scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
          scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
          loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
          simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
          onTransitionStart: function (swiper) {
            toggleSwiperInnerVideos(swiper);
          },
          onTransitionEnd: function (swiper) {
            toggleSwiperCaptionAnimation(swiper);
          },
          onInit: function (swiper) {
            toggleSwiperInnerVideos(swiper);
            toggleSwiperCaptionAnimation(swiper);

            $(window).on('resize', function () {
              swiper.update(true);
            })
          }
        });

      $(window)
        .on("resize", function () {
          var mh = getSwiperHeight(s, "min-height"),
            h = getSwiperHeight(s, "height");
          if (h) {
            s.css("height", mh ? mh > h ? mh : h : h);
          }
        })
        .trigger("resize");
    }
  }


  /**
   * Owl carousel
   * @description Enables Owl carousel plugin
   */
  if (plugins.owl.length) {
    var i;
    for (i = 0; i < plugins.owl.length; i++) {
      var c = $(plugins.owl[i]);
      //skip owl in bootstrap tabs
      if (!c.parents('.tab-content').length) {
        initOwlCarousel(c);
      }
    }
  }

  /**
   * Isotope
   * @description Enables Isotope plugin
   */
  if (plugins.isotope.length) {
    var i, isogroup = [];
    for (i = 0; i < plugins.isotope.length; i++) {
      var isotopeItem = plugins.isotope[i],
        iso = new Isotope(isotopeItem, {
          itemSelector: '.isotope-item',
          layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
          filter: '*',
          masonry: {
            columnWidth: '.grid-size'
          }
        });

      isogroup.push(iso);
    }

    $(window).on('load', function () {
      setTimeout(function () {
        var i;
        for (i = 0; i < isogroup.length; i++) {
          isogroup[i].element.className += " isotope--loaded";
          isogroup[i].layout();
        }
      }, 600);
    });

    var resizeTimout;

    $("[data-isotope-filter]").on("click", function (e) {
      e.preventDefault();
      var filter = $(this);
      clearTimeout(resizeTimout);
      filter.parents(".isotope-filters").find('.active').removeClass("active");
      filter.addClass("active");
      var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]');
      iso.isotope({
        itemSelector: '.isotope-item',
        layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
        filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'
      });
    }).eq(0).trigger("click")
  }

  /**
   * WOW
   * @description Enables Wow animation plugin
   */
  if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {
    new WOW().init();
  }

  /**
   * Bootstrap tabs
   * @description Activate Bootstrap Tabs
   */
  if (plugins.bootstrapTabs.length) {
    var i;
    for (i = 0; i < plugins.bootstrapTabs.length; i++) {
      var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

      //If have owl carousel inside tab - resize owl carousel on click
      if (bootstrapTabsItem.find('.owl-carousel').length) {
        // init first open tab

        var carouselObj = bootstrapTabsItem.find('.tab-content .tab-pane.active .owl-carousel');

        initOwlCarousel(carouselObj);

        //init owl carousel on tab change
        bootstrapTabsItem.find('.nav-custom a').on('click', $.proxy(function () {
          var $this = $(this);

          $this.find('.owl-carousel').trigger('destroy.owl.carousel').removeClass('owl-loaded');
          $this.find('.owl-carousel').find('.owl-stage-outer').children().unwrap();

          setTimeout(function () {
            var carouselObj = $this.find('.tab-content .tab-pane.active .owl-carousel');

            if (carouselObj.length) {
              for (var j = 0; j < carouselObj.length; j++) {
                var carouselItem = $(carouselObj[j]);
                initOwlCarousel(carouselItem);
              }
            }

          }, isNoviBuilder ? 1500 : 300);

        }, bootstrapTabsItem));
      }

      //If have slick carousel inside tab - resize slick carousel on click
      if (bootstrapTabsItem.find('.slick-slider').length) {
        bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
          var $this = $(this);
          var setTimeOutTime = isNoviBuilder ? 1500 : 300;

          setTimeout(function () {
            $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
          }, setTimeOutTime);
        }, bootstrapTabsItem));
      }
    }
  }


  /**
   * RD Input Label
   * @description Enables RD Input Label Plugin
   */
  if (plugins.rdInputLabel.length) {
    plugins.rdInputLabel.RDInputLabel();
  }

  /**
   * Regula
   * @description Enables Regula plugin
   */
  if (plugins.regula.length) {
    attachFormValidator(plugins.regula);
  }


  /**
   * MailChimp Ajax subscription
   */
  if (plugins.mailchimp.length) {
    $.each(plugins.mailchimp, function(index, form){
      var $form = $(form),
        $email = $form.find('input[type=email]'),
        $output = $("#" + plugins.mailchimp.attr("data-form-output"));

      // Required by MailChimp
      $form.attr('novalidate', 'true');
      $email.attr('name', 'EMAIL');

      $form.submit(function (e){
        var data = {},
          url = $form.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
          dataArray = $form.serializeArray();

        $.each(dataArray, function (index, item) {
          data[item.name] = item.value;
        });

        $.ajax({
          data: data,
          url: url,
          dataType: 'jsonp',
          error: function (resp, text) {
            $output.html('Server error: ' + text);

            setTimeout(function () {
              $output.removeClass("active");
            }, 4000);
          },
          success: function (resp) {
            $output.html(resp.msg).addClass('active');

            setTimeout(function () {
              $output.removeClass("active");
            }, 6000);
          },
          beforeSend: function(data){
            // Stop request if builder or inputs are invalide
            if (isNoviBuilder || !isValidated($form.find('[data-constraints]')))
              return false;

            $output.html('Submitting...').addClass('active');
          }
        });

        return false;
      });
    });
  }


  /**
   * Campaign Monitor ajax subscription
   */
  if (plugins.campaignMonitor.length) {
    $.each(plugins.campaignMonitor, function(index, form){
      var $form = $(form),
        $output = $("#" + plugins.campaignMonitor.attr("data-form-output"));

      $form.submit(function (e){
        var data = {},
          url = $form.attr('action'),
          dataArray = $form.serializeArray();

        $.each(dataArray, function (index, item) {
          data[item.name] = item.value;
        });

        $.ajax({
          data: data,
          url: url,
          dataType: 'jsonp',
          error: function (resp, text) {
            $output.html('Server error: ' + text);

            setTimeout(function () {
              $output.removeClass("active");
            }, 4000);
          },
          success: function (resp) {
            console.log(resp);

            $output.html(resp.Message).addClass('active');

            setTimeout(function () {
              $output.removeClass("active");
            }, 6000);
          },
          beforeSend: function(data){
            // Stop request if builder or inputs are invalide
            if (isNoviBuilder || !isValidated($form.find('[data-constraints]')))
              return false;

            $output.html('Submitting...').addClass('active');
          }
        });

        return false;
      });
    });
  }


  /**
   * RD Mailform
   * @version      3.0.0
   */
  if (plugins.rdMailForm.length) {
    var i, j, k,
      msg = {
        'MF000': 'Successfully sent!',
        'MF001': 'Recipients are not set!',
        'MF002': 'Form will not work locally!',
        'MF003': 'Please, define email field in your form!',
        'MF004': 'Please, define type of your form!',
        'MF254': 'Something went wrong with PHPMailer!',
        'MF255': 'Aw, snap! Something went wrong.'
      },
      recipients = '';

    for (i = 0; i < plugins.rdMailForm.length; i++) {
      var $form = $(plugins.rdMailForm[i]),
        formHasCaptcha = false;

      $form.attr('novalidate', 'novalidate').ajaxForm({
        data: {
          "form-type": $form.attr("data-form-type") || "contact",
          "recipients": recipients,
          "counter": i
        },
        beforeSubmit: function (arr, $form, options) {
          if (isNoviBuilder)
            return;

          var form = $(plugins.rdMailForm[this.extraData.counter]),
            inputs = form.find("[data-constraints]"),
            output = $("#" + form.attr("data-form-output")),
            captcha = form.find('.recaptcha'),
            captchaFlag = true;

          output.removeClass("active error success");

          if (isValidated(inputs, captcha)) {

            // veify reCaptcha
            if(captcha.length) {
              var captchaToken = captcha.find('.g-recaptcha-response').val(),
                captchaMsg = {
                  'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                  'CPT002': 'Something wrong with google reCaptcha'
                }

              formHasCaptcha = true;

              $.ajax({
                method: "POST",
                url: "bat/reCaptcha.php",
                data: {'g-recaptcha-response': captchaToken},
                async: false
              })
                .done(function (responceCode) {
                  if (responceCode != 'CPT000') {
                    if (output.hasClass("snackbars")) {
                      output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

                      setTimeout(function () {
                        output.removeClass("active");
                      }, 3500);

                      captchaFlag = false;
                    } else {
                      output.html(captchaMsg[responceCode]);
                    }

                    output.addClass("active");
                  }
                });
            }

            if(!captchaFlag) {
              return false;
            }

            form.addClass('form-in-process');

            if (output.hasClass("snackbars")) {
              output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
              output.addClass("active");
            }
          } else {
            return false;
          }
        },
        error: function (result) {
          if (isNoviBuilder)
            return;

          var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
            form = $(plugins.rdMailForm[this.extraData.counter]);

          output.text(msg[result]);
          form.removeClass('form-in-process');

          if(formHasCaptcha) {
            grecaptcha.reset();
          }
        },
        success: function (result) {
          if (isNoviBuilder)
            return;

          console.log(result);

          var form = $(plugins.rdMailForm[this.extraData.counter]),
            output = $("#" + form.attr("data-form-output"));

          form
            .addClass('success')
            .removeClass('form-in-process');

          if(formHasCaptcha) {
            grecaptcha.reset();
          }

          result = result.length === 5 ? result : 'MF255';
          output.text(msg[result]);

          if (result === "MF000") {
            if (output.hasClass("snackbars")) {
              output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
                $('.formMessage').show();
            } else {
              output.addClass("active success");
            }
          } else {
            if (output.hasClass("snackbars")) {
              output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
            } else {
              output.addClass("active error");
            }
          }

          if( form.find( 'select' ) ) plugins.selectFilter.select2( 'val', '' );

          form.clearForm();
          form.find('input, textarea').blur();

          setTimeout(function () {
            output.removeClass("active error success");
            form.removeClass('success');
          }, 3500);
        }
      });
    }
  }

  /**
   * PhotoSwipe Gallery
   * @description Enables PhotoSwipe Gallery plugin
   */
  if (plugins.photoSwipeGallery.length && !isNoviBuilder) {
    // init image click event
    $document.delegate("[data-photo-swipe-item]", "click", function (event) {
      event.preventDefault();

      var $el = $(this),
        $galleryItems = $el.parents("[data-photo-swipe-gallery]").find("a[data-photo-swipe-item]"),
        pswpElement = document.querySelectorAll('.pswp')[0],
        encounteredItems = {},
        pswpItems = [],
        options,
        pswpIndex = 0,
        pswp;

      if ($galleryItems.length == 0) {
        $galleryItems = $el;
      }

      // loop over the gallery to build up the photoswipe items
      $galleryItems.each(function () {
        var $item = $(this),
          src = $item.attr('href'),
          size = $item.attr('data-size').split('x'),
          pswdItem;

        if ($item.is(':visible')) {

          // if we have this image the first time
          if (!encounteredItems[src]) {
            // build the photoswipe item
            pswdItem = {
              src: src,
              w: parseInt(size[0], 10),
              h: parseInt(size[1], 10),
              el: $item // save link to element for getThumbBoundsFn
            };

            // store that we already had this item
            encounteredItems[src] = {
              item: pswdItem,
              index: pswpIndex
            };

            // push the item to the photoswipe list
            pswpItems.push(pswdItem);
            pswpIndex++;
          }
        }
      });

      options = {
        index: encounteredItems[$el.attr('href')].index,

        getThumbBoundsFn: function (index) {
          var $el = pswpItems[index].el,
            offset = $el.offset();

          return {
            x: offset.left,
            y: offset.top,
            w: $el.width()
          };
        }
      };

      // open the photoswipe gallery
      pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, pswpItems, options);
      pswp.init();
    });
  }

  /**
   * Custom Toggles
   */
  if (plugins.customToggle.length) {
    var i;

    for (i = 0; i < plugins.customToggle.length; i++) {
      var $this = $(plugins.customToggle[i]);

      $this.on('click', $.proxy(function (event) {
        event.preventDefault();
        var $ctx = $(this);
        $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
      }, $this));

      if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
        $("body").on("click", $this, function (e) {
          if (e.target !== e.data[0]
            && $(e.data.attr('data-custom-toggle')).find($(e.target)).length
            && e.data.find($(e.target)).length == 0) {
            $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
          }
        })
      }

      if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
        $("body").on("click", $this, function (e) {
          if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {
            $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
          }
        })
      }
    }
  }

  /**
   * jQuery Count To
   * @description Enables Count To plugin
   */
  if (plugins.counter.length) {
    var i;

    for (i = 0; i < plugins.counter.length; i++) {
      var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
      $document
        .on("scroll", $.proxy(function () {
          var $this = this;

          if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
            $this.countTo({
              refreshInterval: 40,
              from: 0,
              to: parseInt($this.text(), 10),
              speed: $this.attr("data-speed") || 1000
            });
            $this.addClass('animated');
          }
        }, $counterNotAnimated))
        .trigger("scroll");
    }
  }

  /**
   * TimeCircles
   * @description  Enable TimeCircles plugin
   */
  if (plugins.dateCountdown.length) {
    var i;
    for (i = 0; i < plugins.dateCountdown.length; i++) {
      var dateCountdownItem = $(plugins.dateCountdown[i]);

      $(window).on('load resize orientationchange', $.proxy(function () {
        var $this = $(this),
          circleColor = $this.data('circle-inner-color'),
          dateCountdownItemBgColor = $this.data('circle-bg'),
          time = {
            "Days": {
              "text": "Days",
              "color": circleColor,
              "show": true
            },
            "Hours": {
              "text": "Hours",
              "color": circleColor,
              "show": true
            },
            "Minutes": {
              "text": "Minutes",
              "color": circleColor,
              "show": true
            },
            "Seconds": {
              "text": "Seconds",
              "color": circleColor,
              "show": true
            }
          };

        $this.TimeCircles({
          fg_width: $this.data('circle-fg-width') || 0.045,
          circle_bg_color: dateCountdownItemBgColor,
          bg_width: $this.data('circle-bg-width') || 0.9,
          time: time
        });

        if (window.innerWidth < 479) {
          $this.TimeCircles({
            time: {
              Days: {
                "color": circleColor,
                "show": true
              },
              Hours: {
                "color": circleColor,
                "show": true
              },
              Minutes: {
                color: circleColor,
                show: true
              },
              Seconds: {
                show: false
              }
            }
          }).rebuild();
        } else if (window.innerWidth < 767) {
          $this.TimeCircles({
            time: {
              Days: {
                "color": circleColor,
                "show": true
              },
              Hours: {
                "color": circleColor,
                "show": true
              },
              Seconds: {show: false}
            }
          }).rebuild();
        } else {
          $this.TimeCircles({time: time}).rebuild();
        }
      }, dateCountdownItem));
    }
  }

  /**
   * Circle Progress
   * @description Enable Circle Progress plugin
   */
  if (plugins.circleProgress.length) {
    var i;
    for (i = 0; i < plugins.circleProgress.length; i++) {
      var circleProgressItem = $(plugins.circleProgress[i]);
      $document
        .on("scroll", $.proxy(function () {
          var $this = $(this);

          if (!$this.hasClass('animated') && isScrolledIntoView($this)) {

            var arrayGradients = $this.attr('data-gradient').split(",");

            $this.circleProgress({
              value: $this.attr('data-value'),
              size: $this.attr('data-size') ? $this.attr('data-size') : 175,
              fill: {gradient: arrayGradients, gradientAngle: Math.PI / 4},
              startAngle: -Math.PI / 4 * 2,
              emptyFill: $this.attr('data-empty-fill') ? $this.attr('data-empty-fill') : "rgb(245,245,245)",
              thickness: $this.attr('data-thickness') ? parseInt($this.attr('data-thickness')) : 10,

            }).on('circle-animation-progress', function (event, progress, stepValue) {
              $(this).find('span').text(String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1'));
            });
            $this.addClass('animated');
          }
        }, circleProgressItem))
        .trigger("scroll");
    }
  }

  /**
   * Linear Progress bar
   * @description  Enable progress bar
   */
  if (plugins.progressLinear.length) {
    for (i = 0; i < plugins.progressLinear.length; i++) {
      var progressBar = $(plugins.progressLinear[i]);
      $window
        .on("scroll load", $.proxy(function () {
          var bar = $(this);
          if (!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
            var end = parseInt($(this).find('.progress-value').text(), 10);
            bar.find('.progress-bar-linear').css({width: end + '%'});
            bar.find('.progress-value').countTo({
              refreshInterval: 40,
              from: 0,
              to: end,
              speed: 500
            });
            bar.addClass('animated-first');
          }
        }, progressBar));
    }
  }

  /**
   * Material Parallax
   * @description Enables Material Parallax plugin
   */
  if (plugins.materialParallax.length) {
    var i;

    if (!isNoviBuilder && !isIE && !isMobile) {
      plugins.materialParallax.parallax();
    } else {
      for (i = 0; i < plugins.materialParallax.length; i++) {
        var parallax = $(plugins.materialParallax[i]),
          imgPath = parallax.find("img").attr("src");

        parallax.css({
          "background-image": 'url(' + imgPath + ')',
          "background-attachment": "fixed",
          "background-size": "cover"
        });
      }
    }
  }


  /**
   * Style switcher
   * @description Enables Style switcher plugin
   */
  if (plugins.layoutPanel.length) {
    var LayputPanel = (function($, document){
      function LayputPanel(){
        if (isRtl){
          return false;
        }

        this.altColorLink = document.createElement( "link" );
        this.altColorLink.href = "css/style-contrast.css";
        this.altColorLink.type = "text/css";
        this.altColorLink.rel = "stylesheet";


        this.elements = {
            colorTheme: $("#colorTheme"),
            layout: $('#layout'),
            resetButton: $("#layout-panel-style-reset"),
            saveButton: $("#layout-panel-style-save")
          };

        this.layoutPanel = plugins.layoutPanel.find('#layout-panel-style');
        this.savedColors = JSON.parse(sessionStorage.getItem('savedColors')) || {};
        this.switchingColorMap = switchingColorMap;
        this.css_text = function (x) { return x.cssText; };
        this.file = $("[href='css/style.css']")[0] || $("[href='css/style-rtl.css']")[0]; // Get base site style element
        this.head = document.head;

        this.altStyleElem = this.head.appendChild(this.altColorLink);

        this.style = document.createElement('style');
        this.style.type = 'text/css';
        // Class for future check if element is still in header (was not reseted)
        this.style.classList.add('color-scheme');

        if (sessionStorage.getItem('colorTheme') === null){
          this.colorTheme = 'default';
        } else {
          this.colorTheme = sessionStorage.getItem('colorTheme');
        }

        // Add style elem in witch we will change color
        this.style.appendChild(document.createTextNode(this.content));

        this.styleElem = this.head.appendChild(this.style);

        this.fillStyleElem(this.file);


        if (sessionStorage.getItem('pageLayout') === null){
          this.pageLayout = 'wide';
        } else {
          this.pageLayout = sessionStorage.getItem('pageLayout');
        }

        this.checkLocalStorage();

        this.init();
      }

      LayputPanel.prototype.generateRows = function(){
        var that = this;

        $.each(that.switchingColorMap, function (key, value) {
          var row = $('<div class="layout-panel-row">' +
              '<label>' + key + ' color:</label>' +
              '<input class="jscolor" name="' + key + '" value="' + value + '" style="width:70px;">' +
              '</div>').appendTo(that.layoutPanel),
            rowInput = row.find('.jscolor');

          // Reset prev-color to default input value
          rowInput.attr('data-prev-color', that.savedColors.hasOwnProperty(key) ? that.savedColors[key] : rowInput[0].defaultValue);

          if (that.savedColors.hasOwnProperty(key)){
            rowInput[0].value = that.savedColors[key];
          }

          rowInput.change(function(e){
            // If style elem in HEAD was deleted
            if ($('head style.color-scheme').length === 0){
              // Reset saved in process of generation style elem content
              that.style.innerHTML = '';
              that.style.appendChild(document.createTextNode(that.content));
              that.styleElem = that.head.appendChild(that.style);

              // Reset prev-color to default input value
              rowInput.attr('data-prev-color', rowInput[0].defaultValue);
            }

            that.savedColors[key] = "#" + e.target.value;

            // Split all styles string by prev color and concatenate that array by new color value
            that.styleElem.innerHTML = that.styleElem.innerHTML.split(hexToRgb(rowInput.attr('data-prev-color'))).join(hexToRgb("#" + e.target.value));

            // Reset prev-color to default input value
            rowInput.attr('data-prev-color', "#" + e.target.value);
          });
        });
      }

      LayputPanel.prototype.checkLocalStorage = function(){
        if (this.pageLayout === 'boxed'){
          $('#layout').attr('checked', true);
          $html.addClass('boxed');
          $window.trigger('resize');
        }
        if (this.colorTheme === 'contrast'){
          $('#colorTheme').attr('checked', true);

          this.styleElem.innerHTML = this.altColorLink.innerHTML;
        }

        if (sessionStorage.hasOwnProperty('savedStyles')){
          this.styleElem.innerHTML = sessionStorage.getItem('savedStyles');
        }
      }

      LayputPanel.prototype.fillStyleElem = function (sourceFile) {
        this.styleRules = isIE ? sourceFile.sheet.cssText : sourceFile.sheet.cssRules; // First for firefox; second for ie

        if (!isIE){
          this.content = Array.prototype.map.call(this.styleRules, this.css_text).join('\n');
        } else {
          this.content = this.styleRules;
        }

        this.content = this.content.replace(/@font-face {(.|\s)*?}/gim, ''); // Remove font includes
        this.content = this.content.replace(/(\{|\;)[^\;\{\}]*?url\(.*\)[^\;\{\}]*?\;/gim, ''); // Remove images

        this.styleElem.innerHTML = this.content;
      };

      LayputPanel.prototype.resetColors = function () {
        this.layoutPanel.find('.jscolor').each(function(index, item){
          item.jscolor.fromString(item.defaultValue);
          $(item).attr('data-prev-color', item.defaultValue);
        });

        this.savedColors = {}; 
      };

      /**
       * Event handlers
       */

      LayputPanel.prototype.handleSave = function(e){
        e.preventDefault();

        if(this.styleElem.innerHTML){
          sessionStorage.setItem('savedStyles', this.styleElem.innerHTML);
        }
        sessionStorage.setItem('savedColors', JSON.stringify(this.savedColors));
        sessionStorage.setItem('pageLayout', this.pageLayout);
        sessionStorage.setItem('colorTheme', this.colorTheme);
      }

      LayputPanel.prototype.handleReset = function(e){
        e.preventDefault();

        sessionStorage.removeItem('savedStyles');
        this.styleElem.innerHTML = '';

        this.resetColors();

        $('#layout').attr('checked', false);
        $html.removeClass('boxed');
        $window.trigger('resize');

        this.pageLayout = 'wide';

        $('#colorTheme').attr('checked', false);
        this.fillStyleElem(this.file);
        $window.trigger('resize');

        this.colorTheme = 'default';

        sessionStorage.clear();
      }

      LayputPanel.prototype.handleLayoutChange = function(e){
        $html.toggleClass('boxed');
        if (this.pageLayout === 'boxed'){
          this.pageLayout = 'wide';
        } else {
          this.pageLayout = 'boxed';
        }
        $window.trigger('resize');
        $window.trigger('layout.switch');
      }

      LayputPanel.prototype.handleDefaultContrastChange = function(e){
        this.resetColors();

        if (this.colorTheme === 'contrast'){
          this.fillStyleElem(this.file);
          this.colorTheme = 'default';
        } else {
          this.fillStyleElem(this.altStyleElem);
          this.colorTheme = 'contrast';
        }
      }

      /**
       * Init event handlers
       */
      LayputPanel.prototype.initEventHandlers = function(){
        this.elements.resetButton.click($.proxy(this.handleReset, this));
        this.elements.saveButton.click($.proxy(this.handleSave, this));
        this.elements.layout.change($.proxy(this.handleLayoutChange, this));
        this.elements.colorTheme.change($.proxy(this.handleDefaultContrastChange, this));
      }

      LayputPanel.prototype.init = function(){
        this.initEventHandlers();
        this.generateRows();
        this.checkLocalStorage();
      }
      

      return LayputPanel;
    })(window.jQuery, document, window);
    


    // Then initialize like below
    var layputPanelInstance = new LayputPanel();
  }
  

  /**
   * Convert hex color to rgb
   */
  function hexToRgb(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');

      if(c.length== 3){
        c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }

      c= '0x'+c.join('');
      return [(c>>16)&255, (c>>8)&255, c&255].join(', ');
    }
    throw new Error('Bad Hex');
  }

  /**
   * Bootstrap Date time picker
   */
  if (plugins.bootstrapDateTimePicker.length) {
    var i;
    for (i = 0; i < plugins.bootstrapDateTimePicker.length; i++) {
      var $dateTimePicker = $(plugins.bootstrapDateTimePicker[i]);
      var options = {};

      options['format'] = 'dddd DD MMMM YYYY - HH:mm';
      if ($dateTimePicker.attr("data-time-picker") == "date") {
        options['format'] = 'dddd DD MMMM YYYY';
        options['minDate'] = new Date();
      } else if ($dateTimePicker.attr("data-time-picker") == "time") {
        options['format'] = 'HH:mm';
      }

      options["time"] = ($dateTimePicker.attr("data-time-picker") != "date");
      options["date"] = ($dateTimePicker.attr("data-time-picker") != "time");
      options["shortTime"] = true;

      $dateTimePicker.bootstrapMaterialDatePicker(options);
    }
  }

  /**
   * Select2
   * @description Enables select2 plugin
   */
  if (plugins.selectFilter.length) {
    var i;
    for (i = 0; i < plugins.selectFilter.length; i++) {
      var select = $(plugins.selectFilter[i]);

      select.select2({
        placeholder: select.attr("data-placeholder") ? select.attr("data-placeholder") : false,
        minimumResultsForSearch: select.attr("data-minimum-results-search") ? select.attr("data-minimum-results-search") : 10,
        maximumSelectionSize: 3
      });
    }
  }
});

