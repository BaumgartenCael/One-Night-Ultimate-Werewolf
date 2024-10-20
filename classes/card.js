class Card { 
    constructor (name, team, id, imageURL, orderIndex) {
        this.name = name;
        this.team = team;
        this.id = id;
        this.description;
        this.imageURL = imageURL;
        this.orderIndex = orderIndex;
        this.active = 1;
    }
    toggle() {
        if (this.active) {
            this.active = 0;
        } else {
            this.active = 1;
        }
    }
}
const cards = {};

const werewolf1 = new Card('Werewolf', 'evil', 'werewolf1', '../../images/werewolf.jpg', 1);
werewolf1.description = 'Wakes up at night with fellow werewolves, looks at card in the middle if alone.';
cards['werewolf1'] = werewolf1;

// const werewolf2 = new Card('Werewolf', werewolfAction(), 'evil', 0);
// cards.add(werewolf2);

const seer = new Card('Seer', 'good', 'seer', '../../images/seer.jpg', 2);
seer.description = "Looks at another players's card OR two cards in the middle.";
cards['seer'] = seer;


const robber = new Card('Robber', 'good', 'robber', '../../images/robber.jpg', 3);
robber.description = "Swap your card with another player's. You may look at your new card.";
cards['robber'] = robber;


const troublemaker = new Card('Troublemaker', 'good', 'troublemaker', '../../images/troublemaker.jpg', 4);
troublemaker.description = "Swap two players' cards.";
cards['troublemaker'] = troublemaker;

const drunk = new Card('Drunk', 'good', 'drunk', '../../images/drunk.jpg', 5);
drunk.description = "Swap your card with one in the middle. You may look at your new card.";
cards['drunk'] = drunk;

const insomniac = new Card('Insomniac', 'good', 'insomniac', '../../images/insomniac.jpg', 6);
insomniac.description = "Look at your card at the end of the night";
cards['insomniac'] = insomniac;
module.exports = {Card, cards};