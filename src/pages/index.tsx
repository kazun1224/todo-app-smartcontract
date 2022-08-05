import type { NextPage } from "next";
import { ComponentProps, useEffect, useState } from "react";
import { Value } from "../types/todo";
import { contract, web3 } from "../utils/blockchain";

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Value[]>([]);

  // Todoを取得
  useEffect(() => {
    const getList = async () => {
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods
        .getTodoListByOwner(accounts[0])
        .call();

      // resultに格納されている配列を展開して、todoのaddressを引数として渡す
      await Promise.all(
        result.map(async (number) => {
          // コントラクトのtodosを呼び出す
          return await contract.methods.todoList(number).call();
        })
      ).then((value) => {
        // 取得した値を使って、stateを変更する
        setTodos(value);
      });
    };
    getList();
  }, [contract]);

  // todoを追加
  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    const text: Value["task"] = e.currentTarget.text.value;
    const accounts = await web3.eth.getAccounts();

    // コントラクトのTodoCreateを呼び出してTodoを追加する
    await contract.methods.createTodo(text).send({
      from: accounts[0],
      gas: "1000000",
    });

    // トランザクション完了後にページリロード
    window.location.reload();
  };

  // flagを変更(タスクを終了)
  const toggleIsDone: (id: Value["taskid"]) => Promise<void> = async (id) => {
    const accounts = await web3.eth.getAccounts();

    // コントラクトのTodoCreateを呼び出してTodoを追加する
    await contract.methods.TodoRemove(id).send({
      from: accounts[0],
      gas: "1000000",
    });
    // トランザクション完了後にページリロード
    window.location.reload();
  };

  return (
    <div className="h-screen">
      <header className="bg-cyan-800 py-6">
        <h1 className="text-white text-center text-3xl font-bold">TODO APP</h1>
      </header>
      <main className="max-w-screen-xl px-5 md:px-24  py-10 md:py-20 mx-auto md:flex min-h-screen  w-full gap-10">
        <div className="w-full">
          {/* todo一覧 */}
          <h3 className="mb-5 text-2xl font-bold">Todo一覧</h3>
          <div className="p-2 mb-10 md:mb-0">
            {todos.map((todo) =>
              todo.flag ? (
                <div
                  key={todo.taskid}
                  className="w-full border-cyan-800 border-solid border-2 rounded mb-8 md:mb-4 last-of-type:mb-0"
                >
                  <label className="">
                    <button
                      className="p-2 text-white bg-cyan-800 hover:bg-cyan-600"
                      onClick={() => toggleIsDone(todo.taskid)}
                    >
                      Done
                    </button>
                    <span className="p-2">{todo.task}</span>
                  </label>
                </div>
              ) : null
            )}
          </div>
        </div>
        {/* todo一覧 */}
        {/* Todo追加 */}
        <div className="w-full md:w-1/3">
          <h2 className="mb-5 text-2xl font-bold">Todo追加</h2>
          <div className="p-2">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="text"
                autoComplete="off"
                required
                className="border-cyan-800 border-solid border-2 p-2 mb-4 block"
              />
              <button className="text-white bg-cyan-800 hover:bg-cyan-600 px-8 py-4 rounded">
                Submit
              </button>
            </form>
          </div>
        </div>
        {/* Todo追加 */}
      </main>
      <footer className="bg-cyan-800 py-6">
        <p className="text-white text-center">Todo Dapps</p>
      </footer>
    </div>
  );
};

export default Home;
