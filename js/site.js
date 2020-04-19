$(document).ready(function(){
    $('#name').slideDown(1500, function () {$('#title').slideDown(1500)} ).delay(1000);

    $('.card').mouseenter(function() {
        var overlay = $(this).children('div.card-img-overlay');
        $(overlay).fadeTo(1000, 0);
        console.log('test');
    });

    $('.card').mouseleave(function() {
        var overlay = $(this).children('div.card-img-overlay');
        $(overlay).fadeTo(1000, 1).delay(500);
    });

   
    
});

