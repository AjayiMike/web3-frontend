import './App.css';
import Header from './components/header/Header';
import MyStake from './components/MyStake/MyStake';
import StakeHistory from './components/StakeHistory/StakeHistory';
import {useState} from 'react'
import Footer from './components/Footer/Footer';

function App() {

  const [connected, setConnected] = useState(false);

  const [userInfo, setUserInfo] = useState({
    matic_balance: 0,
    token_balance: 0,
    address: null
  });

  const [stakeAmount, setStakeAmount] = useState(null)
  const [rewardAmount, setRewardAmount] = useState(null)

  const [stakeInput, setStakeInput] = useState("");
  const [withdrawInput, setWithdrawInput] = useState("");

  const [stateHistory, setStakeHistory] = useState([
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "1647975426",
      type: "stake"
    },
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "1647975426",
      type: "stake"
    },
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "1647975426",
      type: "unstake"
    },
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "1647975426",
      type: "stake"
    },
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "1647975426",
      type: "unstake"
    },
    {
      amount: 1000,
      account: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415",
      time: "1647975426",
      type: "stake"
    }
  ])

  const connectWallet = async () => {
    // logic

    setConnected(true)
    setUserInfo(
      {
        matic_balance: "63549678582439050349",
        token_balance: "65045396805965968546",
        address: "0xE428Db9A3B47046acb020B8B5a5B29b8792a1415"
      }
    )
  }

  const onChangeInput = ({target}) => {
    switch (target.id) {
      case "stake":
        setStakeInput(target.value)
        break;

      case "unstake":
        setWithdrawInput(target.value);
        break;
    
      default:
        break;
    }
  }

  const onClickStake = (e) => {
    e.preventDefault()
    console.log("staking...........", stakeInput);
  }

  const onClickWithdraw = (e) => {
    e.preventDefault()
    console.log("unstaking...........", withdrawInput);
  }

  
  return (
    <div className="App">
      <Header 
        connectWallet = {connectWallet}
        connected={connected}
        userInfo = {userInfo}
      />
      <main className='main'>
        <MyStake
          stakeInput = {stakeInput}
          withdrawInput = {withdrawInput}
          onChangeInput = {onChangeInput}
          onClickStake = {onClickStake}
          onClickWithdraw = {onClickWithdraw}
          stakeAmount = {stakeAmount}
          rewardAmount = {rewardAmount}

        />
        <StakeHistory
          stakeData = {stateHistory}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
