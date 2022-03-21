import './App.css';
import Header from './components/header/Header';
import MyStake from './components/MyStake/MyStake';
import StakeHistory from './components/StakeHistory/StakeHistory';

function App() {
  const stakeData = [
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "25, jun 2021"
    },
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "25, jun 2021"
    },
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "25, jun 2021"
    },
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "25, jun 2021"
    },
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "25, jun 2021"
    },
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "25, jun 2021"
    }
  ]
  return (
    <div className="App">
      <Header />
      <main className='main'>
        <MyStake stakeData = {stakeData} />
        <StakeHistory
          stakeData = {stakeData}
        />
      </main>
    </div>
  );
}

export default App;
