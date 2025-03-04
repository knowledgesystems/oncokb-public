import * as React from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import AppStore from 'app/store/AppStore';
import { inject, observer } from 'mobx-react';
import { ONCOKB_TM, PAGE_ROUTE, PAGE_TITLE } from 'app/config/constants';
import { computed, IReactionDisposer, observable, reaction } from 'mobx';
import { RouterStore } from 'mobx-react-router';
import { AboutPage } from 'app/pages/AboutPage';
import { TeamPage } from 'app/pages/teamPage/TeamPage';
import Iframe from 'react-iframe';
import FdaRecognitionPage from 'app/pages/aboutGroup/FdaRecognitionPage';
import { LocationDescriptorObject } from 'history';
import classnames from 'classnames';
import { getPageTitle } from 'app/shared/utils/Utils';
import { Helmet } from 'react-helmet-async';
import PrivacyPage from '../PrivacyPage';

type AboutPageNavTabProps = { appStore: AppStore; routing: RouterStore };

export enum TabKey {
  ABOUT = PAGE_ROUTE.ABOUT,
  TEAM = PAGE_ROUTE.TEAM,
  FDA_RECOGNITION = PAGE_ROUTE.FDA_RECOGNITION,
  SOP = PAGE_ROUTE.SOP,
  PRIVACY = PAGE_ROUTE.PRIVACY,
}

const YEAR_END_SUMMARY_KEY_DIVIDER = '+';

@inject('appStore', 'routing')
@observer
export class AboutPageNavTab extends React.Component<AboutPageNavTabProps> {
  readonly reactions: IReactionDisposer[] = [];

  @observable selectedTab: string = TabKey.ABOUT.toString();

  constructor(props: AboutPageNavTabProps) {
    super(props);
    reaction(
      () => this.selectedTab,
      newSelectedTab => {
        this.props.routing.history.push(
          this.getHistoryBySelectedTab(newSelectedTab)
        );
      }
    ),
      reaction(
        () => [props.routing.location.pathname],
        ([pathName]) => {
          const lowerCasePathName = pathName.toLowerCase();
          if (Object.keys(TabKey).includes(lowerCasePathName)) {
            this.selectedTab = lowerCasePathName;
          }
        },
        { fireImmediately: true }
      );
  }

  @computed
  get inYearEndSummarySection() {
    return this.selectedTab.startsWith(PAGE_ROUTE.YEAR_END_SUMMARY);
  }

  getHistoryBySelectedTab(newSelectedTab: string): LocationDescriptorObject {
    return {
      pathname: newSelectedTab,
    };
  }

  componentWillUnmount() {
    this.reactions.forEach(componentReaction => componentReaction());
  }

  render() {
    return (
      <>
        <Tab.Container
          id="about-page-nav-tabs"
          activeKey={this.selectedTab}
          unmountOnExit
          onSelect={(selectedTab: string) => {
            this.selectedTab = selectedTab as any;
          }}
        >
          <Row>
            <Col sm={2}>
              <Nav
                variant="pills"
                className={classnames(
                  'flex-column',
                  'sticky-top',
                  'sticky-panel-relevant-to-header',
                  'mb-3'
                )}
              >
                <Nav.Item>
                  <Nav.Link eventKey={TabKey.ABOUT}>About</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={TabKey.TEAM}>Team</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={TabKey.FDA_RECOGNITION}>
                    FDA Recognition
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={TabKey.SOP}>SOP</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={TabKey.PRIVACY}>Privacy</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey={TabKey.ABOUT}>
                  <AboutPage
                    appStore={this.props.appStore}
                    routing={this.props.routing}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey={TabKey.TEAM}>
                  <TeamPage />
                </Tab.Pane>
                <Tab.Pane eventKey={TabKey.FDA_RECOGNITION}>
                  <FdaRecognitionPage />
                </Tab.Pane>
                <Tab.Pane eventKey={TabKey.SOP}>
                  <div>
                    <Helmet>
                      <title>{getPageTitle(PAGE_TITLE.SOP)}</title>
                    </Helmet>
                    <div style={{ marginTop: '-5px' }}>
                      <Iframe
                        width="100%"
                        height="1000px"
                        url="https://sop.oncokb.org"
                        frameBorder={0}
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <h2 style={{ position: 'absolute', top: 0 }}>
                      {ONCOKB_TM} Standard Operating Procedure
                    </h2>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey={TabKey.PRIVACY}>
                  <PrivacyPage />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </>
    );
  }
}
