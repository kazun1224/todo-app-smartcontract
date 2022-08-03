import type { NextPage } from "next";
import { ComponentProps, useEffect, useState } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import TodoAppContract from "../../build/contracts/TodoApp.json";
import { TodoApp } from "../../types/abi";

type Value = {
  taskid: string;
  task: string;
  flag: boolean;
  0: string;
  1: string;
  2: boolean;
}

// プロバイダの設定
const web3: Web3 = new Web3(
  new Web3.providers.HttpProvider(`http://127.0.0.1:7545`)
);

// コントラクトのアドレス
// ガナッシュでデプロイしたcontractのaddressを入れる

/////////////////////////////////////////////////////////////////////// GANACHE_TODO_APP_CONTRACT_ADDRESSの文字列を入れるとerrorが消える
const address: string = process.env.GANACHE_TODO_APP_CONTRACT_ADDRESS;

// ABI
// buildで生成されたJSONファイルをインポートする
// JSONファイルからabiを抽出
const ABI = TodoAppContract.abi as any as AbiItem;

// コントラクトのインスタンス
// 以下コードでコントラクトのインスタンスを生成している。コントラクトに関する操作はこのインスタンスを通して行う
const contract = new web3.eth.Contract(ABI, address) as unknown as TodoApp;

const Home: NextPage = () => {
  // contractを使わないTodo用
  const [todos, setTodos] = useState<any[] | undefined[]>([]);
  // contractを使うTodo用
  const [testTodos, setTestTodos] = useState<Value[] | undefined[]>([]);

  // todolistを取得
  useEffect(() => {
    const getList = async () => {
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods
        .getTodoListByOwner(accounts[0])
        .call(); //todoListを取得

      // ② resultに格納されている配列を展開して、todos()の引数として渡す
      await Promise.all(
        result.map(async (number) => {
          // ③ コントラクトのtodosを呼び出す
          return await contract.methods.todoList(number).call();
        })
      ).then((value) => {
        console.log(value);

        // ④ 取得した値を使って、stateを変更する
        setTestTodos(value);
      });
    };
    getList();
  },[contract])


  // todoを追加
  const handleSubmit: ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    const text = e.currentTarget.text.value;
    // setTodos((prevTodo) => {
    //   const newTodos = { id: prevTodo.length + 1, text, isDone: false };
    //   return [...prevTodo, newTodos];
    // });
    // e.currentTarget.reset();

    const onAddTodo: (text: Value["task"]) => Promise<void> = async (text) => {
      const accounts = await web3.eth.getAccounts();

      // コントラクトのTodoCreateを呼び出してTodoを追加する
      await contract.methods.createTodo(text).send({
        from:accounts[0], gas: '1000000'
      });
      // トランザクション完了後、ページリロード
      window.location.reload();
    };
    onAddTodo(text);
  };

  // flagを変更(タスクを終了)
  const toggleIsDone = (id: any) => {
    // setTodos((prevTodos) => {
    //   return prevTodos.map((todo) => {
    //     if (todo.id === id) {
    //       return { ...todo, isDone: !todo.isDone };
    //     }
    //     return todo;
    //   });
    // });

    const outAddTodo : (id: Value["taskid"]) => Promise<void>= async (id) => {
      const accounts = await web3.eth.getAccounts();

      // コントラクトのTodoCreateを呼び出してTodoを追加する
      await contract.methods.TodoRemove(id).send({
        from:accounts[0], gas: '1000000'
      });
      // トランザクション完了後、ページリロード
      window.location.reload();
    };
    outAddTodo(id);
  };

  return (
    <div className="h-screen">
      <header className="bg-gray-500 py-6">
        <h1 className="text-white text-center text-5xl">TODO App</h1>
      </header>
      <main className="max-w-screen-xl px-5 md:px-24 md:flex py-20 md:py-36 mx-auto">
        <div className="w-full py-10">
          {/* todo一覧 */}
          <h3 className="mb-10 text-3xl">Todo一覧</h3>
          {testTodos.map((todo) => (
            <div key={todo?.taskid} className="py-4 px-4">
              <label style={{ fontSize: "2rem" }}>
                <input
                  type="checkbox"
                  className="w-6 h-6 mr-4"
                  checked={todo?.flag}
                  onChange={() => toggleIsDone(todo?.taskid)}
                />
                {todo?.task}
              </label>
            </div>
          ))}
        </div>

        <div className="w-full md:w-1/3">
          <h2 className="mb-10 text-3xl">todo追加</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="text" autoComplete="off" required className="border-gray-700 border-solid border-2 block mb-5 w-full md:w-4/5 max-h-56" />
            <button className="text-white bg-gray-700 hover:bg-gray-400 px-8 py-4 rounded">
              submit
            </button>
          </form>
        </div>
      </main>
    </div>
    // <div className="h-screen">
    //   <header className="bg-gray-500 py-6">
    //     <h1 className="text-white text-center text-5xl">TODO App</h1>
    //   </header>
    //   <main className="max-w-screen-xl px-5 md:px-24 md:flex py-20 md:py-36 mx-auto">
    //     <div className="w-full py-10">
    //       {/* todo一覧 */}
    //       <h3 className="mb-10 text-3xl">Todo一覧</h3>
    //       {todos.map((todo) => (
    //         <div key={todo.id} className="py-4 px-4">
    //           <label style={{ fontSize: "2rem" }}>
    //             <input
    //               type="checkbox"
    //               className="w-6 h-6 mr-4"
    //               checked={todo.isDone}
    //               onChange={() => toggleIsDone(todo.id)}
    //             />
    //             {todo.text}
    //           </label>
    //         </div>
    //       ))}
    //     </div>

    //     <div className="w-full md:w-1/3">
    //       <h2 className="mb-10 text-3xl">todo追加</h2>
    //       <form onSubmit={handleSubmit}>
    //         <input type="text" name="text" autoComplete="off" required className="border-gray-700 border-solid border-2 block mb-5 w-full md:w-4/5 max-h-56" />
    //         <button className="text-white bg-gray-700 hover:bg-gray-400 px-8 py-4 rounded">
    //           submit
    //         </button>
    //       </form>
    //     </div>
    //   </main>
    // </div>
  );
};

export default Home;
