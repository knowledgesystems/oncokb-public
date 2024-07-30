import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react';
import { remoteData } from 'cbioportal-frontend-commons';
import request from 'superagent';
import LoadingIndicator from '../loadingIndicator/LoadingIndicator';
import { ArticleAbstract } from '../../config/constants';
import _ from 'lodash';
import PmidItem from './PmidItem';
import ArticleAbstractItem from './ArticleAbstractItem';
import { TOOLTIP_MAX_HEIGHT } from '../../config/constants';

@observer
export class CitationTooltip extends React.Component<
  { pmids: string[]; abstracts: ArticleAbstract[]; style?: CSSProperties },
  {}
> {
  readonly citationContent = remoteData<any>({
    invoke: async () => {
      const result = await request.get(
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=' +
          this.props.pmids.join(',')
      );
      return Promise.resolve(result.body);
    },
  });

  findContent(pmid: string) {
    return this.citationContent.result.result[pmid];
  }

  getPmidItems() {
    return this.props.pmids.map(pmid => {
      const data = this.findContent(pmid);
      return data ? (
        <PmidItem
          key={pmid}
          title={data.title}
          author={
            _.isArray(data.authors) && data.authors.length > 0
              ? data.authors[0].name + ' et al.'
              : 'Unknown'
          }
          source={data.source}
          date={new Date(data.pubdate).getFullYear().toString()}
          pmid={data.uid}
        />
      ) : null;
    });
  }

  render() {
    const style = {
      maxHeight: TOOLTIP_MAX_HEIGHT,
      overflowY: 'scroll',
      ...this.props.style,
    } as CSSProperties;
    return (
      <div>
        {this.citationContent.isPending ? (
          <LoadingIndicator isLoading={true} />
        ) : (
          <div style={style}>
            {this.getPmidItems()}
            {this.props.abstracts.map(abstract => (
              <ArticleAbstractItem
                key={abstract.abstract}
                abstract={abstract.abstract}
                link={abstract.link}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}
