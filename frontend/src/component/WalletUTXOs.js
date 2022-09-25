import React from "react";
import {
  BigNum,
  TransactionUnspentOutput,
} from "@emurgo/cardano-serialization-lib-asmjs";

function WalletUTXOs({wallet}) {
  const [ada     , setADA     ] = React.useState(null);
  const [lovelace, setLovelace] = React.useState(null);
  const [utxoS   , setUTXOs   ] = React.useState('');
  
  return (wallet &&
    <div style={{fontSize:'medium'}}>
      <table><tr><td><button
        onClick={async () => {
          const hexBalance = await wallet.api.getBalance();
          const strBalance = BigNum.from_hex(hexBalance).to_str();
          const numBalance = Number(strBalance) / 1000000;
          const modBalance = Number(strBalance) % 1000000;
          const adaBalance = numBalance.toLocaleString(undefined,
            {maximumFractionDigits:0});
          const lovBalance = modBalance.toLocaleString(undefined,
            {maximumFractionDigits:0})
          setADA(adaBalance);
          setLovelace(lovBalance);
          
          setUTXOs('querying UTXOs...');
          
          const utxoS = await wallet.api.getUtxos();
          
          var transactionUnspentOutputs = []
          for(const utxo of utxoS) {
            const transactionUnspentOutput = TransactionUnspentOutput.from_hex(utxo);
            const input = transactionUnspentOutput.input().to_js_value();
            const output = transactionUnspentOutput.output().to_js_value();
            transactionUnspentOutputs.push({input:input, output:output});
          }
          
          const json = JSON.stringify(transactionUnspentOutputs, null, 4);
          setUTXOs(json);
        }}
      >Wallet UTXOs
      </button></td>
      <td>{(ada || lovelace) && 'Balance:'}
      </td>
      <td><strong>{ada && `${ada} ADA`}</strong>
      </td>
      <td><sup>{lovelace && `${lovelace} lovelace`}</sup>
      </td>
      </tr></table>
      <pre>
        {utxoS}
      </pre>
    </div>
  );
}

export default WalletUTXOs;
