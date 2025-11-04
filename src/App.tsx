import './App.css'
import { useGameContext } from './context';

const postScore = async (name: string, score: number) => {
    await fetch('https://laniama22.sps-prosek.cz/PHP/clicker_game/backend/submit_score.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name: name,
            score: score
        }),
      }
    )
 
}

function App() {
  const { counter,
          numberPerClick,
          cost,
          prestigeNumber,
          autoclicker,
          leaderboardData,
          incrementCounter,
          incrementNumberPerClick,
          decreaseCounter,
          incrementPrestige,
          incrementAutoclicker,
          refreshLeaderboardData
        } = useGameContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = (event.target as HTMLFormElement).nameInput.value;
    const score = Math.floor(counter);
    await postScore(name, score);
  };

  return (
    <>
    <div className='nameFormContainer'>
      <h2>Enter Your Name for the Leaderboard</h2>
      <form id="nameForm" onSubmit={handleSubmit}>
        <input type="text" id="nameInput" name="nameInput" placeholder="Your Name" required />
        <button type="submit">Submit</button>
      </form>
    </div>
    <div className="App">
      <h1>Counter: {Math.floor(counter)}</h1>
      <div className="card">
        <div className='clickButtonContainer'>
          <button className='clickButton' onClick={() => {
            incrementCounter();
          }}
          >
            Click me 
          </button>
        </div>
        <div className='upgradeContainer'>
          <p>Cost: {cost[0]}</p>
          <button onClick={() => {
            if (counter < cost[0]) return;
            incrementNumberPerClick();
            decreaseCounter(cost[0]);
          }}
          >
            Increase Clicks to Add (Currently {numberPerClick})
          </button>
          <p>Cost: {Math.floor(cost[1])+1}</p>
          <button onClick={() => {
            if (counter < cost[1]) return;
            incrementPrestige();
          }}
          >Prestige (Currently {prestigeNumber})
          </button>
        </div>
        <div className='autoclickerContainer'>
          <p>Cost: {cost[2]}</p>
          <button onClick={() => {
            if (counter < cost[2]) return;
            incrementAutoclicker();
            decreaseCounter(cost[2]);
          }}
          >
            Buy Autoclicker (Currently {autoclicker})
          </button>
        </div>
      </div>
      <div className='resetDiv'>
        <button className='resetButton' onClick={() => {
          localStorage.removeItem("gameSaveData");
          window.location.reload();
        }}
        >
          Reset Game
        </button>
      </div>
    </div>
    <div className='leaderboardContainer'>
      <h2>Leaderboard</h2>
      <div className='leaderboard'>
        {leaderboardData ? (
          <ul>
            {leaderboardData.map((entry) => (
              <li key={entry.id}>
                {entry.name}: {entry.score}
              </li>
            ))}
          </ul>
        ) : (
          <p>No leaderboard data available</p>
        )}
      </div>
      <button className='refreshButton' onClick={refreshLeaderboardData}>
        Refresh Leaderboard
      </button>
    </div>
    </>
  )
}

export default App
