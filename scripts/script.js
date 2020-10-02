const MILE = 1.609344

var radios = document.querySelectorAll(".option-radio")
var inputs = document.querySelectorAll(".inputs")

// Defaults pace input as selected for "keyup" to work since the beginning
selectedBoxes = document.querySelectorAll(".pace")
notSelectedBoxes = document.querySelectorAll(".inputs:not(.pace)")


radios.forEach (function (radio)
{
    radio.addEventListener("click", function (e)
    // Everytime you click on a radio, it iterates through all the radios
    {
        id = radio.id.replace("radio-", "")
        // Gets elements whose "class" match with current "radio.id" and those whose not.
        selectedBoxes = document.querySelectorAll("." + id + ":not(button)")
        notSelectedBoxes = document.querySelectorAll(".inputs:not(." + id + ")")

        selectedBoxes.forEach (function (box)
        {
            box.style.backgroundColor = "lightgrey"
            box.style.fontWeight = "bold"
            box.disabled = true

        })
        notSelectedBoxes.forEach (function (box)
        {
            box.style.backgroundColor = "white"
            box.style.fontWeight = "normal"
            box.disabled = false
        })
    })
})

    

inputs.forEach (function (input)
{
    input.addEventListener("keyup", recalculate)
})

function recalculate()
{
    // Everytime you press a key down on an input field, it iterates through all the inputs
    id = selectedBoxes[0].id
        switch (id)
        {
            // Since we have already the "notSelectedBoxes", we can kinda hardcode the values without performing more operations
            // We could iterate through every element with class "inputs" and send values to the corresponding function depending on "id"
            // In case the "time" is selected, we only need to check the specific id "input-hours". Same with "pace".
            // This is not generalized nor scalable in the current state

            case "input-time-hours":
                // selectedBoxes = time-hours, time-minutes, time-seconds
                // notSelectedBoxes = distance, pace-hours, pace-minutes, pace-seconds
                pace_seconds = get_datetime_seconds(notSelectedBoxes[1].value, notSelectedBoxes[2].value, notSelectedBoxes[3].value)
                distance = notSelectedBoxes[0].value
                set_time(pace_seconds, distance)
                break;
            case "input-distance":
                // selectedBoxes = distance
                // notSelectedBoxes = time-hours, time-minutes, time-seconds, pace-hours, pace-minutes, pace-seconds
                time_seconds = get_datetime_seconds(notSelectedBoxes[0].value, notSelectedBoxes[1].value, notSelectedBoxes[2].value)
                pace_seconds = get_datetime_seconds(notSelectedBoxes[3].value, notSelectedBoxes[4].value, notSelectedBoxes[5].value)
                set_distance(time_seconds, pace_seconds)
                break;
            case "input-pace-hours":
                // selectedBoxes = pace-hours, pace-minutes, pace-seconds
                // notSelectedBoxes = time-hours, time-minutes, time-seconds, distance
                time_seconds = get_datetime_seconds(notSelectedBoxes[0].value, notSelectedBoxes[1].value, notSelectedBoxes[2].value)
                distance = notSelectedBoxes[3].value
                set_pace(time_seconds, distance)
                break;
        }
}

function get_datetime_seconds(hours, minutes, seconds)
{
    if (hours.length == 0)
    {
        hours = 0
    }
    if (minutes.length == 0)
    {
        minutes = 0
    }
    if (seconds.length == 0)
    {
        seconds = 0
    }

    return parseInt(seconds) + parseInt(minutes) * 60 + parseInt(hours) * 3600
}

function get_datetime_formatted(seconds)
{
    hours = seconds / 3600 >> 0
    minutes = (seconds - (hours * 3600)) / 60 >> 0
    seconds = seconds - (hours * 3600) - (minutes * 60)

    return [hours, minutes, seconds]
}

function set_time(pace, distance)
{
    if (document.querySelector(".button.distance").textContent == "Mi")
    {
        distance *= MILE;
    }
    if (document.querySelector(".button.pace").textContent == "Mi")
    {
        pace *= MILE;
    }
    time_seconds = pace * distance
    formatted_time = get_datetime_formatted(time_seconds)
    selectedBoxes[0].value = Math.round(formatted_time[0])
    selectedBoxes[1].value = Math.round(formatted_time[1])
    selectedBoxes[2].value = Math.round(formatted_time[2])
}

function set_pace(time, distance)
{
    if (distance.length == 0)
    {
        distance = 1
    }
    if (document.querySelector(".button.distance").textContent == "Mi")
    {
        distance *= MILE;
    }

    pace_seconds = time / distance
    if (document.querySelector(".button.pace").textContent == "Mi")
    {
        pace_seconds *= MILE;
    } 

    formatted_time = get_datetime_formatted(pace_seconds)
    selectedBoxes[0].value = Math.round(formatted_time[0])
    selectedBoxes[1].value = Math.round(formatted_time[1])
    selectedBoxes[2].value = Math.round(formatted_time[2])
}

function set_distance(time, pace)
{
    if (document.querySelector(".button.pace").textContent == "Mi")
    {
        pace *= MILE;
    }

    distance = time / pace
    if (document.querySelector(".button.distance").textContent == "Mi")
    {
        distance *= MILE;
    }
    selectedBoxes[0].value = parseFloat(distance.toFixed(2))
}

function toggle(class_)
{
    button = document.querySelector(".button." + class_)

    if (button.textContent == "Km")
    {
        button.textContent = "Mi"
    }
    else
    {
        button.textContent = "Km"
    }
}