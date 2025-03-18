import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  AnnotationStore,
  TherapeuticImplication,
  FdaImplication,
} from 'app/store/AnnotationStore';
import { AnnotationType } from '../annotationPage/AnnotationPage';
import { RouteComponentProps } from 'react-router';
import * as QueryString from 'query-string';
import {
  decodeSlash,
  getPageTitle,
  levelOfEvidence2Level,
  getCancerTypeNameFromOncoTreeType,
  getCancerTypesName,
  getTreatmentNameByPriority,
  articles2Citations,
  isCategoricalAlteration,
  isPositionalAlteration,
  getCategoricalAlterationDescription,
} from 'app/shared/utils/Utils';
import {
  getAlterationPageLink,
  parseAlterationPagePath,
  AlterationPageLink,
} from 'app/shared/utils/UrlUtils';
import { computed, reaction, action, observable } from 'mobx';
import { GENETIC_TYPE } from 'app/components/geneticTypeTabs/GeneticTypeTabs';
import { observer, inject } from 'mobx-react';
import styles from './SomaticGermlineAlterationPage.module.scss';
import classnames from 'classnames';
import StickyMiniNavBar, {
  StickyMiniNavBarContextProvider,
} from 'app/shared/nav/StickyMiniNavBar';
import AppStore from 'app/store/AppStore';
import ShowHideText from 'app/shared/texts/ShowHideText';
import { Col, Alert } from 'reactstrap';
import { Row, Container } from 'react-bootstrap';
import WindowStore from 'app/store/WindowStore';
import AuthenticationStore from 'app/store/AuthenticationStore';
import {
  EVIDENCE_TYPES,
  REFERENCE_GENOME,
  ANNOTATION_PAGE_TAB_KEYS,
  TREATMENT_EVIDENCE_TYPES,
  ONCOGENICITY,
  DEFAULT_MARGIN_BOTTOM_LG,
  DEFAULT_MARGIN_TOP_LG,
} from 'app/config/constants';
import { Alteration } from 'app/shared/api/generated/OncoKbAPI';
import {
  Evidence,
  VariantAnnotationTumorType,
} from 'app/shared/api/generated/OncoKbPrivateAPI';
import WithSeparator from 'react-with-separator';
import { uniqBy, upperFirst } from 'app/shared/utils/LodashUtils';
import {
  SummaryKey,
  getSummaries,
  getUniqueFdaImplications,
} from '../annotationPage/Utils';
import autobind from 'autobind-decorator';
import { AlterationPageHashQueries } from 'app/shared/route/types';
import MutationEffectDescription from '../annotationPage/MutationEffectDescription';
import MiniNavBarHeader from 'app/shared/nav/MiniNavBarHeader';
import { GenomicIndicatorTable } from '../genePage/GenomicIndicatorTable';
import { Else, If, Then } from 'react-if';
import LoadingIndicator, {
  LoaderSize,
} from 'app/components/loadingIndicator/LoadingIndicator';
import SomaticGermlineAlterationView from '../annotationPage/SomaticGermlineAlterationView';
import GermlineSomaticHeader from 'app/shared/header/GermlineSomaticHeader';
import SomaticGermlineBreadcrumbs from 'app/shared/nav/SomaticGermlineBreadcrumbs';
import { RouterStore } from 'mobx-react-router';
import { SomaticGermlineAlterationTiles } from 'app/shared/tiles/tile-utils';
import GeneticTypeTag from 'app/components/geneticTypeTag/GeneticTypeTag';
import VariantOverView from 'app/shared/sections/VariantOverview';

type MatchParams = {
  hugoSymbol: string;
  alteration: string;
};

type SomaticGermlineAlterationPageProps = {
  routing: RouterStore;
  appStore: AppStore;
  windowStore: WindowStore;
  authenticationStore: AuthenticationStore;
} & RouteComponentProps<MatchParams>;

type SomaticGermlineAlterationPageState = {};

@inject('appStore', 'windowStore', 'authenticationStore', 'routing')
@observer
export class SomaticGermlineAlterationPage extends React.Component<
  SomaticGermlineAlterationPageProps,
  SomaticGermlineAlterationPageState
> {
  private store: AnnotationStore;
  private selectedTab: ANNOTATION_PAGE_TAB_KEYS;

  @observable showMutationEffect = true;

  constructor(props: SomaticGermlineAlterationPageProps) {
    super(props);
    const alterationQuery = decodeSlash(props.match.params.alteration);
    reaction(
      () => [this.geneticType],
      ([geneticType]) => {
        if (props.match.params) {
          this.store = new AnnotationStore({
            type: alterationQuery
              ? AnnotationType.PROTEIN_CHANGE
              : AnnotationType.GENE,
            hugoSymbolQuery: props.match.params.hugoSymbol,
            alterationQuery,
            germline: geneticType === GENETIC_TYPE.GERMLINE,
          });
          if (this.store.cancerTypeName) {
            this.showMutationEffect = false;
          }
        }
      },
      true
    );
    reaction(
      () => [props.location.hash],
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
    );
  }

  @action.bound
  toggleMutationEffect(value: boolean) {
    this.showMutationEffect = value;
  }

  @computed
  get pageShouldBeRendered() {
    return (
      this.store.gene.isComplete &&
      this.store.geneNumber.isComplete &&
      this.store.ensemblGenes.isComplete &&
      this.store.clinicalAlterations.isComplete &&
      this.store.biologicalAlterations.isComplete &&
      this.store.annotationData.isComplete
    );
  }

  @computed
  get errorOccurred() {
    return (
      this.store.gene.isError ||
      this.store.geneNumber.isError ||
      this.store.ensemblGenes.isError ||
      this.store.clinicalAlterations.isError ||
      this.store.biologicalAlterations.isError ||
      this.store.annotationData.isError
    );
  }

  @computed
  get documentTitle() {
    const content = [];
    content.push(
      `${upperFirst(
        this.store.germline ? GENETIC_TYPE.GERMLINE : GENETIC_TYPE.SOMATIC
      )}`
    );
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

  @computed
  get geneticType() {
    const { geneticType } = parseAlterationPagePath(
      this.props.location.pathname
    );
    return geneticType ?? GENETIC_TYPE.SOMATIC;
  }

  onChangeTumorType(newTumorType: string) {
    this.store.tumorTypeQuery = newTumorType;
  }

  getImplications(evidences: Evidence[]) {
    return evidences.reduce((acc, evidence) => {
      const level = levelOfEvidence2Level(evidence.levelOfEvidence);
      const fdaLevel = levelOfEvidence2Level(evidence.fdaLevel);
      const alterations = evidence.alterations.filter(alteration =>
        alteration.referenceGenomes.includes(this.store.referenceGenomeQuery)
      );
      const alterationsName = alterations
        .map(alteration => alteration.name)
        .join(', ');
      const cancerTypes = evidence.cancerTypes.map(cancerType =>
        getCancerTypeNameFromOncoTreeType(cancerType)
      );
      const excludedCancerTypes = evidence.excludedCancerTypes.map(ct =>
        getCancerTypeNameFromOncoTreeType(ct)
      );
      const cancerTypesName = getCancerTypesName(
        cancerTypes,
        excludedCancerTypes
      );
      if (evidence.treatments.length > 0) {
        evidence.treatments.forEach(treatment => {
          acc.push({
            level,
            fdaLevel,
            drugDescription: evidence.description,
            alterations: alterationsName,
            alterationsView: (
              <WithSeparator separator={', '}>
                {alterations.map(alteration =>
                  alteration.consequence ? (
                    <AlterationPageLink
                      key={alteration.name}
                      hugoSymbol={this.store.hugoSymbol}
                      alteration={{
                        alteration: alteration.alteration,
                        name: alteration.name,
                      }}
                      alterationRefGenomes={
                        alteration.referenceGenomes as REFERENCE_GENOME[]
                      }
                      germline={this.store.germline}
                    />
                  ) : (
                    <span>{alteration.name}</span>
                  )
                )}
              </WithSeparator>
            ),
            drugs: getTreatmentNameByPriority(treatment),
            cancerTypes: cancerTypesName,
            cancerTypesView: (
              <>
                <WithSeparator separator={', '}>
                  {cancerTypes.map(cancerType => (
                    <AlterationPageLink
                      key={`${this.store.alterationName}-${cancerType}`}
                      hugoSymbol={this.store.hugoSymbol}
                      alteration={this.store.alterationName}
                      alterationRefGenomes={[this.store.referenceGenomeQuery]}
                      cancerType={cancerType}
                      germline={this.store.germline}
                    >
                      {cancerType}
                    </AlterationPageLink>
                  ))}
                </WithSeparator>
                {excludedCancerTypes.length > 0 ? (
                  <span> (excluding {excludedCancerTypes.join(', ')})</span>
                ) : (
                  <></>
                )}
              </>
            ),
            citations: articles2Citations(evidence.articles),
          } as TherapeuticImplication);
        });
      } else {
        acc.push({
          level,
          fdaLevel,
          drugDescription: evidence.description,
          alterations: alterationsName,
          alterationsView: (
            <WithSeparator separator={', '}>
              {alterations.map(alteration =>
                alteration.consequence ? (
                  <AlterationPageLink
                    key={alteration.name}
                    hugoSymbol={this.store.hugoSymbol}
                    alteration={{
                      alteration: alteration.alteration,
                      name: alteration.name,
                    }}
                    alterationRefGenomes={
                      alteration.referenceGenomes as REFERENCE_GENOME[]
                    }
                    germline={this.store.germline}
                  />
                ) : (
                  <span>{alteration.name}</span>
                )
              )}
            </WithSeparator>
          ),
          drugs: '',
          cancerTypes: cancerTypesName,
          cancerTypesView: (
            <>
              <WithSeparator separator={', '}>
                {cancerTypes.map(cancerType => (
                  <AlterationPageLink
                    key={`${this.store.alterationName}-${cancerType}`}
                    hugoSymbol={this.store.hugoSymbol}
                    alteration={this.store.alterationName}
                    alterationRefGenomes={[this.store.referenceGenomeQuery]}
                    cancerType={cancerType}
                    germline={this.store.germline}
                  >
                    {cancerType}
                  </AlterationPageLink>
                ))}
              </WithSeparator>
              {excludedCancerTypes.length > 0 ? (
                <span> (excluding {excludedCancerTypes.join(', ')})</span>
              ) : (
                <></>
              )}
            </>
          ),
          citations: articles2Citations(evidence.articles),
        } as TherapeuticImplication);
      }
      return acc;
    }, [] as TherapeuticImplication[]);
  }

  getEvidenceByEvidenceTypes(
    cancerTypes: VariantAnnotationTumorType[],
    evidenceTypes: EVIDENCE_TYPES[]
  ): Evidence[] {
    let uniqueEvidences: Evidence[] = [];
    cancerTypes.forEach(cancerType => {
      uniqueEvidences = uniqueEvidences.concat(
        cancerType.evidences.filter(evidence =>
          evidenceTypes.includes(evidence.evidenceType as EVIDENCE_TYPES)
        )
      );
    });

    return uniqBy(uniqueEvidences, evidence => evidence.id);
  }

  @computed
  get therapeuticImplications(): TherapeuticImplication[] {
    return this.getImplications(
      this.getEvidenceByEvidenceTypes(
        this.store.annotationData.result.tumorTypes,
        TREATMENT_EVIDENCE_TYPES
      )
    );
  }

  @computed
  get fdaImplication(): FdaImplication[] {
    const evidences = this.getEvidenceByEvidenceTypes(
      this.store.annotationData.result.tumorTypes,
      TREATMENT_EVIDENCE_TYPES
    );
    const fdaImplications: FdaImplication[] = [];
    evidences.forEach(evidence => {
      const level = levelOfEvidence2Level(evidence.levelOfEvidence);
      const fdaLevel = levelOfEvidence2Level(evidence.fdaLevel);
      const alterations = evidence.alterations.filter(alteration =>
        alteration.referenceGenomes.includes(this.store.referenceGenomeQuery)
      );
      alterations.forEach(alt => {
        // convert all alterations to matchedAlteration/alteration query if not positional variant
        let mappedAlteration = {} as Alteration;
        if (
          this.store.relevantAlterations.result
            .map(relevantAlt => relevantAlt.alteration)
            .includes(alt.alteration)
        ) {
          mappedAlteration = alt;
        } else {
          if (this.store.alteration.result) {
            mappedAlteration = this.store.alteration.result;
          } else {
            mappedAlteration.name = mappedAlteration.alteration = this.store.alterationName;
          }
        }
        const ctNames = evidence.cancerTypes.map(ct =>
          getCancerTypeNameFromOncoTreeType(ct)
        );
        const excludedCtNames = evidence.excludedCancerTypes.map(ct =>
          getCancerTypeNameFromOncoTreeType(ct)
        );
        fdaImplications.push({
          level: fdaLevel,
          alteration: mappedAlteration,
          alterationView: (
            <AlterationPageLink
              key={mappedAlteration.name}
              hugoSymbol={this.store.hugoSymbol}
              alteration={{
                alteration: mappedAlteration.alteration,
                name: mappedAlteration.name,
              }}
              alterationRefGenomes={
                mappedAlteration.referenceGenomes as REFERENCE_GENOME[]
              }
              hashQueries={{
                tab: ANNOTATION_PAGE_TAB_KEYS.FDA,
              }}
              germline={this.store.germline}
            />
          ),
          cancerType: getCancerTypesName(ctNames, excludedCtNames),
          cancerTypeView: (
            <>
              <WithSeparator separator={', '}>
                {ctNames.map(cancerType => (
                  <AlterationPageLink
                    key={`${this.store.alterationName}-${cancerType}`}
                    hugoSymbol={this.store.hugoSymbol}
                    alteration={this.store.alterationName}
                    alterationRefGenomes={[this.store.referenceGenomeQuery]}
                    cancerType={cancerType}
                    hashQueries={{
                      tab: ANNOTATION_PAGE_TAB_KEYS.FDA,
                    }}
                    germline={this.store.germline}
                  >
                    {cancerType}
                  </AlterationPageLink>
                ))}
              </WithSeparator>
              {excludedCtNames.length > 0 ? (
                <span> (excluding {excludedCtNames.join(', ')})</span>
              ) : (
                <></>
              )}
            </>
          ),
        });
      });
    });
    return getUniqueFdaImplications(fdaImplications);
  }

  @computed
  get diagnosticImplications(): TherapeuticImplication[] {
    return this.getImplications(
      this.getEvidenceByEvidenceTypes(
        this.store.annotationData.result.tumorTypes,
        [EVIDENCE_TYPES.DIAGNOSTIC_IMPLICATION]
      )
    );
  }

  @computed
  get prognosticImplications(): TherapeuticImplication[] {
    return this.getImplications(
      this.getEvidenceByEvidenceTypes(
        this.store.annotationData.result.tumorTypes,
        [EVIDENCE_TYPES.PROGNOSTIC_IMPLICATION]
      )
    );
  }

  @computed
  get alterationSummaries() {
    const orderedSummaries = [SummaryKey.GENE_SUMMARY];
    if (!this.isCategoricalAlteration) {
      orderedSummaries.push(SummaryKey.ALTERATION_SUMMARY);
    }
    return getSummaries(this.store.annotationData.result, orderedSummaries);
  }

  @computed get isCategoricalAlteration() {
    return isCategoricalAlteration(this.store.alterationName);
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

  @computed
  get isPositionalAlteration() {
    return isPositionalAlteration(
      this.store.annotationData.result.query.proteinStart,
      this.store.annotationData.result.query.proteinEnd,
      this.store.annotationData.result.query.consequence
    );
  }

  get isUnknownOncogenicity() {
    return (
      !this.store.annotationData.result.oncogenic ||
      this.store.annotationData.result.oncogenic === ONCOGENICITY.UNKNOWN
    );
  }

  render() {
    return (
      <div className="view-wrapper">
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
        {this.pageShouldBeRendered ? (
          <StickyMiniNavBarContextProvider>
            <Container>
              <Row className="justify-content-center">
                <Col md={11}>
                  <SomaticGermlineBreadcrumbs
                    hugoSymbol={this.store.hugoSymbol}
                    alterationName={this.store.alterationName}
                    cancerTypeName={this.store.cancerTypeName}
                    alterationNameWithDiff={this.store.alterationNameWithDiff}
                    germline={this.store.germline}
                  />
                  <GermlineSomaticHeader
                    includeEmailLink
                    annotation={{
                      gene: this.store.hugoSymbol,
                      alteration: this.store.alterationName,
                      cancerType: this.store.cancerTypeName,
                    }}
                    appStore={this.props.appStore}
                    alteration={this.store.alterationNameWithDiff}
                    proteinAlteration={
                      this.store.alteration.result?.proteinChange
                    }
                    isGermline={this.store.germline}
                  />
                </Col>
                <Col md={11}>
                  <Row className={classnames(styles.descriptionContainer)}>
                    <Col>
                      <VariantOverView
                        alterationSummaries={this.alterationSummaries}
                        hugoSymbol={this.store.hugoSymbol}
                        alteration={
                          this.store.annotationData.result.query.alteration
                        }
                        oncogene={this.store.gene.result.oncogene}
                        tsg={this.store.gene.result.tsg}
                      />
                    </Col>
                  </Row>
                  {this.store.annotationData.result.mutationEffect
                    .description && (
                    <Row className={classnames(styles.descriptionContainer)}>
                      <Col>
                        <ShowHideText
                          show={this.showMutationEffect}
                          title="mutation effect description"
                          content={
                            <MutationEffectDescription
                              hugoSymbol={this.store.hugoSymbol}
                              description={
                                this.store.annotationData.result.mutationEffect
                                  .description
                              }
                            />
                          }
                          onClick={() =>
                            this.toggleMutationEffect(!this.showMutationEffect)
                          }
                        />
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </Container>
            <Container>
              <Row className="justify-content-center">
                <Col md={11}>
                  <SomaticGermlineAlterationTiles
                    includeTitle
                    variantAnnotation={this.store.annotationData.result}
                    isGermline={this.store.germline}
                  />
                </Col>
              </Row>
            </Container>
            <StickyMiniNavBar
              title={
                <span className={'d-flex align-items-center'}>
                  <span>
                    {this.store.hugoSymbol} {this.store.alterationNameWithDiff}{' '}
                  </span>
                  <GeneticTypeTag
                    className={'ml-2'}
                    isGermline={this.store.germline}
                  />
                </span>
              }
            />
            <Container>
              <Row className="justify-content-center">
                <Col md={11}>
                  {this.store.germline &&
                    (this.store.genomicIndicators.isPending ||
                      this.store.genomicIndicators.result.length > 0) && (
                      <>
                        <MiniNavBarHeader id="genomic-indicators">
                          Genomic Indicators
                        </MiniNavBarHeader>
                        <GenomicIndicatorTable
                          data={this.store.genomicIndicators.result}
                          isPending={this.store.genomicIndicators.isPending}
                        />
                      </>
                    )}
                  <MiniNavBarHeader id="clinical-implications">
                    Clinical Implications For This Biomarker
                  </MiniNavBarHeader>
                  <SomaticGermlineAlterationView
                    appStore={this.props.appStore}
                    hugoSymbol={this.store.hugoSymbol}
                    alteration={this.store.alterationName}
                    alterationQuery={this.store.alterationQuery}
                    germline={this.store.germline}
                    matchedAlteration={this.store.alteration.result}
                    tumorType={this.store.cancerTypeName}
                    onChangeTumorType={this.onChangeTumorType.bind(this)}
                    annotation={this.store.annotationData.result}
                    biologicalAlterations={
                      this.store.biologicalAlterations.result
                    }
                    relevantAlterations={undefined}
                    fdaImplication={this.fdaImplication}
                    therapeuticImplications={this.therapeuticImplications}
                    diagnosticImplications={this.diagnosticImplications}
                    prognosticImplications={this.prognosticImplications}
                    defaultSelectedTab={this.selectedTab}
                    onChangeTab={this.onChangeTab}
                    routing={this.props.routing}
                  />
                </Col>
              </Row>
            </Container>
          </StickyMiniNavBarContextProvider>
        ) : (
          <If condition={this.errorOccurred}>
            <Then>
              <Alert variant="warning" className={'text-center'}>
                An error occurred while annotating your variant.
              </Alert>
            </Then>
            <Else>
              <LoadingIndicator
                size={LoaderSize.LARGE}
                center={true}
                isLoading={true}
              />
            </Else>
          </If>
        )}
      </div>
    );
  }
}
