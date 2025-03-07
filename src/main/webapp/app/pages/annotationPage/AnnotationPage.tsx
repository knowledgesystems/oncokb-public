import React from 'react';
import { observer } from 'mobx-react';

import {
  AlterationPageLink,
  getAlterationPageLink,
  getGenePageLink,
  getGenomicPageLink,
  getGenomicPageLocation,
} from 'app/shared/utils/UrlUtils';
import {
  ANNOTATION_PAGE_TAB_KEYS,
  DEFAULT_GENE,
  DEFAULT_MARGIN_BOTTOM_LG,
  EVIDENCE_TYPES,
  OTHER_BIOMARKERS,
  PAGE_ROUTE,
  REFERENCE_GENOME,
  TREATMENT_EVIDENCE_TYPES,
} from 'app/config/constants';
import styles from 'app/pages/alterationPage/AlterationPage.module.scss';
import { AlterationInfo } from 'app/pages/annotationPage/AlterationInfo';
import { Col, Row, Alert, Container } from 'react-bootstrap';
import classnames from 'classnames';
import { action, computed, observable } from 'mobx';
import * as QueryString from 'querystring';
import {
  Evidence,
  VariantAnnotationTumorType,
} from 'app/shared/api/generated/OncoKbPrivateAPI';
import {
  AnnotationStore,
  FdaImplication,
  TherapeuticImplication,
} from 'app/store/AnnotationStore';
import {
  articles2Citations,
  getCancerTypeNameFromOncoTreeType,
  getCancerTypesName,
  getCategoricalAlterationDescription,
  getTreatmentNameByPriority,
  isCategoricalAlteration,
  isPositionalAlteration,
  levelOfEvidence2Level,
} from 'app/shared/utils/Utils';
import WithSeparator from 'react-with-separator';
import AppStore from 'app/store/AppStore';
import { FeedbackIcon } from 'app/components/feedback/FeedbackIcon';
import { FeedbackType } from 'app/components/feedback/types';
import { Alteration } from 'app/shared/api/generated/OncoKbAPI';
import {
  getSummaries,
  getUniqueFdaImplications,
  SummaryKey,
} from 'app/pages/annotationPage/Utils';
import ShowHideText from 'app/shared/texts/ShowHideText';
import AlterationView from 'app/pages/annotationPage/AlterationView';
import { CancerTypeView } from 'app/pages/annotationPage/CancerTypeView';
import AuthenticationStore from 'app/store/AuthenticationStore';
import WindowStore from 'app/store/WindowStore';

import gnLogo from 'content/images/gn_logo.png';
import revueLogo from 'content/images/revue_logo.png';
import { PowerBySource } from 'app/pages/annotationPage/PowerBySource';
import {
  AnnotationBreadcrumbs,
  IDropdownBreadcrumb,
  IInputBreadcrumb,
  ILinkBreadcrumb,
  ITextBreadcrumb,
} from 'app/pages/annotationPage/AnnotationBreadcrumbs';
import LoadingIndicator, {
  LoaderSize,
} from 'app/components/loadingIndicator/LoadingIndicator';
import { Else, If, Then } from 'react-if';
import { UnknownGeneAlert } from 'app/shared/alert/UnknownGeneAlert';
import { RouterStore } from 'mobx-react-router';
import { Option } from 'app/shared/select/FormSelectWithLabelField';
import MutationEffectDescription from 'app/pages/annotationPage/MutationEffectDescription';
import { uniqBy } from 'app/shared/utils/LodashUtils';
import { Helmet } from 'react-helmet-async';

export enum AnnotationType {
  GENE,
  PROTEIN_CHANGE,
  HGVSG,
  GENOMIC_CHANGE,
}

export type IAnnotationPage = {
  routing: RouterStore;
  appStore: AppStore;
  windowStore: WindowStore;
  store: AnnotationStore;
  annotationType: AnnotationType;
  onChangeTumorType: (newTumorType: string) => void;
  relevantAlterations?: Alteration[];
  defaultSelectedTab?: ANNOTATION_PAGE_TAB_KEYS;
  onChangeTab?: (
    selectedTabKey: ANNOTATION_PAGE_TAB_KEYS,
    newTabKey: ANNOTATION_PAGE_TAB_KEYS
  ) => void;
  authenticationStore: AuthenticationStore;
};

@observer
export default class AnnotationPage extends React.Component<
  IAnnotationPage,
  {}
> {
  @observable showMutationEffect = true;

  constructor(props: any) {
    super(props);
    if (this.props.store.cancerTypeName) {
      this.showMutationEffect = false;
    }
  }

  @action.bound
  toggleMutationEffect(value: boolean) {
    this.showMutationEffect = value;
  }

  getImplications(evidences: Evidence[]) {
    return evidences.reduce((acc, evidence) => {
      const level = levelOfEvidence2Level(evidence.levelOfEvidence);
      const fdaLevel = levelOfEvidence2Level(evidence.fdaLevel);
      const alterations = evidence.alterations.filter(alteration =>
        alteration.referenceGenomes.includes(
          this.props.store.referenceGenomeQuery
        )
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
                      hugoSymbol={this.props.store.hugoSymbol}
                      alteration={{
                        alteration: alteration.alteration,
                        name: alteration.name,
                      }}
                      alterationRefGenomes={
                        alteration.referenceGenomes as REFERENCE_GENOME[]
                      }
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
                      key={`${this.props.store.alterationName}-${cancerType}`}
                      hugoSymbol={this.props.store.hugoSymbol}
                      alteration={this.props.store.alterationName}
                      alterationRefGenomes={[
                        this.props.store.referenceGenomeQuery,
                      ]}
                      cancerType={cancerType}
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
                    hugoSymbol={this.props.store.hugoSymbol}
                    alteration={{
                      alteration: alteration.alteration,
                      name: alteration.name,
                    }}
                    alterationRefGenomes={
                      alteration.referenceGenomes as REFERENCE_GENOME[]
                    }
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
                    key={`${this.props.store.alterationName}-${cancerType}`}
                    hugoSymbol={this.props.store.hugoSymbol}
                    alteration={this.props.store.alterationName}
                    alterationRefGenomes={[
                      this.props.store.referenceGenomeQuery,
                    ]}
                    cancerType={cancerType}
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
        this.props.store.annotationData.result.tumorTypes,
        TREATMENT_EVIDENCE_TYPES
      )
    );
  }

  @computed
  get fdaImplication(): FdaImplication[] {
    const evidences = this.getEvidenceByEvidenceTypes(
      this.props.store.annotationData.result.tumorTypes,
      TREATMENT_EVIDENCE_TYPES
    );
    const fdaImplications: FdaImplication[] = [];
    evidences.forEach(evidence => {
      const level = levelOfEvidence2Level(evidence.levelOfEvidence);
      const fdaLevel = levelOfEvidence2Level(evidence.fdaLevel);
      const alterations = evidence.alterations.filter(alteration =>
        alteration.referenceGenomes.includes(
          this.props.store.referenceGenomeQuery
        )
      );
      alterations.forEach(alt => {
        // convert all alterations to matchedAlteration/alteration query if not positional variant
        let mappedAlteration = {} as Alteration;
        if (
          this.props.store.relevantAlterations.result
            .map(relevantAlt => relevantAlt.alteration)
            .includes(alt.alteration)
        ) {
          mappedAlteration = alt;
        } else {
          if (this.props.store.alteration.result) {
            mappedAlteration = this.props.store.alteration.result;
          } else {
            mappedAlteration.name = mappedAlteration.alteration = this.props.store.alterationName;
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
              hugoSymbol={this.props.store.hugoSymbol}
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
            />
          ),
          cancerType: getCancerTypesName(ctNames, excludedCtNames),
          cancerTypeView: (
            <>
              <WithSeparator separator={', '}>
                {ctNames.map(cancerType => (
                  <AlterationPageLink
                    key={`${this.props.store.alterationName}-${cancerType}`}
                    hugoSymbol={this.props.store.hugoSymbol}
                    alteration={this.props.store.alterationName}
                    alterationRefGenomes={[
                      this.props.store.referenceGenomeQuery,
                    ]}
                    cancerType={cancerType}
                    hashQueries={{
                      tab: ANNOTATION_PAGE_TAB_KEYS.FDA,
                    }}
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
        this.props.store.annotationData.result.tumorTypes,
        [EVIDENCE_TYPES.DIAGNOSTIC_IMPLICATION]
      )
    );
  }

  @computed
  get prognosticImplications(): TherapeuticImplication[] {
    return this.getImplications(
      this.getEvidenceByEvidenceTypes(
        this.props.store.annotationData.result.tumorTypes,
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
    return getSummaries(
      this.props.store.annotationData.result,
      orderedSummaries
    );
  }

  @computed get isCategoricalAlteration() {
    return isCategoricalAlteration(this.props.store.alterationName);
  }

  @computed
  get showGeneName() {
    const lHugo = this.props.store.hugoSymbol.toLowerCase();
    const altNameIncludesGene = this.props.store.annotationData.result.query.alteration
      .toLowerCase()
      .includes(lHugo);
    const isOtherBiomarkers = lHugo === OTHER_BIOMARKERS.toLowerCase();
    return !altNameIncludesGene && !isOtherBiomarkers;
  }

  @computed
  get pageShouldBeRendered() {
    if (this.props.annotationType === AnnotationType.PROTEIN_CHANGE) {
      return (
        this.props.store.gene.isComplete &&
        this.props.store.geneNumber.isComplete &&
        this.props.store.ensemblGenes.isComplete &&
        this.props.store.clinicalAlterations.isComplete &&
        this.props.store.biologicalAlterations.isComplete &&
        this.props.store.annotationData.isComplete
      );
    } else {
      return this.props.store.annotationData.isComplete;
    }
  }

  @computed
  get annotationPageMetaDescription() {
    if (this.pageShouldBeRendered) {
      return `${this.props.store.annotationData.result.geneSummary} ${this.props.store.annotationData.result.variantSummary} ${this.props.store.annotationData.result.tumorTypeSummary}`;
    } else {
      return '';
    }
  }

  @computed
  get navBreadcrumbs() {
    let breadcrumbs: (
      | ITextBreadcrumb
      | ILinkBreadcrumb
      | IDropdownBreadcrumb
      | IInputBreadcrumb
    )[] = [];
    switch (this.props.annotationType) {
      case AnnotationType.PROTEIN_CHANGE:
        breadcrumbs = [
          {
            type: 'link',
            key: 'gene',
            text: this.props.store.hugoSymbol,
            to: getGenePageLink({
              hugoSymbol: this.props.store.hugoSymbol,
            }),
          } as ILinkBreadcrumb,
          {
            type: 'link',
            key: 'alteration',
            text: this.props.store.alterationNameWithDiff,
            to: getAlterationPageLink({
              hugoSymbol: this.props.store.hugoSymbol,
              alteration: this.props.store.alterationName,
            }),
          } as ILinkBreadcrumb,
        ];
        break;
      case AnnotationType.HGVSG:
        breadcrumbs = [
          {
            type: 'dropdown',
            key: 'referenceGenome',
            text: this.props.store.referenceGenomeQuery,
            onChange: (selectedOption: Option) => {
              this.props.routing.history.push(
                getGenomicPageLink({
                  rootRoute: PAGE_ROUTE.HGVSG,
                  query: this.props.store.hgvsgQuery,
                  refGenome: selectedOption.value as REFERENCE_GENOME,
                  cancerType: this.props.store.cancerTypeName,
                })
              );
            },
            options: [REFERENCE_GENOME.GRCh37, REFERENCE_GENOME.GRCh38],
          } as IDropdownBreadcrumb,
          {
            type: 'input',
            key: 'hgvsg',
            text: this.props.store.hgvsgQuery,
            onChange: (newQuery: string) => {
              const location = getGenomicPageLocation({
                rootRoute: PAGE_ROUTE.HGVSG,
                query: newQuery,
                refGenome: this.props.store.referenceGenomeQuery,
                cancerType: this.props.store.cancerTypeName,
              });
              window.location.search = QueryString.stringify(location.search);
              window.location.pathname = location.pathname;
            },
          } as IInputBreadcrumb,
        ];
        break;
      case AnnotationType.GENOMIC_CHANGE:
        breadcrumbs = [
          {
            type: 'dropdown',
            key: 'referenceGenome',
            text: this.props.store.referenceGenomeQuery,
            onChange: (selectedOption: Option) => {
              this.props.routing.history.push(
                getGenomicPageLink({
                  rootRoute: PAGE_ROUTE.GENOMIC_CHANGE,
                  query: this.props.store.genomicChangeQuery,
                  refGenome: selectedOption.value as REFERENCE_GENOME,
                  cancerType: this.props.store.cancerTypeName,
                })
              );
            },
            options: [REFERENCE_GENOME.GRCh37, REFERENCE_GENOME.GRCh38],
          } as IDropdownBreadcrumb,
          {
            type: 'input',
            key: 'genomicChange',
            text: this.props.store.genomicChangeQuery,
            onChange: (newQuery: string) => {
              const location = getGenomicPageLocation({
                rootRoute: PAGE_ROUTE.GENOMIC_CHANGE,
                query: newQuery,
                refGenome: this.props.store.referenceGenomeQuery,
                cancerType: this.props.store.cancerTypeName,
              });
              window.location.search = QueryString.stringify(location.search);
              window.location.pathname = location.pathname;
            },
          } as IInputBreadcrumb,
        ];
        break;
      default:
        break;
    }

    if (this.props.store.cancerTypeName) {
      breadcrumbs.push({
        type: 'text',
        text: this.props.store.cancerTypeName,
        key: 'cancertype',
      } as ITextBreadcrumb);
    }

    return <AnnotationBreadcrumbs breadcrumbs={breadcrumbs} />;
  }

  getAnnotationComponents() {
    const categoricalAlterationDescription = getCategoricalAlterationDescription(
      this.props.store.hugoSymbol,
      this.props.store.annotationData.result.query.alteration,
      this.props.store.gene.result.oncogene,
      this.props.store.gene.result.tsg
    );
    return (
      <>
        <Helmet>
          <meta
            name="description"
            content={this.annotationPageMetaDescription}
          />
        </Helmet>
        <div className={'d-flex justify-content-between flex-wrap'}>
          <div style={{ flex: '1 1 300px' }}>
            <h2
              className={'d-flex align-items-baseline flex-wrap'}
              style={{ marginBottom: 0 }}
            >
              {this.showGeneName && (
                <span className={'mr-2'}>{this.props.store.hugoSymbol}</span>
              )}
              <span>{this.props.store.alterationNameWithDiff}</span>
              {this.props.store.cancerTypeName && (
                <span className={'mx-2'}>
                  in {this.props.store.cancerTypeName}
                </span>
              )}
              <span style={{ fontSize: '0.5em' }} className={'ml-2'}>
                <FeedbackIcon
                  feedback={{
                    type: FeedbackType.ANNOTATION,
                    annotation: {
                      gene: this.props.store.hugoSymbol,
                      alteration: this.props.store.alterationName,
                      cancerType: this.props.store.cancerTypeName,
                    },
                  }}
                  appStore={this.props.appStore}
                />
              </span>
            </h2>
            <AlterationInfo
              isPositionalAlteration={isPositionalAlteration(
                this.props.store.annotationData.result.query.proteinStart,
                this.props.store.annotationData.result.query.proteinEnd,
                this.props.store.annotationData.result.query.consequence
              )}
              oncogenicity={this.props.store.annotationData.result.oncogenic}
              mutationEffect={
                this.isCategoricalAlteration
                  ? undefined
                  : this.props.store.annotationData.result.mutationEffect
              }
              isVus={this.props.store.annotationData.result.vus}
              highestSensitiveLevel={
                this.props.store.annotationData.result.highestSensitiveLevel
              }
              highestResistanceLevel={
                this.props.store.annotationData.result.highestResistanceLevel
              }
              highestDiagnosticImplicationLevel={
                this.props.store.annotationData.result
                  .highestDiagnosticImplicationLevel
              }
              highestPrognosticImplicationLevel={
                this.props.store.annotationData.result
                  .highestPrognosticImplicationLevel
              }
              highestFdaLevel={
                this.props.store.annotationData.result.highestFdaLevel
              }
            />
            {categoricalAlterationDescription && (
              <div
                className={classnames(
                  styles.categoricalAltDescription,
                  DEFAULT_MARGIN_BOTTOM_LG
                )}
              >
                {categoricalAlterationDescription}
              </div>
            )}
            {this.alterationSummaries.map(summary => {
              return (
                <div key={summary.content} className={DEFAULT_MARGIN_BOTTOM_LG}>
                  {summary.content}
                </div>
              );
            })}
          </div>
          {(this.props.annotationType === AnnotationType.HGVSG ||
            this.props.annotationType === AnnotationType.GENOMIC_CHANGE) && (
            <div className={'my-1 d-flex flex-column align-items-center'}>
              <div>Genomic annotation powered by</div>
              <PowerBySource
                name={'Genome Nexus'}
                url={'genomenexus.org'}
                logo={gnLogo}
              />
              {this.props.store.annotationData.result.vue && (
                <PowerBySource
                  name={'reVUE'}
                  url={'cancerrevue.org'}
                  logo={revueLogo}
                />
              )}
            </div>
          )}
        </div>
        {this.props.store.annotationData.result.mutationEffect.description && (
          <Row>
            <Col>
              <ShowHideText
                show={this.showMutationEffect}
                title="mutation effect description"
                content={
                  <MutationEffectDescription
                    hugoSymbol={this.props.store.hugoSymbol}
                    description={
                      this.props.store.annotationData.result.mutationEffect
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
        {this.props.store.cancerTypeName ? (
          <CancerTypeView
            appStore={this.props.appStore}
            isLargeScreen={this.props.windowStore.isLargeScreen}
            userAuthenticated={
              this.props.authenticationStore.isUserAuthenticated
            }
            hugoSymbol={this.props.store.hugoSymbol}
            alteration={this.props.store.alterationName}
            matchedAlteration={this.props.store.alteration.result}
            tumorType={this.props.store.cancerTypeName}
            onChangeTumorType={this.props.onChangeTumorType}
            annotation={this.props.store.annotationData.result}
            biologicalAlterations={
              this.props.store.biologicalAlterations.result
            }
            relevantAlterations={this.props.relevantAlterations}
            fdaImplication={this.fdaImplication}
            therapeuticImplications={this.therapeuticImplications}
            diagnosticImplications={this.diagnosticImplications}
            prognosticImplications={this.prognosticImplications}
            defaultSelectedTab={this.props.defaultSelectedTab}
            onChangeTab={this.props.onChangeTab}
          />
        ) : (
          <AlterationView
            appStore={this.props.appStore}
            hugoSymbol={this.props.store.hugoSymbol}
            alteration={this.props.store.alterationName}
            matchedAlteration={this.props.store.alteration.result}
            tumorType={this.props.store.cancerTypeName}
            onChangeTumorType={this.props.onChangeTumorType}
            annotation={this.props.store.annotationData.result}
            biologicalAlterations={
              this.props.store.biologicalAlterations.result
            }
            relevantAlterations={this.props.relevantAlterations}
            fdaImplication={this.fdaImplication}
            therapeuticImplications={this.therapeuticImplications}
            diagnosticImplications={this.diagnosticImplications}
            prognosticImplications={this.prognosticImplications}
            defaultSelectedTab={this.props.defaultSelectedTab}
            onChangeTab={this.props.onChangeTab}
          />
        )}
      </>
    );
  }

  render() {
    return this.props.annotationType === AnnotationType.GENE &&
      (this.props.store.gene.isError ||
        this.props.store.gene.result === DEFAULT_GENE) ? (
      <UnknownGeneAlert />
    ) : (
      <Container>
        <Row className="justify-content-center">
          <Col md={11}>
            {this.navBreadcrumbs}
            {this.pageShouldBeRendered ? (
              this.props.store.annotationData.result.query.hugoSymbol ? (
                this.getAnnotationComponents()
              ) : (
                <Alert variant="warning" className={'text-center'}>
                  We do not have any information for this variant
                </Alert>
              )
            ) : (
              <If condition={this.props.store.annotationData.isError}>
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
          </Col>
        </Row>
      </Container>
    );
  }
}
