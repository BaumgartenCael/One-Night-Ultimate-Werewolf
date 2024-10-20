export function generateCard(cardID) {
    const card = cards.get(cardID);
    const cardDOM = document.createElement('div');
    cardDOM.classList.add('card');
    
    const cardTop = document.createElement('div');
    cardTop.classList.add('cardTop');
    cardTop.textContent = card.name;

    const cardMiddle = document.createElement('div');
    cardMiddle.classList.add('cardMiddle');
    cardMiddle.src = card.imageURL;
    cardMiddle.alt = '${card.name} image';

    const cardBottom = document.createElement('div');
    cardBottom.classList.add('cardBottom');
    cardBottom.textContent = card.description;

    cardDOM.appendChild(cardTop);
    cardDOM.appendChild(cardMiddle);
    cardDOM.appendChild(cardBottom);

    return cardDOM;
}