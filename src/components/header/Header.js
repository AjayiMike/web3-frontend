import React from 'react'
import Connected from '../Connected/Connected'
import Styles from "./Header.module.css"
const Header = ({userInfo, connected, connectWallet}) => {
  return (
    <div className={Styles.root}>
        <span className={Styles.logo}>WEB3<span className={Styles.logo2}>FRONTEND</span></span>
        <div className="">
            {connected ? <Connected
              token_balance = {userInfo.token_balance}
              matic_balance = {userInfo.matic_balance}
              address = {userInfo.address}
            /> : <button onClick={connectWallet} className={Styles.connect_btn}>Connect Wallet</button>}
        </div>
    </div>
  )
}

export default Header