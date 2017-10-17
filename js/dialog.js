$( "#dialog1" ).dialog({ autoOpen: false });
$( "#dialog2" ).dialog({ autoOpen: false });
$( "#trigger1" ).click(function() {
    $( "#dialog1" ).dialog( "open" );
});
$( "#trigger2" ).click(function() {
    $( "#dialog2" ).dialog( "open" );
});
