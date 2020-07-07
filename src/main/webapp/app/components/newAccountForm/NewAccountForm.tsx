import React from 'react';
import {
  AvField,
  AvForm,
  AvRadioGroup,
  AvRadio,
  AvCheckboxGroup,
  AvCheckbox
} from 'availity-reactstrap-validation';
import PasswordStrengthBar from 'app/shared/password/password-strength-bar';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import autobind from 'autobind-decorator';
import { ManagedUserVM } from 'app/shared/api/generated/API';
import {
  ACADEMIC_TERMS,
  ACCOUNT_TITLES,
  LicenseType
} from 'app/config/constants';
import { Row, Col, Button, Form } from 'react-bootstrap';
import LicenseExplanation from 'app/shared/texts/LicenseExplanation';
import { ButtonSelections } from 'app/components/LicenseSelection';
import { LicenseInquireLink } from 'app/shared/links/LicenseInquireLink';
import * as XRegExp from 'xregexp';
import {
  getSectionClassName,
  getAccountInfoTitle
} from 'app/pages/account/AccountUtils';
import { If, Then, Else } from 'react-if';

export type INewAccountForm = {
  isLargeScreen: boolean;
  byAdmin: boolean;
  defaultLicense?: LicenseType;
  onSelectLicense?: (newLicenseType: LicenseType | undefined) => void;
  onSubmit: (newUser: Partial<ManagedUserVM>) => void;
};

export enum AccountType {
  REGULAR = 'regular',
  TRIAL = 'trial'
}

export const ACCOUNT_TYPE_DEFAULT = AccountType.REGULAR;
export const TRIAL_TOKEN_VALID_DEFAULT = 30;
@observer
export class NewAccountForm extends React.Component<INewAccountForm> {
  @observable password = '';
  @observable selectedLicense: LicenseType | undefined;
  @observable selectedAccountType = ACCOUNT_TYPE_DEFAULT;

  private defaultFormValue = {
    accountType: ACCOUNT_TYPE_DEFAULT,
    tokenValidDays: TRIAL_TOKEN_VALID_DEFAULT
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
      country: values.country
    };
    if (values.tokenValidDays) {
      newUser.tokenValidDays = Number(values.tokenValidDays);
    }
    this.props.onSubmit(newUser);
  }

  getLicenseAdditionalInfo(licenseType: LicenseType) {
    if (licenseType === LicenseType.ACADEMIC) {
      return (
        <div>
          OncoKB is accessible for no fee for research use in academic setting.
          This license type requires that you register your account using your
          institution/university email address. Please register below for
          access.
        </div>
      );
    } else {
      return (
        <div>
          <div className="mt-2">
            In order to be granted access to downloadable content and our API,
            your company will need a license. If your company already has one,
            we will grant you access. Otherwise, we will contact you to discuss
            your needs and license terms. You can also reach out to{' '}
            <LicenseInquireLink /> for more information.
          </div>
        </div>
      );
    }
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
        <Row className={getSectionClassName(true)}>
          <Col xs={12}>
            <h6>
              <LicenseExplanation />
            </h6>
          </Col>
        </Row>
        <Row className={getSectionClassName(false)}>
          <Col md="3">
            <h5>Choose License</h5>
          </Col>
          <Col md="9">
            <ButtonSelections
              isLargeScreen={this.props.isLargeScreen}
              selectedButton={this.selectedLicense}
              onSelectLicense={this.onSelectLicense}
            />
          </Col>
        </Row>
        {this.selectedLicense ? (
          <>
            <Row className={getSectionClassName()}>
              <Col md="9" className={'ml-auto'}>
                {this.getLicenseAdditionalInfo(this.selectedLicense)}
              </Col>
            </Row>
            <Row className={getSectionClassName()}>
              <Col md="3">
                <h5>Account</h5>
              </Col>
              <Col md="9">
                <AvField
                  name="email"
                  label={getAccountInfoTitle(
                    ACCOUNT_TITLES.EMAIL,
                    this.selectedLicense
                  )}
                  type="email"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: 'Your email is required.'
                    },
                    minLength: {
                      value: 5,
                      errorMessage:
                        'Your email is required to be at least 5 characters.'
                    },
                    maxLength: {
                      value: 254,
                      errorMessage:
                        'Your email cannot be longer than 50 characters.'
                    }
                  }}
                />
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
                      errorMessage: 'Your first name is required.'
                    },
                    pattern: {
                      value: XRegExp('^[\\p{Latin}\\s]+$'),
                      errorMessage:
                        'Sorry, we only support Latin letters for now.'
                    },
                    minLength: {
                      value: 1,
                      errorMessage: 'Your first can not be empty'
                    }
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
                      errorMessage: 'Your last name is required.'
                    },
                    pattern: {
                      value: XRegExp('^[\\p{Latin}\\s]+$'),
                      errorMessage:
                        'Sorry, we only support Latin letters for now.'
                    },
                    minLength: {
                      value: 1,
                      errorMessage: 'Your last name can not be empty'
                    }
                  }}
                />
                <If condition={!this.props.byAdmin}>
                  <Then>
                    <AvField
                      name="firstPassword"
                      label="New password"
                      autoComplete="new-password"
                      placeholder={'New password'}
                      type="password"
                      onChange={this.updatePassword}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'Your password is required.'
                        },
                        minLength: {
                          value: 4,
                          errorMessage:
                            'Your password is required to be at least 4 characters.'
                        },
                        maxLength: {
                          value: 50,
                          errorMessage:
                            'Your password cannot be longer than 50 characters.'
                        }
                      }}
                    />
                    <PasswordStrengthBar password={this.password} />
                    <AvField
                      name="secondPassword"
                      label="New password confirmation"
                      autoComplete="new-password"
                      placeholder="Confirm the new password"
                      type="password"
                      validate={{
                        required: {
                          value: true,
                          errorMessage:
                            'Your confirmation password is required.'
                        },
                        minLength: {
                          value: 4,
                          errorMessage:
                            'Your confirmation password is required to be at least 4 characters.'
                        },
                        maxLength: {
                          value: 50,
                          errorMessage:
                            'Your confirmation password cannot be longer than 50 characters.'
                        },
                        match: {
                          value: 'firstPassword',
                          errorMessage:
                            'The password and its confirmation do not match!'
                        }
                      }}
                    />
                  </Then>
                </If>
              </Col>
            </Row>
            <Row className={getSectionClassName()}>
              <Col md="3">
                <h5>
                  {getAccountInfoTitle(
                    ACCOUNT_TITLES.COMPANY,
                    this.selectedLicense
                  )}
                </h5>
              </Col>
              <Col md="9">
                {/* Job Title */}
                <AvField
                  name="jobTitle"
                  label={getAccountInfoTitle(
                    ACCOUNT_TITLES.POSITION,
                    this.selectedLicense
                  )}
                  validate={{
                    required: {
                      value: !this.props.byAdmin,
                      errorMessage: 'Required.'
                    },
                    minLength: {
                      value: 1,
                      errorMessage: 'Required to be at least 1 character'
                    },
                    pattern: {
                      value: XRegExp('^[\\p{Latin}\\p{Common}\\s]+$'),
                      errorMessage:
                        'Sorry, we only support Latin letters for now.'
                    },
                    maxLength: {
                      value: 50,
                      errorMessage: 'Cannot be longer than 50 characters'
                    }
                  }}
                />
                {/* Company */}
                <AvField
                  name="company"
                  label={getAccountInfoTitle(
                    ACCOUNT_TITLES.COMPANY,
                    this.selectedLicense
                  )}
                  validate={{
                    required: {
                      value: !this.props.byAdmin,
                      errorMessage: 'Required.'
                    },
                    minLength: {
                      value: 1,
                      errorMessage: 'Required to be at least 1 character'
                    },
                    pattern: {
                      value: XRegExp('^[\\p{Latin}\\p{Common}\\s]+$'),
                      errorMessage:
                        'Sorry, we only support Latin letters for now.'
                    },
                    maxLength: {
                      value: 50,
                      errorMessage: 'Cannot be longer than 50 characters'
                    }
                  }}
                />
                {/* City */}
                <AvField
                  name="city"
                  label={getAccountInfoTitle(
                    ACCOUNT_TITLES.CITY,
                    this.selectedLicense
                  )}
                  validate={{
                    required: {
                      value: !this.props.byAdmin,
                      errorMessage: 'Required.'
                    },
                    minLength: {
                      value: 1,
                      errorMessage: 'Required to be at least 1 character'
                    },
                    pattern: {
                      value: XRegExp('^[\\p{Latin}\\p{Common}\\s]+$'),
                      errorMessage:
                        'Sorry, we only support Latin letters for now.'
                    },
                    maxLength: {
                      value: 50,
                      errorMessage: 'Cannot be longer than 50 characters'
                    }
                  }}
                />
                {/* Country */}
                <AvField
                  name="country"
                  label={getAccountInfoTitle(
                    ACCOUNT_TITLES.COUNTRY,
                    this.selectedLicense
                  )}
                  validate={{
                    required: {
                      value: !this.props.byAdmin,
                      errorMessage: 'Required.'
                    },
                    pattern: {
                      value: XRegExp('^[\\p{Latin}\\p{Common}\\s]+$'),
                      errorMessage:
                        'Sorry, we only support Latin letters for now.'
                    },
                    minLength: {
                      value: 1,
                      errorMessage: 'Required to be at least 1 character'
                    },
                    maxLength: {
                      value: 50,
                      errorMessage: 'Cannot be longer than 50 characters'
                    }
                  }}
                />
              </Col>
            </Row>
            {this.selectedLicense === LicenseType.ACADEMIC &&
            !this.props.byAdmin ? (
              <>
                <Row className={getSectionClassName()}>
                  <Col md="9" className={'ml-auto'}>
                    In order to be granted access to downloadable content and
                    our API, please agree to the following terms:
                  </Col>
                </Row>
                <Row className={getSectionClassName()}>
                  <Col md="3">
                    <h5>Terms</h5>
                  </Col>
                  <Col md="9">
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
                    <div className={'mt-2'}>
                      <AvField
                        name="tokenValidDays"
                        label="Account Expires in Days"
                        required
                        validate={{ number: true }}
                      />
                    </div>
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
