import React, { useState, ReactElement } from 'react';
import { TabProps } from './Tab';
import './styles.scss';
import Notifs from './../notifications/notifications';
import { NotificationImplication, PatientInfo } from './../../config/constants';
import { COLOR_BLUE } from './../../config/theme';
import { generatePDF } from './../Utils';
// import { responses } from 'app/oncokb-annotation-visualisation/config/APIResponse';

interface TabsProps {
  children: ReactElement<TabProps>[];
  defaultActiveKey: string;
  id?: string;
  className?: string;
  lastUpdate?: string;
  dataVersion?: string;
  notifications?: NotificationImplication[];
  bgColor?: string;
  patientInfo: PatientInfo;
  responseList: any;
}

const Tabs: React.FC<TabsProps> = ({
  children,
  defaultActiveKey,
  id,
  className,
  lastUpdate,
  dataVersion,
  notifications,
  bgColor,
  patientInfo,
  responseList,
}) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  const handleTabClick = (key: string) => {
    setActiveKey(key);
  };

  const handleDownloadClick = () => {
    try {
      const data = [
        {
          col1: 'Sample ID',
          col2: patientInfo.patientId,
          col3: 'Gender',
          col4: 'Male',
        },
        {
          col1: 'Age',
          col2: '48',
          col3: 'Date of Report',
          col4: lastUpdate,
        },
      ];

      const processedData = responseList.map(response => ({
        gene: response.query.hugoSymbol || 'NA',
        mutation: response.query.alteration || 'NA',
        oncogenicity: response.oncogenic || 'NA',
        levelOfEvidence: response.highestSensitiveLevel || 'NA',
        biologicalEffect: response.mutationEffect.knownEffect || 'NA',
        tumorType: response.query.tumorType || 'NA',
        alterationType: response.query.alterationType || 'NA',
      }));
      const processedTreatmentData = responseList.map(response => ({
        biomarker:
          response['query']['hugoSymbol'] && response['query']['alteration']
            ? `${response['query']['hugoSymbol']} ${response['query']['alteration']}`
            : 'NA',
        drugNames: response['treatments']
          ? response['treatments'][0]['drugs']
              .map(
                (drug: any) =>
                  ` ${drug['drugName']} (${
                    response['treatments'][0]['level'].length > 6
                      ? response['treatments'][0]['level'].slice(6)
                      : 'NA'
                  })`
              )
              .filter(Boolean)
          : ['NA'],
        annotation:
          response['geneSummary'] ||
          response['variantSummary'] ||
          response['tumorTypeSummary']
            ? `${response['geneSummary'] || ''} ${
                response['variantSummary'] || ''
              } ${response['tumorTypeSummary'] || ''}`
            : 'NA',
        alterationType: response.query.alterationType || 'NA',
        level: response['treatments']
          ? response['treatments'][0]['level']
          : 'NA',
      }));

      const treatmentsMap = new Map();

      processedTreatmentData.forEach(response => {
        const biomarkerKey = `${response.biomarker}-${response.level}`;

        if (treatmentsMap.has(biomarkerKey)) {
          const existingEntry = treatmentsMap.get(biomarkerKey);
          if (existingEntry) {
            const existingDrugs = new Set(existingEntry.drugNames.split(', '));
            response.drugNames.forEach(drug => existingDrugs.add(drug));
            existingEntry.drugNames = Array.from(existingDrugs).join(', ');
          }
        } else {
          treatmentsMap.set(biomarkerKey, {
            biomarker: response.biomarker,
            drugNames: Array.from(new Set(response.drugNames)).join(', '),
            annotation: response.annotation,
            alterationType: response.alterationType,
            level: response.level,
          });
        }
      });
      generatePDF(data, processedData, processedTreatmentData);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div id={id} className={`oncokb-tabs-container ${className || ''}`}>
      <div className="oncokb-tab-headers">
        <div className="oncokb-tab-header-left">
          {React.Children.map(children, child => (
            <div
              className={`header-left-child ${
                child.props.eventKey === activeKey ? 'active' : ''
              }`}
              onClick={() => handleTabClick(child.props.eventKey)}
              style={{ backgroundColor: bgColor, color: 'black' }}
            >
              {child.props.title}
            </div>
          ))}
        </div>
        <div className="oncokb-tab-header-right">
          <div className="data-info">
            <div>Annotation based on {dataVersion || 'NA'}</div>
            <div>Updated on {lastUpdate || 'NA'}</div>
          </div>
          <div
            className="oncokb-download-button"
            data-testid="oncokb-download-button"
            onClick={handleDownloadClick} // Add click handler
            style={{ color: COLOR_BLUE, cursor: 'pointer' }}
          >
            <i className="fa fa-download" aria-hidden="true"></i>
          </div>
          <div>
            <Notifs notifications={notifications || []} />
          </div>
        </div>
      </div>
      <div className="oncokb-tab-content">
        {React.Children.map(children, child =>
          child.props.eventKey === activeKey ? child.props.children : null
        )}
      </div>
    </div>
  );
};

export default Tabs;
