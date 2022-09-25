import React from "react";

import ConnectWallet  from "./component/ConnectWallet";
import WalletUTXOs    from "./component/WalletUTXOs";
import WalletTx       from "./component/WalletTx";

import "./App.css";

function App() {
  const [wallet, setWallet] = React.useState(null);
  
  return (
    <div className = 'App-header'>
      <ConnectWallet
        setWallet={setWallet}/>
      {wallet && wallet.bech32}
      
      <WalletUTXOs
        wallet={wallet}/>
      
      <WalletTx
        wallet={wallet}/>
    </div>
  );
}

export default App;
