import './App.css';
import Header from './components/header/Header';
import MyStake from './components/MyStake/MyStake';
import StakeHistory from './components/StakeHistory/StakeHistory';
import {useState, useEffect} from 'react'
import Footer from './components/Footer/Footer';
import { ethers, utils, Contract} from 'ethers';
import { formatDate} from './utils/helpers'
import BRTTokenAbi from './utils/web3/abi.json'
const BRTTokenAddress = "0x169E82570feAc981780F3C48Ee9f05CED1328e1b";

function App() {

  // a flag for keeping track of whether or not a user is connected
  const [connected, setConnected] = useState(false);

  // connected user details
  const [userInfo, setUserInfo] = useState({
    matic_balance: 0,
    token_balance: 0,
    address: null
  });
  
  
  // the amount of token the user have staked
  const [stakeAmount, setStakeAmount] = useState(null)

  // the amount of reward the user has accumulate on his stake
  const [rewardAmount, setRewardAmount] = useState(null)

  // the value of token the user wants to stake
  const [stakeInput, setStakeInput] = useState("");

  const [addressInput, setAddressInput] = useState("");
  // the value of token the user wants to withdraw
  const [withdrawInput, setWithdrawInput] = useState("");

  // all stake history data displayed on the history table
  const [stateHistory, setStakeHistory] = useState([]);

  const [stakeDetails, setStakeDetails] = useState({})

  // helper function for getting the matic and token balance, given an address
  const getAccountDetails = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const userMaticBal = await provider.getBalance(address);
      const BRTContractInstance = new Contract(BRTTokenAddress, BRTTokenAbi, provider);
      const userBRTBalance = await BRTContractInstance.balanceOf(address)
      await getStake()
      return {userBRTBalance, userMaticBal}
    }catch(err) {
      console.log(err)
    }
  }

  // handler for when user switch from one account to another or completely disconnected
  const handleAccountChanged = async (accounts) => {
    if(!!accounts.length) {
      const networkId = await window.ethereum.request({method: "eth_chainId"})
      if(Number(networkId) !== 80001) return
      const accountDetails = await getAccountDetails(accounts[0])

      setUserInfo({
        matic_balance: accountDetails.userMaticBal,
        token_balance: accountDetails.userBRTBalance,
        address: accounts[0]
      })
      setConnected(true)
    }else {
      setConnected(false)
      setUserInfo({
        matic_balance: 0,
        token_balance: 0,
        address: null
      })
      
    }
  }

  // handler for handling chain/network changed
  const handleChainChanged = async (chainid) => {
    if(Number(chainid) !== 80001) {
      setConnected(false)
      setUserInfo({
        matic_balance: 0,
        token_balance: 0,
        address: null
      })
      
      return alert("You are connected to the wrong network, please switch to polygon mumbai")
    }else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if(!accounts.length) return
      const accountDetails = await getAccountDetails(accounts[0])
        setUserInfo({
          matic_balance: accountDetails.userMaticBal,
          token_balance: accountDetails.userBRTBalance,
          address: accounts[0]
        })
        setConnected(true)
      }
  }

  // an handler to eagerly connect user and fetch their data
  const eagerConnect = async () => {
    const networkId = await window.ethereum.request({method: "eth_chainId"})
    if(Number(networkId) !== 80001) return
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if(!accounts.length) return
    const accountDetails = await getAccountDetails(accounts[0])
      setUserInfo({
        matic_balance: accountDetails.userMaticBal,
        token_balance: accountDetails.userBRTBalance,
        address: accounts[0]
      })
      setConnected(true)
  }

  // a function for fetching necesary data from the contract and also listening for contract event when the page loads
  const init = async () => {
    const customProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
    const BRTContractInstance = new Contract(BRTTokenAddress, BRTTokenAbi, customProvider);
    const stakeHistory = await BRTContractInstance.queryFilter("stakeEvent");

    const history = [];

    
    stakeHistory.forEach(data => {
      history.unshift({
        amount: data.args[1],
        account: data.args[0],
        time: data.args[2].toString(),
        type: data.args[3],
      })
    })


    setStakeHistory(history);

    BRTContractInstance.on("stakeEvent", (account, amount, time, type) => {
      const newStake = {
        amount: amount,
        account: account,
        time: time.toString(),
        type: type,
      }

      setStakeHistory(prev => [newStake, ...prev]);
    })

  }

  useEffect(() => {

    init()
    if(!window.ethereum) return;
    // binding handlers to wallet events we care about
    window.ethereum.on("connect", eagerConnect)
    window.ethereum.on("accountsChanged", handleAccountChanged)
    window.ethereum.on('chainChanged', handleChainChanged);
    /* eslint-disable */
  }, [])
  

  const connectWallet = async () => {
    if(!!window.ethereum || !!window.web3) {
      await window.ethereum.request({method: "eth_requestAccounts"})
    } else {
      alert("please use an etherum enabled browser");
    }
  }

  // onchange handler for handling both stake and unstake input value
  const onChangeInput = ({target}) => {
    switch (target.id) {
      case "stake":
        setStakeInput(target.value)
        break;

      case "unstake":
        setWithdrawInput(target.value);
        break;

        case "address":
        setAddressInput(target.value);
        break;
    
      default:
        break;
    }
  }

  // A function that handles staking
  const onClickStake = async (e) => {
    e.preventDefault()
    if(stakeInput < 0) return alert("you cannot stake less than 0 BRT")

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const BRTContractInstance = new Contract(BRTTokenAddress, BRTTokenAbi, signer);
    const weiValue = utils.parseEther(stakeInput);
    const stakeTx = await BRTContractInstance.stakeBRT(weiValue);

    // const stakeTxHash = await provider.getTransaction(stakeTx.hash)
    const response = await stakeTx.wait();

    // const address = response.events[1].args[0]
    // const amountStaked = response.events[1].args[1].toString()
    // const time = response.events[1].args[2].toString()
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if(!accounts.length) return
    const accountDetails = await getAccountDetails(accounts[0])
      setUserInfo({
        matic_balance: accountDetails.userMaticBal,
        token_balance: accountDetails.userBRTBalance,
        address: accounts[0]
      })
      setConnected(true)
      setStakeInput("")
    
  }




  const onClickWithdraw = async(e) => {
 
    e.preventDefault()

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const BRTContractInstance = new Contract(BRTTokenAddress, BRTTokenAbi, signer);
    const weiValue = utils.parseEther(withdrawInput);
    const stakeTx = await BRTContractInstance.withdraw(weiValue);

    // const stakeTxHash = await provider.getTransaction(stakeTx.hash)
    const response = await stakeTx.wait();

    // const address = response.events[1].args[0]
    // const amountStaked = response.events[1].args[1].toString()
    // const time = response.events[1].args[2].toString()
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if(!accounts.length) return
    const accountDetails = await getAccountDetails(accounts[0])
      setUserInfo({
        matic_balance: accountDetails.userMaticBal,
        token_balance: accountDetails.userBRTBalance,
        address: accounts[0]
      })
      setConnected(true)
      setWithdrawInput("")
    
  }



  const getStake = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const BRTContractInstance = new Contract(
      BRTTokenAddress,
      BRTTokenAbi,
      signer
    );
    const myStake = await BRTContractInstance.myStake();
    const stake = utils.formatUnits(myStake.stakeAmount, 18);
    setStakeAmount(stake);

    // getting the last stake in seconds
    const lastestStake = formatDate(myStake.time.toString());
    const newStakeTime = new Date(lastestStake);
    const stakeSeconds = Math.floor(newStakeTime.getTime() / 1000);

    // getting the current day in seconds
    const currentDay = new Date();
    const currentDaySeconds = Math.floor(currentDay.getTime() / 1000);

    // getting the difference between the lastest stake and the current day
    const timeDifference = currentDaySeconds - stakeSeconds;

    // showing reward after 3 days otherwise showing 0
    if (timeDifference >= 259200) {
      const reward = 0.0000000386 * timeDifference * stake;
      setRewardAmount(reward.toFixed(3));
    } else setRewardAmount("00.00");
  };

  const onClickAddress = async(e) =>{
    if(addressInput === ""){
      return alert("Input field cannot be empty!")
    }
    e.preventDefault()
    const customProvider = new ethers.providers.JsonRpcProvider(
      process.env.REACT_APP_RPC_URL
    );
    const BRTContractInstance = new Contract(
      BRTTokenAddress,
      BRTTokenAbi,
      customProvider
    );
    const userDetails = await BRTContractInstance.getStakeByAddress(
      addressInput
    );
    console.log(userDetails)
    // setStakeDetails( (parseInt(userDetails.stakeAmount._hex)/ 1e18).toFixed(2))
        setStakeDetails( {
          address:userDetails.staker,
          amount:utils.formatUnits(userDetails.stakeAmount.toString(),18),
          time: formatDate(userDetails.time._hex)
        })

    
    // console.log(stakeDetails)
    setAddressInput("")
      
  }
  // console.log(stateHistory)
  
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
          addressInput={addressInput}
          withdrawInput = {withdrawInput}
          onChangeInput = {onChangeInput}
          onClickStake = {onClickStake}
          onClickWithdraw = {onClickWithdraw}
          onClickAddress={onClickAddress}
          stakeAmount = {stakeAmount}
          rewardAmount = {rewardAmount}
          connected = {connected}
          stakeDetails={stakeDetails}

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
