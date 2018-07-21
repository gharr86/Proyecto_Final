var c = 0;

$(document).ready(function () {
    mostrarTodasCanciones();
    mostrarCancion(c);

    $('#meGustaBtn').click(function () {
        calificarCancion(1)
    });

    $('#noMeGustaBtn').click(function () {
        calificarCancion(-1)
    });

    $('#btnOrdenar').click(function () {
        ordenar();
    });
    
    $('#btnFiltrar').click(function () {
        filtrarPorAnio();
    });
});

function mostrarTodasCanciones() {
    var arrayCanciones = null;

    $.ajax({
        url: 'http://localhost:8080/obtenerTodos',
        type: 'GET',
        async: false,
        success: function (res) {
            arrayCanciones = JSON.parse(res);
        }
    });

    generarFilas(arrayCanciones);
}

function generarFilas(array) {
    for (i = 0; i < array.length; i++) {
        if (array[i].calificacion == undefined) {
            array[i].calificacion = 0;
        }

        $('#tablaCanciones').append(
            '<tr>' +
            '<td>' + array[i].Song + '</td>' +
            '<td>' + array[i].Year + '</td>' +
            '<td>' + array[i].Albun + '</td>' +
            '<td>' + array[i].calificacion + '</td>' +
            '</tr>'
        );
    }
}

function mostrarCancion(arrayCanciones) {
    var arrayCanciones = null;

    $.ajax({
        url: 'http://localhost:8080/obtenerTodos',
        type: 'GET',
        async: false,
        success: function (res) {
            arrayCanciones = JSON.parse(res);
        }
    });

    $('#cancion').append(
        '<h2 class="text-center" data-id="' + arrayCanciones[c].Id + '" id="tituloCancion">' + arrayCanciones[c].Song + '</h2>' +
        '<p class="text-center" id="autorCancion">' + arrayCanciones[c].Writters + '</p>' +
        '<img src="' + arrayCanciones[c].Img + '" class="w-100" alt="Portada" id="portadaAlbum">' +
        '<h3 class="text-center" id="tituloAlbum">' + arrayCanciones[c].Albun + '</h3>' +
        '<p class="text-center" id="productorAlbum">' + arrayCanciones[c].Producer + '</p>' +
        '<p class="text-center" id="anioAlbum">' + arrayCanciones[c].Year + '</p>'
    );
}

function calificarCancion(calificacion) {
    var _calificacion = calificacion;
    var _id = $('#tituloCancion').attr('data-id');
    var _data = { id: _id, calificacion: _calificacion };

    $.ajax({
        url: 'http://localhost:8080/enviarCalificacion',
        type: 'POST',
        data: _data,
        success: function (resp) {
            c++;
            $('#cancion').html('');
            mostrarCancion(c);
        }
    });
}

function filtrarPorAnio() {
    var anio = $('#inputAnio').val();
    var _data = { Year: anio };
    $.ajax({
        url: 'http://localhost:8080/obtenerPorAnio',
        type: 'POST',
        data: _data,
        success: function (resp) {
            $('#tablaCanciones').html('');
            generarFilas(resp);
        }
    });
}

function ordenar() {
    var arrayCanciones = null;

    $.ajax({
        url: 'http://localhost:8080/obtenerTodos',
        type: 'GET',
        async: false,
        success: function (res) {
            arrayCanciones = JSON.parse(res);
        }
    });

    var criterio = $('#inputGroupSelect01').val();

    if (criterio !== '') {
        if (criterio == '1') {
            arrayCanciones.sort(function (a, b) {
                var x = a.Song.toLowerCase();
                var y = b.Song.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });
        } else if (criterio == '2') {
            arrayCanciones.sort(function (a, b) {
                var x = a.Year.toLowerCase();
                var y = b.Year.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });
        } else if (criterio == '3') {
            arrayCanciones.sort(function (a, b) {
                var x = a.Albun.toLowerCase();
                var y = b.Albun.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });
        } else if (criterio == '4') {
            arrayCanciones.sort(function (a, b) {                
                a.calificacion = (a.calificacion == undefined)? 0: a.calificacion;
                b.calificacion = (b.calificacion == undefined)? 0: b.calificacion;
                var x = parseInt(a.calificacion);
                var y = parseInt(b.calificacion);
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });
        }

        $('#tablaCanciones').html('');
        generarFilas(arrayCanciones);
    }
}

