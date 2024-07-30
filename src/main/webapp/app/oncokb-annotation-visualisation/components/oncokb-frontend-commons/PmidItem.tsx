import { getNCBIlink } from 'cbioportal-frontend-commons';
import * as React from 'react';
import styles from './../oncokb-frontend-commons/citationListGroupItem.module.scss';

type PmidItemProps = {
  title: string;
  author: string;
  source: string;
  date: string;
  pmid: string;
};

const LESS_THAN_ENTITY = '&lt;';
const GREATER_THAN_ENTITY = '&gt;';

function trimOffHtmlTagsByEntity(htmlStr: string) {
  return htmlStr
    .split(LESS_THAN_ENTITY)
    .map((substr, index) => {
      const texts = substr.split(GREATER_THAN_ENTITY);
      return texts.length > 1 ? texts[1] : texts[0];
    })
    .join('');
}

export default class PmidItem extends React.Component<PmidItemProps> {
  render() {
    return (
      <li key={this.props.pmid} className={styles.listGroupItem}>
        <a
          href={getNCBIlink(`/pubmed/${this.props.pmid}`)}
          className={styles.listGroupItemTitle}
          target="_blank"
          rel="noopener noreferrer"
        >
          <b>{trimOffHtmlTagsByEntity(this.props.title)}</b>
        </a>
        <div className={styles.listGroupItemContent}>
          <span>
            {this.props.author} {this.props.source}. {this.props.date}
          </span>
          <span>PMID: {this.props.pmid}</span>
        </div>
      </li>
    );
  }
}
