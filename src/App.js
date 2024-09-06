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
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [metaPass, setMetaPass] = useState(null)
  const [occasions, setOccasions] = useState([])

  const [occasion, setOccasion] = useState({})
  const [toggle, setToggle] = useState(false)

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const metaPass = new ethers.Contract(config[network.chainId].MetaPass.address, MetaPass, provider)
    setMetaPass(metaPass)

    const totalOccasions = await metaPass.totalOccasions()
    const occasions = []

    for (var i = 1; i <= totalOccasions; i++) {
      const occasion = await metaPass.getOccasion(i)
      occasions.push(occasion)
    }

    setOccasions(occasions)

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
        <Navigation account={account} setAccount={setAccount} />

        <h2 className="header__title"><strong>Event</strong> Tickets</h2>
      </header>

      <Sort />

      <div className='cards'>
        {occasions.map((occasion, index) => (
          <Card
            occasion={occasion}
            id={index + 1}
            metaPass={metaPass}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            key={index}
          />
        ))}
      </div>

      {toggle && (
        <SeatChart
          occasion={occasion}
          metaPass={metaPass}
          provider={provider}
          setToggle={setToggle}
        />
      )}
    </div>
  );
}

export default App;