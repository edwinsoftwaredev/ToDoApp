import React from 'react';
import {
  Link
} from 'react-router-dom';
import {connect} from 'react-redux';

interface Props {
  appName: string;
}

export class Home extends React.Component<Props> {
  render() {
    return (
      <div>
        <div>
          <h5>{this.props.appName} Home</h5>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default connect((state: Props, props) => {
  // useSelector cannot be used here
  const appName = state.appName;
  return {appName: appName};
}, {})(Home);
