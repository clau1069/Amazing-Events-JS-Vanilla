//VARIABLES
const urlPrincipal= "https://amazing-events.herokuapp.com/api/events"
let divcartas= document.getElementById("cartas") 
var arrayCategorias=""
var cartasHTML =""
var categoriasSeleccionadas=""
let formulario =document.forms[0]
const formularioSearch= document.forms[1];
let id= location.search
idsearch =location.search.split("?id=").join(""); 
let main= document.getElementById('buscador-cards')
let divCartas= document.createElement('div.cartas')
const moneda = new Intl.NumberFormat(`en-US`,{
    style:`currency`,
    currency: `USD`, 
    minimumFractionDigits: 2
});


//LEER TITULO Y EJECUTAR





getData(urlPrincipal)

function getData(url){
    fetch(url).then(respuesta => respuesta.json()).then(data =>{
        eventos = data.events
        fechaBase= data.currentDate
        let eventosFuturos=eventos.filter((evento) => (new Date(evento.date).getTime() > new Date(fechaBase).getTime()));
        let eventosPasados=eventos.filter((evento) => (new Date(evento.date).getTime() < new Date(fechaBase).getTime()));  
        if(document.title=="Amazing Events"){
            iniciarIndex(eventos)
        }else if(document.title=="Details"){
            iniciarDetails(eventos)
        }
        else if(document.title==="Upcoming Events"){
            console.log(data)
            
            iniciarUpcomingPast(eventosFuturos)
        }
        else if(document.title==="Past Events"){
           
            iniciarUpcomingPast(eventosPasados)
        }
        else if(document.title==="Stats"){
            iniciarStats(eventos, eventosFuturos, eventosPasados)
        }
        
})}



//FUNCIONES DE INICIO
function iniciarIndex(data){
arrayCategorias= crearArrayDeCategorias(data)
crearCheckbox (arrayCategorias)
pintarAlIniciar (data,arrayCategorias)
escucharCheckbox(data,arrayCategorias)

}
function iniciarDetails(data){
    let carta= data.filter((evento)=> evento._id==idsearch)[0]
    let estructuraCarta=`
    <div
              class=" d-flex justify-content-center align-items-center"
            >
              <div class="me-4"><img class="rounded-0 " src="${carta.image}"></img></div>
            </div>
            <div class="">
            <h6 class="mt-4 text-white">${carta.name}</h6>
                <p class=" text-white">${carta.description}</p>
                <p class="text-white">Date: ${carta.date}</p>
                <p class="text-white">Place: ${carta.place}</p>
                <p class=" text-white">Price: $${carta.price} </p>
                <a href="index.html" class="btn bg-gray p-0 text-fucsia px-1 rounded-0">Go to Home</a>
            </div>

    `;
    document.getElementById("contenedor").innerHTML= estructuraCarta;
}
function iniciarUpcomingPast(data){
    pintarCards(data,"cartas")

    arrayCategorias= crearArrayDeCategorias(data)
    crearCheckbox (arrayCategorias)

    pintarAlIniciar (data,arrayCategorias)
    datosFiltrados=escucharCheckbox(data,arrayCategorias)
    escucharSearch(datosFiltrados)

}
function iniciarStats(datos, datosFuturos, datosPasados){
    console.log(datos)
    console.log(datosFuturos)
    console.log(datosPasados)
    rellenarStatistics(datos,datosPasados)
    rellenarUpcomPast(datosFuturos, "upcomingTable")
    rellenarUpcomPast(datosPasados, "pastTable")
}

function rellenarUpcomPast(arrayEfuturos, idlugar){

    let arrayParaPintarEnStats=[]



    let arrayDeCategorias=crearArrayDeCategorias(arrayEfuturos)
    arrayDeCategorias.shift()
    console.log(arrayDeCategorias)
    /* let arrayGanancias=rellenarRevenuesUpcoming(arraycategorias, datosFuturos) */

    
    arrayDeCategorias.forEach((categoria)=>{
        let objeto={}
        objeto.category=categoria
        arrayParaPintarEnStats.push(objeto)
    })
    arrayParaPintarEnStats.pop()
    console.log(arrayDeCategorias)
    /* arrayParaPintarEnStats[0].algo=5 */
    
    for(i=0;i<arrayParaPintarEnStats.length;i++){
        arrayParaPintarEnStats[i].ingresos=0
    }

    //crear array de ganacias
    //por cada categoria, tengo que sumar las ganacias de cada evento
    
    for (i=0;i<arrayDeCategorias.length-1;i++){
        let gananciaDelEvento=0
        for(j=0;j<arrayEfuturos.length;j++){
            
            if (arrayEfuturos[j].category== arrayDeCategorias[i] && arrayEfuturos.length<25){
                gananciaDelEvento+=arrayEfuturos[j].price*arrayEfuturos[j].estimate
                arrayParaPintarEnStats[i].ingresos=moneda.format(gananciaDelEvento)
            } else if(arrayEfuturos[j].category== arrayDeCategorias[i] && arrayEfuturos.length>25){
                gananciaDelEvento+=arrayEfuturos[j].price*arrayEfuturos[j].assistance
                arrayParaPintarEnStats[i].ingresos=moneda.format(gananciaDelEvento)
            }
        }   
    }


    //crear array de porcentaje de asistencia
    for (i=0;i<arrayDeCategorias.length-1;i++){
        let PorcentajeAsistencia=0
        let totalEstimado=0
        let totalSumaCapacidad=0
        for(j=0;j<arrayEfuturos.length;j++){
            
            if (arrayEfuturos[j].category== arrayDeCategorias[i] && arrayEfuturos.length<25){
                totalEstimado+=arrayEfuturos[j].estimate
                totalSumaCapacidad+=arrayEfuturos[j].capacity
            } else if(arrayEfuturos[j].category== arrayDeCategorias[i] && arrayEfuturos.length>25){
                totalEstimado+=arrayEfuturos[j].assistance
                totalSumaCapacidad+=arrayEfuturos[j].capacity
            }
        }
        PorcentajeAsistencia=totalEstimado*100/totalSumaCapacidad
        arrayParaPintarEnStats[i].porcentAsist=Math.round(PorcentajeAsistencia)+"%"
    }
    console.log(arrayParaPintarEnStats)
    pintarUpcomingEnTabla(arrayParaPintarEnStats, idlugar)

}

function pintarUpcomingEnTabla(array, id){
    lugarApintar=document.getElementById(id)
    array.forEach((categoria)=>{
        lugarApintar.innerHTML+=`
        <tr>
        <td class="border-table">${categoria.category}</td>
        <td class="border-table">${categoria.ingresos}</td>
        <td class="border-table">${categoria.porcentAsist}</td>
        </tr>
        `
        
    })
}












//DEMÁS FUNCIONES
function pintarCards(arrayDatos,id){
    let divCartas= document.getElementById(id)
    divCartas.innerHTML="";
    arrayDatos.forEach(evento=>
        divCartas.innerHTML+=
        `
        <div class="card bg-fucsia text-white border-0 rounded-0 me-4 mb-4">
                <img class="rounded-0 card-img" src="${evento.image}"></img>
                <div class="px-2 pt-1 d-flex flex-column justify-content-between wid-60">
                        <h6 class="mt-4">${evento.name}</h6>
                        <p class="text-desc">${evento.description}</p>
                        <p class="text-desc">Price: $${evento.price} </p>
                        <a href="details.html?id=${evento._id}" class="btn bg-gray p-0 text-fucsia px-1 rounded-0">ver más</a></div>
        </div>
        `
        )

}
//CHECKBOX
function crearArrayDeCategorias(datos){
    let arrayCategorias=["Show All"];
    datos.map (evento =>{
    arrayCategorias.push(evento.category)
});
//quito las categorias repetidas
var categoriasUnicas= arrayCategorias.filter ((elemento, posicion, array)=>{return posicion === array.indexOf(elemento)});
    return categoriasUnicas
    
}
function crearCheckbox (categorias){
    let divCategorias = document.getElementById("categorias")
    
    categorias.forEach(categoria =>{
    divCategorias.innerHTML += `<label class="mb-3 me-2" id="idlabel">
              <input type="checkbox" name="categoria" value="" />
              ${categoria}
            </label>`
})}
function pintarAlIniciar (datos, categorias){
    for (i=0; i<categorias.length;i++){
            
        if(formulario[i].checked== false){
            pintarCards(datos,"cartas")
            escucharSearch(datos)
        }    
    }
    
    }
function escucharCheckbox(datos, catExistEnData){
    formulario.addEventListener('change',()=>{
        var categoriasSeleccionadas= creaArrayCatSeleccionadas(catExistEnData)
        let datafiltrada= filtrarData(datos, categoriasSeleccionadas)
        /* desabilitarChecked(categoriasSeleccionadas) */
        pintarCards(datafiltrada,"cartas")
        console.log([datafiltrada])
        escucharSearch(datafiltrada)
        return datafiltrada
    })
}
function creaArrayCatSeleccionadas(categoriasEnData){

    
    //crea un array con los nombres de las categorias de los checkbox seleccionados
    categoriasSelecc=[];
   
    for (i=0; i<categoriasEnData.length;i++){
        
        if(formulario[i].checked== true){
            objeto=categoriasEnData[i];
            categoriasSelecc.push(objeto);
        }    
    }
    //si el array incluye "Show All", el array queda vacío
    if (categoriasSelecc.includes("Show All")){
        categoriasSelecc="";
    }
    return categoriasSelecc
}
function filtrarData (arrayDatos, categoriasSeleccionadas){

    
    //filtra los datos según las categorias seleccionadas
    let filtroPorCategoria="";
    if (categoriasSeleccionadas.length===0){
        filtroPorCategoria=arrayDatos
    }else if(categoriasSeleccionadas.length>0){
        filtroPorCategoria= arrayDatos.filter( (evento) => categoriasSeleccionadas.includes(evento.category))
    }
    return filtroPorCategoria
    
}
/* function desabilitarChecked(categoriasSeleccionadas){
    for(i=1;i<formulario.length;i++){
        if(formulario[0].checked== false){
            if (formulario[0].checked== true){
                for(i=1;i<formulario.length;i++){
                    formulario[i].checked= false;
                }
            }
        }
    }
    
    formulario[0].checked= "";
} */
//SEARCH
function escucharSearch(datos){
    console.log(datos);
    formularioSearch.addEventListener(('submit'), (evento) =>{
        evento.preventDefault()
    

        let datafiltradaNames= comparar(datos)
        console.log(datafiltradaNames)
        if (datafiltradaNames==""){
            mensajeSinResultados("cartas")
        } else{
            pintarCards(datafiltradaNames,"cartas")
        }
        
        
    })
}

function comparar (arrayDatos){
    let nuevoarray="";
    if(formularioSearch[0].value.length===0){
        nuevoarray=arrayDatos

    } else if (formularioSearch[0].value.length>0){
        nuevoarray=arrayDatos.filter((evento)=>evento.name.toLowerCase().includes(formularioSearch[0].value.trim().toLowerCase()))
    }
    return nuevoarray    
}
function mensajeSinResultados(id){
    let divCartas= document.getElementById(id)
    divCartas.innerHTML=`<p class="text-white">No se encontraron resultados</p>`;
}











//FUNCIONES DE STATS
function rellenarStatistics(data, ePasados){
    //al array de datos pasados le agrego el porcentaje de asistencia
    let arrayPasadosConPorcentaje=agregarPorcentajeAData(ePasados)
    /* console.log(arrayPasadosConPorcentaje) */
    rellenarHighPercent(arrayPasadosConPorcentaje, "EventStatistics")
    rellenarLowlestPercent(arrayPasadosConPorcentaje, "EventStatistics")
    rellenarLargerCapacity(data, "EventStatistics")

}
function agregarPorcentajeAData(data){
    for(i=0;i<data.length;i++){
        porcentaje=Math.round((data[i].assistance*100)/data[i].capacity)
        data[i].porcentageAsist= porcentaje
    }
    return data
    }
function rellenarHighPercent(array, id){
    //traer el elemento no mayor porcentaje de asistencia
    let eventoConMayorPorcentajeAsist=array.sort((a,b)=>b.porcentageAsist-a.porcentageAsist)[0]
    /* console.log(eventoConMayorPorcentajeAsist) */
    //pintarlo en la tabla
    let lugar=document.getElementById(id)
        lugar.innerHTML+=` 
            <td class="border-table">${eventoConMayorPorcentajeAsist.name}</td>
            `
}
function rellenarLowlestPercent(array,id){
    //traer el elemento no mayor porcentaje de asistencia
    let eventoConMayorPorcentajeAsist=array.sort((a,b)=>a.porcentageAsist-b.porcentageAsist)[0]
    /* console.log(eventoConMayorPorcentajeAsist) */
    //pintarlo en la tabla
    let lugar=document.getElementById(id)
        lugar.innerHTML+=` 
            <td class="border-table">${eventoConMayorPorcentajeAsist.name}</td>
            `
}
function rellenarLargerCapacity(array,id){
    //ordenar el array de mayor a menor segun su capacidad, traer el primero
    let eventoMayorCapacidad= array.sort((a,b)=>b.capacity-a.capacity)[0]
    //pintarlo en la tabla
    let lugar=document.getElementById(id)
        lugar.innerHTML+=` 
            <td class="border-table">${eventoMayorCapacidad.name}</td>`
}