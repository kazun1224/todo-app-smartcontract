import type { NextPage } from "next";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import TodoAppContract from "../build/contracts/TodoApp.json";
import { TodoApp } from "../types/abi";

// プロバイダの設定
const web3: Web3 = new Web3(
  new Web3.providers.HttpProvider(`http://127.0.0.1:7545`)
);

// コントラクトのアドレス
// ガナッシュでデプロイしたcontractのaddressを入れる
const address = "";

// ABI
// buildで生成されたJSONファイルをインポートする
// JSONファイルからabiを抽出
const ABI: AbiItem | any = TodoAppContract.abi;

// コントラクトのインスタンス
// 以下コードでコントラクトのインスタンスを生成している。コントラクトに関する操作はこのインスタンスを通して行う
const contract: unknown | TodoApp = new web3.eth.Contract(ABI, address);

const Home: NextPage = () => {

  // account情報の取得テスト
  // (async () => {
  //   const accountsWeb3 = await web3.eth.getAccounts();
  //   console.log(accountsWeb3);
  // })();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1>hello world</h1>
    </div>
  );
};

export default Home;
