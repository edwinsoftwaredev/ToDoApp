import React from 'react';
import './Account.scss';
import {useSelector} from "react-redux";
import {todoUserSelector} from "../Home";
import Username from "../../shared/inputs/user/username/Username";
import AccountService from "./AccountService";
import {AuthService} from "../../auth/AuthService";

const Account: React.FC = () => {
  const todoUser = useSelector(todoUserSelector);
  const authService = AuthService.getInstance();
  
  const handleDeleteAccount = () => {
    AccountService.deleteTodoAccount(todoUser.userId).then(() => {
      authService.startSignOut();
    });
  }
  
  return (
    <div className='Account'>
      <h1 className='heading'>My Account</h1>
      <div className='account-container'>
        <div className='account-info'>
          <div className={'account-username'}>
            <Username
              username={() => null}
              initialValue={todoUser.userName ?? ''}
              isDisabled={true}
            />
          </div>
          <div></div>
          <button
            className={'uk-button uk-button-default btn-delete-account'}
            onClick={handleDeleteAccount}
          >
            Delete Todo Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;