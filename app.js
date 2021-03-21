const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            logMessages: []
        }
    },
    computed: {
        monsterBarStyles() {
            if (this.monsterHealth < 0) {
                return {width: '0%'};
            }
            return {width: this.monsterHealth + '%'};
        },
        playerBarStyles() {
            if (this.playerHealth < 0) {
                return {width: '0%'};
            }
            return {width: this.playerHealth + '%'};
        },
        mayUseSpecialAttack() {
            return this.currentRound % 3 !== 0;
        }
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                // A draw
                this.winner = 'Draw';
            } else if (value <= 0) {
                // Player lost
                this.winner = 'Monster';
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                // A draw
                this.winner = 'Draw';
            } else if (value <= 0) {
                // Monster lost
                this.winner = 'Player';
            }
        }
    },
    methods: {
        startGame() {
            // Refreshing the data
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.winner = null;
            this.currentRound = 0;
            this.logMessages = [];
        },
        attackMonster() {        
            this.currentRound++; // Move to next round         
            const attackValue = getRandomValue(5, 12);
            this.monsterHealth -= attackValue;
            // Passing data to log list
            this.addLogMessage('Player', 'Attack', attackValue);      
            this.attackPlayer(); // Monster attacks back
        },
        attackPlayer() {
            const attackValue = getRandomValue(8, 15);
            this.playerHealth -= attackValue;
            // Passing data to log list
            this.addLogMessage('Monster', 'Attack', attackValue); 
        },
        specialAttackMonster() {       
            this.currentRound++; // Move to next round 
            const attackValue = getRandomValue(10, 25);
            this.monsterHealth -= attackValue;
            // Passing data to log list
            this.addLogMessage('Player', 'Attack', attackValue); 
            this.attackPlayer();
        },
        healPlayer() {
            this.currentRound++; // Move to next round
            const healValue = getRandomValue(8, 20);
            // Capping player health at 100
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            // Passing data to log list
            this.addLogMessage('Player', 'Heal', healValue); 
            // Attacking player while healing
            this.attackPlayer();
        },
        surrender() {
            this.winner = 'Monster';
        },
        addLogMessage(who, what, value) {
            // Adding message to start of array
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    }
});

app.mount('#game');