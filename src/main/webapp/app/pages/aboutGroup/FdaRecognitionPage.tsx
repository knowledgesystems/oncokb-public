import {
  PAGE_TITLE,
  FdaRecognitionDisclaimer,
  LEVEL_TYPES,
  ONCOKB_TM,
  PAGE_ROUTE,
} from 'app/config/constants';
import React from 'react';
import DocumentTitle from 'react-document-title';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Linkout } from 'app/shared/links/Linkout';
import { Version } from 'app/pages/LevelOfEvidencePage';
import {
  getActionableGenesPageLink,
  getLoEPageLink,
  SopPageLink,
} from 'app/shared/utils/UrlUtils';
import { getPageTitle } from 'app/shared/utils/Utils';

const FdaRecognitionPage = () => {
  return (
    <DocumentTitle title={getPageTitle(PAGE_TITLE.FDA_RECOGNITION)}>
      <div className="fda-recognition">
        <Row>
          <Col>
            <h4>{PAGE_TITLE.FDA_RECOGNITION}</h4>
            <p>
              <i>
                <FdaRecognitionDisclaimer enableLink={false} />
              </i>
            </p>
            <p>
              In October 2021, {ONCOKB_TM} became the first somatic human
              variant database to be recognized by the FDA. FDA recognition of{' '}
              {ONCOKB_TM} is "partial" and is limited to the information
              provided in the "FDA-Recognized Content" tab which can be found on
              the{' '}
              <Link to={getActionableGenesPageLink(undefined, LEVEL_TYPES.FDA)}>
                Actionable Genes
              </Link>{' '}
              page and on each individual gene page within {ONCOKB_TM}.
            </p>
            <p>
              As background, in April 2018, the FDA announced their regulatory
              approach for the{' '}
              <Linkout link={'https://www.fda.gov/media/99200/download'}>
                Use of Public Human Genetic Variant Database
              </Linkout>{' '}
              to support the Agency's precision medicine initiatives. "The goal
              of this effort is to help ensure patients receive accurate,
              reliable, and clinically meaningful test results, while promoting
              innovation in test development".
            </p>
            <p>
              Data and assertions within an FDA-recognized database are
              considered valid scientific evidence that can be used to
              streamline the next generation sequencing (NGS)-based tumor
              profiling test development and validation processes. FDA
              recognition also incentivizes human variant data-sharing by
              recognizing the importance of transparency and peer-review for
              accurate human variant interpretation and pathogenicity
              classification. Thus, all data in an FDA-recognized human variant
              database is expected to be publicly accessible, including the
              variant curation and interpretation processes as well as the
              curated evidence to support the final variant classifications.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <h5>Important Database Links</h5>
            <ul>
              <li>
                <SopPageLink version={2.0} />
              </li>
              <li>
                <Link to={getLoEPageLink(Version.FDA)}>
                  Mapping to the FDA Levels of Evidence
                </Link>
              </li>
              <li>
                <Link to={PAGE_ROUTE.FAQ_ACCESS}>
                  FAQs about FDA Recognition
                </Link>
              </li>
              <li>
                For a full list of FDA recognized variants in {ONCOKB_TM} please
                see the{' '}
                <Link
                  to={getActionableGenesPageLink(undefined, LEVEL_TYPES.FDA)}
                >
                  Actionable Genes
                </Link>{' '}
                page
              </li>
            </ul>
            <h5>{ONCOKB_TM} Application Links</h5>
            <ul>
              <li>
                <Linkout
                  link={`content/files/fdaRecognition/OncoKB_FDA_Recognition_Recognition_Letter.pdf`}
                >
                  FDA Recognition Letter
                </Linkout>
              </li>
              <li>
                <Linkout link={`https://www.fda.gov/media/152847/download`}>
                  FDA Decision Summary for {ONCOKB_TM}
                </Linkout>
              </li>
            </ul>
            <h5>Press Releases</h5>
            <ul>
              <li>
                <Linkout
                  link={
                    'https://www.fda.gov/drugs/resources-information-approved-drugs/fda-recognizes-memorial-sloan-kettering-database-molecular-tumor-marker-information'
                  }
                >
                  FDA Recognition Announcement
                </Linkout>
              </li>
              <li>
                <Linkout
                  link={
                    'https://www.mskcc.org/news-releases/fda-grants-partial-recognition-status-mskcc-precision-oncology-knowledge-database'
                  }
                >
                  MSK Press Release
                </Linkout>
              </li>
              <li>
                <Linkout
                  link={
                    'https://ascopost.com/news/october-2021/fda-recognizes-memorial-sloan-kettering-database-of-molecular-tumor-marker-information'
                  }
                >
                  ASCO Post Update
                </Linkout>
              </li>
            </ul>
          </Col>
          <Col md={7}>
            <h5>Scope of {ONCOKB_TM} Recognition</h5>
            <p>
              The FDA has reviewed all {ONCOKB_TM} processes documented in the{' '}
              <SopPageLink version={2.0} />, which include the following:
            </p>
            <ol>
              <li>
                Part of the {ONCOKB_TM} annotation content: Annotation of
                variants curated in {ONCOKB_TM} with an FDA level of evidence.
                FDA-recognized content is clearly marked on the website and a
                pop-up message will appear when the user exits an FDA-recognized
                portion of the
                {ONCOKB_TM} website.
              </li>
              <li>
                Mapping of {ONCOKB_TM} levels of evidence to the FDA levels of
                evidence.
              </li>
              <li>
                {ONCOKB_TM}'s processes and validation studies for variant
                evaluation and assertion, data integrity and security, and
                transparency of all evidence.
              </li>
              <li>
                {ONCOKB_TM}'s administration policies for hiring, training and
                continuing the education of its curators and Scientific Content
                Management Team who evaluate and approve inclusion of variants
                into the database.
              </li>
              <li>{ONCOKB_TM}'s policies of oversight and governance.</li>
              <li>
                {ONCOKB_TM}'s processes for ensuring its members' conflicts of
                interest are minimized and transparent.
              </li>
            </ol>
          </Col>
        </Row>
      </div>
    </DocumentTitle>
  );
};
export default FdaRecognitionPage;
