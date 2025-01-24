import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Row, Col } from 'react-bootstrap';
import { getPageTitle } from 'app/shared/utils/Utils';
import { PAGE_TITLE, PAGE_DESCRIPTION, ONCOKB_TM } from 'app/config/constants';
import styles from './PrivacyPage.module.scss';
import classNames from 'classnames';

const tempText = `Lorem ipsum odor amet, consectetuer adipiscing elit. Erat montes dolor faucibus vehicula nec consectetur habitasse per. Suspendisse per ligula per eros blandit nunc amet. Montes nisi ultricies primis finibus malesuada natoque. Dictumst amet cras egestas sodales lectus. Est cubilia est fermentum augue id arcu. Magna dolor dui lorem class tincidunt auctor. Nulla lectus commodo non per quisque ante maecenas platea. Mollis etiam sollicitudin id cras himenaeos aliquet.`;

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>{getPageTitle(PAGE_TITLE.PRIVACY)}</title>
        <meta name="description" content={PAGE_DESCRIPTION.PRIVACY}></meta>
      </Helmet>
      <Row>
        <Col className={classNames(styles.trackerList)}>
          <h2 className="mt-1">
            {ONCOKB_TM} Digital Tracker Governance Privacy Policy
          </h2>
          <section>
            <h3>1. Introduction</h3>
            <p>{tempText}</p>
          </section>
          <section>
            <h3>2. Applicability</h3>
            <p>{tempText}</p>
          </section>
          <section>
            <h3>3. Policy</h3>
            <section>
              <h4>A. Minimum Legal Requirements</h4>
              <p>{tempText}</p>
              <p>{tempText}</p>
              <p>{tempText}</p>
              <p>{tempText}</p>
              <section>
                <h5>User in the United States</h5>
                <p>{tempText}</p>
              </section>
              <section>
                <h5>Users visiting from outside the United States</h5>
                <p>{tempText}</p>
              </section>
              <section>
                <h5>Exception for Strictly Necessary Trackers</h5>
                <p>{tempText}</p>
              </section>
            </section>
            <section>
              <h4>B. Minimum Required Platform Capabilities</h4>
              <p>{tempText}</p>
              <section>
                <h5>Banner/Notice Functionality</h5>
                <p>{tempText}</p>
              </section>
              <section>
                <h5>Tracker Classification</h5>
                <p>{tempText}</p>
                <ul>
                  <li>
                    <b>
                      <em>Strictly Necessary: </em>
                    </b>
                    {tempText}
                  </li>
                  <li>
                    <b>
                      <em>Performance: </em>
                    </b>
                    {tempText}
                  </li>
                  <li>
                    <b>
                      <em>Functionality: </em>
                    </b>
                    {tempText}
                  </li>
                  <li>
                    <b>
                      <em>Marketing: </em>
                    </b>
                    {tempText}
                  </li>
                </ul>
                <p>{tempText}</p>
              </section>
              <section>
                <h5>Cross-Domain Consent Tracking</h5>
                <p>{tempText}</p>
              </section>
              <section>
                <h5>Ongoing Scanning and Monitoring</h5>
                <p>{tempText}</p>
              </section>
            </section>
            <section>
              <h4>C. Ownership</h4>
              <p>{tempText}</p>
            </section>
            <section>
              <h4>D. Deployment and Monitoring</h4>
              <p>{tempText}</p>
              <section>
                <h5>MSK Properties</h5>
                <p>{tempText}</p>
              </section>
              <section>
                <h5>Detecting and Controlling Trackers</h5>
                <p>{tempText}</p>
              </section>
              <section>
                <h5>Ongoing Human Oversight</h5>
                <p>{tempText}</p>
              </section>
            </section>
            <section>
              <h4>E. Authenticated MSK Properties</h4>
              <p>{tempText}</p>
            </section>
            <section>
              <h4>F. Unauthenticated MSK Properties</h4>
              <p>{tempText}</p>
            </section>
            <section>
              <h4>G. Privacy Policies</h4>
              <p>{tempText}</p>
              <p>{tempText}</p>
            </section>
            <section>
              <h4>H. Consultation with Privacy-Legal Team</h4>
              <p>{tempText}</p>
              <p>{tempText}</p>
            </section>
          </section>
          <section>
            <h3>4. Reference &amp; Related Policies</h3>
            <ul>
              <li>{tempText}</li>
              <li>{tempText}</li>
              <li>{tempText}</li>
            </ul>
          </section>
        </Col>
      </Row>
    </>
  );
}
