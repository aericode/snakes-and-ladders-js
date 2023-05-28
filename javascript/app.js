let gameOver = false;
let moveRuleArray = Array();


//all ladders
moveRuleArray[1]  = 38;
moveRuleArray[4]  = 14;
moveRuleArray[9]  = 31;
moveRuleArray[21] = 42;
moveRuleArray[28] = 84;
moveRuleArray[51] = 67;
moveRuleArray[71] = 91;
moveRuleArray[80] = 100;


//all snakes
moveRuleArray[17] = 7;
moveRuleArray[54] = 34;
moveRuleArray[62] = 19;
moveRuleArray[64] = 60;
moveRuleArray[87] = 24;
moveRuleArray[93] = 73;
moveRuleArray[95] = 75;
moveRuleArray[98] = 79;


let offset_table = Array()

offset_table["p1"] = Array()
offset_table["p2"] = Array()
offset_table["p3"] = Array()
offset_table["p4"] = Array()


offset_table["p1"]["y"] = -12
offset_table["p1"]["x"] = -21

offset_table["p2"]["y"] = -12
offset_table["p2"]["x"] =   9

offset_table["p3"]["y"] =  18
offset_table["p3"]["x"] = -21

offset_table["p4"]["y"] =  18
offset_table["p4"]["x"] =   9


let score = Array()

player_turn = 0;

function skip_turn(){
	player_turn++;
	if (player_turn >= 4) player_turn = 0;
}

function get_player_turn(){
	return "p" + (player_turn+1)
}

score["p1"] = 0
score["p2"] = 0
score["p3"] = 0
score["p4"] = 0


//
let coordinateArray = [	[560, -40],
						[560,20], [560,80], [560,140], [560,200], [560,260], [560,320], [560,380], [560, 440], [560,500], [560,560],
						[500,20], [500,80], [500,140], [500,200], [500,260], [500,320], [500,380], [500, 440], [500,500], [500,560],
						[440,20], [440,80], [440,140], [440,200], [440,260], [440,320], [440,380], [440, 440], [440,500], [440,560],
						[380,20], [380,80], [380,140], [380,200], [380,260], [380,320], [380,380], [380, 440], [380,500], [380,560],
						[320,20], [320,80], [320,140], [320,200], [320,260], [320,320], [320,380], [320, 440], [320,500], [320,560],
						[260,20], [260,80], [260,140], [260,200], [260,260], [260,320], [260,380], [260, 440], [260,500], [260,560],
						[200,20], [200,80], [200,140], [200,200], [200,260], [200,320], [200,380], [200, 440], [200,500], [200,560],
						[140,20], [140,80], [140,140], [140,200], [140,260], [140,320], [140,380], [140, 440], [140,500], [140,560],
						 [80,20],  [80,80],  [80,140],  [80,200],  [80,260],  [80,320],  [80,380],  [80, 440],  [80,500],  [80,560],
						 [20,20],  [20,80],  [20,140],  [20,200],  [20,260],  [20,320],  [20,380],  [20, 440],  [20,500],  [20,560]
					]



function rolldice(){
	let result = 1 + Math.floor( Math.random() * 6 );

	return result;
}

function square_to_position_array(square){

	let level = Math.floor( (square -1) /10 );

	if(square==0) return 0;
	if( level%2 == 0 ) return square;
	if( level%2 == 1 ){
		if(square%10 == 0) return level*10 + 1;
		return (level*10 + (11 - square%10)) ;
	}
}

function position_to_coordinates(position){

	let level = Math.floor( (position -1) /10 );


	if(position > 100 || position < 0 ){
		console.log("posição inválida");
		return null
	}

	return coordinateArray[square_to_position_array(position)]
}

function update_location(){
	let pin = document.getElementById('p1');


	let position_tuple = position_to_coordinates(score["p1"]);


	let x_position = position_tuple[1];
	let y_position = position_tuple[0];

	
	pin.style.marginLeft = x_position + "px";
	pin.style.marginTop  = y_position + "px";



}

function move_piece_forward(){
	score["p1"]++;
	update_location();
}

function update_display(value){
	let display = document.getElementById('dadoDisplay');
	display.innerHTML = value;

}

function update_player_display(){
	let display = document.getElementById('displayJogador');
	display.innerHTML = "Vez do jogador " + (player_turn+1);

}

function increment_player_position_value(player, value){
	score[player] += value;
	if(score[player] >= 100){
		score[player] = 100;
	}
}


function victory(player){


	let textoVitoria = document.getElementById('victoryText');
	let frameVitoria = document.getElementById('victoryScreen');

	console.log(textoVitoria.innerHTML)
	console.log(frameVitoria)

	textoVitoria.innerHTML = "Jogador " + player + " ganhou!";
	frameVitoria.style.display     = "block";
	frameVitoria.style.visibility = "visible";



	gameOver = true;
}

function checkVictory(){
	let name;
	for(let i = 1; i < 5; i++){
		name = "p"+i;
		
		if(score[name] == 100){
			
			victory(i);
		}
	}
}


function hide_victory_screen(){
	let textoVitoria = document.getElementById('victoryText');
	let frameVitoria = document.getElementById('victoryScreen');

	textoVitoria.innerHTML = "";
	frameVitoria.style.display    = "none";
	frameVitoria.style.visibility = "hidden";
}

async function activate_effects(piece){

	let redirect_to = moveRuleArray[score[piece]];
	
	if (redirect_to == undefined){
		return;
	}else{
		dislocate_piece(piece, score[piece], redirect_to)
		score[piece] = redirect_to;
	}

}

function add_offset(piece, original_coordinate){
	let added_offset = Array()

	added_offset = [ original_coordinate[0] + offset_table[piece]["y"], original_coordinate[1] + offset_table[piece]["x"] ]

	return added_offset
}


function dislocate_piece(piece="p1", origin_index = 0, origin_target= 1 ){



	let origin = coordinateArray[ square_to_position_array(origin_index)  ]
	let target = coordinateArray[ square_to_position_array(origin_target) ]


	origin = add_offset(piece, origin);
	target = add_offset(piece, target);

	let tickspeed = 50

	let vectorTick = [ (target[0]-origin[0])/tickspeed ,  (target[1]-origin[1])/tickspeed ]


	let top_margin  = document.getElementById(piece).style.marginTop
	let left_margin = document.getElementById(piece).style.marginLeft

	top_margin  = top_margin.replace('px','')
	left_margin = left_margin.replace('px', '')


	let counter = 0

	let intermediary_top  = parseFloat( document.getElementById(piece).style.marginTop.replace('px', '') )
	let intermediary_left = parseFloat(  document.getElementById(piece).style.marginLeft.replace('px', '') )

	
	let timer = setInterval( () => {
        if (counter == 50){
            clearInterval(timer)
        }

		intermediary_top  = parseFloat(document.getElementById(piece).style.marginTop.replace('px', '')  )  +  parseFloat( vectorTick[0] )
        intermediary_left = parseFloat(document.getElementById(piece).style.marginLeft.replace('px', '') )  +  parseFloat( vectorTick[1] )





        document.getElementById(piece).style.marginTop  = intermediary_top  + "px"
		document.getElementById(piece).style.marginLeft = intermediary_left + "px" 


        counter++
    }, 10);
}



function execute_move_animation(piece,dice_result){
	let moves_made = 0
	let inter_position = score[piece]
	
	console.log("inciando movimento")

	let rounds = setInterval( () => { 
		if(moves_made + 1 == dice_result){
			clearInterval(rounds)
			console.log("finalizando movimento")
		}

		dislocate_piece(piece,inter_position,inter_position+1)
		inter_position++
		moves_made++

	
	}, 400);
}

async function promise_execute_move_animation(piece, dice_result){
	return new Promise( resolve => {
			let moves_made = 0
			let inter_position = score[piece]
			
			

			let rounds = setInterval( () => { 

				dislocate_piece(piece,inter_position,inter_position+1)
				inter_position++
				moves_made++


				if(moves_made == dice_result){
					clearInterval(rounds)
					resolve()
				}

				
			
			}, 500);
		})

}

async function sleep(time){
	return new Promise( resolve =>
		setInterval( () => {resolve()} , time)
	)
}


function test_click(){
	execute_move_animation('p1', 4)
	increment_player_position_value(4)
}

function temp_disable_button(){
	let button = document.getElementById("actionButton")

	button.style.backgroundColor = "gray";
	button.onclick = () => {return false;}


	setTimeout( ()=>{ if(!gameOver){ enable_play_button()  } },3500)
	
	
}


function disable_play_button(){
	let button = document.getElementById("actionButton")
	button.style.backgroundColor = "gray";
	button.onclick = () => {return false;}
}


function enable_play_button(){
	let button = document.getElementById("actionButton")
	button.style.backgroundColor = "red";
	button.onclick = () => play();
}




async function play(){


	temp_disable_button()
	let current_player = get_player_turn()
	skip_turn();

	let diceResult = rolldice();
	update_display(diceResult);
	
	

	await promise_execute_move_animation(current_player, diceResult);
	increment_player_position_value(current_player ,diceResult);
	await sleep(2000);
	activate_effects(current_player);
	update_player_display();

	
	checkVictory();
	

}


//TODO
function auto_play(){
	disable_play_button();

	let timer = setInterval(() => {
		if(true){
			play()
		}else{
			clearInterval(timer);
			enable_play_button();
		}
	}, 4000);
}

function restart(){
	gameOver = false;
	enable_play_button();

	let current_player_target = null
	let position_zero_coordinate = coordinateArray[0]

	for(let i = 1; i < 5; i++){
		current_player_target = "p" + i;
		score[current_player_target] = 0

		let added_offset = add_offset(current_player_target, position_zero_coordinate)

		document.getElementById(current_player_target).style.marginLeft = added_offset[1] + "px";
		document.getElementById(current_player_target).style.marginTop  = added_offset[0] + "px";

	}



	hide_victory_screen();


}

function start(){
	
	restart();
}

start();