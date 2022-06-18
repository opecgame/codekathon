(function ($) {
    "use strict"; $(window).on('load', function () {
        setTimeout(() => {
            if ($('#preloader').length) { $('#preloader').delay(300).fadeOut('slow', function () { $(this).remove(); }); }
        }, 1000)
    });
})(jQuery);