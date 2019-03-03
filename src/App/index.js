import React from 'react';
import autobind from 'react-autobind';
import S from './module.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    // https://github.com/facebook/react/issues/9242
    this.node.removeEventListener('click', this.handler);
    this.node.addEventListener('click', this.handler);
  }

  componentWillUnmount() {
    this.node.removeEventListener('click', this.handler);
  }

  handler() {
    alert('Events work!');
  }

  render() {
    return (
      <div className={S.app}>
        It works!
        <button ref={node => (this.node = node)}>Test events</button>
      </div>
    );
  }
}
