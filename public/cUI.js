$(document).ready(function () {
    $('#title').css({
        "-webkit-transition": "all 0.25s ease -in",
        "-moz-transition": "all 0.25s ease -in",
        "transition": "all 0.25s ease -in",
        /** START THE FINAL STATE STYLING **/
        "background-position": "bottom right",
        "color": "#880E4F"
    });
    $("#subTitle").css({
        "color": "#9FA8DA",
        "font-size": "2rem",
        "transition": "all 0.5s ease-out",

    });
    $("#start").css({
        "color": "#fff",
        "font-size": "5rem",
        'background-color': 'rgba(197, 17, 98, 0.8)',
        'z-index': '2'
    });
    $("#start").mouseenter(function() {
        $("#start").css({"background-color": 'rgba(20, 240, 50, 0.9)', 'cursor': 'pointer', 'border-color': '#fff'});
    });
    $("#start").mouseleave(function() {
        $("#start").css({'background-color': 'rgba(197, 17, 98, 0.7)', 'border-color': 'rgba(200, 200, 200, 0.7)'})
    });
    $("#start").click(function () {
       $('#paramsForm').modal('show');
    });

    $('#run').click(function() {
        var data= {};
        $('input').each(function(i) {
            if (i===0) {
                data.directory= $(this).val();
            }
            else if (i===1) {
                // if ($(this).val().match("\\"))
                data.ids= $(this).val().slice($(this).val().lastIndexOf("\\") + 1);
            }
            else if (i===2) {
                console.log($(this).val().lastIndexOf("\\"));
                data.query = $(this).val().slice($(this).val().lastIndexOf("\\") + 1);
            }
            console.log(i);
            console.log($(this).val());
            if ($(this).val().length<1 && i !== 0) {
                alert("All fields are required");
                return;
            }
        });
        console.log(data);
        load();
        $.post('http://localhost:8080/run', {data: data}, function(data) {
            console.log(1);
            console.log(data);
            console.log(data.code);
            if (data.code == 4) {
                error(res.msg);
            }
            else if (data.code == 1) {
                success();
            }
    });
    });

    function load() {   
        $("#loading").modal('show');
    }
    function error(msg) {
        $("#lt").css({ "display": "none" });
        $("#loading").append("<p id='err'>An error ocurred: " + msg + "</p>");
        $("#lh").css({ "color": "#f00" });
    }
    function success(){
        $("#lt").css({ "display": "none" });
        $("#loading").append("<p id='success'>CORASON finished succesfully</p>");
        $("#lh").css({ "color": "#0f0" });
    }
});
