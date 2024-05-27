// tracker.js

document.addEventListener('DOMContentLoaded', function () {
    // Check if the user has a visit cookie
    let lastVisit = getCookie('lastVisit');
    let visitCount = getCookie('visitCount');

    // If no cookie, it's the first visit
    if (!lastVisit || !visitCount) {
        visitCount = 1;
    } else {
        // Increment visit count
        visitCount++;
    }

    document.getElementById('visitCount').innerText = visitCount;

    // Set current time as last visit
    lastVisit = new Date();
    setCookie('lastVisit', lastVisit.toUTCString(), 365); // Cookie expires in 365 days
    setCookie('visitCount', visitCount, 365);
    const formattedLastVisit = formatLastVisitDate(lastVisit);
    // Display last visit time
    document.getElementById('lastVisit').innerText = formattedLastVisit;
});

// Helper functions to manage cookies
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

function getCookie(name) {
    let nameEQ = name + '=';
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}


function formatLastVisitDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}