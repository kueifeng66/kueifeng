const fireworkContainer = document.querySelector('.fireworks-container')
const daysSpan = document.querySelector('#days')
const hoursSpan = document.querySelector('#hours')
const minutesSpan = document.querySelector('#minutes')
const secondsSpan = document.querySelector('#seconds')
const newYear = document.querySelector('#new-year')

const now = new Date()

newYear.innerHTML = now.getFullYear() 


//  const countToDate = new Date(now.getFullYear(), 0, 29).getTime(); //Lunar New Year next year , january 28th

const countToDate = new Date(now.getFullYear() + 1, 0, 1).getTime(); // Next year's January 1



const countdown = () => {
    const now = new Date().getTime()

    const distance = countToDate - now

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    daysSpan.innerHTML = days
    hoursSpan.innerHTML = hours
    minutesSpan.innerHTML = minutes
    secondsSpan.innerHTML = seconds

    if (distance < 0) {
        clearInterval(countdownInterval)
    }
}

countdown()

const countdownInterval = setInterval(countdown, 1000)

const fireworks = new Fireworks(fireworkContainer, {
    speed: 4,
    acceleration: 1,
    friction: 1.01,
    gravity: 4,
    particles: 350,
    explosion: 8
})

fireworks.start()