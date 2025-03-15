import {useState, useRef, useEffect} from "react";
import {nanoid} from "nanoid";
import Confetti from "react-confetti";

import Die from "./components/Die";

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice());
    const gameWon =
        dice.every((die) => die.isHeld) &&
        dice.every((die) => dice[0].value === die.value);
    console.log("App rendered");

    const newGameBtn = useRef(null);
    console.log(newGameBtn);

    useEffect(() => {
        if (gameWon) {
            newGameBtn.current.focus();
        }
    });

    function generateAllNewDice() {
        console.log("Generating dice.....");
        return new Array(10).fill(0).map(() => ({
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid(),
        }));
    }

    function rollDice() {
        setDice((prevDice) =>
            prevDice.map((die) => {
                return die.isHeld
                    ? die
                    : {...die, value: Math.ceil(Math.random() * 6)};
            })
        );
        if (gameWon) {
            restart();
        }
    }

    function hold(id) {
        setDice((prevDice) => {
            return prevDice.map((die) =>
                die.id === id ? {...die, isHeld: !die.isHeld} : die
            );
        });
    }

    function restart() {
        setDice(generateAllNewDice());
    }

    const dieComponents = dice.map((dieObj) => (
        <Die
            key={dieObj.id}
            isHeld={dieObj.isHeld}
            value={dieObj.value}
            id={dieObj.id}
            hold={() => hold(dieObj.id)}
        />
    ));

    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && (
                    <p>
                        Congratulations! You won! Press "New Game" to start
                        again.
                    </p>
                )}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">
                Roll until all dice are the same. Click each die to freeze it at
                its current value between rolls.
            </p>
            <div className="dice-container">{dieComponents}</div>
            <button ref={newGameBtn} onClick={rollDice} className="roll-btn">
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    );
}
