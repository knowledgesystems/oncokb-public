import { observer } from 'mobx-react';
import React from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { ToggleValue } from './usage-analysis-utils';

type IUsageToggleGroupProps = {
  defaultValue: ToggleValue;
  toggleValues: ToggleValue[];
  handleToggle: (value: ToggleValue) => void;
};

export const UsageToggleGroup = observer((props: IUsageToggleGroupProps) => {
  const ToggleButtons: any[] = [];
  props.toggleValues.forEach(value => {
    ToggleButtons.push(
      <ToggleButton key={value.toString()} value={value}>
        {value}
      </ToggleButton>
    );
  });
  return (
    <ToggleButtonGroup
      className="ml-3"
      type="radio"
      name="toggle-options"
      defaultValue={props.defaultValue}
      onChange={props.handleToggle}
    >
      {ToggleButtons}
    </ToggleButtonGroup>
  );
});
