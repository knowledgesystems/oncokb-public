import SmallPageContainer from 'app/components/SmallPageContainer';
import OncoKBTable from 'app/components/oncokbTable/OncoKBTable';
import TokenInputGroups from 'app/components/tokenInputGroups/TokenInputGroups';
import {
  ACCOUNT_TITLES,
  AUTHORITIES,
  H5_MARGIN_BOTTOM,
  LicenseType,
  MAX_SERVICE_ACCOUNT_TOKENS,
  PAGE_ROUTE,
  USER_AUTHORITY,
} from 'app/config/constants';
import { NOT_USED_IN_AI_MODELS } from 'app/config/constants/terms';
import {
  getAccountInfoTitle,
  getLicenseTitle,
  getSectionClassName,
} from 'app/pages/account/AccountUtils';
import client from 'app/shared/api/clientInstance';
import { Token } from 'app/shared/api/generated/API';
import ButtonWithTooltip from 'app/shared/button/ButtonWithTooltip';
import { LoadingButton } from 'app/shared/button/LoadingButton';
import InfoIcon from 'app/shared/icons/InfoIcon';
import { ContactLink } from 'app/shared/links/ContactLink';
import { SimpleConfirmModal } from 'app/shared/modal/SimpleConfirmModal';
import { TEXT_VAL } from 'app/shared/utils/FormValidationUtils';
import { notifyError, notifySuccess } from 'app/shared/utils/NotificationUtils';
import AuthenticationStore from 'app/store/AuthenticationStore';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { DefaultTooltip } from 'cbioportal-frontend-commons';
import classnames from 'classnames';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export type IRegisterProps = {
  authenticationStore: AuthenticationStore;
};

export const InfoRow: React.FunctionComponent<{
  title: JSX.Element | string;
  content?: JSX.Element | string;
  direction?: 'vertical' | 'horizontal';
  titleWidth?: number;
  contentWidth?: number;
}> = props => {
  let titleWidth = props.titleWidth ?? 4;
  let contentWidth = props.contentWidth ?? 8;
  if (props.direction && props.direction === 'vertical') {
    titleWidth = contentWidth = 12;
  }
  return (
    <Row className={'mb-2'}>
      <Col sm={titleWidth}>{props.title}</Col>
      <Col sm={contentWidth}>
        {props.content}
        {props.children}
      </Col>
    </Row>
  );
};
@inject('authenticationStore')
@observer
export class AccountPage extends React.Component<IRegisterProps> {
  @observable copiedIdToken = false;
  @observable showApiAccessConfirmModal = false;
  @observable apiAccessJustification = '';
  @observable apiAccessRequested =
    this.account?.additionalInfo?.apiAccessRequest?.requested || false;
  @observable showCreateServiceAccountTokenModal = false;
  @observable isCreatingServiceAccountToken = false;
  @observable serviceAccountTokens: Token[] = [];

  constructor(props: Readonly<IRegisterProps>) {
    super(props);
    this.getServiceAccountTokens();
  }

  @computed
  get account() {
    return this.props.authenticationStore.account;
  }

  @action.bound
  deleteToken(token: Token) {
    this.props.authenticationStore
      .deleteToken(token)
      .then(() => {
        notifySuccess('Token is deleted');
      })
      .catch((error: Error) => {
        notifyError(error);
      });
  }

  @action.bound
  extendExpirationDate(token: Token, newDate: string) {
    this.props.authenticationStore
      .extendTokenExpirationDate(token, newDate)
      .then(
        () => {
          notifySuccess('Updated Token');
        },
        (error: Error) => {
          notifyError(error);
        }
      );
  }

  @action.bound
  addNewToken() {
    this.props.authenticationStore
      .generateIdToken()
      .then(() => {
        notifySuccess('Token is added');
      })
      .catch(error => {
        notifyError(error);
      });
  }

  @action.bound
  async getServiceAccountTokens() {
    this.serviceAccountTokens = await client.getServiceAccountTokensUsingGET(
      {}
    );
  }

  @action.bound
  async addServiceAccountToken(name: string) {
    this.isCreatingServiceAccountToken = true;
    try {
      await client.createServiceAccountTokenUsingPOST({ name });
      await this.getServiceAccountTokens();
      this.hideCreateServiceAccountTokenModal();
      notifySuccess('Service account token is added');
    } catch (e) {
      notifyError(e);
    } finally {
      setTimeout(() => {
        this.isCreatingServiceAccountToken = false;
      }, 100);
    }
  }

  @action.bound
  hideCreateServiceAccountTokenModal() {
    this.showCreateServiceAccountTokenModal = false;
  }

  @computed
  get generateTokenEnabled() {
    return this.tokens.length < 2;
  }

  @computed
  get tokens() {
    return this.props.authenticationStore.tokens;
  }

  @computed
  get licenseTitle() {
    if (!this.account) {
      return '';
    }
    const license = getLicenseTitle(this.account.licenseType as LicenseType);
    if (license) {
      return license.title;
    } else {
      return '';
    }
  }

  @computed get serviceAccountTokenCreationDisabled() {
    return (
      this.serviceAccountTokens.length >= MAX_SERVICE_ACCOUNT_TOKENS ||
      !this.account?.company
    );
  }

  @computed get serviceAccountTooltip() {
    if (!this.account?.company) {
      return (
        <span>
          You are not associated with a company. Please reach out to{' '}
          <ContactLink emailSubject="Delete Service Account Tokens" /> for
          assistance.
        </span>
      );
    }
    if (this.serviceAccountTokens.length >= MAX_SERVICE_ACCOUNT_TOKENS) {
      return (
        <span>
          You may not exceed 10 tokens. Please reach out to{' '}
          <ContactLink emailSubject="Delete Service Account Tokens" /> to
          request token deletion.
        </span>
      );
    }
    return <></>;
  }

  getContent() {
    if (this.account === undefined) {
      return <Redirect to={PAGE_ROUTE.LOGIN} />;
    }

    const apiAccess = (
      <InfoRow
        titleWidth={3}
        contentWidth={9}
        title={
          <div className={'d-flex align-items-center'}>
            <span>
              {getAccountInfoTitle(
                ACCOUNT_TITLES.API_TOKEN,
                this.account.licenseType as LicenseType
              )}
            </span>
            {this.generateTokenEnabled ? (
              <DefaultTooltip placement={'top'} overlay={'Get a new token.'}>
                <i
                  className={classnames('ml-2 fa fa-plus')}
                  onClick={this.addNewToken}
                />
              </DefaultTooltip>
            ) : null}
          </div>
        }
      >
        <TokenInputGroups
          changeTokenExpirationDate={false}
          tokens={this.tokens}
          onDeleteToken={this.deleteToken}
          extendExpirationDate={this.extendExpirationDate}
        />
      </InfoRow>
    );
    const noApiAccess = (
      <span>
        You do not have API access. Click{' '}
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => (this.showApiAccessConfirmModal = true)}
        >
          HERE
        </span>{' '}
        to request API access.
      </span>
    );
    const awaitingApiAccess = (
      <span>
        We are reviewing your API access request. If you haven't heard back from
        us after 1-2 business days, please feel free to contact us.
      </span>
    );

    return (
      <SmallPageContainer size={'lg'}>
        <Row className={getSectionClassName(true)}>
          <Col>
            <h5>Account</h5>
            <InfoRow
              title={getAccountInfoTitle(
                ACCOUNT_TITLES.EMAIL,
                this.account.licenseType as LicenseType
              )}
              content={this.account.email}
            />
            <InfoRow
              title={getAccountInfoTitle(
                ACCOUNT_TITLES.NAME,
                this.account.licenseType as LicenseType
              )}
              content={`${this.account.firstName} ${this.account.lastName}`}
            />
            <InfoRow
              title={getAccountInfoTitle(
                ACCOUNT_TITLES.LICENSE_TYPE,
                this.account.licenseType as LicenseType
              )}
              content={this.licenseTitle}
            />
          </Col>
        </Row>
        <Row className={getSectionClassName()}>
          <Col>
            <h5>
              {getAccountInfoTitle(
                ACCOUNT_TITLES.COMPANY,
                this.account.licenseType as LicenseType
              )}
            </h5>
            <InfoRow
              title={getAccountInfoTitle(
                ACCOUNT_TITLES.POSITION,
                this.account.licenseType as LicenseType
              )}
              content={this.account.jobTitle}
            />
            <InfoRow
              title={getAccountInfoTitle(
                ACCOUNT_TITLES.COMPANY,
                this.account.licenseType as LicenseType
              )}
              content={this.account.companyName}
            />
            <InfoRow
              title={getAccountInfoTitle(
                ACCOUNT_TITLES.CITY,
                this.account.licenseType as LicenseType
              )}
              content={this.account.city}
            />
            <InfoRow
              title={getAccountInfoTitle(
                ACCOUNT_TITLES.COUNTRY,
                this.account.licenseType as LicenseType
              )}
              content={this.account.country}
            />
          </Col>
        </Row>
        <Row className={getSectionClassName()}>
          <Col>
            <div className={'d-flex align-items-center'}>
              <h5>
                API
                <InfoIcon
                  placement={'top'}
                  overlay={
                    'You can have one token to be used. Your token will be automatically renewed after reviewing the license and account information.'
                  }
                  className={'ml-2'}
                />
              </h5>
            </div>
            {this.account.authorities.includes(AUTHORITIES.API)
              ? apiAccess
              : this.apiAccessRequested
              ? awaitingApiAccess
              : noApiAccess}
          </Col>
        </Row>
        {this.account.authorities.includes(
          USER_AUTHORITY.ROLE_COMPANY_ADMIN
        ) && (
          <Row className={getSectionClassName()}>
            <Col>
              <div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <h5>Service Account</h5>
                    <InfoIcon
                      placement={'top'}
                      overlay={
                        'Service account tokens are intended for developers and will not need to be renewed, ensuring system stability. You many have up to 10 tokens'
                      }
                      className={'ml-2'}
                      style={{ marginBottom: H5_MARGIN_BOTTOM }}
                    />
                  </div>
                  <ButtonWithTooltip
                    buttonProps={{
                      size: 'sm',
                      variant: 'outline-primary',
                      style: { marginBottom: H5_MARGIN_BOTTOM },
                      disabled: this.serviceAccountTokenCreationDisabled,
                      onClick: () => {
                        this.showCreateServiceAccountTokenModal = true;
                      },
                    }}
                    tooltipProps={{
                      overlay: this.serviceAccountTooltip,
                      disabled: !this.serviceAccountTokenCreationDisabled,
                    }}
                    buttonContent={'Add token'}
                  />
                </div>
              </div>
              <OncoKBTable
                data={this.serviceAccountTokens}
                columns={[
                  {
                    Header: 'Name',
                    accessor: 'name',
                  },
                  {
                    Header: 'Token',
                    accessor: 'token',
                  },
                ]}
                minRows={1}
                loading={false}
                disableSearch
              />
            </Col>
          </Row>
        )}
        <SimpleConfirmModal
          title="Request API Access"
          body={
            <>
              <span>{NOT_USED_IN_AI_MODELS}</span>
              <br />
              <br />
              <p>Please provide a justification for your API access request.</p>
              <textarea
                className="form-control"
                value={this.apiAccessJustification}
                onChange={event =>
                  (this.apiAccessJustification = event.target.value)
                }
              />
            </>
          }
          confirmDisabled={this.apiAccessJustification.length === 0}
          onCancel={() => (this.showApiAccessConfirmModal = false)}
          onConfirm={async () => {
            try {
              await client.requestApiAccessUsingPOST({
                apiAccessRequest: {
                  requested: true,
                  justification: this.apiAccessJustification,
                },
              });
              this.apiAccessRequested = true;
              notifySuccess('API access is requested.');
            } catch (error) {
              notifyError(error);
            }
            this.showApiAccessConfirmModal = false;
          }}
          show={this.showApiAccessConfirmModal}
        />
        <Modal
          show={this.showCreateServiceAccountTokenModal}
          backdrop="static"
          onHide={this.hideCreateServiceAccountTokenModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Servive Account Token</Modal.Title>
          </Modal.Header>
          <AvForm
            onValidSubmit={(_event: any, values: any) => {
              this.addServiceAccountToken(values.name);
            }}
          >
            <Modal.Body>
              <AvField
                name="name"
                label={'Name'}
                validate={{
                  required: {
                    value: true,
                    errorMessage: 'Token name is required.',
                  },
                  ...TEXT_VAL,
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="mr-2"
                variant="outline-danger"
                onClick={this.hideCreateServiceAccountTokenModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={this.isCreatingServiceAccountToken}
              >
                Create Token
              </Button>
            </Modal.Footer>
          </AvForm>
        </Modal>
      </SmallPageContainer>
    );
  }

  render() {
    return <>{this.account ? this.getContent() : null}</>;
  }
}
