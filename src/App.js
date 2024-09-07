import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'

// ABIs
import MetaPass from './abis/MetaPass.json'

// Config
import config from './config.json'

function App() {

  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  

  const loadBlockchainData = async() => {
    //Establish Connection with Ethereum Provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider);

    //Creating a new metaPass instance to connect to blockchain ethers.js
    const network = await provider.getNetwork()
    const address = config[network.chainId].MetaPass.address  //Look at config.json
    const metaPass = new ethers.Contract(address, MetaPass, provider)
    console.log(metaPass.address)

    //Refresh Account
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }
  
  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount}/>
        <h2 className='header__title'><b>Event</b> Tickets</h2>
      </header>

      <h1>MetaPass</h1>
      <p>{account}</p>
    </div>
  );
}

export default App;