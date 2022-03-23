import './App.css';
import Header from './components/header/Header';
import MyStake from './components/MyStake/MyStake';
import StakeHistory from './components/StakeHistory/StakeHistory';
import {useState, useEffect} from 'react'
import Footer from './components/Footer/Footer';
import { ethers, utils, Contract } from 'ethers';
import BRTTokenAbi from './utils/web3/abi.json'

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

  useEffect(() => {
    if(!window.ethereum) return;
    window.ethereum.on("connect", async (payload) => {
      if(Number(payload.chainId) !== 80001) return alert("you are not on the right network , please switch to mumbai polygon")
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const account = await provider.listAccounts();
      const userMaticBal = await provider.getBalance(account[0]);
      const BRTContractInstance = new Contract("0x169E82570feAc981780F3C48Ee9f05CED1328e1b", BRTTokenAbi, provider);
      const userBRTBalance = await BRTContractInstance.balanceOf(account[0])
      setUserInfo(
        {
          matic_balance: userMaticBal,
          token_balance: userBRTBalance,
          address: account[0]
        }
      )

      setConnected(true)
      
    })

  }, [])
  

  const connectWallet = async () => {
    if(!!window.ethereum || !!window.web3) {
      await window.ethereum.request({method: "eth_requestAccounts"})
    } else {
      alert("please use an etherum enabled browser");
    }
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
