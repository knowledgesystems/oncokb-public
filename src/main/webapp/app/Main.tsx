import * as React from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import { observer } from 'mobx-react';
import AppRoutes from 'app/routes/routes';
import { isAuthorized } from 'app/shared/auth/AuthUtils';
import { Stores } from 'app/App';
import { Prompt, withRouter } from 'react-router';
import {
  AUTHORITIES,
  DEFAULT_FEEDBACK_ANNOTATION,
  NOTIFICATION_TIMEOUT_MILLISECONDS,
  PAGE_ROUTE,
} from 'app/config/constants';
import { ToastContainer } from 'react-toastify';
import { computed } from 'mobx';
import { FeedbackModal } from './components/feedback/FeedbackModal';
import { FdaModal } from 'app/components/fdaModal/FdaModal';
import { Location } from 'history';
import autobind from 'autobind-decorator';
import PageContainer from 'app/components/PageContainer';

export type IMainPage = Stores;

// @ts-ignore
@withRouter
@observer
class Main extends React.Component<IMainPage> {
  @computed get feedbackAnnotation() {
    const annotation = DEFAULT_FEEDBACK_ANNOTATION;
    if (this.props.authenticationStore.account) {
      annotation.email = this.props.authenticationStore.account.email;
      annotation.name = `${this.props.authenticationStore.account.firstName} ${this.props.authenticationStore.account.lastName}`;
    }
    return {
      ...annotation,
      ...this.props.appStore.feedbackAnnotation,
    };
  }

  private FOOTER_ROUTE_EXCLUSION = [PAGE_ROUTE.FAQ_ACCESS];

  @computed
  get showFooter() {
    return !this.FOOTER_ROUTE_EXCLUSION.includes(
      this.props.routing.location.pathname as PAGE_ROUTE
    );
  }

  @autobind
  handleBlockedNavigation(nextLocation: Location): boolean {
    // The clause of includes FDA is very broad. This is used for the Link component.
    if (
      this.props.appStore.inFdaRecognizedContent &&
      !(
        this.props.appStore.toFdaRecognizedContent ||
        (nextLocation.hash || '').includes('FDA')
      )
    ) {
      this.props.appStore.showFdaModal = true;
    }
    return true;
  }

  @autobind
  afterConfirm() {
    this.props.appStore.showFdaModal = false;
    this.props.appStore.inFdaRecognizedContent = false;
    this.props.appStore.toFdaRecognizedContent = false;
  }

  public render() {
    return (
      <div className="Main">
        <ToastContainer
          position="top-center"
          autoClose={NOTIFICATION_TIMEOUT_MILLISECONDS}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Header
          isUserAuthenticated={
            this.props.authenticationStore.isUserAuthenticated
          }
          isAdmin={
            this.props.authenticationStore.isUserAuthenticated &&
            isAuthorized(
              this.props.authenticationStore.account
                ? this.props.authenticationStore.account.authorities
                : [],
              [AUTHORITIES.ADMIN]
            )
          }
          ribbonEnv={''}
          isInProduction={false}
          isSwaggerEnabled
          windowStore={this.props.windowStore}
          authStore={this.props.authenticationStore}
          routing={this.props.routing}
          appStore={this.props.appStore}
        />
        <AppRoutes
          authenticationStore={this.props.authenticationStore}
          appStore={this.props.appStore}
          routing={this.props.routing}
          windowStore={this.props.windowStore}
        />
        <FeedbackModal
          showModal={this.props.appStore.showFeedbackFormModal}
          feedback={this.feedbackAnnotation}
          onHideModal={() => {
            this.props.appStore.showFeedbackFormModal = false;
            this.props.appStore.feedbackAnnotation = undefined;
          }}
        />
        <Prompt
          when={this.props.appStore.inFdaRecognizedContent}
          message={this.handleBlockedNavigation}
        />
        <FdaModal
          routing={this.props.routing}
          show={this.props.appStore.showFdaModal}
          onHide={this.afterConfirm}
          lastLocation={this.props.appStore.fdaRedirectLastLocation}
        />
        {this.showFooter && (
          <Footer
            lastDataUpdate={this.props.appStore.appInfo.result.dataVersion.date}
          />
        )}
      </div>
    );
  }
}

export default Main;
