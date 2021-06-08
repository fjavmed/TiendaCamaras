
const carrito = []
const arrayItems = [];
var totalCarro = 0;

class Producto {
  constructor(sku, nombre, precio, precioName, url, specs) {
      this.sku = sku; // unico!!
      this.cantidad = 1;
      this.nombre = nombre;
      this.precio = precio;
      this.precioName = precioName;
      this.urlImagen = url;
      this.specs = specs;
  }

  mostrar() {
    if (this.precio > 1000000)
    {
      return `<div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100" style="background-color:gold">
            <a href="#"><img class="card-img-top" src="${this.urlImagen}" alt=""></a>
            <div class="card-body">
            <h4 class="card-title">
              <a href="#">${this.nombre}</a>
            </h4>
            <h5> $ ${this.precioName}</h5>
            <p class="card-text">${this.specs}</p>
            </div>
            <div class="card-footer">
            <small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9733;</small>
           <button id="addbutton${this.sku}">Agregar al carrito</button>
            </div>        
            </div>    
          </div>`;
    }
    else
    {
      return `<div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100">
            <a href="#"><img class="card-img-top" src="${this.urlImagen}" alt=""></a>
            <div class="card-body">
            <h4 class="card-title">
            <a href="#">${this.nombre}</a>
            </h4>
            <h5> $ ${this.precioName}</h5>
            <p class="card-text">${this.specs}</p>
            </div>
            <div class="card-footer">
            <small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9733;</small>
           <button id="addbutton${this.sku}">Agregar al carrito</button>
            </div>        
            </div>    
          </div>`;
      }
  }
}

/**
 * Productos que vamos a vender
 */
$('#cargarProductos').click(function() {

  cargarProductosTienda();

  $('html, body').animate({
    scrollTop: $("#productos").offset().top
  }, 500);

});

function cargarProductosTienda()
{
  // let acumuladorCardsHome = ``;
  $('#productos').html(''); //vaciar div

  $.getJSON("productos.json", function(data) {
    //recorre data para obtener cada producto
    $.each(data, function(i, producto) {
      let item = new Producto(producto.sku, producto.nombre, producto.precio, producto.precioName, producto.imagen, producto.descripcion);
      arrayItems.push(item);

      $('#productos').append(item.mostrar());
    });

    console.log('> Se cargaron los productos');

    return false;

  });

  // $('html, body').animate({
  //   scrollTop: $("#productos").offset().top
  // }, 500);
}

setInterval(cargarProductosTienda, 10000);  // carga productos cada X segundos

  // Selector
  const showCart = document.getElementById("muestraCarro");
  //const showCart =  $('muestraCarro');
 
  // crea elemento
  const textoCarrito = $('#muestraCarro > p');

    
function agregarAlCarrito(item)
{
  if (carrito.includes(item)) //si ya existe en el carrito
  {
    let itemActual = carrito[carrito.indexOf(item)];  //   se obtiene producto existente en el carrito
    itemActual.cantidad++;  //se aumenta cantidad en 1
 
    totalCarro += (itemActual.precio);  //suma precio al total del carro

    // esto es para refrescar los numeros en la tabla del carrito
    $('#fila'+item.sku+' td:nth-child(3)').html(itemActual.cantidad);
    $('#fila'+item.sku+' td:nth-child(5)').html('$'+ (itemActual.precio * itemActual.cantidad));
  }
  else  // artículo nuevo
  {
    carrito.push(item);

    let productoCarro = 
      '<tr id="fila'+item.sku+'">'+
        '<td>'+carrito.length+'</td>'+
        '<td>'+item.nombre+'</td>'+
        '<td>'+item.cantidad+'</td>'+
        '<td>$'+item.precio+'</td>'+
        '<td>$'+(item.precio*item.cantidad)+'</td>'+
        '<td><a id="borrar'+item.sku+'" href="#">Borrar</a></td>'+
      '</tr>';

    $('#filasCarro').append(productoCarro);

    totalCarro += (item.precio * item.cantidad);  //suma precio al total del carro
  }
  
  console.log(carrito);
  console.log(`Tienes ${carrito.length} productos en tu carrito`);
    
    if (carrito.length > 0)
      $('#emptyCart').hide();
    else
      $('#emptyCart').show();

  $('#totalCarro').html('<strong>TOTAL: $'+totalCarro+'</strong>');

      // se incorpora el elemento
    // if (carrito.length>0) {
    //     // showCart.appendChild(textoCarrito);
    
    //     textoCarrito.textContent = "Has seleccionado "+ carrito.length +" productos ";
    // }
}

$(document).ready(function(){
  // $("#addbutton").click(function(){
  //   $("#emptyCart").hide();
  // });
  
  $(document).on('click', '[id*=addbutton]', function(e) {
    let sku = e.currentTarget.id.replace('addbutton', '');  // e.currentTarget.id obtiene ID del button en DOM

    for (i=0; i<arrayItems.length; i++)
    {
      let item = arrayItems[i];
      if (item.sku == sku)
      {
        console.log(item);
        agregarAlCarrito(item);
        break;
      }
    }


  return false; //pa que no suba
  });

  $(document).on('click', '[id*=borrar]', function(e) {
    let sku = e.currentTarget.id.replace('borrar', '');
    let itemborrar;

    for (i=0; i<carrito.length; i++)
    {
      let item = carrito[i];
      if (item.sku == sku) //se busca el item que se está borrando
      {
        itemborrar = item;
        break;
      }
    }
    $('#fila'+sku).remove();  // borra fila de tabla html
    carrito.splice(carrito.indexOf(itemborrar));  //borrar item del array carrito

    if (carrito.length > 0)
$('#emptyCart').hide();
else
$('#emptyCart').show();

  totalCarro -= (itemborrar.precio*itemborrar.cantidad);
  $('#totalCarro').html('<strong>TOTAL: $'+totalCarro+'</strong>');

  itemborrar.cantidad = 1;  // se resetea cantidad del que se borra (para que empiecen en 1)

    return false; // pa que no suba
  });
});

$(document).ready(function(){
  // $("#hide").click(function(){
  //   $( "#muestraCarro" ).fadeOut( "slow", function() {
  //         });  
  // });
  // $("#show").click(function(){
  //   $("#muestraCarro").show();
  //   $("#muestraCarro").css("color", "red").slideUp(1000).slideDown(1000);    
  // });

  $('#verCarrito').click(function() {
    if ($(this).html() == 'Ocultar Carrito') // está visible, hay que esconderlo
    {
      $( "#muestraCarro" ).fadeOut( "slow");
      $(this).html('Mostrar Carrito');
    }
    else  // está oculto, hay que mostrarlo
    {
        $( "#muestraCarro" ).show();
      // $("#muestraCarro").css("color", "red").slideUp(1000).slideDown(1000);    
      $(this).html('Ocultar Carrito');
    }
  });
});

