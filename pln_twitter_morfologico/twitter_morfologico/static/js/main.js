$( document ).ready(function() {
    
    $('#btn_send_tweet').on('click', function(){
        var tweet_msg = $('#textarea_tweet').val();
        $('#div_result').html(' ');
        $('#div_result').html('<img src=\'../images/cargando.gif\'/>');
        send_tweet(tweet_msg);
    });

    $('#btn_clean').on('click', function(){
        $('#textarea_tweet').val(' ');
        $('#div_result').html(' ');
    });

});

function send_tweet(tweet_msg){
    
    var token = $("input[name=csrfmiddlewaretoken]").val()

    $.ajax({
        url: 'tweet_processing/',
        type: 'POST',
        data: {
          'tweet_msg': tweet_msg,
          'csrfmiddlewaretoken': token
        },
        dataType: 'json',
        success: function (data) {
            
            console.log(data);
            var html = "";
            
            for(i = 0; i < data.result_morfo.length; i++){
                
                word_morfo = data.result_morfo[i].split(" ")

                html += '<div class=\'col-sm-3\'>';
                html += '<table class=\'table table-striped table-bordered\'>';
                html += '<thead>';
                html += '<tr>';
                html += '<th class=\'col-sm-6\'>Palabra</th>';
                html += '<th class=\'col-sm-6\'>'+word_morfo[0]+'</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';

                for(j = 1; j < word_morfo.length; j++){
                    html += '<tr>';
                    html += '<th class=\'col-sm-6\'></th>';
                    html += '<th class=\'col-sm-6\'>'+word_morfo[j]+'</th>';
                    html += '</tr>';
                }                    

                html += '</tbody>';
                html += '</table>';
                html += '</div>';
            }            

            $('#div_result').html(html);
        },
        error: function(data){
            console.log(data);
        }
      });
}

