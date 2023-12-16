
/* Whenever we click menu or icon element, adds or removes open class */
function toggleMenu() {
    const menu = document.querySelector(".menu-links"); /* targetting <div class="menu-links"> */
    const icon = document.querySelector(".hamburger-icon"); 
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}
