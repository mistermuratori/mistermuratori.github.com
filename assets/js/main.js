/*
    Overflow by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    var settings = {
        // Full screen header?
        fullScreenHeader: true,
        // Parallax background effect?
        parallax: true,
        // Parallax factor (lower = more intense, higher = less intense).
        parallaxFactor: 10
    };

    skel.breakpoints({
        wide: '(max-width: 1680px)',
        normal: '(max-width: 1080px)',
        narrow: '(max-width: 840px)',
        mobile: '(max-width: 736px)'
    });

    $(function() {
        var $window = $(window), $body = $('body');

        if (skel.vars.mobile) {
            settings.parallax = false;
            $body.addClass('is-scroll');
        }

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function() {
            $body.removeClass('is-loading');
        });

        // CSS polyfills (IE<9).
        if (skel.vars.IEVersion < 9) {
            $(':last-child').addClass('last-child');
        }

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on mobile.
        skel.on('+mobile -mobile', function() {
            $.prioritize('.important\\28 mobile\\29', skel.breakpoint('mobile').active);
        });

        // Scrolly links.
        $('.scrolly-middle').scrolly({
            speed: 200,
            anchor: 'middle'
        });

        $('.scrolly').scrolly({
            speed: 200,
            offset: function() { return (skel.breakpoint('mobile').active ? 70 : 190); }
        });

        // Full screen header.
        if (settings.fullScreenHeader) {
            var $header = $('#header');

            if ($header.length > 0) {
                var $header_header = $header.find('header');

                $window.on('resize.overflow_fsh', function() {

                    if (skel.breakpoint('mobile').active) {
                        $header.css('padding', '');
                    } else {
                        var p = Math.max(192, ($window.height() - $header_header.outerHeight()) / 2);
                        $header.css('padding', p + 'px 0 ' + p + 'px 0');
                    }
                }).trigger('resize.overflow_fsh');

                $window.load(function() {
                    $window.trigger('resize.overflow_fsh');
                });
            }
        }

        // Parallax background.
        // Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
        if (skel.vars.browser == 'ie' ||  skel.vars.mobile){
            settings.parallax = false;
        }

        if (settings.parallax) {
            var $dummy = $(), $bg;

            $window.on('scroll.overflow_parallax', function() {
                // Adjust background position.
                $bg.css('background-position', 'center ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
            }).on('resize.overflow_parallax', function() {

                // If we're in a situation where we need to temporarily disable parallax, do so.
                if (!skel.breakpoint('wide').active || skel.breakpoint('narrow').active) {
                    $body.css('background-position', '');
                    $bg = $dummy;
                }
                // Otherwise, continue as normal.
                 else {
                    $bg = $body;
                }

                // Trigger scroll handler.
                $window.triggerHandler('scroll.overflow_parallax');
            }).trigger('resize.overflow_parallax');
        }

        // Poptrox.
        $('.image').poptrox({
            useBodyOverflow: false,
            usePopupEasyClose: false,
            overlayColor: '#0a1919',
            overlayOpacity: (skel.vars.IEVersion < 9 ? 0 : 0.75),
            usePopupDefaultStyling: false,
            usePopupCaption: true,
            popupLoaderText: '',
            windowMargin: 10,
            usePopupNav: true
        });

        // slick slider
        $('.image').slick({
            arrows: false,
            dots: true
        });

        /* ORDER */

        var bikeCon = $(".bike-piece-price");
        var bikeNum = $(".bike-num");
        var bikeDis = $(".bike-dis");
        var bikePrices = [895, 845, 810, 785, 775];

        var frameCon = $(".frame-piece-price");
        var frameNum = $(".frame-num");
        var frameDis = $(".frame-dis");
        var framePrices = [595, 583, 576, 570, 564, 556, 551, 545, 538, 532, 526, 520, 513, 507, 500, 494, 488, 482, 475, 469];

        var sum = 0;
        var orderFormCon = $("#order-form-container");
        var orderTotal = $(".order-total");
        var cartAnchor = $(".cart");
        var orderFormVisible = false;

        function itemChanged () {
            // get current values
            var bikeCount = parseInt(bikeNum.val()) || 0;
            var frameCount = parseInt(frameNum.val()) || 0;

            var pricePerBike = bikePrices[bikeCount - 1] || bikePrices[0];
            var pricePerFrame = framePrices[frameCount - 1] || framePrices[0];

            // update the prices
            if (bikeCount === 0) {
                bikeCon.addClass("hide");
            } else {
                bikeCon.removeClass("hide");
            }
            bikeDis.html(pricePerBike);

            if (frameCount === 0) {
                frameCon.addClass("hide");
            } else {
                frameCon.removeClass("hide");
            }
            frameDis.html(pricePerFrame);


            // update the order form
            if (bikeCount > 0 || frameCount > 0) {
                orderFormCon.removeClass("hide");
                orderFormVisible = true;

                if (!isOnScreen(orderFormCon)) {
                    cartAnchor.removeClass("hide");
                }
            } else {
                orderFormCon.addClass("hide");
                orderFormVisible = false;
                cartAnchor.addClass("hide");
            }
            sum = bikeCount * pricePerBike + frameCount * pricePerFrame;
            orderTotal.html(sum);
        }

        bikeNum.on('input', itemChanged);
        frameNum.on('input', itemChanged);

        /* Cart Anchor hide/show */
        $(window).on('scroll', function (e) {
            if (!orderFormVisible) {
                return;
            }

            // check if the order form is in view
            if (isOnScreen(orderFormCon)) {
                cartAnchor.addClass('hide');
            } else {
                cartAnchor.removeClass('hide');
            }

        });

        function isOnScreen (element) {
            var win = $(window);
            var viewport = {
                top : win.scrollTop(),
                left : win.scrollLeft()
            };
            viewport.right = viewport.left + win.width();
            viewport.bottom = viewport.top + win.height();

            var bounds = orderFormCon.offset();
            bounds.right = bounds.left + orderFormCon.outerWidth();
            bounds.bottom = bounds.top + orderFormCon.outerHeight();

            return !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom);
        }

        /* Forms */
        var orderFormContent = $('#order-form-container .form-content');
        var orderFormResponse = $('#order-form-container .form-response');
        $('.order-form').on('submit', function (e) {
            e.preventDefault();

            var data = $(this).serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});

            // send email

            // show response
            orderFormContent.hide();
            orderFormResponse.fadeIn(200);

            // reset items
            $(this)[0].reset();
            setTimeout(function () {
                orderFormResponse.hide()
                orderFormContent.show();

                bikeNum.val(0);
                frameNum.val(0);
                itemChanged();
            }, 3000)
        });

        var contactFormContent = $('.contact-form-container .form-content');
        var contactFormResponse = $('.contact-form-container .form-response');
        $('.contact-form').on('submit', function (e) {
            e.preventDefault();

            var data = $(this).serializeArray().reduce(function(obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});

            // send email

            // show response
            contactFormContent.hide();
            contactFormResponse.fadeIn(200);

            // reset form
            $(this)[0].reset();
            setTimeout(function () {
                contactFormResponse.hide()
                contactFormContent.fadeIn(200);
            }, 3000)
        });
    });

})(jQuery);