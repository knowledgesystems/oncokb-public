import { Redirect, Switch } from 'react-router-dom';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Login from 'app/components/login/LoginPage';
import { Logout } from 'app/components/login/logout';
import { PrivateRoute } from 'app/shared/auth/private-route';
import { AUTHORITIES, PAGE_ROUTE } from 'app/config/constants';
import HomePage from 'app/pages/HomePage';
import AuthenticationStore from 'app/store/AuthenticationStore';
import CancerGenesPage from 'app/pages/CancerGenesPage';
import ActionableGenesPage from 'app/pages/actionableGenesPage/ActionableGenesPage';
import { RouterStore } from 'mobx-react-router';
import SomaticGermlineGenePage from 'app/pages/genePage/SomaticGermlineGenePage';
import AlterationPage from 'app/pages/alterationPage/AlterationPage';
import { AccountPage } from 'app/pages/AccountPage';
import ActivateAccount from 'app/components/account/ActivateAccount';
import { PasswordResetInit } from 'app/components/account/PasswordResetInit';
import PasswordResetFinish from 'app/components/account/PasswordResetFinish';
import PageNotFound from 'app/shared/error/page-not-found';
import AccountPassword from 'app/components/account/AccountPassword';
import AdminRoutes from 'app/routes/AdminRoutes';
import React from 'react';
import LevelOfEvidencePage, { Version } from 'app/pages/LevelOfEvidencePage';
import { RecaptchaBoundaryRoute } from '../shared/auth/RecaptchaBoundaryRoute';
import GenomicPage from 'app/pages/genomicPage/GenomicPage';
import UserPage from 'app/pages/userPage/UserPage';
import AppStore from 'app/store/AppStore';
import ActivateTrialFinish from 'app/components/account/ActivateTrialFinish';
import CompanyPage from 'app/pages/companyPage/CompanyPage';
import { CreateCompanyUsersPage } from 'app/pages/CreateCompanyUsersPage';
import { AboutPageNavTab } from 'app/pages/aboutGroup/AboutPageNavTab';
import { ApiAccessPageNavTab } from 'app/pages/apiAccessGroup/ApiAccessPageNavTab';
import FAQPage from 'app/pages/FAQPage';
import ReadOnlyMode from 'app/shared/readonly/ReadOnlyMode';
import * as QueryString from 'query-string';
import OncologyTherapiesPage from 'app/pages/oncologyTherapiesPage/oncologyTherapiesPage';
import { NewsPageNavTab } from 'app/pages/newsPage/NewsPageNavTab';
import CompanionDiagnosticDevicePage from 'app/pages/companionDiagnosticDevicesPage/companionDiagnosticDevicePage';
import OncokbRoute from 'app/shared/route/OncokbRoute';
import GenePage from 'app/pages/genePage/GenePage';

const getOldLevelsRedirectRoute = (hash: string) => {
  const queryStrings = QueryString.parse(hash) as {
    version: Version;
  };
  const redirectPath = {
    pathname: PAGE_ROUTE.V2,
    hash: '',
  };
  if (queryStrings.version) {
    switch (queryStrings.version) {
      case Version.DX:
        redirectPath.pathname = PAGE_ROUTE.DX;
        break;
      case Version.PX:
        redirectPath.pathname = PAGE_ROUTE.PX;
        break;
      case Version.FDA_NGS:
        redirectPath.pathname = PAGE_ROUTE.FDA_NGS;
        break;
      default:
        redirectPath.hash = window.location.hash;
        break;
    }
  }
  return <Redirect to={redirectPath} />;
};

const AppRoutes = (props: {
  authenticationStore: AuthenticationStore;
  appStore: AppStore;
  routing: RouterStore;
}) => {
  // Redirect needs to be defined first
  return (
    <Switch>
      <OncokbRoute exact path={PAGE_ROUTE.HOME} component={HomePage} />
      <Redirect exact from={'/updates'} to={PAGE_ROUTE.NEWS} />
      <Redirect exact from={'/genes'} to={PAGE_ROUTE.CANCER_GENES} />
      <Redirect
        from={PAGE_ROUTE.LEGACY_ACTIONABLE_GENE}
        to={{
          pathname: PAGE_ROUTE.ACTIONABLE_GENE,
          search: props.routing.location.search,
          hash: props.routing.location.hash,
        }}
      />
      <Redirect
        exact
        from={PAGE_ROUTE.LEGACY_API_ACCESS}
        to={PAGE_ROUTE.API_ACCESS}
      />
      <Redirect
        exact
        from={PAGE_ROUTE.LEGACY_DATA_ACCESS}
        to={PAGE_ROUTE.API_ACCESS}
      />
      <Redirect
        exact
        from={PAGE_ROUTE.LEGACY_CANCER_GENES}
        to={PAGE_ROUTE.CANCER_GENES}
      />
      <Redirect
        exact
        from={'/gene/:hugoSymbol/alteration/:alteration'}
        to={PAGE_ROUTE.ALTERATION}
      />
      <Redirect
        exact
        from={'/gene/:hugoSymbol/variant/:alteration'}
        to={PAGE_ROUTE.ALTERATION}
      />
      <Redirect exact from={PAGE_ROUTE.PO_TX} to={PAGE_ROUTE.ONCOLOGY_TX} />
      <Switch>
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.LOGIN}
          component={Login}
        />
        <ErrorBoundaryRoute exact path={PAGE_ROUTE.LOGOUT} component={Logout} />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.REGISTER}
          component={ApiAccessPageNavTab}
        />
        <ErrorBoundaryRoute
          exact
          path={PAGE_ROUTE.API_ACCESS}
          component={ApiAccessPageNavTab}
        />
        <ErrorBoundaryRoute
          exact
          path={PAGE_ROUTE.FAQ_ACCESS}
          component={FAQPage}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.CANCER_GENES}
          component={CancerGenesPage}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.ACTIONABLE_GENE}
          component={ActionableGenesPage}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.ONCOLOGY_TX}
          component={OncologyTherapiesPage}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.CDX}
          component={CompanionDiagnosticDevicePage}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.GENE}
          component={GenePage}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.SOMATIC_GENE}
          component={SomaticGermlineGenePage}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.GERMLINE_GENE}
          component={SomaticGermlineGenePage}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.ALTERATION}
          component={AlterationPage}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.HGVSG_WITH_QUERY}
          component={GenomicPage}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.GENOMIC_CHANGE_WITH_QUERY}
          component={GenomicPage}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.ALTERATION_TUMOR_TYPE}
          component={AlterationPage}
        />
        <OncokbRoute
          exact
          path={PAGE_ROUTE.ABOUT}
          component={AboutPageNavTab}
        />
        <OncokbRoute exact path={PAGE_ROUTE.TEAM} component={AboutPageNavTab} />
        <OncokbRoute exact path={PAGE_ROUTE.SOP} component={AboutPageNavTab} />
        <OncokbRoute
          exact
          path={PAGE_ROUTE.PRIVACY}
          component={AboutPageNavTab}
        />
        <OncokbRoute
          exact
          path={PAGE_ROUTE.YEAR_END_SUMMARY}
          component={NewsPageNavTab}
        />
        <OncokbRoute exact path={PAGE_ROUTE.NEWS} component={NewsPageNavTab} />
        <OncokbRoute
          exact
          path={PAGE_ROUTE.FDA_RECOGNITION}
          component={AboutPageNavTab}
        />
        <OncokbRoute
          exact
          path={PAGE_ROUTE.TERMS}
          component={ApiAccessPageNavTab}
        />
        <OncokbRoute exact path={PAGE_ROUTE.LEVELS}>
          {getOldLevelsRedirectRoute(window.location.hash)}
        </OncokbRoute>
        <OncokbRoute
          exact
          path={PAGE_ROUTE.DX}
          component={LevelOfEvidencePage}
        />
        <OncokbRoute
          exact
          path={PAGE_ROUTE.PX}
          component={LevelOfEvidencePage}
        />
        <OncokbRoute
          exact
          path={PAGE_ROUTE.V2}
          component={LevelOfEvidencePage}
        />
        <OncokbRoute
          exact
          path={PAGE_ROUTE.FDA_NGS}
          component={LevelOfEvidencePage}
        />

        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.ACCOUNT_VERIFY}
          render={ReadOnlyMode(ActivateAccount)}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.ACCOUNT_PASSWORD_RESET_REQUEST}
          render={ReadOnlyMode(PasswordResetInit)}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={props.authenticationStore.isUserAuthenticated}
          appStore={props.appStore}
          path={PAGE_ROUTE.ACCOUNT_PASSWORD_RESET_FINISH}
          render={ReadOnlyMode(PasswordResetFinish)}
        />
        <RecaptchaBoundaryRoute
          exact
          isUserAuthenticated={false}
          appStore={props.appStore}
          path={PAGE_ROUTE.ACCOUNT_ACTIVE_TRIAL_FINISH}
          render={ReadOnlyMode(ActivateTrialFinish)}
        />
        <PrivateRoute
          authenticationStore={props.authenticationStore}
          routing={props.routing}
          path={PAGE_ROUTE.ADMIN}
          component={AdminRoutes}
          hasAnyAuthorities={[AUTHORITIES.ADMIN]}
        />
        <PrivateRoute
          exact
          authenticationStore={props.authenticationStore}
          routing={props.routing}
          path={PAGE_ROUTE.ACCOUNT_PASSWORD}
          render={ReadOnlyMode(AccountPassword)}
          hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}
        />
        <PrivateRoute
          exact
          path={PAGE_ROUTE.ACCOUNT_SETTINGS}
          authenticationStore={props.authenticationStore}
          routing={props.routing}
          component={AccountPage}
          hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}
        />
        <PrivateRoute
          exact
          path={PAGE_ROUTE.USER}
          authenticationStore={props.authenticationStore}
          routing={props.routing}
          render={ReadOnlyMode(UserPage, true)}
          hasAnyAuthorities={[AUTHORITIES.ADMIN]}
        />
        <PrivateRoute
          exact
          path={PAGE_ROUTE.COMPANY}
          authenticationStore={props.authenticationStore}
          routing={props.routing}
          render={ReadOnlyMode(CompanyPage, true)}
          hasAnyAuthorities={[AUTHORITIES.ADMIN]}
        />
        <PrivateRoute
          exact
          path={PAGE_ROUTE.CREATE_COMPANY_USERS}
          authenticationStore={props.authenticationStore}
          routing={props.routing}
          render={ReadOnlyMode(CreateCompanyUsersPage)}
          hasAnyAuthorities={[AUTHORITIES.ADMIN]}
        />
        <ErrorBoundaryRoute component={PageNotFound} />
      </Switch>
    </Switch>
  );
};
export default AppRoutes;
