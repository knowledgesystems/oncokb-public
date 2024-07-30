import * as React from 'react';
import { ArticleAbstract } from '../../config/oncokbAPI';
import styles from './citationListGroupItem.module.scss';

export default class ArticleAbstractItem extends React.Component<
  ArticleAbstract
> {
  render() {
    let content = <b>{this.props.abstract}</b>;
    if (this.props.link) {
      content = (
        <a href={this.props.link} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }
    return (
      <li
        key={`abstract_${this.props.abstract}`}
        className={styles.listGroupItem}
      >
        <span className={styles.listGroupItemTitle}>{content}</span>
      </li>
    );
  }
}
