let model
let previousPen="down"
let x, y

let strokePath
let seedStrokes=[]

// 그림을 그릴 캔버스
let canvas

//가장 먼저 실행
function preload(){
	model = ml5.sketchRNN("fan", modelReady)
}

function modelReady(){
	console.log('model is ready.')
}

function setup(){
	canvas = createCanvas(800, 800)
	canvas.mousePressed(resetDrawing)
	canvas.mouseReleased(startSketchRNN)
	
	//234 : 회색계열의 색
	background(234)

	model.generate(seedStrokes, gotStroke)
}

function gotStroke(err, result){
	strokePath = result
}

//reset function 
function resetDrawing(){
	seedStrokes = []
	model.reset()
}

// 사람이 그린 마지막에서 그리기 시작
function startSketchRNN(){
	x = mouseX
	y = mouseY
	model.generate(seedStrokes, gotStroke)
}

function draw(){
	// 사용자가 그리고 있는 그림 표현
	if(mouseIsPressed){
		// rgb
		stroke(0, 225, 0)
		strokeWeight(6)
		line(pmouseX, pmouseY, mouseX, mouseY)

		const userStroke={
			dx : mouseX - pmouseX,
			dy : mouseY - pmouseY,
			pen : "down"
		}
		seedStrokes.push(userStroke)
	}

	// 컴퓨터가 그리는 부분
	if(strokePath){
		if(previousPen == "down"){
			stroke(0)
			strokeWeight(6)
			line(x, y, x + strokePath.dx, y + strokePath.dy)
		}
		x += strokePath.dx
		y += strokePath.dy
		previousPen = strokePath.pen

		if(strokePath.pen !== "end"){
			strokePath = null
			model.generate(gotStroke)
		}
	}
}