// @ts-ignore
import AppStore from 'app/store/AppStore';
import { inject } from 'mobx-react';
import React from 'react';
import { DefaultTooltip } from 'cbioportal-frontend-commons';
import { InfoLevel } from '../../config/constants';
import _ from 'lodash';
import { level2LevelOfEvidence } from '../Utils';
import ReactHtmlParser from 'react-html-parser';
import { LEVELS } from '../../config/constants';

export const LevelWithDescription: React.FunctionComponent<{
  level: LEVELS;
  appStore?: AppStore;
  description?: string;
  children?: React.ReactNode;
}> = inject('appStore')(props => {
  const levelOfEvidence = level2LevelOfEvidence(props.level);

  function getLevelDescription() {
    if (props.description) {
      return <span>{props.description}</span>;
    }
    const match: InfoLevel | undefined = _.find(
      props.appStore!.appInfo.result.levels,
      (level: InfoLevel) => level.levelOfEvidence === levelOfEvidence
    );
    return match ? (
      <div style={{ maxWidth: 300 }}>
        {ReactHtmlParser(match.htmlDescription)}
      </div>
    ) : (
      ''
    );
  }

  return (
    <DefaultTooltip overlay={getLevelDescription()}>
      <span>{props.children}</span>
    </DefaultTooltip>
  );
});
