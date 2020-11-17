import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import List from '../components/List';
import { logout as logoutSaga } from '../redux/modules/auth';
import { push } from 'connected-react-router';
import {getBooksList, removeBook} from "../redux/modules/books";
import {RootState} from "../redux/modules/rootReducer";

const ListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const goAdd = useCallback(() => {
    dispatch(push('/add'));
  }, [dispatch]);

  const editBook = useCallback((bookId: number) => {
    dispatch(push(`/edit/${bookId}`));
  }, [dispatch]);

  const detailBook = useCallback((bookId: number) => {
    dispatch(push(`/book/${bookId}`));
  }, [dispatch]);

  const onRemove = useCallback((bookId: number) => {
    dispatch(removeBook(bookId));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.

  const { books, loading, error } = useSelector((state: RootState) => state.books);
  useEffect(() => {
    if (books)
      return;
    dispatch(getBooksList());
  }, [dispatch, books]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생!</div>;
  if (!books) return null;
  return <List books={books} loading={loading} goAdd={goAdd}
                  editBook={editBook}
                  detailBook={detailBook}
                  removeBook={onRemove}
                  logout={logout} />
};

export default ListContainer;
