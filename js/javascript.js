'use strict'

$(document).ready(function() {
    $('#btn-getmovies').click(function(){

        let movies = [];

        var section_movie = $("#movie-list");
        $( "#effect" ).hide( "highlight", 1000 );

        section_movie.html('');

        //Llamada a servicio para obtener datos, imprimirlos y subirlos
        $.ajax({
            type: "GET",
            url: "https://prod-61.westus.logic.azure.com/workflows/984d35048e064b61a0bf18ded384b6cf/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6ZWKl4A16kST4vmDiWuEc94XI5CckbUH5gWqG-0gkAw",
            dataType: "json",
            success: function (data) {

                data.response.forEach((element, index) => {
                    movies.push([element.title, element.metascore, element.year, element.director, element.rating]);
                });

                movies = orderBy(movies, 4);

                movies.forEach((movie, index) => {
                    $("#movie-list").append("<li class='list-movie'><h3>"+ movie[0] +"</h3>"+
                                                    "<ul><li>"+ movie[3] +"</li>"+
                                                    "<li>"+ movie[2] +"</li>"+
                                                    "<li>"+ movie[4] +"</li>"+
                                                    "<li>"+ movie[1] +"</li></ul>"+
                                                "</li>");
                });

                submitMovies(movies);
            }
        });

        //Función para ordenar array de mayor a menor, según la columna que se elija (position)
        function orderBy(newmovies, position){

            function orderByScore(a, b) {
                if (a[position] === b[position]) {
                    return 0;
                }
                else {
                    return (a[position] < b[position]) ? 1 : -1;
                }
            }
    
            newmovies.sort(orderByScore);

            return newmovies;
        }

        //Función para enviar datos a través de Ajax y Post a servicio dado por el cliente.
        function submitMovies(movies){
            var movies_push = [];
            var movies_json = {};

            movies = orderBy(movies, 1);

            let movies_title = [];

            movies.forEach((movie, index) => {
                movies_title.push(movie[0]);
            });

            movies_push.push({
                "RUT": "19959957-7",
                "Peliculas": movies_title
            });

            movies_json = movies_push;
            console.log(JSON.stringify(movies_json));

            $.ajax({
                type: "POST",
                url: "https://prod-62.westus.logic.azure.com/workflows/779069c026094a32bb8a18428b086b2c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=o_zIF50Dd_EpozYSPSZ6cWB5BRQc3iERfgS0m-4gXUo",
                data: JSON.stringify(movies_json), 
                dataType:"json",
                error: function(){
                    Swal.fire(
                        'Error!',
                        'Fallo en subir las peliculas',
                        'error'
                    );
                },
                success: function(data){
                    Swal.fire(
                        'Listo!',
                        'Peliculas subidas!',
                        'success'
                    );
                }
            });
        }

    });
});