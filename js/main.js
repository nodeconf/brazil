$(window).load(function(){

    $('#Menu').onePageNav({
        currentClass: 'current',
        changeHash: false,
        scrollSpeed: 750,
        scrollThreshold: .5,
        filter: '',
        easing: 'swing',
        begin: function() {
            //I get fired when the animation is starting
        },
        end: function() {
            //I get fired when the animation is ending
        },
        scrollChange: function($currentListItem) {
            //I get fired when you enter a section and I pass the list item of the section
        }
    });

    $('.GalleryLocal__Phot').owlCarousel({
        loop: false,
        margin: 5,
        nav: false,
        responsive:{
            0:{
                items: 1
            },
            600:{
                items: 2
            },
            1000:{
                items: 3
            }
        }
    })


    $(window).scroll(function(){
        var TopLimit = $('.BoxNav').offset().top;

        if( $(window).scrollTop() > TopLimit ){
            $('.BoxNav__Align').addClass('fixed');
        }
        if( $(window).scrollTop() <= TopLimit ){
            $('.BoxNav__Align').removeClass('fixed');
        }
    });

    $('.fancybox').fancybox();

    $('#BtnMenu').click(function(){
        $(this).toggleClass('active');
        $('.BoxNav__Menu').toggleClass('active');
    });

    $('.BoxNav .BoxNav__Menu--List li a').click(function(){
        $('#BtnMenu').removeClass('active');
        $('.BoxNav__Menu').removeClass('active');
    });


});
