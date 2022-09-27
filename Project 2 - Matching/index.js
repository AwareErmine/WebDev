const selected = {
    card1: null,
    card2: null,
};

var score = 0;

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); 
    template.innerHTML = html;
    
    return template.content.firstChild;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    
    return array;
}

function onImageClick(evt, num) {
    const currentTarget = evt.currentTarget;

    if (currentTarget.id == selected.card1?.elem.id) return; // double clicking would otherwise reveal cards
    if (!selected.card2) { // is there a better way to not check this 2x?
        currentTarget.classList.remove("hidden");
        score++;
        document.getElementById("score").innerHTML = score;
    }; 
    
    if (!selected.card1) {
        selected.card1 = {
            elem: currentTarget,
            num: num,
        };
    } else if (!selected.card2) {
        selected.card2 = {
            elem: currentTarget,
            num: num,
        };

        setTimeout(() => {
            if (selected.card1.num != num) { // if the first one number stored isn't the same as the currently selected card's
                currentTarget.classList.add("hidden"); // hide the current card
                selected.card1.elem.classList.add("hidden");
            } else if (selected.card1.num == num) {
                const currentElements = [...document.getElementsByName(`${num}`)];
                for (const elem of currentElements) {
                    elem.removeAttribute("onclick");
                }
            }
            Object.keys(selected).forEach(k => selected[k] = null);
        }, 1000);
    }     
}

function renderImageGrid(id) {
    const grid = document.getElementById(id);
    const nums = [...Array(8)].map((_, i) => [i, i]).flat();
    shuffle(nums);
    nums.map((num, i) => {
        const img = htmlToElement(`
            <div class="hidden" onclick="onImageClick(event, ${num})" name=${num} id="${num}i${i}">
                <img src="./assets/${num}.jpg" alt=${num}>
            </div>
        `);
        grid.appendChild(img)
    })
}

function onPageLoad(evt) {
    renderImageGrid("grid")
}

document.addEventListener("DOMContentLoaded", onPageLoad)