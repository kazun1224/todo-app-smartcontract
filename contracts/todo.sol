// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoApp {
    uint num = 0;

    // struct型は構造体を格納するデータ型
    // Todoに符号なし整数型のtaskidと文字列型のtask、bool型のflagを格納
    struct Todo {
        uint taskid;
        string task;
        bool flag;
    }

    // publicは内部か、メッセージ経由で呼び出し可能。publicなstate変数の場合、自動的にgetter関数が生成
    Todo[] public todoList;

    // mappingを利用した配列のような処理が可能
    mapping (uint => address) public todoToOwner;
    mapping (address => uint) public ownerTodoCount;

    // Todoを追加する関数 (Gas発生)
    function createTodo(string memory _task) public {
        todoList.push(Todo(num,_task,true));
        uint id = todoList.length - 1;
        todoToOwner[id] = msg.sender;
        ownerTodoCount[msg.sender]++;
        num++;
    }

    // Todoの状態を完了にする関数 (Gas発生)
    function TodoRemove(uint id) external {
        require(todoToOwner[id] == msg.sender);
        require(todoList[id].flag);
        todoList[id].flag = false;
    }

    // コントラクトアドレスを用いてTodoのリストを取得する関数(ガス代不要)
    // memoryは、処理中だけ保持され、終わったら保持されない。
    function getTodoListByOwner(address owner) external view returns(uint[] memory) {
        uint[] memory result = new uint[](ownerTodoCount[owner]);
        uint counter = 0;
        for (uint i = 0; i < todoList.length; i++) {
            if (todoToOwner[i] == owner){
                result[counter] = i;
                counter++;
        }
    }
    return result;
    }
}
