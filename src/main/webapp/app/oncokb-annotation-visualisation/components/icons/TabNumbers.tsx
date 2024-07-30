import React from 'react';
import { COLOR_BLACK, COLOR_LIGHT_GREY } from './../../config/theme';
import { reduce } from 'lodash';

export interface TabNumbersProps {
  number: number;
  title: string;
}

class TabNumbers extends React.Component<TabNumbersProps> {
  getWidth = (num: number) => {
    if (num < 100) {
      return '1.2rem';
    } else if (num >= 100 && num < 1000) {
      return '1.5rem';
    } else {
      return '2rem';
    }
  };

  render() {
    const alterationCountStyle = {
      width: this.getWidth(this.props.number),
      lineHeight: '1.2rem',
      borderRadius: '50%',
      backgroundColor: COLOR_LIGHT_GREY,
      color: COLOR_BLACK,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '10px',
      overflow: 'hidden',
      fontSize: 'calc(0.5vw)',
    };

    return (
      <div
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <h6 style={{ margin: 0 }}>{this.props.title}</h6>
        <div style={alterationCountStyle}>
          <span>{this.props.number}</span>
        </div>
      </div>
    );
  }
}

export default TabNumbers;
