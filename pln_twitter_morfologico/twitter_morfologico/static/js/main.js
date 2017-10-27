$( document ).ready(function() {
    
    $('#btn_send_tweet').on('click', function(){
        var tweet_msg = $('#textarea_tweet').val();
        send_tweet(tweet_msg);
    });

    $('#btn_clean').on('click', function(){
        $('#textarea_tweet').val(' ');
    });

});

function send_tweet(tweet_msg){
    console.log(tweet_msg);
}
