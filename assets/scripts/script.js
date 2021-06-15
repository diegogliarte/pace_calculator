const MILE = 1.609344

var radios = document.querySelectorAll(".option-radio")
var inputsCalculator = document.querySelectorAll(".inputs:not(.converter)")
var inputsConverter = document.querySelectorAll(".converter")
textRadios = document.querySelectorAll(".text-radio")

// Defaults pace input as selected for "keyup" to work since the beginning
selectedRadios = document.querySelectorAll(".calculator.pace")
notSelectedRadios = document.querySelectorAll(".calculator:not(.pace)")

textRadios.forEach(function(textRadio) {
	textRadio.addEventListener("keypress", function(e) {
		if (document.activeElement == textRadio && e.key == "Enter") {
			radio = document.getElementById(textRadio.id.replace("-text", ""))
			radio.checked = true
			update(radio.id.replace("radio-", ""))
		}
	})
})

radios.forEach(function(radio) {
    radio.addEventListener("click" ,function(e) { // Everytime you click on a radio, it iterates through all the radios
        update(radio.id.replace("radio-", ""))
        
    })
})



inputsCalculator.forEach(function(input){
    input.addEventListener("keyup", recalculate)
})

inputsConverter.forEach(function(input){
	input.addEventListener("keyup",  () => convert(input.id,input.classList))
})


function update(id){
	// Gets elements whose "class" match with current "id" and those whose not.
	selectedRadios = document.querySelectorAll(".calculator." + id)
	notSelectedRadios = document.querySelectorAll(".calculator:not(." + id + ")")
	selectedTexts = document.querySelectorAll("#radio-" + id + "-text")
	notSelectedTexts = document.querySelectorAll("label:not(#radio-" + id + "-text)")
	selectedRadios.forEach(function(radio){
		radio.style.backgroundColor = "lightgrey"
		radio.style.fontWeight = "bold"
		radio.disabled = true

	})
	notSelectedRadios.forEach(function(radio){
		radio.style.backgroundColor = "white"
		radio.style.fontWeight = "normal"
		radio.disabled = false
	})
	selectedTexts.forEach(function(text){
		text.style.color = "darkgrey"
	})
	notSelectedTexts.forEach(function(text){
		text.style.color = "#1f1f1f"
	})
}

function convert(id, classList){
	current = document.getElementById(id)
	if (id.includes("km")){
		toConvert = document.getElementById(id.replace("-km", "-mi"))
		conversion = MILE
	} else {
		toConvert = document.getElementById(id.replace("-mi", "-km"))
		conversion = 1 / MILE
	}
	
	if (classList.contains("pace")) {
		convertPace(id)
		return
	} else {
		value = (current.value / conversion) // Multiplication for pace, division for speed and distance
		fixed = (5 - Math.round(value).toString().length)
		fixed = fixed < 0 || value == 0? 0 : fixed
		toConvert.value = value.toFixed(fixed)
	}
}

function convertPace(id){
	if (id.includes("km")) {
		currentMinutes = document.getElementById("converter-pace-km-m")
		currentSeconds = document.getElementById("converter-pace-km-s")
		toConvertMinutes = document.getElementById("converter-pace-mi-m")
		toConvertSeconds = document.getElementById("converter-pace-mi-s")
		timeSeconds = getDatetimeInSeconds(0, currentMinutes.value, currentSeconds.value)
		formattedTime = getDatetimeFormatted(timeSeconds * MILE)
	} else {
		toConvertMinutes = document.getElementById("converter-pace-km-m")
		toConvertSeconds = document.getElementById("converter-pace-km-s")
		currentMinutes = document.getElementById("converter-pace-mi-m")
		currentSeconds = document.getElementById("converter-pace-mi-s")
		timeSeconds = getDatetimeInSeconds(0, currentMinutes.value, currentSeconds.value)
		formattedTime = getDatetimeFormatted(timeSeconds / MILE)
	}
	
	toConvertMinutes.value = formattedTime[0] * 60 + formattedTime[1]
	toConvertSeconds.value = formattedTime[2]
		
	
		
}

function recalculate(){
    // Everytime you press a key down on an input field, it iterates through all the inputs
    id = selectedRadios[0].id
        switch (id) {
            // Since we have already the "notSelectedRadios", we can kinda hardcode the values without performing more operations
            // We could iterate through every element with class "inputs" and send values to the corresponding function depending on "id"
            // In case the "time" is selected, we only need to check the specific id "input-hours". Same with "pace".
            // This is not generalized nor scalable in the current state

            case "input-time-hours":
                // selectedRadios = time-hours, time-minutes, time-seconds
                // notSelectedRadios = distance, pace-hours, pace-minutes, pace-seconds
                paceSeconds = getDatetimeInSeconds(notSelectedRadios[1].value, notSelectedRadios[2].value, notSelectedRadios[3].value)
                distance = notSelectedRadios[0].value
                setTime(paceSeconds, distance)
                break;
            case "input-distance":
                // selectedRadios = distance
                // notSelectedRadios = time-hours, time-minutes, time-seconds, pace-hours, pace-minutes, pace-seconds
                timeSeconds = getDatetimeInSeconds(notSelectedRadios[0].value, notSelectedRadios[1].value, notSelectedRadios[2].value)
                paceSeconds = getDatetimeInSeconds(notSelectedRadios[3].value, notSelectedRadios[4].value, notSelectedRadios[5].value)
                setDistance(timeSeconds, paceSeconds)
                break;
            case "input-pace-hours":
                // selectedRadios = pace-hours, pace-minutes, pace-seconds
                // notSelectedRadios = time-hours, time-minutes, time-seconds, distance
                timeSeconds = getDatetimeInSeconds(notSelectedRadios[0].value, notSelectedRadios[1].value, notSelectedRadios[2].value)
                distance = notSelectedRadios[3].value
                setPace(timeSeconds, distance)
                break;
        }
}

function getDatetimeInSeconds(hours, minutes, seconds){
    if (hours.length == 0) {
        hours = 0
    }
    if (minutes.length == 0){
        minutes = 0
    }
    if (seconds.length == 0) {
        seconds = 0
    }

    return parseInt(seconds) + parseInt(minutes) * 60 + parseInt(hours) * 3600
}

function getDatetimeFormatted(seconds){
    hours = seconds / 3600 >> 0
    minutes = (seconds - (hours * 3600)) / 60 >> 0
    seconds = seconds - (hours * 3600) - (minutes * 60)

    return [Math.round(hours), Math.round(minutes), Math.round(seconds)]
}

function setTime(pace, distance){
    timeSeconds = pace * distance
	formattedTime = getDatetimeFormatted(timeSeconds)
	
    selectedRadios[0].value = formattedTime[0]
    selectedRadios[1].value = formattedTime[1]
    selectedRadios[2].value = formattedTime[2]
}

function setPace(time, distance){
    paceSeconds = time / distance
    formattedTime = getDatetimeFormatted(paceSeconds)
	
    selectedRadios[0].value = formattedTime[0]
    selectedRadios[1].value = formattedTime[1]
	selectedRadios[2].value = Number.isNaN(formattedTime[2]) || !Number.isFinite(formattedTime[2]) ? 0 : formattedTime[2]
	
    
}

function setDistance(time, pace){
    distance = time / pace
	
    selectedRadios[0].value = Number.isNaN(distance) || !Number.isFinite(distance) ? 0 : parseFloat(distance.toFixed(2))
}
