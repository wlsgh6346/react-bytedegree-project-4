import {BookReqType, BookResType} from '../../types';
import {ActionType, createAsyncAction, createReducer} from "typesafe-actions";
import { AxiosError } from "axios";
import {call, put, select, takeEvery} from 'redux-saga/effects';
import { deprecated } from 'typesafe-actions';
import BookService from "../../services/BookService";
import {getBooksFromState, getTokenFromState} from "../utils";
import {fail} from "./auth";
import {push} from "connected-react-router";
const { createStandardAction } = deprecated;

export interface BooksState {
  books: BookResType[] | null;
  loading: boolean;
  error: Error | null;
}

const initialState: BooksState = {
  books: null,
  loading: false,
  error: null,
};

// Action
const ADD_BOOK = 'my_books/books/ADD_BOOK'; // 책 추가하기
const EDIT_BOOK = 'my_books/books/EDIT_BOOK'; // 책 수정하기
const GET_BOOKS_LIST = 'my_books/books/GET_BOOKS_LIST'; // 책 목록 가져오기
const REMOVE_BOOK = 'my_books/books/REMOVE_BOOK' // 책 삭제하기
const BOOKS_PENDING = 'my-books/books/BOOKS_PENDING';
const BOOKS_SUCCESS = 'my-books/books/BOOKS_SUCCESS';
const BOOKS_FAIL = 'my-books/books/BOOKS_FAIL';

// [project] redux-action 을 이용하여, books 모듈의 액션 생성 함수와 리듀서를 작성했다.
// 액션 생성 함수
export const booksAsync = createAsyncAction(
    BOOKS_PENDING,
    BOOKS_SUCCESS,
    BOOKS_FAIL
)<undefined, BookResType[], AxiosError>();

export const getBooksList = createStandardAction(GET_BOOKS_LIST)();
export const addBook = createStandardAction(ADD_BOOK)<BookReqType>();
export const editBook = createStandardAction(EDIT_BOOK)<BookReqType>();
export const removeBook = createStandardAction(REMOVE_BOOK)<number>();

const actions = { booksAsync, getBooksList, addBook, editBook, removeBook };

type BooksAction = ActionType<typeof actions>;

// 리듀서
const reducer = createReducer<BooksState, BooksAction>(initialState, {
  [BOOKS_PENDING]: (state) => ({
    loading: true,
    books: state.books,
    error: null
  }),
  [BOOKS_SUCCESS]: (state, action) => ({
    loading: false,
    books: action.payload,
    error: null
  }),
  [BOOKS_FAIL]: (state, action) => ({
    loading: false,
    books: null,
    error: action.payload
  })
});

// [project] 책 목록을 가져오는 saga 함수를 작성했다.
function* getBooksListSaga(action: ReturnType<typeof getBooksList>) {
  try {
    yield put(booksAsync.request());

    const token: string = yield select(getTokenFromState);
    const booksList: BookResType[] = yield call(BookService.getBooks, token);

    yield put(booksAsync.success(booksList));
  }
  catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'BOOKS_LIST_ERROR')));
  }
}

// [project] 책을 추가하는 saga 함수를 작성했다.
function* addBookSaga(action: ReturnType<typeof addBook>) {
  try {
    yield put(booksAsync.request());

    const token: string = yield select(getTokenFromState);
    const booksList: BookResType[] = yield select(getBooksFromState);
    const addBook: BookResType = yield call(BookService.addBook, token, action.payload);

    yield put(booksAsync.success([...booksList, addBook]));
    yield put(push('/'));
  }
  catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'ADD_BOOK_ERROR')));
  }
}

// [project] 책을 수정하는 saga 함수를 작성했다.
function* editBookSaga(action: ReturnType<typeof editBook>) {
  try {
    yield put(booksAsync.request());

    const token: string = yield select(getTokenFromState);
    const booksList: BookResType[] = yield select(getBooksFromState);
    const editBook: BookResType = yield call(BookService.editBook,
        token,
        action.payload.bookId,
        action.payload
    );

    const editedBooksList = booksList.map(book =>
      book.bookId === editBook.bookId ? editBook : book
    );

    yield put(booksAsync.success(editedBooksList));
    yield put(push('/'));
  }
  catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'EDIT_BOOK_ERROR')));
  }
}

// [project] 책을 삭제하는 saga 함수를 작성했다.
function* removeBookSaga(action: ReturnType<typeof removeBook>) {
  try {
    yield put(booksAsync.request());
    const token: string = yield select(getTokenFromState);
    const booksList: BookResType[] = yield call(BookService.getBooks, token);

    yield call(BookService.deleteBook, token, action.payload);

    const deletedBooksList = booksList.filter(book =>
      book.bookId !== action.payload
    );

    yield put(booksAsync.success(deletedBooksList));
    yield put(push('/'));
  }
  catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'DELETE_BOOK_ERROR')));
  }
}

// [project] saga 함수를 실행하는 액션과 액션 생성 함수를 작성했다.
export function* sagas() {
  yield takeEvery(getBooksList, getBooksListSaga);
  yield takeEvery(addBook, addBookSaga);
  yield takeEvery(editBook, editBookSaga);
  yield takeEvery(removeBook, removeBookSaga);
}

export default reducer;






