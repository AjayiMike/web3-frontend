import clsx from 'clsx'
import React from 'react'
import Card from './Card/Card'
import Styles from './MyStake.module.css'


const MyStake = ({
  withdrawInput, 
  stakeInput, 
  addressInput,
  onClickAddress,
  onChangeInput, 
  onClickStake, 
  stakeDetails,
  onClickWithdraw,
  rewardAmount,
  stakeAmount,
  connected
}) => {
  
  const {amount, address,time} = stakeDetails;
  console.log(amount, address,time);
  return (
    <div className={Styles.root}>
        <h2 className={Styles.heading}>My stake</h2>

        <div className={Styles.stake_body}>
          <div className={Styles.card_container}>
            <Card 
              cardKey="Total Staked"
              cardValue = {stakeAmount}
            />
            <Card 
              cardKey="Total Reward"
              cardValue = {rewardAmount}
            />
          </div>
          <form onSubmit={onClickStake} className={Styles.form} >
            <input 
              type = "number" 
              placeholder="Amount to stake" 
              className={Styles.input}
              value = {stakeInput}
              onChange = {onChangeInput}
              id = "stake"
            />
            <button type='submit' className={clsx({[Styles.stake_btn]: true, [Styles.btn_diabled]: !connected})}
              disabled = {!connected}
            >Stake</button>
          </form>

          <form onSubmit = {onClickWithdraw} className={Styles.form} >
            <input 
              type = "number" 
              placeholder="Amount to unstake" 
              className={Styles.input}
              value = {withdrawInput}
              onChange = {onChangeInput}
              id = "unstake"
            />
            <button type="submit"
            className={clsx({[Styles.unstake_btn]: true, [Styles.btn_diabled]: !connected})}
            disabled = {!connected}
            >Unstake</button>
          </form>
          <form onSubmit = {onClickAddress} className={Styles.form} >
            <input 
              type = "text" 
              placeholder="Search Detail of staker" 
              className={Styles.input}
              value = {addressInput}
              onChange = {onChangeInput}
              id ="address"
            />
            <button type="submit"
            className={clsx({[Styles.stake_btn]: true, })}
            >Search</button>
          </form>
        </div>
        <div className={Styles.card}>
          <h4 className={Styles.cc}>Get Details of staker</h4>
          <div className={Styles.cc}>
            <h4>Address Staker</h4>
          <p className={Styles.para}>{address}</p>
          </div>
           <div className={Styles.cc}>
            <h4>Amount Staked</h4>
          <p className={Styles.para}>{amount} {`${amount? `BRT` : 0.0}`}</p>
          </div>
          <div className={Styles.cc}>
            <h4>Time Staked</h4>
          <p className={Styles.para}>{time}</p>
          </div>
        </div>
    </div>
  )
}

export default MyStake