import React from "react";
import {
  // BigNum,
  TransactionUnspentOutput,
} from "@emurgo/cardano-serialization-lib-asmjs";

function WalletUTXOs({wallet}) {
  // const [ada     , setADA     ] = React.useState(null);
  // const [lovelace, setLovelace] = React.useState(null);
  const [utxoS   , setUTXOs   ] = React.useState('');
  
  return (wallet &&
    <div style={{fontSize:'medium'}}>
      <table><tr><td><button
        onClick={async () => {
          // const hexBalance = await wallet.api.getBalance();
          // const strBalance = BigNum.from_hex(hexBalance).to_str(); // doesn't work with array balance
          // const numBalance = Number(strBalance) / 1000000;
          // const modBalance = Number(strBalance) % 1000000;
          // const adaBalance = numBalance.toLocaleString(undefined,
          //   {maximumFractionDigits:0});
          // const lovBalance = modBalance.toLocaleString(undefined,
          //   {maximumFractionDigits:0})
          // setADA(adaBalance);
          // setLovelace(lovBalance);
          
          setUTXOs('querying UTXOs...');
          
          const utxoS = await wallet.api.getUtxos();
          
          let transactionUnspentOutputs = []
          for(const utxo of utxoS) {
            const transactionUnspentOutput = TransactionUnspentOutput.from_hex(utxo);
            
            const input = transactionUnspentOutput.input().to_js_value();
            const output = transactionUnspentOutput.output().to_js_value();
            
            let metadata = [];
            if(output.amount && output.amount.multiasset)
            {
              const multiassetEntries = Object.entries(output.amount.multiasset).map(async kv => {
                const [policyID, asset] = kv;
                const assetEntries = Object.entries(asset).map(async kv => {
                  const [assetName, amount] = kv;
                  if(amount === '1') {
                    const specificAsset = await fetch(`/specificAsset?policy_id=${policyID}&asset_name=${assetName}`);
                    const asset = await specificAsset.json();
                    metadata.push(asset);
                  }
                });
                await Promise.all(assetEntries);
              });
              await Promise.all(multiassetEntries);
            }
            
            transactionUnspentOutputs.push(metadata.length ?
              {input:input, output:output, assets:metadata} :
              {input:input, output:output});
          }
          
          const json = JSON.stringify(transactionUnspentOutputs, null, 4);
          setUTXOs(json);
        }}
      >Wallet UTXOs
      </button></td>
      {/* <td>{(ada || lovelace) && 'Balance:'}
      </td>
      <td><strong>{ada && `${ada} ADA`}</strong>
      </td>
      <td><sup>{lovelace && `${lovelace} lovelace`}</sup>
      </td> */}
      </tr></table>
      <pre>
        {utxoS}
      </pre>
    </div>
  );
}

export default WalletUTXOs;
