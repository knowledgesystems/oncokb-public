import {
  action,
  computed,
  IReactionDisposer,
  observable,
  reaction,
} from 'mobx';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import React from 'react';
import Client from 'app/shared/api/clientInstance';
import { match } from 'react-router';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import OncoKBTable from 'app/components/oncokbTable/OncoKBTable';
import {
  encodeResourceUsageDetailPageURL,
  filterByKeyword,
} from 'app/shared/utils/Utils';
import { UserOverviewUsage } from 'app/shared/api/generated/API';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import autobind from 'autobind-decorator';
import { Row, Dropdown, DropdownButton } from 'react-bootstrap';
import {
  PAGE_ROUTE,
  USAGE_TOP_USERS_LIMIT,
  USGAE_ALL_TIME_KEY,
} from 'app/config/constants';
import { remoteData } from 'cbioportal-frontend-commons';
import * as QueryString from 'query-string';
import { UsageToggleGroup } from './UsageToggleGroup';
import { TableCellRenderer } from 'react-table';

export type UsageRecord = {
  resource: string;
  usage: number;
  time: string;
};

enum UsageType {
  USER = 'USER',
  RESOURCE = 'RESOURCE',
}

export enum ToggleValue {
  ALL_USERS = 'All Users',
  TOP_USERS = 'Top Users',
  ALL_RESOURCES = 'All Resources',
  PUBLIC_RESOURCES = 'Only Public Resources',
  RESULTS_IN_TOTAL = 'Total',
  RESULTS_BY_MONTH = 'By Month',
}

const ALLOWED_USAGETYPE: string[] = [UsageType.USER, UsageType.RESOURCE];

export enum UsageTableColumnKey {
  RESOURCES = 'resource',
  USAGE = 'usage',
  TIME = 'time',
  OPERATION = 'operation',
}

export function getUsageTableColumnDefinition(
  columnKey: string
):
  | {
      id: string;
      Header: TableCellRenderer;
      minWidth?: number;
      maxWidth?: number;
      accessor: string;
    }
  | undefined {
  switch (columnKey) {
    case UsageTableColumnKey.RESOURCES:
      return {
        id: UsageTableColumnKey.RESOURCES,
        Header: <span> Resource </span>,
        accessor: UsageTableColumnKey.RESOURCES,
        minWidth: 200,
      };
    case UsageTableColumnKey.USAGE:
      return {
        id: UsageTableColumnKey.USAGE,
        Header: <span>Usage</span>,
        minWidth: 100,
        accessor: UsageTableColumnKey.USAGE,
      };
    case UsageTableColumnKey.TIME:
      return {
        id: UsageTableColumnKey.TIME,
        Header: <span> Time </span>,
        minWidth: 100,
        accessor: UsageTableColumnKey.TIME,
      };
    case UsageTableColumnKey.OPERATION:
      return {
        id: UsageTableColumnKey.OPERATION,
        Header: <span>Details</span>,
        maxWidth: 60,
        accessor: UsageTableColumnKey.OPERATION,
      };
    default:
      return undefined;
  }
}

@inject('routing')
@observer
export default class UsageAnalysisPage extends React.Component<{
  routing: RouterStore;
  match: match;
}> {
  @observable topUsersToggleValue: ToggleValue = ToggleValue.ALL_USERS;
  @observable userTabResourcesTypeToggleValue: ToggleValue =
    ToggleValue.PUBLIC_RESOURCES;
  @observable resourceTabResourcesTypeToggleValue: ToggleValue =
    ToggleValue.PUBLIC_RESOURCES;
  @observable dropdownList: string[] = [];
  @observable dropdownValue = 'All';
  @observable usageType: UsageType = UsageType.USER;

  readonly reactions: IReactionDisposer[] = [];

  updateLocationHash = (newType: UsageType) => {
    window.location.hash = QueryString.stringify({ type: newType });
  };

  constructor(props: Readonly<{ routing: RouterStore; match: match }>) {
    super(props);
    this.reactions.push(
      reaction(
        () => [props.routing.location.hash],
        ([hash]) => {
          const queryStrings = QueryString.parse(hash) as { type: UsageType };
          if (queryStrings.type) {
            if (ALLOWED_USAGETYPE.includes(queryStrings.type.toUpperCase())) {
              this.usageType = queryStrings.type;
            }
          }
        },
        { fireImmediately: true }
      ),
      reaction(
        () => this.usageType,
        newVersion => this.updateLocationHash(newVersion)
      )
    );
  }

  readonly users = remoteData<UserOverviewUsage[]>({
    await: () => [],
    async invoke() {
      return await Client.userOverviewUsageGetUsingGET({});
    },
    default: [],
  });

  readonly usageDetail = remoteData<Map<string, UsageRecord[]>>({
    await: () => [],
    invoke: async () => {
      const resource = await Client.resourceUsageGetUsingGET({});
      const result = new Map<string, UsageRecord[]>();
      const yearSummary = resource.year;
      const yearUsage: UsageRecord[] = [];
      Object.keys(yearSummary).forEach(key => {
        yearUsage.push({ resource: key, usage: yearSummary[key], time: '' });
      });
      result.set(USGAE_ALL_TIME_KEY, yearUsage);
      this.dropdownList.push(USGAE_ALL_TIME_KEY);

      const monthSummary = resource.month;
      Object.keys(monthSummary).forEach(key => {
        const month = monthSummary[key];
        const usage: UsageRecord[] = [];
        Object.keys(month).forEach(key2 => {
          usage.push({ resource: key2, usage: month[key2], time: key });
        });
        result.set(key, usage);
        this.dropdownList.push(key);
      });

      return Promise.resolve(result);
    },
    default: new Map(),
  });

  @autobind
  @action
  handleTopUsersToggleChange(value: ToggleValue) {
    this.topUsersToggleValue = value;
  }

  @autobind
  @action
  handleUserTabResourcesTypeToggleChange(value: ToggleValue) {
    this.userTabResourcesTypeToggleValue = value;
  }

  @autobind
  @action
  handleResourceTabResourcesTypeToggleChange(value: ToggleValue) {
    this.resourceTabResourcesTypeToggleValue = value;
  }

  @autobind
  @action
  toggleType(usageType: UsageType) {
    this.usageType = usageType;
  }

  @computed get calculateResourcesTabData(): UsageRecord[] {
    if (
      this.resourceTabResourcesTypeToggleValue === ToggleValue.ALL_RESOURCES
    ) {
      return this.usageDetail.result.get(this.dropdownValue) || [];
    } else {
      return (
        _.filter(this.usageDetail.result.get(this.dropdownValue), function (
          usage
        ) {
          return !usage.resource.includes('/private/');
        }) || []
      );
    }
  }

  render() {
    const monthDropdown: any = [];
    if (this.usageDetail.isComplete) {
      this.dropdownList
        .sort()
        .reverse()
        .forEach(key => {
          monthDropdown.push(
            <Dropdown.Item eventKey={key}>{key}</Dropdown.Item>
          );
        });
    }

    return (
      <>
        <Tabs
          defaultActiveKey={this.usageType}
          id="uncontrolled-tab-example"
          onSelect={k => this.toggleType(UsageType[k!])}
        >
          <Tab eventKey={UsageType.USER} title="Users">
            <Row className="mt-2">
              <UsageToggleGroup
                defaultValue={this.topUsersToggleValue}
                toggleValues={[ToggleValue.ALL_USERS, ToggleValue.TOP_USERS]}
                handleToggle={this.handleTopUsersToggleChange}
              />
              <UsageToggleGroup
                defaultValue={this.userTabResourcesTypeToggleValue}
                toggleValues={[
                  ToggleValue.ALL_RESOURCES,
                  ToggleValue.PUBLIC_RESOURCES,
                ]}
                handleToggle={this.handleUserTabResourcesTypeToggleChange}
              />
            </Row>
            <OncoKBTable
              data={
                this.topUsersToggleValue === ToggleValue.ALL_USERS
                  ? this.users.result
                  : _.filter(this.users.result, function (user) {
                      return user.totalUsage >= USAGE_TOP_USERS_LIMIT;
                    })
              }
              columns={[
                {
                  id: 'userEmail',
                  Header: <span>Email</span>,
                  accessor: 'userEmail',
                  minWidth: 200,
                  onFilter: (data: UserOverviewUsage, keyword) =>
                    filterByKeyword(data.userEmail, keyword),
                },
                {
                  id: 'totalUsage',
                  Header: <span>Total Usage</span>,
                  minWidth: 100,
                  accessor: 'totalUsage',
                },
                this.userTabResourcesTypeToggleValue ===
                ToggleValue.ALL_RESOURCES
                  ? {
                      id: 'endpoint',
                      Header: <span>Most frequently used endpoint</span>,
                      minWidth: 200,
                      accessor: 'endpoint',
                      onFilter: (data: UserOverviewUsage, keyword) =>
                        filterByKeyword(data.endpoint, keyword),
                    }
                  : {
                      id: 'noPrivateEndpoint',
                      Header: (
                        <span>Most frequently used endpoint(only public)</span>
                      ),
                      minWidth: 200,
                      accessor: 'noPrivateEndpoint',
                      onFilter: (data: UserOverviewUsage, keyword) =>
                        filterByKeyword(data.noPrivateEndpoint, keyword),
                    },
                {
                  ...getUsageTableColumnDefinition(
                    UsageTableColumnKey.OPERATION
                  ),
                  sortable: false,
                  className: 'd-flex justify-content-center',
                  Cell(props: { original: UserOverviewUsage }) {
                    return (
                      <Link
                        to={`${PAGE_ROUTE.ADMIN_USER_USAGE_DETAILS_LINK}${props.original.userId}`}
                      >
                        <i className="fa fa-info-circle"></i>
                      </Link>
                    );
                  },
                },
              ]}
              loading={this.users.isComplete ? false : true}
              defaultSorted={[
                {
                  id: 'totalUsage',
                  desc: true,
                },
              ]}
              showPagination={true}
              minRows={1}
            />
          </Tab>
          <Tab eventKey={UsageType.RESOURCE} title="Resources">
            {this.usageDetail.isComplete ? (
              <Row className="mt-2">
                <DropdownButton
                  className="ml-3"
                  id="dropdown-basic-button"
                  title={this.dropdownValue}
                  onSelect={(evt: any) => (this.dropdownValue = evt)}
                >
                  {monthDropdown}
                </DropdownButton>
                <UsageToggleGroup
                  defaultValue={this.resourceTabResourcesTypeToggleValue}
                  toggleValues={[
                    ToggleValue.ALL_RESOURCES,
                    ToggleValue.PUBLIC_RESOURCES,
                  ]}
                  handleToggle={this.handleResourceTabResourcesTypeToggleChange}
                />
              </Row>
            ) : (
              <DropdownButton
                className="mt-2"
                id="dropdown-basic-button"
                title={this.dropdownValue}
                disabled
              ></DropdownButton>
            )}
            <OncoKBTable
              data={this.calculateResourcesTabData}
              columns={[
                {
                  ...getUsageTableColumnDefinition(
                    UsageTableColumnKey.RESOURCES
                  ),
                  Header: (
                    <span>
                      Resource{' '}
                      {this.resourceTabResourcesTypeToggleValue ===
                      ToggleValue.ALL_RESOURCES
                        ? null
                        : '(only public)'}
                    </span>
                  ),
                  onFilter: (data: UsageRecord, keyword) =>
                    filterByKeyword(data.resource, keyword),
                },
                { ...getUsageTableColumnDefinition(UsageTableColumnKey.USAGE) },
                {
                  ...getUsageTableColumnDefinition(
                    UsageTableColumnKey.OPERATION
                  ),
                  sortable: false,
                  className: 'd-flex justify-content-center',
                  Cell(props: { original: UsageRecord }) {
                    return (
                      <Link
                        to={`${
                          PAGE_ROUTE.ADMIN_RESOURCE_DETAILS_LINK
                        }${encodeResourceUsageDetailPageURL(
                          props.original.resource
                        )}`}
                      >
                        <i className="fa fa-info-circle"></i>
                      </Link>
                    );
                  },
                },
              ]}
              loading={this.usageDetail.isComplete ? false : true}
              defaultSorted={[
                {
                  id: UsageTableColumnKey.USAGE,
                  desc: true,
                },
              ]}
              showPagination={true}
              minRows={1}
            />
          </Tab>
        </Tabs>
      </>
    );
  }
}
