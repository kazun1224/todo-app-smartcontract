const Todo = artifacts.require('TodoApp');

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(Todo);
};
