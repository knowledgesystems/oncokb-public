import React from 'react';
import ShowHideToggleIcon from '../icons/ShowHideToggleIcon';
import { COLOR_GREY, COLOR_PRIMARY } from 'app/config/theme';

const ShowHideText: React.FunctionComponent<{
  show: boolean;
  content: string | JSX.Element;
  title: string | JSX.Element;
  onClick: () => void;
  className?: string;
}> = props => {
  return (
    <div className={props.className}>
      <div
        style={{
          cursor: 'pointer',
          color: COLOR_PRIMARY,
          marginBottom: '0.5rem',
        }}
        onClick={() => props.onClick()}
      >
        <span>{`${props.show ? 'Hide' : 'Show'} ${props.title}`}</span>{' '}
        <ShowHideToggleIcon show={props.show} onToggle={() => {}} />
      </div>
      {props.show ? props.content : undefined}
    </div>
  );
};

export default ShowHideText;
