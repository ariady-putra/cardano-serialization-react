import React from "react";
import {
  Address,
  BigNum,
  CoinSelectionStrategyCIP2,
  LinearFee,
  Transaction,
  TransactionBuilder,
  TransactionBuilderConfigBuilder,
  TransactionOutput,
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
  TransactionWitnessSet,
  Value,
} from "@emurgo/cardano-serialization-lib-asmjs";

function WalletTx({wallet}) {
  const [toAddress, setToAddress] = React.useState('');
  const [lovelaces, setLovelaces] = React.useState(0);
  const [txHash, setTxHash] = React.useState(null);
  
  return (wallet &&
    <div style={{fontSize:'medium'}}>
      <table><tr><td>
        <input
          type        = 'text'
          placeholder = 'Send to wallet address'
          id          = 'toAddress'
          name        = 'toAddress'
          onChange    = {address => setToAddress(address.target.value)}
          title       = 'Alphanumeric and underscore only.'
          pattern     = '[0-9A-Za-z_]+'
          required
        />
        <input
          type        = 'number'
          placeholder = 'Lovelaces'
          id          = 'lovelaces'
          name        = 'lovelaces'
          onChange    = {lovelaces => setLovelaces(lovelaces.target.value)}
          min         = '1000000'
          required
        />
        <button
          onClick={async () => {
            const protocolParameters = await fetch('/protocolParameters');
            const pp = await protocolParameters.json();
            
            const minFeeA = BigNum.from_str('' + pp.min_fee_a);
            const minFeeB = BigNum.from_str('' + pp.min_fee_b);
            const feeAlgo = LinearFee.new(minFeeA, minFeeB);
            
            const coinsPerUtxoWord = BigNum.from_str(pp.coins_per_utxo_word);
            // const coinsPerUtxoByte = BigNum.from_str(pp.coins_per_utxo_size);
            
            const poolDeposit = BigNum.from_str(pp.pool_deposit);
            const keyDeposit  = BigNum.from_str(pp.key_deposit);
            
            const config = TransactionBuilderConfigBuilder.new()
              .fee_algo(feeAlgo)
              .coins_per_utxo_word(coinsPerUtxoWord)
              // .coins_per_utxo_byte(coinsPerUtxoByte)
              .pool_deposit(poolDeposit)
              .key_deposit(keyDeposit)
              .max_value_size(pp.max_val_size)
              .max_tx_size(pp.max_tx_size)
              .build();
            const builder = TransactionBuilder.new(config);
            
            const numOutput = BigNum.from_str('' + lovelaces);
            const valOutput = Value.new(numOutput);
            const to = Address.from_bech32(toAddress);
            const transactionOutput = TransactionOutput.new(to, valOutput);
            builder.add_output(transactionOutput);
            
            const utxoS = await wallet.api.getUtxos();
            const transactionUnspentOutputs = TransactionUnspentOutputs.new();
            for(const utxo of utxoS) {
              const transactionUnspentOutput = TransactionUnspentOutput.from_hex(utxo);
              if(transactionUnspentOutput.output().to_js_value().amount.multiasset == null)
                transactionUnspentOutputs.add(transactionUnspentOutput);
            }
            builder.add_inputs_from(transactionUnspentOutputs,
              CoinSelectionStrategyCIP2.RandomImprove);
            
            const changeAddress = Address.from_hex(wallet.address);
            builder.add_change_if_needed(changeAddress);
            
            const txBody = builder.build();
            const noWitness = TransactionWitnessSet.new();
            const txNoWitness = Transaction.new(txBody, noWitness);
            
            const txRaw = txNoWitness.to_hex();
            const txWitness = await wallet.api.signTx(txRaw);
            
            const witnessed = TransactionWitnessSet.from_hex(txWitness);
            const txWitnessed = Transaction.new(txBody, witnessed);
            
            const txSigned = txWitnessed.to_hex();
            const txHash = await wallet.api.submitTx(txSigned);
            setTxHash(txHash);
          }}
        >Send
        </button></td>
        <td>{txHash && `TxHash: ${txHash}`}
      </td></tr></table>
    </div>
  );
}

export default WalletTx;
