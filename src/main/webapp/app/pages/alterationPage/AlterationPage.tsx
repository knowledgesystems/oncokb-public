import React from 'react';
import { inject, observer } from 'mobx-react';
import { AnnotationStore } from 'app/store/AnnotationStore';
import { action, computed, IReactionDisposer, reaction } from 'mobx';
import AppStore from 'app/store/AppStore';
import { ANNOTATION_PAGE_TAB_KEYS } from 'app/config/constants';
import { decodeSlash, encodeSlash, getPageTitle } from 'app/shared/utils/Utils';
import { RouterStore } from 'mobx-react-router';
import { RouteComponentProps } from 'react-router';
import AnnotationPage, {
  AnnotationType,
} from 'app/pages/annotationPage/AnnotationPage';
import * as QueryString from 'query-string';
import {
  AlterationPageHashQueries,
  AlterationPageSearchQueries,
} from 'app/shared/route/types';
import autobind from 'autobind-decorator';
import WindowStore from 'app/store/WindowStore';
import AuthenticationStore from 'app/store/AuthenticationStore';
import { Helmet } from 'react-helmet-async';
import { getAlterationPageLink } from 'app/shared/utils/UrlUtils';

interface MatchParams {
  hugoSymbol: string;
  alteration: string;
  tumorType?: string;
}

interface AlterationPageProps extends RouteComponentProps<MatchParams> {
  appStore: AppStore;
  windowStore: WindowStore;
  routing: RouterStore;
  authenticationStore: AuthenticationStore;
}

@inject('appStore', 'routing', 'windowStore', 'authenticationStore')
@observer
export default class AlterationPage extends React.Component<
  AlterationPageProps,
  {}
> {
  private store: AnnotationStore;

  readonly reactions: IReactionDisposer[] = [];

  private selectedTab: ANNOTATION_PAGE_TAB_KEYS;

  constructor(props: any) {
    super(props);
    const alterationQuery = decodeSlash(props.match.params.alteration);
    if (props.match.params) {
      this.store = new AnnotationStore({
        type: alterationQuery
          ? AnnotationType.PROTEIN_CHANGE
          : AnnotationType.GENE,
        hugoSymbolQuery: props.match.params.hugoSymbol,
        alterationQuery,
        tumorTypeQuery: props.match.params.tumorType
          ? decodeSlash(props.match.params.tumorType)
          : props.match.params.tumorType,
      });
    }
    this.props.appStore.toFdaRecognizedContent = false;

    this.reactions.push(
      reaction(
        () => this.store.tumorTypeQuery,
        newTumorType => {
          let tumorTypeSection = encodeSlash(this.store.tumorTypeQuery);
          tumorTypeSection = tumorTypeSection ? `/${tumorTypeSection}` : '';
          this.props.routing.history.push({
            pathname: `/gene/${this.store.hugoSymbolQuery}/${this.store.alterationQuery}${tumorTypeSection}`,
            search: this.props.routing.location.search,
          });
        }
      ),
      reaction(
        () => [props.routing.location.search],
        ([search]) => {
          const queryStrings = QueryString.parse(
            search
          ) as AlterationPageSearchQueries;
          if (queryStrings.refGenome) {
            this.store.referenceGenomeQuery = queryStrings.refGenome;
          }
        },
        { fireImmediately: true }
      ),
      reaction(
        () => [props.routing.location.hash],
        ([hash]) => {
          const queryStrings = QueryString.parse(
            hash
          ) as AlterationPageHashQueries;
          if (queryStrings.tab) {
            this.selectedTab = queryStrings.tab;
            if (queryStrings.tab === ANNOTATION_PAGE_TAB_KEYS.FDA) {
              this.props.appStore.inFdaRecognizedContent = true;
            }
          }
        },
        true
      )
    );
  }

  @action
  updateQuery(prevProps: AlterationPageProps) {
    if (
      this.props.match.params.hugoSymbol !== prevProps.match.params.hugoSymbol
    ) {
      this.store.hugoSymbolQuery = this.props.match.params.hugoSymbol;
    }
    if (
      this.props.match.params.alteration !== prevProps.match.params.alteration
    ) {
      this.store.alterationQuery = this.props.match.params.alteration;
    }
    // When a cancer type changed from the URL, we need to propagate that to the store
    // but if the cancer type is unset, we need to clear the query in the store
    if (
      this.props.match.params.tumorType !== prevProps.match.params.tumorType
    ) {
      this.store.tumorTypeQuery = this.props.match.params.tumorType
        ? decodeSlash(this.props.match.params.tumorType)!
        : '';
    }
  }

  componentDidUpdate(prevProps: AlterationPageProps) {
    this.updateQuery(prevProps);
  }

  @computed
  get documentTitle() {
    const content = [];
    if (this.store.hugoSymbol) {
      content.push(this.store.hugoSymbol);
    }
    if (this.store.alterationQuery) {
      content.push(this.store.alterationQuery);
    }
    if (this.store.tumorTypeQuery) {
      content.push(`in ${this.store.cancerTypeName}`);
    }
    return getPageTitle(content.join(' '));
  }

  @autobind
  onChangeTab(
    selectedTabKey: ANNOTATION_PAGE_TAB_KEYS,
    newTabKey: ANNOTATION_PAGE_TAB_KEYS
  ) {
    if (newTabKey === ANNOTATION_PAGE_TAB_KEYS.FDA) {
      this.props.appStore.inFdaRecognizedContent = true;
    }
    if (
      selectedTabKey === ANNOTATION_PAGE_TAB_KEYS.FDA &&
      newTabKey !== ANNOTATION_PAGE_TAB_KEYS.FDA
    ) {
      this.props.appStore.showFdaModal = true;
    } else {
      const newHash: AlterationPageHashQueries = { tab: newTabKey };
      window.location.hash = QueryString.stringify(newHash);
    }
    this.selectedTab = newTabKey;
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{this.documentTitle}</title>
          <link
            id="canonical"
            rel="canonical"
            href={getAlterationPageLink({
              hugoSymbol: this.store.hugoSymbol,
              alteration: this.store.alterationQuery,
              cancerType: this.store.cancerTypeName,
              withProtocolHostPrefix: true,
            })}
          />
        </Helmet>
        <AnnotationPage
          store={this.store}
          appStore={this.props.appStore}
          routing={this.props.routing}
          windowStore={this.props.windowStore}
          authenticationStore={this.props.authenticationStore}
          annotationType={AnnotationType.PROTEIN_CHANGE}
          onChangeTumorType={newTumorType =>
            (this.store.tumorTypeQuery = newTumorType)
          }
          defaultSelectedTab={this.selectedTab}
          onChangeTab={this.onChangeTab}
        />
      </>
    );
  }
}
