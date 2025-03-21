import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import MskccLogo from './MskccLogo';

import styles from './Footer.module.scss';
import { CitationText } from 'app/components/CitationText';
import classnames from 'classnames';
import { ContactLink } from 'app/shared/links/ContactLink';
import { API_DOCUMENT_LINK, PAGE_ROUTE } from 'app/config/constants';
import { Linkout } from 'app/shared/links/Linkout';
import ExternalLinkIcon from 'app/shared/icons/ExternalLinkIcon';
import { OncoTreeLink } from 'app/shared/utils/UrlUtils';
import {
  LinkedInLink,
  UserGoogleGroupLink,
} from 'app/shared/links/SocialMediaLinks';

class Footer extends React.Component<{ lastDataUpdate: string }> {
  public get externalLinks() {
    return (
      <>
        <div className={'mb-2'}>
          Please review the{' '}
          <b>
            <Link to={PAGE_ROUTE.TERMS}>terms of use</Link>
          </b>{' '}
          before continuing.
        </div>
        <div className={'mb-2'}>
          <CitationText highlightLinkout={true} boldLinkout />
        </div>
        <div
          className={classnames(
            styles.footerAList,
            'mb-2 d-flex justify-content-center'
          )}
        >
          <ExternalLinkIcon link="https://www.mskcc.org">MSK</ExternalLinkIcon>
          <ExternalLinkIcon link="https://www.mskcc.org/research-areas/programs-centers/molecular-oncology">
            CMO
          </ExternalLinkIcon>
          <ExternalLinkIcon link="https://www.cbioportal.org">
            cBioPortal
          </ExternalLinkIcon>
          <OncoTreeLink />
        </div>
      </>
    );
  }

  public get internalLinks() {
    return (
      <>
        <div className={classnames(styles.footerAList)}>
          <Link to={PAGE_ROUTE.TERMS}>Terms of Use</Link>
          <ContactLink emailSubject={'Contact us'}>Contact Us</ContactLink>
          <LinkedInLink short />
          <Linkout link={API_DOCUMENT_LINK}>API</Linkout>
        </div>
        <div className={classnames(styles.footerAList)}>
          <Link to={PAGE_ROUTE.NEWS}>
            Last data update: {this.props.lastDataUpdate}
          </Link>
        </div>
      </>
    );
  }

  public render() {
    return (
      <footer className={classnames('footer', styles.footer)}>
        <Container>
          <Row className="text-center mb-2">
            <Col>{this.externalLinks}</Col>
          </Row>
          <Row className="text-center">
            <Col
              lg
              md={12}
              className={
                'd-flex flex-column justify-content-center align-items-center my-1'
              }
            >
              {this.internalLinks}
            </Col>
            <Col
              lg
              md={12}
              className={
                'd-flex flex-column justify-content-center align-items-center my-1'
              }
            >
              <MskccLogo imageHeight={50} />
            </Col>
            <Col
              lg
              md={12}
              className={
                'd-flex flex-column justify-content-center align-items-center my-1'
              }
            >
              <div>
                &copy; {new Date().getFullYear()} Memorial Sloan Kettering
                Cancer Center
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}

export default Footer;
