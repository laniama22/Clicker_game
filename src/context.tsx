import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const getLeaderboardData = async () => {
    const response = await fetch('https://laniama22.sps-prosek.cz/PHP/clicker_game/backend/leaderboard.php')
    const data = await response.json()
    console.log(data);
    return data
}

interface GameSaveData {
    counter: number;
    numberPerClick: number;
    prestigeNumber?: number;
    autoclicker?: number;
}

interface GameContextType {
    counter: number;
    numberPerClick: number;
    cost: Array<number>;
    prestigeNumber?: number;
    mult: number;
    autoclicker?: number;
    incrementCounter: () => void;
    incrementNumberPerClick: () => void;
    decreaseCounter: (amount: number) => void;
    incrementPrestige: () => void;
    incrementAutoclicker: () => void;
    leaderboardData?: Array<{ id: number,name: string, score: number, timestamp: string}>;
    refreshLeaderboardData?: () => void;
}

const GameContext = createContext<GameContextType>({
    counter: 0,
    numberPerClick: 1,
    cost: [10, 100, 1000],
    prestigeNumber: 0,
    mult: 1,
    autoclicker: 0,
    incrementCounter: () => {},
    incrementNumberPerClick: () => {},
    decreaseCounter: () => {},
    incrementPrestige: () => {},
    incrementAutoclicker: () => {},
});

interface GameContextProviderProps {
    children: ReactNode;
} 

export const GameContextProvider: React.FC<GameContextProviderProps> = ({ children }) => {

    const [counter, setCounter] = useState(0);
    const [numberPerClick, setNumberPerClick] = useState(1);
    const [prestigeNumber, setPrestigeNumber] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const mult = 1 + (prestigeNumber * 0.2);
    const [autoclicker, setAutoclicker] = useState(0);
    const [leaderboardData, setLeaderboardData] = useState<Array<{id: number, name: string, score: number, timestamp: string}>>([]);

    
    function incrementCounter() {
        setCounter((numberPerClick * mult) + counter);
        console.log(counter, mult, numberPerClick, prestigeNumber);
    }

    function incrementNumberPerClick() {
        setNumberPerClick(numberPerClick + 1);
    }

    function decreaseCounter(amount: number) {
        setCounter(counter - amount);
    }

    function incrementPrestige() {
        setPrestigeNumber(prestigeNumber + 1);
        setNumberPerClick(1);
        setCounter(0);
    }

    function incrementAutoclicker() {
        setAutoclicker(autoclicker + 1);

    }

    function refreshLeaderboardData() {
        getLeaderboardData().then(data => setLeaderboardData(data));
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevCounter) => prevCounter + autoclicker);
        }, 1000);
        return () => clearInterval(interval);
    }, [autoclicker, mult]);

    useEffect(() => {
        const gameSaveData = localStorage.getItem("gameSaveData");
        if (gameSaveData) {
            const { counter, numberPerClick, prestigeNumber, autoclicker }: GameSaveData = JSON.parse(gameSaveData);
            setCounter(counter);
            setNumberPerClick(numberPerClick);
            setPrestigeNumber(prestigeNumber ?? 0);
            setAutoclicker(autoclicker ?? 0);
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!loaded) return;
        const gameSaveData: GameSaveData = {
            counter,
            numberPerClick,
            prestigeNumber,
            autoclicker,
        };
        localStorage.setItem("gameSaveData", JSON.stringify(gameSaveData));
    }, [counter, numberPerClick, prestigeNumber, loaded]);

    useEffect(() => {
        const interval = setInterval( async () => {
            setLeaderboardData( await getLeaderboardData());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <GameContext.Provider value={{
            counter,
            numberPerClick,
            cost: [numberPerClick * 10, 100 ** (prestigeNumber * 0.1 + 1), 1000 * (autoclicker + 1) - (autoclicker ** (autoclicker * 0.1 + 1))],
            prestigeNumber,
            mult: 1 + (prestigeNumber * 0.2),
            autoclicker,
            incrementCounter,
            incrementNumberPerClick,
            decreaseCounter,
            incrementPrestige,
            incrementAutoclicker,
            leaderboardData,
            refreshLeaderboardData,
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGameContext() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameContextProvider");
    }
    return context;
}
