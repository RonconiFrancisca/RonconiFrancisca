const link = "https://pokeapi.co/api/v2/pokemon/";
const cantidadtotalPokemones = 1040; // cantidad de pokemons de la api
const cantidadPokemones = 6; //cantidad de pokemones de los 2 equipos que voy a necesitar para la batalla

var ataqueEquipoA = 0;
var defensaEquipoA = 0;
var ataqueEquipoB = 0;
var defensaEquipoB = 0;

var limiteTiradas = 3;
var tiradasA = [];
var tiradasB = [];
var tiradamayorequipoA = 0;
var tiradamayorequipoB = 0;
var posiciontitradamayorequipoA = 0;
var posiciontitradamayorequipoB = 0;

async function buscarPokemon() {
    
    //voy a guardar en una constante una funcion asincrona, que va a tener los resultados de las peticiones fetch
    const getPersonajes = async () => {
        //obtengo los 3 id de cada equipo
        const pokemon = Array.from({length: cantidadPokemones}, () => 
                                            Math.floor(Math.random() * cantidadtotalPokemones) + 1);
        
        try{
            //esperamos que se cumplan todas las promesas (cantidad de pokemones que necesitamos)
            const data = await Promise.all(
                //recorro los elementos del array y para cada id hace la peticion fetch
                pokemon.map(async id => {
                    const response = await fetch (`${link}${id}`);
                    //maneja un error si el pokemon con ese id no existe y sino lo combierte en objeto json
                    if(!response.ok){
                        throw new Error (`No se pudo obtener el pokemon con id ${id}`)
                    } return response.json(); 
                })
            )
            console.log("Pokemones: ",data);
            //nos devuelve los datos acumulados
            return data;

        }catch(error){
            console.error("Ocurrio un error", error);
            return[];
        }
    }
   
    (async () => {
        const pokemones = await getPersonajes(); 
        var contadorPokemones = 0;

        //recorremos los elementos del array
        pokemones.forEach((pokemon, i) => {

            //buscamos la defensa y ataque de cada pokemon
            let statataque = pokemon.stats.find(s => s.stat.name === "attack");
            let statdefensa = pokemon.stats.find(s => s.stat.name === "defense");

            //en el caso de que uno de estos datos sea undefined  pone 0
            let ataque = statataque ? statataque.base_stat : 0;
            let defensa = statdefensa ? statdefensa.base_stat : 0;

            //variable con lo que van a mostrar ambos equipos
            var mostrar = ` <div>
                            <h3>${pokemon.name}</h3>
                            <img src ="${pokemon.sprites.front_default}">
                            <p>Defensa:${defensa}</p>
                            <p>Ataque:${ataque}</p>
                            </div>`;
            //divido los equipos segun la posicion
            if(i < 3){
                ataqueEquipoA += ataque;
                defensaEquipoA += defensa;
            
                document.getElementById("equipoA").innerHTML +=`${mostrar}`;
                //cuando llegue al ultimo del equipo va a mostrar los datos de la suma total de ataque y defensa.
                if(i==2){
                     document.getElementById("stats_equipoA").innerHTML +=`<div>
                                            <p class="ataque_grupal">Ataque grupal: ${ataqueEquipoA}</p>
                                            <p class="defensa_grupal">Defensa Grupal: ${defensaEquipoA}</p>
                                        </div>`;
                }  
            }else{
                ataqueEquipoB += ataque;
                defensaEquipoB += defensa;

                document.getElementById("equipoB").innerHTML +=`${mostrar}`;

                if(i==5){
                     document.getElementById("stats_equipoB").innerHTML +=`<div>
                                            <p class="ataque_grupal" >Ataque grupal: ${ataqueEquipoB}</p>
                                            <p class="defensa_grupal" >Defensa Grupal: ${defensaEquipoB}</p>
                                        </div>`;
                }
            }
        contadorPokemones = contadorPokemones++;
        })  
    })();
}buscarPokemon();

function tirarDadosA(){
    let dado1 = Math.floor(Math.random () *6 ) + 1 ;
    let dado2 = Math.floor(Math.random () *6 ) + 1 ;
    tiradasA.push(dado1+dado2);
    console.log(tiradasA);
   
    for(i = 0; i < tiradasA.length; i++ ){
        if(tiradasA > tiradamayorequipoA){
            tiradamayorequipoA =  tiradasA;
            posiciontitradamayorequipoA = i;
        } else{
            tiradamayorequipoA = tiradamayorequipoA;
        }
        document.getElementById('valordadoA').innerHTML =`
                                          <p>Tiradas: ${tiradasA}</p>`;
    }

    if(tiradasA.length==3){
        document.getElementById('dadosA').disabled = true;
        corroborarTiradas();
    }
}

function tirarDadosB(){
    let dado1 = Math.floor(Math.random () *6 ) + 1 ;
    let dado2 = Math.floor(Math.random () *6 ) + 1 ;
    tiradasB.push(dado1+dado2);
    console.log(tiradasB);
   
    for(i = 0; i < tiradasB.length; i++ ){
        if(tiradasB > tiradamayorequipoB){
            tiradamayorequipoB =  tiradasB;
            posiciontitradamayorequipoB = i;
        } else{
            tiradamayorequipoB = tiradamayorequipoB;
        }
        document.getElementById('valordadoB').innerHTML =`
                                          <p>Tiradas: ${tiradasB}</p>`;
    }

    if(tiradasB.length==3){
            document.getElementById('dadosB').disabled = true;
            corroborarTiradas();
        }
}

function corroborarTiradas(){
    if (tiradasB.length==3 && tiradasA.length==3){
        document.getElementById('comenzarBatalla').disabled = false;
    }
}

function iniciarBatalla(){
    ataqueFinalEquipoA = ataqueEquipoA - defensaEquipoB;
    ataqueFinalEquipoB = ataqueEquipoB - defensaEquipoA;

    if(ataqueFinalEquipoA>ataqueFinalEquipoB){
        document.getElementById("ganador").innerHTML += `<h2>Ganador Equipo A</h2>
                                                        <p>Diferencia del Equipo A: ${ataqueFinalEquipoA}</p>
                                                        <p>Diferencia del Equipo B: ${ataqueFinalEquipoB}</p>`;
    }else if(ataqueFinalEquipoA<ataqueFinalEquipoB){
        document.getElementById("ganador").innerHTML += `<h2>Ganador Equipo B</h2>
                                                        <p>Diferencia del Equipo B: ${ataqueFinalEquipoB}</p>
                                                        <p>Diferencia del Equipo A: ${ataqueFinalEquipoA}</p>`;
    }else{
        desempate();
    }
}


function desempate(){
    if(tiradamayorequipoA > tiradamayorequipoB){
        document.getElementById("ganador").innerHTML += `<h2>Ganador Equipo A</h2>
                                                        <p>Diferencia del Equipo A: ${ataqueFinalEquipoA}</p>
                                                        <p>Diferencia del Equipo B: ${ataqueFinalEquipoB}</p>
                                                        <p>Tirada mayor del equipo A: ${tiradamayorequipoA} obtenido en la posicion ${posiciontitradamayorequipoA}</p>
                                                        <p>Tirada mayor del equipo B: ${tiradamayorequipoB} obtenido en la posicion ${posiciontitradamayorequipoB}</p>`;
    } else if (tiradamayorequipoB>tiradamayorequipoA){
        document.getElementById("ganador").innerHTML += `<h2>Ganador Equipo B</h2>
                                                        <p>Diferencia del Equipo B: ${ataqueFinalEquipoB}</p>
                                                        <p>Diferencia del Equipo A: ${ataqueFinalEquipoA}</p>
                                                        <p>Tirada mayor del equipo B: ${tiradamayorequipoB} obtenido en la posicion ${posiciontitradamayorequipoB}</p>
                                                        <p>Tirada mayor del equipo A: ${tiradamayorequipoA} obtenido en la posicion ${posiciontitradamayorequipoA}</p>`;
    }
}

