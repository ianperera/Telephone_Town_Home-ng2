/**
 * Created by thipaporn on 10/21/16.
 */
// Toggle Function
$('.toggle').click(function () {
    // Switches the Icon
    $(this).children('i').toggleClass('fa-pencil');
    // Switches the forms
    $('.form').animate({
        height: "toggle",
        'padding-top': 'toggle',
        'padding-bottom': 'toggle',
        opacity: "toggle"
    }, "slow");
});
