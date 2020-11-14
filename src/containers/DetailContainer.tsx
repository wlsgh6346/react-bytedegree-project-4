import React, { useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Detail from '../components/Detail';
import { logout as logoutSaga } from '../redux/modules/auth';
import {useParams} from "react-router-dom";
import {RootState} from "../redux/modules/rootReducer";
import {message as messageDialog} from "antd";
import {push} from "connected-react-router";

const DetailContainer = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);
  const editBook = useCallback((bookId: number) => {
    dispatch(push(`/edit/${bookId}`));
  }, [dispatch]);

  const {id} = useParams();
  const id2 = parseInt(id);

  const { books, error } = useSelector((state: RootState) => state.books);
  if (books == null)
    return null;
  const book = books.find((book) => book.bookId === id2);
  if (id === undefined) {
    messageDialog.error('Please fill out all inputs');
    return null;
  }
  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.

  return (error
      ? <p style={{textAlign: "center"}}>에러 발생!...</p>
      : <Detail book={book} logout={logout} editBook={editBook}/>
  );
};

export default DetailContainer;
