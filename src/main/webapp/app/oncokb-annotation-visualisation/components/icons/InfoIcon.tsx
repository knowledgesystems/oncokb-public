import React from 'react';
// @ts-ignore
import { RCTooltip } from 'rc-tooltip';
import { DefaultTooltip } from 'cbioportal-frontend-commons';
type IconType = 'info' | 'question' | 'description';
const InfoIcon: React.FunctionComponent<{
  overlay?:
    | (() => React.ReactChild)
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal;
  overlayClassName?: string;
  placement?: RCTooltip.Placement;
  style?: React.CSSProperties;
  type?: IconType;
  className?: string;
}> = props => {
  function getIcon() {
    const style = {
      ...props.style,
    };
    switch (props.type) {
      case 'question':
        return (
          <i
            className={`fa fa-question-circle-o ${props.className}`}
            style={style}
          ></i>
        );
      case 'description':
        return <i className={`fa ${props.className}`} style={style}></i>;
      case 'info':
      default:
        return (
          <span
            className={`fa-stack ${props.className}`}
            style={{
              fontSize: '0.5rem',
              ...style,
            }}
          >
            <i className="fa fa-circle-thin fa-stack-2x"></i>
            <i className="fa fa-info fa-stack-1x"></i>
          </span>
        );
        break;
    }
  }

  return (
    <DefaultTooltip
      overlay={props.overlay ? props.overlay : <span></span>}
      overlayClassName={props.overlayClassName}
      placement={props.placement}
      disabled={props.overlay ? false : true}
    >
      {getIcon()}
    </DefaultTooltip>
  );
};
export default InfoIcon;
