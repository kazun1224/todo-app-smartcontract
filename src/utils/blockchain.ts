import Web3 from "web3";
import { AbiItem } from "web3-utils";
import TodoAppContract from "../../build/contracts/TodoApp.json";
import { TodoApp } from "../../types/abi";// プロバイダの設定


export const web3: Web3 = new Web3(
  new Web3.providers.HttpProvider(`http://127.0.0.1:7545`)
);

// コントラクトのアドレス
// デプロイしたcontractのaddressを入れる
/////////////////////////////////////////////////////////////////////// GANACHE_TODO_APP_CONTRACT_ADDRESSの文字列を入れるとerrorが消える
const address = process.env.NEXT_PUBLIC_GANACHE_TODO_APP_CONTRACT_ADDRESS;

// buildで生成されたJSONファイルを任意の名前でインポートする
// JSONファイルからABIを抽出
const ABI = TodoAppContract.abi as any as AbiItem;

// コントラクトのインスタンス
// 以下コードでコントラクトのインスタンスを生成している。コントラクトに関する操作はこのインスタンスを通して行う
export const contract = new web3.eth.Contract(ABI, address) as unknown as TodoApp;
