import React from "react";
import { Address } from "@emurgo/cardano-serialization-lib-asmjs";

function ConnectWallet({setWallet}) {
  const [wallets, setWallets] = React.useState([]);
  
  React.useEffect(() => {
    const wallets = [];
    for(const key in window.cardano) {
      if(window.cardano[key].enable && wallets.indexOf(key) === -1) {
        wallets.push(key);
      }
    }
    setWallets(wallets.sort());
  }, []);
  
  return (
    <table><tr>
      {wallets.map(key =>
        <td><button
          style   = {{width: '64px', height: '80px'}}
          onClick = {async () => {
            const wallet        = await window.cardano[key].enable();
            const networkID     = await wallet.getNetworkId();
            
            const hexAddress    = await wallet.getChangeAddress();
            const bech32Address = Address.from_hex(hexAddress).to_bech32();
            
            setWallet({
              api     : wallet,
              address : hexAddress,
              bech32  : bech32Address,
              network : networkID,
            });
          }}
          ><img
            src  ={window.cardano[key].icon}
            width={32} height={32} alt={key}/>
          {window.cardano[key].name}
        </button></td>
      )}
    </tr></table>
  );
}

export default ConnectWallet;
