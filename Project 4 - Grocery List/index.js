import { htmlToElement } from './utils.js';

const deletedHistory = [];

function onLiDrag(event) {
    event.dataTransfer.setData("dragged-id", event.target.id);
}

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
    deletedHistory.push(event.target.parentNode.parentNode);
    event.target.parentNode.parentNode.remove();
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
    window.addNew = addNew;
    window.deleteElement = deleteElement;
    window.onLiDrag = onLiDrag;
    window.onLiDrop = onLiDrop;
}

function undoDelete(event) {
    if (event.ctrlKey && event.key === 'z' && deletedHistory.length) {
        document.getElementById("list-items").appendChild(deletedHistory.pop());
    }
}

document.addEventListener('keydown', undoDelete);
document.addEventListener("DOMContentLoaded", onPageLoad);