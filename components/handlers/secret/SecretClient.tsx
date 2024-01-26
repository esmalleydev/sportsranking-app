'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSecret } from '@/redux/features/user-slice';
import { useEffect } from 'react';
import { refresh } from '@/components/generic/CBB/actions';

let intervalRefresher: NodeJS.Timeout;

const SecretClient = ({ secret, tag }) => {
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(state => state.userReducer.value);

  const refreshRate = 60 * 20; // 20 mins

  useEffect(() => {
    intervalRefresher = setInterval(function() {
      refresh(tag);
    }, refreshRate * 1000);
    return function clean_up() {
      clearInterval(intervalRefresher);
    };
  });


  if (userSlice.secret_id !== secret) {
    dispatch(setSecret(secret));
  }

  return null;
}

export default SecretClient;