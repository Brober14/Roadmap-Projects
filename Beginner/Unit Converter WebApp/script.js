document.addEventListener('DOMContentLoaded', function() {
    loadForm('length.html'); // Load the length form by default
});

function loadForm(file) {
    fetch(file)
        .then(response => response.text())
        .then(form => {
            document.getElementById("form_block").innerHTML = form
            document.querySelectorAll(".converter_type-btn").forEach((btn) => {
                btn.classList.remove("active")
            })
            document.querySelector(`[onclick="loadForm('${file}')"]`).classList.add("active")
            document.getElementById("result_block").classList.add("hidden")
        })
}

function converter(event, type) {
    event.preventDefault()

    value = parseFloat(document.getElementById('converter_value').value)
    from = document.getElementById('unit_from').value
    to = document.getElementById('unit_to').value
    let resultValue
    switch(type) {
        case "length":
            resultValue =  convertLength(from, to, value)
            break
        case "weight":
            resultValue = convertWeight(from, to, value)
            break
        case "temp":
            resultValue = convertTemp(from, to, value)
            break
    }

    document.getElementById('form_block').classList.add('hidden')
    document.getElementById('result_block').classList.remove('hidden')
    document.getElementById('result_data').textContent = `${value} ${from} = ${resultValue} ${to}`
}

function convertLength(from, to, value) {
    //relative to 1 meter
    unitsMap = { 
        meter: 1,
        centimeter: 100,
        millimeter: 10000,
        kilometer: 0.001,
        inch: 39.37,
        foot: 3.28,
        yard: 1.1,
        mile: 0.0006213
    }

    return ((value / unitsMap[from]) * unitsMap[to])
}

function convertWeight(from, to, value) {
    //relative to 1 kg
    unitsMap = {
        kilogram:1,
        gram:1000,
        ounce: 35.27,
        pound: 2.2,
    }

    return ((value / unitsMap[from]) * unitsMap[to])
}

function convertTemp(from, to, value) {
    if (from === to) return value

    let celsius
    if (from === "celsius") {
        celsius = value
    } else if (from === "fahrenheit") {
        celsius = (value - 32) * 5/9
    } else if (from === "kelvin") {
        celsius = value - 273.15
    }

    if (to === "celsius") {
        return celsius
    } else if (to === "fahrenheit") {
        return ((celsius * 9/5) + 32)
    } else if (to === "kelvin") {
        return (celsius + 273.15)
    }
}

function resetView() {
    document.getElementById('result_block').classList.add('hidden')
    document.getElementById('form_block').classList.remove('hidden')
}