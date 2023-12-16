// Get references to the sun and sun face elements
var sun = document.getElementById('sun');
var sunFace = document.getElementById('sun-face');

// Function to get the position of the sun dynamically, considering scroll offsets
function getSunCenter() {
    var sunRect = sun.getBoundingClientRect();
    var sunCenterX = sunRect.left + sun.offsetWidth / 2 + window.pageXOffset;
    var sunCenterY = sunRect.top + sun.offsetHeight / 2 + window.pageYOffset;
    return {
        x: sunCenterX,
        y: sunCenterY
    };
}

// Function to handle mouse movement
function handleMouseMove(event) {
    // Get the dynamic position of the sun considering scroll offsets
    var sunCenter = getSunCenter();

    // Calculate the distance from the cursor to the center of the sun
    var distanceX = event.clientX - sunCenter.x;
    var distanceY = event.clientY - sunCenter.y;

    // Calculate the distance using Pythagorean theorem
    var distanceFromCenter = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Calculate the maximum allowed distance within the visible circle (the sun)
    var maxAllowedDistance = sun.offsetWidth / 2 - sunFace.offsetWidth / 2;

    // Adjustments for arbitrary top and left positions
    var sunTop = parseInt(getComputedStyle(sun).top);
    var sunLeft = parseInt(getComputedStyle(sun).left);

    // Calculate the position for the sun face within the circle boundary
    var newX, newY;
    if (distanceFromCenter <= maxAllowedDistance) {
        newX = sunCenter.x + distanceX - sunLeft;
        newY = sunCenter.y + distanceY - sunTop;
    } else {
        // Calculate the angle within the circle boundary
        var angle = Math.atan2(distanceY, distanceX);

        // Calculate the constrained distance within the circle
        newX = sunCenter.x + maxAllowedDistance * (distanceX / distanceFromCenter) - sunLeft;
        newY = sunCenter.y + maxAllowedDistance * (distanceY / distanceFromCenter) - sunTop;
    }

    // Update the position for the sun face
    sunFace.style.left = newX - sunFace.offsetWidth / 2 + 'px';
    sunFace.style.top = newY - sunFace.offsetHeight / 2 + 'px';
}

// Add throttled mousemove event listener to the window
window.addEventListener('mousemove', handleMouseMove);
