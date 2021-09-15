import React from 'react';
import {
  AvCheckbox,
  AvCheckboxGroup,
  AvField,
  AvForm,
  AvRadio,
  AvRadioGroup,
} from 'availity-reactstrap-validation';
import PasswordStrengthBar from 'app/shared/password/password-strength-bar';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import autobind from 'autobind-decorator';
import {
  AdditionalInfoDTO,
  Contact,
  ManagedUserVM,
} from 'app/shared/api/generated/API';
import {
  ACADEMIC_TERMS,
  ACCOUNT_TITLES,
  LicenseType,
  THRESHOLD_TRIAL_TOKEN_VALID_DEFAULT,
  XREGEXP_VALID_LATIN_TEXT,
} from 'app/config/constants';
import { Button, Col, Row } from 'react-bootstrap';
import LicenseExplanation from 'app/shared/texts/LicenseExplanation';
import { ButtonSelections } from 'app/components/LicenseSelection';
import { LicenseInquireLink } from 'app/shared/links/LicenseInquireLink';
import * as XRegExp from 'xregexp';
import {
  getAccountInfoTitle,
  getSectionClassName,
} from 'app/pages/account/AccountUtils';
import { If, Then } from 'react-if';
import _ from 'lodash';

export enum FormSection {
  LICENSE = 'LICENSE',
  ACCOUNT = 'ACCOUNT',
  COMPANY = 'COMPANY',
}
export type INewAccountForm = {
  isLargeScreen: boolean;
  byAdmin: boolean;
  defaultLicense?: LicenseType;
  visibleSections?: FormSection[];
  onSelectLicense?: (newLicenseType: LicenseType | undefined) => void;
  onSubmit: (newUser: Partial<ManagedUserVM>) => void;
};

export enum AccountType {
  REGULAR = 'regular',
  TRIAL = 'trial',
}

enum FormKey {
  ANTICIPATED_REPORTS = 'anticipatedReports',
  COMPANY_DESCRIPTION = 'companyDescription',
  USE_CASE = 'useCase',
  COMPANY_SIZE = 'companySize',
  BUS_CONTACT_EMAIL = 'businessContactEmail',
  BUS_CONTACT_PHONE = 'businessContactPhone',
}

export const ACCOUNT_TYPE_DEFAULT = AccountType.REGULAR;
@observer
export class NewAccountForm extends React.Component<INewAccountForm> {
  @observable password = '';
  @observable selectedLicense: LicenseType | undefined;
  @observable selectedAccountType = ACCOUNT_TYPE_DEFAULT;

  private defaultFormValue = {
    accountType: ACCOUNT_TYPE_DEFAULT,
    tokenValidDays: THRESHOLD_TRIAL_TOKEN_VALID_DEFAULT,
  };

  private textValidation = {
    pattern: {
      value: XRegExp(XREGEXP_VALID_LATIN_TEXT),
      errorMessage: 'Sorry, we only support Latin letters for now.',
    },
    minLength: {
      value: 1,
      errorMessage: 'Required to be at least 1 character',
    },
    maxLength: {
      value: 50,
      errorMessage: 'Cannot be longer than 50 characters',
    },
  };

  private shortTextValidation = {
    ...this.textValidation,
    maxLength: {
      value: 50,
      errorMessage: 'Cannot be longer than 50 characters',
    },
  };

  private emailValidation = {
    required: {
      value: true,
      errorMessage: 'Your email is required.',
    },
    minLength: {
      value: 5,
      errorMessage: 'Your email is required to be at least 5 characters.',
    },
    maxLength: {
      value: 254,
      errorMessage: 'Your email cannot be longer than 50 characters.',
    },
  };

  public static defaultProps = {
    visibleSections: Object.values(FormSection),
  };

  constructor(props: INewAccountForm) {
    super(props);
    if (props.defaultLicense) {
      this.selectedLicense = props.defaultLicense;
    }
  }

  @autobind
  @action
  handleValidSubmit(event: any, values: any) {
    const newUser: Partial<ManagedUserVM> = {
      login: values.email,
      password: this.password,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      licenseType: this.selectedLicense,
      tokenIsRenewable: this.selectedAccountType !== AccountType.TRIAL,
      jobTitle: values.jobTitle,
      company: values.company,
      city: values.city,
      country: values.country,
    };
    const additionalInfo = this.constructAdditionalInfo(values);
    if (_.keys(additionalInfo).length > 0) {
      newUser.additionalInfo = additionalInfo;
    }
    if (values.tokenValidDays) {
      newUser.tokenValidDays = Number(values.tokenValidDays);
      newUser.notifyUserOnTrialCreation =
        _.isArray(values.notifyUserOnTrialCreation) &&
        values.notifyUserOnTrialCreation.length > 0;
    }
    this.props.onSubmit(newUser);
  }

  constructAdditionalInfo(values: any) {
    const additionalInfo = {
      userCompany: {},
    } as AdditionalInfoDTO;

    if (values[FormKey.COMPANY_SIZE]) {
      additionalInfo.userCompany.size = values[FormKey.COMPANY_SIZE];
    }
    if (values[FormKey.COMPANY_DESCRIPTION]) {
      additionalInfo.userCompany.description =
        values[FormKey.COMPANY_DESCRIPTION];
    }
    [FormKey.ANTICIPATED_REPORTS, FormKey.USE_CASE].forEach(key => {
      if (values[key]) {
        additionalInfo.userCompany[key] = values[key];
      }
    });
    if (
      values[FormKey.BUS_CONTACT_EMAIL] ||
      values[FormKey.BUS_CONTACT_PHONE]
    ) {
      additionalInfo.userCompany.businessContact = {} as Contact;
      if (values[FormKey.BUS_CONTACT_EMAIL]) {
        additionalInfo.userCompany.businessContact.email =
          values[FormKey.BUS_CONTACT_EMAIL];
      }
      if (values[FormKey.BUS_CONTACT_PHONE]) {
        additionalInfo.userCompany.businessContact.phone =
          values[FormKey.BUS_CONTACT_PHONE];
      }
    }
    if (_.keys(additionalInfo.userCompany).length === 0) {
      delete additionalInfo.userCompany;
    }
    return additionalInfo;
  }

  getLicenseAdditionalInfo(licenseType: LicenseType) {
    if (licenseType === LicenseType.ACADEMIC) {
      return (
        <p>
          OncoKB is accessible for no fee for research use in academic setting.
          This license type requires that you register your account using your
          institution/university email address.{' '}
          <b>Please complete the form below to create your OncoKB account.</b>
        </p>
      );
    } else if (licenseType === LicenseType.COMMERCIAL) {
      return (
        <>
          <p>
            To use OncoKB in a commercial product, your company will need a
            license. A typical example of this is if you are part of a company
            that would like to incorporate OncoKB content into sequencing
            reports.
          </p>
          <p>
            <b>Please complete the form below to create your OncoKB account.</b>{' '}
            {this.props.visibleSections?.includes(FormSection.COMPANY) ? (
              <span>
                If your company already has a license, you can skip certain
                fields and we will grant you API access shortly. Otherwise, we
                will contact you with license terms.
              </span>
            ) : null}{' '}
            You can also reach out to <LicenseInquireLink /> for more
            information.
          </p>
        </>
      );
    } else if (licenseType === LicenseType.HOSPITAL) {
      return (
        <>
          <p>
            To incorporate OncoKB content into patient sequencing reports, your
            hospital will need a license.
          </p>
          <p>
            <b>Please complete the form below to create your OncoKB account.</b>{' '}
            {this.props.visibleSections?.includes(FormSection.COMPANY) ? (
              <span>
                If your hospital already has a license, we will grant you API
                access shortly. Otherwise, we will contact you with license
                terms.
              </span>
            ) : null}{' '}
            You can also reach out to <LicenseInquireLink /> for more
            information.
          </p>
        </>
      );
    } else if (licenseType === LicenseType.RESEARCH_IN_COMMERCIAL) {
      return (
        <>
          <p>
            To use OncoKB for research purposes in a commercial setting, your
            company will need a license.
          </p>
          <p>
            <b>Please complete the form below to create your OncoKB account.</b>{' '}
            {this.props.visibleSections?.includes(FormSection.COMPANY) ? (
              <span>
                If your company already has a license, we will grant you API
                access shortly. Otherwise, we will contact you with license
                terms.
              </span>
            ) : null}{' '}
            You can also reach out to <LicenseInquireLink /> for more
            information.
          </p>
        </>
      );
    }
  }

  @computed
  get isCommercialLicense() {
    return this.selectedLicense !== LicenseType.ACADEMIC;
  }

  @computed
  get companyDescriptionPlaceholder() {
    const commonDescription =
      'Provide a brief description of the ' +
      getAccountInfoTitle(
        ACCOUNT_TITLES.COMPANY,
        this.selectedLicense
      ).toLowerCase();

    if (this.isCommercialLicense) {
      return (
        commonDescription +
        ':\n' +
        ' - Key products and services that relate to OncoKB\n' +
        ` - Approximate size of the ${getAccountInfoTitle(
          ACCOUNT_TITLES.COMPANY,
          this.selectedLicense
        ).toLowerCase()} (e.g., FTE, revenue, etc.)`
      );
    }
    return commonDescription;
  }

  @computed
  get useCasePlaceholder() {
    const commonDescription =
      'Provide a description of how you plan to use OncoKB';

    if (this.isCommercialLicense) {
      return (
        commonDescription +
        '\n' +
        '  - What product or service do you plan to incorporate OncoKB content into?\n' +
        `  - How will the product be delivered to the end user (e.g., patient report${
          this.selectedLicense === LicenseType.COMMERCIAL
            ? ', SaaS offering'
            : ''
        })?`
      );
    }
    return commonDescription;
  }

  @autobind
  @action
  onSelectLicense(license: LicenseType | undefined) {
    this.selectedLicense = license;
    if (this.props.onSelectLicense) {
      this.props.onSelectLicense(this.selectedLicense);
    }
  }

  @autobind
  updatePassword(event: any) {
    this.password = event.target.value;
  }

  render() {
    return (
      <AvForm
        onValidSubmit={this.handleValidSubmit}
        model={this.defaultFormValue}
      >
        {this.props.visibleSections!.includes(FormSection.LICENSE) && (
          <>
            <Row className={getSectionClassName(true)}>
              <Col xs={12}>
                <h6>
                  <LicenseExplanation />
                </h6>
              </Col>
            </Row>
            <Row className={getSectionClassName(false)}>
              <Col md="3">
                <h5>Choose your license type</h5>
              </Col>
              <Col md="9">
                <ButtonSelections
                  isLargeScreen={this.props.isLargeScreen}
                  selectedButton={this.selectedLicense}
                  onSelectLicense={this.onSelectLicense}
                />
              </Col>
            </Row>
          </>
        )}
        {this.selectedLicense ? (
          <>
            {this.props.visibleSections!.includes(FormSection.LICENSE) && (
              <Row>
                <Col md="9" className={'ml-auto'}>
                  {this.getLicenseAdditionalInfo(this.selectedLicense)}
                </Col>
              </Row>
            )}
            {this.props.visibleSections!.includes(FormSection.ACCOUNT) && (
              <Row
                className={
                  this.props.visibleSections!.includes(FormSection.LICENSE)
                    ? getSectionClassName()
                    : undefined
                }
              >
                <Col md="3">
                  <h5>Account Information</h5>
                </Col>
                <Col md="9">
                  <AvField
                    name="firstName"
                    autoComplete="given-name"
                    label={getAccountInfoTitle(
                      ACCOUNT_TITLES.FIRST_NAME,
                      this.selectedLicense
                    )}
                    validate={{
                      required: {
                        value: true,
                        errorMessage: 'Your first name is required.',
                      },
                      ...this.textValidation,
                    }}
                  />
                  <AvField
                    name="lastName"
                    autoComplete="family-name"
                    label={getAccountInfoTitle(
                      ACCOUNT_TITLES.LAST_NAME,
                      this.selectedLicense
                    )}
                    validate={{
                      required: {
                        value: true,
                        errorMessage: 'Your last name is required.',
                      },
                      ...this.textValidation,
                    }}
                  />
                  <AvField
                    name="jobTitle"
                    label={getAccountInfoTitle(
                      ACCOUNT_TITLES.POSITION,
                      this.selectedLicense
                    )}
                  />
                  <AvField
                    name="email"
                    label={getAccountInfoTitle(
                      ACCOUNT_TITLES.EMAIL,
                      this.selectedLicense
                    )}
                    type="email"
                    validate={this.emailValidation}
                  />
                  <If condition={!this.props.byAdmin}>
                    <Then>
                      <AvField
                        name="firstPassword"
                        label="Password"
                        autoComplete="password"
                        placeholder={'Password'}
                        type="password"
                        onChange={this.updatePassword}
                        validate={{
                          required: {
                            value: true,
                            errorMessage: 'Your password is required.',
                          },
                          minLength: {
                            value: 4,
                            errorMessage:
                              'Your password is required to be at least 4 characters.',
                          },
                          maxLength: {
                            value: 50,
                            errorMessage:
                              'Your password cannot be longer than 50 characters.',
                          },
                        }}
                      />
                      <PasswordStrengthBar password={this.password} />
                      <AvField
                        name="secondPassword"
                        label="Password confirmation"
                        autoComplete="password"
                        placeholder="Confirm the password"
                        type="password"
                        validate={{
                          required: {
                            value: true,
                            errorMessage:
                              'Your confirmation password is required.',
                          },
                          minLength: {
                            value: 4,
                            errorMessage:
                              'Your confirmation password is required to be at least 4 characters.',
                          },
                          maxLength: {
                            value: 50,
                            errorMessage:
                              'Your confirmation password cannot be longer than 50 characters.',
                          },
                          match: {
                            value: 'firstPassword',
                            errorMessage:
                              'The password and its confirmation do not match!',
                          },
                        }}
                      />
                    </Then>
                  </If>
                </Col>
              </Row>
            )}
            {this.props.visibleSections!.includes(FormSection.COMPANY) && (
              <Row className={getSectionClassName()}>
                <Col md="3">
                  <h5>
                    {getAccountInfoTitle(
                      ACCOUNT_TITLES.COMPANY_SECTION_TITLE,
                      this.selectedLicense
                    )}
                  </h5>
                </Col>
                <Col md="9">
                  {this.selectedLicense !== LicenseType.ACADEMIC && (
                    <p>
                      Please feel free to skip this section if your{' '}
                      {getAccountInfoTitle(
                        ACCOUNT_TITLES.COMPANY,
                        this.selectedLicense
                      ).toLowerCase()}{' '}
                      already has a license with us.
                    </p>
                  )}
                  <AvField
                    name="company"
                    label={getAccountInfoTitle(
                      ACCOUNT_TITLES.COMPANY,
                      this.selectedLicense
                    )}
                    validate={{
                      required: {
                        value: true,
                        errorMessage: 'Your organization name is required.',
                      },
                      ...this.textValidation,
                    }}
                  />
                  <AvField
                    name="city"
                    label={getAccountInfoTitle(
                      ACCOUNT_TITLES.CITY,
                      this.selectedLicense
                    )}
                  />
                  <AvField
                    name="country"
                    label={getAccountInfoTitle(
                      ACCOUNT_TITLES.COUNTRY,
                      this.selectedLicense
                    )}
                  />
                  <AvField
                    name={FormKey.COMPANY_DESCRIPTION}
                    label={`${getAccountInfoTitle(
                      ACCOUNT_TITLES.COMPANY,
                      this.selectedLicense
                    )} Description`}
                    type={'textarea'}
                    placeholder={this.companyDescriptionPlaceholder}
                    rows={4}
                  />
                  {this.isCommercialLicense && (
                    <>
                      <AvField
                        name={FormKey.BUS_CONTACT_EMAIL}
                        label={'Business Contact Email'}
                        type="email"
                        validate={{
                          ...this.emailValidation,
                          required: {
                            value: false,
                          },
                        }}
                      />
                      <AvField
                        name={FormKey.BUS_CONTACT_PHONE}
                        label={'Business Contact Phone Number'}
                        type="tel"
                      />
                    </>
                  )}
                  <AvField
                    name={FormKey.USE_CASE}
                    label={'Describe how you plan to use OncoKB'}
                    type={'textarea'}
                    placeholder={this.useCasePlaceholder}
                    rows={6}
                    validate={{
                      required: {
                        value: true,
                        errorMessage: 'Your use case is required.',
                      },
                      pattern: {
                        value: XRegExp(XREGEXP_VALID_LATIN_TEXT),
                        errorMessage:
                          'Sorry, we only support Latin letters for now.',
                      },
                      minLength: {
                        value: 1,
                        errorMessage: 'Required to be at least 1 character',
                      },
                    }}
                  />
                  {[LicenseType.COMMERCIAL, LicenseType.HOSPITAL].includes(
                    this.selectedLicense
                  ) && (
                    <AvField
                      name={FormKey.ANTICIPATED_REPORTS}
                      label={
                        'Anticipated # of reports annually for years 1, 2 and 3'
                      }
                      type={'textarea'}
                      placeholder={
                        'If you plan to incorporate OncoKB contents in sequencing reports, please provide an estimate of your anticipated volume over the next several years'
                      }
                    />
                  )}
                  {[LicenseType.RESEARCH_IN_COMMERCIAL].includes(
                    this.selectedLicense
                  ) && (
                    <AvField
                      name={FormKey.COMPANY_SIZE}
                      label={'Company Size (# of employees)'}
                      type={'input'}
                    />
                  )}
                </Col>
              </Row>
            )}
            {this.selectedLicense === LicenseType.ACADEMIC &&
            !this.props.byAdmin ? (
              <>
                <Row className={getSectionClassName()}>
                  <Col md="3">
                    <h5>Terms</h5>
                  </Col>
                  <Col md="9">
                    <p>
                      In order to be granted access to downloadable content and
                      our API, please agree to the following terms:
                    </p>
                    {ACADEMIC_TERMS.map(term => (
                      <AvCheckboxGroup
                        name={term.key}
                        required
                        key={term.key}
                        errorMessage={'You have to accept the term'}
                      >
                        <AvCheckbox label={term.description} value={term.key} />
                      </AvCheckboxGroup>
                    ))}
                  </Col>
                </Row>
              </>
            ) : null}
            {this.props.byAdmin ? (
              <Row className={getSectionClassName()}>
                <Col md="3">
                  <h5>Account Type</h5>
                </Col>
                <Col md="9">
                  <AvRadioGroup
                    inline
                    name="accountType"
                    label=""
                    required
                    onChange={(event: any, values: any) => {
                      if (values) {
                        this.selectedAccountType = values;
                      } else {
                        this.selectedAccountType = ACCOUNT_TYPE_DEFAULT;
                      }
                    }}
                  >
                    <AvRadio
                      label={AccountType.REGULAR}
                      value={AccountType.REGULAR}
                    />
                    <AvRadio
                      label={AccountType.TRIAL}
                      value={AccountType.TRIAL}
                    />
                  </AvRadioGroup>
                  {this.selectedAccountType === AccountType.TRIAL ? (
                    <>
                      <div className={'mt-2'}>
                        <AvField
                          name="tokenValidDays"
                          label="Account Expires in Days"
                          required
                          validate={{ number: true }}
                        />
                      </div>
                      <div className={'mt-2'}>
                        <AvCheckboxGroup name="notifyUserOnTrialCreation">
                          <AvCheckbox
                            label={'Send trial License agreement'}
                            value={'true'}
                          />
                        </AvCheckboxGroup>
                      </div>
                    </>
                  ) : null}
                </Col>
              </Row>
            ) : null}
            <Row>
              <Col md={9} className={'ml-auto'}>
                <Button id="register-submit" variant="primary" type="submit">
                  Register
                </Button>
              </Col>
            </Row>
          </>
        ) : null}
      </AvForm>
    );
  }
}
