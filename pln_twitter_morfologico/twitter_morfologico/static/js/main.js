$( document ).ready(function() {
    
    $('#btn_send_tweet').on('click', function(){
        var tweet_msg = $('#textarea_tweet').val();
        $('#div_result').html(' ');
        $('#div_result').addClass('background_waiting');
        result_tknzr = tokenize_tweet(tweet_msg);
        
    });

    $('#btn_clean').on('click', function(){
        $('#textarea_tweet').val(' ');
        $('#textarea_result_tknzr').val(' ');
        $('#textarea_result_steps_freeling').html(' ');
        $('#div_result_explain').html(' ');
    });

});

function tokenize_tweet(tweet_msg){

    var token = $("input[name=csrfmiddlewaretoken]").val()
    var result_tknzr = new Array();

    $.ajax({
        url: 'tweet_tokenizer/',
        type: 'POST',
        data: {
        'tweet_msg': tweet_msg,
        'csrfmiddlewaretoken': token
        },
        dataType: 'json',
        success: function (data) {
            var html = '{';            
            for(var i = 0; i < data.result_tknzr.length; i++){
                html += data.result_tknzr[i]
                if(i != data.result_tknzr.length - 1){
                    html += ', '    
                }
            }
            html += '}';

            $('#textarea_result_tknzr').val(html)

            result_tknzr = data.result_tknzr

        },
        async: false,
        error: function(data){
            console.log(data);
        }
    }).then(function(){
        console.log(result_tknzr)
        processing_tweet(result_tknzr)
    })


}

function processing_tweet(result_tknzr){
    
    var token = $("input[name=csrfmiddlewaretoken]").val()

    var promises = new Array()
    var result_morfo = new Array()

    //$('#textarea_result_steps_freeling').val(' ')

    var promise = new Promise(function(resolve, reject){

        for(var j = 0; j < result_tknzr.length; j++){

            if(result_tknzr[j].charAt(0) == '#'){

                print_text('Hashtag: '+result_tknzr[j]+'\n')

            }else{
                $.ajax({
                    url: 'word_processing/',
                    type: 'POST',
                    data:{
                        'word': result_tknzr[j],
                        'csrfmiddlewaretoken': token
                    },
                    dataType: 'json',
                    success: function(result){
                        print_text(result.word_analysis)
                        result_morfo.push(result.word_analysis)
                    },
                    async: false
                })
            }      
        }
        resolve(result_morfo)
    }).then(console.log('Exec promise'))

    
    //el for debe ser una promesa 
    explain_morfo_analysis(result_morfo)
}


function explain_morfo_analysis(result_morfo){

    var html = "";
    
    var array_morfo_structure = new Array("Lema", "Tag", "Probabilidad");
    
    for(i = 0; i < result_morfo.length; i++){
        
        word_morfo = result_morfo[i].split(" ")
        
        var tag_translate = trans_tag(word_morfo[2]);

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
            html += '<th class=\'col-sm-6\'>'+array_morfo_structure[j-1]+'</th>';
            html += '<th class=\'col-sm-6\'>'+word_morfo[j]+'</th>';
            html += '</tr>';
        }
        
        for(k = 0; k < tag_translate.length; k++){
            html += '<tr>';
            html += '<th class=\'col-sm-6\'>'+tag_translate[k].attr+'</th>';
            html += '<th class=\'col-sm-6\'>'+tag_translate[k].value+'</th>';
            html += '</tr>';

        }

        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        
        console.log(word_morfo[2])
        
    }            

    $('#div_result_explain').html(html);
    

}

function print_text(text){
    $('#textarea_result_steps_freeling').append(text)
}

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

            var array_morfo_structure = new Array("Lema", "Tag", "Probabilidad");
            
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
                    html += '<th class=\'col-sm-6\'>'+array_morfo_structure[j-1]+'</th>';
                    html += '<th class=\'col-sm-6\'>'+word_morfo[j]+'</th>';
                    html += '</tr>';
                }                    

                html += '</tbody>';
                html += '</table>';
                html += '</div>';
                
                console.log(word_morfo[2])
                
            }            

            $('#div_result').html(html);

            
        },
        error: function(data){
            console.log(data);
        }
      });
}

function trans_tag(tag){
    
    var result = new Array();

    eagle_tags = {
        A : {
            1: {
                atributo: 'Categoria',
                A: 'Adjetivo',
                0: '-'
            },
            2: {
                atributo: 'Tipo',
                Q: 'Calificativo',
                O: 'Ordinal',
                0: '-'
            },
            3: {
                atributo: 'Grado',
                A: 'Aumentativo',
                D: 'Diminutivo',
                C: 'Comparativo',
                S: 'Superlativo',
                0: '-'
            },
            4:{
                atributo: 'Género',
                M: 'Masculino',
                F: 'Femenino',
                C: 'Común',
                0: '-'
            },
            5:{
                atributo: 'Número',
                S: 'Singular',
                P: 'Plural',
                N: 'Invariable',
                0: '-'
            },
            6:{
                atributo: 'Función',
                0: '-',
                P: 'Participi'

            }
        },
        R:{
            1:{
                atributo: 'Categoria',
                R: 'Adverbio',
                0: '-'
            },
            2:{
                atributo: 'Tipo',
                G: 'General',
                N: 'Negativo',
                0: '-'
            }
        },
        D:{
            1:{
                atributo: 'Categoria',
                D: 'Determinante',
                0: '-'
            },
            2:{
                atributo: 'Tipo',
                D: 'Demostrativo',
                P: 'Posesivo',
                T: 'Interrogativo',
                E: 'Exclamativo',
                I: 'Indefinido',
                A: 'Artículo',
                0: '-'
            },
            3:{
                atributo: 'Persona',
                1: 'Primera',
                2: 'Segunda',
                3: 'Tercera',
                0: '-'
            },
            4:{
                atributo: 'Género',
                M: 'Masculino',
                F: 'Femenino',
                C: 'Común',
                N: 'Neutro',
                0: '-'
            },
            5:{
                atributo: 'Número',
                S: 'Singular',
                P: 'Plural',
                N: 'Invariable',
                0: '-'
            },
            6:{
                atributo: 'Poseedor',
                S: 'Singular',
                P: 'Plural',
                0: '-'
            }
        },
        N:{
            1:{
                atributo: 'Categoria',
                N: 'Nombre',
                0: '-'
            },
            2:{
                atributo: 'Tipo',
                C: 'Común',
                P: 'Propio',
                0: '-'
            },
            3:{
                atributo: 'Género',
                M: 'Masculino',
                F: 'Femenino',
                C: 'Común',
                0: '-'
            },
            4:{
                atributo: 'Número',
                S: 'Singular',
                P: 'Plural',
                N: 'Invariable',
                0: '-'
            },
            5:{
                atributo: 'Clasificación semántica',
                SP: 'Persona',
                G0: 'Lugar',
                O0: 'Organización',
                V0: 'Otros',
                00: '-'
            },
            7:{
                atributo: 'Grado',
                A: 'Aumentativo',
                D: 'Diminutivo',
                0: '-'
            }
        },
        V:{
            1:{
                atributo: 'Categoria',
                V: 'Verbo',
                0: '-'
            },
            2:{
                atributo: 'Tipo',
                M: 'Principal',
                A: 'Auxiliar',
                S: 'Semiauxiliar',
                0: '-'
            },
            3:{
                atributo: 'Modo',
                I: 'Indicativo',
                S: 'Subjuntivo',
                M: 'Imperativo',
                N: 'Infinitivo',
                G: 'Gerundio',
                P: 'Participio',
                0: '-'
            },
            4:{
                atributo: 'Tiempo',
                P: 'Presente',
                I: 'Imperfecto',
                F: 'Futuro',
                S: 'Pasado',
                C: 'Condicional',
                0: '-'
            },
            5:{
                atributo: 'Persona',
                1: 'Primera',
                2: 'Segunda',
                3: 'Tercera',
                0: '-'
            },
            6:{
                atributo: 'Número',
                S: 'Singular',
                P: 'Plural',
                0: '-'
            },
            7:{
                atributo: 'Género',
                M: 'Masculino',
                F: 'Femenino',
                0: '-'
            }
        },
        P:{
            1:{
                atributo: 'Categoria',
                P: 'Pronombre',
                0: '-'
            },
            2:{
                atributo: 'Tipo',
                P: 'Personal',
                D: 'Demostrativo',
                X: 'Posesivo',
                I: 'Indefinido',
                T: 'Interrogativo',
                R: 'Relativo',
                E: 'Exclamativo',
                0: '-'
            },
            3:{
                atributo: 'Persona',
                1: 'Primera',
                2: 'Segunda',
                3: 'Tercera',
                0: '-'
            },
            4:{
                atributo: 'Género',
                M: 'Masculino',
                F: 'Femenino',
                C: 'Común',
                N: 'Neutro',
                0: '-'
            },
            5:{
                atributo: 'Número',
                S: 'Singular',
                P: 'Plural',
                N: 'Impersonal/Invariable',
                0: '-'
            },
            6:{
                atributo: 'Caso',
                N: 'Nominativo',
                A: 'Acusativo',
                D: 'Dativo',
                O: 'Oblicuo',
                0: '-'
            },
            7:{
                atributo: 'Poseedor',
                S: 'Singular',
                P: 'Plural',
                0: '-'
            },
            8:{
                atributo: 'Politeness',
                P: 'Polite',
                0: '-'
            }
        },
        C:{
            1:{
                atributo: 'Categoria',
                C: 'Conjunciones',
                0: '-'
            },
            2:{
                atributo: 'Tipo',
                C: 'Coordinada',
                S: 'Subcoordinada',
                0: '-'
            }
        },
        I:{
            1:{
                atributo: 'Categoria',
                I: 'Interjección',
            }
        },
        S:{
            1:{
                atributo: 'Categoria',
                S: 'Preposición',
                0: '-'
            },
            2:{
                atributo: 'Tipo',
                P: 'Preposición',
                0: '-'
            },
            3:{
                atributo: 'Forma',
                S: 'Simple',
                C: 'Contraída',
                0: '-'
            },
            4:{
                atributo: 'Género',
                M: 'Masculino',
                0: '-'
            },
            5:{
                atributo: 'Número',
                S: 'Singular',
                0: '-'
            }
        },
        F:{
            1:{
                atributo: 'Categoria',
                F: 'Signo de puntuación',
                0: '-'
            }
        },
        Z:{
            1:{
                atributo: 'Categoria',
                Z: 'Numerales',
                0: '-'
            },
            2:{
                atributo: 'Tipo',
                d: 'Partitivo',
                p: 'Porcentaje',
                u: 'Unidad',
                0: '-'
            }
        },
        W:{
            1:{
                atributo: 'Categoria',
                W: 'Fechas y horas',
                0: '-'
            }
        },
    };

    if(tag.charAt(0) == 'N'){
        for(var i=0; i<tag.length; i++) {
            console.log(tag.charAt(i))
            if(i==4){
                console.log(tag.charAt(i)+tag.charAt(i+1))
                var attr = eagle_tags[tag.charAt(0)][i+1]['atributo']
                result.push({ attr: attr, value: eagle_tags[tag.charAt(0)][i+1][''+tag.charAt(i)+tag.charAt(i+1)]})
            }else if(i==5){
                            
            }else{
                var attr = eagle_tags[tag.charAt(0)][i+1]['atributo']
                result.push({ attr: attr, value: eagle_tags[tag.charAt(0)][i+1][tag.charAt(i)]})
            }
        }
    }else{
        for(var i=0; i<tag.length; i++) {
            
            var attr = eagle_tags[tag.charAt(0)][i+1]['atributo']
            result.push({ attr: attr , value: eagle_tags[tag.charAt(0)][i+1][tag.charAt(i)]})
        
        }
    }

    
    console.log(result)
    return result

}

