import React from 'react'
import Card from './Card/Card'
import Styles from './MyStake.module.css'

const MyStake = () => {
  return (
    <div className={Styles.root}>
        <h2 className={Styles.heading}>My stake</h2>

        <div className={Styles.stake_body}>
          <div className={Styles.card_container}>
            <Card 
              cardKey="total staked"
              cardValue = {500}
            />
            <Card 
              cardKey="total Reward"
              cardValue = {24}
            />
          </div>
          <form className={Styles.form} >
            <input type = "number" placeholder="Amount to stake" className={Styles.input}/>
            <button type='submit' className={Styles.stake_btn}>Stake</button>
          </form>

          <form className={Styles.form} >
            <input type = "number" placeholder="Amount to unstake" className={Styles.input}/>
            <button type='submit' className={Styles.unstake_btn}>Unstake</button>
          </form>
        </div>
    </div>
  )
}

export default MyStake