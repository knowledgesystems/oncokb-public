import React, { useEffect, useState } from 'react';
import OncoKBTable, {
  SearchColumn,
} from 'app/components/oncokbTable/OncoKBTable';
import poTxs from 'content/files/precisionOncologyTherapies/precision_oncology_therapies.json';
import poTxsExcel from 'content/files/precisionOncologyTherapies/precision_oncology_therapies.xlsx';
import {
  COMPONENT_PADDING,
  LG_TABLE_FIXED_HEIGHT,
  ONCOKB_TM,
} from 'app/config/constants';
import { filterByKeyword } from 'app/shared/utils/Utils';
import { Button, Col, Row } from 'react-bootstrap';
import classnames from 'classnames';
import Select from 'react-select';
import _ from 'lodash';
import { Input } from 'reactstrap';
import { DownloadButton } from 'app/components/downloadButton/DownloadButton';
import WithSeparator from 'react-with-separator';
import InfoIcon from 'app/shared/icons/InfoIcon';
import ShowHideText from 'app/shared/texts/ShowHideText';

type PrecisionOncologyTherapy = {
  year: string;
  tx: string;
  biomarker: string;
  biomarkerDetection: string;
  drugClassification: string;
};
type SelectOption = {
  value: string;
  label: string;
};

enum DRUG_CLASSIFICATION {
  FIRST_IN_CLASS = 'First-in-class',
  MECHANISTICALLY_DISTINCT = 'Mechanistically-distinct',
  FOLLOW_ON = 'Follow-on',
  RESISTANCE = 'Resistance',
  NA = 'NA',
}

const sortAndUniqByValue = (
  txs: PrecisionOncologyTherapy[],
  key: keyof PrecisionOncologyTherapy,
  separators?: string[]
) => {
  return _.chain(txs)
    .reduce((acc, tx: PrecisionOncologyTherapy) => {
      const methods =
        (separators || []).length > 0
          ? tx[key]
              .split(new RegExp(`${separators?.join('|')}`))
              .map(method => method.trim())
          : [tx[key]];
      const options = methods.map((method: string) => {
        return {
          value: method,
          label: method,
        };
      });
      acc.push(...options);
      return acc;
    }, [] as SelectOption[])
    .uniqBy('value')
    .sortBy('value')
    .value();
};
const footnotes = {
  a:
    'The first year the drug received FDA-approval in any indication, irrespective of whether the biomarker was included in the FDA-drug at that time',
  b:
    'Includes pathognomonic and indication-specific biomarkers, that while not specifically listed in the Indications and Usage section of the FDA drug label, are targeted by the precision oncology drug (ex KIT D816 in systemic mastocytosis [avapritinib] and SMARCB1 deletion in epithelioid sarcoma [tazemetostat])',
  c:
    'If there is a corresponding FDA-cleared or -approved companion diagnostic device for biomarker identification, the detection method associated with this device is listed; if the biomarker can be detected by a DNA/NGS-based detection method this is listed first',
  d:
    'Only drugs with an FDA-specified biomarker that can be detected by a DNA/NGS-based detection method are classified',
  e:
    'Pembrolizumab in combination with lenvatinib is FDA-approved approved for endometrial cancer that is pMMR',
  '*':
    'The exact year of the drug’s first FDA-approval could not be determined due to absent or ambiguous data on FDA.gov website',
  naDetectionMethod:
    'Only precision oncology drugs in which the biomarker can be identified by a DNA/NGS detection method are further classified as first-in-class, mechanically distinct, follow-on, or resistance drugs.',
};

const DefinitionTooltip: React.FunctionComponent<{
  footnoteKey: keyof typeof footnotes;
}> = props => {
  return (
    <InfoIcon
      className={'ml-2'}
      overlay={<span>{footnotes[props.footnoteKey]}</span>}
    />
  );
};
const PrecisionOncologyTherapiesPage: React.FunctionComponent<{}> = props => {
  const [showDefinition, setShowDefinition] = useState(false);
  const [hasFilter, setHasFilter] = useState(false);
  const [biomarkerSearch, setBiomarkerSearch] = useState('');
  const [therapySearch, setTherapySearch] = useState('');
  const [selectedDetectionMethods, setSelectedDetectionMethods] = useState<
    SelectOption[]
  >([]);
  const [
    selectedDrugClassifications,
    setSelectedDrugClassifications,
  ] = useState<SelectOption[]>([]);
  const [filteredPoTxs, setFilteredPoTxs] = useState<
    PrecisionOncologyTherapy[]
  >(poTxs);
  const [drugClassificationStats, setDrugClassificationStats] = useState<{
    [key: string]: PrecisionOncologyTherapy[];
  }>({});

  useEffect(() => {
    if (
      biomarkerSearch ||
      therapySearch ||
      selectedDetectionMethods.length > 0 ||
      selectedDrugClassifications.length > 0
    ) {
      setHasFilter(true);
    } else {
      setHasFilter(false);
    }
    setFilteredPoTxs([
      ...poTxs.filter((tx: PrecisionOncologyTherapy) => {
        if (
          selectedDetectionMethods.length > 0 &&
          selectedDetectionMethods.filter(selectedDetectionMethod =>
            tx.biomarkerDetection.includes(selectedDetectionMethod.value)
          ).length === 0
        ) {
          return false;
        }
        if (
          selectedDrugClassifications.length > 0 &&
          !selectedDrugClassifications
            .map(dc => dc.value)
            .includes(tx.drugClassification)
        ) {
          return false;
        }
        if (
          therapySearch &&
          tx.tx &&
          !tx.tx.toLowerCase().includes(therapySearch.toLowerCase())
        ) {
          return false;
        }
        if (
          biomarkerSearch &&
          tx.biomarker &&
          !tx.biomarker.toLowerCase().includes(biomarkerSearch.toLowerCase())
        ) {
          return false;
        }
        return true;
      }),
    ]);
  }, [
    biomarkerSearch,
    therapySearch,
    selectedDetectionMethods.length,
    selectedDrugClassifications.length,
  ]);

  useEffect(() => {
    setDrugClassificationStats(
      _.groupBy(filteredPoTxs, tx => tx.drugClassification)
    );
  }, [filteredPoTxs]);

  const clearFilters = () => {
    setBiomarkerSearch('');
    setTherapySearch('');
    setSelectedDetectionMethods([]);
    setSelectedDrugClassifications([]);
  };

  const columns: SearchColumn<PrecisionOncologyTherapy>[] = [
    {
      accessor: 'tx',
      Header: <span>Precision oncology therapy</span>,
      onFilter: (data: PrecisionOncologyTherapy, keyword) =>
        filterByKeyword(data.tx, keyword),
    },
    {
      accessor: 'biomarker',
      Header: (
        <span>
          FDA-recognized biomarker(s)
          <DefinitionTooltip footnoteKey={'b'} />
        </span>
      ),
      onFilter: (data: PrecisionOncologyTherapy, keyword) =>
        filterByKeyword(data.biomarker, keyword),
    },
    {
      accessor: 'biomarkerDetection',
      Header: (
        <span>
          Method of biomarker detection
          <DefinitionTooltip footnoteKey={'c'} />
        </span>
      ),
      onFilter: (data: PrecisionOncologyTherapy, keyword) =>
        filterByKeyword(data.biomarkerDetection, keyword),
    },
    {
      accessor: 'drugClassification',
      Header: (
        <span>
          Drug classification
          <DefinitionTooltip footnoteKey={'d'} />
        </span>
      ),
      Cell(tableProps: { original: PrecisionOncologyTherapy }): JSX.Element {
        return (
          <span>
            {tableProps.original.drugClassification}
            {'NA' === tableProps.original.drugClassification && (
              <DefinitionTooltip footnoteKey={'naDetectionMethod'} />
            )}
          </span>
        );
      },
      onFilter: (data: PrecisionOncologyTherapy, keyword) =>
        filterByKeyword(data.drugClassification, keyword),
    },
    {
      accessor: 'year',
      Header: (
        <span>
          Year of drug’s first FDA-approval
          <DefinitionTooltip footnoteKey={'a'} />
        </span>
      ),
      Cell(tableProps: { original: PrecisionOncologyTherapy }) {
        if (tableProps.original.year.endsWith('*')) {
          return (
            <span>
              {tableProps.original.year.slice(
                0,
                tableProps.original.year.length - 1
              )}
              <DefinitionTooltip footnoteKey={'*'} />
            </span>
          );
        } else {
          return tableProps.original.year;
        }
      },
      onFilter: (data: PrecisionOncologyTherapy, keyword) =>
        filterByKeyword(data.year, keyword),
    },
  ];

  return (
    <>
      <Row>
        <Col>
          <h2 className={'mb-3'}>FDA-Approved Precision Oncology Therapies</h2>
          <div>
            The following US Food and Drug Administration (FDA)-approved
            therapies are considered precision oncology therapies by {ONCOKB_TM}{' '}
            and are further classified as either first-in-class,
            mechanistically-distinct, follow-on, or resistance based on
            Suehnholz et al., Cancer Discovery 2023 (also refer to definitions
            below).
            <ShowHideText
              className={'my-2'}
              show={showDefinition}
              title={'definitions'}
              content={
                <ol type={'a'}>
                  <li>
                    <b>Precision oncology therapy</b>: A drug that is most
                    effective in a molecularly defined subset of patients and
                    for which pre-treatment molecular profiling is required for
                    optimal patient selection
                  </li>
                  <li>
                    <b>First-in-class precision oncology therapy</b>: A
                    precision oncology therapy targeting an alteration
                    previously classified as not actionable
                  </li>
                  <li>
                    <b>Mechanistically-distinct precision oncology therapy</b>:
                    A precision oncology therapy targeting a previously
                    actionable genomic alteration via a distinct
                    mechanisms-of-action, or with significantly different
                    selectivity versus older drugs
                  </li>
                  <li>
                    <b>Follow-on precision oncology therapy</b>: A precision
                    oncology therapy with a mechanism of action largely similar
                    to a previously FDA-approved first-in-class precision
                    oncology drug
                  </li>
                  <li>
                    <b>Resistance precision oncology therapy</b>: A precision
                    oncology therapy with a mechanism of action largely similar
                    to an FDA-approved first-in-class precision oncology drug,
                    but with an expanded mutation profile that targets mutations
                    that arise in the context of resistance to the
                    first-in-class drug
                  </li>
                </ol>
              }
              onClick={() => setShowDefinition(!showDefinition)}
            />
          </div>
        </Col>
      </Row>
      <Row
        style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
        className={'mb-2'}
      >
        <Col className={classnames(...COMPONENT_PADDING)} lg={2} md={6} xs={12}>
          <Input
            style={{ height: 38 }}
            placeholder={'Search Therapy'}
            value={therapySearch}
            onChange={event => setTherapySearch(event.target.value)}
          />
        </Col>
        <Col className={classnames(...COMPONENT_PADDING)} lg={2} md={6} xs={12}>
          <Input
            style={{ height: 38 }}
            placeholder={'Search Biomarker'}
            value={biomarkerSearch}
            onChange={event => setBiomarkerSearch(event.target.value)}
          />
        </Col>
        <Col className={classnames(...COMPONENT_PADDING)} lg={4} md={6} xs={12}>
          <Select
            placeholder={'Select Detection Method'}
            options={sortAndUniqByValue(poTxs, 'biomarkerDetection', [
              'or',
              ',',
            ])}
            isClearable={true}
            value={selectedDetectionMethods}
            isMulti
            closeMenuOnSelect={false}
            onChange={(selectedOptions: any[]) => {
              setSelectedDetectionMethods(selectedOptions || []);
            }}
          />
        </Col>
        <Col className={classnames(...COMPONENT_PADDING)} lg={4} md={6} xs={12}>
          <Select
            placeholder={'Select Drug Classification'}
            options={sortAndUniqByValue(poTxs, 'drugClassification')}
            isClearable={true}
            value={selectedDrugClassifications}
            isMulti
            closeMenuOnSelect={false}
            onChange={(selectedOptions: any[]) => {
              setSelectedDrugClassifications(selectedOptions || []);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col className={'d-flex justify-content-between align-items-center'}>
          <div>
            <b>
              Showing {_.uniq(filteredPoTxs.map(tx => tx.tx)).length} therapies
            </b>
            : (
            <WithSeparator separator={', '}>
              {[
                DRUG_CLASSIFICATION.FIRST_IN_CLASS,
                DRUG_CLASSIFICATION.MECHANISTICALLY_DISTINCT,
                DRUG_CLASSIFICATION.FOLLOW_ON,
                DRUG_CLASSIFICATION.RESISTANCE,
                DRUG_CLASSIFICATION.NA,
              ].map(classification => (
                <span key={classification}>
                  {drugClassificationStats[classification]
                    ? _.uniq(
                        drugClassificationStats[classification].map(
                          row => row.tx
                        )
                      ).length
                    : 0}{' '}
                  {classification}
                </span>
              ))}
            </WithSeparator>
            )
            {hasFilter ? (
              <Button
                variant="outline-primary"
                className={'ml-2'}
                style={{ whiteSpace: 'nowrap' }}
                onClick={clearFilters}
                size={'sm'}
              >
                <span className={'fa fa-times mr-1'}></span>
                Reset filters
              </Button>
            ) : undefined}
          </div>
          <DownloadButton className={'ml-2'} href={poTxsExcel} size={'sm'}>
            Download Table
          </DownloadButton>
        </Col>
      </Row>
      <Row>
        <Col className={'mt-2'}>
          <OncoKBTable
            className={'po-tx-table'}
            columns={columns}
            data={filteredPoTxs}
            pageSize={filteredPoTxs.length < 10 ? 10 : filteredPoTxs.length}
            disableSearch
            defaultSorted={[
              {
                id: 'year',
                desc: true,
              },
            ]}
            style={{
              height: LG_TABLE_FIXED_HEIGHT,
            }}
          />
        </Col>
      </Row>
    </>
  );
};
export default PrecisionOncologyTherapiesPage;
