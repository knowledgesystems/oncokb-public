import React from 'react';
import { ErrorBoundaryRoute } from 'app/shared/error/error-boundary-route';
import { PAGE_ROUTE } from 'app/config/constants';
import { Switch } from 'react-router-dom';
import PageNotFound from 'app/shared/error/page-not-found';
import SendEmailsPage from 'app/pages/sendEmails/SendEmailsPage';
import UserDetailsPage from '../pages/userManagement/UserDetailsPage';
import { CreateAccountPage } from 'app/pages/CreateAccountPage';
import UsageAnalysisPage from 'app/pages/usageAnalysisPage/UsageAnalysisPage';
import UserUsageDetailsPage from 'app/pages/usageAnalysisPage/UserUsageDetailsPage';
import ResourceUsageDetailsPage from 'app/pages/usageAnalysisPage/ResourceUsageDetailsPage';
import { CreateCompanyPage } from 'app/pages/CreateCompanyPage';
import CompanyDetailsPage from 'app/pages/companyManagement/CompanyDetailsPage';
import ReadOnlyMode from 'app/shared/readonly/ReadOnlyMode';
import WindowStore from 'app/store/WindowStore';

const AdminRoutes = ({ widowStore }: { widowStore: WindowStore }) => {
  return (
    <Switch>
      <ErrorBoundaryRoute
        exact
        path={PAGE_ROUTE.ADMIN_USER_DETAILS}
        component={UserDetailsPage}
        windowStore={widowStore}
      />
      <ErrorBoundaryRoute
        exact
        path={PAGE_ROUTE.ADMIN_USAGE_ANALYSIS}
        component={UsageAnalysisPage}
        windowStore={widowStore}
      />
      <ErrorBoundaryRoute
        exact
        path={PAGE_ROUTE.ADMIN_USER_USAGE_DETAILS}
        component={UserUsageDetailsPage}
        windowStore={widowStore}
      />
      <ErrorBoundaryRoute
        exact
        path={PAGE_ROUTE.ADMIN_RESOURCE_DETAILS}
        component={ResourceUsageDetailsPage}
        windowStore={widowStore}
      />
      <ErrorBoundaryRoute
        exact
        path={PAGE_ROUTE.ADMIN_SEND_EMAILS}
        component={ReadOnlyMode(SendEmailsPage)}
        windowStore={widowStore}
      />
      <ErrorBoundaryRoute
        exact
        path={PAGE_ROUTE.ADMIN_CREATE_ACCOUNT}
        component={ReadOnlyMode(CreateAccountPage)}
        windowStore={widowStore}
      />
      <ErrorBoundaryRoute
        exact
        path={PAGE_ROUTE.ADMIN_ADD_COMPANY}
        component={ReadOnlyMode(CreateCompanyPage)}
        windowStore={widowStore}
      />
      <ErrorBoundaryRoute
        exact
        path={PAGE_ROUTE.ADMIN_COMPANY_DETAILS}
        component={CompanyDetailsPage}
        windowStore={widowStore}
      />
      <ErrorBoundaryRoute component={PageNotFound} windowStore={widowStore} />
    </Switch>
  );
};
export default AdminRoutes;
