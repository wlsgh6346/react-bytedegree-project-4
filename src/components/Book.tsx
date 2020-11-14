import React from 'react';
import styles from './Book.module.css';
import classNames from 'classnames/bind'
import { BookResType } from '../types';
import {BookOutlined, HomeOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons'
import Moment from 'react-moment';
import {Tooltip, Button} from "antd";

interface BookProps extends BookResType {
  title: string;
  bookId: number;
  author: string;
  createdAt: Date;
  url: string;
  editBook: (bookId: number) => void;
  detailBook: (bookId: number) => void;
  removeBook: (bookId: number) => void;
}

// [project] 컨테이너에 작성된 함수를 컴포넌트에서 이용했다.
// [project] BookResType 의 응답 값을 이용하여, Book 컴포넌트를 완성했다.
const Book: React.FC<BookProps> = ({
    title, bookId, author, createdAt, url, editBook, detailBook, removeBook
                                   }) => {
  return <div className={styles.book}>
    <span className={classNames(styles.title, styles.link_detail_title)}
        onClick={() => detailBook(bookId)}>
      <BookOutlined />{title}
    </span>
    <span
        className={classNames(styles.author, styles.link_detail_author)}
        onClick={() => detailBook(bookId)}>
        {author}
    </span>
    <span className={styles.created}>
      <Moment format={"MM-DD-YYYY HH:mm"}>{createdAt}</Moment> pm
    </span>
    <div className={styles.tooltips}>
      <Tooltip title={url}>
        <Button
            shape={"circle"}
            className={styles.button_url}
            size={"small"}
            type={"primary"}
            onClick={() => detailBook(bookId)}>
          <HomeOutlined />
        </Button>
      </Tooltip>
      <Tooltip title={"Edit"}>
        <Button
            shape={"circle"}
            className={styles.button_edit}
            size={"small"}
            onClick={() => editBook(bookId)}>
          <EditOutlined />
        </Button>
      </Tooltip>
      <Tooltip title={"Delete"}>
        <Button
            shape={"circle"}
            className={styles.button_edit}
            size={"small"}
            type={"danger"}
            onClick={() => removeBook(bookId)}>
          <DeleteOutlined />
        </Button>
      </Tooltip>
    </div>
  </div>;
};

export default Book;
