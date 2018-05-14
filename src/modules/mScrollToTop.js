(function() {
  'use strict';
angular.module('mScrollToTop', [])
        .directive('scrollToTop', function () {

            /**
             *  This directive wraps jQuery code in an Angular application
             *  make sure you add the appropriate dependencies.
             *  Also don't forget to include in your project "angular.module('myApp', ["scrollToTop"]);"
             *  
             *  This directive is based on tutorial
             *  source: http://www.webtipblog.com/adding-scroll-top-button-website/
             *  
             * @type directive
             */

            var directive = {
                scope: {},
                restrict: 'AE',
                template: "<div class=\"scroll-top-wrapper \">\n\
                                <span class=\"scroll-top-inner\">\n\
                                    <i class=\"fa fa-2x fa-arrow-circle-up\"></i>\n\
                                </span>\n\
                           </div>",
                link: function () {

                    // hide or show button according to offset of window to page
                    $(function () {
                        $(document).on('scroll', function () {
                            if ($(window).scrollTop() > 100) {
                                $('.scroll-top-wrapper').addClass('show');
                            } else {
                                $('.scroll-top-wrapper').removeClass('show');
                            }
                        });
                    });

                    // handle click event
                    $(function () {
                        $(document).on('scroll', function () {
                            if ($(window).scrollTop() > 100) {
                                $('.scroll-top-wrapper').addClass('show');
                            } else {
                                $('.scroll-top-wrapper').removeClass('show');
                            }
                        });
                        $('.scroll-top-wrapper').on('click', scrollToTop);
                    });

                    function scrollToTop() {
                        verticalOffset = typeof (verticalOffset) !== 'undefined' ? verticalOffset : 0;
                        element = $('body');
                        offset = element.offset();
                        offsetTop = offset.top;
                        $('html, body').animate({scrollTop: offsetTop}, 500, 'linear');
                    }

                }
            };

            return directive;
        });

        }());