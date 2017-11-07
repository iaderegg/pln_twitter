$( document ).ready(function() {
    
    $('#btn_send_tweet').on('click', function(){
        var tweet_msg = $('#textarea_tweet').val();
        $('#div_result').html(' ');
        $('#div_result').addClass('background_waiting');
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
                trans_tag(word_morfo[2]);
            }            

            $('#div_result').html(html);

            
        },
        error: function(data){
            console.log(data);
        }
      });
}

function trans_tag(tag){
    console.log(tag);
    var result = new Array();

    eagle_tags = {
        A : {
            1: {
                atributo: 'Categoria',
                A: 'Adjetivo'
            },
            2: {
                atributo: 'Tipo',
                Q: 'Calificativo',
                O: 'Ordinal'
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
                R: 'Adverbio'
            },
            2:{
                atributo: 'Tipo',
                G: 'General',
                N: 'Negativo'
            }
        },
        D:{
            1:{
                atributo: 'Categoria',
                D: 'Determinante'
            },
            2:{
                atributo: 'Tipo',
                D: 'Demostrativo',
                P: 'Posesivo',
                T: 'Interrogativo',
                E: 'Exclamativo',
                I: 'Indefinido',
                A: 'Artículo'
            },
            3:{
                atributo: 'Persona',
                1: 'Primera',
                2: 'Segunda',
                3: 'Tercera'
            },
            4:{
                atributo: 'Género',
                M: 'Masculino',
                F: 'Femenino',
                C: 'Común',
                N: 'Neutro'
            },
            5:{
                atributo: 'Número',
                S: 'Singular',
                P: 'Plural',
                N: 'Invariable'
            },
            6:{
                atributo: 'Poseedor',
                S: 'Singular',
                P: 'Plural'
            }
        },
        N:{
            1:{
                atributo: 'Categoria',
                N: 'Nombre'
            },
            2:{
                atributo: 'Tipo',
                C: 'Común',
                P: 'Propio'
            },
            3:{
                atributo: 'Género',
                M: 'Masculino',
                F: 'Femenino',
                C: 'Común'
            },
            4:{
                atributo: 'Número',
                S: 'Singular',
                P: 'Plural',
                N: 'Invariable'
            },
            5:{
                atributo: 'Clasificación semántica',
                SP: 'Persona',
                G0: 'Lugar',
                O0: 'Organización',
                V0: 'Otros'
            },
            7:{
                atributo: 'Grado',
                A: 'Aumentativo',
                D: 'Diminutivo'
            }
        },
        V:{
            1:{
                atributo: 'Categoria',
                V: 'Verbo'
            },
            2:{
                atributo: 'Tipo',
                M: 'Principal',
                A: 'Auxiliar',
                S: 'Semiauxiliar'
            },
            3:{
                atributo: 'Modo',
                I: 'Indicativo',
                S: 'Subjuntivo',
                M: 'Imperativo',
                N: 'Infinitivo',
                G: 'Gerundio',
                P: 'Participio'
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
                3: 'Tercera'
            },
            6:{
                atributo: 'Número',
                S: 'Singular',
                P: 'Plural'
            },
            7:{
                atributo: 'Género',
                M: 'Masculino',
                F: 'Femenino'
            }
        },
        P:{
            1:{
                atributo: 'Categoria',
                P: 'Pronombre'
            },
            2:{
                atributo: 'Tipo',
                P: 'Personal',
                D: 'Demostrativo',
                X: 'Posesivo',
                I: 'Indefinido',
                T: 'Interrogativo',
                R: 'Relativo',
                E: 'Exclamativo'
            },
            3:{
                atributo: 'Persona',
                1: 'Primera',
                2: 'Segunda',
                3: 'Tercera'
            },
            4:{
                atributo: 'Género',
                M: 'Masculino',
                F: 'Femenino',
                C: 'Común',
                N: 'Neutro'
            },
            5:{
                atributo: 'Número',
                S: 'Singular',
                P: 'Plural',
                N: 'Impersonal/Invariable'
            },
            6:{
                atributo: 'Caso',
                N: 'Nominativo',
                A: 'Acusativo',
                D: 'Dativo',
                O: 'Oblicuo'
            },
            7:{
                atributo: 'Poseedor',
                S: 'Singular',
                P: 'Plural'
            },
            8:{
                atributo: 'Politeness',
                P: 'Polite',
            }
        },
        C:{
            1:{
                atributo: 'Categoria',
                C: 'Conjunciones'
            },
            2:{
                atributo: 'Tipo',
                C: 'Coordinada',
                S: 'Subcoordinada'
            }
        },
        I:{
            1:{
                atributo: 'Categoria',
                C: 'Interjección'
            }
        },
        S:{
            1:{
                atributo: 'Categoria',
                P: 'Preposición'
            },
            2:{
                atributo: 'Tipo',
                P: 'Preposición'
            },
            3:{
                atributo: 'Forma',
                S: 'Simple',
                C: 'Contraída'
            },
            4:{
                atributo: 'Género',
                M: 'Masculino'
            },
            5:{
                atributo: 'Número',
                S: 'Singular'
            }
        },
        F:{
            1:{
                atributo: 'Categoria',
                F: 'Signo de puntuación'
            }
        },
        Z:{
            1:{
                atributo: 'Categoria',
                Z: 'Numerales'
            },
            2:{
                atributo: 'Tipo',
                d: 'Partitivo',
                p: 'Porcentaje',
                u: 'Unidad'
            }
        },
        W:{
            1:{
                atributo: 'Categoria',
                W: 'Fechas y horas'
            }
        },
    };

    for(var i=0; i<tag.length; i++) {
        attr = eagle_tags[tag.charAt(0)][i+1]['atributo'];
        result.push({attr: eagle_tags[tag.charAt(0)][i+1][tag.charAt(i)]});
        console.log(result);
    }

}

