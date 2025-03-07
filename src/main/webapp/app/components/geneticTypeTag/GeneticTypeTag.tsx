import React, { FunctionComponent } from 'react';
import { GENETIC_TYPE } from 'app/components/geneticTypeTabs/GeneticTypeTabs';
import classnames from 'classnames';
import styles from './genetic-type-tag.module.scss';
import { capitalize } from 'cbioportal-frontend-commons';

const GeneticTypeTag: FunctionComponent<{
  isGermline: boolean;
  className?: string;
}> = props => {
  return (
    <span
      className={classnames(
        props.className,
        props.isGermline ? styles.germlineTag : styles.somaticTag
      )}
    >
      {capitalize(
        props.isGermline ? GENETIC_TYPE.GERMLINE : GENETIC_TYPE.SOMATIC
      )}
    </span>
  );
};

export default GeneticTypeTag;
