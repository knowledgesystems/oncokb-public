import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import {
  DOCUMENT_TITLES,
  PAGE_ROUTE,
  YEAR_END_REVIEW_TITLE_DATE_FORMAT,
  YEAR_END_REVIEW_DATE_FORMAT,
} from 'app/config/constants';
import HashLink from 'app/shared/links/HashLink';
import { useEffect, useState } from 'react';
import moment from 'moment/moment';
import { BiomarkerTable } from 'app/pages/yearEndReviewPage/BiomarkerTable';
import { YEAR_END_REVIEW_RANGE } from 'app/pages/aboutGroup/AboutPageNavTab';
import { DATA } from 'app/pages/yearEndReviewPage/BiomarkerTableData';
import { scrollWidthOffset } from 'app/shared/utils/Utils';

const getTitle = (date: string) => {
  return moment(date, YEAR_END_REVIEW_DATE_FORMAT).format(
    YEAR_END_REVIEW_TITLE_DATE_FORMAT
  );
};

export const YearEndReviewPage: React.FunctionComponent<{
  selectedYear?: string;
}> = props => {
  const [showAnchor, setShowAnchor] = useState(false);

  useEffect(() => {
    // let the element prints before scrolling
    setTimeout(() => {
      if (props.selectedYear) {
        const element = document.getElementById(props.selectedYear);
        scrollWidthOffset(element);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 200);
  }, [props.selectedYear]);

  return (
    <DocumentTitle title={DOCUMENT_TITLES.YEAR_END_REVIEW}>
      <div>
        <Row>
          <Col>
            <h4>Year End Review</h4>
          </Col>
        </Row>
        {YEAR_END_REVIEW_RANGE.map(year => (
          <Row key={`year-end-review-row-${year}`}>
            <Col>
              <h5
                id={year}
                onMouseEnter={() => setShowAnchor(true)}
                onMouseLeave={() => setShowAnchor(false)}
              >
                {getTitle(year)}
                <HashLink
                  path={PAGE_ROUTE.YEAR_END_REVIEW}
                  hash={year}
                  show={showAnchor}
                />
              </h5>
              <div className={'mb-3'}>
                <BiomarkerTable
                  tableKey={`biomarker-table-${year}`}
                  year={year}
                  data={DATA['2022']}
                />
              </div>
            </Col>
          </Row>
        ))}
      </div>
    </DocumentTitle>
  );
};
