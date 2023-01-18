import { htmlToElement } from './utils.js';

var deletedHistory = [];
const audio = new Audio("http://freesoundeffect.net/sites/default/files/paper-crumple-01-sound-effect-45574952.mp3");

function onLiDrop(event) {
    event.preventDefault();
    const dragged = document.getElementById(event.dataTransfer.getData("dragged-id"));
    if (event.currentTarget.offsetTop < dragged.offsetTop) {
        event.currentTarget.parentNode.insertBefore(dragged, event.currentTarget);
    } else {
        event.currentTarget.after(dragged);
    }
}

function deleteElement(event) {
    audio.play();
    deletedHistory.push(event.target.parentNode.innerHTML); // the list item whole
    event.target.parentNode.parentNode.remove();
    // console.log(deletedHistory);
}

function addNew(event) {
    event.preventDefault();
    const listInput = event.target.elements.listInput;

    if (!listInput.value.trim()) return; // Don't add empty list items

    const listItems = document.getElementById("list-items");
    listItems.appendChild(htmlToElement(`
        <li 
            draggable="true" 
            ondragstart="window.onLiDrag(event)"
            ondragover="event.preventDefault()"
            ondrop="window.onLiDrop(event)"
            id=${Date.now()}
        >
            <div class="items">
                <p>${listInput.value}</p>
                <button class="delete-btn" onclick="window.deleteElement(event)">delete</delete>
            </div>
        </li>
    `))
    listInput.value = "";
}

function onPageLoad(evt) {
    const isUser = localStorage.getItem("isUser");
    if (!isUser) {
        document.getElementById("info-modal").classList.remove("hidden"); 
        localStorage.setItem("listItems", '');
        localStorage.setItem("deletedHistory", ''); 
    } else {
        deletedHistory = JSON.parse(localStorage.getItem("deletedHistory"));
        // console.log("deleted history - localstorage", JSON.parse(localStorage.getItem("deletedHistory")));
        // console.log("deleted history - now", deletedHistory);
        document.getElementById("list-items").innerHTML = localStorage.getItem("listItems");
    }
    localStorage.setItem("isUser", true)
    // localStorage.clear() // for testing

    window.addNew = addNew;
    window.deleteElement = deleteElement;
    window.onLiDrag = (evt) => evt.dataTransfer.setData("dragged-id", evt.target.id);
    window.onLiDrop = onLiDrop;
}

function beforeUnload(evt) {
    evt.preventDefault()

    // set list items 
    localStorage.setItem("listItems", document.getElementById("list-items").innerHTML);
    // set deleted history 
    localStorage.setItem("deletedHistory", JSON.stringify(deletedHistory));
}

function undoDelete(event) {
    if (event.ctrlKey && event.key === 'z' && deletedHistory.length) {
        const elem = deletedHistory.pop();

        const listItems = document.getElementById("list-items");
        listItems.appendChild(htmlToElement(`
            <li 
                draggable="true" 
                ondragstart="window.onLiDrag(event)"
                ondragover="event.preventDefault()"
                ondrop="window.onLiDrop(event)"
                id=${Date.now()}
            >
                <div class="items">
                    ${elem}
                </div>
            </li>
        `))
    }
}

document.addEventListener('keydown', undoDelete);
document.addEventListener("DOMContentLoaded", onPageLoad);
// document.addEventListener("beforeunload", beforeUnload);
window.onbeforeunload = beforeUnload;